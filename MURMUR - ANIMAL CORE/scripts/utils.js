// --- ANIMAL CORE UTILS ---
export const chatterCooldowns = new Map();

export function getRandomElement(arr) {
    if (!arr || arr.length === 0) return null;
    return arr[Math.floor(Math.random() * arr.length)];
}

export function selectName(typeId) {
    const lang = globalThis.MURMUR_DATA?.LANG || "en_US";
    const names = globalThis.MURMUR_ANIMAL_DATA?.[typeId]?.names;

    let pool = [];
    if (names) {
        pool = names[lang] || names["en_US"] || (Array.isArray(names) ? names : []);
    }

    if (pool.length === 0) return null;
    return getRandomElement(pool);
}

export function getItemDescription(itemId) {
    if (!itemId) return globalThis.t ? globalThis.t("item.air") : "empty hands";

    // Check if we have a translation for it
    const cleanId = itemId.includes(":") ? itemId.split(":")[1] : itemId;
    const translationKey = `item.${cleanId}`;

    if (globalThis.t) {
        const trans = globalThis.t(translationKey);
        if (trans !== translationKey) return trans;
    }

    return cleanId.replace(/_/g, " ");
}

export function getHealthTier(player) {
    if (!player) return "nothing";
    try {
        const health = player.getComponent("minecraft:health");
        if (!health) return "something";
        const percent = health.currentValue / health.defaultValue;

        let tier = "1";
        if (percent >= 0.9) tier = "1";
        else if (percent >= 0.6) tier = "2";
        else if (percent >= 0.3) tier = "3";
        else tier = "4";

        if (globalThis.t) {
            return globalThis.t(`health.animal.${tier}`);
        }

        const fallback = {
            "1": "lively",
            "2": "scuffed up",
            "3": "weak",
            "4": "dying"
        };
        return fallback[tier];
    } catch (e) { return "mortal"; }
}

/**
 * Specialized Animal Chat: Formats as action text (e.g., *Cow grazes peacefully*)
 */
    export function sendCleanChat(entity, text, playersInRange) {
        if (!entity?.isValid() || !playersInRange || playersInRange.length === 0) return;
        // Hard guard: a player must never be rendered as an animal speaker, which
        // is what made the player look like they were talking in chat.
        if (entity.typeId && entity.typeId.includes("player")) return;

        // Never fall back to the raw typeId -- that announced animals as
        // "Sheep" / "Cow" and made them read as whoever was being addressed.
        const typeTail = entity.typeId ? entity.typeId.split(":")[1] : "";
        let nameTag = entity.nameTag ? entity.nameTag.split("\n")[0].trim() : "";
        if (!nameTag || nameTag === typeTail) {
            const generated = selectName(entity.typeId);
            nameTag = generated || "Animal";
        }

        // Formatting as italicized action text (Yellow/Gold color §e)
        const formattedMessage = `§e* ${nameTag} ${text} *§r`;

        for (const player of playersInRange) {
            if (!player?.isValid()) continue;
            try {
                player.sendMessage(formattedMessage);
            } catch (e) { }
        }
    }
