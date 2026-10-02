import { world, system, ItemStack } from "@minecraft/server";
import { ActionFormData } from "@minecraft/server-ui";
import { ensureNameTag, hasItemInInventory, takeItemFromInventory, reassembleChunks } from "./utils.js";
import { shouldCoreYield } from "./animal_priority.js";
import { getReputation, adjustReputation } from "./memory.js";
import { startQuest, turnInQuest, questProgress, isQuestComplete, getQuest, getActiveQuests, checkQuestExpiry } from "./quests.js";
import { openShop, hasOffers } from "./commerce.js";
import { MurmurEvents } from "./events.js";
import { getLanguage, t } from "./localization.js";

if (!globalThis.MURMUR_DATA.TREES) globalThis.MURMUR_DATA.TREES = {};

// --- FACTION / MOOD THEME COLORS (for the dialogue UI) ---
const THEME = {
    villager: "§a", illager: "§c", witch: "§5", golem: "§2",
    trader: "§b", enderman: "§d", skeleton: "§f", nether: "§4", default: "§e"
};

function themeFor(typeId) {
    if (!typeId) return THEME.default;
    if (typeId.includes("villager")) return THEME.villager;
    if (typeId.includes("trader")) return THEME.trader;
    if (typeId.includes("golem")) return THEME.golem;
    if (typeId.includes("enderman")) return THEME.enderman;
    if (typeId.includes("skeleton") || typeId.includes("wither")) return THEME.skeleton;
    if (typeId.includes("witch")) return THEME.witch;
    if (typeId.includes("piglin") || typeId.includes("zombified") || typeId.includes("blaze") || typeId.includes("nether")) return THEME.nether;
    if (typeId.includes("pillager") || typeId.includes("vindicator") || typeId.includes("evoker") || typeId.includes("illager")) return THEME.illager;
    return THEME.default;
}

// Soft word-wrap so long lines stay readable inside ActionFormData bodies.
function wrapText(text, max = 88) {
    const words = String(text).split(/\s+/);
    const lines = [];
    let cur = "";
    for (const w of words) {
        if (cur.length === 0) { cur = w; continue; }
        if ((cur + " " + w).length > max) { lines.push(cur); cur = w; }
        else cur += " " + w;
    }
    if (cur.length) lines.push(cur);
    return lines.join("\n");
}

// Double-open guard: prevent stacking the same conversation screen.
const openMenus = new Set();

function resolveTreeId(typeId) {
    const T = globalThis.MURMUR_DATA.TREES || {};
    if (T[typeId]) return typeId;
    // Exact namespaced match (packId::typeId)
    for (const key of Object.keys(T)) {
        if (key.endsWith("::" + typeId)) return key;
    }
    // Fall back to any tree whose typeId substring matches
    for (const key of Object.keys(T)) {
        const suffix = key.split("::")[1] || key;
        if (suffix === typeId || typeId.includes(suffix) || suffix.includes(typeId)) return key;
    }
    return null;
}

// --- Choice requirement checks (server-ui has no disabled buttons, so we filter) ---
// Exported for unit testing (pure predicate over player/entity state).
export function choiceVisible(ch, player, entity, mobName) {
    if (!ch || !ch.requires) return true;
    const r = ch.requires;
    if (r.minRep !== undefined && entity) {
        if (getReputation(player.name, entity.typeId, mobName || "?") < r.minRep) return false;
    }
    if (r.maxRep !== undefined && entity) {
        if (getReputation(player.name, entity.typeId, mobName || "?") > r.maxRep) return false;
    }
    if (r.tag && !player.hasTag(r.tag)) return false;
    if (r.notTag && player.hasTag(r.notTag)) return false;
    if (r.item) {
        if (!hasItemInInventory(player, r.item, r.amount || 1)) return false;
    }
    // Quest-gated branches: visible only while the player holds (or lacks) a quest.
    if (r.quest) {
        if (!getQuest(player.name, r.quest)) return false;
    }
    if (r.notQuest) {
        if (getQuest(player.name, r.notQuest)) return false;
    }
    // Effect-gated branches (e.g. hero_of_the_village discount alive/expired).
    if (r.effect) {
        try {
            if (!player.getEffect(r.effect)) return false;
        } catch (e) { return false; }
    }
    if (r.notEffect) {
        try {
            if (player.getEffect(r.notEffect)) return false;
        } catch (e) { /* effect API missing — treat as absent, branch stays visible */ }
    }
    if (r.property !== undefined) {
        const pv = player.getDynamicProperty(r.property);
        if (r.propertyEquals !== undefined) { if (pv !== r.propertyEquals) return false; }
        else if (!pv) return false;
    }
    return true;
}

// --- Native (non-command) consequence application ---
// Exported for unit testing.
export function applyChoiceEffects(ch, player, entity, mobName) {
    if (!ch) return;
    try {
        if (Array.isArray(ch.setTags)) for (const tag of ch.setTags) player.addTag(tag);
        if (Array.isArray(ch.clearTags)) for (const tag of ch.clearTags) player.removeTag(tag);
        if (ch.setProperties && typeof ch.setProperties === "object") {
            for (const [k, v] of Object.entries(ch.setProperties)) player.setDynamicProperty(k, v);
        }
        if (ch.takeItem) {
            takeItemFromInventory(player, ch.takeItem.typeId, ch.takeItem.count || 1);
        }
        if (typeof ch.repDelta === "number" && entity) {
            adjustReputation(player.name, entity.typeId, mobName || "?", ch.repDelta, { kind: "choice", target: mobName || "?" });
        }

        // --- RPG consequence layer ---
        // giveItem: hand the player reward items.
        if (Array.isArray(ch.giveItem)) {
            const inv = player.getComponent("minecraft:inventory");
            for (const ri of ch.giveItem) {
                try {
                    if (inv?.container) inv.container.addItem(new ItemStack(ri.typeId, ri.count || 1));
                } catch (e) { }
            }
        }
        // addEffect: grant a status effect (e.g. hero_of_the_village trade
        // discount). { id, duration (ticks), amplifier?, showParticles? }.
        const effs = Array.isArray(ch.addEffect) ? ch.addEffect : (ch.addEffect ? [ch.addEffect] : []);
        for (const ef of effs) {
            if (!ef || typeof ef !== "object" || !ef.id) continue;
            try {
                player.addEffect(ef.id, ef.duration || 3600, {
                    amplifier: ef.amplifier ?? 0,
                    showParticles: ef.showParticles ?? false
                });
            } catch (e) { console.warn("[MURMUR TREE] addEffect failed: " + e); }
        }
        // startQuest: hand out a structured quest from this NPC.
        if (ch.startQuest && typeof ch.startQuest === "object") {
            const sq = ch.startQuest;
            startQuest({
                player,
                questId: sq.questId,
                title: sq.title,
                type: sq.type || "collect",
                target: sq.target,
                deadlineDays: sq.deadlineDays,
                failRep: sq.failRep,
                amount: sq.amount || 1,
                mode: sq.mode,
                repeatable: sq.repeatable,
                giverType: entity?.typeId,
                giverName: mobName || entity?.typeId,
                rewardItems: sq.rewardItems,
                rewardRep: sq.rewardRep,
                intro: sq.intro,
                objective: sq.objective,
                x: sq.x,
                y: sq.y,
                z: sq.z,
                range: sq.range
            });
        }
        // turnIn: if the player is carrying this NPC's completed quest, pay out.
        if (ch.turnIn && typeof ch.turnIn === "string" && entity) {
            if (getQuest(player.name, ch.turnIn)) {
                turnInQuest({ player, questId: ch.turnIn });
            } else {
                player.sendMessage("§7[MURMUR] " + (ch.turnInFailText || "You haven't taken that task."));
            }
        }
        // questProgress: manually nudge an objective (e.g. a "goto" or scripted step).
        if (ch.questProgress && typeof ch.questProgress === "object") {
            questProgress(player.name, ch.questProgress.questId, ch.questProgress.delta || 1);
        }
        // sendMessage: flavor feedback if the author wants a directed reply.
        if (ch.sendMessage) player.sendMessage(`§7[MURMUR] §r${ch.sendMessage}`);
    } catch (e) { console.warn("[MURMUR TREE] effect error: " + e); }

    // Legacy command action (still supported, kept last)
    if (ch.action && entity && entity.isValid()) {
        try {
            const cmd = String(ch.action)
                .replace(/\{player\}/g, player.name)
                .replace(/\{name\}/g, mobName || "");
            entity.dimension.runCommand(cmd);
        } catch (e) { }
    }
}

/**
 * Opens an interactive branching dialogue tree for the given entity.
 * Returns true if a tree was shown, false if the entity has no tree.
 */
export function openTree(player, entity, forcedTreeId) {
    if (!player || !player.isValid()) return false;
    // Timed quests catch up with the player here (event-driven, never ticked):
    // overdue tasks fail now, so fail-tagged shame branches route correctly.
    try { checkQuestExpiry(player.name); } catch (e) { /* non-fatal */ }
    // Animal priority: talk/trees for farm animals belong to the animal stack
    // (which intentionally has no trees) — yield so vanilla behavior is kept.
    try {
        if (entity && entity.isValid() && shouldCoreYield(entity.typeId)) return false;
    } catch (e) { /* non-fatal — fall through */ }
    const treeId = forcedTreeId || resolveTreeId(entity?.typeId);
    const tree = treeId && globalThis.MURMUR_DATA.TREES[treeId];
    if (!tree || !tree.nodes) return false;

    const guardKey = `${player.id}|${entity?.id ?? treeId}`;
    if (openMenus.has(guardKey)) return false;
    openMenus.add(guardKey);

    try {
        const name = entity && entity.isValid() ? ensureNameTag(entity) : t("general.someone");
        const theme = entity ? themeFor(entity.typeId) : THEME.default;
        walk(player, entity, tree, tree.start, name, theme, guardKey);
    } catch (e) {
        openMenus.delete(guardKey);
        console.warn("[MURMUR TREE] open failed: " + e);
    }
    return true;
}

function walk(player, entity, tree, nodeId, name, theme, guardKey) {
    if (!player || !player.isValid()) { openMenus.delete(guardKey); return; }

    // Terminal node or missing node -> closing screen.
    if (!nodeId || nodeId === "__end__" || !tree.nodes[nodeId]) {
        closeScreen(player, name, theme, guardKey,
            nodeId && tree.nodes[nodeId] ? tree.nodes[nodeId].text : null);
        return;
    }

    const node = tree.nodes[nodeId];
    const form = new ActionFormData();
    const speakerLine = node.speaker ? (ensureNameTagSafe(entity, node.speaker) || name) : name;

    form.title(`${theme}§lMURMUR§r §8— ${speakerLine}`);
    let body = "";
    if (node.text) {
        body += `${theme}${wrapText(node.text, 88)}\n`;
    }
    if (node.end) {
        body += `\n§8§o(Their voice trails off into the static.)\n`;
    } else {
        body += `\n§8§o— Choose how to respond —\n`;
    }
    form.body(body);

    const mobName = entity && entity.isValid() ? ensureNameTag(entity) : null;
    const choices = Array.isArray(node.choices) ? node.choices : [];
    const visibleChoices = choices.filter(ch => choiceVisible(ch, player, entity, mobName));
    const handlers = visibleChoices;
    for (const ch of visibleChoices) {
        const label = ch && ch.label ? ch.label : "...";
        form.button(label);
    }
    // Always offer a graceful exit.
    form.button("§7§o[Leave]");

    form.show(player).then((res) => {
        if (res.canceled || res.selection === undefined) { openMenus.delete(guardKey); return; }

        if (res.selection === visibleChoices.length) {
            // [Leave]
            openMenus.delete(guardKey);
            return;
        }

        const ch = handlers[res.selection];
        if (!ch) { openMenus.delete(guardKey); return; }

        try {
            MurmurEvents.emit("treeChoiceSelected", { player, entity, nodeId, choice: ch });
        } catch (e) { }

        applyChoiceEffects(ch, player, entity, mobName);

        if (ch.goto && ch.goto !== "__end__") {
            walk(player, entity, tree, ch.goto, name, theme, guardKey);
        } else {
            openMenus.delete(guardKey);
        }
    }).catch(() => { openMenus.delete(guardKey); });
}

// A small closing card when a branch ends without offering further choices.
function closeScreen(player, name, theme, guardKey, text) {
    const form = new ActionFormData();
    form.title(`${theme}§lMURMUR§r §8— ${name}`);
    form.body(text ? `${theme}${wrapText(text, 88)}\n\n§8§o(Their voice trails off into the static.)\n` : "§7The moment passes. The air goes still again.\n");
    form.button("§7§o[Close]");
    form.show(player).then(() => openMenus.delete(guardKey)).catch(() => openMenus.delete(guardKey));
}

function ensureNameTagSafe(entity, fallback) {
    try { return entity && entity.isValid() ? ensureNameTag(entity) : fallback; }
    catch (e) { return fallback; }
}

// --- CHUNKED REGISTRATION BRIDGE (mirrors the dialogue bridge) ---
const TREE_CHUNK_BUFFER = {};

system.afterEvents.scriptEventReceive.subscribe((event) => {
    if (event.id !== "murmur:tree") return;
    try {
        const parts = event.message.split("|");
        if (parts.length < 4) return;
        const packId = parts[0];
        const typeId = parts[1].trim();
        const chunkIdx = parseInt(parts[2]);
        const total = parseInt(parts[3]);
        const dataChunk = parts.slice(4).join("|");

        const bufferKey = `tree:${packId}:${typeId}`;
        if (!TREE_CHUNK_BUFFER[bufferKey]) {
            TREE_CHUNK_BUFFER[bufferKey] = new Array(total).fill(null);
        }
        TREE_CHUNK_BUFFER[bufferKey][chunkIdx] = dataChunk;

        if (TREE_CHUNK_BUFFER[bufferKey].every(c => c !== null)) {
            const pieces = TREE_CHUNK_BUFFER[bufferKey];
            delete TREE_CHUNK_BUFFER[bufferKey];
            const fullData = reassembleChunks(pieces);
            if (!fullData) {
                world.sendMessage(`§c[MURMUR] Tree reassembly failed (bad payload): ${packId} -> ${typeId}`);
                return;
            }
            globalThis.MurmurAPI.registerTree(packId, typeId, fullData);
            world.sendMessage(`§a[MURMUR] Dialogue tree registered: ${packId} -> ${typeId}`);
        }
    } catch (e) {
        world.sendMessage(`§c[MURMUR] Tree reassembly ERROR: ${e}`);
    }
});

// --- DIALOGUE TOME: a held book that opens the tree for whatever you look at ---
const TOME_ID = "minecraft:book";
const TOME_NAME = "§d[MURMUR] §rDialogue Tome";
const TOME_LORE = ["§7Look at a creature, then right-click to speak."];
const TOME_TAG = "murmur:dialogue_tome_given";

function makeTome() {
    const book = new ItemStack(TOME_ID, 1);
    book.nameTag = TOME_NAME;
    book.setLore(TOME_LORE);
    return book;
}

world.afterEvents.playerSpawn.subscribe((event) => {
    const { player, initialSpawn } = event;
    if (!initialSpawn || player.hasTag(TOME_TAG)) return;
    system.runTimeout(() => {
        try {
            const inv = player.getComponent("minecraft:inventory");
            if (!inv?.container) return;
            inv.container.addItem(makeTome());
            player.addTag(TOME_TAG);
            player.sendMessage("§d[MURMUR] §rA §dDialogue Tome§r was placed in your bag. Right-click it while looking at a creature to talk.");
        } catch (e) { console.warn("[MURMUR TREE] tome gift failed: " + e); }
    }, 45);
});

world.afterEvents.itemUse.subscribe((event) => {
    const { source: player, itemStack } = event;
    if (!player || !itemStack) return;
    if (itemStack.typeId !== TOME_ID || itemStack.nameTag !== TOME_NAME) return;
    try {
        const hits = player.getEntitiesFromViewDirection({ maxDistance: 6 });
        for (const h of hits) {
            const e = h.entity;
            if (!e || !e.isValid()) continue;
            if (openTree(player, e)) return;
        }
        player.sendMessage("§7[MURMUR] Nothing nearby wants to talk... yet.");
    } catch (e) { console.warn("[MURMUR TREE] tome use failed: " + e); }
});

// Operator shortcut: /scriptevent murmur:talk  (opens tree for looked-at entity)
system.afterEvents.scriptEventReceive.subscribe((event) => {
    if (event.id !== "murmur:talk") return;
    const player = event.sourceEntity;
    if (!player || !player.isValid()) return;
    try {
        const hits = player.getEntitiesFromViewDirection({ maxDistance: 6 });
        for (const h of hits) {
            const e = h.entity;
            if (!e || !e.isValid()) continue;
            if (openTree(player, e)) return;
        }
        player.sendMessage("§7[MURMUR] Nothing nearby has a dialogue tree.");
    } catch (e) { }
});

// --- Interaction Hub: right-click a creature to engage with whatever MURMUR
// systems it supports. When a creature backs more than one system (dialogue
// tree, shop, active quests), we show a tiny chooser instead of guessing; when
// it backs exactly one, we go straight to that screen. It deliberately leaves
// vanilla villager trading alone (the game UI owns that) and only fires for
// creatures that have registered MURMUR content.
async function interactHub(player, entity, treeId) {
    const hasTree = !!treeId;
    const offers = entity && entity.isValid() ? hasOffers(entity.typeId) : false;
    const tasks = getActiveQuests(player.name).filter(q => q.giverType && entity && entity.typeId.includes(q.giverType.split(":")[1] || q.giverType));
    const hubChoices = [];
    if (hasTree) hubChoices.push("dialogue");
    if (offers) hubChoices.push("trade");
    if (tasks.length > 0) hubChoices.push("tasks");

    if (hubChoices.length === 1) {
        if (hubChoices[0] === "dialogue") { openTree(player, entity, treeId); return; }
        if (hubChoices[0] === "trade") { await openShop(player, entity); return; }
        player.sendMessage(`§7[MURMUR] You have ${tasks.length} open task(s) with them — ask in conversation.`);
        return;
    }

    if (hubChoices.length === 0) return;

    // Multiple systems -> chooser.
    const form = new ActionFormData()
        .title("§6§lMURMUR§r §8— how to engage");
    let body = "";
    if (hasTree) body += "§7The creature looks ready to talk.\n";
    if (offers) body += "§7They carry things they might trade.\n";
    if (tasks.length > 0) body += `§7You owe them ${tasks.length} open task(s).\n`;
    form.body(body || "§7What would you like to do?");

    if (hasTree) form.button("§bSpeak");
    if (offers) form.button("§6Trade");
    if (tasks.length > 0) form.button("§7My tasks");
    form.button("§7§o[Leave]");

    const res = await form.show(player);
    if (res.canceled || res.selection === undefined) return;
    const idx = res.selection;
    if (hasTree && idx === 0) { openTree(player, entity, treeId); return; }
    if (offers && (hasTree ? idx === 1 : idx === 0)) { await openShop(player, entity); return; }
    if (tasks.length > 0 && (hasTree ? (offers ? idx === 2 : idx === 1) : (offers ? idx === 1 : idx === 0))) {
        player.sendMessage("§6§l[MURMUR TASKS]§r");
        for (const q of tasks) {
            const done = q.current >= q.amount;
            player.sendMessage(`§${done ? "a" : "f"}  ${done ? "✔" : "•"} ${q.title} §7— ${done ? "ready to claim" : "in progress"}`);
        }
        return;
    }
}

// --- Interaction routing ---
//
// Vanilla villager trading owns the plain right-click, and Bedrock opens the
// trade screen whether or not the player is sneaking. The old handler only used
// `afterEvents.playerInteractWithEntity`, which is NOT cancellable, so sneaking
// stacked a dialogue form on top of an already-opening trade screen -- pick any
// dialogue option and the trade UI surfaced underneath it.
//
// Two fixes, both needed:
//   1. `beforeEvents.playerInteractWithEntity` is cancellable, so when it exists
//      we swallow the interact and open MURMUR's screen instead of the trade one.
//   2. When it doesn't exist we still open trees for non-trade entities, and give
//      trade entities (villagers) a dedicated route: sneak + right-click while
//      holding any book, which cannot be confused with trading.
//
// The `afterEvents` subscription is kept only as the fallback path.
function murmurCanHandle(player, target) {
    try {
        if (shouldCoreYield(target.typeId)) return false;
    } catch (e) { /* non-fatal */ }
    const tid = resolveTreeId(target.typeId);
    const hasTrade = hasOffers(target.typeId);
    const hasTasks = getActiveQuests(player.name).some(q => q.giverType && target.typeId.includes(q.giverType.split(":")[1] || q.giverType));
    if (!tid && !hasTrade && !hasTasks) return false;
    return { tid: tid || null, hasTrade, hasTasks };
}

function holdingBook(player) {
    try {
        const equip = player.getComponent("minecraft:equippable");
        const item = equip?.getEquipment("Mainhand");
        return !!item && !item.isAir && item.typeId === "minecraft:book";
    } catch (e) { return false; }
}

// 1. Preferred path: cancel the vanilla interact so the trade screen never opens.
let hasCancellableInteract = false;
if (world.beforeEvents && world.beforeEvents.playerInteractWithEntity) {
    hasCancellableInteract = true;
    world.beforeEvents.playerInteractWithEntity.subscribe((event) => {
        try {
            const { player, target } = event;
            if (!player || !player.isValid() || !target || !target.isValid()) return;
            const isSneaking = player.isSneaking ?? false;

            // Sneak + book: explicit talk route, works on villagers too.
            if (isSneaking && holdingBook(player)) {
                const info = murmurCanHandle(player, target);
                if (!info) return;
                event.cancel = true;
                system.run(() => { try { interactHub(player, target, info.tid); } catch (e) { } });
                return;
            }

            // Sneak + right-click (no book): only take over entities that have no
            // vanilla trade UI, so villager trading is never intercepted.
            if (isSneaking && !hasOffers(target.typeId)) {
                const info = murmurCanHandle(player, target);
                if (!info) return;
                event.cancel = true;
                system.run(() => { try { interactHub(player, target, info.tid); } catch (e) { } });
            }
        } catch (e) { /* non-fatal */ }
    });
}

// 2. Fallback: after-event only. Never fires for vanilla-trade entities, because
//    the trade screen is already open by then and we cannot close it.
if (world.afterEvents && world.afterEvents.playerInteractWithEntity) {
    world.afterEvents.playerInteractWithEntity.subscribe((event) => {
        try {
            const { player, target } = event;
            if (!player || !player.isValid() || !target || !target.isValid()) return;
            if (hasCancellableInteract) return;      // handled by the before-event
            if (hasOffers(target.typeId)) return;   // vanilla owns trading
            const info = murmurCanHandle(player, target);
            if (!info) return;
            system.run(() => { try { interactHub(player, target, info.tid); } catch (e) { } });
        } catch (e) { /* non-fatal */ }
    });
} else {
    try {
        console.warn("[MURMUR TREE] interact-to-talk skipped: playerInteractWithEntity API unavailable (enable Experimental/Beta).");
    } catch (e) { }
}

if (!hasCancellableInteract) {
    try {
        console.warn("[MURMUR TREE] beforeEvents.playerInteractWithEntity unavailable - villagers require sneak + book to talk.");
    } catch (e) { }
}

console.log("[MURMUR TREE] Dialogue tree engine loaded.");
