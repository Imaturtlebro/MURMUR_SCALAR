import { world, system } from "@minecraft/server";

// ============================================================================
//  MURMUR STEWARDSHIP — a small world-governance layer.
//
//  Some of the engine's tools (stocking merchants, seeding vault backups, live
//  world-mode toggles) ought not be available to just anybody on a shared
//  server. This module recognises a single "steward" (the first person to claim
//  the world) plus any "operators" they grant a permit to. Every privileged
//  /scriptevent in MURMUR consults isPermitted() before acting.
//
//  Unlike a per-file hardcoded name list, stewardship is stored in a world
//  dynamic property so it survives reloads and transfers between machines, and
//  it never blocks normal players from talking or trading — it only gates admin
//  commands. The whole idea is re-expressed from the source pack's "world
//  owner / world-mode" concept into MURMUR's own persistence idiom.
// ============================================================================

const STEWARD_KEY = "murmur:steward";
const OPERATORS_KEY = "murmur:stewards:ops";
const MODE_KEY = "murmur:stewards:mode";

function readJSON(key, fallback) {
    try {
        const raw = world.getDynamicProperty(key);
        if (!raw) return fallback;
        return JSON.parse(raw);
    } catch (e) {
        return fallback;
    }
}

function writeJSON(key, value) {
    try {
        world.setDynamicProperty(key, JSON.stringify(value));
    } catch (e) { }
}

export function getSteward() {
    return world.getDynamicProperty(STEWARD_KEY) || "";
}

export function claimSteward(playerName) {
    if (world.getDynamicProperty(STEWARD_KEY)) return false;
    try {
        world.setDynamicProperty(STEWARD_KEY, playerName);
    } catch (e) { return false; }
    return true;
}

export function getOperators() {
    return readJSON(OPERATORS_KEY, []);
}

export function addOperator(playerName) {
    const ops = getOperators();
    if (ops.includes(playerName)) return false;
    ops.push(playerName);
    writeJSON(OPERATORS_KEY, ops);
    return true;
}

export function removeOperator(playerName) {
    const ops = getOperators();
    const next = ops.filter((n) => n !== playerName);
    if (next.length === ops.length) return false;
    writeJSON(OPERATORS_KEY, next);
    return true;
}

/**
 * Is this player allowed to run steward-gated commands?
 */
export function isPermitted(player) {
    if (!player) return false;
    try { if (player.getTags().includes("murmur:admin")) return true; } catch (e) { }
    const name = player.name;
    if (name === getSteward()) return true;
    return getOperators().includes(name);
}

// --- World mode (a hint used by packs for survival-vs-creative behavior) ---
export function getWorldMode() {
    return world.getDynamicProperty(MODE_KEY) || "survival";
}
export function setWorldMode(mode) {
    try { world.setDynamicProperty(MODE_KEY, mode); } catch (e) { }
    return mode;
}

// --- Stewardship commands ---------------------------------------------------
//  /scriptevent murmur:steward          - claim the world (first time only)
//  /scriptevent murmur:steward list     - show steward + operators
//  /scriptevent murmur:steward op <name>    - steward grants a permit
//  /scriptevent murmur:steward deop <name>  - steward revokes a permit
//  /scriptevent murmur:steward mode <survival|creative> - steward sets world mode
system.afterEvents.scriptEventReceive.subscribe((event) => {
    if (event.id !== "murmur:steward") return;
    const player = event.sourceEntity;
    if (!player || player.typeId !== "minecraft:player") return;

    const parts = (event.message || "").trim().split(/\s+/);
    const verb = (parts[0] || "").toLowerCase();

    if (verb === "list") {
        const ops = getOperators();
        player.sendMessage("§6[MURMUR] Steward: §f" + (getSteward() || "(none)"));
        player.sendMessage("§7  Operators: " + (ops.length ? ops.join(", ") : "(none)"));
        player.sendMessage("§7  World mode: §f" + getWorldMode());
        return;
    }

    if (verb === "mode") {
        if (!isPermitted(player)) { player.sendMessage("§7[MURMUR] You need steward rights for that."); return; }
        const mode = (parts[1] || "").toLowerCase();
        if (mode !== "survival" && mode !== "creative" && mode !== "adventure") {
            player.sendMessage("§7Usage: /scriptevent murmur:steward mode <survival|creative|adventure>");
            return;
        }
        setWorldMode(mode);
        player.sendMessage(`§a[MURMUR] World mode set to ${mode}.`);
        return;
    }

    if (verb === "op" || verb === "deop") {
        if (!isPermitted(player)) { player.sendMessage("§7[MURMUR] You need steward rights for that."); return; }
        const name = (parts[1] || "").trim();
        if (!name) { player.sendMessage("§7Usage: /scriptevent murmur:steward " + verb + " <playerName>"); return; }
        if (verb === "op") {
            if (addOperator(name)) player.sendMessage(`§a[MURMUR] Granted operator permit to ${name}.`);
            else player.sendMessage("§7[MURMUR] They already hold a permit.");
        } else {
            if (removeOperator(name)) player.sendMessage(`§7[MURMUR] Revoked ${name}'s permit.`);
            else player.sendMessage("§7[MURMUR] No permit to revoke.");
        }
        return;
    }

    // Default: claim
    if (!world.getDynamicProperty(STEWARD_KEY)) {
        if (claimSteward(player.name)) {
            player.sendMessage("§a[MURMUR] You are now the steward of this world. You can grant operator permits.");
            player.addTag("murmur:admin");
        }
    } else {
        player.sendMessage("§7[MURMUR] This world already has a steward. Ask them for an operator permit.");
    }
});

console.log("[MURMUR STEWARD] Governance layer loaded.");
