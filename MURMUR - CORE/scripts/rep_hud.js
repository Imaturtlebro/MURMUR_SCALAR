import { world, system } from "@minecraft/server";
import { ensureNameTag } from "./utils.js";
import { getReputation, getStatus, isFriendlySentient, describeRelationship } from "./memory.js";
import { getLanguage } from "./localization.js";

// --- MURMUR REPUTATION HUD ---
// Displays the player's current relationship with the friendly sentient mob
// they are looking at, in the action bar. Turned on/off via
// /scriptevent murmur:rep on|off. Runs at a throttled cadence so it is cheap.

let repHudEnabled = true;

system.afterEvents.scriptEventReceive.subscribe((event) => {
    if (event.id !== "murmur:rep") return;
    const arg = (event.message || "").trim().toLowerCase();
    if (arg === "off" || arg === "0" || arg === "false") {
        repHudEnabled = false;
        world.sendMessage("§7[MURMUR] Reputation HUD §cdisabled§7.");
    } else {
        repHudEnabled = true;
        world.sendMessage("§a[MURMUR] Reputation HUD enabled. §7Look at a villager to see your standing.");
    }
});

// Throttle so each player only scans every ~10 ticks.
const hudState = new Map(); // playerId -> tick last ran

system.runInterval(() => {
    if (!repHudEnabled) return;
    try {
        const lang = getLanguage();
        for (const p of world.getPlayers()) {
            if (!p || !p.isValid()) continue;
            if (hudState.has(p.id) && system.currentTick - hudState.get(p.id) < 10) continue;
            hudState.set(p.id, system.currentTick);

            const hits = p.getEntitiesFromViewDirection({ maxDistance: 8 });
            let target = null;
            for (const h of hits) {
                const e = h.entity;
                if (!e || !e.isValid()) continue;
                if (isFriendlySentient(e.typeId)) { target = e; break; }
            }
            if (!target) {
                const active = p.getEntitiesFromViewDirection({ maxDistance: 8 }).find(h => h.entity && h.entity.isValid());
                if (active && isFriendlySentient(active.entity.typeId)) target = active.entity;
                else continue;
            }

            const mobName = ensureNameTag(target);
            const rep = getReputation(p.name, target.typeId, mobName);
            const status = getStatus(rep, lang);
            const { grudge } = describeRelationship(p.name, target.typeId, mobName, lang);

            const color = rep >= 30 ? "§2" : rep >= 10 ? "§a" : rep <= -30 ? "§4" : rep <= -10 ? "§c" : "§7";
            let msg = `§7${mobName} §8— §r${color}${status}§r §8(${rep >= 0 ? "+" : ""}${rep})`;
            if (grudge) msg += ` §7· ${grudge}`;
            p.onScreenDisplay?.setActionBar(msg);
        }
    } catch (e) { }
}, 4);

console.log("[MURMUR REP HUD] Reputation HUD loaded.");
