import { system, world } from "@minecraft/server";
import {
    CHICKEN_DIALOGUE, COW_DIALOGUE, SHEEP_DIALOGUE, PIG_DIALOGUE,
    HORSE_DIALOGUE, LLAMA_DIALOGUE
} from "./dialogue.js";
import { DIALOGUE_ES } from "./dialogue_es.js";
import { DIALOGUE_PT } from "./dialogue_pt.js";

const PACK_ID = "animal";
const CHUNK_SIZE = 1500;

function sendRegistration() {
    world.sendMessage(`§8[MURMUR ANIMAL] Starting registration...`);

    const DIALOGUE_MAP = {
        "minecraft:chicken": CHICKEN_DIALOGUE,
        "minecraft:cow": COW_DIALOGUE,
        "minecraft:sheep": SHEEP_DIALOGUE,
        "minecraft:pig": PIG_DIALOGUE,
        "minecraft:horse": HORSE_DIALOGUE,
        "minecraft:llama": LLAMA_DIALOGUE,
        "minecraft:mule": HORSE_DIALOGUE,
        "minecraft:donkey": HORSE_DIALOGUE,
        "minecraft:trader_llama": LLAMA_DIALOGUE
    };

    const overworld = world.getDimension("overworld");

    try {
        for (const [typeId, pool] of Object.entries(DIALOGUE_MAP)) {
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
                "en_US": []
            };
            if (DIALOGUE_ES[typeId]?.names) {
                multiLangNames["es_ES"] = DIALOGUE_ES[typeId].names;
            }


            const data = JSON.stringify({ names: multiLangNames, dialogue: multiLangDialogue });
            const chunks = [];
            for (let i = 0; i < data.length; i += CHUNK_SIZE) {
                chunks.push(data.slice(i, i + CHUNK_SIZE));
            }

            chunks.forEach((chunk, idx) => {
                const header = `${PACK_ID}|${typeId}|${idx}|${chunks.length}|`;
                overworld.runCommand(`scriptevent murmur_animal:data ${header}${chunk}`);
            });
        }
        world.sendMessage(`§8[MURMUR ANIMAL] ${Object.keys(DIALOGUE_MAP).length} profiles sent.`);
    } catch (e) {
        world.sendMessage(`§c[MURMUR ANIMAL] Registration CRASHED: ${e}`);
    }
}

system.runTimeout(() => { sendRegistration(); }, 120);
