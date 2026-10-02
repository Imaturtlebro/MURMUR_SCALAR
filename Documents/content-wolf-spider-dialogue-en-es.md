increase rate of chatter.


add wolf and spider.



Here is the updated code to add **Wolves** and **Spiders** to your system. I've written the new dialogue strings in both English and Spanish, maintaining the atmospheric, gritty, and slightly eerie tone of your project, and updated the registration logic to include them.

### 1. Update `dialogue.js`

Add these two exports to the bottom of your English dialogue file.

```javascript
export const WOLF_DIALOGUE = {
    proximity: [
        "watches you with sharp, calculating eyes",
        "lowers its head, sniffing your track cautiously",
        "lets out a low, vibrating growl from its chest",
        "flicks its ears, listening to the ambient woods",
        "paces slowly around you, keeping its distance",
        "tilts its head, evaluating how {health} you look",
        "stares intently at your {item} with bared teeth",
        "pants quietly, a puff of condensation escaping its jaws",
        "stops and sniffs the wind, catching a scent behind you",
        "licks its chops with a slow, unsettling focus"
    ],
    rain: [
        "shakes its fur violently, sending spray everywhere",
        "keeps its nose low to the ground despite the downpour",
        "looks slicked back and lethal in the driving rain",
        "bites at the falling raindrops in frustration",
        "lowers its tail, tracking you through the thick mist"
    ],
    night: [
        "stares into the pitch blackness with glowing eyes",
        "lets out a faint, spine-chilling whine into the dark",
        "blends seamlessly into the midnight shadows",
        "stands perfectly rigid, watching the dark treeline",
        "gives a quiet, warning chuff at a shifting silhouette"
    ],
    wounded: [
        "snarls fiercely, exposing blood-flecked teeth",
        "yelps in sharp pain, snapping wildly at the air",
        "retreats into the brush with a low, defensive hiss",
        "limps heavily but keeps its predatory focus locked on you"
    ],
    death: [
        "lets out a final, tragic whimper",
        "collapses heavily into the dirt, its breathing cutting short",
        "goes entirely limp, its piercing eyes losing focus"
    ]
};

export const SPIDER_DIALOGUE = {
    proximity: [
        "clicks its mandibles together in a sickening rhythm",
        "shifts its weight across eight spindly legs",
        "stares at you with multiple unblinking, glassy eyes",
        "scuttles forward in a sudden, violent burst of speed",
        "rears back slightly, sensing the vibrations of your footsteps",
        "hisses softly, its chitinous shell scraping the ground",
        "evaluates your {health} state like caught prey",
        "twitches its front legs toward your {item}",
        "stands frozen, blending into the surrounding architecture"
    ],
    rain: [
        "clings tightly to a block as water slicks its shell",
        "scuttles restlessly to find a dry vertical surface",
        "hisses as raindrops disturb its sensory hairs",
        "moves with silent, glistening malice through the downpour"
    ],
    night: [
        "eyes glow with a faint, malicious red brilliance",
        "scuttles along the ceiling of the dark canopy",
        "waits in absolute stillness for a target to wander by",
        "makes a wet, clicking sound that echoes in the blackness",
        "prepares to drop silently from the shadows above"
    ],
    wounded: [
        "screeches in a high-pitched, grinding hiss",
        "thrashing its legs wildly in a panicked frenzy",
        "scuttles backward erratically, seeking a wall to climb",
        "leaps blindly in a desperate, violent counter-attack"
    ],
    death: [
        "curls its legs tightly inward as it collapses",
        "lets out a long, deflating hiss",
        "rolls onto its back, its many eyes going dull"
    ]
};

```

---

### 2. Update `dialogue_es.js`

Add these definitions to your Spanish file, and make sure to update the final `DIALOGUE_ES` object mapping at the bottom.

```javascript
export const WOLF_DIALOGUE_ES = {
    proximity: [
        "te observa con ojos afilados y calculadores",
        "baja la cabeza, olfateando tu rastro con cautela",
        "da un gruñido bajo y vibrante desde el pecho",
        "mueve las orejas, escuchando los sonidos del bosque",
        "camina lentamente a tu alrededor, manteniendo su distancia",
        "inclina la cabeza, evaluando lo {health} que te ves",
        "mira fijamente tu {item} con los dientes descubiertos",
        "jadea silenciosamente, soltando un vaho de condensación",
        "se detiene y olfatea el viento, captando un olor detrás de ti",
        "se lame los labios con un enfoque lento e inquietante"
    ],
    rain: [
        "sacude su pelaje violentamente, lanzando agua por todas partes",
        "mantiene el hocico pegado al suelo a pesar del aguacero",
        "se ve empapado y letal bajo la lluvia torrencial",
        "muerde las gotas de lluvia que caen con frustración",
        "baja la cola, siguiéndote a través de la densa niebla"
    ],
    night: [
        "mira hacia la negrura absoluta con ojos brillantes",
        "suelta un lamento tenue y escalofriante en la oscuridad",
        "se funde perfectamente con las sombras de la medianoche",
        "se queda perfectamente rígido, vigilando el linde oscuro del bosque",
        "da un resoplido silencioso de advertencia ante una silueta que se mueve"
    ],
    wounded: [
        "gruñe ferozmente, mostrando dientes manchados de sangre",
        "gime de dolor agudo, lanzando dentelladas al aire",
        "se retira hacia la maleza con un siseo bajo y defensivo",
        "cojea pesadamente pero mantiene su mirada depredadora fija en ti"
    ],
    death: [
        "suelta un último y trágico gemido",
        "se desploma pesadamente en la tierra, cortándose su respiración",
        "se queda completamente flácido, sus ojos penetrantes pierden el enfoque"
    ]
};

export const SPIDER_DIALOGUE_ES = {
    proximity: [
        "hace clic con sus mandíbulas en un ritmo repugnante",
        "cambia su peso a lo largo de sus ocho patas delgadas",
        "te mira con múltiples ojos vidriosos que no parpadean",
        "se desliza hacia adelante en un repentino y violento impulso de velocidad",
        "se yergue ligeramente, sintiendo las vibraciones de tus pasos",
        "sisea suavemente, su caparazón de quitina raspa el suelo",
        "evalúa tu estado {health} como si fueras una presa atrapada",
        "mueve sus patas delanteras hacia tu {item}",
        "se queda congelada, fundiéndose con la estructura circundante"
    ],
    rain: [
        "se aferra con fuerza a un bloque mientras el agua resbala por su caparazón",
        "se desplaza inquietamente para encontrar una superficie vertical seca",
        "sisea cuando las gotas de lluvia perturban sus pelos sensoriales",
        "se mueve con una malicia silenciosa y reluciente a través del aguacero"
    ],
    night: [
        "sus ojos brillan con un tenue y malicioso resplandor rojo",
        "se desliza a lo largo del techo de la densa copa de árboles",
        "espera en absoluta inmovilidad a que un objetivo pase cerca",
        "hace un sonido de clic húmedo que resuena en la negrura",
        "se prepara para dejarse caer silenciosamente desde las sombras superiores"
    ],
    wounded: [
        "chilla con un siseo agudo y chirriante",
        "agita sus patas salvajemente en un frenesí de pánico",
        "se desliza hacia atrás erráticamente, buscando una pared que trepar",
        "salta ciegamente en un contraataque desesperado y violento"
    ],
    death: [
        "encoge sus patas con fuerza hacia adentro mientras se desploma",
        "suelta un siseo largo que se desinfla",
        "se pone boca arriba, sus muchos ojos se vuelven opacos"
    ]
};

// UPDATE YOUR EXISTING DIALOGUE_ES OBJECT AT THE BOTTOM TO THIS:
export const DIALOGUE_ES = {
    "minecraft:chicken": CHICKEN_DIALOGUE_ES,
    "minecraft:cow": COW_DIALOGUE_ES,
    "minecraft:sheep": SHEEP_DIALOGUE_ES,
    "minecraft:pig": PIG_DIALOGUE_ES,
    "minecraft:horse": HORSE_DIALOGUE_ES,
    "minecraft:llama": LLAMA_DIALOGUE_ES,
    "minecraft:mule": HORSE_DIALOGUE_ES,
    "minecraft:donkey": HORSE_DIALOGUE_ES,
    "minecraft:trader_llama": LLAMA_DIALOGUE_ES,
    "minecraft:wolf": WOLF_DIALOGUE_ES,
    "minecraft:spider": SPIDER_DIALOGUE_ES,
    "minecraft:cave_spider": SPIDER_DIALOGUE_ES
};

```

---

### 3. Update `register.js`

Incorporate the new definitions into your import statements and expand the local `DIALOGUE_MAP` inside `sendRegistration()` so the loops catch them and fire them over the `scriptevent` architecture.

```javascript
import { system, world } from "@minecraft/server";
import {
    CHICKEN_DIALOGUE, COW_DIALOGUE, SHEEP_DIALOGUE, PIG_DIALOGUE,
    HORSE_DIALOGUE, LLAMA_DIALOGUE, WOLF_DIALOGUE, SPIDER_DIALOGUE
} from "./dialogue.js";
import { DIALOGUE_ES } from "./dialogue_es.js";

const PACK_ID = "animal";
const CHUNK_SIZE = 2000;

function sendRegistration() {
    console.log(`[MURMUR ANIMAL] Sending unified multi-language registration...`);

    const DIALOGUE_MAP = {
        "minecraft:chicken": CHICKEN_DIALOGUE,
        "minecraft:cow": COW_DIALOGUE,
        "minecraft:sheep": SHEEP_DIALOGUE,
        "minecraft:pig": PIG_DIALOGUE,
        "minecraft:horse": HORSE_DIALOGUE,
        "minecraft:llama": LLAMA_DIALOGUE,
        "minecraft:mule": HORSE_DIALOGUE,
        "minecraft:donkey": HORSE_DIALOGUE,
        "minecraft:trader_llama": LLAMA_DIALOGUE,
        "minecraft:wolf": WOLF_DIALOGUE,
        "minecraft:spider": SPIDER_DIALOGUE,
        "minecraft:cave_spider": SPIDER_DIALOGUE
    };

    const overworld = world.getDimension("overworld");

    for (const [typeId, pool] of Object.entries(DIALOGUE_MAP)) {

        // 1. Build a combined language object for every event condition
        const multiLangDialogue = {};
        for (const condition of Object.keys(pool)) {
            multiLangDialogue[condition] = {
                "en_US": pool[condition],
                "es_ES": DIALOGUE_ES[typeId]?.[condition] || pool[condition]
            };
        }

        // 2. Build a combined language object for name pools
        const multiLangNames = {
            "en_US": [],
            "es_ES": []
        };

        const data = JSON.stringify({
            names: multiLangNames,
            dialogue: multiLangDialogue
        });

        const chunks = [];
        for (let i = 0; i < data.length; i += CHUNK_SIZE) {
            chunks.push(data.slice(i, i + CHUNK_SIZE));
        }

        chunks.forEach((chunk, idx) => {
            const msg = `${PACK_ID}|${typeId}|${idx}|${chunks.length}|${chunk}`;
            overworld.runCommand(`scriptevent murmur:data ${msg}`);
        });
    }
}

system.runTimeout(() => {
    sendRegistration();
}, 120);

```