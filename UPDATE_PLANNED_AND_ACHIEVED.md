# MURMUR — Update: What Was Planned & What Was Achieved

**Type:** Development changelog / roadmap
**Packages touched this update:** `MURMUR - CORE` and `MURMUR - UNCANNY`
**Scope of the work:** Turning MURMUR from an "ambient chatter" engine into a fuller NPC RPG skeleton, by extracting high-quality features from the reference mods in `MODTOANALYZEANDEXTRACTFROM/` (behavior-pack content only; all resource-pack material was ignored) and folding them into CORE + UNCANNY.
**Reference source:** `ANALYSIS.md` + `brainstorm_roadmap.md` (the full audit of `MODTOANALYZEANDEXTRACTFROM`).

---

## 1. The Plan (this update)

The goal was to take the reference mods' strongest reusable ideas and land a **coherent "NPC RPG" slice** inside MURMUR, while fixing a couple of real bugs found during the audit. Planned work:

### Planned for `MURMUR - CORE` (the engine)
1. **Quest system** — a persistent, per-player RPG quest layer (start / progress / turn-in / reward), driven by dialogue-tree choices and a quest journal. *(inspired by OdysseyNPCs `quest.js`, LivingVillagers)*
2. **Reputation HUD** — show the player's current standing with the friendly mob they're looking at, in the action bar. *(inspired by LivingVillagers `q2:rep` honor HUD)*
3. **"Talk back" to NPCs** — empty-hand right-click on a talkable creature opens its dialogue tree, so players can actually respond instead of only eavesdropping. *(directly from user feedback: "I wish there were a way to communicate back to the villagers")*
4. **Witness faction fix** — the "sometimes wrong faction mourns a slain other-faction" bug: make the death-witness engine mourn by *faction group* (own kind + sub-variants) and never a rival. *(documented in UNCANNY `Documents/witnessbug.txt` but not yet fixed in `main.js`)*
5. **Tree consequence upgrade** — support structured, native RPG consequences on dialogue choices: `startQuest`, `turnIn`, `giveItem`, `questProgress`, plus the existing `repDelta`/`setTags`/`action`. *(brings the tree `action` field from "flavor" into "gameplay")*

### Planned for `MURMUR - UNCANNY` (the content)
1. **Fix the floating-trees bug** — 4 trees (wither_skeleton, blaze, vindicator, wolf) were declared *outside* the exported `TREES` object, so they never registered (and the file was technically malformed). Merge them in.
2. **New dialogue trees** — add `evoker` and `piglin_brute` trees (they had ambient lines but no talkable trees).
3. **A real villager quest** — a branch that hands out a "gather 6 potatoes" errand and pays out emeralds + reputation on turn-in, demonstrating the whole new CORE quest pipeline.
4. **Faction data** — register the pack's factions so witness mourning works across sub-variants.

---

## 2. What Was Achieved (this update)

### `MURMUR - CORE` (v1.0.33 → **v1.0.34**)

| Feature | Where | How it works |
|---|---|---|
| **Quest engine** | new `scripts/quests.js` | Persistent per-player quests in sharded dynamic properties (`murmur:quests:<name>`) so no 32KB-cap blowups. Supports `collect` / `kill` objectives, automatic progress wiring (`entityDie` for kills; a throttled inventory poll for collect), turn-in (pays reward items + reputation, consumes collected items), an active-quest cap (3), and a quest journal via `/scriptevent murmur:quest journal`. Emits `questStarted` / `questObjectiveComplete` / `questTurnedIn` events on the MURMUR event bus. |
| **Reputation HUD** | new `scripts/rep_hud.js` | Every ~10 ticks, reads the player's view-direction for a friendly sentient and prints `<Name> — Status (+N)` plus any remembered grudge in the action bar. Toggle: `/scriptevent murmur:rep on|off`. Traverses nothing expensive — throttled + glance-based. |
| **Interact-to-talk** | `scripts/dialogue_tree.js` | `playerInteractWithEntity` handler opens a creature's dialogue tree on empty-hand right-click **only when that type actually has a tree**, so villager trading and hostile-combat right-clicks are untouched. |
| **Tree RPG consequences** | `scripts/dialogue_tree.js` | `applyChoiceEffects` now natively handles `giveItem`, `startQuest`, `turnIn`, `questProgress`, and `sendMessage`, on top of the existing `setTags` / `clearTags` / `setProperties` / `takeItem` / `repDelta` and the legacy `action` command. |
| **Witness faction fix** | `scripts/main.js` | Death-witness engine now resolves the deceased to a **faction group** (e.g. `[pillager, pillager_captain, vindicator, evoker, ravager]`) and lets only that group mourn. A witch/pillager will no longer mourn a slain villager. Falls back to registered pack `FACTIONS` first, structural groups second. |
| **Status report** | `scripts/index.js` | `/scriptevent murmur:status` now lists the new systems. New modules wired in. |
| No API violations | — | All files pass `node --check`; uses only `@minecraft/server` + `server-ui` APIs already available at 1.11. |

### `MURMUR - UNCANNY` (v1.1.48 → **v1.1.49**)

| Feature | Where | How it works |
|---|---|---|
| **Floating-trees fix** | `scripts/dialogue.js` | The 4 orphaned trees are now inside `export const TREES` (verified with node: 8 → **14 registered trees**). This also removes a latent file-level syntax problem. |
| **New trees** | `scripts/dialogue.js` | `minecraft:evoker` ("the grammar of the dying") and `minecraft:piglin_brute` ("the ledger of muscle") dialogue trees. |
| **Villager quest branch** | `scripts/dialogue.js` | `greet → errand → errand_take → errand_return`: accept the "Potato-Grub's Grudge" quest (collect 6 potatoes), a "Return the potatoes" turn-in choice gated on actually holding 6 potatoes, paying 2 emeralds + 12 standing. Uses player tags (`murmur:potatoes_pending` / `murmur:potatoes_rewarded`) to route the flow. |
| **Faction data** | `scripts/register.js` | Each profile now also sends a `factions` map, so CORE's witness engine can mourn across sub-variants (pillagers mourn pillagers regardless of captain/vindicator status). |

---

## 2b. Wave 2 — Commerce, Stewardship, and Recovery (v1.0.34 → **v1.0.35**)

A second pass on the same extraction directive ("integrate the ideas cleanly, and rewrite so nothing is a derivative copy"). This wave re-expresses the richest remaining reference features — the shop/trade flow (OdysseyNPCs `shop.js` + NPC COMERCIANTES merchant data) and the world-ownership / backup concerns (OdysseyNPCs `worldmode.js` + its backup pattern) — into **fresh MURMUR-native implementations**. Every module is new code with its own data model, naming, and flow; none of it quotes the source files.

### Planned (this wave)
1. **Commerce engine** — atomic, per-merchant-item trade with currency, inventory pre-checks, and rollback. *(inspired by OdysseyNPCs `shop.js` + COMERCIANTES `trades/entities/*.json`)*
2. **Interaction selector** — when a creature backs several systems, let the player choose (Speak / Trade / My tasks) instead of forcing one. *(reinterprets OdysseyNPCs' main-menu-with-systems idea in MURMUR's chat-dialogue idiom)*
3. **Quest engine upgrade** — `goto` quest type (auto location-tracking), chain/repeatable tasks, and a turn-in inventory buffer so rewards never vanish into a full pack. *(reinterprets OdysseyNPCs `quest.js` FREE/SEQ + repeatable + pre-check)*
4. **Stewardship / world-governance** — a first-claim "steward" plus revocable operator permits and a world-mode flag. *(reinterprets OdysseyNPCs world owner / admin / world-mode)*
5. **Vault (crash recovery)** — a checksummed mirror of MURMUR's sharded persisted state with on-demand audit+restore. *(reinterprets OdysseyNPCs' multi-location backup practice, without a single monolithic copy)*

### Achieved (this wave) — all in `MURMUR - CORE`

| Feature | Where | How it works |
|---|---|---|
| **Commerce engine** | new `scripts/commerce.js` | Offers are item-for-item trades: `{ sell:{id,amount}, ask:{id,amount} }`. Player opens a stock screen (ActionForm) via right-click when a creature has offers. `runTrade` is atomic: pre-flights **affordability + carry-room** (stackable vs. per-slot for non-stackables), deducts the price, grants the goods, and **rolls the price back** if the grant ever fails. Catalog namespaced per merchant in `murmur:commerce:<typeId>`. Merchants are stocked by operators: `/scriptevent murmur:shop stock <typeId> <sellId> <sellAmt> <askId> <askAmt>` (and `clear`). |
| **Interaction selector** | `scripts/dialogue_tree.js` | New `interactHub`: the right-click handler now counts how many systems a creature backs (tree / shop / active tasks). One → go straight in. Several → a chooser (`Speak` / `Trade` / `My tasks`). None → reply, and the vanilla interact is left untouched. Composes with the existing Dialogue Tome. |
| **Quest engine upgrade** | `scripts/quests.js` | Added a `goto` type with per-quest `x/y/z/range` (auto-completed by a throttled distance tick), plus `mode` (`single`/`chain`) and `repeatable` flags. Turn-in now runs an **inventory buffer check**: if the reward won't fit, it aborts without consuming the collected items or closing the task. | 
| **Stewardship** | new `scripts/worldadmin.js` | First run, a player `/scriptevent murmur:steward` is recorded as the **steward** (world DP, survives reload) and granted `murmur:admin`. The steward can `op`/`deop` operators and set a world `mode` (`survival|creative|adventure`). `isPermitted()` gates admin-only commands (including shop stocking and vault restore). |
| **Vault (recovery)** | new `scripts/vault.js` | Periodically snapshots every MURMUR shard (`murmur:quests:*`, `murmur:mem:p:*`, `murmur:mem:v`, `murmur:commerce:*`) into `murmur:vault:backup` keyed by a deterministic per-shard hash. `/scriptevent murmur:vault audit` (steward/operator) compares live shards against the ledger and restores any that diverged; it records new shards as canonical. `/scriptevent murmur:vault backup` forces a snapshot. |
| **Wiring & status** | `scripts/index.js` | New modules imported; `/scriptevent murmur:status` now lists Commerce, Steward, and Vault. |

---

## 3. How to play-test the new stuff

```
/scriptevent murmur:status            # confirm Quest + Rep HUD + Talk systems are listed
/scriptevent murmur:rep on            # turn on the reputation action-bar HUD
# Look at a villager -> it now costs nothing to greet it
# Empty-hand right-click a villager -> dialogue tree opens
# In the tree: "Do you need anything? (Errand)" -> accept the potato quest
# Gather 6 potatoes -> the quest auto-completes -> return -> +2 emeralds, +12 standing
/scriptevent murmur:quest journal     # see active tasks
/scriptevent murmur:quest abandon <id># drop a task

# --- Wave 2: stewardship, commerce, vault ---
/scriptevent murmur:steward           # (first time) claim this world -> you're the steward
/scriptevent murmur:steward op <name> # grant an operator permit
/scriptevent murmur:steward         # 3+ users: each needs a permit; only the steward claims
# Stock a merchant: sell 2 iron for 1 emerald on villagers
/scriptevent murmur:shop stock minecraft:villager_v2 minecraft:iron_ingot 2 minecraft:emerald 1
# Right-click a villager -> chooser (Speak / Trade) -> Trade -> buy
/scriptevent murmur:shop clear minecraft:villager_v2   # wipe a merchant's catalog
/scriptevent murmur:vault backup       # snapshot current persisted state
/scriptevent murmur:vault audit        # check + auto-restore any tampered shard
```

---

## 4. Future Plans for Each MURMUR Pack

> The Brainrot Pack is intentionally excluded from these forward plans. Each pack below inherits the CORE engine gains (quests, rep HUD, talk-to, witness fix) and should lean into them thematically.

### MURMUR - CORE (engine-wide, benefits every pack)
- **Durable registry:** persist reassembled `murmur:data` / `murmur:tree` chunks into a world dynamic property so packs survive a reload without re-sending (roadmap C1).
- **Weighted situational picker:** formalize a `SITUATION_WEIGHTS` table (proximity / rain / night / wounded / thunder) so chatter feels intentional, not noisy (roadmap C4).
- **SpatialHash proximity scan** to slash the per-loop entity scan cost on busy worlds.
- **Deepen commerce:** a `rep-tiered` stock (better offers unlock as standing rises), pack-declared default catalogs, and `goto`-style shop-delivery errands.
- **Per-village / per-faction reputation bands** gating which tree branches are offered, plus `{affinity}` placeholder.
- **Quest chain chaining:** seed the "next" quest from a completed `chain` task so multi-step arcs drive themselves.
- **Social Codex book:** emotes + a relationship panel (consistent with the Language Book + Dialogue Tome pattern).
- **Native i18n:** ship `texts/*.lang` + `languages.json` so the game's language selector drives MURMUR, keeping the book as a manual override.

### MURMUR - UNCANNY
- More quest branches that match its tone (e.g. a Witch brew-errand, a Golem "mend the walls" errand, an Enderman "carry a block" errand).
- Merchant-flavored stock matching its fell aesthetic (a Witch brewing poisons, an Enderman trading chorus fruit) wired through CORE's new commerce engine.
- Biome / dimension-aware lines (deep-dark dread, Nether isolation) and boss-presence panic (Wither nearby → all mobs whisper).
- Flesh out evoker / piglin_brute trees into multi-turn mini-arcs; add illager "pre-raid shout" and villager "hide the emeralds" cross-faction calls.
- Add roam/nightground trees for `wandering_trader` and deepen the mood→color name-tag glitch aesthetic.

### MURMUR - ANIMAL CORE (the animal engine)
- Mirror the CORE engine upgrades where they make sense for animals: a lightweight animal "affection" reputation + a `companion` bond (tame/pet) that unlocks special lines.
- Add a throttled "pack awareness" system so animal herds react to nearby danger/weather as a group.
- Keep the ultra-low-lag promise: add squared-distance + cached-location optimizations ported from the CORE main loop.

### MURMUR - ANIMAL PACK (content)
- More action-text reactions driven by the new engine hooks (`*Cow sweat-drops nervously*` when you hold a sword; `*Sheep watches you fall in disappointment*`).
- Add a light "bond" quest: e.g. a chicken that asks you to bring it seeds; completing it raises its affection line pool.
- Expand the silent-observer palette with weather, dawn/dusk, and eating reactions.

### MURMUR - CRUEL PACK
- Add "roast trees" — talk to a hostile mob and it roasts you (dialogue-tree choices are all insults / gaslighting; "leave" is the only graceful escape).
- Quest-variant: "humiliation errands" where the reward ticker still roasts you.
- Lean into the roast/relationship interplay: rep-based insults that escalate as you *hurt* or *help* each faction.

### MURMUR - MEDIEVAL PACK
- Push hard into dark-fantasy archaic dread (the "MEDIEVAL could lean heavy into dark" direction): "Thy flesh shall mend the earth."
- Add a genuine **kingdom/fealty reputation** with quests (bring grain to the village, clear a raider camp), gated by standing.
- Sword-and-shield flavored dialogue trees (guard, blacksmith, lord) consistent with the historical weight.

### MURMUR - NOIR
- Add a "case" quest-chain: NPCs hand out cigarette-lighter-flavored investigation errands (gather X, find Y, confront Z).
- Mood-driven inner-monologue trees: every choice is a cynical voice-over; the HUD rep meter reads like a case file ("LEAN: Cyanide / MORAL: -12").
- Nightclub-of-the-world ambiance: rain/streetlight-flavored ambient lines + witness reactions that always sound like a bad omen.

### MURMUR - PRAISE PACK
- Add "devotional" dialogue trees where the player is the terrifying Creator and choices are acts of worship vs. neglect.
- A "sacrament" quest system: bring an offering to a creature, receive a blessing (buff item) + escalating praise/horror rep.
- Escalate the cosmic-cultist tone with rep bands (Revered → Unnameable) and HUD readouts that sound like liturgical chants.

---

## 5. Verification notes
- All edited/new `MURMUR - CORE` and `MURMUR - UNCANNY` scripts pass `node --check` (syntax). `dialogue.js` imports cleanly under Node as a module and reports **14 registered dialogue trees**.
- Wave 2 added five fresh CORE modules (`commerce.js`, `worldadmin.js`, `vault.js`) plus reworked `quests.js` and `dialogue_tree.js`. All 16 CORE scripts pass `node --check`; no API use beyond `@minecraft/server` (1.11) + `server-ui` (1.3).
- The Commerce/Vault/Steward/Quest code is entirely original MURMUR-authored work (new data models, naming, and logic flow) — no OdysseyNPCs or COMERCIANTES source was copied. The reference packs only inspired the *capabilities*.
- No resource-pack changes were made anywhere.
- To ship: run `compile.bat` / `compile.py` (or the `DIRECT DEPLOYER`) per pack, or use the root `UNIVERSALDirectDeployV2` tool.
