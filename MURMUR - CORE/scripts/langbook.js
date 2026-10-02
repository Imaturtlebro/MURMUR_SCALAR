import { world, system, ItemStack, EquipmentSlot } from "@minecraft/server";
import { ActionFormData } from "@minecraft/server-ui";
import { setLanguage, getLanguage } from "./localization.js";

// --- CONSTANTS ---
const BOOK_ID = "minecraft:book";
const BOOK_NAME = "§6[MURMUR] §rLanguage Settings";
const BOOK_LORE = ["§7Right-click to select language"];
const FIRST_SPAWN_TAG = "murmur:lang_book_given";
const CRAFT_TAG = "murmur:lang_book_craft";

// --- LANGUAGE REGISTRY ---
// To add more languages in the future, just push to this array.
const LANGUAGES = [
    { code: "en_US", label: "§f🇬🇧 English (Default)", confirm: "§e[MURMUR] Language set to English." },
    { code: "es_ES", label: "§f🇪🇸 Español", confirm: "§e[MURMUR] Idioma configurado a Español." },
    { code: "pt_BR", label: "§f🇧🇷 Português (Brasil)", confirm: "§e[MURMUR] Idioma definido para Português." }
];

// --- BOOK FACTORY ---
function makeBook() {
    const book = new ItemStack(BOOK_ID, 1);
    book.nameTag = BOOK_NAME;
    book.setLore(BOOK_LORE);
    return book;
}

// --- GIVE ON FIRST SPAWN ---
world.afterEvents.playerSpawn.subscribe((event) => {
    const { player, initialSpawn } = event;
    if (!initialSpawn) return;
    if (player.hasTag(FIRST_SPAWN_TAG)) return;

    system.runTimeout(() => {
        try {
            const inv = player.getComponent("minecraft:inventory");
            if (!inv?.container) return;
            inv.container.addItem(makeBook());
            player.addTag(FIRST_SPAWN_TAG);
            player.sendMessage("§6[MURMUR] §rSelect your language below:");

            // Force the language menu open immediately
            showLanguageMenu(player);
        } catch (e) {
            console.warn("[MURMUR LANGBOOK] Give on spawn failed: " + e);
        }
    }, 40); // slightly longer delay so UI is ready
});


// --- OPEN MENU ON RIGHT-CLICK ---
world.afterEvents.itemUse.subscribe((event) => {
    const { source: player, itemStack } = event;
    if (!player || !itemStack) return;
    if (itemStack.typeId !== BOOK_ID) return;
    if (itemStack.nameTag !== BOOK_NAME) return;

    showLanguageMenu(player);
});

function showLanguageMenu(player) {
    const currentLang = getLanguage();

    const form = new ActionFormData()
        .title("§6MURMUR §r— Language Settings")
        .body(`§7Current language: §f${LANGUAGES.find(l => l.code === currentLang)?.label ?? currentLang}\n\n§7Select a language to apply:`);

    for (const lang of LANGUAGES) {
        const active = lang.code === currentLang ? " §a✔" : "";
        form.button(lang.label + active);
    }

    form.show(player).then((result) => {
        if (result.canceled || result.selection === undefined) return;

        const chosen = LANGUAGES[result.selection];
        if (!chosen) return;

        setLanguage(chosen.code);
        player.sendMessage(chosen.confirm);
    }).catch((e) => {
        console.warn("[MURMUR LANGBOOK] Form error: " + e);
    });
}

// --- DIRT CRAFTING RECIPE (Shapeless via interact) ---
// Real shapeless recipes require a data pack / BP items json which this
// script-only pack can't provide. Instead we detect the 2x2 crafting grid
// via a scriptevent: /scriptevent murmur:craft_book
// AND we also watch for the player using dirt in hand near a crafting table 
// to award the book automatically (accessible, but not intrusive).
//
// Simpler approach: register a vanilla-style recipe listener using world.beforeEvents.
// Bedrock scripting (1.11) does NOT expose crafting events, so we rely on
// the /give command shortcut + a dirt-in-hand right-click on crafting table.

world.afterEvents.playerInteractWithBlock.subscribe((event) => {
    const { player, block, itemStack } = event;
    if (!block || !itemStack) return;
    if (block.typeId !== "minecraft:crafting_table") return;
    if (itemStack.typeId !== "minecraft:dirt") return;

    // Check player doesn't already have the book
    const inv = player.getComponent("minecraft:inventory");
    if (!inv?.container) return;

    for (let i = 0; i < inv.container.size; i++) {
        const slot = inv.container.getItem(i);
        if (slot?.typeId === BOOK_ID && slot?.nameTag === BOOK_NAME) {
            player.sendMessage("§7[MURMUR] You already have a Language Book.");
            return;
        }
    }

    // Consume one dirt, give one book
    const equip = player.getComponent("minecraft:equippable");
    const mainHand = equip?.getEquipment(EquipmentSlot.Mainhand);
    if (!mainHand) return;

    if (mainHand.amount > 1) {
        mainHand.amount -= 1;
        equip.setEquipment(EquipmentSlot.Mainhand, mainHand);
    } else {
        equip.setEquipment(EquipmentSlot.Mainhand, undefined);
    }

    inv.container.addItem(makeBook());
    player.sendMessage("§6[MURMUR] §rCrafted §6Language Book§r! §7(Right-click to open)");
});

// --- /GIVE SHORTCUT via scriptevent ---
// /scriptevent murmur:give_book (for ops/creative/cheats)
system.afterEvents.scriptEventReceive.subscribe((event) => {
    if (event.id !== "murmur:give_book") return;
    const player = event.sourceEntity;
    if (!player) return;

    const inv = player.getComponent("minecraft:inventory");
    if (!inv?.container) return;
    inv.container.addItem(makeBook());
    player.sendMessage("§6[MURMUR] §rLanguage Book given.");
});

console.log("[MURMUR LANGBOOK] Language book system loaded.");
