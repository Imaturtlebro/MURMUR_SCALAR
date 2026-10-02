import { world, system } from "@minecraft/server";
import { ensureNameTag, sendCleanChat } from "./utils.js";
import {
    isFriendlySentient, adjustReputation, bumpVillagerOpinion,
    getVillagerFriends, getReputation
} from "./memory.js";

const repCooldown = new Map();
function throttle(key, ms) {
    const last = repCooldown.get(key) || 0;
    if (Date.now() - last < ms) return false;
    repCooldown.set(key, Date.now());
    return true;
}

function nearbyFriendly(entity, radius, includeSelf = false) {
    try {
        return entity.dimension.getEntities({ location: entity.location, maxDistance: radius })
            .filter(e => e.isValid() && isFriendlySentient(e.typeId) && (includeSelf || e.id !== entity.id));
    } catch (e) { return []; }
}

// --- DEATH: player kills a friendly sentient -> witnesses hold a grudge ---
world.afterEvents.entityDie.subscribe((event) => {
    const dead = event.deadEntity;
    if (!dead || !dead.isValid()) return;
    if (!isFriendlySentient(dead.typeId)) return;

    const killer = event.damageSource?.damagingEntity;
    const deadName = ensureNameTag(dead);

    if (killer && killer.typeId === "minecraft:player") {
        const pname = killer.name;
        const witnesses = nearbyFriendly(dead, 18, true);
        for (const w of witnesses) {
            if (!isFriendlySentient(w.typeId)) continue;
            const wName = ensureNameTag(w);
            adjustReputation(pname, w.typeId, wName, -18, { kind: "kill", target: deadName });
        }
        // Nearby villagers liked the deceased
        const villagers = witnesses.filter(w => w.typeId.includes("villager"));
        for (const v of villagers) {
            bumpVillagerOpinion(ensureNameTag(v), deadName, 12);
        }
    }
});

// --- HURT: player hurts a friendly sentient -> small grudge ---
world.afterEvents.entityHurt.subscribe((event) => {
    const victim = event.hurtEntity;
    const attacker = event.damageSource?.damagingEntity;
    if (!victim || !victim.isValid()) return;
    if (!isFriendlySentient(victim.typeId)) return;
    if (!attacker || attacker.typeId !== "minecraft:player") return;

    const vName = ensureNameTag(victim);
    if (throttle(`hurt:${attacker.name}:${victim.id}`, 60000)) {
        adjustReputation(attacker.name, victim.typeId, vName, -4, { kind: "hurt", target: vName });
    }
});

// --- HEAL: positive effect on a friendly sentient near a player -> friendship ---
const healEffects = ["regeneration", "instant_health", "saturation", "strength", "absorption", "health_boost"];

function rewardHeal(entity, p) {
    const eName = ensureNameTag(entity);
    if (throttle(`heal:${p.name}:${entity.id}`, 60000)) {
        adjustReputation(p.name, entity.typeId, eName, 8, { kind: "heal", target: eName });
    }
}

if (world.afterEvents && world.afterEvents.entityEffectAdded) {
    world.afterEvents.entityEffectAdded.subscribe((event) => {
        const entity = event.entity;
        if (!entity || !entity.isValid()) return;
        if (!isFriendlySentient(entity.typeId)) return;
        if (!healEffects.includes(event.effect?.typeId)) return;

        const players = entity.dimension.getEntities({ location: entity.location, maxDistance: 6, types: ["minecraft:player"] });
        if (!players || players.length === 0) return;
        rewardHeal(entity, players[0]);
    });
} else {
    // Fallback for runtimes that lack the entityEffectAdded event (e.g. promoted to 1.19.0):
    // poll nearby friendly sentients for newly-applied good effects.
    const knownEffects = new Map();
    let healPollTicks = 0;
    system.runInterval(() => {
        try {
            healPollTicks++;
            for (const p of world.getPlayers()) {
                const mobs = p.dimension.getEntities({ location: p.location, maxDistance: 6 })
                    .filter(e => e.isValid() && isFriendlySentient(e.typeId));
                for (const mob of mobs) {
                    let prev = knownEffects.get(mob.id);
                    if (!prev) { prev = new Set(); knownEffects.set(mob.id, prev); }
                    const current = new Set();
                    try {
                        for (const eff of mob.getEffects()) {
                            if (!healEffects.includes(eff.typeId)) continue;
                            current.add(eff.typeId);
                            if (!prev.has(eff.typeId)) rewardHeal(mob, p);
                        }
                    } catch (e) { /* getEffects unsupported */ }
                    knownEffects.set(mob.id, current);
                }
            }
            // Periodically prune stale entries to avoid unbounded growth.
            if (healPollTicks % 300 === 0 && knownEffects.size > 512) knownEffects.clear();
        } catch (e) { }
    }, 20);
}

// --- BEHAVIOR: Hated/Disliked players are shoved away (flee / golem shove) ---
system.runInterval(() => {
    try {
        const players = world.getPlayers();
        for (const p of players) {
            const mobs = p.dimension.getEntities({ location: p.location, maxDistance: 6 })
                .filter(e => e.isValid() && isFriendlySentient(e.typeId));
            for (const mob of mobs) {
                const name = ensureNameTag(mob);
                const rep = getReputation(p.name, mob.typeId, name);
                if (rep <= -10 && throttle(`behavior:${p.name}:${mob.id}`, 8000)) {
                    try {
                        const dx = mob.location.x - p.location.x;
                        const dz = mob.location.z - p.location.z;
                        const len = Math.hypot(dx, dz) || 1;
                        const power = (rep <= -30 && mob.typeId.includes("golem")) ? 0.9 : 0.5;
                        mob.applyKnockback(dx / len, dz / len, power, 0.2);
                    } catch (e) { }
                }
            }
        }
    } catch (e) { }
}, 20);

// --- INTERACTION: /scriptevent murmur:ask know  -> nearest villager reveals a friend ---
system.afterEvents.scriptEventReceive.subscribe((event) => {
    if (event.id !== "murmur:ask") return;
    const player = event.sourceEntity;
    if (!player || player.typeId !== "minecraft:player") return;
    const cmd = (event.message || "").trim().toLowerCase();
    if (cmd !== "know") return;

    const villagers = player.dimension.getEntities({
        location: player.location, maxDistance: 12,
        types: ["minecraft:villager_v2", "minecraft:villager"]
        // `types` is not an exact filter in this engine; a minecraft:player was
        // leaking through and then being spoken as "<Someone>".
    }).filter(e => e.isValid() &&
        (e.typeId === "minecraft:villager_v2" || e.typeId === "minecraft:villager"));
    const v = villagers[0];
    if (!v) return;

    const vName = ensureNameTag(v);
    const friends = getVillagerFriends(vName);
    const playersNear = player.dimension.getEntities({ location: v.location, maxDistance: 14, types: ["minecraft:player"] });

    let line;
    if (friends.length > 0 && Math.random() < 0.8) {
        const friend = friends[Math.floor(Math.random() * friends.length)];
        line = `I know ${friend}. We get along, most days.`;
    } else {
        line = `I keep to myself these days. Not many worth knowing.`;
    }
    sendCleanChat(v, line, playersNear);
});
