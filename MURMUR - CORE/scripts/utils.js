import { world } from "@minecraft/server";
import { MurmurEvents } from "./events.js";
import { shouldCoreYield } from "./animal_priority.js";

// --- FACTION GROUPS for the witness engine & name filtering ---
// Group individual typeIds into loyalty structures so a death is mourned by the
// deceased's OWN kind (and sub-variants), and never by a rival faction.
export const FACTION_GROUPS = [
    ["minecraft:villager_v2", "minecraft:villager"],
    ["minecraft:pillager", "minecraft:pillager_captain", "minecraft:vindicator", "minecraft:evoker", "minecraft:ravager"],
    ["minecraft:piglin", "minecraft:piglin_brute", "minecraft:hoglin", "minecraft:zoglin"],
    ["minecraft:witch"],
    ["minecraft:enderman", "minecraft:endermite"],
    ["minecraft:skeleton", "minecraft:stray", "minecraft:bogged"],
    ["minecraft:wither_skeleton"],
    ["minecraft:blaze"],
    ["minecraft:iron_golem"],
    ["minecraft:wandering_trader", "minecraft:trader_llama"]
];

export function factionGroupFor(typeId) {
    const t = String(typeId || "");
    for (const group of FACTION_GROUPS) {
        for (const member of group) {
            if (t === member) return group;
        }
    }
    return null;
}

// Base64 alphabet (shared with the content packs that encode their payloads).
const B64C = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

// UTF-8 safe base64 encode (no dependency on atob/btoa, which are not guaranteed
// in the Bedrock script engine).
export function encodeBase64(input) {
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

// UTF-8 safe base64 decode.
export function decodeBase64(input) {
    const clean = String(input).replace(/[^A-Za-z0-9+/=]/g, "");
    const map = {};
    for (let i = 0; i < B64C.length; i++) map[B64C[i]] = i;
    const bytes = [];
    for (let i = 0; i < clean.length; i += 4) {
        const e0 = map[clean[i]], e1 = map[clean[i + 1]], e2 = map[clean[i + 2]], e3 = map[clean[i + 3]];
        bytes.push((e0 << 2) | (e1 >> 4));
        if (e2 !== undefined && clean[i + 2] !== "=") bytes.push(((e1 & 15) << 4) | (e2 >> 2));
        if (e3 !== undefined && clean[i + 3] !== "=") bytes.push(((e2 & 3) << 6) | e3);
    }
    let str = "";
    for (let i = 0; i < bytes.length; i++) {
        const b = bytes[i];
        if (b < 0x80) str += String.fromCharCode(b);
        else if (b >= 0xf0) {
            const cp = ((b & 7) << 18) | ((bytes[++i] & 0x3f) << 12) | ((bytes[++i] & 0x3f) << 6) | (bytes[++i] & 0x3f);
            const cc = cp - 0x10000;
            str += String.fromCharCode(0xd800 + (cc >> 10), 0xdc00 + (cc & 0x3ff));
        } else if (b >= 0xe0) str += String.fromCharCode(((b & 0x0f) << 12) | ((bytes[++i] & 0x3f) << 6) | (bytes[++i] & 0x3f));
        else if (b >= 0xc0) str += String.fromCharCode(((b & 0x1f) << 6) | (bytes[++i] & 0x3f));
    }
    return str;
}

/**
 * Safely decode a chunk payload. Tries raw JSON first (keeps older packs that
 * send unencoded JSON working), then falls back to base64. This makes the
 * reassembly immune to quote/escape breakage that can happen when a JSON
 * payload is passed through `runCommand("scriptevent ...")`.
 */
export function decodeChunkPayload(str) {
    if (!str) return null;
    try { return JSON.parse(str); } catch (e) { }
    try { return JSON.parse(decodeBase64(str)); } catch (e) { }
    return null;
}

// Reassemble a chunked payload into a parsed object.
//
// IMPORTANT: chunks are base64-encoded INDEPENDENTLY, each with its own 3-byte
// padding. Concatenating the base64 strings and decoding the result as one
// stream corrupts the byte alignment at every chunk boundary (multi-chunk
// profiles like villager/witch/wandering_trader would fail to reassemble).
// Instead we decode each piece back to its raw string slice, concatenate the
// slices, then parse once. A raw (non-base64) single-chunk send is still
// supported for legacy packs.
export function reassembleChunks(pieces) {
    if (!pieces || !pieces.length) return null;
    // Legacy fast-path: already a complete raw JSON string (single chunk).
    try { return JSON.parse(pieces.join("")); } catch (e) { }
    // Normal path: decode each independently-padded base64 piece, then parse.
    try {
        let txt = "";
        for (const p of pieces) txt += decodeBase64(p);
        if (!txt) return null;
        return JSON.parse(txt);
    } catch (e) { }
    return null;
}

// Per-entity-family ambient sound table for talk playback.
const MOB_TALK_SOUNDS = {
    "minecraft:villager_v2": { sound: "entity.villager.ambient", pitch: 1.0 },
    "minecraft:villager": { sound: "entity.villager.ambient", pitch: 1.0 },
    "minecraft:pillager": { sound: "entity.pillager.ambient", pitch: 0.9 },
    "minecraft:vindicator": { sound: "entity.vindicator.ambient", pitch: 0.95 },
    "minecraft:witch": { sound: "entity.witch.ambient", pitch: 1.1 },
    "minecraft:wandering_trader": { sound: "entity.wandering_trader.ambient", pitch: 1.0 },
    "minecraft:iron_golem": { sound: "entity.iron_golem.repair", pitch: 0.8 },
    "minecraft:cat": { sound: "entity.cat.ambient", pitch: 1.0 },
    "minecraft:wolf": { sound: "entity.wolf.ambient", pitch: 1.0 },
    "minecraft:cow": { sound: "entity.cow.ambient", pitch: 1.0 },
    "minecraft:sheep": { sound: "entity.sheep.ambient", pitch: 1.0 },
    "minecraft:pig": { sound: "entity.pig.ambient", pitch: 1.0 },
    "minecraft:chicken": { sound: "entity.chicken.ambient", pitch: 1.0 },
    "minecraft:horse": { sound: "entity.horse.ambient", pitch: 1.0 },
    "minecraft:donkey": { sound: "entity.donkey.ambient", pitch: 1.0 },
    "minecraft:rabbit": { sound: "entity.rabbit.ambient", pitch: 1.0 },
    "minecraft:fox": { sound: "entity.fox.ambient", pitch: 1.0 },
    "minecraft:panda": { sound: "entity.panda.ambient", pitch: 1.0 }
};

export function playMobTalkSound(entity) {
    if (!entity || !entity.isValid()) return;
    const cfg = MOB_TALK_SOUNDS[entity.typeId];
    if (!cfg) return;
    try {
        const variablePitch = cfg.pitch + (Math.random() * 0.2 - 0.1);
        entity.dimension.playSound(cfg.sound, entity.location, { pitch: variablePitch, volume: 0.6 });
    } catch (e) { }
}

// --- Inventory helpers (native, no runCommand needed) ---
export function hasItemInInventory(player, typeId, amount = 1) {
    try {
        const inv = player.getComponent("minecraft:inventory");
        if (!inv || !inv.container) return false;
        const c = inv.container;
        let count = 0;
        for (let i = 0; i < c.size; i++) {
            const it = c.getItem(i);
            if (it && it.typeId === typeId) count += it.amount;
            if (count >= amount) return true;
        }
        return count >= amount;
    } catch (e) { return false; }
}

export function takeItemFromInventory(player, typeId, amount = 1) {
    try {
        const inv = player.getComponent("minecraft:inventory");
        if (!inv || !inv.container) return false;
        const c = inv.container;
        let remaining = amount;
        for (let i = 0; i < c.size && remaining > 0; i++) {
            const it = c.getItem(i);
            if (it && it.typeId === typeId) {
                const take = Math.min(it.amount, remaining);
                remaining -= take;
                if (it.amount - take > 0) {
                    let replacement = it.clone();
                    try {
                        // setAmount is the supported mutator on ItemStack.
                        if (typeof replacement.setAmount === "function") {
                            replacement = replacement.setAmount(it.amount - take);
                        } else {
                            replacement.amount = it.amount - take;
                        }
                    } catch (e) {
                        try { replacement.amount = it.amount - take; } catch (e2) { }
                    }
                    c.setItem(i, replacement);
                } else {
                    c.setItem(i, undefined);
                }
            }
        }
        return remaining <= 0;
    } catch (e) { return false; }
}


// Persistence-ready global data
if (!globalThis.MURMUR_DATA) {
    globalThis.MURMUR_DATA = { NAMES: {}, DIALOGUE: {}, PLACEHOLDERS: {}, ROASTS: {} };
}

export const chatterCooldowns = new Map();

export function getRandomElement(arr) {
    if (!arr || arr.length === 0) return null;
    return arr[Math.floor(Math.random() * arr.length)];
}

export function t(key) {
    const lang = globalThis.MURMUR_DATA.LANGUAGE || "en_US";
    const translations = {
        "en_US": {
            "general.someone": "Someone",
            "general.something": "Something",
            "general.npc": "NPC",
            "general.gear": "gear",
            "general.nothing": "nothing",
            "general.item": "item",
            "general.ghost": "ghost",
            "general.unknown": "unknown",
            "health.tier.1": "healthy",
            "health.tier.2": "battered",
            "health.tier.3": "wounded",
            "health.tier.4": "dying",
            "health.tier.5": "exhausted"
        },
        "es_ES": {
            "general.someone": "Alguien",
            "general.something": "Algo",
            "general.npc": "NPC",
            "general.gear": "equipo",
            "general.nothing": "nada",
            "general.item": "objeto",
            "general.ghost": "espectro",
            "general.unknown": "desconocido",
            "health.tier.1": "sano",
            "health.tier.2": "lastimado",
            "health.tier.3": "herido",
            "health.tier.4": "moribundo",
            "health.tier.5": "agotado"
        },
        "pt_BR": {
            "general.someone": "Alguém",
            "general.something": "Alguma coisa",
            "general.npc": "NPC",
            "general.gear": "equipamento",
            "general.nothing": "nada",
            "general.item": "item",
            "general.ghost": "fantasma",
            "general.unknown": "desconhecido",
            "health.tier.1": "saudável",
            "health.tier.2": "machucado",
            "health.tier.3": "ferido",
            "health.tier.4": "morrendo",
            "health.tier.5": "exausto"
        }
    };
    return translations[lang]?.[key] || translations["en_US"][key] || key;
}

export function selectName(typeId, lang = "en_US") {
    let namesPool = globalThis.MURMUR_DATA?.NAMES?.[typeId] || [];
    if (!Array.isArray(namesPool) && typeof namesPool === "object") {
        namesPool = namesPool[lang] || namesPool["en_US"] || [];
    }
    if (namesPool.length === 0) return null;
    return getRandomElement(namesPool);
}

/**
 * Returns the default/generic nameTag an entity would have if it had not been
 * given a custom name (derived from its typeId, e.g. "Villager v2").
 */
function genericNameFor(typeId) {
    const fallback = String(typeId || "").split(":")[1]?.replace(/_/g, " ") || "Someone";
    return fallback.charAt(0).toUpperCase() + fallback.slice(1);
}

/**
 * Wraps an addressee's name so it reads as somebody being referred to, rather
 * than as the speaker's own words. Used when an NPC addresses the player: the
 * aqua tint is visually distinct from the NPC's own speech colour, so
 *   <Clem> "§bIm a turtle man§r, remember your job!"
 * can never be misread as the player speaking.
 */
export function colorizeAddressee(rawNameTag) {
    const name = String(rawNameTag || "").split("\n")[0].trim();
    if (!name || name.length < 2) return null;
    return `§b${name}§r`;
}

// Bare Minecraft entity words that are never legitimate MURMUR names. An entity
// carrying one of these was stamped by the old genericNameFor() write, and it
// renders as the wrong creature speaking (e.g. a villager announced as "Sheep").
const TYPEID_WORDS = new Set([
    "Sheep", "Cow", "Pig", "Chicken", "Wolf", "Cat", "Horse", "Donkey", "Mule",
    "Rabbit", "Fox", "Bee", "Goat", "Bat", "Squid", "Cod", "Salmon", "Tropical Fish",
    "Pufferfish", "Dolphin", "Turtle", "Axolotl", "Frog", "Tadpole", "Sniffer",
    "Villager", "Villager v2", "Wandering Trader", "Iron Golem", "Snow Golem",
    "Pillager", "Vindicator", "Evoker", "Illusioner", "Witch", "Zombie", "Drowned",
    "Skeleton", "Stray", "Bogged", "Wither Skeleton", "Creeper", "Spider", "Enderman",
    "Blaze", "Ghast", "Slime", "Magma Cube", "Blaze", "Piglin", "Piglin Brute",
    "Hoglin", "Zoglin", "Zombified Piglin", "Warden", "Allay", "Armadillo"
]);

// Vanilla default display names that should be replaced when a custom name
// pool exists. Entities carrying these have not been custom-named yet.
const VANILLA_DEFAULT_NAMES = new Set([
    "Villager", "Villager v2", "Avillager", "Aldeano", "Aldeão", "Villageois",
    "Pillager", "Saqueador", "Vindicator", "Vindicador", "Evoker", "Invocador",
    "Witch", "Bruja", "Bruxa", "Iron Golem", "Golems de ferro", "Gólem de hierro",
    "Wandering Trader", "Comerciante", "Vendedor ambulante", "Piglin", "Piglin Brute",
    "Skeleton", "Esqueleto", "Blaze", "Enderman", "Mendigo enderman"
]);

/**
 * Assures an entity has a valid nameTag. If missing OR still holding a generic
 * default name, assigns one from the registered pool for its type.
 * Returns the clean name only (first line).
 */
export function ensureNameTag(entity) {
    if (!entity || !entity.isValid()) return t("general.someone");
    // A player must never be renamed or rendered as an NPC speaker.
    if (entity.typeId && entity.typeId.includes("player")) return t("general.someone");

    // Animal priority: never rename an animal ANIMAL CORE owns — competing
    // nameTags flicker as both cores overwrite each other.
    try {
        if (shouldCoreYield(entity.typeId)) return entity.nameTag ? entity.nameTag.split("\n")[0] : t("general.someone");
    } catch (e) { /* fall through to normal naming if the check fails */ }

    const lang = globalThis.MURMUR_DATA.LANGUAGE || "en_US";
    const current = entity.nameTag ? entity.nameTag.split("\n")[0].trim() : "";

    const isGeneric = !current ||
        current.length < 2 ||
        current === genericNameFor(entity.typeId) ||
        VANILLA_DEFAULT_NAMES.has(current);

    if (isGeneric) {
        const newName = selectName(entity.typeId, lang);
        if (newName) {
            entity.nameTag = newName;
        } else if (current === genericNameFor(entity.typeId)) {
            // Previously this burned the raw typeId onto the entity ("Sheep"),
            // which then rendered as <Sheep> in chat and read as an animal
            // answering a villager. Clear the generic tag instead of baking it in.
            entity.nameTag = undefined;
            return t("general.someone");
        }
    }

    // Repair pass: a name that is just a Minecraft entity word ("Sheep",
    // "Cow", "Wolf") is never a real MURMUR name -- it is leftover from the old
    // genericNameFor write and reads as the wrong creature speaking. Re-roll it.
    try {
        const bare = (entity.nameTag || "").split("\n")[0].trim();
        if (bare && TYPEID_WORDS.has(bare)) {
            const reRoll = selectName(entity.typeId, lang);
            if (reRoll) { entity.nameTag = reRoll; return reRoll; }
            entity.nameTag = undefined;
            return t("general.someone");
        }
    } catch (e) { /* fall through */ }

    if (!entity.nameTag) return t("general.someone");
    return entity.nameTag.split("\n")[0];
}

export function getItemRoast(itemId) {
    if (!itemId) return t("general.nothing");
    const cleanId = itemId.includes(":") ? itemId : `minecraft:${itemId}`;
    const CoreRoasts = globalThis.MURMUR_DATA?.ROASTS || {};
    return CoreRoasts[cleanId] || cleanId.split(":")[1]?.replace(/_/g, " ") || t("general.item");
}

export function getHealthTier(player) {
    if (!player) return t("general.ghost");
    try {
        const health = player.getComponent("minecraft:health");
        if (!health) return t("general.unknown");
        const percent = health.currentValue / health.defaultValue;
        if (percent >= 0.9) return t("health.tier.1");
        if (percent >= 0.5) return t("health.tier.2");
        if (percent >= 0.2) return t("health.tier.3");
        return t("health.tier.4");
    } catch (e) { return t("health.tier.5"); }
}

export function processTextLine(speaker, rawLine, targetPlayer, dynamicName, nameOverride) {
    let line = rawLine;
    const activeName = dynamicName || t("general.someone");

    if (line.includes("{item}") && targetPlayer) {
        try {
            const equippable = targetPlayer.getComponent("minecraft:equippable");
            const mainHandItem = equippable?.getEquipment("Mainhand");
            line = line.replace(/{item}/g, getItemRoast(mainHandItem?.typeId));
        } catch (e) {
            line = line.replace(/{item}/g, t("general.gear"));
        }
    }

    if (line.includes("{name}")) {
        // When the line is addressed at a specific player (e.g. a villager you
        // just hit), {name} must resolve to THAT player -- not to whichever
        // same-faction NPC happened to be standing nearby. Callers pass the
        // intended addressee via nameOverride.
        if (nameOverride) {
            line = line.replace(/{name}/g, nameOverride);
        } else {
            // Only reference names from same-faction entities to avoid cross-faction
            // leaks. The candidate set is hard-limited to the speaker's own faction
            // members, so an animal (or any unrelated mob) can never be named, and
            // the nearest candidate wins instead of getEntities()'s arbitrary order.
            const speakerFaction = factionGroupFor(speaker.typeId);
            if (speakerFaction) {
                const factionTypes = Array.from(new Set(speakerFaction));
                const nearby = speaker.dimension.getEntities({
                    location: speaker.location,
                    maxDistance: 12,
                    types: factionTypes
                });
                const candidates = nearby.filter(e => {
                    if (!e.isValid() || e.id === speaker.id) return false;
                    if (e.typeId.includes("player")) return false;
                    if (!e.nameTag || e.nameTag.length === 0) return false;
                    return factionGroupFor(e.typeId) === speakerFaction;
                });
                candidates.sort((a, b) => {
                    const ax = a.location.x - speaker.location.x;
                    const ay = a.location.y - speaker.location.y;
                    const az = a.location.z - speaker.location.z;
                    const bx = b.location.x - speaker.location.x;
                    const by = b.location.y - speaker.location.y;
                    const bz = b.location.z - speaker.location.z;
                    return (ax * ax + ay * ay + az * az) - (bx * bx + by * by + bz * bz);
                });
                const target = candidates[0] || null;
                line = line.replace(/{name}/g, target ? target.nameTag.split("\n")[0] : t("general.someone"));
            } else {
                // Speaker belongs to no faction group (animals, ungrouped mobs) --
                // never let them borrow a random nearby entity's name.
                line = line.replace(/{name}/g, t("general.someone"));
            }
        }
    }

    if (line.includes("{health}") && targetPlayer) {
        line = line.replace(/{health}/g, getHealthTier(targetPlayer));
    }

    if (line.includes("{hurt_name}")) {
        line = line.replace(/{hurt_name}/g, activeName);
    }

    const customTokens = globalThis.MURMUR_DATA?.PLACEHOLDERS || {};
    for (const [token, pool] of Object.entries(customTokens)) {
        if (line.includes(token)) {
            line = line.replace(new RegExp(token, "g"), getRandomElement(pool));
        }
    }

    return line;
}

export function sendCleanChat(entity, text, players) {
    let recipients = players;
    if (!recipients || (typeof recipients.forEach !== 'function')) {
        try {
            recipients = world.getAllPlayers();
        } catch (e) {
            recipients = [];
        }
    }
    // Drop any non-player recipients -- the `types:["minecraft:player"]` filter is
    // not exact in this engine and can hand back mobs.
    recipients = (recipients || []).filter(p => p && p.isValid?.() && p.typeId === "minecraft:player");

    // HARD STOP: a player must never be announced as an NPC speaker. The
    // loose `types` filters were letting players reach here, where ensureNameTag
    // returned "someone" and the line rendered as <Someone> "..." -- which read
    // as an unidentified mob talking, and occasionally as the player talking.
    if (!entity || !entity.isValid?.()) return;
    if (!entity.typeId || entity.typeId.includes("player")) return;

    const cleanName = ensureNameTag(entity);
    // Themed color by entity family (default red for hostile/uncanny)
    let color = "§c";
    const t = entity.typeId;
    if (t.includes("villager")) color = "§a";
    else if (t.includes("trader")) color = "§b";
    else if (t.includes("golem")) color = "§2";
    else if (t.includes("enderman")) color = "§5";
    else if (t.includes("witch")) color = "§5";
    else if (t.includes("skeleton") || t.includes("wither")) color = "§f";
    else if (t.includes("piglin") || t.includes("zombified")) color = "§4";
    else if (t.includes("wolf")) color = "§6";
    else if (t.includes("cat")) color = "§d";
    else if (t.includes("horse") || t.includes("donkey") || t.includes("mule") || t.includes("llama")) color = "§b";
    else if (t.includes("cow") || t.includes("sheep") || t.includes("pig") || t.includes("chicken") || t.includes("rabbit") || t.includes("fox")) color = "§e";
    else if (t.includes("spider")) color = "§8";
    else if (t.includes("creeper")) color = "§2";

    const formattedMessage = `<${color}${cleanName}§r> "${text}"`;

    for (const p of recipients) {
        if (p && typeof p.sendMessage === "function") {
            try {
                p.sendMessage(formattedMessage);
            } catch (e) { }
        }
    }

    // Atmospheric talk sound (toggle via /scriptevent murmur:sound off)
    if (globalThis.MURMUR_DATA.SOUND_ENABLED !== false) {
        playMobTalkSound(entity);
    }

    try {
        MurmurEvents.emit("dialogueSpoken", { entity, text, players: recipients });
    } catch (e) { }
}