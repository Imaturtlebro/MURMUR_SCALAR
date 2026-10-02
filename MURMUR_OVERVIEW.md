# MURMUR — What It Is, Cores, Packs, and How Not to Break It

> Companion to `MURMUR_GUIDE.md` (player guide), `ANALYSIS.md` (reference-mod audit),
> `brainstorm_roadmap.md` (roadmap), `PATCH_NOTES.md` and `UPDATE_PLANNED_AND_ACHIEVED.md`.
> Versions referenced: **MURMUR CORE v1.0.41**, **Uncanny v1.1.52**,
> **Animal Core v1.0.20**, **Animal Pack v1.0.22**.

---

## 1. What is MURMUR?

MURMUR is a **modular ambient-dialogue engine for Minecraft Bedrock** (server scripting,
`@minecraft/server` + `@minecraft/server-ui`).

The idea: **mobs become talking characters with mood, memory, and relationships.**

- **Ambient chatter layer** — creatures speak as you pass by. Lines are situational:
  proximity, holding a weapon/tool/spyglass, armor state, day/night, rain/thunder,
  wounded/on fire, alone vs. crowded, boat/jukebox/wealth nearby, seen animals,
  reputation greetings, death/witness mourning.
- **NPC roleplay layer** (full engine only) — talk back, build per-mob reputation,
  take `collect` / `kill` / `goto` quests, trade with stocked merchants.
- **Architecture** — a thin **CORE engine** holds the loop, registry, UI, and RPG
  systems. Thin **content packs** register `names + dialogue (+ trees/factions)`
  per `entity.typeId` through a **chunked `scriptevent` bridge**, plus a language-book UI
  (`en_US` / `es_ES` / `pt_BR`).
- **Theme-swappable** — same engine, different voice. Uncanny (eldritch), Cruel (abuse/roast),
  Medieval (archaic dread), NOIR (detective), Praise (cultist worship), Animal (playful observer).

There are **two separate engine bloodlines** — they are NOT interchangeable:

| Engine | Drives | Weight |
|---|---|---|
| **MURMUR CORE** | Uncanny, Cruel, Medieval, NOIR, Praise | Full RPG engine |
| **MURMUR ANIMAL CORE** | Animal Pack only | Ultra-light animal engine |

Golden rule: **one CORE story pack (Uncanny/Cruel/...) + MURMUR CORE per world.**
The **Animal stack (Animal Core + Animal Pack) may run alongside** the CORE stack —
farm animals always prioritize the animal stack (see §7). The two COREs never fight:
different scriptevent channels, different stores, plus an explicit yield contract.

---

## 2. What is MURMUR CORE?

**The full-featured engine.** Everything except Animal Pack runs on it.

- **File:** `MURMUR - CORE/` — entry `scripts/index.js`, manifest UUID
  `7f9a1b2c-3d4e-4f5a-6b7c-8d9e0f1a2b3c`, v1.0.40.
- **Bridge events:** `murmur:data`, `murmur:tree`, `murmur:diag`, `murmur:resend`
  (declared in `manifest.json` `events` so Bedrock guarantees delivery).
- **Global store:** `globalThis.MURMUR_DATA` (`DIALOGUE`, `TREES`, factions, `LANG`, `CHATTER_ENABLED`).
- **Tick loop** (`scripts/main.js`): iterates registered types across
  overworld/nether/the_end, 3 entities per tick, ~24-block player radius,
  ~15 s per-entity cooldown, 40 % random gate + global anti-hive-mind throttle.
  Handles naming (`entitySpawn` proactive naming + `ensureNameTag`), mood detection
  (zombie/illager/animal helpers, `factionGroupFor` exact-match groups),
  witness/mourning engine, hurt/death/peer reactions.
- **RPG systems on top:**
  - `dialogue_tree.js` — branching trees (`{ start, nodes: { text, choices: [{ label, goto, action? }] } }`),
    empty-hand right-click / Dialogue Tome / `/scriptevent murmur:talk` to open,
    Sneak+RMB on villagers (so vanilla trading still works), themed per type,
    double-open guard, `applyChoiceEffects` (`giveItem`, `startQuest`, `turnIn`,
    `questProgress`, `sendMessage`, `setTags`, `takeItem`, `repDelta`, legacy `action`),
    Speak/Trade/My-tasks interaction hub.
  - `quests.js` — persistent per-player quests in sharded DPs (`murmur:quests:*`),
    `collect`/`kill`/`goto`, `mode`/`repeatable`, cap of 3 active, journal
    (`murmur:quest journal`), inventory-buffered turn-in (never loses rewards).
  - `rep_hud.js` + `memory.js` — per-mob reputation + action-bar HUD
    (`Hated ≤ -30 → Disliked ≤ -10 → Neutral → Liked ≥ 10 → Revered ≥ 30`),
    sneak-for-grudge readout, `murmur:rep on/off`.
  - `commerce.js` — atomic item-for-item merchant trade, per-type catalog
    (`murmur:commerce:<typeId>`), `murmur:shop stock <type> <sell> <n> <ask> <n>` / `clear`
    (operator-only).
  - `worldadmin.js` — stewardship: first `murmur:steward` claimant owns the world,
    `op`/`deop`/`mode`, gates all admin commands.
  - `vault.js` — checksummed mirror + `murmur:vault backup` / `audit` crash recovery.
  - `langbook.js` + `localization.js` + `conversations.js`, `lang`/`chatter`/`sound`/
    `give_book`/`status`/`validate` commands.

CORE ships **no dialogue of its own** — without a content pack its target-type list is
empty and it stays silent.

---

## 3. What is MURMUR Uncanny?

**The default showcase content pack for MURMUR CORE.** Eldritch, psionic, unsettling.

- **File:** `MURMUR - UNCANNY/` — entry `scripts/register.js`, v1.1.52.
- **Theme:** endermen & evokers talk in geometry/phase-space, pigs lament, witches brew
  dread, golems intone walls, pillagers parley in menace. Villager potato errand
  ("Potato-Grub's Grudge": collect 6 potatoes → 2 emeralds + 12 rep) demos the full
  quest pipeline.
- **Coverage:** ~14 dialogue profiles
  (`villager_v2`, `villager`, `piglin`, `piglin_brute`, `pillager`, `pillager_captain`,
  `vindicator`, `evoker`, `witch`, `blaze`, `enderman`, `iron_golem`,
  `wandering_trader`, `skeleton`, plus `wither_skeleton`/`wolf` trees/names) and
  **14 registered dialogue trees** (pillager, witch, iron golem, wandering trader,
  enderman, skeleton, piglin, wither skeleton, blaze, vindicator, wolf, evoker,
  piglin brute + villager).
- **How it registers:** builds per-type `{ names, dialogue, trees, factions }` payloads
  (with `en/es/pt` overlays), base64-encodes, splits into `CHUNK_SIZE = 1000` pieces,
  sends `scriptevent murmur:data / murmur:tree` at `PER_TICK = 3` (slow on purpose —
  burst-sending drops chunks), answers CORE's `murmur:resend` ACK loop. Depends on the
  CORE UUID in its manifest.
- **Factions map** included so CORE's witness engine mourns correctly
  (illagers mourn illagers, never villagers).

Sibling packs reuse the same CORE contract with different voices:
**Cruel** (insult gauntlet), **Medieval** (kingdom/fealty dread), **NOIR** (case-file
investigations), **Praise** (Creator-worship sacraments). See `UPDATE_PLANNED_AND_ACHIEVED.md §4`.

---

## 4. What can be added / expanded with MURMUR Uncanny?

Anything that fits the **CORE content contract** — Uncanny is pure data, no engine fork needed.
Safe expansion axes (all drawn from `UPDATE_PLANNED_AND_ACHIEVED.md §4` + `brainstorm_roadmap.md`):

1. **New dialogue lines per existing type** — add strings to any situation pool in
   `scripts/dialogue.js` (`proximity`, `holding_weapon`, `holding_useful`, armor/weak,
   `day`/`night`/`rain`/`thunder`/`wounded`/`on_fire`, alone/crowded, boat/jukebox/wealth,
   seen-animal, rep greetings, hurt/death/witness). Keep keys exact `minecraft:<id>` —
   **no trailing spaces** (that bug silently disabled Uncanny chatter once; CORE now
   `trimKeys()`-normalizes, but don't rely on it).
2. **New entity types** — add a `NAME_MAP` entry + `DIALOGUE[typeId]` profile + resend
   coverage in `scripts/register.js` (e.g. `minecraft:warden`, `minecraft:allay`,
   `minecraft:sniffer`). CORE picks up any registered type automatically.
3. **New / deeper dialogue trees** — add to exported `TREES` (must be *inside* the export —
   4 trees were once orphaned outside it and never registered). Use `goto` chains,
   `requires` gates (held item, rep threshold, tag flag), and RPG consequences
   (`giveItem`, `startQuest`, `turnIn`, `repDelta`, `sendMessage`). Planned arcs:
   witch brew-errand, golem "mend the walls", enderman "carry a block", fleshed-out
   evoker/piglin_brute mini-arcs, illager pre-raid shouts, villager "hide the emeralds".
4. **New quests** — `collect` / `kill` / `goto` (with `x/y/z/range`), `mode: single|chain`,
   `repeatable`, turn-in rewards + rep. Chain follow-ups to build multi-step arcs.
5. **Commerce stock with Uncanny flavor** — no pack-side code needed; an operator runs
   `murmur:shop stock` (e.g. witch sells potions, enderman buys chorus fruit). Future:
   pack-declared default catalogs, rep-tiered offers, delivery errands.
6. **Reputation-gated branches** — gate tree choices on standing bands
   (Hated/Disliked/Neutral/Liked/Revered) for parley-or-fight illager logic.
7. **Biome / dimension / boss awareness** — deep-dark dread, Nether isolation,
   Wither-nearby whispers (new conditions in CORE `main.js` + matching line pools).
8. **Translations** — mirror every new line pool in `dialogue_es.js` / `dialogue_pt.js`
   (`DIALOGUE_ES` / `DIALOGUE_PT` + name maps); the Language Book selects `en/es/pt`.
9. **Mood → name-tag glitch aesthetic** — colored/obfuscated (`§k`) tags per mood,
   roam/night trees for `wandering_trader`.

Do NOT need engine edits for any of the above. Only touch CORE if adding a genuinely
new *situation detector* or *choice-effect type* — then wire it once in CORE so all five
CORE packs benefit.

---

## 5. What is MURMUR Animal Core?

**A separate, ultra-lightweight engine built only for farm animals.** Zero-lag immersion,
no RPG layer.

- **File:** `MURMUR - ANIMAL CORE/` — entry `scripts/main.js`, UUID
  `a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6e`, v1.0.19. Depends only on
  `@minecraft/server` (no `server-ui`).
- **Bridge:** `murmur_animal:data` (different namespace from CORE's `murmur:data` —
  the two engines cannot hear each other). Store: `globalThis.MURMUR_ANIMAL_DATA`.
- **Gatekeeper:** `api.js registerContent` **rejects non-animals** — only typeIds containing
  `chicken/cow/sheep/pig/rabbit/llama/horse/donkey/mule/mooshroom` register; anything
  else logs `Non-animal type … blocked`.
- **Loop:** 3 entities per tick, **7-block** player radius (vs CORE's 24),
  **30 s** per-entity cooldown (vs 15 s), ~10 % fire chance. Detectors: sneaking,
  jumping, `holding_weapon` / `holding_useful` (30 % spot chance), jukebox/wealth
  (rare tick), night/rain/wounded/death fallback to `proximity`. Auto-names from the
  pack's name lists. No quests, no trading, no reputation HUD, no dialogue trees,
  no steward/vault/commerce.
- **Output style:** third-person narrative action text (`*grazes peacefully*`,
  `*tilts its head at your suspicious movement*`), not first-person speech.

---

## 6. What is MURMUR Animal Pack?

**The only content pack for Animal Core.** Playful, observant, silent-judgment animals.

- **File:** `MURMUR - ANIMAL PACK/` — entry `scripts/register.js`, v1.0.22.
- **Coverage:** 6 authored profiles — `chicken`, `cow`, `sheep`, `pig`, `horse`, `llama` —
  with `mule`/`donkey` reusing horse lines and `trader_llama` reusing llama lines
  (9 registered typeIds total). `en_US` + `es_ES`/`pt_BR` overlays.
- **Conditions per animal:** `proximity`, `sneaking`, `jumping`, `wealth`, `jukebox`,
  `rain`, `night`, `wounded`, `death` (plus core-side `holding_weapon`/`holding_useful`).
  Example: `*Cow sweat-drops nervously*` on sword, `*Sheep watches you fall in disappointment*`.
- **Planned expansions** (`UPDATE_PLANNED_AND_ACHIEVED.md §4`): more action-text reactions,
  a light "bond" (chicken-bring-seeds → affection pool), weather/dawn/dusk/eating palette,
  herd-level pack awareness, affection/`companion` bond lines, squared-distance +
  cached-location perf ports. Still **no quests/trees/commerce** by design.

---

## 7. Compatibility: animals always prioritize the animal stack

Both stacks **may now run in the same world**. The rule is enforced in code, not by
honor system: **when ANIMAL CORE is installed, farm animals always prioritize
ANIMAL CORE + ANIMAL PACK over any MURMUR CORE content pack** (Uncanny, Praise, …).
CORE-only worlds are unaffected — Uncanny's pig lament still plays when no animal
stack is present.

### 7.1 How the yield works (contract)

Script runtimes are **isolated per behavior pack** (`globalThis` is not shared), so
presence travels through shared world state:

- ANIMAL CORE publishes a beacon from `MURMUR - ANIMAL CORE/scripts/api.js`
  (`publishAnimalBeacon()`, on load + every 200 ticks + on player spawn):
  - world DP `murmur_animal:core_present` = last beacon tick,
  - world DP `murmur_animal:claims` = JSON array of claimed typeIds,
  - scriptevent `murmur_animal:beacon` = same JSON (instant path).
- MURMUR CORE reads it in `MURMUR - CORE/scripts/animal_priority.js`:
  `isAnimalCoreActive()` (beacon or DP fresher than 1200 ticks),
  `getAnimalClaims()`, and the single predicate every system consults:
  **`shouldCoreYield(typeId)`** = farm animal AND animal core active AND claimed.
- Exact claimed list (both sides mirror it):
  `chicken`, `cow`, `sheep`, `pig`, `rabbit`, `llama`, `trader_llama`, `horse`,
  `donkey`, `mule`, `mooshroom` (all `minecraft:`-namespaced).

### 7.2 What CORE yields (farm animals only, only while the beacon is fresh)

- **Ambient chatter** (`main.js` tick loop) — skipped.
- **Naming** (`entitySpawn` namer + `ensureNameTag` in `utils.js`) — untouched, so
  nameTags never flicker between the two cores' name pools.
- **Hurt lines** (`entityHurt`) and **death/witness lines** (`entityDie`, victims and
  witnesses) — skipped; the animal stack voices them instead.
- **Dialogue trees + interaction hub** (`dialogue_tree.js` `openTree` + interact
  handler) — refused/passthrough, so right-click on a cow keeps vanilla behavior
  instead of opening an Uncanny tree. The Tome/`murmur:talk` path yields the same way.
- **Registration kept, not dropped** (`api.js`) — farm-animal profiles still register
  (log notes `yields to ANIMAL CORE … / currently shadowed`), so removing the animal
  stack resumes CORE voices with no reinstall.
- **Commerce** — still allowed (operator opt-in, no default animal catalogs), but
  `murmur:shop stock` on a yielded type warns that the stock only applies while
  ANIMAL CORE is absent.
- **Status** — `/scriptevent murmur:status` reports `Animal priority: ACTIVE/…` or `idle`.

### 7.3 Deliberately NOT shared

- Bridges stay separate (`murmur:data/tree/diag/resend` vs `murmur_animal:data` + beacon),
  stores stay separate (`MURMUR_DATA` vs `MURMUR_ANIMAL_DATA`), cooldown maps, chunk
  buffers and `CHUNK_SIZE`/`PER_TICK` tuning stay per-engine.
- Animal Core intentionally has **no** quests/trees/commerce/rep/steward/vault — do not
  port them over; that would destroy its zero-lag promise and re-create the conflict
  this contract removes.

### 7.4 Two bugs this contract fixed — do not reintroduce

1. **Animal gatekeeper substring match** (`ANIMAL CORE/scripts/api.js`): the old
   `typeId.includes("pig")` check also matched **piglin/piglin_brute/hoglin/zoglin/
   zombified_piglin** and would have handed Nether content to the animal stack.
   Now exact-match against `ANIMAL_CLAIM_TYPES`. Keep it exact.
2. **Animal Pack manifest dependency**: it declared the **MURMUR CORE UUID**
   (`7f9a1b2c-…`) instead of the Animal Core UUID (`a1b2c3d4-…`). Fixed to depend on
   Animal Core. Keep it pointed there.

### 7.5 Remaining rules for pack authors

- Still run **only ONE CORE story pack at a time** (Uncanny vs Cruel vs … never combine).
- `wolf` stays a CORE/Uncanny type — the animal stack cannot serve it, so CORE never
  yields it. Likewise piglins/hoglins stay CORE-only (see 7.4.1).
- Never register `cow/sheep/chicken/horse/llama` dialogue in a CORE pack expecting it to
  win over the animal stack — it will be shadowed while Animal Core is present (by design).
- Never send sentient/monster profiles to `murmur_animal:data` — still blocked.
- Test matrix: CORE-only world (Uncanny pig talks) → add animal stack (pig switches to
  `*action*` voice, `/scriptevent murmur:status` shows ACTIVE, no double chat, stable
  nameTags) → remove animal stack + reload (CORE pig voice returns once the beacon goes
  stale, ~60 s).

**TL;DR:** Uncanny = eldritch sentients on MURMUR CORE. Animals = playful livestock on
Animal Core. Both stacks can coexist because CORE demonstrably stands down for the
11 claimed farm types whenever it hears the animal beacon — animals always win.

---

*Generated from the repo state on disk: `MURMUR_GUIDE.md`, `ANALYSIS.md`,
`brainstorm_roadmap.md`, `PATCH_NOTES.md`, `UPDATE_PLANNED_AND_ACHIEVED.md`,
plus `MURMUR - CORE|UNCANNY|ANIMAL CORE|ANIMAL PACK` manifests and `scripts/`.*
