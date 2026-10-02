import { system, world } from "@minecraft/server";

/**
 * MURMUR ANIMAL CORE API
 *
 * Compatibility contract with MURMUR CORE (see `MURMUR - CORE/scripts/animal_priority.js`):
 * this pack publishes a presence beacon (world DPs + `murmur_animal:beacon`
 * scriptevent) listing the exact typeIds it serves. MURMUR CORE yields those
 * types whenever the beacon is fresh, so farm animals always prioritize
 * ANIMAL CORE + ANIMAL PACK over any CORE content pack (Uncanny, Praise, ...).
 * Script runtimes are isolated per behavior pack, so presence is signalled
 * through shared world state, never through `globalThis`.
 */

export const ANIMAL_PRESENCE_KEY = "murmur_animal:core_present";
export const ANIMAL_CLAIMS_KEY = "murmur_animal:claims";
export const ANIMAL_BEACON_EVENT = "murmur_animal:beacon";

// Exact typeIds served by the animal stack. Exact-match (NOT substring):
// the old `includes("pig")` check also matched piglins/hoglins/zoglins and
// would have stolen Nether content from MURMUR CORE packs.
export const ANIMAL_CLAIM_TYPES = [
    "minecraft:chicken",
    "minecraft:cow",
    "minecraft:sheep",
    "minecraft:pig",
    "minecraft:rabbit",
    "minecraft:llama",
    "minecraft:trader_llama",
    "minecraft:horse",
    "minecraft:donkey",
    "minecraft:mule",
    "minecraft:mooshroom"
];

export function isAnimalType(typeId) {
    return ANIMAL_CLAIM_TYPES.includes(String(typeId || ""));
}

/**
 * Publish the presence beacon. Called on load, on a slow interval, and when a
 * player spawns, so MURMUR CORE notices quickly but the cost stays trivial
 * (two small DP writes + one scriptevent every few seconds).
 */
export function publishAnimalBeacon() {
    try {
        world.setDynamicProperty(ANIMAL_PRESENCE_KEY, system.currentTick);
    } catch (e) { /* DPs unavailable — beacon scriptevent still carries presence */ }
    try {
        world.setDynamicProperty(ANIMAL_CLAIMS_KEY, JSON.stringify(ANIMAL_CLAIM_TYPES));
    } catch (e) { /* long worlds with many DPs may refuse writes; non-fatal */ }
    try {
        world.getDimension("overworld").runCommand(
            `scriptevent ${ANIMAL_BEACON_EVENT} ${JSON.stringify(ANIMAL_CLAIM_TYPES)}`
        );
    } catch (e) { /* command dispatch can fail during startup; the DP still signals */ }
}

// Initialize global storage if not present
if (!globalThis.MURMUR_ANIMAL_DATA) {
    globalThis.MURMUR_ANIMAL_DATA = {};
}

// Global API Object
export const MurmurAnimalAPI = {
    registerContent: (config) => {
        const { typeId, names, dialogue } = config;

        if (!isAnimalType(typeId)) {
            console.warn(`[MURMUR ANIMAL] Non-animal type ${typeId} blocked from Animal Core.`);
            return;
        }

        globalThis.MURMUR_ANIMAL_DATA[typeId] = {
            names: names || [],
            dialogue: dialogue || {}
        };
        
        console.log(`[MURMUR ANIMAL] Registered: ${typeId}`);
    }
};

globalThis.MurmurAnimalAPI = MurmurAnimalAPI;

// --- CHUNKED DATA BRIDGE ---
const ANIMAL_CHUNK_BUFFER = {};

system.afterEvents.scriptEventReceive.subscribe((event) => {
    if (event.id === "murmur_animal:data") {
        try {
            const pipes = [];
            let pos = -1;
            while ((pos = event.message.indexOf("|", pos + 1)) !== -1 && pipes.length < 4) {
                pipes.push(pos);
            }

            const packId = event.message.slice(0, pipes[0]);
            const typeId = event.message.slice(pipes[0] + 1, pipes[1]);
            const chunkIdx = parseInt(event.message.slice(pipes[1] + 1, pipes[2]));
            const total = parseInt(event.message.slice(pipes[2] + 1, pipes[3]));
            const dataChunk = event.message.slice(pipes[3] + 1);

            const bufferKey = `${packId}:${typeId}`;
            if (!ANIMAL_CHUNK_BUFFER[bufferKey]) {
                ANIMAL_CHUNK_BUFFER[bufferKey] = new Array(total).fill(null);
            }

            ANIMAL_CHUNK_BUFFER[bufferKey][chunkIdx] = dataChunk;

            if (ANIMAL_CHUNK_BUFFER[bufferKey].every(c => c !== null)) {
                const fullData = JSON.parse(ANIMAL_CHUNK_BUFFER[bufferKey].join(""));
                delete ANIMAL_CHUNK_BUFFER[bufferKey];

                MurmurAnimalAPI.registerContent({
                    typeId: typeId,
                    names: fullData.names,
                    dialogue: fullData.dialogue
                });
                console.log(`[MURMUR ANIMAL] Cross-pack registration complete: ${packId} -> ${typeId}`);
            }
        } catch (e) {
            console.error(`[MURMUR ANIMAL] Error reassembling chunk: ${e}`);
        }
    }
});

console.log("[MURMUR ANIMAL] API Initialized (Standalone Mode).");
