import { world, system, EntityComponentTypes } from "@minecraft/server";
import { publishAnimalBeacon } from "./api.js"; // Presence beacon: CORE yields our animals when fresh
import "./api.js"; // Initialize API and global data
import { chatterCooldowns, getRandomElement, selectName, sendCleanChat, getItemDescription, getHealthTier } from "./utils.js";

// Announce ourselves so MURMUR CORE (if installed) yields farm animals to us.
// Priority rule: animals ALWAYS prefer ANIMAL CORE + ANIMAL PACK over any CORE
// content pack. Refresh slowly; CORE treats a stale beacon as "not installed".
system.runTimeout(() => { publishAnimalBeacon(); }, 20);
system.runInterval(() => { publishAnimalBeacon(); }, 200);

// Unwrap a (possibly multilingual) dialogue pool for the active language
function getAnimalPool(pool, cond) {
    if (!pool) return null;
    const lines = pool[cond];
    if (!lines) return null;
    if (Array.isArray(lines)) return lines;
    const lang = globalThis.MURMUR_DATA?.LANG || "en_US";
    return lines[lang] || lines["en_US"] || null;
}

// --- Villager conversation exclusivity (reads CORE's published windows) ---
const VILLAGER_TALK_RADIUS = 16;

function villagerTalkBusyNear(location, dimId) {
    const windows = globalThis.__MURMUR_VILLAGER_TALK__;
    if (!Array.isArray(windows) || windows.length === 0) return false;
    const now = Date.now();
    const r2 = VILLAGER_TALK_RADIUS * VILLAGER_TALK_RADIUS;
    for (const w of windows) {
        if (!w || w.until <= now) continue;
        if (w.dimId !== dimId) continue;
        const dx = w.x - location.x, dy = w.y - location.y, dz = w.z - location.z;
        if (dx * dx + dy * dy + dz * dz <= r2) return true;
    }
    return false;
}

// --- OPTIMIZED ANIMAL QUEUE CONTROLLER ---
let entityIterator = null;
system.runInterval(() => {
    const DATA = globalThis.MURMUR_ANIMAL_DATA || {};
    const targetTypes = Object.keys(DATA);
    if (targetTypes.length === 0) return;

    if (!entityIterator) {
        let allEntities = [];
        for (const dimId of ["overworld", "nether", "the_end"]) {
            try {
                const dimension = world.getDimension(dimId);
                const foundInDim = dimension.getEntities({ types: targetTypes });
                if (foundInDim) {
                    allEntities = allEntities.concat(foundInDim);
                }
            } catch (e) { }
        }
        entityIterator = allEntities[Symbol.iterator]();
    }

    // Process a small chunk of animals per interval to stay lightweight
    for (let i = 0; i < 3; i++) {
        const next = entityIterator.next();
        if (next.done) {
            entityIterator = null;
            break;
        }

        const entity = next.value;
        if (!entity || !entity.isValid()) continue;
        if (entity.typeId && entity.typeId.includes("player")) continue; // never speak as a player

        // Villager dialogue in MURMUR CORE owns the local "stage". CORE publishes
        // its conversation windows on globalThis; without respecting them animals
        // kept talking straight through a villager exchange, which read as the
        // sheep "replying" to the villager.
        if (villagerTalkBusyNear(entity.location, entity.dimension.id)) continue;

        // Proximity check for players
        const players = entity.dimension.getEntities({
            location: entity.location,
            maxDistance: 7,
            types: ["minecraft:player"]
        });
        if (!players || players.length === 0) continue;

        // Auto-naming -- always, not just when the tag is empty, so an animal can
        // never be announced by its raw typeId ("Sheep", "Cow") by sendCleanChat.
        if (!entity.nameTag || entity.nameTag === entity.typeId.split(":")[1]) {
            const pickedName = selectName(entity.typeId);
            if (pickedName) entity.nameTag = pickedName;
        }

        const lastChat = chatterCooldowns.get(entity.id) || 0;
        if (Date.now() - lastChat < 30000) continue; // Animals chatter less frequently

        if (Math.random() < 0.1) {
            chatterCooldowns.set(entity.id, Date.now());
            const pool = DATA[entity.typeId]?.dialogue;
            if (!pool) continue;

            const timeOfDay = world.getTimeOfDay();
            const isNight = timeOfDay >= 13000 && timeOfDay <= 23000;
            const isRaining = world.isRaining;

            let isWounded = false;
            try {
                const health = entity.getComponent("minecraft:health");
                if (health) isWounded = health.currentValue <= (health.defaultValue / 3);
            } catch (e) { }

            // --- CONTEXTUAL DETECTION ENGINE ---
            const targetPlayer = players[0];
            let specialPool = null;

            // 1. Behavior Detection
            if (targetPlayer.isSneaking && getAnimalPool(pool, "sneaking")) {
                specialPool = getAnimalPool(pool, "sneaking");
            } else if (targetPlayer.getVelocity().y > 0.2 && getAnimalPool(pool, "jumping")) {
                specialPool = getAnimalPool(pool, "jumping");
            }

            // 2. Equipment Awareness (Random chance to notice)
            if (!specialPool && Math.random() < 0.3) {
                try {
                    const equip = targetPlayer.getComponent("minecraft:equippable");
                    const mainHand = equip?.getEquipment("Mainhand")?.typeId;
                    if ((mainHand?.includes("sword") || mainHand?.includes("axe")) && getAnimalPool(pool, "holding_weapon")) {
                        specialPool = getAnimalPool(pool, "holding_weapon");
                    } else if (mainHand?.includes("spyglass") && getAnimalPool(pool, "holding_useful")) {
                        specialPool = getAnimalPool(pool, "holding_useful");
                    }
                } catch (e) { }
            }

            // 3. Environmental Awareness (Low frequency)
            if (!specialPool && system.currentTick % 100 === 0) {
                try {
                    const block = targetPlayer.dimension.getBlock(targetPlayer.location);
                    if (getAnimalPool(pool, "jukebox")) {
                        // Check for jukeboxes nearby (simplified)
                        specialPool = getAnimalPool(pool, "jukebox");
                    } else if (getAnimalPool(pool, "wealth")) {
                        // Check for wealth blocks (simplified)
                        specialPool = getAnimalPool(pool, "wealth");
                    }
                } catch (e) { }
            }

            let activeTextPool = specialPool || getAnimalPool(pool, "proximity");
            if (!specialPool) {
                if (isWounded && getAnimalPool(pool, "wounded")) activeTextPool = getAnimalPool(pool, "wounded");
                else if (isNight && getAnimalPool(pool, "night")) activeTextPool = getAnimalPool(pool, "night");
                else if (isRaining && getAnimalPool(pool, "rain")) activeTextPool = getAnimalPool(pool, "rain");
            }

            if (activeTextPool) {
                const rawLine = getRandomElement(activeTextPool);
                let processedLine = rawLine;

                // --- PLACEHOLDER RESOLUTION ---
                let heldItemName = "nothing";
                let healthStatus = "okay";

                try {
                    const equipment = targetPlayer.getComponent("minecraft:equippable");
                    const mainHand = equipment?.getEquipment("Mainhand");
                    heldItemName = getItemDescription(mainHand?.typeId);
                    healthStatus = getHealthTier(targetPlayer);
                } catch (e) { }

                if (processedLine.includes("{item}")) processedLine = processedLine.replace(/{item}/g, heldItemName);
                if (processedLine.includes("{health}")) processedLine = processedLine.replace(/{health}/g, healthStatus);
                if (processedLine.includes("{name}")) processedLine = processedLine.replace(/{name}/g, targetPlayer.nameTag || "the guest");

                sendCleanChat(entity, processedLine, players);
            }
        }
    }
}, 5);

// --- HURT & DEATH LOGIC ---
world.afterEvents.entityHurt.subscribe((event) => {
    const victim = event.hurtEntity;
    if (!victim || !victim.isValid()) return;

    const pool = globalThis.MURMUR_ANIMAL_DATA?.[victim.typeId]?.dialogue;
    const woundedPool = pool ? getAnimalPool(pool, "wounded") : null;
    if (!woundedPool) return;

    const lastChat = chatterCooldowns.get(victim.id) || 0;
    if (Date.now() - lastChat < 8000) return;

    const players = victim.dimension.getEntities({
        location: victim.location, maxDistance: 10, types: ["minecraft:player"]
    });
    if (!players || players.length === 0) return;

    chatterCooldowns.set(victim.id, Date.now());
    const line = getRandomElement(woundedPool);
    sendCleanChat(victim, line, players);
});

world.afterEvents.entityDie.subscribe((event) => {
    const deadEntity = event.deadEntity;
    if (!deadEntity) return;

    const pool = globalThis.MURMUR_ANIMAL_DATA?.[deadEntity.typeId]?.dialogue;
    const deathPool = pool ? getAnimalPool(pool, "death") : null;
    if (!deathPool) return;

    const witnesses = deadEntity.dimension.getEntities({
        location: deadEntity.location,
        maxDistance: 8,
        types: [deadEntity.typeId]
    });

    for (const witness of witnesses) {
        if (!witness || !witness.isValid() || witness.id === deadEntity.id) continue;

        const players = witness.dimension.getEntities({
            location: witness.location, maxDistance: 8, types: ["minecraft:player"]
        });
        if (players && players.length > 0) {
            const line = getRandomElement(deathPool);
            sendCleanChat(witness, line, players);
            break;
        }
    }
});

// Cleanup cooldowns
system.runInterval(() => {
    const now = Date.now();
    for (const [id, time] of chatterCooldowns.entries()) {
        if (now - time > 60000) chatterCooldowns.delete(id);
    }
}, 1500);

// --- INIT WARNINGS (on player spawn / world load) ---
function sendAnimalCoreInit(player) {
    if (!player || !player.isValid()) return;
    const lines = [
        "§6§l[MURMUR ANIMAL] §r§eANIMAL CORE loaded.",
        "§c§lREQUIRED PACK: §r§7You must have ONE MURMUR content pack installed:",
        "§7  • Animal Pack  →  requires §fANIMAL CORE§7 (this).",
        "§7  • Brainrot, Cruel, Medieval, Noir, Praise, Uncanny  →  require §fMURMUR CORE§7.",
        "§a§lCOMPATIBLE: §r§7MURMUR CORE packs (Uncanny, Praise, ...) may run alongside this. Farm animals always prioritize ANIMAL CORE.",
        "§c§lDEPENDENCIES: §r§7Make sure you have all dependencies. READ THE MOD PAGE.",
        "§c§lEXPERIMENTAL: §r§7If animals stay silent, enable Experimental Settings / Beta APIs for this world (see mod page).",
        "§bCredits: Scalarlabs. §7Look for my other addons on Curseforge."
    ];
    lines.forEach((line, i) => system.runTimeout(() => {
        if (player.isValid()) player.sendMessage(line);
    }, i * 4));
}

world.afterEvents.playerSpawn.subscribe((event) => {
    if (event.initialSpawn) {
        sendAnimalCoreInit(event.player);
    }
    // Re-beacon on spawns (covers dimension travel / late CORE load).
    try { publishAnimalBeacon(); } catch (e) { }
});
