# MURMUR — Patch Notes

All changes to MURMUR Core and MURMUR Uncanny across shipped updates.

---

## MURMUR — CORE

### v1.0.42 — Timed quests, effect-gated branches, discount effects

**Context:** Uncanny's dialogue trees needed fetch quests with teeth: deadlines that
actually expire, trade discounts that visibly end, and branches that react to both.
Three engine gaps blocked that (no quest deadlines, no effect-gated `requires`, no
effect-granting consequences), plus the tree engine silently ignored node-level
consequence keys — which had left several Uncanny "rewards" as pure theater.

| Change | File | Details |
|---|---|---|
| **Quest deadlines + expiry** | `scripts/quests.js` | `startQuest` accepts `deadlineDays` (+ optional `failRep`, default -15), stored as `deadlineDay` (in-game day). `checkQuestExpiry(player)` fails overdue quests: archives to a `failed` list, applies the rep hit to the giver, sets player tag `murmur:failed:<questId>` (tree shame-branch routing), re-accepting clears the failure. Runs on dialogue open + journal + quest reads — event-driven, never a tick loop. Journal shows countdowns (`3d left` / `due today!`) and a Failed section. |
| **Effect-gated branches** | `scripts/dialogue_tree.js` (`choiceVisible`) | New `requires`: `quest` / `notQuest` (active-quest gating), `effect` / `notEffect` (status-effect gating, e.g. `hero_of_the_village` alive vs expired). |
| **Effect consequences** | `scripts/dialogue_tree.js` (`applyChoiceEffects`) | New `addEffect: { id, duration (ticks), amplifier?, showParticles? }` (single or array) — e.g. the trade-discount `hero_of_the_village` grant on fetch turn-ins. `startQuest` passthrough extended with `deadlineDays` / `failRep`. |
| **Validator coverage** | `scripts/events.js` | `murmur:validate` now checks the new keys (`requires.quest/notQuest/effect/notEffect`, `startQuest.questId/deadlineDays`, `addEffect.id`). |
| **Version bump** | `manifest.json` | 1.0.41 → **1.0.42**. |

### v1.0.40 — Interaction fixes + faction-aware chatter + witness logic fixes

**Context:** After registration was stabilized (v1.0.39), playtesting revealed interaction and faction logic bugs: dialogue tree opened on *any* right-click (blocking vanilla villager trade), mobile had no sneak equivalent, pillagers incorrectly mourned villagers (faction substring match bug), and `{name}` placeholder leaked cross-faction names (villagers referencing pillager names).

| Change | File | Details |
|---|---|---|
| **Sneak+RMB for dialogue tree** | `scripts/dialogue_tree.js:416` | Stand+RMB on villagers → vanilla trade; Sneak+RMB → MURMUR dialogue tree. Non-trade entities (pillagers, golems) still open tree on any interact. Mobile sneak button works equivalently. |
| **Exact-match faction groups** | `scripts/utils.js` (new `factionGroupFor`) | Fixed substring match bug (`"minecraft:zombie_villager".includes("minecraft:villager")` → true). Now exact-match only. |
| **Faction-scoped `{name}` placeholder** | `scripts/utils.js:330` | `{name}` now only resolves to nearby entities in the **same faction group** as the speaker, preventing cross-faction leaks (e.g. villager "Rulf" no longer referenced by pillagers). |
| **Shared faction logic** | `scripts/main.js`, `scripts/utils.js` | Moved `FACTION_GROUPS` + `factionGroupFor` to utils.js so both chatter and witness engines use identical logic. |
| **Version bump** | `CORE/manifest.json` | 1.0.39 → **1.0.40**. |

---

### v1.0.39 — Fix registration burst-drop + guaranteed scriptevent delivery

**Context:** v1.0.38 added ACK-based resend, but playtesting still showed the **same four profiles repeatedly stalling** — villager_v2, pillager, pillager_captain, iron_golem — with counts identical on every pass (32/33, 8/10, 8/10, 5/6). A harness replaying the real data confirmed these are **exactly the four largest profiles** (33, 10, 10, 6 chunks) while all 3–5 chunk profiles register. Root cause: **burst-drop** — `PER_TICK=12` issued up to 12 `scriptevent` commands in a single tick, and Bedrock drops the tail of a burst, so large multi-chunk profiles lost 1–2 chunks in delivery. Separately, no `scriptevents` were declared in the manifests, and Uncanny relied entirely on CORE's resend request arriving.

| Change | File | Details |
|---|---|---|
| **Slower, non-bursting sender** | `MURMUR - UNCANNY/scripts/register.js` | `PER_TICK` 12 → **3**, so a tick never dumps more than a few commands; large profiles no longer lose the tail of a burst. |
| **Declared `events`** | `CORE/manifest.json`, `UNCANNY/manifest.json` | Added `murmur:data`, `murmur:tree`, `murmur:diag`, `murmur:resend` so both packs are guaranteed to send/receive every bridge event. Removed the self-heal timer that was re-queuing profiles before they could converge; the ACK-based resend loop in CORE now handles recovery reliably. |
| **Missing-index diagnostic** | `scripts/api.js` | CHUNK TIMEOUT warning now prints exactly which chunk index(es) are missing, making any future stall instantly debuggable. |
| **Version bump** | `CORE/manifest.json` | 1.0.38 → **1.0.39**. |

---

### v1.0.38 — Reliable registration (ACK-based resend) + chatter throttle

**Context:** v1.0.37 fixed the multi-chunk *decode* bug, so big profiles started getting most of their chunks (villager 32/33 vs 0 before). But one chunk per profile was still occasionally **dropped in delivery**, leaving villager / pillager / pillager_captain / iron_golem half-registered → still "villagerv2 instead of names", "not talking", "some NPCs don't talk". Separately, the ambient chat system let many nearby mobs speak at the same instant (the "hive mind" feel).

| Change | File | Details |
|---|---|---|
| **ACK-based resend loop** | `scripts/api.js` | On a chunk-assembly timeout the sweep now **asks the sender pack to re-send that exact profile** via `murmur:resend` (throttled, up to 8 tries) instead of silently deleting the buffer. Registration is idempotent, so the pack re-queues it and CORE keeps assembling until it completes. Guarantees convergence for villager/pillager/golem. |
| **Manual resend works** | `scripts/api.js` | `/scriptevent murmur:resend` previously did **nothing** (no handler existed — that's why it "didn't help"). It now re-requests every stalled profile. |
| **Bogus-chunk guard** | `scripts/api.js` | Receive handler drops out-of-range chunk indices (a bad index silently bloated the buffer and made the completeness check never pass — a guaranteed lockup). |
| **Pack resend listener** | `MURMUR - UNCANNY/scripts/register.js` | Uncanny now listens for `murmur:resend` and re-runs its throttled sender on request. |
| **Ambient-chat throttle** | `scripts/main.js` | Global gap so multiple nearby mobs don't talk in the same instant (kills the "hive mind" feel). Event-driven reactions (hurt/death/peer) are unaffected. |
| **Version bump** | `manifest.json` | 1.0.37 → **1.0.38**. |

---

### v1.0.37 — Fix: silent big NPCs (villager / witch / wandering trader)

**Root cause:** MURMUR's data bridge sends large profiles (villager_v2, witch, wandering_trader — the ones with lots of dialogue) as **multiple base64 chunks**. Each chunk was base64-encoded *independently* with its own 3-byte padding, but CORE **concatenated the base64 strings and decoded them as one stream**. That breaks byte-alignment at every chunk boundary, so any profile bigger than one chunk decoded to garbage and **never registered**. Result: those NPCs had no custom name, never spoke, and had no dialogue tree. Small single-chunk profiles (skeleton, pillagers, piglins…) worked fine, which is why the bug was easy to miss.

| Change | File | Details |
|---|---|---|
| **Chunk reassembly fix** | `scripts/utils.js` | New `reassembleChunks(pieces)` decodes each independently-padded base64 chunk back to its raw string, concatenates the strings, then parses once. Falls back to raw JSON for legacy single-chunk sends. |
| **Dialogue reassembly** | `scripts/api.js` | `murmur:data` reassembly now uses `reassembleChunks` → all 14 profiles (incl. villager/witch/wandering_trader) register. |
| **Tree reassembly** | `scripts/dialogue_tree.js` | `murmur:tree` reassembly now uses `reassembleChunks` → all 15 dialogue trees register. |
| **Name-map lookup fix** | `MURMUR - UNCANNY/scripts/register.js` | Uncanny's `DIALOGUE` keys carried an accidental trailing space (`"minecraft:villager_v2 "`). That made `NAME_MAP[typeId]` miss, so villagers got generic monster names and the spurious space leaked into the chunk header. TypeIds are now `.trim()`ed at send → villagers get proper `VILLAGER_NAMES`. |
| **Throttled / retried sender** | `MURMUR - UNCANNY/scripts/register.js` | Chunked `scriptevent` commands were dumped all in one tick; Bedrock can drop commands issued in a burst, leaving a profile half-registered. Now sent a few per tick (`PER_TICK`), plus timed re-send passes as a safety net. |
| **Version bump** | `manifest.json` | 1.0.36 → **1.0.37**. |

**Verified offline:** ran the real Uncanny data through the real chunk build → CORE reassembly → register path in Node. Before fix: 11/14 profiles + 12/15 trees, villager/witch/trader failed. After fix: **14/14 profiles + 15/15 trees**, villager registered under a clean key with proper villager names.

---

### v1.0.36 — Hotfix: crash on world load (Core + Uncanny combo)

| Change | File | Details |
|---|---|---|
| **Fix load crash** | `scripts/dialogue_tree.js` | `system.afterEvents.playerInteractWithEntity.subscribe` crashed ("cannot read property 'subscribe' of undefined") because the interact event lives on **`world.afterEvents`**, not `system`. The typo aborted the whole script graph, which broke talk-to, dialogue trees, the Tome, and villager custom names. Now wired to `world.afterEvents` with a feature-detect fallback (degrades gracefully if Experimental/Beta APIs are off). |
| **Proactive naming** | `scripts/main.js` | New `entitySpawn` subscription names freshly spawned registered talkables immediately, so villagers carry custom names even before their first line of chatter (previously names only appeared after first talk). |
| **Version bump** | `manifest.json` | 1.0.35 → **1.0.36**. |

---

### v1.0.35 — Wave 2: Commerce, Stewardship & Recovery

| Change | File | Details |
|---|---|---|
| **Commerce engine** | `scripts/commerce.js` (new) | Atomic item-for-item trade system. Right-click a stocked merchant → stock screen → confirm purchase. Pre-checks affordability + carry-room (stackable vs. per-slot), deducts price, grants goods, rolls back on failure. Catalog namespaced per merchant in world DP. Operator commands: `/scriptevent murmur:shop stock` and `shop clear`. |
| **Interaction selector** | `scripts/dialogue_tree.js` | Right-click now shows a **Speak / Trade / My tasks** chooser when a creature backs multiple systems. One system → straight in. None → vanilla behavior untouched. |
| **Quest engine upgrade** | `scripts/quests.js` | New `goto` quest type with auto distance-tracking (player reaches a waypoint → quest completes). New `mode` and `repeatable` flags on quests. Turn-in inventory buffer: refuses to close a task if the reward won't fit, so nothing is lost. |
| **Stewardship** | `scripts/worldadmin.js` (new) | World-governance layer. First player to `/scriptevent murmur:steward` claims the world and gets steward rights. Steward can `op`/`deop` operators, set world mode (`survival`/`creative`/`adventure`). `isPermitted()` gates all admin-only commands. |
| **Vault (crash recovery)** | `scripts/vault.js` (new) | Checksummed mirror of all sharded persisted state (quests, reputation, merchant stock). Periodic auto-snapshots. `/scriptevent murmur:vault audit` restores tampered shards. `/scriptevent murmur:vault backup` forces a snapshot. |
| **Wiring & status** | `scripts/index.js` | New modules imported. `/scriptevent murmur:status` now lists Commerce, Steward, and Vault systems. |
| **Version bump** | `manifest.json` | 1.0.34 → **1.0.35**. |

---

### v1.0.34 — Wave 1: Quests, Reputation, Talk & Witness Fix

| Change | File | Details |
|---|---|---|
| **Quest engine** | `scripts/quests.js` (new) | Persistent per-player RPG quests in sharded dynamic properties (`murmur:quests:<name>`). Supports `collect` and `kill` objectives with automatic progress (entityDie for kills; throttled inventory poll for collect). Turn-in pays reward items + reputation, consumes collected items. Active-quest cap of 3. Quest journal via `/scriptevent murmur:quest journal`. |
| **Reputation HUD** | `scripts/rep_hud.js` (new) | Every ~10 ticks, reads the player's view-direction for a friendly sentient and prints `<Name> — Status (+N)` plus any remembered grudge in the action bar. Toggle: `/scriptevent murmur:rep on/off`. |
| **Interact-to-talk** | `scripts/dialogue_tree.js` | `playerInteractWithEntity` handler opens a creature's dialogue tree on empty-hand right-click when that type has a registered tree. Villager trading and hostile-combat right-clicks left untouched. |
| **Tree RPG consequences** | `scripts/dialogue_tree.js` | `applyChoiceEffects` now handles `giveItem`, `startQuest`, `turnIn`, `questProgress`, and `sendMessage` natively, on top of existing `setTags`/`clearTags`/`setProperties`/`takeItem`/`repDelta` and legacy `action`. |
| **Dialogue Tome** | `scripts/dialogue_tree.js` | Right-click while holding a named book → open the dialogue tree of whatever you're looking at. Given on first spawn. Operator shortcut: `/scriptevent murmur:talk`. |
| **Language Book** | `scripts/langbook.js` | Right-click to pick language (English / Español / Português). Given on first spawn. Craft with 1 dirt + a crafting table. `/scriptevent murmur:give_book`. |
| **Witness faction fix** | `scripts/main.js` | Death-witness engine now resolves the deceased to a faction group (e.g. `[pillager, pillager_captain, vindicator, evoker, ravager]`) and lets only that group mourn. A witch/pillager will no longer mourn a slain villager. Falls back to registered pack `FACTIONS` first, structural groups second. |
| **Status report** | `scripts/index.js` | `/scriptevent murmur:status` lists engine status: registered types, trees, factions, languages, and all systems. |
| **Version bump** | `manifest.json` | 1.0.33 → **1.0.34**. |

---

## MURMUR — UNCANNY

### v1.1.54 — Profession fetch board: 33 quests across all 12 villager crafts

**Context:** One villager entity covers all professions (Bedrock exposes no profession
to scripts), so the 12 crafts live as a board inside the single villager tree. All
quests reuse the v1.0.42/v1.1.53 machinery: choice-level `startQuest` with 3–4 day
deadlines, inventory-checked turn-ins, hero-glow discounts, fail-tag shame routing.

| Change | File | Details |
|---|---|---|
| **Professions hub** | `scripts/dialogue.js` (villager tree) | New `professions` node (12 craft links) off `greet`, plus shared `prof_take` / `prof_remind` / `prof_shame` nodes. One apologize choice clears all 33 fail tags (+2 rep); dismiss is −5. |
| **33 fetch quests** | `scripts/dialogue.js` | Farmer ×3, Fletcher ×3, Librarian ×3, Cleric ×3, Cartographer ×3, Smith ×3, Shepherd ×3, Fisherman ×3, Butcher ×2, Leatherworker ×2, Mason ×2, Nitwit ×3 — IDs `uncanny_<profession>_<item>`, 1–3 emeralds + 6–10 rep, −10 on expiry. Every turn-in grants the hero discount. OR-requests resolved to one item (carrot, cod, beef, cobblestone, granite). Request + turn-in lines verbatim in the eerie half-aware voice. |
| **Villager tree size** | `scripts/dialogue.js` | 54 KB JSON → ~73 chunks for this tree (~129 tree chunks total, ~45 s first registration; the ACK resend loop converges — slower load, no action needed). |
| **Version bump** | `manifest.json` | 1.1.53 → **1.1.54**. No CORE changes this pass. |

### v1.1.53 — Fetch-quest trees: deadlines, discounts, shame branches, working rewards

**Context:** Audit found 11 node-level consequence keys across the trees
(`startQuest`/`turnIn`/`action`/`setTags` on nodes) that the engine silently ignores —
the potato quest could never actually start or pay out, and the "take a potato /
arrow / potion / gold / bone" gifts never gave anything. All fixed by moving
consequences to choice level, then building real quest arcs on top.

| Change | File | Details |
|---|---|---|
| **Villager rebuild (11 → 24 nodes)** | `scripts/dialogue.js` | Two timed fetch quests: wheat ×10 (`uncanny_wheat`, 3d, +2 emeralds +10 rep) and potatoes ×6 (`uncanny_potatoes` kept for in-flight compat, now 3d deadline). Turn-ins grant `hero_of_the_village` (3 min trade discount) + `murmur:discounted_villager` tag. New: reminder nodes, fail/shame nodes (apologize clears +2 rep, dismiss −5), discount-expired lore branch (tag present + effect gone), trade-nudge branch while glowing, one-time potato gift (`giveItem`), rep wired through social choices (±1/±2). Legacy `murmur:potatoes_pending/rewarded` tags retired (harmless if left on old players). |
| **New fetch quests** | `scripts/dialogue.js` | Pillager tithe (5 emeralds, 3d, +15 rep, instant 3-emerald tribute path too); witch sugar ×8 (3d, +1 emerald +8 rep, one-time vial gift fixed to `glass_bottle`); golem mend (12 cobble, 4d, +3 iron +10 rep); trader leather ×4 (3d, +1 emerald +8 rep); enderman dirt ×16 (3d, +1 pearl +8 rep); wolf bones ×4 (3d, +2 steak +10 rep, one-time bone gift). Every quest has take/return/reminder/success/shame nodes. |
| **Instant tributes that work** | `scripts/dialogue.js` | Piglin gold, pillager emerald, evoker emerald ("forget me instead" spares you), wolf bone — all converted from dead `action` strings to real `takeItem`/`giveItem` + rep. |
| **Rep + navigation pass** | `scripts/dialogue.js` | `repDelta` wired on social choices across all 14 trees; missing `[Back]` links added (pillager parley, skeleton deny, evoker debt, brute gold); piglin `broke` branch added. 70 → ~140 nodes, 15 registrations, English-only (es/pt tree translations still open). |
| **Version bump** | `manifest.json` | 1.1.52 → **1.1.53**. Tree payload ~68 chunks (~23 s at 3/tick; resend loop converges). |

### v1.1.49 — Wave 1: Trees, Quest & Factions

| Change | File | Details |
|---|---|---|
| **Floating-trees fix** | `scripts/dialogue.js` | 4 trees (`wither_skeleton`, `blaze`, `vindicator`, `wolf`) were declared outside the exported `TREES` object and never registered. Moved them inside. Tree count: 8 → **14 registered trees**. |
| **Evoker tree** | `scripts/dialogue.js` | New dialogue tree for `minecraft:evoker` ("the grammar of the dying"). |
| **Piglin brute tree** | `scripts/dialogue.js` | New dialogue tree for `minecraft:piglin_brute` ("the ledger of muscle"). |
| **Villager potato quest** | `scripts/dialogue.js` | `greet → errand → errand_take → errand_return`: accept "Potato-Grub's Grudge" (collect 6 potatoes), return to claim 2 emeralds + 12 reputation. Uses player tags for flow routing. |
| **Faction data** | `scripts/register.js` | Each profile now also sends a `factions` map, so CORE's witness engine can mourn across sub-variants (pillagers mourn pillagers regardless of captain/vindicator status). |
| **Version bump** | `manifest.json` | 1.1.48 → **1.1.49**. |

---

### v1.1.52 � CHUNK_SIZE reduced for reliable delivery

| Change | File | Details |
|---|---|---|
| **Smaller chunk payloads** | scripts/register.js:16 | CHUNK_SIZE 1500 ? **1000** to keep scriptevent command length safely under Bedrock's internal limit (~2060 chars). Profiles with base64 padding (=) were silently dropped at 1500; 1000 avoids this entirely. |
| **Version bump** | manifest.json | 1.1.51 ? **1.1.52**. |
