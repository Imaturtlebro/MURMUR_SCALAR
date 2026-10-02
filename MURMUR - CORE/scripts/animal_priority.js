import { world, system } from "@minecraft/server";

// ============================================================================
//  MURMUR CORE — ANIMAL PRIORITY
//
//  Priority rule: when MURMUR ANIMAL CORE is installed, farm animals ALWAYS
//  belong to it. This engine yields them completely (chatter, naming, hurt /
//  witness lines, dialogue trees, interaction hub) so a pig never gets two
//  brains, two voices, or a flickering nameTag.
//
//  Why world state instead of `globalThis`: each behavior pack runs in its own
//  script isolate, so globals are NOT shared. Presence travels through:
//    1. `murmur_animal:beacon` scriptevent  (instant, in-memory cache here), and
//    2. `murmur_animal:core_present` / `murmur_animal:claims` world DPs
//       (survives reloads and late loads; staleness-checked).
//
//  When ANIMAL CORE is absent, everything below reports "no yield" and this
//  engine serves those types itself (e.g. Uncanny's pig lament keeps working
//  for CORE-only worlds).
// ============================================================================

export const ANIMAL_BEACON_EVENT = "murmur_animal:beacon";
const ANIMAL_PRESENCE_KEY = "murmur_animal:core_present";
const ANIMAL_CLAIMS_KEY = "murmur_animal:claims";

// Ticks after the last beacon before we consider ANIMAL CORE gone.
// The animal pack re-beacons every 200 ticks, so 1200 is ~6 missed beacons.
const BEACON_FRESH_TICKS = 1200;

// Must mirror `ANIMAL_CLAIM_TYPES` in `MURMUR - ANIMAL CORE/scripts/api.js`.
// Exact typeIds only — notably NOT piglins/hoglins/zoglins, which stay here.
export const FARM_ANIMAL_TYPES = [
    "minecraft:chicken",
    "minecraft:cow",
    "minecraft:sheep",
    "minecraft:pig",
    "minecraft:rabbit",
    "minecraft:llama",
    "minecraft:trader_llama",
    "minecraft:horse",
    "minecraft:donkey",
    "minecraft:mule",
    "minecraft:mooshroom"
];

export function isFarmAnimal(typeId) {
    return FARM_ANIMAL_TYPES.includes(String(typeId || ""));
}

// --- Beacon cache (fast path) ----------------------------------------------
let lastBeaconTick = -999999;
let beaconClaims = null; // string[] | null

try {
    system.afterEvents.scriptEventReceive.subscribe((event) => {
        if (!event || event.id !== ANIMAL_BEACON_EVENT) return;
        lastBeaconTick = system.currentTick;
        try {
            const parsed = JSON.parse(event.message || "[]");
            if (Array.isArray(parsed) && parsed.length > 0) beaconClaims = parsed.map(String);
        } catch (e) { beaconClaims = null; }
    });
} catch (e) { /* scriptEventReceive unavailable — DP fallback below still works */ }

function beaconFresh() {
    try {
        return (system.currentTick - lastBeaconTick) < BEACON_FRESH_TICKS;
    } catch (e) { return false; }
}

function dpPresenceFresh() {
    try {
        const v = world.getDynamicProperty(ANIMAL_PRESENCE_KEY);
        if (typeof v !== "number") return false;
        return (system.currentTick - v) < BEACON_FRESH_TICKS;
    } catch (e) { return false; }
}

/** True while ANIMAL CORE is installed and recently heard from. */
export function isAnimalCoreActive() {
    return beaconFresh() || dpPresenceFresh();
}

/** Claimed animal typeIds (beacon cache first, DP second, static list last). */
export function getAnimalClaims() {
    if (Array.isArray(beaconClaims) && beaconClaims.length > 0) return beaconClaims;
    try {
        const raw = world.getDynamicProperty(ANIMAL_CLAIMS_KEY);
        if (typeof raw === "string" && raw.length > 0) {
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed) && parsed.length > 0) return parsed.map(String);
        }
    } catch (e) { /* fall through to static list */ }
    return FARM_ANIMAL_TYPES;
}

/**
 * True when THIS engine must stand down for `typeId`: it is a farm animal AND
 * ANIMAL CORE is currently active. All chatter / naming / tree / witness /
 * hurt paths consult this single predicate.
 */
export function shouldCoreYield(typeId) {
    if (!isFarmAnimal(typeId)) return false;
    if (!isAnimalCoreActive()) return false;
    try {
        return getAnimalClaims().includes(String(typeId));
    } catch (e) {
        return true; // active beacon, unreadable claims — yield rather than double-voice
    }
}
