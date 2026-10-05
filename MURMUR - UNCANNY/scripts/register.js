import { system, world } from "@minecraft/server";
import {
    VILLAGER_NAMES, PILLAGER_NAMES, PIGLIN_NAMES, WITCH_NAMES, MONSTER_NAMES,
    GOLEM_NAMES, TRADER_NAMES, SKELETON_NAMES, DIALOGUE, TREES
} from "./dialogue.js";
import {
    DIALOGUE_ES, VILLAGER_NAMES_ES, PILLAGER_NAMES_ES,
    GOLEM_NAMES_ES, WITHER_NAMES_ES, PIGLIN_NAMES_ES
} from "./dialogue_es.js";
import {
    DIALOGUE_PT, VILLAGER_NAMES_PT, PILLAGER_NAMES_PT,
    GOLEM_NAMES_PT, WITHER_NAMES_PT, PIGLIN_NAMES_PT
} from "./dialogue_pt.js";

const PACK_ID = "uncanny";
const CHUNK_SIZE = 1000;

const B64C = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
function b64encode(input) {
    const bytes = [];
    for (let i = 0; i < input.length; i++) {
        let c = input.charCodeAt(i);
        if (c < 0x80) bytes.push(c);
        else if (c < 0x800) { bytes.push(0xc0 | (c >> 6), 0x80 | (c & 0x3f)); }
        else if (c >= 0xd800 && c <= 0xdbff) {
            const hi = c, lo = input.charCodeAt(++i);
            const cp = ((hi - 0xd800) << 10) + (lo - 0xdc00) + 0x10000;
            bytes.push(0xf0 | (cp >> 18), 0x80 | ((cp >> 12) & 0x3f), 0x80 | ((cp >> 6) & 0x3f), 0x80 | (cp & 0x3f));
        } else { bytes.push(0xe0 | (c >> 12), 0x80 | ((c >> 6) & 0x3f), 0x80 | (c & 0x3f)); }
    }
    let out = "";
    for (let i = 0; i < bytes.length; i += 3) {
        const b0 = bytes[i], b1 = bytes[i + 1], b2 = bytes[i + 2];
        out += B64C[b0 >> 2];
        out += B64C[((b0 & 3) << 4) | (b1 >> 4)];
        out += (b1 !== undefined) ? B64C[((b1 & 15) << 2) | (b2 >> 6)] : "=";
        out += (b2 !== undefined) ? B64C[b2 & 63] : "=";
    }
    return out;
}

function sendRegistration() {
    world.sendMessage(`§8[MURMUR UNCANNY] Starting registration...`);

    const NAME_MAP = {
        "minecraft:villager_v2": VILLAGER_NAMES,
        "minecraft:villager": VILLAGER_NAMES,
        "minecraft:piglin": PIGLIN_NAMES,
        "minecraft:piglin_brute": PIGLIN_NAMES,
        "minecraft:pillager": PILLAGER_NAMES,
        "minecraft:pillager_captain": PILLAGER_NAMES,
        "minecraft:vindicator": PILLAGER_NAMES,
        "minecraft:evoker": PILLAGER_NAMES,
        "minecraft:witch": WITCH_NAMES,
        "minecraft:blaze": MONSTER_NAMES,
        "minecraft:enderman": MONSTER_NAMES,
        "minecraft:iron_golem": GOLEM_NAMES,
        "minecraft:wandering_trader": TRADER_NAMES,
        "minecraft:skeleton": SKELETON_NAMES
    };

    const NAME_MAP_ES = {
        "minecraft:villager_v2": VILLAGER_NAMES_ES,
        "minecraft:villager": VILLAGER_NAMES_ES,
        "minecraft:pillager": PILLAGER_NAMES_ES,
        "minecraft:pillager_captain": PILLAGER_NAMES_ES,
        "minecraft:vindicator": PILLAGER_NAMES_ES,
        "minecraft:evoker": PILLAGER_NAMES_ES,
        "minecraft:iron_golem": GOLEM_NAMES_ES,
        "minecraft:wither_skeleton": WITHER_NAMES_ES,
        "minecraft:skeleton": WITHER_NAMES_ES, // Shared for now
        "minecraft:piglin": PIGLIN_NAMES_ES,
        "minecraft:piglin_brute": PIGLIN_NAMES_ES
    };

    const NAME_MAP_PT = {
        "minecraft:villager_v2": VILLAGER_NAMES_PT,
        "minecraft:villager": VILLAGER_NAMES_PT,
        "minecraft:pillager": PILLAGER_NAMES_PT,
        "minecraft:pillager_captain": PILLAGER_NAMES_PT,
        "minecraft:vindicator": PILLAGER_NAMES_PT,
        "minecraft:evoker": PILLAGER_NAMES_PT,
        "minecraft:iron_golem": GOLEM_NAMES_PT,
        "minecraft:wither_skeleton": WITHER_NAMES_PT,
        "minecraft:skeleton": WITHER_NAMES_PT, // Shared for now
        "minecraft:piglin": PIGLIN_NAMES_PT,
        "minecraft:piglin_brute": PIGLIN_NAMES_PT
    };

    const overworld = world.getDimension("overworld");

    // Faction groups: which typeIds treat each other as the same "kind" for the
    // witness/mourning engine. Registered in CORE so a death is mourned by the
    // deceased's own faction (including sub-variants) but never by a rival.
    const FACTIONS = {
        "villager": ["minecraft:villager_v2", "minecraft:villager"],
        "illager": ["minecraft:pillager", "minecraft:pillager_captain", "minecraft:vindicator", "minecraft:evoker", "minecraft:ravager"],
        "piglin": ["minecraft:piglin", "minecraft:piglin_brute"],
        "witch": ["minecraft:witch"],
        "enderman": ["minecraft:enderman"],
        "skeleton": ["minecraft:skeleton", "minecraft:stray", "minecraft:bogged"],
        "wither": ["minecraft:wither_skeleton", "minecraft:wither"],
        "blaze": ["minecraft:blaze"],
        "golem": ["minecraft:iron_golem"]
    };

    try {
        for (const [rawId, pool] of Object.entries(DIALOGUE)) {
            // Dialogue keys carry an accidental trailing space (e.g. "minecraft:villager_v2 ").
            // Trim it so NAME_MAP lookup + the chunk-header typeId are clean; otherwise the
            // villager would silently fall back to MONSTER_NAMES and the header would register
            // under a "typeId with space".
            const typeId = String(rawId).trim();

            // 1. Build a combined language object for every event condition
            const multiLangDialogue = {};
            for (const [condition, lines] of Object.entries(pool)) {
                multiLangDialogue[condition] = {
                    "en_US": lines
                };
                // Only add Spanish if we actually have a translation for this mob and condition
                if (DIALOGUE_ES[typeId]?.[condition]) {
                    multiLangDialogue[condition]["es_ES"] = DIALOGUE_ES[typeId][condition];
                }
                if (DIALOGUE_PT[typeId]?.[condition]) {
                    multiLangDialogue[condition]["pt_BR"] = DIALOGUE_PT[typeId][condition];
                }
            }

            // 2. Build a combined language object for name pools
            const multiLangNames = {
                "en_US": NAME_MAP[typeId] || MONSTER_NAMES
            };
            if (NAME_MAP_ES[typeId]) {
                multiLangNames["es_ES"] = NAME_MAP_ES[typeId];
            }
            if (NAME_MAP_PT[typeId]) {
                multiLangNames["pt_BR"] = NAME_MAP_PT[typeId];
            }


            const data = JSON.stringify({
                names: multiLangNames,
                dialogue: multiLangDialogue,
                factions: FACTIONS
            });

            queueChunks("murmur:data", typeId, data);
        }
        world.sendMessage(`§8[MURMUR UNCANNY] ${Object.keys(DIALOGUE).length} profiles queued.`);
    } catch (e) {
        world.sendMessage(`§c[MURMUR UNCANNY] Registration CRASHED: ${e}`);
    }
}

// --- QUEUED / THROTTLED SENDER ---------------------------------------------
// Fire all `scriptevent` commands over a series of ticks instead of dumping the
// whole payload in one frame. Bedrock can drop commands when many are issued in
// a single tick (that showed up as some profiles — villager/witch/trader —
// never finishing their multi-chunk assembly in CORE). Throttling makes the
// registration reliable. PER_TICK=3 is conservative enough that Bedrock never drops
// commands, and the ACK-based resend loop in CORE handles any rare losses.

const SEND_QUEUE = [];
const PER_TICK = 3;       // conservative: Bedrock drops scriptevents when too many fire per tick
let queueGateway = false;
let sendInterval = null;   // live handle so the gateway can be cancelled when the queue drains

// Builds one entry in the queue: a fully-formed scriptevent command in CORE's
// chunk protocol:  scriptevent murmur:<event> <packId>|<typeId>|<idx>|<total>|<payload>
function queueChunks(eventId, typeId, jsonData) {
    const total = Math.ceil(jsonData.length / CHUNK_SIZE);
    for (let i = 0; i < jsonData.length; i += CHUNK_SIZE) {
        const payload = b64encode(jsonData.slice(i, i + CHUNK_SIZE));
        const idx = Math.floor(i / CHUNK_SIZE);
        SEND_QUEUE.push(`scriptevent ${eventId} ${PACK_ID}|${typeId}|${idx}|${total}|${payload}`);
    }
}

function clearSendInterval() {
    if (sendInterval !== null) {
        try { system.clearRunInterval(sendInterval); } catch (e) { }
        sendInterval = null;
    }
}

function sendStep() {
    if (SEND_QUEUE.length === 0) { queueGateway = false; clearSendInterval(); return; }
    let sent = 0;
    while (SEND_QUEUE.length > 0 && sent < PER_TICK) {
        const entry = SEND_QUEUE.shift();
        try {
            const overworld = world.getDimension("overworld");
            overworld.runCommand(entry);
        } catch (e) { console.warn("[MURMUR UNCANNY] send failed: " + e); }
        sent++;
    }
}

function startSend() {
    if (queueGateway) return;
    queueGateway = true;
    sendInterval = system.runInterval(() => sendStep(), 1);
}

// --- TREE SENDER ---------------------------------------------
function sendTrees() {
    if (!TREES || Object.keys(TREES).length === 0) return;
    world.sendMessage(`§8[MURMUR UNCANNY] Sending ${Object.keys(TREES).length} dialogue trees...`);
    try {
        for (const [rawId, tree] of Object.entries(TREES)) {
            const typeId = String(rawId).trim();
            queueChunks("murmur:tree", typeId, JSON.stringify(tree));
        }
    } catch (e) {
        world.sendMessage(`§c[MURMUR UNCANNY] Tree registration CRASHED: ${e}`);
    }
}

// Initial registration kickoff: send data profiles, then trees, then start the throttled sender.
// Registration is idempotent — re-running is safe and will merge/overwrite as needed.
system.runTimeout(() => {
    sendRegistration();
    sendTrees();
    startSend();
}, 120);

// --- ACK-BASED RESEND LOOP ------------------------------------------------
// CORE requests a resend (via /scriptevent murmur:resend) whenever a multi-chunk
// profile stalls halfway. We re-queue it through the same throttled sender —
// registration is idempotent, so re-sending everything is safe and guarantees
// CORE eventually assembles every profile (villager/pillager/golem included).
// This closes the loop that previously let one dropped command leave an NPC
// permanently "no name / no talk / no tree".
system.afterEvents.scriptEventReceive.subscribe((event) => {
    if (event.id !== "murmur:resend") return;
    const want = (event.message || "").trim();
    // Optional specific type: "uncanny|minecraft:villager_v2". We send everything
    // regardless (safe), but we only bother logging for a targeted request.
    if (want && want !== "*") {
        const typeId = want.split("|").pop();
        world.sendMessage(`§8[MURMUR UNCANNY] Re-sending requested profile: ${typeId}`);
    } else {
        world.sendMessage(`§8[MURMUR UNCANNY] Re-sending all profiles per manual request...`);
    }
    sendRegistration();
    sendTrees();
    startSend();
});