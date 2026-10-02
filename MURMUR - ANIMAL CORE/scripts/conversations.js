import { system } from "@minecraft/server";
import { getRandomElement, selectName, sendCleanChat } from "./utils.js";

export function handleVillagerConversation(entity, currentPlayers) {
    const lines = [
        ["Hey {name}... did you do the thing?", "What thing, {name}?", "...I forgot."],
        ["I had bread. I think I had bread.", "I need more bread, {name}."],
        ["He broke things, {name}.", "I forgot what I was doing."],
        ["Strange day today, {name}...", "Still feels like a strange day..."]
    ];

    const conversation = getRandomElement(lines);
    let currentStage = 0;

    function runStage() {
        const nearbyVillagers = entity.dimension.getEntities({
            location: entity.location,
            maxDistance: 6,
            types: ["minecraft:villager_v2"]
        }).filter(e => e.id !== entity.id);

        const primaryNeighbor = nearbyVillagers ? nearbyVillagers[0] : null;

        if (currentStage % 2 === 0 && (!entity || !entity.isValid())) return;
        if (currentStage % 2 !== 0 && (!primaryNeighbor || !primaryNeighbor.isValid())) return;

        const activePlayers = (currentStage % 2 === 0 ? entity : primaryNeighbor).dimension.getEntities({
            location: (currentStage % 2 === 0 ? entity : primaryNeighbor).location,
            maxDistance: 8,
            types: ["minecraft:player"]
        });
        if (!activePlayers || activePlayers.length === 0) return;

        if (primaryNeighbor && !primaryNeighbor.nameTag) {
            const pName = selectName(primaryNeighbor.typeId);
            if (pName) primaryNeighbor.nameTag = pName;
        }
        if (entity && entity.isValid() && !entity.nameTag) {
            const eName = selectName(entity.typeId);
            if (eName) entity.nameTag = eName;
        }

        let speaker = entity;
        let listenerName = (primaryNeighbor ? primaryNeighbor.nameTag : "someone") || "someone";

        if (currentStage % 2 !== 0) {
            speaker = primaryNeighbor;
            listenerName = entity.nameTag || "someone";
        }

        if (speaker && speaker.isValid() && speaker.typeId !== "minecraft:player") {
            const finalProcessedLine = conversation[currentStage].replace(/{name}/g, listenerName);
            sendCleanChat(speaker, finalProcessedLine, activePlayers);
        }

        currentStage++;
        if (currentStage < conversation.length) {
            system.runTimeout(runStage, Math.floor(Math.random() * 40) + 30);
        }
    }
    runStage();
}
