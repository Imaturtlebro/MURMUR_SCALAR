# ANALYSIS.md — Audit of Reference Mods in `MODTOANALYZEANDEXTRACTFROM`

**Scope:** Full audit of every mod/addon found in `MODTOANALYZEANDEXTRACTFROM/`.
**Purpose:** Extract reusable architecture, UI, data, and design patterns to strengthen **MURMUR** (a modular, ambient-dialogue engine for Minecraft Bedrock where content packs register situational dialogue + names per `entity.typeId` into a global registry via a chunked `scriptevent` bridge, plus a language-book UI).
**Method:** Static read of manifests, scripts, and data files; cross-referenced against MURMUR's existing CORE + UNCANNY pack. No files in the reference folder were modified.

---

## TL;DR — What MURMUR should steal

1. **Chunked data transfer + `scriptEventReceive` dispatch** (Flatworld) — already the shape MURMUR uses; adopt the *dynamic-property* durability variant and graceful degradation.
2. **`professionDialogue[key] = string[]` random-pick model** (VillageFolk) — the cleanest line registry; MURMUR already mirrors this.
3. **Weighted branch picker** (VillageFolk `gossipWeights`) — for situational weighting.
4. **Double-open `Set` guard + `{translate}`/`{rawtext}` localization** (OdysseyNPCs) — for the dialogue-tree UI.
5. **Per-player affinity / reputation bands** (bp `ai_social_memory`, LivingVillagers) — for relationship-gated lines (phase 2).
6. **Runtime `Map` + world-dynamic-property backup registry** (OdysseyNPCs) — most reload-robust global registry.
7. **Loop throttling + squared-distance + cached `.location` + cooldown Maps** (Smarter Mobs `Optimization.txt`) — MURMUR's perf bible.
8. **Book/clock → `beforeEvents.itemUse` → form** trigger (RR Chat Emotes) — exactly the language-book/tome pattern MURMUR already uses.

---

## 1. `Action__Modal_FormData_Template - Copy`
- **Type:** UI template (BP + RP scaffold).
- **Purpose:** Reference for building `ActionFormData` / `ModalFormData` screens; demonstrates button grids, modal inputs, and a paired resource pack for icons.
- **Reusable:** Boilerplate for MURMUR's settings/menu screens. The double-loop button grid pattern is directly portable to the dialogue-tree "choice" rendering.

## 2. `bp` (AI Companion / Faction Core — "rg:bot" ecosystem)
- **Engine:** `@minecraft/server` 1.14.0; BP (`data` + `script`, `scripts/main.js` ~701 lines); `subpacks` = per-difficulty script variants controlling spawn chance.
- **Key systems:**
  - **Chunked dynamic-property storage** (`main.js:54-77`): `saveChunkedProp`/`loadChunkedProp` split JSON into **4000-char chunks** (`_count` + `_0..n`). This exists *because dynamic properties have a size cap* — the canonical workaround for large cross-pack payloads (MURMUR's exact problem).
  - **`scriptEventReceive` bridge** (`main.js:37-44`): dispatches on `event.id` + `event.message`. Same idiom as MURMUR's `murmur:data` bridge.
  - **`SpatialHash`** (`main.js:80+`): 128-block cell partitioning (`structs`/`paths` Maps) for O(1) proximity queries — a drop-in for MURMUR's "proximity" scan across many entities.
  - **Faction system** (`ai_faction_system.js`): `FACTIONS` map, weighted `assignFaction` (60/20/10/10), per-entity DP `rg:faction`, `isHostileFaction`, `getFactionalAllies/Enemies`.
  - **Social memory** (`ai_social_memory.js`): DP `rg:affinity_<playerName>`, `HATE_THRESHOLD=-30`, `LOVE_THRESHOLD=30`, passive decay; drives which lines fire.
- **Reusable for MURMUR:** the chunker + spatial hash + affinity bands. **This is the single most architecturally relevant mod in the folder.**

## 3. `EMA - Enhanced Mob Ai BP` (Smarter Mobs)
- **Type:** BP scripts (per-mob AI: `creeper.js`, `zombie.js`, etc.) + design docs (`Optimization.txt`, `Overview.txt`, `Roadmap.txt`, `Opinion.txt`, `Suggestions.txt`).
- **Performance playbook (from `Optimization.txt`) — apply to MURMUR's tick loop:**
  1. Throttle: `system.runInterval(fn, 10)` not every tick (≈95% CPU cut).
  2. Squared-distance: `(dx*dx+dy*dy+dz*dz) < 36` instead of `Math.sqrt() < 6`.
  3. Filter before `.map()`; avoid per-tick array allocations (GC).
  4. Check `hurtEntity.typeId` *before* `getEntities` spatial query; use `entity_types` filters.
  5. `entity.isValid()` guards instead of `try/catch`.
  6. Cache `player.location`/`entity.location` once per loop.
  7. Short-circuit distance before angle/dot math.
- **Reusable:** MURMUR CORE `main.js` already throttles (interval 4) and uses `maxDistance` queries — adopt squared-distance + location caching + cooldown Maps next.

## 4. `Flatworld_Villages_Standart_Edition_Addon_1.1.0_By_Obsitus`
- **Engine:** `min_engine_version [1,21,0]`, server 1.14.0; BP (`data`+`script`).
- **Key features:** village blueprint generation, **chunked dynamic-property storage** (`main.js:54-77`), `SpatialHash`, world seed in DP.
- **Reusable:** Confirms the chunked-bridge + spatial-hash pattern independently discovered by two mods → high confidence it's the right call for MURMUR.

## 5. `FOR 1.21.12x [English][Beta0.2.9]Echoes of Multiplayer (AI Players)` & `Minecraft AI Players`
- **Engine:** `Echoes` BP `min_engine_version [1,21,80]`, server 2.4.0-beta, ui 2.0.0.
- **Key systems:**
  - **`ai_interaction_ui.js`** (~55KB): friend/companion menus, `openMenus` double-open guard (`player.id+"_"+entity.id`), `getButtonLabel`, `cleanText` (strips nbsp), `MessageFormData` dialogs.
  - **Per-typeId naming** (`newb_namer.js`): `adjective+conjunction+noun+number` composition; config DBs in `config/*.js` (arrays with `{}` placeholders).
  - **Affinity listener** (`ai_affinity_listener.js`): scoreboard `affinity_set` + `AFFINITY_CONFIG` Map<score,{chance,min,max,messages[],cooldown}>; per-AI private cooldown Map.
  - **Functions** (`.mcfunction`): scoreboard-driven function chaining (`main.mcfunction` → `rdmitem`).
- **Reusable:** config-DB separation (one array file per theme = one MURMUR content pack), `{}` placeholder convention, affinity-gated line pools, double-open guard.

## 6. `LivingVillagers_NoBeta` (Quests & Reputation)
- **Engine:** `min_engine_version [1,26,20]`, server 1.17.0, ui 1.1.0; BP+RP.
- **Key systems:**
  - **Per-village reputation** DP `q2:rep_<villageId>_<playerId>`, `repTier`/`repBand`, `addRep` clamped, honor HUD via `setActionBar`.
  - **Contextual/emotion dialogue** (`EMOTIONS`, `contextualEmotion(v,rep)`, `fill()` substituting `{tier}/{me}/{other}`).
  - **Quests:** `pickQuest`/`offer`/`turnIn`; active quest in DP `q2:active`.
  - **`scriptEventReceive` dispatch** (`q2:menu/job/cache/hud/rep/setrep`) — wrapped in try/catch with note: *"scriptEventReceive may be absent on stable; keep core gameplay working without it."* → **MURMUR must feature-detect and degrade.**
- **Reusable:** reputation-gated dialogue, emotion particles, `{}` fill, graceful degradation.

## 7. `OdysseyNPCs` (Full RPG NPC Framework)
- **Engine:** server 2.4.0; BP+RP (from `.mcpack`).
- **Key systems:**
  - **Runtime registry** (`state.js`): module `Maps` (`npcData`, `npcRegistry`, `dimensionMap`); `getState` lazy-loads + caches; **"triple-lock" persistence**: per-entity DP + world-DP backup (`cnpc:auth_<entityId>`) so ownership survives entity-DP wipes.
  - **Dialog container:** `defaultState().dialog = { title:"", lines:[] }` (JSON DP).
  - **Permissions:** owner(3)/whitelist(2)/public(1); UUID resolution via `cnpc:player_uuid` + `cnpc:uuid_name:<uuid>`.
  - **UI** (`menus.js`, 93KB): `ActionFormData`/`ModalFormData`/`MessageFormData`; **double-open `Set` guard** with try/finally; `getButtonLabel` resolves `{translate}` vs string vs item id; `cleanText`; `MessageFormData` for read-only dialog; `ModalFormData` for dialog *editing*.
  - **Quests** (`quest.js`): `FREE`/`SEQUENTIAL`, `collect`/`kill`/`goto`, `setMainMenuCallback` for deep back-nav.
  - **Shops** (`shop.js`), factions, patrol/goto/link behaviors, admin wand.
- **Reusable:** the most robust global-registry pattern in the set; `translate`/`rawtext` UI localization; deep-menu back-navigation — directly applicable to MURMUR's dialogue tree.

## 8. `VillageFolk 1.6.0`
- **Engine:** `min_engine_version [1,26,20]`, server 2.7.0, ui 2.0.0; single script module.
- **Key systems — BEST pure-dialogue reference:**
  - **Per-profession dialogue arrays** (`dialogue.js`): `professionDialogue[profession] = string[]` ~25 lines each; `getDialogueLine` random with `unemployed` fallback. **This is the canonical MURMUR line shape.**
  - **Weighted gossip trees** (`gossipdialogue.js`): `gossipWeights` (40/30/20/10) + `pickGossipType()`; `getGossipLine(type,name,label)` substitutes `{name}/{profession}`.
  - **Hurt dialogue** (`hurtdialogue.js`) per profession + `generic` fallback.
  - **Unique naming** (`names.js`): `usedNames` Set across dims; compose two names if exhausted.
  - **Profession→key mapping** (`professions.js`): `entity.matches({families:[key]})` → `{color,label}`.
  - **Moods** (`moods.js`): `MOODS` (symbol+color+label), `detectMood`, name tag = `profColor+name \n profLabel+mood`.
  - **Settings UI** (`settingsui.js`): `ActionFormData` hub → `ModalFormData` submenus (toggles/sliders/dropdowns) + reset-confirm.
- **Reusable:** the line-array model, weighted picker, `{placeholder}` fill, mood→color name tags (MURMUR could color `sendCleanChat` by mood), settings UI pattern.

## 9. `rp` (AI Multiplayer Resource Pack)
- **Engine:** `min_engine_version [1,26,30]`; RP.
- **Key features:** multi-language `texts/*.lang` (en_US, en_ES, es_ES, es_MX, id_ID, pt_BR, pt_PT, ru_RU) — template for MURMUR i18n; `client_entity` `aibot.json` with 38 `skinNN` texture keys (scalable skin/variant registration); social HUD icons (`friends.png`, `online.png`, etc.).
- **Reusable:** ship MURMUR translations as `texts/*.lang` + `languages.json`; per-typeId display-name/skin registration.

## 10. `scripts` (RR Chat Emotes)
- **Engine:** standalone `@minecraft/server` + ui script.
- **Key features:** emote maps `{name,msg,sound,pitch,particle,targetMsg?}`; `%player%`/`%target%` substitution (note: different convention from `{}` — pick one); DP persistence `ce_` prefix keyed by `player.name`; **`beforeEvents.itemUse` on a book/clock → open form**; first-join book/clock gift; `ActionFormData` hub → submenus with Back buttons.
- **Reusable:** the book→form trigger is the closest analog to MURMUR's language-book and the new **Dialogue Tome** added to MURMUR CORE. Adopt `%player%`→`{}` unification.

## 11. `src` / `talking_mobs` (Java Fabric — NOT Bedrock)
- **Purpose:** "mobs talk on right-click" (Fabric 1.20.4). README confirms Java-only; **not portable**, but the *concept* (right-click → personality line) maps onto MURMUR's interact/ambient trigger. The `README.md` in this folder is the Talking Mobs readme (Java build steps).

## 12. `dialogue template.mcaddon` (Native `minecraft:npc_dialogue`)
- **Purpose:** template for the **native NPC dialogue** system.
- **Key features:** `dialogue/test.json` scene format `{ scenes:[ { scene_tag, npc_name:{rawtext:[{translate}]}, text:{rawtext:[{translate,with}]}, buttons:[{name,commands}] } ] }`; custom `ui/npc_interact_screen.json` vanilla UI screen (panels, `skin_button`, bindings, focus nav).
- **Reusable:** MURMUR could either (a) use native `npc_dialogue` for script-free branching, or (b) build a bespoke `ui/*.json` screen. The `rawtext`+`translate`+`with` idiom is bedrock i18n primitive.

## 13. `NPC COMERCIANTES.mcaddon` / `NPCSoldier[BP]/[RP].mcpack` / `GuardVillager5`
- **NPC COMERCIANTES:** mostly RP (shops, coins, viking armor); `en_US.lang` `key=value` translation pattern.
- **NPCSoldier:** BP+RP, `entities/soldier*.json`, `functions/team1.mcfunction` etc. — function-based team system (lightweight alternative to scripts).
- **GuardVillager5:** BP (`min_engine_version [1,17,0]`, data only, no scripts) + RP; `entities/villager*.json` (87KB!), `loot_tables/Trade/Villager.json` (trade offers), animations. **Pure-JSON entity override + trade/loot tables** — template for MURMUR economy hooks.
- **Reusable:** `functions/murmur_*` helpers; trade/loot table shapes for future "quest reward" lines.

---

## Cross-Cutting Themes & Reusable Patterns for MURMUR

| Theme | Best source | MURMUR application |
|---|---|---|
| Chunked bridge + DP durability | Flatworld, `bp` | Reassemble `murmur:data` chunks into a DP for reload survival |
| Line registry shape | VillageFolk | `registry[typeId][situation] = string[]` (already done) |
| Weighted situation picker | VillageFolk `gossipWeights` | Weight proximity/rain/night/wounded/death |
| UI localization | OdysseyNPCs, `rp` | `{translate}`/`{rawtext}` + `texts/*.lang` |
| Double-open guard | OdysseyNPCs, Echoes | `Set` keyed `player.id+"_"+entity.id` (added to MURMUR tree UI) |
| Trigger item → form | RR Chat Emotes | Language Book **and** new Dialogue Tome |
| Affinity/reputation bands | `bp`, LivingVillagers | Phase-2 relationship-gated lines |
| Robust global registry | OdysseyNPCs | Runtime `Map` + world-DP backup |
| Performance | Smarter Mobs `Optimization.txt` | Throttle, squared-dist, cache location, cooldown Maps |
| Graceful degradation | LivingVillagers | Feature-detect `scriptEventReceive` |

### Critical bug found in MURMUR itself (during this audit)
The UNCANNY `dialogue.js` defines keys with **trailing spaces** (e.g. `"minecraft:villager_v2 "`, `"minecraft:wheat "`). These never match `entity.typeId`, so **all ambient chatter and naming for the UNCANNY pack was silently disabled**. Fixed centrally in `MURMUR CORE/scripts/api.js` via a recursive `trimKeys()` normalization on every registered `dialogue`/`trees`/`typeId` payload — no need to hand-edit the giant dialogue file.

---

*Generated by opencode audit. Cites are file:line references inside `MODTOANALYZEANDEXTRACTFROM/`.*
