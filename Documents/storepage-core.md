# MURMUR Core

## Short Summary
The modular dialogue engine that powers all MURMUR content packs. Install this first — it does nothing on its own.

---

## Description

**MURMUR Core** is the universal scripting engine that drives ambient mob dialogue across the entire MURMUR ecosystem. It handles all the heavy lifting:

- **Proximity Detection** — Monitors nearby players and triggers situational dialogue based on context.
- **Environmental Awareness** — Reacts to rain, thunder, night, fire, nether/overworld transitions, and more.
- **Threat Detection** — Distinguishes between zombie attacks, illager raids, and player aggression, and picks the right lines.
- **Peer Reactions** — Nearby mobs react when a squad member gets hurt or dies.
- **Cross-Pack Bus** — Listens for dialogue data from any installed content pack and loads it dynamically. One engine, infinite themes.
- **Contextual Placeholders** — Supports `{item}`, `{health}`, `{name}`, `{hurt_name}`, and `{dead_name}` tokens for hyper-targeted chatter.
- **Performance Optimized** — Uses a rolling entity iterator (3 entities/tick), cooldown maps, and automatic garbage collection to stay lean.

MURMUR Core supports: `minecraft:villager_v2`, `minecraft:pillager`, `minecraft:vindicator`, `minecraft:evoker`, `minecraft:witch`, `minecraft:piglin`, `minecraft:piglin_brute`, `minecraft:blaze`, `minecraft:enderman`, `minecraft:iron_golem`, `minecraft:wandering_trader`, and `minecraft:skeleton`.

---

## ⚠️ Warnings & Clarifications

- **This pack does nothing by itself.** You must install at least one content pack (Cruel, Medieval, or Uncanny) alongside it.
- **Enable Beta APIs** in your world settings (`Experiments > Beta APIs`). MURMUR uses the GameTest/Scripting API.
- **Only one content pack at a time** is recommended. Running multiple content packs simultaneously may cause mobs to use blended dialogue styles.
- **Requires Minecraft Bedrock 1.21.0+**
- **Load order**: Install MURMUR Core first, then any content pack as an add-on above it.
