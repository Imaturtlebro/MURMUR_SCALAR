import { world } from "@minecraft/server";

// Default configuration
const DEFAULT_LANG = "en_US";
const PROP_KEY = "murmur:lang";

// Initialize global storage if not present
if (!globalThis.MURMUR_DATA) {
    globalThis.MURMUR_DATA = {};
}

if (!globalThis.MURMUR_DATA.TRANSLATIONS) {
    globalThis.MURMUR_DATA.TRANSLATIONS = {
        "en_US": {
            "health.tier.1": "disgustingly healthy",
            "health.tier.2": "mildly scuffed",
            "health.tier.3": "barely holding together",
            "health.tier.4": "one foot in the grave",
            "health.tier.5": "mortal",
            "health.animal.1": "lively",
            "health.animal.2": "scuffed up",
            "health.animal.3": "weak",
            "health.animal.4": "dying",
            "item.air": "empty hands",
            "item.diamond_sword": "shiny sharp stick",
            "item.iron_sword": "metal bitey stick",
            "item.wooden_sword": "wooden stick",
            "item.bow": "stretchy wood",
            "item.tnt": "angry loud box",
            "item.diamond": "bright pebble",
            "item.gold_ingot": "heavy yellow stone",
            "item.dirt": "familiar ground",
            "item.wheat": "tasty stalks",
            "item.carrot": "crunchy orange root",
            "item.apple": "sweet round fruit",
            "item.golden_apple": "shiny sweet fruit",
            "item.lead": "the controlling string",
            "item.bucket": "water carrier",
            "general.unknown": "unknown",
            "general.ghost": "ghost",
            "general.someone": "someone"
        },
        "es_ES": {
            "health.tier.1": "asquerosamente sano",
            "health.tier.2": "levemente herido",
            "health.tier.3": "apenas aguantando",
            "health.tier.4": "con un pie en la tumba",
            "health.tier.5": "mortal",
            "health.animal.1": "animado",
            "health.animal.2": "un poco herido",
            "health.animal.3": "débil",
            "health.animal.4": "muriendo",
            "item.air": "manos vacías",
            "item.diamond_sword": "palo afilado brillante",
            "item.iron_sword": "palo metálico que muerde",
            "item.wooden_sword": "palo de madera",
            "item.bow": "madera elástica",
            "item.tnt": "caja ruidosa y enojada",
            "item.diamond": "guijarro brillante",
            "item.gold_ingot": "piedra amarilla pesada",
            "item.dirt": "suelo familiar",
            "item.wheat": "tallos sabrosos",
            "item.carrot": "raíz naranja crujiente",
            "item.apple": "fruta redonda dulce",
            "item.golden_apple": "fruta dulce brillante",
            "item.lead": "la cuerda de control",
            "item.bucket": "portador de agua",
            "general.unknown": "desconocido",
            "general.ghost": "fantasma",
            "general.someone": "alguien"
        },
        "pt_BR": {
            "health.tier.1": "saudável",
            "health.tier.2": "um pouco machucado",
            "health.tier.3": "segurando pelas pontas",
            "health.tier.4": "com um pé na cova",
            "health.tier.5": "mortal",
            "health.animal.1": "vivaz",
            "health.animal.2": "meio machucado",
            "health.animal.3": "fraco",
            "health.animal.4": "morrendo",
            "item.air": "mãos vazias",
            "item.diamond_sword": "pau afiado brilhante",
            "item.iron_sword": "pau de metal que morde",
            "item.wooden_sword": "pau de madeira",
            "item.bow": "madeira elástica",
            "item.tnt": "caixa barulhenta e brava",
            "item.diamond": "seixinho brilhante",
            "item.gold_ingot": "pedra amarela pesada",
            "item.dirt": "chão familiar",
            "item.wheat": "talos gostosos",
            "item.carrot": "raiz laranja crocante",
            "item.apple": "fruta redonda doce",
            "item.golden_apple": "fruta doce brilhante",
            "item.lead": "o cordão de controle",
            "item.bucket": "carregador de água",
            "general.unknown": "desconhecido",
            "general.ghost": "fantasma",
            "general.someone": "alguém"
        }
    };
}

/**
 * Get the current language for the session.
 */
export function getLanguage() {
    if (globalThis.MURMUR_DATA.LANG) return globalThis.MURMUR_DATA.LANG;
    try {
        const saved = world.getDynamicProperty(PROP_KEY);
        if (saved) {
            globalThis.MURMUR_DATA.LANG = saved;
            return saved;
        }
    } catch (e) { }
    return DEFAULT_LANG;
}

/**
 * Sets the global language and persists it.
 */
export function setLanguage(lang) {
    globalThis.MURMUR_DATA.LANG = lang;
    try {
        world.setDynamicProperty(PROP_KEY, lang);
    } catch (e) { }
    console.log(`[MURMUR CORE] Language switched to: ${lang}`);
}

/**
 * Translates a key into the current language.
 * @param {string} key The translation key.
 * @param {Object} tokens Optional tokens to replace in the string.
 */
export function t(key, tokens = {}) {
    const lang = getLanguage();
    let text = globalThis.MURMUR_DATA.TRANSLATIONS[lang]?.[key] ||
        globalThis.MURMUR_DATA.TRANSLATIONS[DEFAULT_LANG]?.[key] ||
        key;

    for (const [token, value] of Object.entries(tokens)) {
        text = text.replace(new RegExp(`{${token}}`, "g"), value);
    }

    return text;
}

/**
 * Registers new translations.
 */
export function registerTranslations(lang, data) {
    if (!globalThis.MURMUR_DATA.TRANSLATIONS[lang]) {
        globalThis.MURMUR_DATA.TRANSLATIONS[lang] = {};
    }
    Object.assign(globalThis.MURMUR_DATA.TRANSLATIONS[lang], data);
}

