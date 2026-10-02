import { world } from "@minecraft/server";

// --- Cross-addon event emitter ---
// Third-party scripting packs can subscribe to MURMUR's dialogue lifecycle:
//   import { MurmurEvents } from "./events.js";  (or via globalThis.MurmurEvents)
//   MurmurEvents.onDialogueSpoken(({ entity, text, players }) => { ... });
const _listeners = {};

function on(name, cb) {
    if (typeof cb !== "function") return () => { };
    (_listeners[name] = _listeners[name] || []).push(cb);
    return () => {
        const arr = _listeners[name];
        if (arr) {
            const i = arr.indexOf(cb);
            if (i >= 0) arr.splice(i, 1);
        }
    };
}

function emit(name, ...args) {
    const arr = _listeners[name];
    if (!arr) return;
    for (const cb of arr.slice()) {
        try { cb(...args); } catch (e) { console.warn("[MURMUR EVENTS] listener error: " + e); }
    }
}

export const MurmurEvents = {
    on,
    emit,
    onDialogueSpoken: (cb) => on("dialogueSpoken", cb),
    onTreeChoiceSelected: (cb) => on("treeChoiceSelected", cb),
    onReputationChanged: (cb) => on("reputationChanged", cb)
};

globalThis.MurmurEvents = MurmurEvents;

// --- Declarative content-pack schema validator ---
// Surfaces common authoring mistakes (dangling tree gotos, bad require blocks,
// etc.) without crashing registration. Run via /scriptevent murmur:validate.
export function validateSchema() {
    const D = globalThis.MURMUR_DATA || {};
    const issues = [];

    // Dialogue shape
    for (const [typeId, pool] of Object.entries(D.DIALOGUE || {})) {
        if (!pool || typeof pool !== "object" || Array.isArray(pool)) {
            issues.push(`DIALOGUE[${typeId}] is not an object of conditions`);
            continue;
        }
        for (const [cond, lines] of Object.entries(pool)) {
            if (Array.isArray(lines)) {
                if (!lines.every(l => typeof l === "string")) issues.push(`DIALOGUE[${typeId}].${cond} has a non-string line`);
            } else if (lines && typeof lines === "object") {
                for (const [sub, subLines] of Object.entries(lines)) {
                    if (Array.isArray(subLines) && !subLines.every(l => typeof l === "string")) {
                        issues.push(`DIALOGUE[${typeId}].${cond}.${sub} has a non-string line`);
                    }
                }
            } else {
                issues.push(`DIALOGUE[${typeId}].${cond} is not an array or object`);
            }
        }
    }

    // Tree shape + dangling gotos + require sanity
    for (const [key, tree] of Object.entries(D.TREES || {})) {
        if (!tree || !tree.nodes) { issues.push(`TREE[${key}] is missing its "nodes" map`); continue; }
        const starts = [tree.start].filter(Boolean);
        for (const s of starts) {
            if (s !== "__end__" && !tree.nodes[s]) issues.push(`TREE[${key}] start "${s}" does not exist`);
        }
        for (const [nid, node] of Object.entries(tree.nodes)) {
            if (!node || typeof node !== "object") { issues.push(`TREE[${key}].${nid} is invalid`); continue; }
            for (const ch of (node.choices || [])) {
                if (!ch || typeof ch !== "object") { issues.push(`TREE[${key}].${nid} has a malformed choice`); continue; }
                if (ch.goto && ch.goto !== "__end__" && !tree.nodes[ch.goto]) {
                    issues.push(`TREE[${key}].${nid} choice -> missing node "${ch.goto}"`);
                }
                if (ch.requires) {
                    const r = ch.requires;
                    if (r.minRep !== undefined && typeof r.minRep !== "number") issues.push(`TREE[${key}].${nid} requires.minRep is not a number`);
                    if (r.item && typeof r.item !== "string") issues.push(`TREE[${key}].${nid} requires.item is not a string`);
                    if (r.tag && typeof r.tag !== "string") issues.push(`TREE[${key}].${nid} requires.tag is not a string`);
                    if (r.quest && typeof r.quest !== "string") issues.push(`TREE[${key}].${nid} requires.quest is not a string`);
                    if (r.notQuest && typeof r.notQuest !== "string") issues.push(`TREE[${key}].${nid} requires.notQuest is not a string`);
                    if (r.effect && typeof r.effect !== "string") issues.push(`TREE[${key}].${nid} requires.effect is not a string`);
                    if (r.notEffect && typeof r.notEffect !== "string") issues.push(`TREE[${key}].${nid} requires.notEffect is not a string`);
                }
                if (ch.startQuest && typeof ch.startQuest === "object") {
                    const sq = ch.startQuest;
                    if (!sq.questId || typeof sq.questId !== "string") issues.push(`TREE[${key}].${nid} startQuest is missing a string questId`);
                    if (sq.deadlineDays !== undefined && typeof sq.deadlineDays !== "number") issues.push(`TREE[${key}].${nid} startQuest.deadlineDays is not a number`);
                }
                if (ch.addEffect) {
                    const effs = Array.isArray(ch.addEffect) ? ch.addEffect : [ch.addEffect];
                    for (const ef of effs) {
                        if (!ef || typeof ef !== "object" || typeof ef.id !== "string") issues.push(`TREE[${key}].${nid} addEffect needs { id }`);
                    }
                }
            }
        }
    }

    return issues;
}
