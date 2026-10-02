import { system, world } from "@minecraft/server";
import {
    VILLAGER_NAMES, PILLAGER_NAMES, PIGLIN_NAMES, WITCH_NAMES, MONSTER_NAMES,
    GOLEM_NAMES, TRADER_NAMES, SKELETON_NAMES, DIALOGUE
} from "./dialogue.js";
import {
    DIALOGUE_ES, VILLAGER_NAMES_ES, PILLAGER_NAMES_ES, PIGLIN_NAMES_ES, MONSTER_NAMES_ES
} from "./dialogue_es.js";
import {
    DIALOGUE_PT
} from "./dialogue_pt.js";

const PACK_ID = "cruel";
const CHUNK_SIZE = 1000;
const PER_TICK = 3;   // Bedrock drops scriptevents when too many fire in one tick

// UTF-8 safe base64 (avoids quote/escape breakage when the JSON payload is
// passed through `runCommand("scriptevent ...")`). Mirrors utils.encodeBase64.
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

// --- QUEUED / THROTTLED SENDER ---------------------------------------------
// The previous build fired every chunk with a bare forEach inside a single
// tick. Across 14 profiles that is well over the number of scriptevents Bedrock
// will accept per tick; the overflow is dropped silently. CORE sweeps stalled
// assemblies on a timer and replies with murmur:resend, so this pack must pace
// itself and answer that request, or profiles simply never arrive.
const SEND_QUEUE = [];
let queueGateway = false; // guards the interval from being started twice

function queueChunks(eventId, typeId, jsonData) {
    const total = Math.ceil(jsonData.length / CHUNK_SIZE);
    for (let i = 0; i < jsonData.length; i += CHUNK_SIZE) {
        const payload = b64encode(jsonData.slice(i, i + CHUNK_SIZE));
        const idx = Math.floor(i / CHUNK_SIZE);
        SEND_QUEUE.push(`scriptevent ${eventId} ${PACK_ID}|${typeId}|${idx}|${total}|${payload}`);
    }
}

function sendStep() {
    if (SEND_QUEUE.length === 0) { queueGateway = false; return; }
    let sent = 0;
    while (SEND_QUEUE.length > 0 && sent < PER_TICK) {
        const entry = SEND_QUEUE.shift();
        try {
            world.getDimension("overworld").runCommand(entry);
        } catch (e) { console.warn("[MURMUR CRUEL] send failed: " + e); }
        sent++;
    }
}

function startSend() {
    if (queueGateway) return;
    queueGateway = true;
    system.runInterval(() => sendStep(), 1);
}

function sendRegistration() {
    world.sendMessage(`§8[MURMUR CRUEL] Starting registration...`);

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
        "minecraft:piglin": PIGLIN_NAMES_ES,
        "minecraft:piglin_brute": PIGLIN_NAMES_ES,
        "minecraft:blaze": MONSTER_NAMES_ES,
        "minecraft:enderman": MONSTER_NAMES_ES,
        "minecraft:wither_skeleton": MONSTER_NAMES_ES,
        "minecraft:iron_golem": VILLAGER_NAMES_ES,
        "minecraft:skeleton": PILLAGER_NAMES_ES
    };

    try {
        for (const [typeId, pool] of Object.entries(DIALOGUE)) {

            const multiLangDialogue = {};
            for (const [condition, lines] of Object.entries(pool)) {
                multiLangDialogue[condition] = {
                    "en_US": lines
                };
                if (DIALOGUE_ES[typeId]?.[condition]) {
                    multiLangDialogue[condition]["es_ES"] = DIALOGUE_ES[typeId][condition];
                }
                if (DIALOGUE_PT[typeId]?.[condition]) {
                    multiLangDialogue[condition]["pt_BR"] = DIALOGUE_PT[typeId][condition];
                }
            }

            const multiLangNames = {
                "en_US": NAME_MAP[typeId] || MONSTER_NAMES
            };
            if (NAME_MAP_ES[typeId]) {
                multiLangNames["es_ES"] = NAME_MAP_ES[typeId];
            }


            const data = JSON.stringify({ names: multiLangNames, dialogue: multiLangDialogue });
            queueChunks("murmur:data", typeId, data);
        }
        world.sendMessage(`§8[MURMUR CRUEL] ${Object.keys(DIALOGUE).length} profiles queued.`);
    } catch (e) {
        world.sendMessage(`§c[MURMUR CRUEL] Registration CRASHED: ${e}`);
    }
}

// --- ACK-BASED RESEND -------------------------------------------------------
// CORE requests a resend when a multi-chunk profile stalls. Re-sending
// everything is safe (registration is idempotent) and guarantees every profile
// eventually assembles.
system.afterEvents.scriptEventReceive.subscribe((event) => {
    if (event.id !== "murmur:resend") return;
    const want = (event.message || "").trim();
    if (want && want !== "*") {
        world.sendMessage(`§8[MURMUR CRUEL] Re-sending requested profile: ${want.split("|").pop()}`);
    } else {
        world.sendMessage(`§8[MURMUR CRUEL] Re-sending all profiles per manual request...`);
    }
    sendRegistration();
    startSend();
});

system.runTimeout(() => {
    sendRegistration();
    startSend();
}, 120);
