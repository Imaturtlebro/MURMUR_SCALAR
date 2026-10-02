import { system, world } from "@minecraft/server";
import {
    VILLAGER_NAMES, PILLAGER_NAMES, PIGLIN_NAMES, WITCH_NAMES, MONSTER_NAMES,
    GOLEM_NAMES, TRADER_NAMES, SKELETON_NAMES, DIALOGUE
} from "./dialogue.js";
import {
    DIALOGUE_ES, VILLAGER_NAMES_ES
} from "./dialogue_es.js";
import {
    DIALOGUE_PT, VILLAGER_NAMES_PT
} from "./dialogue_pt.js";

const PACK_ID = "praise";
const CHUNK_SIZE = 1000;
const PER_TICK = 3;   // Bedrock drops scriptevents when too many fire in one tick

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
// Firing every chunk in one tick gets the overflow dropped by Bedrock, and a
// pack that cannot answer CORE's murmur:resend never recovers the lost
// profiles. Pace the sends and re-send on request.
const SEND_QUEUE = [];
let queueGateway = false;

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
        } catch (e) { console.warn("[MURMUR PRAISE] send failed: " + e); }
        sent++;
    }
}

function startSend() {
    if (queueGateway) return;
    queueGateway = true;
    system.runInterval(() => sendStep(), 1);
}

function sendRegistration() {
    world.sendMessage(`§8[MURMUR PRAISE] Starting registration...`);

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

    // Only VILLAGER names are translated in this pack. Pillagers, golems and
    // skeletons were previously pointed at VILLAGER_NAMES_ES/PT, which gave a
    // golem a peasant's name in Spanish while English used Golem names. Omitting
    // them makes those two fall back to the correct en_US pool.
    const NAME_MAP_ES = {
        "minecraft:villager_v2": VILLAGER_NAMES_ES,
        "minecraft:villager": VILLAGER_NAMES_ES
    };

    const NAME_MAP_PT = {
        "minecraft:villager_v2": VILLAGER_NAMES_PT,
        "minecraft:villager": VILLAGER_NAMES_PT
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
            if (NAME_MAP_PT[typeId]) {
                multiLangNames["pt_BR"] = NAME_MAP_PT[typeId];
            }


            const data = JSON.stringify({ names: multiLangNames, dialogue: multiLangDialogue });
            queueChunks("murmur:data", typeId, data);
        }
        world.sendMessage(`§8[MURMUR PRAISE] ${Object.keys(DIALOGUE).length} profiles queued.`);
    } catch (e) {
        world.sendMessage(`§c[MURMUR PRAISE] Registration CRASHED: ${e}`);
    }
}

// --- ACK-BASED RESEND -------------------------------------------------------
system.afterEvents.scriptEventReceive.subscribe((event) => {
    if (event.id !== "murmur:resend") return;
    const want = (event.message || "").trim();
    if (want && want !== "*") {
        world.sendMessage(`§8[MURMUR PRAISE] Re-sending requested profile: ${want.split("|").pop()}`);
    } else {
        world.sendMessage(`§8[MURMUR PRAISE] Re-sending all profiles per manual request...`);
    }
    sendRegistration();
    startSend();
});

system.runTimeout(() => {
    sendRegistration();
    startSend();
}, 120);
