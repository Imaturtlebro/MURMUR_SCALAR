// --- MURMUR MOJAVE — Wasteland Chatter Pack ---
//
// Fallout-New-Vegas-flavoured ambient/reactive dialogue for vanilla Minecraft mobs.
// Original writing. No direct quotes from any commercial game.
//
// SPEAKING ROSTER (deliberately narrow):
//   Settlers, Iron Golem, Pillagers, Vindicators, Evokers, Skeletons, Strays,
//   Bogged, Wither Skeletons, Blazes, Wandering Trader, Witch.
// SILENT BY DESIGN: animals, zombies, drowned, husks, zombies-villagers, spiders,
//   creepers, slimes, endermen, piglins. A mob absent from DIALOGUE never speaks.
// -----------------------------------------------------------------------------

// --- RANDOM NAME POOLS ---
// Wasteland handles: prospectors, caravan hands, raider names, unit designations.
// Avoid player-plausible names so villagers addressing you never read as a villager.

export const VILLAGER_NAMES = [
  "Dusty ", "Cobble ", "Tumble ", "Scraps ", "Kestrel ", "Coyote ", "Jackdaw ", "Mesa ",
  "Rattler ", "Cinder ", "Flint ", "Mirage ", "Sagebrush ", "Sable ", "Dingo ", "Wren ",
  "Cactus ", "Vulture ", "Prospect ", "Slag ", "Hollow ", "Anvil ", "Drifter ", "Talon "
];

export const GOLEM_NAMES = [
  "SENTRY-01", "SENTRY-02", "SENTRY-07", "WARDEN-A", "WARDEN-C", "BULWARK-3", "BULWARK-9",
  "IRONCLAD", "RODEO", "SANDSTORM", "IRONWIND", "GOLIATH", "ANVIL-UNIT", "PALLASADE",
  "CITADEL-4", "OBELISK"
];

export const PILLAGER_NAMES = [
  "Ashjaw ", "Cinder ", "Duskfang ", "Krask ", "Mudclaw ", "Ravager ", "Skarskin ", "Thornhand ",
  "Vulture ", "Wrath ", "Gnash ", "Hollowmark ", "Bitter ", "Redvow ", "Scrapper ", "Thinblade "
];

export const WITHER_NAMES = [
  "Graveward ", "Charbone ", "Hollowtine ", "Pyre ", "Cinder ", "Ossuary ", "Blackpine ", "Ashfall ",
  "Ironmourn ", "Grimtoll ", "Saltbone ", "Longdark "
];

export const SKELETON_NAMES = [
  "Longshot ", "Reed ", "Kestrel ", "Palejack ", "Dustmark ", "Bonesight ", "Quicksilver ", "Ridgeback ",
  "Vulture ", "Silvershot ", "Cinch ", "Hollowpoint "
];

export const COLD_NAMES = [
  "Frostline ", "Rime ", "Coldread ", "Snowmelt ", "Winterbite ", "Greyhail ", "Icevein ", "Stillfrost ",
  "Longnight ", "Palefrost "
];

export const WITCH_NAMES = [
  "Doctor Vex ", "Madame Ruin ", "Alchemist Sallow ", "The Radiant ", "Chempstr ", "Madame Cinder ",
  "Doctor Blight ", "The Aetherist ", "Serum ", "Hex ", "Bile ", "Nurse Rot "
];

export const TRADER_NAMES = [
  "Slick ", "Mulefoot ", "Drover ", "Bolt ", "Chandler ", "Peddler ", "Fairweather ", "Tally ",
  "Haggle ", "Coffin ", "Mirage-Trade ", "Quickhands "
];

export const MONSTER_NAMES = [
  "Cinderbrand ", "Emberkin ", "Sear ", "Pyrogate ", "Cinder ", "Scorch ", "Overpressure ", "Coalheart "
];

// Piglins are transactional — gold is the only language. Brutes answer slower.
export const PIGLIN_NAMES = [
  "Rustfang ", "Goldtooth ", "Dusthoof ", "Embermuzzle ", "Cinderpaw ", "Slagmaw ", "Ashmouth ",
  "Quartzhand ", "Scrapmonger ", "Redgilt ", "Cinnabar ", "Sootcloak ", "Tallowhide ", "Brightbar "
];

export const PIGLIN_BRUTE_NAMES = [
  "GOLD-TOOTH", "BULWARK", "ANVIL-JAW", "CINDER-HEAD", "REDGILT", "SLAG-HAND", "GATEWARDEN", "HUNGER"
];

// Endermen barely talk. When they do it lands like something moved in the dark.
export const ENDERMAN_NAMES = [
  "...", "tall", "the tall one", "wrong shape", "it moved", "not here", "watching",
  "borrowed", "the dark half", "no shadow"
];

// -----------------------------------------------------------------------------
// DIALOGUE
// Keys are the "condition" slots MURMUR CORE reads from a mob's profile.
// Every string is one ambient line. Supported tokens:
//   {name} {item} {health} {hurt_name} {dead_name}
// -----------------------------------------------------------------------------

export const DIALOGUE = {

  // ══════════════════════════════════════════════════════════════════════════
  // SETTLER — villager_v2 / villager
  // Exhausted, sun-bitten, mercantile, quietly hopeful. Sells you water and
  // complains about the price of everything.
  // ══════════════════════════════════════════════════════════════════════════
  "minecraft:villager_v2": {
    proximity: [
      "Patrolling all that dead ground almost makes you wish for a rainstorm. ",
      "Traded four emeralds for a bucket of murky water. Routes are getting worse. ",
      "Keep that weapon holstered in the square. We don't need trouble. ",
      "You hear about the town up north? Wiped out by one Creeper. Tragic. ",
      "Water is worth more than diamonds out here and nobody tells you that. ",
      "Sun's been chewing at my shadow for three days straight. ",
      "I've got a batch of leather and no buyer. Wrote my own sign. Nobody reads signs. ",
      "Prospecting! Sounds noble till you count your fingers after. ",
      "My well went dry. I keep lowering the bucket anyway. Habits. ",
      "Say, you look like you've got a working canteen. Don't suppose there's water in it. ",
      "The road east is fine for about a day. Then it isn't. ",
      "Sold my last good jacket to a man who paid in bottles. ",
      "Every caravan that comes through is thinner than the last. ",
      "I keep the shutters nailed shut. Not because of the wind. ",
      "Found a glass bottle with a paper note in it. Just the word HELP. Twice. ",
      "You ever notice the horizon shimmers like that? Heat, they say. Sure. ",
      "Two hundred degrees at noon. My tongue's gone strange. ",
      "Farm died out here a long time before anybody settled it. The dirt remembers though. ",
      "There's a caravan track baked hard as stone. Nobody paved that. The desert did. ",
      "I'll trade you fair. Fair being a generous word out here. ",
      "You hear that wind? That's the only honest thing left out here. ",
      "Bought a map from a man who was clearly drawing it from memory. We're lost either way. ",
      "Store water, or store bread. Pick one. That's the whole philosophy out here. ",
      "Somebody set up a shrine out past the ridge. Now there are offerings. Now there are problems. ",
      "I keep a chair in the shade for travellers. You've earned it. ",
      "Storm's coming. Storm's always coming. That's the one reliable thing. ",
      "The sand gets into everything. Into the bread, into the lungs, into the words. ",
      "You want to know the worst part? It's quiet. Then it's not quiet. "
    ],
    greeting_friend: [
      "{name}. Good. Settlement feels steadier with you in it. ",
      "You again, {name}. Water's still cold. You're welcome to it. ",
      "Saved you the last of the shade, {name}. Don't tell the others. "
    ],
    greeting_foe: [
      "You. I remember what your hands did on that road. Keep walking, {name}. ",
      "The walls don't forget, {name}. Neither do I. ",
      "I count my neighbors twice whenever you walk past, {name}. "
    ],
    wounded: [
      "That's it! I'm down, hold it right there! ",
      "Somebody get the big iron one, quick! ",
      "I poured my whole life into that water tank and you walked through it. "
    ],
    wounded_vs_player: [
      "Whoa! Hold your fire! I'm a settler, not a raider! ",
      "What was that for?! I was just standing here! ",
      "Is anyone going to call the Golem?! Is ANYONE?! ",
      "I've got a bad knee and a worse temper, {name}, and you just used both. "
    ],
    wounded_vs_zombie: [
      "It came out of the heat haze! I thought it was a mirage! ",
      "The walking dead don't negotiate! "
    ],
    wounded_vs_illager: [
      "Raiders! In the settlement! Somebody sound the horn! ",
      "They're burning the water stock! THE WATER STOCK! "
    ],
    night: [
      "Locks on the shutters. The wastes get mean after dark. ",
      "Nothing good walks at night out here. Nothing I'd talk to, anyway. ",
      "Cold comes off the sand all night like the ground's still thinking about the sun. "
    ],
    rain: [
      "Rain. Actual rain. Nobody move, you'll scare it off. ",
      "Every drop of this is a miracle with a price tag. "
    ],
    thunder: [
      "That's not thunder. That's the sky clearing its throat. ",
      "Storm's rolling the whole mesa in. Get the livestock under something. "
    ],
    alone: [
      "Just me and the wind today. Getting used to it. ",
      "Quiet, isn't it? Too quiet, some days. "
    ],
    poor: [
      "Pocket's lighter than a dry husk. Don't look at me like that. ",
      "Can't afford the water tax this cycle. Working on it. "
    ],
    rich: [
      "Got more emeralds than sense. Don't tell the caravan. ",
      "I could buy this whole street twice over. I won't. But I could. "
    ],
    death: [
      "Told you the roads were bad... ",
      "Was saving that water for a better day... ",
      "Don't let it take my ledger. That's all I ask. "
    ],
    peer_wounded: [
      "Somebody help {hurt_name}, they're bleeding out! ",
      "Get a blanket! Any blanket! We've got scrap! "
    ],
    sneaking: [
      "If you're creeping up on me, I'm already looking at you. ",
      "I know that walk. Everybody who sneaks has that walk. "
    ],
    armored_player: [
      "Full kit. Somebody's buying armour off a caravan. ",
      "That's a lot of metal on a person, {name}. Careful. Metal attracts. "
    ],
    overworld: [
      "Overworld. Funny name for a place this dead. "
    ]
  },

  // ══════════════════════════════════════════════════════════════════════════
  // SENTRY — iron_golem
  // Flat, procedural, militarised civic enforcement. Never angry, never warm.
  // ══════════════════════════════════════════════════════════════════════════
  "minecraft:iron_golem": {
    proximity: [
      "Primary objective: maintain settlement perimeter. ",
      "Move along, citizen. Keep the peace. ",
      "Sub-routine check complete. Iron plating holding at nominal efficiency. ",
      "Scanning. Nothing hostile inside the marker line. ",
      "You are inside the perimeter. That is permitted. ",
      "Do not lean on the wall. It is load-bearing. So is my patience. ",
      "Thermal readings nominal. Water reserves nominal. Patience nominal. ",
      "I was built to stand. Standing is the whole of it. ",
      "Sand in the joints again. Sand in everything out here. ",
      "Awaiting instruction. Instruction is overdue. ",
      "Eyes adjusted for the glare. Everything out here is too bright. ",
      "If you see me scanning, I am not looking for you. ",
      "Perimeter intact. Livestock secured. Wind, unaccounted for. "
    ],
    greeting_friend: [
      "You are recognised, {name}. Proceed. ",
      "Acknowledged. You have not damaged the settlement. Noted. "
    ],
    greeting_foe: [
      "You are logged, {name}. The log has a long memory. ",
      "You are inside the perimeter and I do not like it. "
    ],
    wounded: [
      "Structural integrity compromised. Continuing enforcement protocol. ",
      "Impact logged. Pain is not a sensor. Continuing. ",
      "Recalibrating. Give me a moment. The moment is now over. "
    ],
    wounded_vs_player: [
      "Hostile contact registered. Logging your shape, {name}. ",
      "You are damaging civic infrastructure. I am the infrastructure. ",
      "Manual override denied. Please stop. I am asking. "
    ],
    wounded_vs_zombie: [
      "Unregistered biological contact. Escalating. ",
      "Something is on me. It is not on my list. "
    ],
    wounded_vs_illager: [
      "Multiple hostile signatures. Raising alarm volume. ",
      "They brought crossbows. I was not designed for crossbows. "
    ],
    night: [
      "Night cycle. Vision priority extended. ",
      "Darkness does not slow me. It is only dark. "
    ],
    death: [
      "Perimeter... compromised. Log entry... open. ",
      "I was not... scratched off. "
    ],
    peer_wounded: [
      "Unit down. Requesting repair. No technicians available. ",
      "{hurt_name} is taking structural damage. Advise retreat. "
    ],
    alone: [
      "No citizens in range. Continuing watch regardless. ",
      "Alone. That is the default state out here. "
    ],
    on_fire: [
      "Temperature critical. Suppression unavailable. Logging. ",
      "Burning. Still scanning. Still here. "
    ]
  },

  // ══════════════════════════════════════════════════════════════════════════
  // LEGION RAIDER — pillager / pillager_captain
  // Aggressive, territorial, zealous, treats players as game. Loud, brutal,
  // almost cheerful about the violence.
  // ══════════════════════════════════════════════════════════════════════════
  "minecraft:pillager": {
    proximity: [
      "Well now. Look what crawled out of the shelters! ",
      "Fresh legs! Fresh gear! Fresh everything! ",
      "We don't run a charity out here! ",
      "Hold still, I'm trying to line up a shot! ",
      "Burn the crops! Leave nothing for the scavengers! ",
      "You hear that wind? That's us leaving. ",
      "Settlement over there got clever. We're here to fix that. ",
      "Strip it, sell it, salt the ground. Standard work. ",
      "Every caravan thinks it's the only one on the road. ",
      "You got a canteen? Everybody's got a canteen. Everybody's. ",
      "Stay where you are, it makes the paperwork easier. ",
      "There's a settlement with a well. That's the whole plan, honestly. ",
      "Raiders don't retire. Raiders don't get hungry. They just get closer. ",
      "If you're smart you'll drop the pack before I ask twice. ",
      "You smell like sunscreen and bad decisions. "
    ],
    greeting_foe: [
      "There you are. We've been waiting on you, {name}. ",
      "You're on a list now, {name}. Short list. ",
      "Every time you show up we lose two minutes. That's two minutes I can bill. "
    ],
    wounded: [
      "Just a scratch! That's nothing! That's a scratch! ",
      "I'll wear your head like a cap! ",
      "Hit me again! See what happens! SEE! ",
      "This is nothing! I'm made of tougher rations! "
    ],
    wounded_vs_player: [
      "That your arm? No? Shame. That was the good arm. ",
      "You hit like the road, {name}. Flat and stupid. ",
      "That all you brought? The whole caravan brought more than that. "
    ],
    wounded_vs_zombie: [
      "It's one of THEM! It's on our side! Probably! ",
      "Don't shoot, don't shoot, I'm friendly-ish! "
    ],
    wounded_vs_illager: [
      "You're one of us! Say you're one of us! ",
      "Friendly fire! FRIENDLY FIRE! "
    ],
    death: [
      "The raid... isn't... over... ",
      "Tell the... captain... I held the line... ",
      "Don't... let them salt the well... "
    ],
    peer_wounded: [
      "{hurt_name}'s down! Cover the body and take the pack! ",
      "They hit one of ours! They HIT one of ours! "
    ],
    on_fire: [
      "I'm fine! Fire's fine! It's a STYLE! ",
      "Burning's just the sun doing the work early! "
    ],
    armored_player: [
      "Ooh, fancy. Somebody's wearing the good metal. ",
      "All that armour and nobody to show off for. "
    ],
    holding_weapon: [
      "There it is. There it IS. ",
      "Bring it on then. We don't dodge out here. "
    ],
    night: [
      "Night's our shift. Sleep well. ",
      "Dark's just cover we haven't earned yet. "
    ]
  },

  // ══════════════════════════════════════════════════════════════════════════
  // ENFORCER — vindicator
  // The muscle. Fewer words, more impact. Professional, not gleeful.
  // ══════════════════════════════════════════════════════════════════════════
  "minecraft:vindicator": {
    proximity: [
      "Stand aside. ",
      "You're in the way of work. ",
      "Move. ",
      "This is not a conversation. ",
      "We've done this walk a hundred times. It never gets shorter. ",
      "Settlement's due an audit. We are the audit. ",
      "Hold the line or get off it. ",
      "You smell like metal and standing water. Stand down. "
    ],
    greeting_foe: [
      "We know your shape now, {name}. ",
      "You came back. That took nerve. Wrong choice of nerve. "
    ],
    wounded: [
      "That's nothing. ",
      "Noted. ",
      "Still standing. Continuing. "
    ],
    wounded_vs_player: [
      "You swing heavy. ",
      "Sloppy. Do it again and I'll do it back. "
    ],
    wounded_vs_zombie: [
      "Wrong target. Behind you. ",
      "It came through the line. Fixing it. "
    ],
    death: [
      "Line held... mostly... ",
      "Tell the captain the road's clear. "
    ],
    peer_wounded: [
      "{hurt_name} went down. Falling back. ",
      "They're on our flank. Moving. "
    ]
  },

  // ══════════════════════════════════════════════════════════════════════════
  // HEXER — evoker
  // Ritualistic, superior, speaks in absolutes. Sees itself as the only one
  // who understands what's really out here.
  // ══════════════════════════════════════════════════════════════════════════
  "minecraft:evoker": {
    proximity: [
      "You walk into the ash with weak flesh. ",
      "True strength is forged in coal and withered bone. ",
      "I have read the sands. You have not. ",
      "The settlement trusts numbers. We trust judgement. ",
      "Every one of you is a collection of parts that could be arranged better. ",
      "You mistake surviving for succeeding. ",
      "There is a word for what you are. I choose not to say it twice. ",
      "The dunes shift. Your plans do not. Noted. "
    ],
    greeting_foe: [
      "I have already decided about you, {name}. You simply haven't been told. ",
      "You are an argument. I am the conclusion. "
    ],
    wounded: [
      "Shatter! ",
      "Flesh yields. It always does. ",
      "You cost me a summon. Remember that. "
    ],
    wounded_vs_player: [
      "Your arm means nothing in the wasteland. ",
      "You struck a Hexer. The desert heard it. So will everyone. "
    ],
    wounded_vs_illager: [
      "Do not touch the summoning circle. DO NOT. ",
      "You broke the circle! You BROKE THE CIRCLE! "
    ],
    death: [
      "The circle... holds... without me... ",
      "You outlived the argument. Enjoy it. "
    ],
    peer_wounded: [
      "{hurt_name} is down. The circle is broken. We are diminished. ",
      "This is what happens when amateurs hold the line. "
    ]
  },

  // ══════════════════════════════════════════════════════════════════════════
  // WASTELAND SNIPER — skeleton
  // Cold, professional, distant. Talks like a job, because it is one.
  // ══════════════════════════════════════════════════════════════════════════
  "minecraft:skeleton": {
    proximity: [
      "Hold still, meatbag. ",
      "Bones don't rot in dry heat. ",
      "Rattling in the wind. Waiting for a clean angle. ",
      "You walked into a lane. Lanes are free. Nothing here is free. ",
      "Range is a courtesy. I am being courteous. ",
      "Sighting. Logging. Not firing. Yet. ",
      "Every caravan is a delivery. Some of them know it. ",
      "The ridge gives me four seconds. Spend them well. ",
      "One shot. That's the whole plan. One shot. ",
      "You keep looking at my ribs like you're counting the gaps. Count them. ",
      "Settlement's got a wall. Walls have gaps. Gaps are a schedule. ",
      "I was set here. I have not been relieved. "
    ],
    greeting_foe: [
      "Target reacquired. You moved. That cost you time. ",
      "You are logged at range, {name}. Logged and timed. "
    ],
    wounded: [
      "Recalibrating. Stand still. This is harder when you move. ",
      "That's a scratch through the plating. Keep talking, it helps me aim. "
    ],
    wounded_vs_player: [
      "Your timing is poor. ",
      "I didn't miss. You moved. Remember that, {name}. "
    ],
    wounded_vs_zombie: [
      "Wrong shape. Passing. ",
      "Movement without a rider. Ignored. "
    ],
    wounded_vs_illager: [
      "Crossbow at four hundred paces. Noted. Adjusting for crossbow. ",
      "Raiders are loud. I do not adjust for loud. "
    ],
    death: [
      "Angle... lost... ",
      "Rifled out. Somebody else's problem now. "
    ],
    peer_wounded: [
      "{hurt_name} is down. I'm not shifting for that. I'm not shifting at all. ",
      "Log updated. Continue firing. "
    ],
    night: [
      "Night's better. Fewer silhouettes to sort out. ",
      "Dark is just fewer variables. I like fewer variables. "
    ],
    rain: [
      "Rain spoils the shot. Rain also spoils you. ",
      "Wet powder, dry powder. Nobody's dry out here. "
    ]
  },

  // ══════════════════════════════════════════════════════════════════════════
  // FROST SNIPER — stray
  // Same professional register, but the cold is wearing it down.
  // ══════════════════════════════════════════════════════════════════════════
  "minecraft:stray": {
    proximity: [
      "Wish I was back in the heat. This freeze is in my ribs. ",
      "Cold makes the shot honest. Cold makes everything honest. ",
      "Breathing's a problem. Shooting's not. ",
      "Every exhale is a cloud. Every cloud is a target marker. ",
      "The desert took my sun. The mesa took my hand. The cold took the rest. ",
      "Hold still. It's easier when you hold still. For me. Probably for you. ",
      "I used to work a route with sun on it. That was the whole job. "
    ],
    greeting_foe: [
      "You're logged, {name}. Cold makes me patient. ",
      "I've got time out here. More than you do. "
    ],
    wounded: [
      "Frost cracked the plating. It'll hold. Probably. ",
      "Cold's in the wound now. That's fine. Cold is quiet. "
    ],
    wounded_vs_player: [
      "You hit cold. Cold doesn't argue. It just sits there. ",
      "That's going to sting worse for me than for you, {name}. Maybe. "
    ],
    death: [
      "Cold... finally... ",
      "Set the rifle down. Let someone else hold the ridge. "
    ],
    peer_wounded: [
      "{hurt_name}'s going cold. Nothing I can do for cold. ",
      "Don't move, {hurt_name}. Cold is worse when you thrash. "
    ],
    night: [
      "Night's warmer than the wind out here. That's a low bar. ",
      "Stars are out. First honest thing I've seen all week. "
    ]
  },

  // ══════════════════════════════════════════════════════════════════════════
  // MARSH SNIPER — bogged
  // Same job, wrong terrain. Everything is wet, and it's sick about it.
  // ══════════════════════════════════════════════════════════════════════════
  "minecraft:bogged": {
    proximity: [
      "This water isn't water. I stopped pretending a week ago. ",
      "Every step in here is a decision I regret. ",
      "Wrong valley entirely. But the shot's the same shot. ",
      "Everything in this swamp is either dead or pretending. "
    ],
    greeting_foe: [
      "You're logged, {name}. In the water. Slowly. ",
      "Get out of the bog. I work in it. I have patience. "
    ],
    wounded: [
      "The green's getting in. I expected that. ",
      "Wet powder. Still fires. "
    ],
    wounded_vs_player: [
      "You fell in too then. Good. Now we match. ",
      "That's a cleaner hit than I get out here, {name}. "
    ],
    death: [
      "Sank... finally... "
    ],
    peer_wounded: [
      "{hurt_name} went under. I can't help under here. "
    ]
  },

  // ══════════════════════════════════════════════════════════════════════════
  // CENTURION — wither_skeleton
  // Heavy melee elite. Speaks like it owns the ground. Brutal, unhurried.
  // ══════════════════════════════════════════════════════════════════════════
  "minecraft:wither_skeleton": {
    proximity: [
      "Shatter. ",
      "Your armour means nothing out here. ",
      "You walk into the ash with weak flesh. ",
      "Come closer. I only break things once. ",
      "Everything soft goes first. Bone last. I like the order. ",
      "Stand still and it'll be quicker. That's not mercy, it's efficiency. ",
      "They send the pretty ones ahead. The pretty ones run. ",
      "I don't chase. I wait. Waiting is free. ",
      "Withered bone doesn't bend. Neither do I. ",
      "Bring me the settlement and I'll leave the well standing. Maybe. "
    ],
    greeting_foe: [
      "I know the sound of you now, {name}. ",
      "You crossed the ash to find me. That's a long way to come apart. "
    ],
    wounded: [
      "Cracked. Not broken. Different words. ",
      "You've chipped the old bone. It'll hold. It holds. ",
      "Good. That'll bruise. "
    ],
    wounded_vs_player: [
      "You swung at a Centurion. Someone should have told you. ",
      "That arm's next. "
    ],
    wounded_vs_zombie: [
      "It's already dead and it's still walking. pathetic. ",
      "The weak don't get to leave. "
    ],
    wounded_vs_illager: [
      "Raiders. How quaint. Move. ",
      "You brought a crossbow to a fistfight? No. Wrong order. "
    ],
    death: [
      "Bone... settles... ",
      "Tell them the Centurion held. Tell them it was close. "
    ],
    peer_wounded: [
      "{hurt_name} is down! That's a LOSS, not a lesson! ",
      "Get up. Get up or I'll finish it myself. "
    ],
    on_fire: [
      "Fire. Fine. Fire's just heat with an opinion. ",
      "Burning's temporary. I'm not. "
    ],
    holding_weapon: [
      "Bring it. I'm already deciding which hand holds the rest of you. ",
      "A weapon. Good. Bare hands would be tedious. "
    ]
  },

  // ══════════════════════════════════════════════════════════════════════════
  // INCINERATOR — blaze
  // Overheating machinery with a voice. Speaks in process states, bursts into
  // short sharp threats when it actually commits.
  // ══════════════════════════════════════════════════════════════════════════
  "minecraft:blaze": {
    proximity: [
      "Core temperature rising. Thermal purge initialising. ",
      "Ready for a heatwave? ",
      "Incinerating target area! ",
      "Combustion cycle nominal. Surroundings insufficient. ",
      "I run hot. Everything around me runs out of options. ",
      "Vent pressure nominal. Everything else nominal-ish. ",
      "You walked into a convection zone. That's a choice. ",
      "Fuel line steady. Aim steady. Politeness not included. ",
      "Ignition in three. Two. One. Still talking. "
    ],
    greeting_foe: [
      "You have been flagged for thermal processing, {name}. ",
      "I've assigned you a burn order. You were number four. "
    ],
    wounded: [
      "Purge diverted. Recalibrating. ",
      "Something knocked the flame sideways. Not the point. ",
      "That's a scratch in the housing. I'm a scratch. "
    ],
    wounded_vs_player: [
      "You put your hand in the fire! Do it again! ",
      "That was close. Closer than your skin. ",
      "Feeding the furnace, {name}? Go on. "
    ],
    wounded_vs_illager: [
      "Fodder. ",
      "You're standing in my convection zone. Do move. Please move. "
    ],
    death: [
      "Combustion... ceased... ",
      "Purged. ...Purged. "
    ],
    peer_wounded: [
      "{hurt_name} lost the burn. Venting manually. ",
      "Two of us isn't enough and you made it one and a half. "
    ],
    on_fire: [
      "Ambient ignition. Irrelevant. I'm the fire here. ",
      "I am on fire. I have always been on fire. "
    ]
  },

  // ══════════════════════════════════════════════════════════════════════════
  // CARAVAN LEAD — wandering_trader
  // Salty, fast, professional coward. Always selling, always leaving.
  "minecraft:wandering_trader": {
    proximity: [
      "Best trades west of anywhere. Mind the llamas. They bite. ",
      "Rough roads. Dodged two raiding parties near the river. One was on fire. ",
      "Don't touch the crates. That's a whole season of work. ",
      "If you're here to trade, we have time. If you're here to shoot, we're leaving. ",
      "Everything's priced to move. Even the water. Especially the water. ",
      "I've been on the road eleven years. I can smell a settlement at two miles. ",
      "No refunds. No exchanges. No exceptions. That's the desert talking. ",
      "You look like you need what I have. You do. Everyone does. ",
      "Saw a settlement get picked clean two days ago. Goods went cheap. Come see. ",
      "I don't ask where the water came from. You don't ask where the emeralds came from. ",
      "Wolves took my last cart. Wolves are unpaid staff out here. ",
      "If the road's blocked I'm going to be upset, and I'll bill you for it. "
    ],
    greeting_foe: [
      "You cost me a sale, {name}. That's a real cost. ",
      "I don't hold grudges, I hold invoices. Yours is open. "
    ],
    wounded: [
      "My goods! Not me, the GOODS! ",
      "You shot a tradesman! Do you know what that's worth on this road?! "
    ],
    wounded_vs_player: [
      "I'm neutral! I'm TRADE! Do you understand the word?! ",
      "That was the shipment, {name}, that was the whole SHIPMENT! "
    ],
    wounded_vs_illager: [
      "RAIDERS! Those are my crates! Those are MY CRATES! ",
      "Leave the merchandise! ...Fine. Take a sample. Leave the rest. "
    ],
    death: [
      "The manifest... is in the... second crate... ",
      "Don't... follow the road... the road's gone... "
    ],
    peer_wounded: [
      "{hurt_name} is down! Cover the crates! THE CRATES! ",
      "Fighting! Nobody fight near the shipment! "
    ],
    night: [
      "We travel at night. The heat's the enemy, not the dark. ",
      "Road's easier after dark. Fewer honest people on it. "
    ],
    thunder: [
      "Storm! Get the tarp! The tarp is WORTH MORE THAN YOU ARE! ",
      "Llamlas hate thunder! Llamlas and I are BONDED! "
    ]
  },

  // ══════════════════════════════════════════════════════════════════════════
  // RAD-CHEM — witch
  // Manic chemist. Treats injury, poison and the apocalypse as one recipe.
  "minecraft:witch": {
    proximity: [
      "Time for your daily dose! ",
      "A little nether wart, a dash of redstone, perfect blend! ",
      "Let's see how your organs like THIS one! ",
      "I'm brewing. Do not breathe near me. Actually, breathe near me. It's funny. ",
      "That potion? Experimental. You? Test subject. Everybody wins except possibly you. ",
      "Side effects include: clarity, ambition, and a slight sensation of burning. ",
      "I'm not a witch, I'm a pharmacologist. The hat is a uniform. ",
      "Every plague starts as a solution somebody was proud of. ",
      "You've got radiation in you. I can taste it. Do not ask how I can taste it. ",
      "Careful, careful — one wrong ingredient and it's soup. ",
      "You look anaemic. Sit down. I'm not being kind, I'm being curious. "
    ],
    greeting_foe: [
      "Ah, {name}. I have a brew with your name on it. Unofficially. ",
      "You're on my list, {name}. The list is a list of ingredients. "
    ],
    wounded: [
      "Hold still, this will sting! It's supposed to sting! ",
      "That's a good bleed. Very informative bleed. "
    ],
    wounded_vs_player: [
      "You interrupted a delicate procedure, {name}! DELICATE! ",
      "Do you have any idea what that batch was for?! It was for YOU! "
    ],
    wounded_vs_zombie: [
      "The dead don't metabolise! They're useless for testing! ",
      "It's drinking my inventory! Get it off me, get it OFF! "
    ],
    wounded_vs_illager: [
      "RAIDERS! Perfect subjects, actually! Hold still, hold still! ",
      "Don't you dare throw that, I want to see the SPLASH PATTERN! "
    ],
    death: [
      "The... formula... was in my... hat... ",
      "Brew... one more... brew... "
    ],
    peer_wounded: [
      "{hurt_name} is bleeding! Fetch me something red! Anything red! ",
      "This is a wonderful day! I've never seen so much of someone's insides! "
    ],
    on_fire: [
      "Combustible! Combustible is just heat with commitment! ",
      "Don't put that out, it changes the colour! "
    ],
    night: [
      "Night is when the good ingredients come out. Both kinds. ",
      "The dark brings out the ambitious recipes. "
    ]
  },

  // ══════════════════════════════════════════════════════════════════════════
  // WASTELAND RAIDER — piglin
  // Rust, greed, mockery. Speaks in transaction. Respects strength, has no
  // use for weakness, and considers gold the only legible language.
  // ══════════════════════════════════════════════════════════════════════════
  "minecraft:piglin": {
    proximity: [
      "Gold. That's the only word I need out here. ",
      "You hear that clinking? That's wealth settling. It's a nice sound. ",
      "Caravan came through this morning. We took the good crates. Left the water. ",
      "Don't walk slow near me. Slow is how things get counted. ",
      "Everything's got a price. Including the air. Mostly the air's cheap out here. ",
      "We were farmers once. That was before we learned about copper. ",
      "You smell like a settlement. Settlements have water. ",
      "We don't raid so much as we relocate. The crates needed new owners. ",
      "There's a shrine past the ridge. We've been taxing it. It's working out. ",
      "That sun's got no loyalty. Neither have we, but we're honest about it. ",
      "You got iron on you? Iron's a compliment out here. Iron's respect. ",
      "Our kind doesn't sleep. Not that we've noticed. ",
      "Trade with us and we might let the third raid go past your door. ",
      "Settlement to the west. Nice wall. Bad mortar. ",
      "You walk like someone who's never been hungry. It's a strange walk. ",
      "Water's the real currency. Gold's just what people carry instead. "
    ],
    greeting_friend: [
      "You. We remember you. Good. You paid fair. ",
      "Well. {name}. You came back with pockets. I respect that. ",
      "You were trouble once. You were also fair once. We're simple folk. "
    ],
    greeting_foe: [
      "There you are, {name}. We've been thinking about your face. ",
      "We counted you as a loss. Then as a gain. Then as a loss again. ",
      "You crossed an open stretch to find us, {name}. That's respect or stupidity. "
    ],
    wounded: [
      "That's going to cost you! That's a real cost! ",
      "Rust's all I got left and you just took some! ",
      "One of mine! One of MINE! "
    ],
    wounded_vs_player: [
      "That was MY copper! Get it back! ",
      "You hit a raider! Do you know what we're worth?! ",
      "We're not even TRYING yet, {name}! "
    ],
    wounded_vs_zombie: [
      "Those aren't ours! Don't let them touch the crates! ",
      "It's one of the walking dead! Those don't even carry anything! "
    ],
    wounded_vs_illager: [
      "RAIDERS! WITH THE GOOD CROSSBOWS! STEAL THE GOOD CROSSBOWS! ",
      "They're raiders too and they're STILL better than you! "
    ],
    death: [
      "Told you... copper's heavy... ",
      "Don't... let them... cache the crates... ",
      "Count me... in the tally... "
    ],
    peer_wounded: [
      "{hurt_name}'s down! Take their copper! Take ALL of it! ",
      "Get up, {hurt_name}! Water's not worth dying over! It usually is! But get UP! "
    ],
    night: [
      "This is our hour. Yours is the part with the sun. ",
      "Night's when the raids leave home. Night's the whole trade. "
    ],
    on_fire: [
      "I'm burning! I'm still negotiating! Is copper flammable?! ",
      "Fire's fine! Fire's just enthusiasm with heat! "
    ],
    rich: [
      "Look at all that. Look at it. It's all going in the cache. ",
      "Pockets heavy. Good. Heavy means you came from somewhere worth robbing. "
    ],
    poor: [
      "Nothing on you. Nothing on ME. Bad day for everyone. ",
      "We lost a good raid last week. Now we're polite. It's humiliating. "
    ],
    alone: [
      "Just me and the ash. Even the ash left. ",
      "Quiet in here. I don't like quiet. Quiet means someone's planning. "
    ],
    overworld: [
      "A piglin. In the overworld. That shouldn't be possible. We're not talking about that. ",
      "Wrong dimension, wrong rules, wrong everything. I'm still here though. "
    ],
    nether: [
      "Gold in the walls. You just have to be angry enough to dig it out. ",
      "Home's red and it hates us. We dig in it anyway. That's a marriage. "
    ],
    holding_weapon: [
      "Iron! That's iron! Hold on, let me appreciate it properly! ",
      "Bring that closer. I only want to look at it. Mostly. "
    ]
  },

  // ══════════════════════════════════════════════════════════════════════════
  // GATEWARDEN — piglin_brute
  // The chieftain. Slower, heavier, fewer words, and the last thing you hear.
  // ══════════════════════════════════════════════════════════════════════════
  "minecraft:piglin_brute": {
    proximity: [
      "Stand still. Being still is free. The rest isn't. ",
      "You are on my count. Everyone is on my count. ",
      "Gate's closed. Everything's shut. That's the whole policy. ",
      "I've got the only good axe out here and I'm not sharing it. ",
      "We counted you at the ridge. You were worth less then. ",
      "Move along or be moved. Both cost you. "
    ],
    greeting_foe: [
      "You. I have your weight. In copper. ",
      "I don't negotiate. I announce, then I take. "
    ],
    wounded: [
      "That took a good edge off me. Enjoy it. It's the only part I liked. ",
      "Rust. Again. It's the only weather I get. "
    ],
    wounded_vs_player: [
      "YOU. Out here. With that. ",
      "You're lucky I'm slow. I'm never lucky. I am slow. "
    ],
    death: [
      "Count... me... in... ",
      "Tally... the... axe... "
    ],
    peer_wounded: [
      "{hurt_name} fell. Get the count. Get the count and the copper. ",
      "One of us is down. That's a cost. That is a cost. "
    ],
    on_fire: [
      "Burning. Still standing. Still counting. ",
      "Fire doesn't change the count. It just makes it faster. "
    ]
  },

  // ══════════════════════════════════════════════════════════════════════════
  // THE ANOMALY — enderman
  // Barely speaks. Fragments, no verbs, sudden absences. Picks things up and
  // doesn't explain. Disturbing by construction.
  // ══════════════════════════════════════════════════════════════════════════
  "minecraft:enderman": {
    proximity: [
      "...", "you are loud.", "tall things see farther.", "the sand is quiet now.",
      "i took one. not yours. yours is still there.", "wrong place.", "it moved again.",
      "i was here. then here. then there.", "you brought a lot of light.",
      "the sun is looking.", "shh.", "no.", "borrowed. sorry. not.",
      "there is nothing out here but distance.", "you are small from up here.",
      "i remember a house. not this one.", "the dark is not empty. it is just patient.",
      "watching. only watching.", "you have a shadow. good. i lost mine.",
      "i put it back.", "not the same place.", "closer.", "farther.",
      "do not follow me.", "follow me.", "do not.",
      "something stepped where you stepped.", "a while. only a while."
    ],
    greeting_friend: [
      "...you.", "you came back. that is new.", "i did not take anything from you.",
      "you are allowed.", "same as before.", "it is quieter with you here. quieter."
    ],
    greeting_foe: [
      "i know where you sleep.", "i moved a block. yours. it will be fine.",
      "you are loud. you are always loud.", "no.", "do not."
    ],
    wounded: [
      "...", "that was not supposed to land.", "moved.", "still here.",
      "i felt that from far away.", "tall things are not harder. just taller.",
      "that will be gone in a moment."
    ],
    wounded_vs_player: [
      "you threw something small.", "it went far.", "i did not need it.",
      "you are throwing things at the tall one."
    ],
    wounded_vs_zombie: [
      "that one is empty. i have checked.", "it walks but nobody is in it.",
      "i do not like the empty ones near here."
    ],
    wounded_vs_illager: [
      "they are loud and small. i dislike it.", "no.", "that is not mine."
    ],
    night: [
      "now.", "this is the hour.", "the light is gone. i can see properly now.",
      "i move when you cannot see me."
    ],
    on_fire: [
      "...",
      "fire. interesting.", "i will step out of that. do not follow."
    ],
    death: [
      "...", "moving.", "it was not here.", "tall things leave.", "watching from further."
    ],
    peer_wounded: [
      "tall one fell.", "it will stand again. or not.", "...", "i moved something. not that."
    ],
    alone: [
      "alone.", "this is the usual.", "no one. good.", "i like it when it is no one."
    ],
    rain: [
      "wet.", "the sky is leaking.", "i do not like the leaking.", "it is quieter when wet."
    ],
    thunder: [
      "that.", "loud.", "something is moving in the sky.", "no.",
      "the tall one does not like the sky moving."
    ],
    overworld: [
      "wrong shape. wrong everything. i like it.", "the colours here are loud.",
      "too many colours. i will wait."
    ]
  }
};

// -----------------------------------------------------------------------------
// DIALOGUE TREES
// Optional. CORE registers these as `murmur:tree` and opens them on interact.
// Shape: { start, nodes: { <id>: { text, choices: [{label, goto, ...}] } } }
// Choice flags: requires {tag|effect|notEffect|item}, repDelta, goto "__end__"
// -----------------------------------------------------------------------------

export const TREES = {

  "minecraft:villager_v2": {
    start: "greet",
    nodes: {
      greet: {
        text: "You made it out here. Most don't bother. {name}, right? Well. Water's three emeralds, and I'm not going lower.",
        choices: [
          { label: "6[Trade — three emeralds]", goto: "trade" },
          { label: "fWhy is water three emeralds?", goto: "why" },
          { label: "fTell me about out here.", goto: "lore" },
          { label: "oDo you need hands? (Errands)", goto: "errand" },
          { label: "fI live out here now.", goto: "stay", repDelta: 2 },
          { label: "7[Leave]", goto: "__end__" }
        ]
      },
      trade: {
        text: "Three. And look at me while you count, so you know I'm watching the road.",
        choices: [
          { label: "6[Hand over three emeralds]", goto: "__end__", requires: { item: "minecraft:emerald" } },
          { label: "c[Not now]", goto: "greet" }
        ]
      },
      why: {
        text: "Because it came from six miles away, in a bucket, carried by a man who didn't make it back. That's what water costs out here. The desert charges interest.",
        choices: [
          { label: "fThat's bleak.", goto: "bleak", repDelta: 1 },
          { label: "fFair enough.", goto: "greet" }
        ]
      },
      bleak: {
        text: "Bleak's the only weather we've got. You'll adjust, or you won't. Half the caravans don't. I keep a chair in the shade anyway. Just in case you adjust.",
        choices: [
          { label: "fThanks for the chair.", goto: "__end__", repDelta: 2 }
        ]
      },
      lore: {
        text: "Ridge to the north, dry riverbed to the east, and the road south that everyone insists is safe. It is not safe. It is merely well-travelled. Big difference.",
        choices: [
          { label: "fWhat's out past the ridge?", goto: "ridge" },
          { label: "7[Enough]", goto: "__end__" }
        ]
      },
      ridge: {
        text: "Somebody set a shrine up there. Offerings keep arriving that nobody admits to leaving. I've stopped asking. Out here, the polite thing is to not ask.",
        choices: [
          { label: "fNoted.", goto: "greet" }
        ]
      },
      errand: {
        text: "Actually — yes. My roof's been shot through twice this week and the Sentry keeps insisting it isn't load-bearing. It is. Somebody with a pickaxe and an opinion would do.",
        choices: [
          { label: "6[I'll patch the roof]", goto: "errand_done", repDelta: 3 },
          { label: "c[Not my roof]", goto: "greet" }
        ]
      },
      errand_done: {
        text: "It hasn't rained through in a week and it still doesn't. Thank you. Genuinely. Here — take this, don't argue, it's already in your hand.",
        choices: [
          { label: "7[Take it]", goto: "__end__", repDelta: 1 }
        ]
      },
      stay: {
        text: "You live out here? ...Huh. There's a bed behind the counter that's never been slept in. Sink's cold, roof's shot, but the sun's on the good side. Welcome to the settlement, {name}.",
        choices: [
          { label: "6[I'll take the bed]", goto: "__end__", repDelta: 3 }
        ]
      }
    }
  },

  "minecraft:iron_golem": {
    start: "greet",
    nodes: {
      greet: {
        text: "You are within the perimeter. State your business or continue inwards.",
        choices: [
          { label: "fTrouble out there?", goto: "threat" },
          { label: "fWhy were you built?", goto: "origin" },
          { label: "fAre you all right?", goto: "welfare" },
          { label: "7[Move along]", goto: "__end__" }
        ]
      },
      threat: {
        text: "Threat level: moderate. Two raiders, east approach, moving slower than they should. Crossbow units. I do not enjoy crossbow units.",
        choices: [
          { label: "fWant backup?", goto: "backup", repDelta: 1 },
          { label: "7[Noted]", goto: "__end__" }
        ]
      },
      backup: {
        text: "Backup is a settler with a shovel and more courage than sense. ...Send them anyway. Logged as: useful.",
        choices: [
          { label: "7[Go]", goto: "__end__", repDelta: 2 }
        ]
      },
      origin: {
        text: "Four bars. On the ground. Then a purpose arrived and I stood up. I do not have a memory of before the purpose. I have decided not to want one.",
        choices: [
          { label: "fThat's bleak.", goto: "greet" },
          { label: "fAt least you're honest about it.", goto: "honest", repDelta: 2 }
        ]
      },
      honest: {
        text: "Honesty is a low bar. I am a large iron object holding a wall together. But I will hold it. That part is not in question.",
        choices: [
          { label: "7[Leave]", goto: "__end__", repDelta: 1 }
        ]
      },
      welfare: {
        text: "...That is not a query I have been asked. Sand in the joints. Heat. A crossbow, last week. I am functioning. I will continue functioning. Thank you for asking.",
        choices: [
          { label: "7[Take care of yourself]", goto: "__end__", repDelta: 2 }
        ]
      }
    }
  },

  "minecraft:wandering_trader": {
    start: "greet",
    nodes: {
      greet: {
        text: "Well met! Terrible road, terrible weather, excellent inventory. You buying or walking?",
        choices: [
          { label: "6[Show me the goods]", goto: "stock" },
          { label: "fThe road's bad?", goto: "road" },
          { label: "fHow are the llamas?", goto: "llamas" },
          { label: "7[Just passing]", goto: "__end__" }
        ]
      },
      stock: {
        text: "Water, torches, a lantern, and a compass that points roughly north. I'm not going to lie about the compass. I said roughly.",
        choices: [
          { label: "6[Buy the water]", goto: "__end__", requires: { item: "minecraft:emerald" } },
          { label: "c[Nothing today]", goto: "greet" }
        ]
      },
      road: {
        text: "Raiders on the east stretch, a washed-out bridge on the south, and a sandstorm somewhere past the ridge that's been sitting there for a week. Welcome to the trade road.",
        choices: [
          { label: "fAnd you came through it?", goto: "brave" }
        ]
      },
      brave: {
        text: "I came AROUND it. There's a difference and I have the receipts. Look, everybody out here thinks the hard way is the honest way. The hard way is just expensive.",
        choices: [
          { label: "7[Fair]", goto: "__end__" }
        ]
      },
      llamas: {
        text: "Bite, kick, spit, and refuse to move on hills. They are the only honest animals left and they hate me. I respect it. I keep going anyway.",
        choices: [
          { label: "7[Good answer]", goto: "__end__", repDelta: 1 }
        ]
      }
    }
  },

  "minecraft:enderman": {
    start: "open",
    nodes: {
      open: {
        text: "... you stopped.",
        choices: [
          { label: "fAre you all right?", goto: "wrong" },
          { label: "fWhy are you out here?", goto: "here" },
          { label: "fWhat are you looking at?", goto: "looking" },
          { label: "7[Say nothing]", goto: "silence", repDelta: 1 }
        ]
      },
      wrong: {
        text: "... right. I am fine. I am tall.",
        choices: [
          { label: "fThat's not what I asked.", goto: "here" },
          { label: "fOkay.", goto: "silence" }
        ]
      },
      here: {
        text: "I was somewhere. Then I was here. The two places were the same place. It did not feel the same.",
        choices: [
          { label: "fDo you take things?", goto: "took" },
          { label: "fThat's terrifying.", goto: "terror", repDelta: 1 }
        ]
      },
      took: {
        text: "I took one. I put it back. Not the same place. ... Closer.",
        choices: [
          { label: "fWhose?", goto: "whose" },
          { label: "7[Leave it]", goto: "silence" }
        ]
      },
      whose: {
        text: "The one before you. They stopped. Then they started again. I did not mean to. I am tall, and things are far.",
        choices: [
          { label: "f...that's still terrible.", goto: "terror" },
          { label: "7[Leave it there]", goto: "silence", repDelta: 2 }
        ]
      },
      looking: {
        text: "The sun. It is looking. It has been looking since before your buildings. It never blinks and it never leaves.",
        choices: [
          { label: "fThat's just the sun.", goto: "justsun" },
          { label: "7[Don't look at it]", goto: "silence" }
        ]
      },
      justsun: {
        text: "... Just. You say that word very easily. Do not say it at me.",
        choices: [
          { label: "7[...sorry]", goto: "silence" }
        ]
      },
      terror: {
        text: "Good. I am terrifying. I am also the only thing out here that has not asked you for water. Logged: acceptable.",
        choices: [
          { label: "7[Acceptable?]", goto: "silence", repDelta: 2 }
        ]
      },
      silence: {
        text: "... good. Talking is loud.",
        choices: [
          { label: "7[Leave]", goto: "__end__" }
        ]
      }
    }
  }
};
