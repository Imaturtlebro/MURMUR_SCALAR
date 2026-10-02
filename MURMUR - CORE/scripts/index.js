import { world, system } from "@minecraft/server";
console.log("[MURMUR CORE] Scripting initialization starting...");

import "./api.js";
import "./animal_priority.js"; // beacon listener: yields farm animals to ANIMAL CORE when present
import { isAnimalCoreActive, getAnimalClaims } from "./animal_priority.js";
import { setLanguage } from "./localization.js";
import { chatterCooldowns } from "./utils.js";
import "./conversations.js";
import "./memory.js";
import "./memoryEvents.js";
import "./main.js";
import "./langbook.js";
import "./dialogue_tree.js";
import "./quests.js";
import "./rep_hud.js";
import "./worldadmin.js";
import "./vault.js";
import "./commerce.js";
import { validateSchema } from "./events.js";



// --- GLOBAL LANGUAGE TOGGLE ---
system.afterEvents.scriptEventReceive.subscribe((event) => {
    if (event.id === "murmur:lang") {
        const lang = event.message.trim();
        let selectedLang = "en_US";

        if (lang === "en" || lang === "en_US") {
            selectedLang = "en_US";
            world.sendMessage("§e[MURMUR] Language set to English.");
        } else if (lang === "es" || lang === "es_ES") {
            selectedLang = "es_ES";
            world.sendMessage("§e[MURMUR] Idioma establecido en Español.");
        } else if (lang === "pt" || lang === "pt_BR" || lang === "pt_PT") {
            selectedLang = "pt_BR";
            world.sendMessage("§e[MURMUR] Idioma definido para Português.");
        }

        setLanguage(selectedLang);

        // Reset all cooldown maps so mobs can speak in the new language immediately
        chatterCooldowns.clear();
    }
});

// --- AMBIENT CHATTER TOGGLE ---
system.afterEvents.scriptEventReceive.subscribe((event) => {
    if (event.id !== "murmur:chatter") return;
    const arg = (event.message || "").trim().toLowerCase();
    if (arg === "off" || arg === "0" || arg === "false") {
        globalThis.MURMUR_DATA.CHATTER_ENABLED = false;
        world.sendMessage("§7[MURMUR] Ambient chatter §cdisabled§7.");
    } else {
        globalThis.MURMUR_DATA.CHATTER_ENABLED = true;
        world.sendMessage("§7[MURMUR] Ambient chatter §aenabled§7.");
    }
});

// --- STATUS / DEBUG ---
system.afterEvents.scriptEventReceive.subscribe((event) => {
    if (event.id !== "murmur:status") return;
    const d = globalThis.MURMUR_DATA;
    const pc = event.sourceEntity;
    const send = (msg) => { if (pc && pc.isValid()) pc.sendMessage(msg); else world.sendMessage(msg); };
    const typeCount = Object.keys(d.DIALOGUE || {}).length;
    const treeCount = Object.keys(d.TREES || {}).length;
    const nameCount = Object.keys(d.NAMES || {}).length;
    const factCount = Object.keys(d.FACTIONS || {}).length;
    const chatter = (d.CHATTER_ENABLED === false) ? "§cOFF" : "§aON";
    send("§6[MURMUR STATUS] §rEngine online.");
    send(`  §7Chatter: ${chatter}`);
    send(`  §7Registered entity types: §f${typeCount}`);
    send(`  §7Registered dialogue trees: §f${treeCount}`);
    send(`  §7Name pools: §f${nameCount} §7| Factions: §f${factCount}`);
    send(`  §7Languages: §f${Object.keys(d.TRANSLATIONS || {}).join(", ") || "en_US"}`);
    send(`  §7Systems: §fQuest Engine §8(§7/murmur:quest journal§8)§f, §fReputation HUD §8(§7/murmur:rep§8)§f, §fTalk §8(§7right-click or tome§8)`);
    send(`  §7Commerce §8(§7right-click to trade§8)§f, §fSteward §8(§7/murmur:steward§8)§f, §fVault §8(§7/murmur:vault§8)`);
    try {
        if (isAnimalCoreActive()) send(`  §7Animal priority: §aACTIVE §8(§7farm animals yield to ANIMAL CORE: ${(getAnimalClaims() || []).length} claimed§8)`);
        else send(`  §7Animal priority: §8idle §8(§7no ANIMAL CORE beacon — this engine serves all registered types§8)`);
    } catch (e) { /* non-fatal */ }
});

// --- DIAGNOSTICS (deep engine report for debugging "silent mobs" issues) ---
system.afterEvents.scriptEventReceive.subscribe((event) => {
    if (event.id !== "murmur:diag") return;
    const d = globalThis.MURMUR_DATA;
    const pc = event.sourceEntity;
    const send = (msg) => { if (pc && pc.isValid()) pc.sendMessage(msg); else world.sendMessage(msg); };

    const DIALOGUE = d.DIALOGUE || {};
    const TREES = d.TREES || {};
    const NAMES = d.NAMES || {};

    send("§6=== MURMUR DIAGNOSTICS ===");
    send(`§7Engine: §fCORE v1.0.36 §7| Language: §f${d.LANGUAGE || "en_US"} §7| Chatter: §f${d.CHATTER_ENABLED === false ? "OFF" : "ON"}`);

    send(`\n§6Registered DIALOGUE types (${Object.keys(DIALOGUE).length}):`);
    for (const [typeId, pool] of Object.entries(DIALOGUE)) {
        const condCount = pool ? Object.keys(pool).length : 0;
        let totalLines = 0;
        for (const c of Object.values(pool || {})) {
            if (Array.isArray(c)) totalLines += c.length;
            else if (c && typeof c === "object") totalLines += Object.values(c).reduce((a, v) => a + (Array.isArray(v) ? v.length : 0), 0);
        }
        send(`  §f${typeId} §7— ${condCount} conds, ${totalLines} lines`);
    }

    send(`\n§6Registered TREES (${Object.keys(TREES).length}):`);
    for (const [key, tree] of Object.entries(TREES)) {
        const nodeCount = tree?.nodes ? Object.keys(tree.nodes).length : 0;
        send(`  §f${key} §7— start:§f ${tree?.start || "?"} §7(§f${nodeCount}§7 nodes)`);
    }
    const villagerTree = Object.keys(TREES).find(k => k.includes("villager"));
    send(villagerTree ? `§a  -> villager tree present: ${villagerTree}` : `§c  -> NO villager tree registered!`);

    send(`\n§6Registered NAME pools (${Object.keys(NAMES).length}):`);
    for (const [typeId, pool] of Object.entries(NAMES)) {
        const c = pool && typeof pool === "object" && pool.en_US ? pool.en_US : pool;
        send(`  §f${typeId} §7— ${Array.isArray(c) ? c.length + " names" : Object.keys(pool||{}).join(",")}`);
    }
    send(Object.keys(NAMES).includes("minecraft:villager_v2")
        ? "§a  -> villager name pool present"
        : "§c  -> NO villager name pool!");

    // Interact event availability (feature-detect, matches dialogue_tree.js).
    const hasInteract = !!(world.afterEvents && world.afterEvents.playerInteractWithEntity);
    send(`\n§6Interact-to-talk event available: §f${hasInteract ? "YES" : "NO"}`);
    if (!hasInteract) send("§c  -> Enable Experimental/Beta APIs so right-click talk can fire.");

    // Chunked-data buffer health (see api.js).
    const buffers = globalThis.__MURMUR_CHUNK_BUFFER__;
    send(`\n§6Chunk assemblies in flight: §f${buffers ? Object.keys(buffers).length : 0}`);
});

// --- SCHEMA VALIDATION (dev tooling) ---
system.afterEvents.scriptEventReceive.subscribe((event) => {
    if (event.id !== "murmur:validate") return;
    const pc = event.sourceEntity;
    const send = (msg) => { if (pc && pc.isValid()) pc.sendMessage(msg); else world.sendMessage(msg); };
    try {
        const issues = validateSchema();
        if (issues.length === 0) {
            send("§a[MURMUR VALIDATE] No schema issues detected across registered content.");
        } else {
            send(`§c[MURMUR VALIDATE] ${issues.length} issue(s) found:`);
            issues.slice(0, 40).forEach((i) => send("  §7- " + i));
        }
    } catch (e) {
        send("§c[MURMUR VALIDATE] validator crashed: " + e);
    }
});

// --- AMBIENT TALK SOUND TOGGLE ---
system.afterEvents.scriptEventReceive.subscribe((event) => {
    if (event.id !== "murmur:sound") return;
    const arg = (event.message || "").trim().toLowerCase();
    globalThis.MURMUR_DATA.SOUND_ENABLED = !(arg === "off" || arg === "0" || arg === "false");
    world.sendMessage(globalThis.MURMUR_DATA.SOUND_ENABLED
        ? "§a[MURMUR] Talk sounds enabled."
        : "§7[MURMUR] Talk sounds disabled.");
});

// --- INIT WARNINGS (on player spawn / world load) ---
function sendMurMurInit(player) {
    if (!player || !player.isValid()) return;
    const lines = [
        "§6§l[MURMUR CORE] §r§eLoaded.",
        "§c§lREQUIRED PACK: §r§7You must have ONE MURMUR content pack installed:",
        "§7  • Brainrot, Cruel, Medieval, Noir, Praise, Uncanny  →  require §fMURMUR CORE§7 (this).",
        "§7  • Animal Pack  →  requires §fANIMAL CORE§7 instead.",
        "§a§lCOMPATIBLE: §r§7ANIMAL CORE may run alongside this. Farm animals always prioritize ANIMAL CORE; run only ONE CORE story pack (Uncanny/Cruel/...) at a time.",
        "§c§lDEPENDENCIES: §r§7Make sure you have all dependencies. READ THE MOD PAGE.",
        "§c§lEXPERIMENTAL: §r§7If mobs stay silent, enable Experimental Settings / Beta APIs for this world (see mod page).",
        "§bCredits: Scalarlabs. §7Look for my other addons on Curseforge."
    ];
    lines.forEach((line, i) => system.runTimeout(() => {
        if (player.isValid()) player.sendMessage(line);
    }, i * 4));
}

world.afterEvents.playerSpawn.subscribe((event) => {
    if (event.initialSpawn) {
        sendMurMurInit(event.player);
    }
});

console.log("[MURMUR] Entry point loaded.");
