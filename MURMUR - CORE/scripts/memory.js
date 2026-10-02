import { world, system } from "@minecraft/server";
import { getLanguage } from "./localization.js";
import { MurmurEvents } from "./events.js";

// Persistent memory store for MURMUR CORE: player<->mob reputation,
// event memories (grudges), and cross-villager opinions.
//
// NOTE: Bedrock caps a single dynamic-property string value at 32,767 bytes.
// Serializing ALL player memory into one monolithic key (the old
// "murmur:memory:v1") will eventually exceed that cap on long-running worlds
// and silently stop persisting. We now shard per-player and keep villager
// opinions in their own key. A one-time migration pulls any legacy blob apart.

const PLAYER_PREFIX = "murmur:mem:p:";
const VILLAGER_KEY = "murmur:mem:v";
const LEGACY_KEY = "murmur:memory:v1";

export const FRIENDLY_SENTIENT = [
    "villager_v2", "villager", "iron_golem", "snow_golem", "piglin", "wandering_trader"
];

export function isFriendlySentient(typeId) {
    return FRIENDLY_SENTIENT.some(t => typeId.includes(t));
}

// --- persistence ---
let _cache = null;
function loadMemory() {
    if (_cache) return _cache;
    let data = { players: {}, villagers: {} };
    try {
        // One-time migration of the legacy monolithic blob.
        const legacy = world.getDynamicProperty(LEGACY_KEY);
        if (legacy) {
            try {
                const parsed = JSON.parse(legacy);
                if (parsed && typeof parsed === "object") {
                    if (parsed.players) for (const [pn, mobs] of Object.entries(parsed.players)) data.players[pn] = mobs;
                    if (parsed.villagers) data.villagers = parsed.villagers;
                }
            } catch (e) { }
            try { world.setDynamicProperty(LEGACY_KEY, undefined); } catch (e) { }
        }

        const ids = (typeof world.getDynamicPropertyIds === "function") ? world.getDynamicPropertyIds() : [];
        for (const id of ids) {
            if (id.startsWith(PLAYER_PREFIX)) {
                const name = id.slice(PLAYER_PREFIX.length);
                try {
                    const v = world.getDynamicProperty(id);
                    if (v) {
                        const obj = JSON.parse(v);
                        if (obj && obj.mobs) data.players[name] = { ...(data.players[name] || {}), ...obj.mobs };
                    }
                } catch (e) { }
            } else if (id === VILLAGER_KEY) {
                try {
                    const v = world.getDynamicProperty(id);
                    if (v) { const obj = JSON.parse(v); if (obj && typeof obj === "object") data.villagers = obj; }
                } catch (e) { }
            }
        }
    } catch (e) { }
    if (!data.players) data.players = {};
    if (!data.villagers) data.villagers = {};
    _cache = data;
    return data;
}
function saveMemory() {
    try {
        const m = _cache;
        if (m.players) {
            for (const [name, mobs] of Object.entries(m.players)) {
                try {
                    world.setDynamicProperty(PLAYER_PREFIX + name, JSON.stringify({ mobs }));
                } catch (e) {
                    console.warn("[MURMUR MEM] per-player save failed: " + name);
                }
            }
        }
        try {
            world.setDynamicProperty(VILLAGER_KEY, JSON.stringify(m.villagers || {}));
        } catch (e) { }
    } catch (e) { }
}

function mobKey(typeId, name) {
    return `${typeId}::${name || "unknown"}`;
}

// --- player <-> mob reputation ---
export function getReputation(playerName, typeId, name) {
    const m = loadMemory();
    return m.players?.[playerName]?.[mobKey(typeId, name)]?.score || 0;
}

export function adjustReputation(playerName, typeId, name, delta, reason) {
    const m = loadMemory();
    if (!m.players[playerName]) m.players[playerName] = {};
    const key = mobKey(typeId, name);
    if (!m.players[playerName][key]) m.players[playerName][key] = { score: 0, events: [] };
    const rec = m.players[playerName][key];
    rec.score = Math.max(-100, Math.min(100, rec.score + delta));
    if (reason) {
        rec.events = rec.events || [];
        rec.events.push(reason);
        if (rec.events.length > 6) rec.events = rec.events.slice(-6);
    }
    saveMemory();
    try { MurmurEvents.emit("reputationChanged", { playerName, typeId, name, score: rec.score, delta }); } catch (e) { }
    return rec.score;
}

export function getRelationship(playerName, typeId, name) {
    const m = loadMemory();
    return m.players?.[playerName]?.[mobKey(typeId, name)] || { score: 0, events: [] };
}

// --- status labels (localized) ---
const STATUS_LABELS = {
    en_US: { revered: "Revered", liked: "Liked", neutral: "Neutral", disliked: "Disliked", hated: "Hated" },
    es_ES: { revered: "Venerado", liked: "Querido", neutral: "Neutral", disliked: "Antipático", hated: "Odiado" },
    pt_BR: { revered: "Venerado", liked: "Querido", neutral: "Neutro", disliked: "Malquisto", hated: "Odiado" }
};

export function getStatus(score, lang) {
    const l = STATUS_LABELS[lang] || STATUS_LABELS["en_US"];
    if (score >= 30) return l.revered;
    if (score >= 10) return l.liked;
    if (score <= -30) return l.hated;
    if (score <= -10) return l.disliked;
    return l.neutral;
}

// --- grudge / memory phrases (localized) ---
const MEMORY_PHRASES = {
    en_US: {
        kill: (t) => `Hates you for killing ${t}.`,
        hurt: (t) => `Still angry you hurt ${t}.`,
        heal: (t) => `Remembers you helped ${t}.`,
        gift: (t) => `Never forgot you gave ${t} to them.`
    },
    es_ES: {
        kill: (t) => `Te odia por matar a ${t}.`,
        hurt: (t) => `Sigue enfadado por hacerle daño a ${t}.`,
        heal: (t) => `Recuerda que ayudaste a ${t}.`,
        gift: (t) => `Nunca olvidó que le diste ${t}.`
    },
    pt_BR: {
        kill: (t) => `Te odeia por matar ${t}.`,
        hurt: (t) => `Ainda bravo por machucar ${t}.`,
        heal: (t) => `Lembra que você ajudou ${t}.`,
        gift: (t) => `Nunca esqueceu que você deu ${t} a ele.`
    }
};

export function getGrudgeLine(playerName, typeId, name, lang) {
    const rel = getRelationship(playerName, typeId, name);
    const events = rel?.events || [];
    if (events.length === 0) return null;
    const ev = events[events.length - 1];
    const ph = (MEMORY_PHRASES[lang] || MEMORY_PHRASES["en_US"])[ev.kind];
    if (!ph) return null;
    return ph(ev.target || "someone");
}

export function describeRelationship(playerName, typeId, name, lang) {
    const score = getReputation(playerName, typeId, name);
    const label = getStatus(score, lang);
    const grudge = getGrudgeLine(playerName, typeId, name, lang);
    return { score, label, grudge };
}

// --- cross-villager opinions ---
export function bumpVillagerOpinion(a, b, delta) {
    const m = loadMemory();
    if (!m.villagers[a]) m.villagers[a] = {};
    m.villagers[a][b] = Math.max(-100, Math.min(100, (m.villagers[a][b] || 0) + delta));
    saveMemory();
}

export function getVillagerOpinion(a, b) {
    const m = loadMemory();
    return m.villagers?.[a]?.[b] || 0;
}

export function getVillagerFriends(name) {
    const m = loadMemory();
    const ops = m.villagers?.[name] || {};
    return Object.keys(ops).filter(k => ops[k] >= 10);
}

export function getVillagerEnemies(name) {
    const m = loadMemory();
    const ops = m.villagers?.[name] || {};
    return Object.keys(ops).filter(k => ops[k] <= -10);
}

// --- Reputation decay toward zero (prevents permanent soft-locks) ---
// Runs roughly once per minute; nudges every non-zero score one point toward 0.
system.runInterval(() => {
    try {
        const m = loadMemory();
        let changed = false;
        for (const mobs of Object.values(m.players || {})) {
            for (const rec of Object.values(mobs || {})) {
                if (rec && typeof rec.score === "number" && rec.score !== 0) {
                    rec.score += (rec.score > 0) ? -1 : 1;
                    if (Math.abs(rec.score) < 1) rec.score = 0;
                    changed = true;
                }
            }
        }
        if (changed) saveMemory();
    } catch (e) { }
}, 1200);

