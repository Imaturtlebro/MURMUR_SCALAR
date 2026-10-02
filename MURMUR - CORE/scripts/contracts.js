// --- contracts.js — the explicit CORE <-> content-pack data contract ---
//
// Everything a content pack is allowed to send to CORE, declared in one place.
//
// Why this exists: the data contract used to be implicit. The valid condition
// keys only existed as `pool.<key>` property reads scattered across main.js, and
// the valid line tokens only existed as `.replace(/{x}/g, …)` calls in utils.js.
// A pack author had no way to know the vocabulary, and getting it wrong failed
// SILENTLY: an unknown condition key is merged into MURMUR_DATA.DIALOGUE and
// then never read, so that entire block of dialogue simply never fires.
//
// This module is the single source of truth. CORE validates every incoming
// profile and tree against it at registration time and reports what it finds.
//
// DESIGN RULE: validation NEVER rejects and NEVER throws. A malformed pack must
// still load — a content author's typo should produce a loud log line, not an
// NPC that silently refuses to talk.

/**
 * Dialogue condition keys CORE actually reads.
 *
 * Derived from every `pool.<key>` / `getPool("<key>")` read across CORE.
 * NOTE: `proximity` is the fallback pool and is read via getPool() only, so a
 * grep for `pool.proximity` alone will miss it.
 * NOTE: `en_US` is NOT a condition — it is a language key iterated in index.js
 * over the NAMES table. Do not add it here.
 */
export const DIALOGUE_CONDITIONS = new Set([
    "alone",
    "armored_player",
    "boat",
    "crowded",
    "death",
    "greeting_foe",
    "greeting_friend",
    "holding_useful",
    "holding_weapon",
    "inventory",
    "jukebox",
    "jumping",
    "nether",
    "night",
    "night_wounded",
    "on_fire",
    "overworld",
    "peer_wounded",
    "poor",
    "proximity",
    "rain",
    "rich",
    "seen_animal",
    "sneaking",
    "soft_player",
    "thunder",
    "wealth",
    "wounded",
    "wounded_vs_illager",
    "wounded_vs_player",
    "wounded_vs_zombie"
]);

/**
 * Conditions that only ever render during a death/witness reaction. Lines in
 * these pools are allowed to use DEATH_ONLY_TOKENS; anywhere else, a
 * {dead_name} would survive into chat as a literal string.
 */
export const DEATH_CONDITIONS = new Set(["death", "peer_wounded"]);

/**
 * Tokens substituted by processTextLine() for every line. These are safe in any
 * dialogue pool.
 */
export const AMBIENT_TOKENS = new Set(["name", "item", "health", "hurt_name"]);

/**
 * Tokens substituted ONLY on the entityDie/witness path (main.js substitutes
 * {dead_name} before handing the line to processTextLine). Using one outside a
 * death pool leaves the literal token in chat.
 */
export const DEATH_ONLY_TOKENS = new Set(["dead_name"]);

/**
 * Tokens substituted inside a tree choice's `action` command string
 * (dialogue_tree.js resolves these against the player/entity before running).
 */
export const TREE_ACTION_TOKENS = new Set(["player", "name"]);

/** Terminal goto for a dialogue tree. */
export const TREE_END = "__end__";

/** Keys CORE reads off a tree node. */
export const TREE_NODE_KEYS = new Set(["text", "choices", "end", "onEnter", "onExit"]);

/**
 * Keys CORE reads off a tree choice.
 * Derived from `ch.<key>` reads in dialogue_tree.js choiceVisible() and the
 * choice-execution block. Anything not listed here is silently ignored.
 */
export const TREE_CHOICE_KEYS = new Set([
    "label", "goto", "requires", "repDelta", "action", "sendMessage", "turnInFailText",
    // items
    "giveItem", "takeItem",
    // quests
    "startQuest", "turnIn", "questProgress",
    // effects
    "addEffect",
    // entity state
    "setTags", "clearTags", "setProperties"
]);

/**
 * Keys CORE reads inside a choice's `requires` object.
 * Derived from `r.<key>` reads in dialogue_tree.js choiceVisible().
 */
export const TREE_REQUIRES_KEYS = new Set([
    "minRep", "maxRep",
    "tag", "notTag",
    "item", "amount",
    "quest", "notQuest",
    "effect", "notEffect",
    "property", "propertyEquals"
]);

/** Characters that make a token unsafe to pass to `new RegExp(token, "g")`. */
const REGEX_UNSAFE = /[.*+?^${}()|[\]\\]/;

function push(list, severity, message) {
    list.push({ severity, message });
}

/** Flatten one condition's value into a list of line strings. */
function collectLines(value, out, depth = 0) {
    if (depth > 4) return;
    if (Array.isArray(value)) {
        for (const v of value) {
            if (typeof v === "string") out.push(v);
            else out.push(null); // non-string entry, flagged by the caller
        }
        return;
    }
    if (value && typeof value === "object") {
        for (const v of Object.values(value)) collectLines(v, out, depth + 1);
    }
}

/**
 * Validate one dialogue line's tokens.
 * @param {string} line
 * @param {Set<string>} allowed   tokens legal in this context
 * @param {Set<string>} extraPlaceholders  tokens registered by the pack itself
 */
function checkTokens(packId, typeId, condition, line, allowed, extraPlaceholders, warnings) {
    for (const m of line.matchAll(/\{([a-zA-Z_][a-zA-Z0-9_]*)\}/g)) {
        const tok = m[1];
        if (allowed.has(tok)) continue;
        if (extraPlaceholders && extraPlaceholders.has(tok)) continue;
        push(warnings, "warn",
            `${packId}/${typeId}[${condition}]: token {${tok}} is not substituted by CORE and will print literally ` +
            `(known: {${[...allowed].join("}, {")}} or a pack-registered placeholder)`);
    }
}

/**
 * Validate a content profile as it arrives from registerContent().
 * Never throws. Never rejects.
 *
 * @param {string} packId
 * @param {string} typeId
 * @param {object} profile  { names, dialogue, factions, placeholders }
 * @returns {{errors: Array, warnings: Array, stats: object}}
 */
export function validateProfile(packId, typeId, profile) {
    const errors = [];
    const warnings = [];
    const stats = { conditions: 0, lines: 0 };
    const p = profile || {};

    // ---- names -----------------------------------------------------------
    const names = p.names;
    if (names === undefined || names === null) {
        push(warnings, "warn", `${packId}/${typeId}: no name pool sent (this mob will fall back to CORE's default names)`);
    } else {
        const enPool = Array.isArray(names) ? names : names.en_US;
        if (!Array.isArray(enPool)) {
            push(errors, "error", `${packId}/${typeId}: "names" must be an array or {en_US: [...]} — got ${typeof names}`);
        } else if (enPool.length === 0) {
            // CORE falls back to MONSTER_NAMES, so this is not fatal, but it is
            // almost always a mistake (a pack registering an empty pool).
            push(warnings, "warn", `${packId}/${typeId}: en_US name pool is empty (this mob will fall back to CORE's default names)`);
        } else {
            const blanks = enPool.filter(n => typeof n !== "string" || n.trim() === "").length;
            if (blanks) push(warnings, "warn", `${packId}/${typeId}: ${blanks} blank/non-string entr${blanks === 1 ? "y" : "ies"} in the en_US name pool`);
        }
    }

    // ---- dialogue --------------------------------------------------------
    const dialogue = p.dialogue;
    if (dialogue === undefined || dialogue === null) {
        push(warnings, "warn", `${packId}/${typeId}: no dialogue sent (this mob will never speak)`);
    } else if (typeof dialogue !== "object" || Array.isArray(dialogue)) {
        push(errors, "error", `${packId}/${typeId}: "dialogue" must be an object keyed by condition — got ${Array.isArray(dialogue) ? "array" : typeof dialogue}`);
        return { errors, warnings, stats };
    }

    const placeholders = (p.placeholders && typeof p.placeholders === "object" && !Array.isArray(p.placeholders))
        ? p.placeholders
        : null;
    const extraPlaceholders = new Set(placeholders ? Object.keys(placeholders) : []);
    if (placeholders) {
        for (const key of Object.keys(placeholders)) {
            if (REGEX_UNSAFE.test(key)) {
                push(warnings, "warn",
                    `${packId}/${typeId}: placeholder "${key}" contains regex metacharacters. CORE substitutes placeholders ` +
                    `with new RegExp(key, "g"), so this will match more than intended. Rename it to letters/digits/underscore.`);
            }
        }
    }

    for (const [condition, value] of Object.entries(dialogue || {})) {
        stats.conditions++;

        if (!DIALOGUE_CONDITIONS.has(condition)) {
            // The important one: this is the silent-failure case.
            push(warnings, "warn",
                `${packId}/${typeId}: unknown condition "${condition}" — it is stored but CORE never reads it, ` +
                `so this dialogue will NEVER fire. Valid keys: ${[...DIALOGUE_CONDITIONS].join(", ")}`);
        }

        if (Array.isArray(value)) {
            const allowed = DEATH_CONDITIONS.has(condition)
                ? new Set([...AMBIENT_TOKENS, ...DEATH_ONLY_TOKENS])
                : AMBIENT_TOKENS;
            for (const line of value) {
                stats.lines++;
                if (typeof line !== "string") {
                    push(errors, "error", `${packId}/${typeId}[${condition}]: dialogue entries must be strings — found ${typeof line}`);
                    continue;
                }
                checkTokens(packId, typeId, condition, line, allowed, extraPlaceholders, warnings);
            }
        } else if (typeof value !== "object" || value === null) {
            push(errors, "error", `${packId}/${typeId}[${condition}]: expected an array or a localized object — got ${typeof value}`);
        } else {
            // Localized ({lang:[...]}) or sub-keyed ({itemId:[...]}) or both.
            const allowed = DEATH_CONDITIONS.has(condition)
                ? new Set([...AMBIENT_TOKENS, ...DEATH_ONLY_TOKENS])
                : AMBIENT_TOKENS;
            const lines = [];
            collectLines(value, lines);
            for (const line of lines) {
                stats.lines++;
                if (typeof line !== "string") {
                    push(errors, "error", `${packId}/${typeId}[${condition}]: dialogue entries must be strings — found ${typeof line}`);
                    continue;
                }
                checkTokens(packId, typeId, condition, line, allowed, extraPlaceholders, warnings);
            }
        }
    }

    // ---- factions --------------------------------------------------------
    if (p.factions) {
        if (typeof p.factions !== "object" || Array.isArray(p.factions)) {
            push(errors, "error", `${packId}/${typeId}: "factions" must be an object of { factionId: [typeIds] }`);
        } else {
            for (const [fid, members] of Object.entries(p.factions)) {
                if (!Array.isArray(members)) {
                    push(warnings, "warn", `${packId}/${typeId}: faction "${fid}" is not an array of typeIds — it will be spread as a single entry`);
                }
            }
        }
    }

    return { errors, warnings, stats };
}

/**
 * Validate a dialogue tree as it arrives from registerTree().
 * Never throws. Never rejects.
 *
 * @param {string} packId
 * @param {string} typeId
 * @param {object} tree  { start, nodes: { nodeId: { text, choices:[…] } } }
 * @returns {{errors: Array, warnings: Array, stats: object}}
 */
export function validateTree(packId, typeId, tree) {
    const errors = [];
    const warnings = [];
    const stats = { nodes: 0, choices: 0 };
    const t = tree || {};

    if (!t.nodes || typeof t.nodes !== "object" || Array.isArray(t.nodes)) {
        push(errors, "error", `${packId}/${typeId}: tree has no "nodes" object`);
        return { errors, warnings, stats };
    }

    if (!t.start) {
        push(errors, "error", `${packId}/${typeId}: tree has no "start" node id`);
    } else if (!t.nodes[t.start]) {
        push(errors, "error", `${packId}/${typeId}: "start" points at missing node "${t.start}"`);
    }

    for (const [nodeId, node] of Object.entries(t.nodes)) {
        stats.nodes++;
        if (!node || typeof node !== "object") {
            push(errors, "error", `${packId}/${typeId}/${nodeId}: node is not an object`);
            continue;
        }
        if (typeof node.text !== "string" || node.text === "") {
            push(warnings, "warn", `${packId}/${typeId}/${nodeId}: node has no "text" — the player will see an empty choice`);
        }
        if (!Array.isArray(node.choices)) {
            push(warnings, "warn", `${packId}/${typeId}/${nodeId}: node has no "choices" array — this branch is a dead end`);
            continue;
        }
        for (const ch of node.choices) {
            stats.choices++;
            if (!ch || typeof ch !== "object") {
                push(errors, "error", `${packId}/${typeId}/${nodeId}: choice is not an object`);
                continue;
            }
            if (typeof ch.label !== "string" || ch.label === "") {
                push(warnings, "warn", `${packId}/${typeId}/${nodeId}: a choice has no "label" — it will render blank`);
            }
            if (typeof ch.goto !== "string" || ch.goto === "") {
                push(warnings, "warn", `${packId}/${typeId}/${nodeId}: a choice has no "goto" — clicking it will do nothing`);
            } else if (ch.goto !== TREE_END && !t.nodes[ch.goto]) {
                // Dangling goto = an unreachable branch the author will hunt for by hand.
                push(errors, "error", `${packId}/${typeId}/${nodeId}: goto "${ch.goto}" points at a node that does not exist`);
            }
            for (const k of Object.keys(ch)) {
                if (!TREE_CHOICE_KEYS.has(k)) {
                    push(warnings, "warn", `${packId}/${typeId}/${nodeId}: choice key "${k}" is not read by CORE and will be ignored`);
                }
            }
            if (ch.requires && typeof ch.requires === "object") {
                for (const rk of Object.keys(ch.requires)) {
                    if (!TREE_REQUIRES_KEYS.has(rk)) {
                        push(warnings, "warn", `${packId}/${typeId}/${nodeId}: requires.${rk} is not read by CORE — this choice will always show`);
                    }
                }
            }
            if (typeof ch.action === "string") {
                for (const m of ch.action.matchAll(/\{([a-zA-Z_][a-zA-Z0-9_]*)\}/g)) {
                    if (!TREE_ACTION_TOKENS.has(m[1])) {
                        push(warnings, "warn", `${packId}/${typeId}/${nodeId}: action uses {${m[1]}} which tree actions do not resolve (known: {${[...TREE_ACTION_TOKENS].join("}, {")}})`);
                    }
                }
            }
        }
    }

    // Unreachable nodes are a warning, not an error: `start` plus a full goto
    // graph is the common case, and authors legitimately keep scratch nodes.
    const reachable = new Set();
    const walk = (id) => {
        if (!id || id === TREE_END || reachable.has(id) || !t.nodes[id]) return;
        reachable.add(id);
        for (const ch of (t.nodes[id].choices || [])) walk(ch.goto);
    };
    walk(t.start);
    const orphans = Object.keys(t.nodes).filter(n => !reachable.has(n));
    if (orphans.length) {
        push(warnings, "warn", `${packId}/${typeId}: ${orphans.length} unreachable node(s): ${orphans.join(", ")}`);
    }

    return { errors, warnings, stats };
}

/**
 * One-line summary for chat / console.
 */
export function summarize(prefix, res) {
    const e = res.errors.length, w = res.warnings.length;
    if (e === 0 && w === 0) return null;
    const parts = [];
    if (e) parts.push(`${e} error${e === 1 ? "" : "s"}`);
    if (w) parts.push(`${w} warning${w === 1 ? "" : "s"}`);
    return `${prefix}: ${parts.join(", ")}`;
}
