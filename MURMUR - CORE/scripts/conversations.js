import { system } from "@minecraft/server";
import { getRandomElement, selectName, sendCleanChat, ensureNameTag } from "./utils.js";
import { getLanguage, t } from "./localization.js";
import { bumpVillagerOpinion, getReputation, adjustReputation } from "./memory.js";

const VILLAGER_CONVERSATIONS = {
    "en_US": [
        ["Hey {name}... did you do the thing?", "What thing, {name}?", "...I forgot."],
        ["I had bread. I think I had bread.", "I need more bread, {name}."],
        ["He broke things, {name}.", "I forgot what I was doing."],
        ["Strange day today, {name}...", "Still feels like a strange day..."]
    ],
    "es_ES": [
        ["Oye {name}... ¿hiciste lo que dijimos?", "¿Qué cosa, {name}?", "...ya se me olvidó."],
        ["Tenía pan. Creo que tenía pan.", "Necesito más pan, {name}."],
        ["Él rompió cosas, {name}.", "Se me olvidó lo que estaba haciendo."],
        ["Día extraño hoy, {name}...", "Todavía se siente como un día extraño..."]
    ]
};

export function handleVillagerConversation(entity, currentPlayers) {
    const lang = getLanguage();
    const linesPool = VILLAGER_CONVERSATIONS[lang] || VILLAGER_CONVERSATIONS["en_US"];

    const conversation = getRandomElement(linesPool);
    let currentStage = 0;

    // Resolve the conversation partner ONCE, up front, and hold it for the whole
    // exchange. Re-querying per stage let the partner drift or vanish mid-dialogue
    // (stage 0 spoke to a neighbour that no longer existed by stage 1), and the
    // even-stage guard never checked for a neighbour at all -- which is what made
    // villagers say "someone". No neighbour means no conversation.
    const nearbyVillagers = entity.dimension.getEntities({
        location: entity.location,
        maxDistance: 10,
        types: ["minecraft:villager_v2"]
    })
        // The `types` filter is NOT exact in this engine -- it can hand back
        // unrelated entities (a minecraft:player was showing up here). Always
        // re-check typeId ourselves before treating anything as a villager.
        .filter(e => e.id !== entity.id && e.isValid() && e.typeId === "minecraft:villager_v2");

    const primaryNeighbor = nearbyVillagers.length > 0 ? nearbyVillagers[0] : null;
    if (!primaryNeighbor) return false;

    // Both speakers are named before the first line, so {name} can never fall back.
    ensureNameTag(entity);
    ensureNameTag(primaryNeighbor);

    const entityName = entity.nameTag.split("\n")[0];
    const neighborName = primaryNeighbor.nameTag.split("\n")[0];

    // Both parties must genuinely be villagers. If a non-villager ever reaches
    // this point the dialogue would render an animal or a player in the villager
    // conversation slot, so refuse and shout about it instead of speaking.
    if (entity.typeId !== "minecraft:villager_v2" || primaryNeighbor.typeId !== "minecraft:villager_v2") {
        try {
            console.warn(`[MURMUR] villager conversation aborted - non-villager in cast: ${entity.typeId} / ${primaryNeighbor.typeId}`);
        } catch (e) { }
        return false;
    }

    function runStage() {
        if (!entity || !entity.isValid()) return;
        if (!primaryNeighbor || !primaryNeighbor.isValid()) return;

        const currentSpeaker = (currentStage % 2 === 0) ? entity : primaryNeighbor;
        if (!currentSpeaker || !currentSpeaker.isValid()) return;
        if (currentSpeaker.typeId !== "minecraft:villager_v2") return;

        const activePlayers = currentSpeaker.dimension.getEntities({
            location: currentSpeaker.location,
            maxDistance: 16,
            types: ["minecraft:player"]
        });
        if (!activePlayers || activePlayers.length === 0) return;

        // Dynamically grow cross-villager opinions ("one likes that guy, another hates him")
        if (Math.random() < 0.6) {
            bumpVillagerOpinion(entityName, neighborName, Math.random() < 0.65 ? 8 : -8);
            bumpVillagerOpinion(neighborName, entityName, Math.random() < 0.65 ? 8 : -8);
        }

        // Inter-faction rumor: if A holds a strong opinion of a nearby player,
        // some of that sentiment rubs off on B when they gossip.
        for (const pl of activePlayers) {
            if (pl.typeId !== "minecraft:player") continue;
            const aRep = getReputation(pl.name, entity.typeId, entityName);
            if (Math.abs(aRep) >= 10 && Math.random() < 0.25) {
                adjustReputation(pl.name, primaryNeighbor.typeId, neighborName, Math.sign(aRep) * 1, { kind: "rumor", target: entityName });
            }
        }

        // Stage even: entity speaks to neighbour. Stage odd: neighbour replies.
        const listenerName = (currentStage % 2 === 0) ? neighborName : entityName;

        const rawLine = conversation[currentStage];
        const finalProcessedLine = rawLine.replace(/{name}/g, listenerName);
        sendCleanChat(currentSpeaker, finalProcessedLine, activePlayers);

        currentStage++;
        if (currentStage < conversation.length) {
            system.runTimeout(runStage, Math.floor(Math.random() * 40) + 30);
        }
    }
    runStage();
    return true;
}
