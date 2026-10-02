# brainstorm_roadmap.md — What MURMUR Can Borrow, and Where To Go Next

Derived from the audit in `ANALYSIS.md`. Organized as: **Brainstorm (raw ideas)** → **Prioritized Roadmap** → **Concrete Specs for near-term wins**.

---

## Part A — Brainstorm: features from the reference mods that fit MURMUR

MURMUR's identity: *modular ambient dialogue engine* where packs register situational lines + names per `typeId` via a chunked bridge, with a language-book UI. The reference mods are treasure-troves of **systems layered on top of dialogue** — not replacements for MURMUR's core, but extensions.

### 1. Relationship / affinity layer (from `bp/ai_social_memory`, Echoes `ai_affinity_listener`)
- Store per-entity-per-player affinity in a DP (`murmur:aff_<entityId>_<playerId>`), with `LOVE`/`NEUTRAL`/`HATE` bands.
- Lines shift by band: a villager you've protected greets you warmly; one you've hit is cold/hostile.
- Decays passively; grows on gifts/interactions. Scoreboard or DP Map both viable.
- **Why it fits:** MURMUR already has `{name}`/`{health}` placeholders; an `{affinity}` token + band-gated line pools is a natural extension.

### 2. Reputation / honor HUD (from LivingVillagers `q2:rep`)
- Per-village (or per-faction) reputation shown via `setActionBar`.
- Gates which dialogue trees/branches are offered (e.g., pillagers only parley if rep is high enough).
- **Why it fits:** gives the new Dialogue Tree real *consequence* beyond flavor.

### 3. Moods → colored name tags (from VillageFolk `moods.js`)
- `MOODS` map (symbol + color + label); name tag = `profColor + name \n moodSymbol + moodLabel`.
- MURMUR's `sendCleanChat` already colors by type — extend to mood + uncanny "glitch" states.
- **Why it fits:** cheap visual payoff; reinforces the UNCANNY aesthetic.

### 4. Weighted situational picker (from VillageFolk `gossipWeights`)
- Instead of flat `Math.random() < 0.4` ambient chance, weight situations: proximity 60 / rain 20 / night 15 / wounded 5.
- Makes chatter feel intentional, not noisy.
- **Why it fits:** already partially done in `main.js`; formalize the weights.

### 5. SpatialHash proximity scan (from Flatworld, `bp`)
- Partition loaded entities into 128-block cells; only scan the player's cell + neighbors.
- Slashes cost of the "nearby count / seen animal / block awareness" scans in `main.js`.
- **Why it fits:** MURMUR's loop already iterates all loaded entities each reset — this is the scalable fix.

### 6. Chunked bridge → durable DP (from Flatworld `saveChunkedProp`)
- Persist reassembled `murmur:data` chunks into a world dynamic property so packs survive reload without re-sending.
- **Why it fits:** currently the bridge is in-memory only; a reload wipes all packs until they re-register.

### 7. Quest / objective hooks (from OdysseyNPCs `quest.js`, LivingVillagers)
- Dialogue-tree choices could start a `collect`/`kill`/`goto` quest; turn-in grants items + rep.
- **Why it fits:** turns the Dialogue Tree from flavor into gameplay; the `action` field already exists in MURMUR tree nodes.

### 8. Functional companion NPCs (from `bp` friend system, Echoes)
- A "befriended" mob follows / helps; affinity unlocks a `companion` line pool.
- **Why it fits:** MURMUR already has FACTIONS; a `companion` faction is a small step.

### 9. Emote + social HUD (from RR Chat Emotes, `rp` icons)
- `beforeEvents.itemUse` on a book opens an emote/social menu; HUD icons for online/party.
- **Why it fits:** MURMUR already ships the Language Book + new Dialogue Tome; a "Social Codex" book is consistent.

### 10. Native `npc_dialogue` fallback (from `dialogue template.mcaddon`)
- For packs that don't want scripts, ship `minecraft:npc_dialogue` scenes with `buttons[].commands`.
- **Why it fits:** zero-code branching for simple packs; MURMUR stays the scripted "smart" option.

### 11. Trade / loot economy (from GuardVillager5 `Trade/Villager.json`)
- Dialogue-tree choices could open a trade screen or drop a loot table.
- **Why it fits:** the `action` field can already `give @p`; a trade table is the structured version.

### 12. Multi-language `texts/*.lang` shipping (from `rp`)
- Move MURMUR's `TRANSLATIONS` to a real RP `texts/*.lang` + `languages.json` so the game's own language selector drives it.
- **Why it fits:** more robust than the in-book toggle; keeps the book as a manual override.

---

## Part B — Prioritized Roadmap

### Phase 1 — Stability & Polish (do now)
- [x] **Fix trailing-space key bug** (done in `api.js` `trimKeys`).
- [x] **Interactive Dialogue Tree UI** (done: `dialogue_tree.js`, themed, double-open guarded, Tome + `/scriptevent murmur:talk`).
- [x] **Ambient chatter toggle** (`/scriptevent murmur:chatter on|off`).
- [ ] Cache `player.location`/`entity.location` once per loop; switch proximity scans to squared-distance.
- [ ] Persist reassembled chunks into a world DP for reload survival.
- [ ] Feature-detect `scriptEventReceive`; if absent, fall back to a `/function` or in-game registration ModalForm.

### Phase 2 — Depth (next)
- [ ] Weighted situational picker (formalize `gossipWeights`-style table).
- [ ] Moods → colored/glitched name tags.
- [ ] SpatialHash proximity scan.
- [ ] Per-player affinity bands + `{affinity}` placeholder + band-gated line pools.
- [ ] Dialogue-tree `action` upgrades: open trade screen, start a quest, set a flag.

### Phase 3 — Ecosystem (later)
- [ ] Per-village/faction reputation HUD gating tree branches.
- [ ] Companion faction (befriend a mob; unlocks `companion` lines + follow behavior).
- [ ] "Social Codex" book (emotes + relationship panel).
- [ ] Ship `texts/*.lang` + `languages.json` for native i18n; keep book as override.
- [ ] Native `npc_dialogue` scene exporter for zero-code content packs.
- [ ] Quest system (`collect`/`kill`/`goto`) wired to tree choices.

---

## Part C — Concrete near-term specs

### C1. Durable registry (Phase 1)
Reassemble `murmur:data` / `murmur:tree` chunks into `world.setDynamicProperty("murmur:reg:"+typeId, JSON)`.
On boot, `api.js` reads these DPs and re-hydrates `MURMUR_DATA` before packs re-send. Packs still re-send to allow updates.

### C2. Dialogue Tree node schema (already implemented)
```
{ start: "nodeId",
  nodes: { nodeId: {
      text, end?, speaker?,
      choices: [ { label, goto, action? } ]   // goto:"__end__" closes
  } } }
```
`action` runs as a dimension command with `{player}`/`{name}` resolved. Theming auto-derived from `typeId` (villager=green, illager=red, witch=purple, golem=dark-green, trader=aqua, enderman=magenta, skeleton=white, nether=crimson).

### C3. Affinity band model (Phase 2)
```
DP: murmur:aff_<entityId>_<playerId>  ∈ [-100,100]
bands: HATE < -30, NEUTRAL, LOVE > 30
line pool switch: DIALOGUE[typeId][cond] -> DIALOGUE[typeId][cond+"_love"|"_hate"] if present
```
Token `{affinity}` → "friend"/"stranger"/"foe".

### C4. Weighted picker (Phase 2)
```
SITUATION_WEIGHTS = { proximity:.6, rain:.15, night:.12, wounded:.07, thunder:.06 }
pick a *category* by weight, then a line within it (falls back to proximity).
```

---

## Wild ideas (parked, maybe someday)
- **"Director mode":** a hidden MURMUR entity that orchestrates group scenes (villagers gossiping, raid banter) using the existing `FACTIONS` + witness engine.
- **Whisper network:** lines spoken near one villager propagate to others in the cell (SpatialHash) after a delay — emergent rumor mill.
- **Glitch events:** rare UNCANNY lines that briefly corrupt the speaker's name tag with `§k` obfuscation, then self-heal.
- **Cross-pack crossovers:** a CORE "event bus" so the NOIR/CRUEL/MEDIEVAL packs can react to the same death/witness events with their own tone.

---

*Brainstorm produced alongside `ANALYSIS.md` and the CORE + UNCANNY improvements.*
