# MURMUR — Player Guide (Full Mod Usage)

Everything MURMUR does and how to use it while you play. This guide covers the
engine features shared by every MURMUR content pack, the per-pack themes, every
in-game command, and troubleshooting.

> Last updated against: **MURMUR Core v1.0.42**, MURMUR Uncanny v1.1.54, Cruel v1.1.36, Medieval v1.1.35, NOIR v1.1.37, Praise v1.1.36, Animal Core v1.0.20, Animal Pack v1.0.22.

---

## 1. What MURMUR is

MURMUR turns Minecraft's mobs into talking characters with **mood, memory, and
relationships**. At its heart it is an "ambient chatter" engine — creatures
speak to you as you pass by, react to what you're holding or doing, and mourn
their fallen. On top of that sits an **NPC roleplay layer**: you can talk back,
build reputation, take on quests, and even trade.

Two different engines ship in the family:

- **MURMUR CORE** — the full-featured engine (dialogue trees, reputation,
  quests, commerce, language book, Dialogue Tome, stewardship, vault). Requires
  a **content pack** and drives: **Uncanny, Cruel, Medieval, NOIR, Praise**.
- **MURMUR ANIMAL CORE** — a lighter, dedicated engine for the **Animal Pack**
  (animal greetings, moods, relationship flavor only — no quests/trading).

---

## 2. Which packs go together

Pick **ONE** MURMUR story pack + its core. Do **not** run two MURMUR content
packs together — they are not designed to cross-combine.

| Story pack | Core engine | Theme / flavor |
|---|---|---|
| **Uncanny** | MURMUR CORE | Eldritch, psionic, unsettling. Endermen & evokers talk in geometry/phase-space; pigs lament. The default showcase pack. |
| **Cruel** | MURMUR CORE | Hostile abuse. Mobs "roast" you; talking to a hostile mob is a gauntlet of insults. |
| **Medieval** | MURMUR CORE | Dark-fantasy archaic dread. Guards, blacksmiths, lords; kingdom/fealty quests. |
| **NOIR** | MURMUR CORE | Hardboiled detective moods; cynical inner monologue; "case" quest-chains. |
| **Praise** | MURMUR CORE | Cosmic cultist devotion. You are a terrifying Creator; creatures worship or despair. |
| **Animal Pack** | MURMUR ANIMAL CORE | Playful/observant animals with affection & bonds. |

**Rules of thumb**
- One story pack + one CORE. Uninstall any other MURMUR story pack you have.
- Animal Pack uses ANIMAL CORE, *not* MURMUR CORE.
- Keep the resource pack from your chosen pack installed too (text only; this
  guide focuses on gameplay behavior, which lives in the behavior packs).

---

## 3. Installation (quick)

1. Install **both** the chosen content pack's `.mcaddon`/`.mcpack` AND its CORE
   (for Uncanny/Cruel/Medieval/NOIR/Praise that is **MURMUR CORE**; for animals,
   **MURMUR Animal Core**).
2. For a single-player world (or a Realm/Server running the packs):
   - **World settings:** turn on **Holiday Creator Features / Beta APIs**
     (Experimental) OR the specific APIs the pack flags request. MURMUR relies
     on these; without them mobs will stay silent.
   - Add the packs to the world's **Behavior Packs** and **Resource Packs** tabs.
3. Leave **Cheats / Allow Cheats** ON if you want the admin commands (`/scriptevent`)
   and the advanced systems (shop stocking, vault, stewardship) to work.
4. Join the world. You should immediately be given two books:
   - **Language Settings** book (choose English / Español / Português).
   - **Dialogue Tome** (talk to any creature by looking at it).

---

## 4. The everyday loop (what you'll actually do)

### 4.1 Theme and language
- Right-click your **Language Settings** book to pick your language. This drives
  which dialogue lines load (English / Español / Português). It is given on
  first spawn; craft another with 1 dirt + a crafting table, or `/scriptevent murmur:give_book`.
- Every new player also gets a **Dialogue Tome** — hold it, look at a creature,
  and right-click to open its dialogue tree.

### 4.2 Ambient chatter (just standing around)
Mobs talk on their own as you get close. They have situational moods, chosen
automatically:

- **Proximity** — generic lines when you're near.
- **Weapon / tool awareness** — holding a sword or axe changes what they say.
- **Spyglass / clock / map** — "holding something useful."
- **Armor / weak** — full netherite vs. no armor changes reactions.
- **Day / night / rain / thunder / wounded / on fire** — environmental moods.
- **Alone vs. crowded** — a lone mob is different from a group.
- **Boat / jukebox / wealth** (emerald blocks nearby) — environmental triggers.
- **Seen animal** — occasional reaction to other creatures nearby.
- **Reputation greetings** — a friend greets you warmly; a foe scolds you.

### 4.3 Talking back (the roleplay layer)
- **Empty-hand right-click** a creature to start a **dialogue tree** (a menu of
  responses). Hostile mobs are reached via the Dialogue Tome so you don't
  accidentally trade blows.
- Some choices have **consequences**: change tags, adjust reputation, hand or
  take items, start/turn in quests, or run a command.
- Some choices are **gated**: they only appear if you hold the right item, meet
  a reputation threshold, or carry a flag — otherwise the option is hidden.

### 4.4 Reputation & the HUD
Every friendly sentient remembers you individually.
- The **Reputation HUD** (on by default) shows your standing with the mob you're
  looking at in the action bar, e.g. `Villager — Liked (+12)`.
- Standing climbs by helping (completing quests, kind choices) and drops by
  hurting (killing a villager the mob witnessed/feared).
- Status bands (in English): **Hated (≤-30)** → **Disliked (≤-10)** →
  **Neutral** → **Liked (≥10)** → **Revered (≥30)**.
- Sneak near a friendly mob to get a one-line card of its current mood and any
  remembered grudge (e.g. *"Still angry you hurt X"*).

### 4.5 Quests
Friendly NPCs hand out errands through their dialogue tree.
- Accept a task → it appears in your **journal** (`/scriptevent murmur:quest journal`).
- **Kill / collect** objectives auto-complete as you play.
- **Goto** objectives auto-complete when you reach the marked spot.
- Many errands are **timed** — the journal shows `3d left` / `due today!`.
  Talk to the giver (or open the journal) after the deadline and the task
  **fails**: standing drops (−15 unless stated) and the NPC *will* bring it up
  next time you chat. Apologize to clear the air and earn the errand back.
- Return to the giver and pick the "hand over" choice to **turn in** for
  items + reputation. Fetch turn-ins often grant a **hero's glow**
  (`hero_of_the_village`): discounted trades for a few minutes — trade fast,
  and expect commentary when it wears off.
- Turn-in checks your bag: if your reward can't fit, it politely refuses until
  you clear a slot — **nothing is lost**.
- You can hold up to **3 active tasks**; drop any with
  `/scriptevent murmur:quest abandon <id>`.

### 4.6 Trading (commerce)
Some creatures are merchants with a **stock** of offers (`X of item A` for
`Y of item B`).
- Right-click a merchant and choose **Trade** to see its stock and buy.
- Purchases are **atomic**: MURMUR checks you can afford it *and* carry it, then
  deducts the price and hands over the goods. If the trade can't complete, it
  rolls back — you never lose anything.
- Merchants are stocked by an operator (see §6). If nobody has stocked a merchant
  yet, it simply has nothing to sell and only the **Speak** option appears.

### 4.7 The Interaction Hub
When a creature backs several systems (dialogue **and** trade **and** open
quests), right-click opens a small chooser: **Speak / Trade / My tasks**. When it
backs exactly one, MURMUR goes straight to that screen. If it backs none, vanilla
behavior is untouched.

---

## 5. Package-by-package themes

- **Uncanny** — 14 dialogue trees (pillager, witch, iron golem, wandering
  trader, enderman, skeleton, piglin, wither skeleton, blaze, vindicator, wolf,
  evoker, piglin brute, + a villager) with an eldritch tone and **timed fetch
  quests** (villager wheat/potato, pillager tithe, witch sugar, golem mend, trader
  leather, enderman dirt, wolf bones, **plus a 12-profession fetch board with 33
  quests** — farmer, fletcher, librarian, cleric, cartographer, smith, shepherd,
  fisherman, butcher, leatherworker, mason, nitwit) with trade-discount rewards,
  expiry shaming, and reputation wired through every chat.
- **Cruel** — every friendly tree is an insult gauntlet; rep-based roasts escalate
  as you hurt or help.
- **Medieval** — archaic dread; guards/blacksmiths/lords; kingdom fealty quests
  gated by standing.
- **NOIR** — "case" investigation quest-chains; cynical voice-overs; HUD reads
  like a case file.
- **Praise** — you are the Creator; devotional trees, "sacrament" offering quests,
  and rep bands from Revered to Unnameable.
- **Animal Pack** — playful/observant animals with a lighter affection + bond
  system (Animal Core engine; no quests/trading).

---

## 6. Admin & operator tools

Some MURMUR commands are **operator-gated** (need the shield / cheats, or
steward/operator rights). Get rights via **Stewardship** (below).

### 6.1 Stewardship
Control who can run privileged MURMUR commands on a shared server.

```
/scriptevent murmur:steward                     # first caller claims this world
/scriptevent murmur:steward list                # show steward + operators + mode
/scriptevent murmur:steward op <player>         # steward grants a permit
/scriptevent murmur:steward deop <player>       # steward revokes a permit
/scriptevent murmur:steward mode <survival|creative|adventure>   # set world mode
```

The first player to claim becomes the **steward** and gets the `murmur:admin`
tag. The steward can grant/revoke operator permits. Only permitted players can
stock merchants or run vault restores.

> Tip: on a private/single-player world, just run `murmur:steward` once to claim it.

### 6.2 Stocking merchants (commerce)
```
/scriptevent murmur:shop stock <entityTypeId> <sellId> <sellAmt> <askId> <askAmt>
/scriptevent murmur:shop clear <entityTypeId>
```

Examples:
```
/scriptevent murmur:shop stock minecraft:villager_v2 minecraft:iron_ingot 2 minecraft:emerald 1
/scriptevent murmur:shop stock minecraft:witch minecraft:swiftness_potion 1 minecraft:emerald 3
/scriptevent murmur:shop clear minecraft:witch
```

Once any offer exists for a creature type, that creature becomes a merchant and
the **Trade** option appears in its interaction hub.

### 6.3 Vault (crash recovery)
MURMUR keeps its durable state (quests, reputation, merchant stock) in sharded
world dynamic-properties. The vault keeps a checksummed mirror and can restore it.

```
/scriptevent murmur:vault backup      # force a snapshot of all persisted state
/scriptevent murmur:vault audit       # check + auto-restore any corrupted shard
```

`audit` requires steward/operator rights. Backups run automatically on a timer;
you only need `backup`/`audit` if something looks inconsistent.

---

## 7. Full command reference

All MURMUR console-style commands use `/scriptevent`. In chat type
`/scriptevent murmur:<id> <arg>`.

| Command | Feature | Effect |
|---|---|---|
| `murmur:lang en` / `es` / `pt` | Language | Set the dialogue language (shortcut). |
| `murmur:chatter on` / `off` | Ambient chatter | Toggle ambient mob talk (default on). |
| `murmur:sound on` / `off` | Talk sounds | Toggle the mob "talk" sound effect. |
| `murmur:rep on` / `off` | Reputation HUD | Toggle the action-bar standing HUD (default on). |
| `murmur:quest journal` | Quest log | List your active + completed tasks. |
| `murmur:quest abandon <id>` | Quest log | Drop an active task. |
| `murmur:quest prune` | Quest log | Flush the in-memory quest cache (re-reads save). |
| `murmur:give_book` | Language book | Give yourself a Language Settings book. |
| `murmur:talk` | Talk | Open a dialogue tree for the creature you're looking at (operator convenience). |
| `murmur:status` | Debug | Print engine status: registered types, trees, factions, languages, systems. |
| `murmur:validate` | Dev tool | Run the schema validator over registered content; surfaces broken trees/choices. |
| `murmur:steward [list\|op <n>\|deop <n>\|mode <m>]` | Admin | Stewardship / operator management (see §6.1). |
| `murmur:shop stock <t> <s> <sa> <a> <aa>` | Commerce | Add a sell offer to a creature type (operator). |
| `murmur:shop clear <t>` | Commerce | Wipe a creature type's catalog (operator). |
| `murmur:vault backup` / `audit` | Recovery | Snapshot / check-and-restore persisted state (audit operator-only). |

### In-world items & behaviors
- **Language Settings book** — right-click to pick language. Given on first
  spawn; craft with 1 dirt + a crafting table; or `/scriptevent murmur:give_book`.
- **Dialogue Tome** — look at a creature, right-click to open its tree. Given on
  first spawn.
- **Sneak near a friendly** — one-line mood + grudge readout.
- **Empty-hand right-click a creature** — opens the interaction hub / dialogue tree.

---

## 8. Troubleshooting

| Symptom | Likely cause | Fix |
|---|---|---|
| Mobs are totally silent | Experimental / Beta APIs not enabled in the world | Enable Experimental settings, or recreate the world with them on. |
| Pack won't load / "REQUIRED PACK" spam | You have the wrong core (Animal Pack using MURMUR CORE, or no core) | Match the story pack to the correct CORE (see §2). |
| Two packs fighting / moans not matching | Two MURMUR story packs installed at once | Keep only one story pack + its CORE. |
| No "Trade" option on a merchant | That creature type has no stocked offers | Have an operator run `murmur:shop stock ...` with cheats on. |
| Admin commands do nothing | Cheats / Allow Cheats off, or you're not steward/operator | Turn cheats on; claim with `murmur:steward`. |
| Language stays English | Pack lacks translations for the chosen language | The pack supports en/es/pt; check you picked a supported one. |
| Progress vanished after a crash | A dynamic-property shard got clobbered | Operator runs `/scriptevent murmur:vault audit` to restore. |

---

## 9. Verification / notes for creators

- **Schema checking:** `/scriptevent murmur:validate` reports malformed trees,
  dangling `goto`s, and bad `requires` blocks across all registered content —
  handy when authoring content packs.
- **Consequences live on choices, not nodes.** `setTags` / `giveItem` / `takeItem` /
  `repDelta` / `startQuest` / `turnIn` / `addEffect` / legacy `action` are only read
  from **choice** objects — the same keys on a node are silently ignored.
- **Timed quests:** `startQuest` takes `deadlineDays` (+ optional `failRep`, default
  −15). Expiry is checked on dialogue open and journal read; it sets the player tag
  `murmur:failed:<questId>` for shame-branch routing (`requires: { tag: ... }`) and
  clears on re-accept. Other `requires` keys: `quest` / `notQuest`, `effect` /
  `notEffect` (e.g. `hero_of_the_village`). `addEffect: { id, duration, amplifier? }`
  grants status effects from a choice.
- **No resource-pack changes are required** for these gameplay systems (they are
  all behavior-pack scripting).
- All engine systems run on the standard Bedrock scripting APIs
  (`@minecraft/server` v1.11, `@minecraft/server-ui` v1.3).
