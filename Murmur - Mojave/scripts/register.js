// --- MURMUR MOJAVE â€” registration bridge ---
// Ships this pack's dialogue profiles, name pools and dialogue trees into
// MURMUR CORE using the chunked murmur:data / murmur:tree protocol.
//
// Protocol per profile:
//   scriptevent murmur:data <packId>|<typeId>|<idx>|<total>|<base64 chunk>
// CORE reassembles the chunks, then hands back murmur:resend if a profile
// stalls halfway â€” we re-send everything, which is safe because registration
// is idempotent.

import { system, world } from "@minecraft/server";
import {
    VILLAGER_NAMES, GOLEM_NAMES, PILLAGER_NAMES, WITHER_NAMES,
    SKELETON_NAMES, COLD_NAMES, WITCH_NAMES, TRADER_NAMES, MONSTER_NAMES,
    PIGLIN_NAMES, PIGLIN_BRUTE_NAMES, ENDERMAN_NAMES,
    DIALOGUE, TREES
} from "./dialogue.js";

const PACK_ID = "mojave";
const CHUNK_SIZE = 1000;
const PER_TICK = 3;   // Bedrock drops scriptevents when too many fire in one tick

// --- UTF-8 safe base64 (atob/btoa are not guaranteed in the Bedrock engine) ---
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

// --- Name pools per typeId ---------------------------------------------------
// Anything unmapped falls back to MONSTER_NAMES so a mob is never left
// nameless (which CORE reads as "no profile loaded").
const NAME_MAP = {
    "minecraft:villager_v2": VILLAGER_NAMES,
    "minecraft:villager": VILLAGER_NAMES,
    "minecraft:iron_golem": GOLEM_NAMES,
    "minecraft:pillager": PILLAGER_NAMES,
    "minecraft:pillager_captain": PILLAGER_NAMES,
    "minecraft:vindicator": PILLAGER_NAMES,
    "minecraft:evoker": PILLAGER_NAMES,
    "minecraft:skeleton": SKELETON_NAMES,
    "minecraft:stray": COLD_NAMES,
    "minecraft:bogged": COLD_NAMES,
    "minecraft:wither_skeleton": WITHER_NAMES,
    "minecraft:blaze": MONSTER_NAMES,
    "minecraft:wandering_trader": TRADER_NAMES,
    "minecraft:witch": WITCH_NAMES,
    "minecraft:piglin": PIGLIN_NAMES,
    "minecraft:piglin_brute": PIGLIN_BRUTE_NAMES,
    "minecraft:enderman": ENDERMAN_NAMES
};

// Faction groups: which typeIds treat each other as the same "kind" for the
// witness/mourning engine, so a death is mourned by the deceased's own
// faction (including sub-variants) but never by a rival.
const FACTIONS = {
    "villager": ["minecraft:villager_v2", "minecraft:villager"],
    "golem": ["minecraft:iron_golem"],
    "illager": ["minecraft:pillager", "minecraft:pillager_captain", "minecraft:vindicator", "minecraft:evoker", "minecraft:ravager"],
    "skeleton": ["minecraft:skeleton", "minecraft:stray", "minecraft:bogged"],
    "wither": ["minecraft:wither_skeleton"],
    "blaze": ["minecraft:blaze"],
    "trader": ["minecraft:wandering_trader"],
    "witch": ["minecraft:witch"],
    "piglin": ["minecraft:piglin", "minecraft:piglin_brute"],
    "enderman": ["minecraft:enderman"]
};

// --- QUEUED / THROTTLED SENDER ---------------------------------------------
const SEND_QUEUE = [];
let queueGateway = false;
let sendInterval = null;   // live handle so the gateway can be cancelled when the queue drains

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
            world.getDimension("overworld").runCommand(entry);
        } catch (e) { console.warn("[MURMUR MOJAVE] send failed: " + e); }
        sent++;
    }
}

function startSend() {
    if (queueGateway) return;
    queueGateway = true;
    sendInterval = system.runInterval(() => sendStep(), 1);
}

// --- PROFILES ---------------------------------------------------------------
function sendRegistration() {
    world.sendMessage(`Â§8[MURMUR MOJAVE] Starting registration...`);
    try {
        for (const [rawId, pool] of Object.entries(DIALOGUE)) {
            // Trim defensively: a trailing space in a key would make the
            // NAME_MAP lookup miss and register under a bogus typeId.
            const typeId = String(rawId).trim();

            const multiLangDialogue = {};
            for (const [condition, lines] of Object.entries(pool)) {
                multiLangDialogue[condition] = { "en_US": lines };
            }

            const data = JSON.stringify({
                names: { "en_US": NAME_MAP[typeId] || MONSTER_NAMES },
                dialogue: multiLangDialogue,
                factions: FACTIONS
            });

            queueChunks("murmur:data", typeId, data);
        }
        world.sendMessage(`Â§8[MURMUR MOJAVE] ${Object.keys(DIALOGUE).length} profiles queued.`);
    } catch (e) {
        world.sendMessage(`Â§c[MURMUR MOJAVE] Registration CRASHED: ${e}`);
    }
}

// --- TREES ------------------------------------------------------------------
function sendTrees() {
    if (!TREES || Object.keys(TREES).length === 0) return;
    world.sendMessage(`Â§8[MURMUR MOJAVE] Sending ${Object.keys(TREES).length} dialogue trees...`);
    try {
        for (const [rawId, tree] of Object.entries(TREES)) {
            const typeId = String(rawId).trim();
            queueChunks("murmur:tree", typeId, JSON.stringify(tree));
        }
    } catch (e) {
        world.sendMessage(`Â§c[MURMUR MOJAVE] Tree registration CRASHED: ${e}`);
    }
}

// --- KICKOFF ----------------------------------------------------------------
// 120 ticks: CORE must be initialised before we start pushing profiles at it.
system.runTimeout(() => {
    sendRegistration();
    sendTrees();
    startSend();
}, 120);

// --- ACK-BASED RESEND -------------------------------------------------------
// CORE requests a resend via /scriptevent murmur:resend when a multi-chunk
// profile stalls. Re-sending everything is safe (idempotent) and guarantees
// every profile eventually assembles.
system.afterEvents.scriptEventReceive.subscribe((event) => {
    if (event.id !== "murmur:resend") return;
    const want = (event.message || "").trim();
    if (want && want !== "*") {
        const typeId = want.split("|").pop();
        world.sendMessage(`Â§8[MURMUR MOJAVE] Re-sending requested profile: ${typeId}`);
    } else {
        world.sendMessage(`Â§8[MURMUR MOJAVE] Re-sending all profiles per manual request...`);
    }
    sendRegistration();
    sendTrees();
    startSend();
});
