import { world, system } from "@minecraft/server";
import "./api.js";
import { chatterCooldowns, getRandomElement, selectName, sendCleanChat, processTextLine, ensureNameTag, factionGroupFor, colorizeAddressee } from "./utils.js";
import { shouldCoreYield } from "./animal_priority.js";
import { handleVillagerConversation } from "./conversations.js";
import { getLanguage, t } from "./localization.js";
import { isFriendlySentient, getStatus, getGrudgeLine, getReputation } from "./memory.js";
import "./memoryEvents.js";

let entityIterator = null;

// --- Villager conversation exclusivity ---
// A villager pair mid-conversation owns the local "stage": other mobs nearby
// stay quiet until it finishes, so a passing sheep can never be misread as the
// other half of the villager's dialogue. Windows are time-boxed and keyed by
// dimension, and they expire on their own so a crashed/interrupted exchange can
// never permanently mute a mob.
const VILLAGER_TALK_RADIUS = 16;
const VILLAGER_TALK_WINDOW_MS = 12000;
const villagerTalkWindows = []; // { dimId, x, y, z, until }

function pruneVillagerTalkWindows() {
    const now = Date.now();
    for (let i = villagerTalkWindows.length - 1; i >= 0; i--) {
        if (villagerTalkWindows[i].until <= now) villagerTalkWindows.splice(i, 1);
    }
    // Re-publish so OTHER MURMUR packs (ANIMAL CORE runs its own chatter
    // interval in a separate pack) can see the window and hold silent too.
    // Without this, animals kept talking straight through villager dialogue.
    const live = villagerTalkWindows.filter(w => w.until > now);
    globalThis.__MURMUR_VILLAGER_TALK__ = live.map(w => ({
        dimId: w.dimId, x: w.x, y: w.y, z: w.z, until: w.until
    }));
}

function beginVillagerConversationWindow(entity) {
    pruneVillagerTalkWindows();
    const loc = entity.location;
    villagerTalkWindows.push({
        dimId: entity.dimension.id,
        x: loc.x, y: loc.y, z: loc.z,
        until: Date.now() + VILLAGER_TALK_WINDOW_MS
    });
    pruneVillagerTalkWindows();
}

function villagerTalkBusyNear(location, dimId) {
    pruneVillagerTalkWindows();
    const r2 = VILLAGER_TALK_RADIUS * VILLAGER_TALK_RADIUS;
    for (const w of villagerTalkWindows) {
        if (w.dimId !== dimId) continue;
        const dx = w.x - location.x, dy = w.y - location.y, dz = w.z - location.z;
        if (dx * dx + dy * dy + dz * dz <= r2) return true;
    }
    return false;
}

// Attempts to open a villager conversation. Returns false when the villager has
// no partner nearby, so the caller can fall through to normal chatter.
function startVillagerConversation(entity) {
    return handleVillagerConversation(entity);
}

// --- Helpers ---
const ZOMBIE_TYPES = ["minecraft:zombie", "minecraft:drowned", "minecraft:husk", "minecraft:zombie_villager", "minecraft:zombified_piglin"];
const ILLAGER_TYPES = ["minecraft:pillager", "minecraft:vindicator", "minecraft:evoker", "minecraft:ravager", "minecraft:witch", "minecraft:illusioner"];
const ANIMAL_TYPES = ["minecraft:cow", "minecraft:pig", "minecraft:sheep", "minecraft:chicken", "minecraft:wolf", "minecraft:cat", "minecraft:horse", "minecraft:donkey", "minecraft:mule", "minecraft:rabbit", "minecraft:fox", "minecraft:panda"];

function isZombie(typeId) { return ZOMBIE_TYPES.some(t => typeId.includes(t.split(":")[1])); }
function isIllager(typeId) { return ILLAGER_TYPES.some(t => typeId.includes(t.split(":")[1])); }
function isAnimal(typeId) { return ANIMAL_TYPES.some(t => typeId.includes(t.split(":")[1])); }

function getCountNearby(entity, maxDistance) {
    try {
        return entity.dimension.getEntities({ location: entity.location, maxDistance }).length;
    } catch (e) { return 0; }
}

function countEmeralds(entity) {
    try {
        const inv = entity.getComponent("minecraft:inventory")?.container;
        if (!inv) return 0;
        let count = 0;
        for (let i = 0; i < inv.size; i++) {
            const item = inv.getItem(i);
            if (item?.typeId?.includes("emerald")) count += item.amount;
        }
        return count;
    } catch (e) { return 0; }
}

// Infinite Ticked Processing Loop
system.runInterval(() => {
    if (globalThis.MURMUR_DATA.CHATTER_ENABLED === false) return;
    const DIALOGUE = globalThis.MURMUR_DATA.DIALOGUE || {};
    const targetTypes = Object.keys(DIALOGUE);
    if (targetTypes.length === 0) return;

    if (!entityIterator) {
        let allEntities = [];
        // Only iterate dimensions that are actually loaded and ticking.
        // Hardcoding ["overworld","nether","the_end"] forces the engine to spin up
        // a dimension's chunk space just to hand back an empty array when nobody
        // has ever visited it - wasted work every rebuild of this iterator.
        for (const dim of world.getDimensions()) {
            try {
                const found = dim.getEntities({ types: targetTypes });
                if (found) allEntities.push(...found);
            } catch (e) { }
        }
        entityIterator = allEntities[Symbol.iterator]();
    }

    for (let i = 0; i < 3; i++) {
        const next = entityIterator.next();
        if (next.done) { entityIterator = null; break; }

        const entity = next.value;
        if (!entity || !entity.isValid()) continue;

        // Animal priority: farm animals belong to ANIMAL CORE when it is
        // installed — never double-voice them from here.
        if (shouldCoreYield(entity.typeId)) continue;

        // State filter checks
        if (entity.typeId.includes("piglin") && entity.hasTag("minecraft:zombified")) continue;
        if (entity.typeId.includes("trader") && (entity.getComponent("effects")?.getEffect("invisibility") || entity.hasComponent("invisible"))) continue;

        const players = entity.dimension.getEntities({
            location: entity.location,
            maxDistance: 24,
            closest: 3,
            types: ["minecraft:player"]
        });
        if (!players || players.length === 0) continue;

        const lastChat = chatterCooldowns.get(entity.id) || 0;
        if (Date.now() - lastChat < 15000) continue;
        if (Math.random() > 0.4) continue;

        // Global ambient-chatter throttle: stop every nearby mob talking at the
        // same instant (the "hive mind" / "forces everyone nearby to talk" feel).
        // Event-driven reactions (hurt/death/peer) are separate handlers and are
        // not affected.
        if (system.currentTick - (globalThis.__MURMUR_LAST_AMBIENT_TICK__ || -999) < 8) continue;
        globalThis.__MURMUR_LAST_AMBIENT_TICK__ = system.currentTick;

        chatterCooldowns.set(entity.id, Date.now());
        ensureNameTag(entity);

        const pool = DIALOGUE[entity.typeId];
        if (!pool) continue;

        const currentLang = getLanguage();
        const getPool = (cond) => {
            const lines = pool[cond];
            if (!lines) return null;
            if (Array.isArray(lines)) return lines;
            return lines[currentLang] || lines["en_US"] || null;
        };

        // --- SPECIAL EVENT DETECTION (priority order) ---
        let specialPool = null;
        const targetPlayer = players[0];

        // --- MEMORY / REPUTATION (friendly sentient mobs) ---
        const friendlyMob = isFriendlySentient(entity.typeId);
        if (friendlyMob) {
            const mobName = entity.nameTag.split("\n")[0];
            const rep = getReputation(targetPlayer.name, entity.typeId, mobName);
            const status = getStatus(rep, currentLang);
            if (targetPlayer.isSneaking) {
                const grudge = getGrudgeLine(targetPlayer.name, entity.typeId, mobName, currentLang);
                const card = `§7* ${mobName} is [${status}] toward you.${grudge ? " " + grudge : ""} *§r`;
                sendCleanChat(entity, card, players);
                continue;
            }
        }

        // 1. Sneaking / Jumping
        if (targetPlayer.isSneaking && pool.sneaking) {
            specialPool = getPool("sneaking");
        } else if (targetPlayer.getVelocity().y > 0.2 && pool.jumping) {
            specialPool = getPool("jumping");
        }

        // 2. Equipment Awareness
        if (!specialPool && Math.random() < 0.35) {
            try {
                const equip = targetPlayer.getComponent("minecraft:equippable");
                const mainHand = equip?.getEquipment("Mainhand")?.typeId;
                const offHand = equip?.getEquipment("Offhand")?.typeId;
                const helmet = equip?.getEquipment("Head")?.typeId;
                const chest = equip?.getEquipment("Chest")?.typeId;

                if ((mainHand?.includes("sword") || mainHand?.includes("axe")) && pool.holding_weapon) {
                    specialPool = getPool("holding_weapon");
                } else if ((mainHand?.includes("spyglass") || mainHand?.includes("clock") || mainHand?.includes("map") ||
                    offHand?.includes("spyglass") || offHand?.includes("clock") || offHand?.includes("map")) && pool.holding_useful) {
                    specialPool = getPool("holding_useful");
                } else if (!helmet && !chest && pool.soft_player) {
                    // Player has no armor
                    specialPool = getPool("soft_player");
                } else if ((chest?.includes("netherite") || chest?.includes("diamond")) && pool.armored_player) {
                    specialPool = getPool("armored_player");
                }

                // Inventory item reactions
                if (!specialPool && mainHand && pool.inventory) {
                    const cleanId = mainHand.includes(":") ? mainHand : `minecraft:${mainHand}`;
                    const invMap = (typeof pool.inventory === "object" && !Array.isArray(pool.inventory))
                        ? (pool.inventory[currentLang] || pool.inventory["en_US"])
                        : pool.inventory;
                    // Same trailing-space hazard as seen_animal below: packs key
                    // these by item id and several ship "minecraft:wheat " with a
                    // stray space, which an exact lookup can never match.
                    const itemPool = invMap?.[cleanId] || invMap?.[cleanId.trim()];
                    if (itemPool && itemPool.length > 0) {
                        specialPool = itemPool;
                    }
                }
            } catch (e) { }
        }

        // 3. Boat check
        if (!specialPool && pool.boat) {
            try {
                const vehicle = entity.getVehicle?.();
                if (vehicle && (vehicle.typeId?.includes("boat") || vehicle.typeId?.includes("raft"))) {
                    specialPool = getPool("boat");
                }
            } catch (e) { }
        }

        // 4. Alone / Crowded
        if (!specialPool) {
            try {
                const nearbyCount = entity.dimension.getEntities({
                    location: entity.location,
                    maxDistance: 8
                }).filter(e => e.id !== entity.id && !e.typeId.includes("player")).length;

                if (nearbyCount === 0 && pool.alone) {
                    specialPool = getPool("alone");
                } else if (nearbyCount >= 4 && pool.crowded) {
                    specialPool = getPool("crowded");
                }
            } catch (e) { }
        }

        // 5. Seen Animal (random chance, 100-tick env scan)
        if (!specialPool && system.currentTick % 100 === 0 && pool.seen_animal) {
            try {
                const animals = entity.dimension.getEntities({
                    location: entity.location,
                    maxDistance: 10
                }).filter(e => isAnimal(e.typeId));

                if (animals.length > 0) {
                    const seenAnimal = animals[0];
                    const seenMap = (typeof pool.seen_animal === "object" && !Array.isArray(pool.seen_animal))
                        ? (pool.seen_animal[currentLang] || pool.seen_animal["en_US"])
                        : pool.seen_animal;
                    // Content packs key these sub-entries by typeId, and several
                    // ship them with a stray trailing space ("minecraft:cow ").
                    // This lookup was an exact match, so every one of those pools
                    // silently never fired. Try the exact id, then the trimmed one.
                    const seenTypeId = seenAnimal.typeId;
                    const specificPool = seenMap?.[seenTypeId]
                        || seenMap?.[seenTypeId.trim()]
                        || seenMap?.[`minecraft:${seenTypeId.split(":")[1]}`]
                        || seenMap?.["generic"];
                    if (specificPool && specificPool.length > 0) {
                        specialPool = specificPool;
                    }
                }
            } catch (e) { }
        }

        // 6. Environmental Block Awareness
        if (!specialPool && system.currentTick % 100 === 0) {
            outer: for (let x = -3; x <= 3; x++) {
                for (let y = -2; y <= 2; y++) {
                    for (let z = -3; z <= 3; z++) {
                        try {
                            const block = entity.dimension.getBlock({ x: entity.location.x + x, y: entity.location.y + y, z: entity.location.z + z });
                            if (!block) continue;
                            if (block.typeId === "minecraft:jukebox" && pool.jukebox) { specialPool = getPool("jukebox"); break outer; }
                            if ((block.typeId.includes("diamond_block") || block.typeId.includes("gold_block") || block.typeId.includes("emerald_block")) && pool.wealth) { specialPool = getPool("wealth"); break outer; }
                        } catch (e) { }
                    }
                }
            }
        }

        // 7. Poor / Rich (inventory emerald count)
        if (!specialPool && (pool.poor || pool.rich) && Math.random() < 0.2) {
            const emeralds = countEmeralds(entity);
            if (emeralds <= 0 && pool.poor) {
                specialPool = getPool("poor");
            } else if (emeralds >= 10 && pool.rich) {
                specialPool = getPool("rich");
            }
        }

        // --- ECOLOGICAL STATE ---
        const timeOfDay = world.getTimeOfDay();
        const isNight = timeOfDay >= 13000 && timeOfDay <= 23000;
        const healthComp = entity.getComponent("minecraft:health");
        const isWounded = healthComp ? healthComp.currentValue <= (healthComp.defaultValue / 3) : false;
        const isOnFire = entity.hasComponent("minecraft:on_fire");
        const isNether = entity.dimension.id.includes("nether");
        const isOverworld = entity.dimension.id.includes("overworld");

        // --- FALLBACK POOL SELECTION (conditional hierarchy) ---
        let activeTextPool = specialPool || getPool("proximity");

        if (isOnFire && pool.on_fire) activeTextPool = getPool("on_fire");
        else if (entity.typeId.includes("piglin") && isOverworld && pool.overworld) activeTextPool = getPool("overworld");
        else if (isNether && pool.nether) activeTextPool = getPool("nether");
        else if (isWounded && isNight && pool.night_wounded) activeTextPool = getPool("night_wounded");
        else if (isWounded && pool.wounded) activeTextPool = getPool("wounded");
        else if (world.isThundering && pool.thunder) activeTextPool = getPool("thunder");
        else if (world.isRaining && !world.isThundering && pool.rain) activeTextPool = getPool("rain");
        else if (isNight && pool.night) activeTextPool = getPool("night");
        else if (specialPool) activeTextPool = specialPool;

        // Villager social conversation handler.
        // While a villager pair is mid-conversation, every OTHER nearby mob is
        // held silent. Without this the villager `continue`s (going quiet for
        // 2-4s while the exchange plays out) and the next voice in the chat is
        // whatever animal happened to be nearby -- which read as the sheep
        // "replying" to the villager.
        if (entity.typeId === "minecraft:villager_v2" && !isNight && !isWounded && Math.random() < 0.45) {
            const started = startVillagerConversation(entity);
            if (started) { beginVillagerConversationWindow(entity); continue; }
        }
        if (villagerTalkBusyNear(entity.location, entity.dimension.id)) continue;

        // Relationship-aware greeting override (friendly sentient only)
        if (friendlyMob && activeTextPool) {
            const mobName2 = entity.nameTag.split("\n")[0];
            const rep2 = getReputation(targetPlayer.name, entity.typeId, mobName2);
            if (rep2 >= 10 && pool.greeting_friend) activeTextPool = getPool("greeting_friend");
            else if (rep2 <= -10 && pool.greeting_foe) activeTextPool = getPool("greeting_foe");
        }

        if (activeTextPool && activeTextPool.length > 0) {
            const rawLine = getRandomElement(activeTextPool);
            const processedLine = processTextLine(entity, rawLine, players[0]);
            sendCleanChat(entity, processedLine, players);
        }
    }
}, 4);

// Dynamic Reactive Witness Engine (Death)
world.afterEvents.entityDie.subscribe((event) => {
    const deadEntity = event.deadEntity;
    const DIALOGUE = globalThis.MURMUR_DATA.DIALOGUE || {};
    const FACTIONS = globalThis.MURMUR_DATA.FACTIONS || {};

    if (!deadEntity || !DIALOGUE[deadEntity.typeId]) return;
    if (shouldCoreYield(deadEntity.typeId)) return; // animal death lines belong to ANIMAL CORE

    // Resolve the deceased's loyalty group: prefer a registered pack faction,
    // otherwise fall back to the structural faction group table.
    let targetFactionMembers = [deadEntity.typeId];
    for (const members of Object.values(FACTIONS)) {
        if (members.includes(deadEntity.typeId)) { targetFactionMembers = members; break; }
    }
    const structuralGroup = factionGroupFor(deadEntity.typeId);
    if (structuralGroup) {
        // Merge: anyone in the same structural family can mourn, even if a more
        // specific pack faction also matched.
        targetFactionMembers = Array.from(new Set([...targetFactionMembers, ...structuralGroup]));
    }

    const lostEntityName = deadEntity.nameTag ? deadEntity.nameTag.split("\n")[0] : (t("general.companion") || "our companion");

    let witnesses = [];
    try {
        const neighbors = deadEntity.dimension.getEntities({
            location: deadEntity.location,
            maxDistance: 20
        });
        if (!neighbors) return;
        // Faction-group membership check (fixes wrong-faction mourning while
        // still letting sub-variants mourn their own kind after the type-match
        // liberalization above).
          const deadFaction = factionGroupFor(deadEntity.typeId);
          witnesses = neighbors.filter(w => {
              if (!w || !w.isValid()) return false;
              // Never let a player end up in the witness cast.
              if (!w.typeId || w.typeId.includes("player")) return false;
            if (w.id === deadEntity.id) return false;
            if (w.typeId.includes("arrow")) return false;
            if (shouldCoreYield(w.typeId)) return false; // yielded animals mourn via ANIMAL CORE
            const matchesExact = targetFactionMembers.includes(w.typeId);
            const matchesStructural = deadFaction && factionGroupFor(w.typeId) === deadFaction;
            return matchesExact || matchesStructural;
        });
    } catch (e) { return; }

    const currentLang = getLanguage();

    for (const witness of witnesses) {
        if (!witness || !witness.isValid()) continue;

        const playersNear = witness.dimension.getEntities({ location: witness.location, maxDistance: 8, types: ["minecraft:player"] });
        if (!playersNear || playersNear.length === 0) continue;

        const pool = DIALOGUE[witness.typeId];
        if (pool?.death && Math.random() < 0.75) {
            system.runTimeout(() => {
                if (!witness.isValid()) return;
                const deathLines = Array.isArray(pool.death) ? pool.death : (pool.death[currentLang] || pool.death["en_US"]);
                if (!deathLines || deathLines.length === 0) return;

                const rawLine = getRandomElement(deathLines);
                let msg = rawLine.replace(/{dead_name}/g, lostEntityName);
                msg = processTextLine(witness, msg, playersNear[0], lostEntityName);
                sendCleanChat(witness, msg, playersNear);
            }, Math.floor(Math.random() * 12) + 8);
            break;
        }
    }
});

// Proactive namer: give a freshly spawned registered talkable a custom name
// right away, instead of waiting for its first line of chatter. Cheap and
// gated to types that actually have dialogue registered.
if (world.afterEvents && world.afterEvents.entitySpawn) {
    world.afterEvents.entitySpawn.subscribe((event) => {
        try {
            const e = event?.entity;
            if (!e || !e.isValid()) return;
            if (shouldCoreYield(e.typeId)) return; // animal naming belongs to ANIMAL CORE
            const DIALOGUE = globalThis.MURMUR_DATA.DIALOGUE || {};
            if (!DIALOGUE[e.typeId]) return;
            ensureNameTag(e);
        } catch (err) { /* non-fatal */ }
    });
}

// Reactive Hurt Response Engine
world.afterEvents.entityHurt.subscribe((event) => {
    const victim = event.hurtEntity;
    const attacker = event.damageSource.damagingEntity;
    if (!victim || !victim.isValid()) return;
    if (shouldCoreYield(victim.typeId)) return; // animal hurt lines belong to ANIMAL CORE

    const DIALOGUE = globalThis.MURMUR_DATA.DIALOGUE || {};
    const pool = DIALOGUE[victim.typeId];
    if (!pool) return;

    const currentLang = getLanguage();
    const getPool = (cond) => {
        const lines = pool[cond];
        if (!lines) return null;
        return Array.isArray(lines) ? lines : (lines[currentLang] || lines["en_US"] || null);
    };

    let hurtPool = null;
    const attackerType = attacker?.typeId || "";

    // Priority: most specific first
    if (attackerType === "minecraft:player" && pool.wounded_vs_player) {
        hurtPool = getPool("wounded_vs_player");
    } else if (isZombie(attackerType) && pool.wounded_vs_zombie) {
        hurtPool = getPool("wounded_vs_zombie");
    } else if (isIllager(attackerType) && pool.wounded_vs_illager) {
        hurtPool = getPool("wounded_vs_illager");
    } else if (victim.hasComponent("minecraft:on_fire") && pool.on_fire) {
        hurtPool = getPool("on_fire");
    } else {
        hurtPool = getPool("wounded");
    }

    if (hurtPool && hurtPool.length > 0 && Math.random() < 0.8) {
        const line = getRandomElement(hurtPool);
        // The victim is the speaker. When a PLAYER struck them, {name} must resolve
        // to that player -- not to whichever villager happened to be standing
        // nearby, which made Darn complain that his buddy Darn attacked him.
        //
        // The name is colour-wrapped (aqua) so it reads unmistakably as somebody
        // being REFERRED TO rather than as the speaker's own words. Injecting the
        // raw name is what previously made it look like the player was talking.
        const struckByPlayer = attackerType === "minecraft:player" && attacker && attacker.isValid();
        const addressee = struckByPlayer ? colorizeAddressee(attacker.nameTag) : null;
        const processed = processTextLine(victim, line, null, addressee, addressee);
        const playersNear = victim.dimension.getEntities({ location: victim.location, maxDistance: 20, types: ["minecraft:player"] });
        sendCleanChat(victim, processed, playersNear);
    }

    // Peer Wounded — broadcast to nearby same-type NPCs
    if (pool.peer_wounded && Math.random() < 0.5) {
        try {
            const victimName = ensureNameTag(victim);
            const peerPool = getPool("peer_wounded");
            if (!peerPool || peerPool.length === 0) return;

            const peers = victim.dimension.getEntities({
                location: victim.location,
                maxDistance: 12,
                types: [victim.typeId]
            })
                // `types` is not an exact filter in this engine -- a
                // minecraft:player was leaking through this query and then being
                // spoken as "<Someone>". Re-check typeId explicitly.
                .filter(e => e.id !== victim.id && e.isValid() &&
                    e.typeId === victim.typeId &&
                    !e.typeId.includes("player"));

            if (peers.length === 0) return;

            const peer = peers[0];
            const peersPlayers = peer.dimension.getEntities({ location: peer.location, maxDistance: 20, types: ["minecraft:player"] });
            if (!peersPlayers || peersPlayers.length === 0) return;

            system.runTimeout(() => {
                if (!peer.isValid()) return;
                const rawLine = getRandomElement(peerPool);
                const msg = processTextLine(peer, rawLine, null, victimName);
                sendCleanChat(peer, msg, peersPlayers);
            }, Math.floor(Math.random() * 10) + 5);
        } catch (e) { }
    }
});