import { world, system } from "@minecraft/server";
import { isPermitted } from "./worldadmin.js";

// ============================================================================
//  MURMUR VAULT — a lightweight crash/recovery ledger for persisted state.
//
//  MURMUR keeps most durable data in sharded world dynamic-properties (quests,
//  merchant stock, reputation memories). A single world property can be
//  overwritten by an ungraceful reload or a wildcard cleanup, and once gone it
//  is gone. The vault maintains a separate checksummed mirror of every shard we
//  care about, then on demand (or on a timer) re-validates each live shard and
//  restores any one whose hash no longer matches its recorded history.
//
//  The design deliberately mirrors the source pack's "back everything up in
//  more than one place" concern, but is shaped around MURMUR's own shard keys
//  and granular per-shard hashes rather than a single monolithic copy.
// ============================================================================

const VAULT_KEY = "murmur:vault:backup";
const PREFIXES = ["murmur:quests:", "murmur:mem:p:", "murmur:mem:v", "murmur:commerce:"];

// A tiny deterministic hash so two equal payloads always hash identically. We
// do not need cryptographic strength, only a reliable change/bulk detector.
function hash(payload) {
    const s = String(payload ?? "");
    let h = 2166136261;
    for (let i = 0; i < s.length; i++) {
        h ^= s.charCodeAt(i);
        h = Math.imul(h, 16777619);
    }
    return (h >>> 0).toString(16);
}

function idIsTracked(id) {
    return PREFIXES.some((p) => id === p || id.startsWith(p) || id.startsWith(p.replace(/^murmur:/, "murmur:")));
}

function collectTracked() {
    const map = {}; // dpId -> payload
    const ids = (typeof world.getDynamicPropertyIds === "function") ? world.getDynamicPropertyIds() : [];
    for (const id of ids) {
        if (!idIsTracked(id)) continue;
        try { map[id] = world.getDynamicProperty(id) ?? ""; } catch (e) { }
    }
    return map;
}

function loadBackup() {
    try {
        const raw = world.getDynamicProperty(VAULT_KEY);
        if (!raw) return { shards: {} };
        const parsed = JSON.parse(raw);
        return (parsed && parsed.shards) ? parsed : { shards: {} };
    } catch (e) {
        return { shards: {} };
    }
}

function saveBackup(entry) {
    try {
        world.setDynamicProperty(VAULT_KEY, JSON.stringify({ shards: entry, updated: Date.now() }));
    } catch (e) { }
}

/**
 * Refresh the vault from the live shards. Called on startup and by the
 * maintenance timer so the mirror stays current with legitimate changes.
 */
export function backup() {
    const map = collectTracked();
    const shards = loadBackup().shards;
    for (const [id, payload] of Object.entries(map)) {
        shards[id] = { h: hash(payload), v: String(payload ?? "") };
    }
    saveBackup(shards);
    return Object.keys(map).length;
}

/**
 * Inspect every tracked shard, restore any whose payload no longer matches the
 * vault's recorded hash, and refresh the mirror for anything that still agrees.
 * @returns {{restored:string[], ok:string[], missing:string[]}}
 */
export function audit() {
    const vault = loadBackup();
    const map = collectTracked();
    const restored = [];
    const ok = [];
    const missing = [];

    for (const [id, rec] of Object.entries(vault.shards)) {
        const live = map[id];
        if (live === undefined) {
            missing.push(id);
            continue;
        }
        if (hash(live) === rec.h) {
            ok.push(id);
        } else {
            // The live shard diverged from history. If we still have the good
            // copy recorded, put it back; otherwise trust the live data and
            // re-record it as canonical.
            if (typeof rec.v === "string" && rec.v.length > 0) {
                try {
                    world.setDynamicProperty(id, rec.v);
                    restored.push(id);
                } catch (e) { }
            } else {
                ok.push(id);
            }
        }
    }

    // Any shards present now but never backed up get recorded as canonical.
    let newOnes = 0;
    for (const id of Object.keys(map)) {
        if (!vault.shards[id]) { vault.shards[id] = { h: hash(map[id]), v: String(map[id] ?? "") }; newOnes++; }
    }
    saveBackup(vault.shards);
    return { restored, ok, missing, newOnes };
}

// --- Startup: seed the vault mirror shortly after load so we have a baseline.
system.runInterval(() => {
    const ids = (typeof world.getDynamicPropertyIds === "function") ? world.getDynamicPropertyIds() : [];
    const trackedNow = ids.some((id) => idIsTracked(id));
    if (!trackedNow) return;
    backup();
}, 600);

// --- Maintenance command -----------------------------------------------------
//  /scriptevent murmur:vault backup   - force a snapshot refresh
//  /scriptevent murmur:vault audit    - check & restore (steward or operator)
system.afterEvents.scriptEventReceive.subscribe((event) => {
    if (event.id !== "murmur:vault") return;
    const player = event.sourceEntity;
    const verb = (event.message || "").trim().toLowerCase();
    const announce = (msg) => { if (player && player.isValid()) player.sendMessage(msg); else world.sendMessage(msg); };

    if (verb === "backup" || verb === "") {
        const n = backup();
        announce(`§a[MURMUR VAULT] Snapshot refreshed (${n} shards).`);
        return;
    }
    if (verb === "audit") {
        if (!isPermitted(player)) { announce("§7[MURMUR VAULT] Restore requires steward or operator rights."); return; }
        const r = audit();
        announce(`§6[MURMUR VAULT]§r ok:§f ${r.ok.length}§r restored:§f ${r.restored.length}§r new:§f ${r.newOnes}`);
        if (r.restored.length > 0) {
            for (const id of r.restored) announce("  §arestored §7" + id);
        }
        return;
    }
    announce("§7Usage: /scriptevent murmur:vault <backup|audit>");
});

console.log("[MURMUR VAULT] Crash-recovery ledger loaded.");
