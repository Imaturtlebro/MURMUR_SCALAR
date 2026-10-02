import { system, world } from "@minecraft/server";
import { reassembleChunks } from "./utils.js";
import { isFarmAnimal, isAnimalCoreActive } from "./animal_priority.js";
import { validateProfile, validateTree, summarize } from "./contracts.js";

// Initialize comprehensive global data structures
if (!globalThis.MURMUR_DATA) {
    globalThis.MURMUR_DATA = {
        DIALOGUE: {},
        NAMES: {},
        FACTIONS: {},
        ROASTS: {},
        PLACEHOLDERS: {},
        TRANSLATIONS: {},
        TREES: {}
    };
}

/**
 * Recursively trims object keys. Content packs occasionally emit keys with
 * stray trailing whitespace (e.g. "minecraft:villager_v2 ") which would never
 * match a real entity typeId, silently disabling all of their dialogue.
 * Normalizing here, once, makes the whole registry robust.
 */
function trimKeys(obj) {
    if (!obj || typeof obj !== "object" || Array.isArray(obj)) return obj;
    const out = {};
    for (const [k, v] of Object.entries(obj)) {
        out[String(k).trim()] = trimKeys(v);
    }
    return out;
}

// Contract issues are reported ONCE per (pack, typeId, message) per session.
// A pack re-sends its entire payload on every `murmur:resend`, and CORE sweeps
// stalled assemblies on a timer, so an un-deduped validator would reprint the
// same 200 warnings every few seconds and bury the log.
const _reportedContractIssues = new Set();
const _contractIssueTotals = { errors: 0, warnings: 0, profiles: 0, trees: 0 };

function reportContractIssues(scope, result) {
    _contractIssueTotals.profiles++;
    let printed = 0;
    for (const issue of [...result.errors, ...result.warnings]) {
        if (issue.severity === "error") _contractIssueTotals.errors++;
        else _contractIssueTotals.warnings++;
        const key = `${scope}::${issue.message}`;
        if (_reportedContractIssues.has(key)) continue;
        _reportedContractIssues.add(key);
        printed++;
        if (printed <= 12) {
            const tag = issue.severity === "error" ? "§c[CONTRACT ERROR]" : "§e[CONTRACT]";
            console.warn(`${tag} §7${issue.message}`);
        }
    }
    if (printed > 12) {
        console.warn(`§e[CONTRACT] §7${printed} more issue(s) for ${scope} suppressed this run.`);
    }
    // The summary line is deduped on the same key set. Packs re-send everything
    // on every `murmur:resend`, so an un-deduped summary would still reprint once
    // per re-registration even when nothing new was found.
    const summary = summarize(scope, result);
    if (summary && !_reportedContractIssues.has(`${scope}::SUMMARY`)) {
        _reportedContractIssues.add(`${scope}::SUMMARY`);
        console.warn(`§e[CONTRACT] §7${summary}`);
    }
    return result;
}

/** Read-only snapshot for /scriptevent murmur:diag. */
export function getContractReport() {
    return {
        ..._contractIssueTotals,
        uniqueIssues: _reportedContractIssues.size
    };
}

/**
 * Core API to merge cross-pack data payloads safely.
 */
export const MurmurAPI = {
    registerContent: (data) => {
        let { typeId, names, dialogue, factions, roasts, placeholders, translations, trees } = data;
        if (typeId) typeId = String(typeId).trim();
        const packLabel = String(data.packId || "?").trim() || "?";

        // Validate BEFORE merging. Non-blocking by design: a contract breach is
        // reported, never rejected — a typo must not cost a mob its voice.
        if (typeId) {
            try {
                reportContractIssues(
                    `${packLabel}/${typeId}`,
                    validateProfile(packLabel, typeId, { names, dialogue, factions, placeholders })
                );
            } catch (e) {
                console.warn(`[MURMUR CORE] contract validator threw (ignored): ${e}`);
            }
        }

        if (typeId) {
            if (names) {
                // Support both legacy arrays and new localized name objects
                if (Array.isArray(names)) {
                    globalThis.MURMUR_DATA.NAMES[typeId] = [
                        ...new Set([...(globalThis.MURMUR_DATA.NAMES[typeId] || []), ...names])
                    ];
                } else if (typeof names === "object") {
                    if (!globalThis.MURMUR_DATA.NAMES[typeId]) {
                        globalThis.MURMUR_DATA.NAMES[typeId] = {};
                    }
                    for (const [lang, langNames] of Object.entries(names)) {
                        globalThis.MURMUR_DATA.NAMES[typeId][lang] = [
                            ...new Set([...(globalThis.MURMUR_DATA.NAMES[typeId][lang] || []), ...langNames])
                        ];
                    }
                }
            }
            if (dialogue) {
                // Normalize stray whitespace in condition / sub-keys (see trimKeys)
                dialogue = trimKeys(dialogue);
                // Perform a deep merge on situational dialogue categories
                if (!globalThis.MURMUR_DATA.DIALOGUE[typeId]) {
                    globalThis.MURMUR_DATA.DIALOGUE[typeId] = {};
                }
                for (const [condition, lines] of Object.entries(dialogue)) {
                    // Support both legacy flat arrays and new localized objects
                    if (Array.isArray(lines)) {
                        // Flat legacy array
                        globalThis.MURMUR_DATA.DIALOGUE[typeId][condition] = [
                            ...new Set([...(globalThis.MURMUR_DATA.DIALOGUE[typeId][condition] || []), ...lines])
                        ];
                    } else if (typeof lines === "object" && lines !== null) {
                        // Could be { "en_US": [...], "es_ES": [...] } OR { "minecraft:wheat": [...] }
                        const firstVal = Object.values(lines)[0];
                        if (Array.isArray(firstVal)) {
                            // It's a localized map: { lang: [lines] } OR a sub-keyed map: { itemId: [lines] }
                            // Distinguish: lang codes are like "en_US", item ids have colons or are long
                            const firstKey = Object.keys(lines)[0];
                            const isLangMap = firstKey.includes("_") && firstKey.length <= 6 && !firstKey.includes(":");
                            if (isLangMap) {
                                // Localized: { "en_US": [...], "es_ES": [...] }
                                if (!globalThis.MURMUR_DATA.DIALOGUE[typeId][condition]) {
                                    globalThis.MURMUR_DATA.DIALOGUE[typeId][condition] = {};
                                }
                                for (const [lang, langLines] of Object.entries(lines)) {
                                    if (!Array.isArray(langLines)) continue;
                                    globalThis.MURMUR_DATA.DIALOGUE[typeId][condition][lang] = [
                                        ...new Set([...(globalThis.MURMUR_DATA.DIALOGUE[typeId][condition][lang] || []), ...langLines])
                                    ];
                                }
                            } else {
                                // Sub-keyed object like inventory/seen_animal: { "minecraft:wheat": [...] }
                                if (!globalThis.MURMUR_DATA.DIALOGUE[typeId][condition]) {
                                    globalThis.MURMUR_DATA.DIALOGUE[typeId][condition] = {};
                                }
                                for (const [subKey, subLines] of Object.entries(lines)) {
                                    if (!Array.isArray(subLines)) continue;
                                    globalThis.MURMUR_DATA.DIALOGUE[typeId][condition][subKey] = [
                                        ...new Set([...(globalThis.MURMUR_DATA.DIALOGUE[typeId][condition][subKey] || []), ...subLines])
                                    ];
                                }
                            }
                        } else if (typeof firstVal === "object" && firstVal !== null) {
                            // Nested localized sub-keyed: { "en_US": { "minecraft:wheat": [...] }, "es_ES": { ... } }
                            if (!globalThis.MURMUR_DATA.DIALOGUE[typeId][condition]) {
                                globalThis.MURMUR_DATA.DIALOGUE[typeId][condition] = {};
                            }
                            for (const [lang, subMap] of Object.entries(lines)) {
                                if (typeof subMap !== "object" || subMap === null) continue;
                                if (!globalThis.MURMUR_DATA.DIALOGUE[typeId][condition][lang]) {
                                    globalThis.MURMUR_DATA.DIALOGUE[typeId][condition][lang] = {};
                                }
                                for (const [subKey, subLines] of Object.entries(subMap)) {
                                    if (!Array.isArray(subLines)) continue;
                                    globalThis.MURMUR_DATA.DIALOGUE[typeId][condition][lang][subKey] = [
                                        ...new Set([...(globalThis.MURMUR_DATA.DIALOGUE[typeId][condition][lang][subKey] || []), ...subLines])
                                    ];
                                }
                            }
                        }
                    }
                }
            }
            if (trees) {
                trees = trimKeys(trees);
                MurmurAPI.registerTree(data.packId, typeId, trees);
            }
            if (isFarmAnimal(typeId)) {
                console.log(`[MURMUR CORE] Registered farm-animal profile for ${typeId} (yields to ANIMAL CORE while it is installed${isAnimalCoreActive() ? " — currently shadowed" : ""}).`);
            } else {
                console.log(`[MURMUR CORE] Registered content profile for ${typeId}`);
            }
        }

        // Global context merges for translations and other metadata
        if (translations) {
            for (const [lang, strings] of Object.entries(translations)) {
                if (!globalThis.MURMUR_DATA.TRANSLATIONS[lang]) {
                    globalThis.MURMUR_DATA.TRANSLATIONS[lang] = {};
                }
                Object.assign(globalThis.MURMUR_DATA.TRANSLATIONS[lang], strings);
            }
            console.log(`[MURMUR CORE] Registered translations for ${Object.keys(translations).join(", ")}`);
        }
        if (factions) {
            for (const [factionId, members] of Object.entries(factions)) {
                globalThis.MURMUR_DATA.FACTIONS[factionId] = [
                    ...new Set([...(globalThis.MURMUR_DATA.FACTIONS[factionId] || []), ...members])
                ];
            }
        }
        if (roasts) {
            Object.assign(globalThis.MURMUR_DATA.ROASTS, roasts);
        }
        if (placeholders) {
            for (const [token, entries] of Object.entries(placeholders)) {
                globalThis.MURMUR_DATA.PLACEHOLDERS[token] = [
                    ...new Set([...(globalThis.MURMUR_DATA.PLACEHOLDERS[token] || []), ...entries])
                ];
            }
        }
    },

    /**
     * Registers (or merges) an interactive branching dialogue tree.
     * Trees are namespaced by `${packId}::${typeId}` so two content packs can
     * both register trees for the same entity type without their node keys
     * (e.g. "start", "greeting") clobbering one another. A legacy plain typeId
     * key is still supported when packId is omitted.
     * A tree is: { start: "nodeId", nodes: { nodeId: { text, end?, choices: [{ label, goto, action? }] } } }
     */
    registerTree: (packId, typeId, tree) => {
        typeId = String(typeId || "").trim();
        if (!typeId || !tree || !tree.nodes) return;
        const label = String(packId || "?").trim() || "?";
        try {
            _contractIssueTotals.trees++;
            reportContractIssues(`${label}/${typeId} tree`, validateTree(label, typeId, tree));
        } catch (e) {
            console.warn(`[MURMUR CORE] tree contract validator threw (ignored): ${e}`);
        }
        const key = (packId ? `${String(packId).trim()}::${typeId}` : typeId);
        if (!globalThis.MURMUR_DATA.TREES[key]) {
            globalThis.MURMUR_DATA.TREES[key] = { start: tree.start, nodes: {} };
        }
        const existing = globalThis.MURMUR_DATA.TREES[key];
        if (tree.start) existing.start = tree.start;
        Object.assign(existing.nodes, tree.nodes);
        console.log(`[MURMUR CORE] Registered dialogue tree for ${key}`);
    }
};

globalThis.MurmurAPI = MurmurAPI;

// --- CHUNKED DATA BRIDGE ---
const CHUNK_BUFFER = {};
const CHUNK_AGE = {};      // bufferKey -> system tick last touched
const CHUNK_RETRY = {};    // bufferKey -> how many resend requests we've issued
const CHUNK_TIMEOUT = 400; // ticks (~8s) before we request a resend
const CHUNK_MAX_RETRY = 8; // give up after this many failed resend rounds
globalThis.__MURMUR_CHUNK_BUFFER__ = CHUNK_BUFFER; // exposed for /scriptevent murmur:diag

// Feed the sender pack one chunk assembly that's stalled. This is the heartbeat
// of reliable registration: CORE asks the pack to re-send exactly the typeId it
// never finished assembling, the pack re-queues it, and they converge. Without
// this, a single dropped command would leave a profile (villager/pillager/golem)
// permanently half-registered — the "no name / no talk / no tree" symptom.
function requestResend(packId, typeId) {
    try {
        if (!packId || !typeId) return;
        const overworld = world.getDimension("overworld");
        overworld.runCommand(`scriptevent murmur:resend ${packId}|${typeId}`);
    } catch (e) { }
}

// Sweep for abandoned chunk assemblies. Instead of silently dropping them we ask
// the sender to re-queue the missing profile, so it can never stay half-built.
system.runInterval(() => {
    try {
        const now = system.currentTick;
        for (const key of Object.keys(CHUNK_BUFFER)) {
            if (now - (CHUNK_AGE[key] || now) > CHUNK_TIMEOUT) {
                const arr = CHUNK_BUFFER[key] || [];
                const got = arr.filter(c => c !== null).length;
                const total = arr.length;
                const hashIdx = key.indexOf(":");
                const packId = hashIdx > 0 ? key.slice(0, hashIdx) : key;
                const typeId = hashIdx > 0 ? key.slice(hashIdx + 1) : key;

                const retries = (CHUNK_RETRY[key] || 0);
                if (retries < CHUNK_MAX_RETRY) {
                    // Ask the pack to re-send; keep the buffer so the next pieces
                    // land in place, and reset the clock to give it time to do so.
                    const missing = [];
                    for (let i = 0; i < arr.length; i++) if (arr[i] === null) missing.push(i);
                    console.warn(`[MURMUR CORE] CHUNK TIMEOUT: "${key}" ${got}/${total}; missing idx [${missing.join(",")}]; requesting resend (${retries + 1}/${CHUNK_MAX_RETRY}).`);
                    requestResend(packId, typeId);
                    CHUNK_RETRY[key] = retries + 1;
                    CHUNK_AGE[key] = now;
                } else {
                    console.warn(`[MURMUR CORE] CHUNK GIVE UP: "${key}" still ${got}/${total} after retries. Removing.`);
                    delete CHUNK_BUFFER[key];
                    delete CHUNK_AGE[key];
                    delete CHUNK_RETRY[key];
                }
            }
        }
    } catch (e) { }
}, 40);

system.afterEvents.scriptEventReceive.subscribe((event) => {
    if (event.id === "murmur:data") {
        try {
            // Split by pipes - be careful of pipe characters inside data
            const parts = event.message.split("|");
            if (parts.length < 5) return;

            const packId = parts[0];
            const typeId = parts[1];
            const chunkIdx = parseInt(parts[2]);
            const total = parseInt(parts[3]);
            const dataChunk = parts.slice(4).join("|"); // Rejoin if data had pipes

            // Out-of-range indices would silently bloat the buffer and make the
            // `every()` completeness check never pass — a guaranteed lockup. Drop them.
            if (!(total > 0) || !(chunkIdx >= 0 && chunkIdx < total)) return;

            const bufferKey = `${packId}:${typeId}`;
            if (!CHUNK_BUFFER[bufferKey]) {
                CHUNK_BUFFER[bufferKey] = new Array(total).fill(null);
            }
            CHUNK_AGE[bufferKey] = system.currentTick;

            CHUNK_BUFFER[bufferKey][chunkIdx] = dataChunk;

            if (CHUNK_BUFFER[bufferKey].every(c => c !== null)) {
                const pieces = CHUNK_BUFFER[bufferKey];
                const fullData = reassembleChunks(pieces);
                delete CHUNK_BUFFER[bufferKey];
                delete CHUNK_AGE[bufferKey];

                if (!fullData) {
                    world.sendMessage(`§c[MURMUR CORE] Reassembly failed (bad payload): ${packId} -> ${typeId}`);
                    return;
                }

                MurmurAPI.registerContent({
                    packId: packId,
                    typeId: typeId,
                    names: fullData.names,
                    dialogue: fullData.dialogue,
                    factions: fullData.factions,
                    roasts: fullData.roasts,
                    placeholders: fullData.placeholders,
                    translations: fullData.translations
                });
                world.sendMessage(`§a[MURMUR CORE] Registration complete: ${packId} -> ${typeId}`);
            }
        } catch (e) {
            world.sendMessage(`§c[MURMUR CORE] Reassembly ERROR: ${e}`);
        }
    }
});

// Manual / operator fallback: "/scriptevent murmur:resend" re-requests every
// stalled assembly (and lowers their retry counter so the sweep keeps trying).
// Combines with the automatic sweep requests to guarantee convergence.
system.afterEvents.scriptEventReceive.subscribe((event) => {
    if (event.id !== "murmur:resend") return;
    const want = (event.message || "").trim();
    let count = 0;
    for (const key of Object.keys(CHUNK_BUFFER)) {
        const hashIdx = key.indexOf(":");
        const packId = hashIdx > 0 ? key.slice(0, hashIdx) : key;
        const typeId = hashIdx > 0 ? key.slice(hashIdx + 1) : key;
        if (want && want !== "*" && want !== typeId) continue;
        CHUNK_RETRY[key] = 0;
        requestResend(packId, typeId);
        CHUNK_AGE[key] = system.currentTick;
        count++;
    }
    if (count > 0) {
        const caster = event.sourceEntity;
        const send = (m) => { if (caster && caster.isValid()) caster.sendMessage(m); else world.sendMessage(m); };
        send(`§a[MURMUR CORE] Re-requested ${count} pending profile(s).`);
    }
});


console.log("[MURMUR CORE] API Framework Operational.");