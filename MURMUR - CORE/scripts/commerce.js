import { world, system, ItemStack } from "@minecraft/server";
import { ActionFormData } from "@minecraft/server-ui";
import { MurmurEvents, validateSchema } from "./events.js";
import { shouldCoreYield } from "./animal_priority.js";

// ============================================================================
//  MURMUR COMMERCE — a seller/trade framework for talkable creatures.
//
//  A "merchant" EntityType can be attached a catalog (a list of offers) either
//  by a content pack (via the JSON registration bridge) or at runtime by an
//  admin. Offers describe what they sell, how many, and what they want back
//  (item + quantity). The engine resolves a purchase atomically — it refuses to
//  start unless the player can actually hold the goods, deducts the asking
//  price, then hands over the goods, rolling the price back if room vanished.
//
//  Persistence is world dynamic-property sharded per merchant, so offers
//  survive reloads and never collide between sellers.
// ============================================================================

const MERCHANT_KEY = "murmur:commerce:";
const GUILD_CACHE = new Map(); // merchant-key -> offers[]  (in-memory mirror)
const ACTIVE_TRANSACTIONS = new Set(); // prevents double-buy on rapid clicks

// --- Catalog shapes ---------------------------------------------------------
// An offer:  { sell: { id, amount }, ask: { id, amount } }
// A merchant catalog: [ offer, offer, ... ]

function merchantKey(typeId) {
    return MERCHANT_KEY + (typeId || "unknown");
}

function loadOffers(typeId) {
    const key = merchantKey(typeId);
    if (GUILD_CACHE.has(key)) return GUILD_CACHE.get(key);
    let offers = [];
    try {
        const raw = world.getDynamicProperty(key);
        if (raw) {
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed)) offers = parsed;
        }
    } catch (e) { }
    GUILD_CACHE.set(key, offers);
    return offers;
}

function saveOffers(typeId, offers) {
    const key = merchantKey(typeId);
    GUILD_CACHE.set(key, offers);
    try {
        world.setDynamicProperty(key, JSON.stringify(offers));
    } catch (e) {
        console.warn("[MURMUR COMMERCE] could not persist catalog for " + typeId);
    }
}

/**
 * Attach (or merge) a set of offers to a merchant type. Drops any offer that
 * fails validation rather than crashing the whole catalog.
 */
export function registerMerchantCatalog(typeId, offers) {
    if (!typeId || !Array.isArray(offers)) return false;
    const merged = [...loadOffers(typeId)];
    let added = 0;
    for (const off of offers) {
        if (!isValidOffer(off)) continue;
        // Dedupe identical (sell,ask) combos so re-registration is idempotent.
        const dup = merged.find(m =>
            m.sell?.id === off.sell?.id && m.ask?.id === off.ask?.id &&
            m.sell?.amount === off.sell?.amount && m.ask?.amount === off.ask?.amount);
        if (dup) continue;
        merged.push(off);
        added++;
    }
    if (added > 0) saveOffers(typeId, merged);
    return added > 0;
}

export function isValidOffer(off) {
    if (!off || typeof off !== "object") return false;
    if (!off.sell || !off.sell.id || typeof off.sell.id !== "string") return false;
    if (!off.ask || !off.ask.id || typeof off.ask.id !== "string") return false;
    const sNum = Number(off.sell.amount) || 1;
    const aNum = Number(off.ask.amount) || 1;
    off.sell.amount = Math.min(64, Math.max(1, Math.floor(sNum)));
    off.ask.amount = Math.min(64, Math.max(1, Math.floor(aNum)));
    if (off.sell.id === off.ask.id && off.sell.amount === off.ask.amount) return false;
    return true;
}

export function hasOffers(typeId) {
    return loadOffers(typeId).length > 0;
}

// --- Inventory guards ------------------------------------------------------

// Counts how many free slots (plus stackable headroom) the player has for an item.
function storageRoom(player, itemId, qty) {
    try {
        const inv = player.getComponent("minecraft:inventory");
        if (!inv || !inv.container) return 0;
        const c = inv.container;
        let room = 0;
        for (let i = 0; i < c.size; i++) {
            const it = c.getItem(i);
            if (!it) {
                room += qty; // a fresh slot can swallow the whole requested stack
                continue;
            }
            if (it.typeId === itemId) {
                const head = it.maxAmount - it.amount;
                room += Math.max(0, head);
            }
        }
        return room;
    } catch (e) { return 0; }
}

function emptySlots(player) {
    try {
        const inv = player.getComponent("minecraft:inventory");
        if (!inv || !inv.container) return 0;
        const c = inv.container;
        let free = 0;
        for (let i = 0; i < c.size; i++) if (!c.getItem(i)) free++;
        return free;
    } catch (e) { return 0; }
}

function countHeld(player, itemId) {
    try {
        const inv = player.getComponent("minecraft:inventory");
        if (!inv || !inv.container) return 0;
        const c = inv.container;
        let n = 0;
        for (let i = 0; i < c.size; i++) {
            const it = c.getItem(i);
            if (it && it.typeId === itemId) n += it.amount;
        }
        return n;
    } catch (e) { return 0; }
}

function deductHeld(player, itemId, qty) {
    try {
        const inv = player.getComponent("minecraft:inventory");
        if (!inv || !inv.container) return false;
        const c = inv.container;
        let remaining = qty;
        for (let i = 0; i < c.size && remaining > 0; i++) {
            const it = c.getItem(i);
            if (it && it.typeId === itemId) {
                const take = Math.min(it.amount, remaining);
                remaining -= take;
                if (it.amount - take > 0) {
                    let rep = it.clone();
                    try { rep = rep.setAmount(it.amount - take); }
                    catch (e) { try { rep.amount = it.amount - take; } catch (e2) { } }
                    c.setItem(i, rep);
                } else {
                    c.setItem(i, undefined);
                }
            }
        }
        return remaining <= 0;
    } catch (e) { return false; }
}

function grantHeld(player, itemId, qty) {
    try {
        const inv = player.getComponent("minecraft:inventory");
        if (!inv || !inv.container) return false;
        const c = inv.container;
        const leftover = c.addItem(new ItemStack(itemId, qty));
        return !leftover || leftover.amount === 0;
    } catch (e) { return false; }
}

/**
 * Execute a trade atomically.
 * @param {Player} player
 * @param {Object} offer  { sell:{id,amount}, ask:{id,amount} }
 * @returns {{ok:boolean, message:string}}
 */
export function runTrade(player, offer) {
    if (ACTIVE_TRANSACTIONS.has(player.id)) {
        return { ok: false, message: "§7One purchase at a time, please." };
    }
    if (!offer || !isValidOffer({ sell: offer.sell, ask: offer.ask })) {
        return { ok: false, message: "§cThis offer looks damaged." };
    }
    ACTIVE_TRANSACTIONS.add(player.id);
    try {
        const sellId = offer.sell.id;
        const sellQty = offer.sell.amount;
        const askId = offer.ask.id;
        const askQty = offer.ask.amount;

        // 1) Pre-flight: can the player both afford it AND carry it?
        if (countHeld(player, askId) < askQty) {
            return { ok: false, message: `§7Not enough ${prettyId(askId)}.` };
        }
        // Non-stackable goods need one free slot each.
        const sellsStackable = isStackable(sellId, sellQty);
        if (!sellsStackable) {
            if (emptySlots(player) < sellQty) {
                return { ok: false, message: "§7Your bag has no room for that." };
            }
        } else if (storageRoom(player, sellId, sellQty) < sellQty) {
            return { ok: false, message: "§7No room to carry that yet." };
        }

        // 2) Deduct the price.
        if (!deductHeld(player, askId, askQty)) {
            return { ok: false, message: "§cThe transaction failed." };
        }

        // 3) Hand over the goods; roll the price back if it somehow fails.
        if (!grantHeld(player, sellId, sellQty)) {
            grantHeld(player, askId, askQty);
            return { ok: false, message: "§7No room to carry that yet — nothing was lost." };
        }

        try { MurmurEvents.emit("commerceTrade", { player, offer }); } catch (e) { }
        return { ok: true, message: `§aBought ${sellQty}x ${prettyId(sellId)}.` };
    } finally {
        ACTIVE_TRANSACTIONS.delete(player.id);
    }
}

function isStackable(id, qty) {
    try {
        return new ItemStack(id, qty).maxAmount > 1;
    } catch (e) {
        return true; // safest default: treat unknown as stackable
    }
}

function prettyId(id) {
    return String(id).replace(/^minecraft:/, "").replace(/_/g, " ");
}

// --- Merchant UI -----------------------------------------------------------

/**
 * Opens the shop screen for a merchant and a player. Returns false if the
 * merchant has nothing to sell.
 */
export async function openShop(player, entity) {
    if (!player || !player.isValid() || !entity || !entity.isValid()) return false;
    const offers = loadOffers(entity.typeId);
    if (offers.length === 0) return false;

    const merchantName = (entity.nameTag?.split("\n")[0]) || "the merchant";
    const form = new ActionFormData()
        .title(`§6§lMURMUR§r §8— ${merchantName}'s stock`)
        .body(`§7What catches your eye?\n§8Each purchase is final — and honest.`);

    const mapping = [];
    for (const off of offers.slice(0, 12)) {
        form.button(`${off.sell.amount}x ${prettyId(off.sell.id)}\n§7→ ${off.ask.amount}x ${prettyId(off.ask.id)}`);
        mapping.push(off);
    }
    form.button("§7§o[Leave]");

    const res = await form.show(player);
    if (res.canceled || res.selection === undefined || res.selection >= mapping.length) return true;

    const chosen = mapping[res.selection];
    const cost = `${chosen.ask.amount}x ${prettyId(chosen.ask.id)}`;
    const afford = countHeld(player, chosen.ask.id) >= chosen.ask.amount;

    const confirm = new ActionFormData()
        .title(`§6§lMURMUR§r §8— confirm purchase`)
        .body(`${chosen.sell.amount}x ${prettyId(chosen.sell.id)}\n§7for §f${cost}§7${afford ? " §2(in stock)" : " §c(short)"}`)
        .button(afford ? "§aTake it" : "§7Can't afford")
        .button("§7Back");

    const cr = await confirm.show(player);
    if (cr.canceled || cr.selection === 1) {
        await openShop(player, entity);
        return true;
    }
    if (!afford) {
        player.sendMessage("§7[MURMUR] You can't cover that yet.");
        await openShop(player, entity);
        return true;
    }

    const result = runTrade(player, chosen);
    player.sendMessage(`§6[MURMUR] §r${result.message}`);
    await openShop(player, entity);
    return true;
}

// --- Admin: manage a merchant's catalog ------------------------------------
// Operator can seed/clear a merchant's stock via /scriptevent murmur:shop.

system.afterEvents.scriptEventReceive.subscribe((event) => {
    if (event.id !== "murmur:shop") return;
    const player = event.sourceEntity;
    if (!player || player.typeId !== "minecraft:player") return;
    const message = (event.message || "").trim();
    const parts = message.split(/\s+/);
    const verb = (parts[0] || "").toLowerCase();
    const cmd = parts.slice(1).join(" ");

    if (verb === "stock" && player.hasTag("murmur:admin")) {
        // murmur:shop stock <typeId> <sellId> <sellAmt> <askId> <askAmt>
        const sp = cmd.split(/\s+/);
        if (sp.length < 5) {
            player.sendMessage("§7Usage: /scriptevent murmur:shop stock <typeId> <sellId> <sellAmt> <askId> <askAmt>");
            return;
        }
        const typeId = sp[0];
        const offer = {
            sell: { id: sp[1], amount: parseInt(sp[2]) || 1 },
            ask: { id: sp[3], amount: parseInt(sp[4]) || 1 }
        };
        if (registerMerchantCatalog(typeId, [offer])) {
            player.sendMessage(`§a[MURMUR] Added an offer for ${typeId}.`);
            try {
                if (shouldCoreYield(typeId)) player.sendMessage("§e[MURMUR] Note: ANIMAL CORE is active — farm animals prioritize the animal stack; this stock only applies while ANIMAL CORE is absent.");
            } catch (e) { /* non-fatal */ }
        } else {
            player.sendMessage("§c[MURMUR] Offer rejected (check ids / amounts).");
        }
    } else if (verb === "clear" && player.hasTag("murmur:admin")) {
        const typeId = (cmd || "").trim();
        if (!typeId) { player.sendMessage("§7Usage: /scriptevent murmur:shop clear <typeId>"); return; }
        saveOffers(typeId, []);
        player.sendMessage(`§7[MURMUR] Cleared ${typeId}'s stock.`);
    }
});

console.log("[MURMUR COMMERCE] Trade engine warmed up.");
