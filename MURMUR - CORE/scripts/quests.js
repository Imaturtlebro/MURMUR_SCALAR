import { world, system, ItemStack } from "@minecraft/server";
import { hasItemInInventory, takeItemFromInventory } from "./utils.js";
import { adjustReputation } from "./memory.js";
import { MurmurEvents } from "./events.js";

// --- MURMUR QUEST SYSTEM ---
// A lightweight, persistent RPG quest layer for MURMUR Core.
//
// Quests are handed out through dialogue-tree choices (structured `startQuest`
// consequences), tracked per-player in a sharded dynamic-property store, and
// advanced by collecting items / killing targets / reaching locations. Turning
// in a completed quest grants rewards (items + reputation) and closes the quest.
//
// Persistence: each player gets their own DP shard `murmur:quests:<name>` so
// we never exceed the 32,767-byte dynamic-property cap and so one player's
// progress never clobbers another's.

const PLAYER_PREFIX = "murmur:quests:";
const JOURNAL_TAG = "murmur:quest";
const ACTIVE_QUEST_CAP = 3;

// In-memory cache of quest state per player, keyed by player.name.
let _cache = null;
function loadPlayer(name) {
    if (!_cache) _cache = {};
    if (_cache[name]) return _cache[name];
    let store = { active: {}, completed: [], failed: [] };
    try {
        const raw = world.getDynamicProperty(PLAYER_PREFIX + name);
        if (raw) {
            const parsed = JSON.parse(raw);
            if (parsed && typeof parsed === "object") store = parsed;
        }
    } catch (e) { }
    if (!store.active) store.active = {};
    if (!store.completed) store.completed = [];
    if (!store.failed) store.failed = [];
    _cache[name] = store;
    return store;
}
function savePlayer(name) {
    try {
        world.setDynamicProperty(PLAYER_PREFIX + name, JSON.stringify(_cache[name] || {}));
    } catch (e) {
        console.warn("[MURMUR QUEST] save failed for " + name);
    }
}
function clearCache() {
    _cache = {};
}

// --- Active quest helpers ---
export function getActiveQuests(playerName) {
    try { checkQuestExpiry(playerName); } catch (e) { }
    const s = loadPlayer(playerName);
    return Object.values(s.active || {});
}
export function getQuest(playerName, questId) {
    return loadPlayer(playerName).active?.[questId] || null;
}
export function hasCompletedQuest(playerName, questId) {
    return (loadPlayer(playerName).completed || []).includes(questId);
}

/**
 * Player tag set when a quest expires, so dialogue trees can route to a
 * "shame / you're late" branch via `requires: { tag: "murmur:failed:<questId>" }`.
 * Cleared automatically when the quest is re-accepted.
 */
export function failTagFor(questId) {
    return `murmur:failed:${questId}`;
}
export function hasFailedQuest(playerName, questId) {
    return (loadPlayer(playerName).failed || []).includes(questId);
}

/**
 * Start a quest for a player.
 * @param {Object} opts { player, questId, title, type, target, amount, giverType, giverName, rewardItems, rewardRep, intro, objective, mode, repeatable, x, y, z, range, deadlineDays, failRep }
 * `deadlineDays` (optional): quest expires after this many in-game days.
 * `failRep` (optional, default -15): reputation hit on expiry.
 */
export function startQuest(opts) {
    if (!opts || !opts.player || !opts.questId) return false;
    const name = opts.player.name;
    const s = loadPlayer(name);

    if (s.active[opts.questId]) {
        opts.player.sendMessage(`§8[MURMUR] You are already on that task.`);
        return false;
    }
    // Repeatable tasks may be re-taken after completion; the rest are one-time.
    if (!opts.repeatable && hasCompletedQuest(name, opts.questId)) {
        opts.player.sendMessage(`§8[MURMUR] You have already settled that debt.`);
        return false;
    }
    if (Object.keys(s.active).length >= ACTIVE_QUEST_CAP) {
        opts.player.sendMessage(`§8[MURMUR] Your journal is full. Complete or abandon a task first.`);
        return false;
    }

    let deadlineDay = null;
    if (typeof opts.deadlineDays === "number" && opts.deadlineDays > 0) {
        try { deadlineDay = world.getDay() + Math.floor(opts.deadlineDays); }
        catch (e) { deadlineDay = null; }
    }

    s.active[opts.questId] = {
        id: opts.questId,
        title: opts.title || opts.questId,
        type: opts.type || "collect",
        target: opts.target || "",
        amount: opts.amount || 1,
        current: 0,
        mode: opts.mode || "single",
        repeatable: !!opts.repeatable,
        giverType: opts.giverType || "",
        giverName: opts.giverName || "",
        rewardItems: Array.isArray(opts.rewardItems) ? opts.rewardItems : [],
        rewardRep: opts.rewardRep || 0,
        intro: opts.intro || "",
        objective: opts.objective || "",
        // goto type only:
        x: opts.x,
        y: opts.y,
        z: opts.z,
        range: opts.range || 6,
        // timed quests:
        deadlineDay,
        failRep: (typeof opts.failRep === "number") ? opts.failRep : -15
    };
    // Re-accepting wipes the failure record: the slate is clean.
    s.failed = (s.failed || []).filter(id => id !== opts.questId);
    try { opts.player.removeTag(failTagFor(opts.questId)); } catch (e) { }
    savePlayer(name);
    if (opts.intro) opts.player.sendMessage(`§6[MURMUR] §r${opts.intro}`);
    let newLine = `§aNew task: §f${s.active[opts.questId].title}`;
    if (deadlineDay !== null) {
        try {
            const left = deadlineDay - world.getDay();
            newLine += ` §8(${left <= 0 ? "due today" : left + "d left"})`;
        } catch (e) { }
    }
    opts.player.sendMessage(newLine);
    try { MurmurEvents.emit("questStarted", { playerName: name, questId: opts.questId }); } catch (e) { }
    return true;
}

/**
 * Expire overdue timed quests. Event-driven (called on dialogue open + journal),
 * never on a tick loop: time only "catches up" with the player when they engage.
 * @returns {string[]} questIds that just expired.
 */
export function checkQuestExpiry(playerName) {
    const s = loadPlayer(playerName);
    const ids = Object.keys(s.active || {});
    if (ids.length === 0) return [];
    let today = null;
    try { today = world.getDay(); } catch (e) { return []; }
    const newlyFailed = [];
    let player = null; // resolved lazily — this runs inside tick-loop callers too
    for (const qid of ids) {
        const q = s.active[qid];
        if (!q || q.deadlineDay === null || q.deadlineDay === undefined) continue;
        if (today <= q.deadlineDay) continue;
        // Overdue: fail it.
        delete s.active[qid];
        if (!(s.failed || []).includes(qid)) s.failed.push(qid);
        if (q.giverType) {
            try {
                adjustReputation(playerName, q.giverType, q.giverName || q.giverType, q.failRep ?? -15, { kind: "quest_expired", target: q.title });
            } catch (e) { }
        }
        if (!player) {
            try { player = world.getAllPlayers().find(x => x.name === playerName) || null; }
            catch (e) { player = null; }
        }
        if (player && player.isValid()) {
            try { player.addTag(failTagFor(qid)); } catch (e) { }
            player.sendMessage(`§cTask failed: §f${q.title} §7— you took too long. ${(q.giverName || "They")} will remember this.`);
        }
        newlyFailed.push(qid);
        try { MurmurEvents.emit("questExpired", { playerName, questId: qid }); } catch (e) { }
    }
    if (newlyFailed.length > 0) savePlayer(playerName);
    return newlyFailed;
}

export function abandonQuest(playerName, questId) {
    const s = loadPlayer(playerName);
    if (!s.active[questId]) return false;
    delete s.active[questId];
    savePlayer(playerName);
    return true;
}

// --- Progress helpers ---
function questLine(q) {
    let goal = q.target.split(":")[1]?.replace(/_/g, " ") || q.target;
    let base = "";
    if (q.type === "collect") base = `Collect ${q.current}/${q.amount} ${goal}`;
    else if (q.type === "kill") base = `Slay ${q.current}/${q.amount} ${goal}`;
    else if (q.type === "goto") base = "Reach " + (goal || q.title);
    else base = q.objective || q.title;
    if (q.deadlineDay !== null && q.deadlineDay !== undefined) {
        try {
            const left = q.deadlineDay - world.getDay();
            base += left <= 0 ? ` §c(due today!)` : ` §8(${left}d left)`;
        } catch (e) { }
    }
    return base;
}

export function questProgress(playerName, questId, delta = 1) {
    const s = loadPlayer(playerName);
    const q = s.active[questId];
    if (!q) return false;
    q.current = Math.min(q.amount, q.current + delta);
    if (q.current >= q.amount) {
        const p = world.getAllPlayers().find(x => x.name === playerName);
        if (p && p.isValid()) {
            p.sendMessage(`§aObjective complete: §f${q.title}§r §7— return to ${q.giverName || "the giver"} to claim your reward.`);
            try { MurmurEvents.emit("questObjectiveComplete", { playerName, questId: q.id }); } catch (e) { }
        }
        savePlayer(playerName);
        return true;
    }
    savePlayer(playerName);
    return false;
}

export function isQuestComplete(playerName, questId) {
    const q = loadPlayer(playerName).active[questId];
    return !!(q && q.current >= q.amount);
}

/**
 * Turn in a completed quest. Pays out items + reputation and archives it.
 * @returns {boolean} true if the quest was complete and paid out.
 */
export function turnInQuest(opts) {
    const { player, questId } = opts;
    const name = player.name;
    const s = loadPlayer(name);
    const q = s.active[questId];
    if (!q) { player.sendMessage("§7[MURMUR] You don't have that task."); return false; }
    if (!(q.current >= q.amount)) {
        player.sendMessage(`§7[MURMUR] Not done yet: ${questLine(q)}.`);
        return false;
    }

    // --- Inventory buffer: refuse to close the task if the bag cannot hold the
    // reward, so nothing is lost and nothing is consumed. The player clears a
    // slot, returns, and claims without penalty.
    if ((q.rewardItems || []).length > 0) {
        const inv = player.getComponent("minecraft:inventory");
        const c = inv?.container;
        let canHold = true;
        if (c) {
            // Aggregate the total amount needed per item type.
            const need = {};
            for (const ri of q.rewardItems) {
                try {
                    const st = new ItemStack(ri.typeId, ri.count || 1);
                    need[ri.typeId] = (need[ri.typeId] || 0) + st.amount;
                } catch (e) { need[ri.typeId] = (need[ri.typeId] || 0) + (ri.count || 1); }
            }
            // Count free slots + stackable headroom already present per type.
            const free = { slots: 0, headroom: {} };
            for (let i = 0; i < c.size; i++) {
                const it = c.getItem(i);
                if (!it) { free.slots++; continue; }
                if (need[it.typeId]) free.headroom[it.typeId] = (free.headroom[it.typeId] || 0) + Math.max(0, it.maxAmount - it.amount);
            }
            // Place each reward, preferring existing headroom then fresh slots.
            let ok = true;
            for (const [id, amt] of Object.entries(need)) {
                let remaining = amt;
                const head = free.headroom[id] || 0;
                const useHead = Math.min(remaining, head);
                remaining -= useHead;
                free.headroom[id] = (free.headroom[id] || 0) - useHead;
                const slotsNeeded = Math.max(0, Math.ceil(remaining / 64));
                if (slotsNeeded > free.slots) { ok = false; break; }
                free.slots -= slotsNeeded;
            }
            canHold = ok;
        }
        if (!canHold) {
            player.sendMessage(`§8[MURMUR] Make room in your pack first — your reward won't fit.`);
            return false;
        }
    }

    // Pay out reward items into inventory.
    let gave = [];
    for (const ri of q.rewardItems || []) {
        try {
            const inv = player.getComponent("minecraft:inventory");
            if (inv?.container) inv.container.addItem(new ItemStack(ri.typeId, ri.count || 1));
            gave.push(ri.typeId.split(":")[1]?.replace(/_/g, " ") || ri.typeId);
        } catch (e) { }
    }

    // Consume the collected objectives as part of the turn-in.
    if (q.type === "collect" && q.target) {
        try { takeItemFromInventory(player, q.target, q.amount); } catch (e) { }
    }

    // Reputation toward the quest giver (recontextualized as the faction/allegiance).
    if (q.rewardRep && q.giverType) {
        try {
            adjustReputation(name, q.giverType, q.giverName || q.giverType, q.rewardRep, { kind: "quest", target: q.title });
        } catch (e) { }
    }

    delete s.active[questId];
    if (!s.completed.includes(questId)) s.completed.push(questId);
    savePlayer(name);

    const repLine = q.rewardRep ? ` §2(+${q.rewardRep} standing)` : "";
    player.sendMessage(`§6[MURMUR] §rTask complete: §f${q.title}§r${repLine}`);
    if (gave.length > 0) player.sendMessage(`§7Rewards: ${gave.join(", ")}`);
    try { MurmurEvents.emit("questTurnedIn", { playerName: name, questId }); } catch (e) { }
    return true;
}

// --- Event wiring: collect & kill objectives ---
function consumeInventoryObjective(player) {
    const name = player.name;
    for (const q of getActiveQuests(name)) {
        if (q.type !== "collect" || q.current >= q.amount) continue;
        if (!q.target) continue;
        // Count how many the player currently holds, capped at the goal.
        if (!hasItemInInventory(player, q.target, q.amount - q.current)) continue;
        q.current = q.amount;
        if (q.current >= q.amount) {
            player.sendMessage(`§aObjective complete: §f${q.title}§r §7— return to ${q.giverName || "the giver"}.`);
            try { MurmurEvents.emit("questObjectiveComplete", { playerName: name, questId: q.id }); } catch (e) { }
        }
        savePlayer(name);
        // Only advance a single collection quest per check to keep it predictable.
        return;
    }
}

// The Bedrock 1.11 scripting API has no direct "inventory changed" event, so we
// poll for collection objectives instead (below).

// Polling-based collection check: cheap enough (runs every 4 ticks, only for
// online players with active collect quests).
let collectCheckTicks = 0;
system.runInterval(() => {
    try {
        collectCheckTicks++;
        if (collectCheckTicks % 3 !== 0) return;
        for (const p of world.getPlayers()) {
            const active = getActiveQuests(p.name).filter(q => q.type === "collect" && q.current < q.amount);
            if (active.length === 0) continue;
            consumeInventoryObjective(p);
        }
    } catch (e) { }
}, 4);

// Kill objective via entityDie.
world.afterEvents.entityDie.subscribe((event) => {
    try {
        const deadType = event.deadEntity?.typeId || "";
        const killer = event.damageSource?.damagingEntity;
        if (!killer || killer.typeId !== "minecraft:player") return;
        const name = killer.name;
        for (const q of getActiveQuests(name)) {
            if (q.type !== "kill" || q.current >= q.amount) continue;
            if (q.target && !deadType.includes(q.target.split(":")[1] || q.target)) continue;
            questProgress(name, q.id, 1);
        }
    } catch (e) { }
});

// Goto objective: automatic location tracking. Runs on a light tick timer and
// completes a goto quest as soon as the player reaches the waypoint.
let gotoTicks = 0;
system.runInterval(() => {
    try {
        gotoTicks++;
        if (gotoTicks % 5 !== 0) return;
        for (const p of world.getPlayers()) {
            if (!p.isValid()) continue;
            const active = getActiveQuests(p.name).filter(q => q.type === "goto" && q.current < q.amount);
            if (active.length === 0) continue;
            const pos = p.location;
            for (const q of active) {
                if (q.x === undefined || q.y === undefined || q.z === undefined) continue;
                const dx = pos.x - q.x, dy = pos.y - q.y, dz = pos.z - q.z;
                if (Math.sqrt(dx * dx + dy * dy + dz * dz) <= (q.range || 6)) {
                    questProgress(p.name, q.id, 1);
                }
            }
        }
    } catch (e) { }
}, 4);

// --- /scriptevent murmur:quest <journal|abandon|forget|prune> ---
system.afterEvents.scriptEventReceive.subscribe((event) => {
    if (event.id !== "murmur:quest") return;
    const player = event.sourceEntity;
    if (!player || player.typeId !== "minecraft:player") return;
    const cmd = (event.message || "").trim().toLowerCase();
    const name = player.name;

    if (cmd === "journal" || cmd === "" || cmd === "log") {
        try { checkQuestExpiry(name); } catch (e) { }
        const s = loadPlayer(name);
        const active = Object.values(s.active || {});
        player.sendMessage(`§6§l[MURMUR QUEST LOG]§r`);
        if (active.length === 0) {
            player.sendMessage("§7  No active tasks. Ask around — some creatures remember old favors.");
        } else {
            for (const q of active) {
                const done = q.current >= q.amount;
                player.sendMessage(`§${done ? "a" : "f"}  ${done ? "✔" : "•"} ${q.title} §7— ${questLine(q)}`);
            }
        }
        if ((s.completed || []).length > 0) {
            player.sendMessage(`§8  Completed: ${(s.completed || []).join(", ")}`);
        }
        if ((s.failed || []).length > 0) {
            player.sendMessage(`§c  Failed: ${(s.failed || []).join(",")} §8— they remember.`);
        }
    } else if (cmd.startsWith("abandon")) {
        const qid = (event.message || "").trim().split(/\s+/).slice(1).join(" ") || "";
        if (!qid) { player.sendMessage("§7Usage: /scriptevent murmur:quest abandon <questId>"); return; }
        if (abandonQuest(name, qid)) player.sendMessage(`§7[MURMUR] Task dropped: ${qid}`);
        else player.sendMessage(`§7[MURMUR] No active task '${qid}'.`);
    } else if (cmd === "prune") {
        clearCache();
        player.sendMessage("§7[MURMUR] Quest cache flushed (re-read from save).");
    }
});

console.log("[MURMUR QUEST] Quest system loaded.");
