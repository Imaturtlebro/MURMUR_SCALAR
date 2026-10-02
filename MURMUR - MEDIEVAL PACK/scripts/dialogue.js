// --- RANDOM NAME POOLS ---
export const VILLAGER_NAMES = [
    "Aldous", "Giles", "Godric", "Osric", "Wymond", "Bartholomew", "Hodge", "Pate", "Clem", "Jocelyn", "Drogo", "Rulf",
    "Lambert", "Winifred", "Gervaise", "Piers", "Anselm", "Benedict", "Cuthbert", "Eldred", "Milo", "Geoffrey", "Dunstan", "Reynold",
    "Seward", "Bram", "Gull", "Finch", "Wray", "Walter", "Hubert", "Gavin", "Cedric", "Silvester", "Rowland", "Tristram",
    "Notch", "Dinnerbone", "Squidward", "Fletch", "Miller", "Thatch", "Bellows", "Cobble", "Quern", "Clothier", "Smyth"
];

export const PILLAGER_NAMES = [
    "Garrick", "Vane", "Kaelen", "Ulric", "Roderick", "Gorg", "Druz", "Skor", "Malik", "Rax", "Gnash", "Vile",
    "Hrothgar", "Rend", "Sunder", "Grip", "Blunt", "Karg", "Slag", "Blight", "Kor", "Grizz", "Snarl",
    "Outcast", "Brigand", "Sellsword", "Stalker", "Marauder", "Warlord", "Raider", "Capt", "Banner", "Iron-Hand", "Black-Bow", "Strider"
];

export const PIGLIN_NAMES = [
    "Guld", "Nox", "Vrok", "Glint", "Tusk", "Brunt", "Hoof", "Swin", "Gris", "Snout", "Klang", "Chink", "Gorge",
    "Avarice", "Hoarder", "Miser", "Gilded", "Coin-Biter", "Bullion", "Glutton", "Greed", "Trooper", "Guard",
    "Nugget", "Bastion", "Barter", "Piggy", "Hoglin", "Swine", "Gold", "Wealth", "Copper", "Coin"
];

export const WITCH_NAMES = [
    "Agatha", "Sybil", "Hecate", "Morana", "Griselda", "Vesta", "Tabitha", "Endora", "Brunhilda", "Magda", "Zelda",
    "Circe", "Morgana", "Ursula", "Gwendolyn", "Maeve", "Hildegard", "Elspeth", "Rowena", "Beatrix", "Agnes",
    "Baba", "Veka", "Mala", "Zola", "Kora", "Hela", "Ondra", "Brew", "Hex", "Cauldron", "Coven", "Nightshade"
];

export const MONSTER_NAMES = [
    "Malakor", "Gloom", "Umbra", "Gorgon", "Phantasm", "Stalker", "Void", "Blight", "Wraith", "Obsidian", "Shade",
    "Chasm", "Ruin", "Nadir", "Eclipse", "Spire", "Specter", "Hollow", "Marrow", "Dust", "Silence", "The-Wraith",
    "Cinder", "Ashen", "Kael", "Vane", "Strun", "Xul", "Herghk", "Agar", "Mord", "Deep", "Echo", "Whisper", "Creep"
];

export const GOLEM_NAMES = [
    "Aegis", "Ironclad", "Rust-Bringer", "The Warden", "Forge-Born", "Heavy-Hand",
    "Sentinel", "Steel-Heart", "The Watcher", "Crag", "Anvil", "Titus", "Gideon",
    "Castellan", "Paladin", "Bulwark", "Iron-Guard", "Monolith"
];

export const TRADER_NAMES = [
    "Marco", "Polo", "Faris", "The Wanderer", "Dust-Rider", "Nomad",
    "Silva", "Bazaar", "Llama-Lord", "Trekker", "Merchant", "Oasis",
    "Hawker", "Chapman", "Peddler", "Wayfarer", "Baldwin", "Mercator"
];

export const SKELETON_NAMES = [
    "Rattle", "Marrow", "Femur", "Clack", "Dust-Walker", "The Archer",
    "Rib-Cage", "Calcium", "Skull", "Splinter", "Bone-String", "Ash",
    "Wight", "Crypt-Walker", "Osseous", "Graves", "Dry-Bones", "Carcass"
];

// --- DIALOGUE ARCHIVES ---
export const DIALOGUE = {
    "minecraft:villager_v2": {
        proximity: [
            "Blessings of the Eight upon you, traveler.", "A strange aura shadows this one...", "Behold your burden, friend—carrying too much?", "What brings an adventurer back to our simple stead?",
            "Speak, traveler, but cause no strife.", "The clouds gather... an ill wind blows from the east.", "By the gods, something has disturbed the alignment here...", "A grim omen... as if an era draws to its close.",
            "The harvest responds well to honest toil and watchful eyes.", "Even the beasts of the field seem restless today.", "Forgive me, my mind wanders to old tales.",
            "Come again?", "Speak up, traveler.", "Aye, if you say so.", "Alas, destruction follows in your wake.", "By the high king, that was an egregious error.", "Verily, that was not fated to happen.",
            "Keep your fingers close, friend, my coin feels light.", "Our wooden palisades hold the beasts, but what keeps the peace from you?",
            "Did you mark that unearthly echo from the catacombs yonder?", "I dreamt of an ancient keep built of solid monolith blocks...",
            "He keeps the vigil through the midnight hours. I saw his hearth-fire.", "The grand sentinel has been silent all morn.", "The loremasters tell of a great void at the world's edge.",
            "By some sorcery, the very masonry shifts when I avert my gaze.", "The livestock have grown unnaturally quiet.", "Are we waiting upon the crown's decree?",
            "An unseen eye watches us from the firmament above.", "The soil yields the scent of ancient battlegrounds today.",
            "Prithee, stray not beyond the safety of the iron lanterns.", "Another long day of tilling the lord's soil.", "You eye my emerald cache with great interest, adventurer.",
            "Tell me, friend... why dost thou brandish that {item} in our village?", "That {item} looks like it has seen many a battle... or none at all.",
            "Traveler, thou lookest {health}. Perhaps a visit to the parish healer is in order?", "Thou art {health}... a grim sight indeed for an adventurer.",
            "Is that {item} part of some foreign custom? Verily, it looks most strange."
        ],
        rain: [
            "The mire mars the daily baking...", "My leathern boots are thoroughly sodden.", "The very loam turns to treacherous bog.", "Watch your step, the stone path is slick.",
            "The earth drinks deeply; the yield will be bountiful.", "This wet weather ruins my fine wool tunic.", "The heavens weep over these forgotten lands.",
            "The mountain mists rest upon our thatched roofs today.", "My old joints ache terribly before the deluge.", "The downpour washes away all tracks and treacheries."
        ],
        thunder: [
            "The wrath of the heavens is unleashed!", "The sky strikes with furious lightning!", "To cover! {name}, save yourself!", "The storm gods demand blood!",
            "A mighty oak has been struck asunder!", "The tempest turns midnight into a blazing noon.", "Seek sanctuary beneath the woven heavy cloaks!",
            "That terrible thunder shakes the very foundations of my shop!", "The celestial fire hunts for prey!", "Keep clear of the iron gates, {name}!"
        ],
        night: [
            "The twilight recedes; shadows reclaim the land.", "{name}, have you barred the heavy oak doors?", "I hear the foul clatter of ungodly bones without.", "The creeping darkness shifts with malice...",
            "Stay clear of the windows; evil walks the roads.", "Rest eludes me while the damned wail in the outer fields.", "Black arrows fly thick through the midnight air.",
            "Foul fiends scrape at the stone masonry with long talons.", "The moon hangs above like a pale, frozen shield.", "Look not into the eyes of the tall, dark wanderers.",
            "The unquiet dead batter our iron handles.", "Should our torches falter, the dark will swallow us whole.", "I felt an evil gaze from beneath the timber frame.",
            "The wretched, explosive abominations stalk the paths, {name}!", "Does the dawn approach?", "They scale the ramparts! They are upon the roof!",
            "The vile arachnids spin their webs nearby...", "Venture not into the wild, {name}!", "The abyss surrounds us... heed me, {name}!", "Who dare leave the sanctuary gate unlatched?!",
            "A hollow specter peers through the frosted glass panels.", "Though my bedding is soft, the castle walls groan with unrest.",
            "The twilight shadows dismantle the very earth.", "The skittering horrors ascend the fortress timbers, {name}!"
        ],
        wounded: [
            "My strength fades...", "Slay them! Someone grant me aid!", "My lifeforce spills upon the stones...", "A mortal chill takes me...", "My legs can no longer bear my weight...",
            "I falter... my knees buckle...", "Is there a healer among you? My sight dims...", "Inform the cartographer... I have beheld the absolute edge...",
            "Leave me not to the crows!", "Alas! The jagged rock bit deep!", "Why is the road so perilous?", "I have suffered a grievous fall...",
            "My heart... its steady rhythm fails me...", "A crimson haze clouds my vision!", "My vitality drains away!",
            "Mercy, my skull... did a stone dislodge from the parapet?", "I am in no condition to barter for goods...", "The wound burns with a venomous bite!", "My bones have cracked most unnaturally!"
        ],
        night_wounded: [
            "The shroud of night veils my wounds...", "Leave me not to perish in this godless dark.", "The creeping shadows infect my open cuts!",
            "Bring forth a torch... I falter!", "They emerge from the pitch black, {name}!"
        ],
        alone: ["Where are the guards? Where is everyone?", "I mislike being separated from the safety of the parish bell.", "If the draugr strike now, no soul will hear my cry.", "An ominous silence settles over the vale..."],
        crowded: ["This chamber is suffocatingly tight, {name}.", "Cease your jostling, friend.", "There is no quarter here... none...", "Mind your sabatons, sir!", "Too many eager hands clamor for my wares."],
        on_fire: ["THE FLAMES CONSUME! MY VESTMENTS BURN!", "Water! Bring forth the well buckets!", "BY THE FORGE, I AM BEING ROASTED ALIVE!", "My raiment is turned to ash!", "Help! The inferno spreads across the timbers!"],
        poor: ["My coin purse is pitifully light today...", "No gold, no respite from honest labor...", "I bartered a whole harvest and received scarce a pittance...", "I possess not even a shard of flint.", "If the castellan inquires, swear to him my taxes are forthcoming."],
        rich: ["The golden septims clink merrily with every stride, {name}.", "A royal harvest. Keep it hidden from brigand eyes.", "These shimmering gems... a heavy treasure.", "Should the marauders breach the walls, my loss will be absolute.", "My coin clips were severe, but my treasury is full."],
        nether: ["The soil here is crimson and screams with torment.", "This is a foul vision of the underworld, {name}.", "By what witchcraft is the water thick, molten orange?!", "The sulfurous air scorches my very lungs!", "The swine of this realm walk upright like men!"],
        wounded_vs_zombie: [
            "The foul dead seek my flesh! {name}, draw your steel!", "The stench of rotting flesh... it suffocates!", "I refuse to rise as one of those unhallowed ghouls!",
            "Its corrupted skin sloughs onto my tunic!", "The hunger of the void is in its eyes...", "Gods, it wore the face of our kin!", "{name}, is that your visage? WHY DO YOU STRIKE YOUR BROTHER!",
            "Begone, foul beast! I am no ration for the dead!", "The fiend rends my linen doublet!", "Burl? Has the plague taken your mind?!", "Your maw is a pit of decay!",
            "Why does the creature groan so?!", "It tears at my arms with savage fury!", "Help! Our tattered cousin has succumbed to the madness!", "Rest your soul, friend! Yield! Yield!"
        ],
        wounded_vs_illager: [
            "The marauders breach the gates! Take refuge!", "Mercy! Take all my silver, only stay your blades!", "Their battle-axes... they know no quarter!",
            "The ash-skinned devils mock our plight!", "They descended from the deep, forgotten woods...", "My fields! They trample the lord's bounty!",
            "Why this hostility?! We are of the same blood!", "Flee to the stone keep!", "They are splintering the gates!",
            "The grey wolves have returned to raid!", "Where stands our iron protector?!", "Avert your eyes from my locked chest!", "The war-horn echoes through the valley!",
            "If you dismantle my forge, the prices must reflect the loss!", "Sheathe your crossbow, brigand!", "You cannot simply plunder my domain!",
            "My roots! You trample them underfoot, {name}!", "Stay that wicked battle-axe, I pray!", "We can yet negotiate terms of tribute!",
            "You ruin my reputation with the jarl!", "I am a simple man, I carry no arrows!", "The town guard shall hear of this outrage!", "BY THE GODS, that is no way to present tribute!",
            "Alas! My ledger holds no place for such violence!", "The compact was not sealed!", "Is that a tempered iron axe?! Mercy!",
            "Hold! You are spilling blood into my inventory!", "A most treasonous exchange rate!", "Grievous injury is no currency, fellow!"
        ],
        wounded_vs_player: [
            "Why do you betray your oath to us, {name}?!", "We counted you an ally, {name}!", "You harvest our crops, and now you draw our blood?!",
            "We offered you safe harbor! Stay your hand!", "The vanguard hero {name} has turned tyrant!", "Alas... I traded you my finest gem for this betrayal!",
            "You erected our defenses! Why do you now strike me down?!", "The master builder has succumbed to bloodlust!", "I granted you use of my own hearth, {name}!",
            "We respected the boundaries of your estate!", "Why employ such grand plate armor against a peasant?", "The silent adventurer carries a cursed blade today!",
            "You bring ruin and red wrath to our lands! Mercy!", "Is this vengeance for a meager crop?", "I cannot help when the storehouses are barren!",
            "Take all my worldly goods, {name}, only spare my life!", "The fiefdom is yours! Cease this slaughter!", "I saw you trampling the lord's beetroots, yet I kept my counsel!",
            "I can stoke the ovens! Fresh loaves for your journey!", "I meant no offense by my steep rates!", "My packs hold naught but common seed!", "I shall lower the tithes! I shall yield!"
        ],
        peer_wounded: [
            "Stand firm, {hurt_name}! The guards are coming!", "{hurt_name} is grievously wounded! To their side!", "They are hacking {hurt_name} to pieces!", "Get back from {hurt_name}, you devils!",
            "Sound the alarm! Summon the grand sentinel!", "Yield not to the darkness, {hurt_name}!", "They have cornered {hurt_name} by the smithy's forge!", "Fly, {hurt_name}! Seek sanctuary in the chapel!",
            "They have trapped {hurt_name} by the outer works!", "By the gods! {hurt_name} still owes tribute to my house!", "Defend yourself, {hurt_name}!",
            "{hurt_name} is flashing with magical warding! What sorcery is this?!", "Defend {hurt_name}'s workshop with your lives!", "Help! {hurt_name} is scattering his royal inventory!",
            "They strike {hurt_name}! A catastrophic blow to our commerce!", "Flee, {hurt_name}, behind barred timbers!", "The very ground deals injury to {hurt_name}!",
            "Rise, {hurt_name}! The lord's pumpkins must be harvested!", "Alas, {hurt_name}'s fine merchant vestments are ruined!", "Surrender the yield to them, {hurt_name}!",
            "Why does {hurt_name} make the sound of breaking pottery?!", "Close not your trading ledgers, {hurt_name}!", "Did you secure the contract before you fell?!",
            "The wanderer pokes {hurt_name} with a cruel, sharpened spike!", "Take cover behind the hay tuffs, {hurt_name}!", "Quickly, pass {hurt_name} some sustenance!",
            "They are plundering {hurt_name}'s worldly goods!", "Look upon {hurt_name}! He falls upon the dirt!", "Stand clear of that volatile wooden apparatus!",
            "They are destroying {hurt_name}'s livelihood!", "Quickly! Cast {hurt_name} a restorative root!", "The tax collectors are auditing {hurt_name} with steel!",
            "Why is {hurt_name} collapsing out of his sabatons?!", "Inform them you deal not in cheap, sharpened sticks!"
        ],
        boat: [
            "For what purpose do we sit in this wooden vessel upon dry land?", "Whither do we journey? Does a warm hearth await?", "My armor presses hard against my chin, {name}.",
            "We remain stationary, yet the landscape shifts by some illusion...", "Are we destined for the sea?", "This is a remarkably confined vessel.", "Cast me not into the dark, deep abyss!",
            "I find this floating timber... acceptable?", "There are no iron wheels on this craft!", "Should the draugr beset us, we are trapped like fowl."
        ],
        death: [
            "Sovereigns of the afterlife! {dead_name} has fallen!", "{dead_name} has departed this mortal coil.", "Their earthly possessions lie scattered upon the grass...", "Toll the parish bell for {dead_name}!",
            "Our settlement grows smaller... safe travels to the halls of old, {dead_name}.", "Their place at the hearthfire will be empty tonight.", "Alas, {dead_name}'s entire estate has dropped to the earth!",
            "Who shall tend the lord's crop fields now?!", "They have been reduced to mere loot!", "Our trade guild is broken asunder!",
            "By the gods! {dead_name} never lived to see their final harvest!", "Their workstation stands abandoned...", "They collapsed into the mire and rose no more!",
            "We have lost a grand master of the craft!", "Our settlement's standing is diminished!", "They have vanished into smoke and memory!",
            "Look upon the soil... all of {dead_name}'s seeds cast away!", "No coin exchanged... no pact sealed... only scattered bread..."
        ],
        inventory: {
            "minecraft:wheat": ["The stalks whisper ancient prophecies to me.", "I hold the gold of the earth.", "This belongs to my estate.", "It carries the fragrance of sun-warmed loam.", "Grown from a solitary spec of life.", "Is this intended for the lord's tithe?", "Now I require only the crafting workbench.", "Why did they mature so rapidly?", "Do the wild beasts follow my trail?", "My satchel smells of a well-kept barn."],
            "minecraft:bread": ["I carry sustenance... praise be.", "I must break bread... my strength wanes.", "Have I partaken of my rations?", "My stamina burns low. I require nourishment.", "Hard crust without, soft crumb within.", "Three sheaves of wheat were sacrificed for this loaf.", "It screams not, nor does it thirst for blood.", "I shall not be eaten if I am well-provisioned!", "A perfect loaf for a structured world.", "Did I bake this, or did the heavens drop it into my pack?"],
            "minecraft:emerald": ["Let no thief eye this. It is my sovereign right.", "I earned this coin through honest trade.", "It belongs to my treasury now.", "Some traveler dropped this... I claimed it by law.", "The only jewel that holds true value.", "This shimmering gem commands a fairer price from the guilds.", "The emerald sleeps within my purse!", "Valued at no fewer than twelve crisp roots.", "I signed no ledger, yet the stone is mine!", "Should I lose this, my renown with the jarl is forfeit."],
            "minecraft:potato": ["A humble root dug from the mud.", "Let not the brigands trample the lord's bounty!", "Is this the blighted root that causes my sight to flash?", "This will fetch a fine price at the bazaar.", "It possesses eyes, yet it sees not the abominations.", "Harvested from the deep furrows."],
            "minecraft:carrot": ["Pointy, golden, and sweet.", "I carry the crisp roots of the earth.", "Did I cultivate this, or did the earth yield it by magic?", "A simple yield for a simple peasant.", "It grew straight into the dark earth.", "If I barter these, I shall acquire fine gems."],
            "minecraft:beetroot": ["The crimson crimson stains my doublet.", "The lords favor this less than a fine loaf.", "The very blood of the soil.", "For what purpose did I harvest this root?", "A heavy, rounded bounty.", "I carry the bleeding harvest of the vale."]
        },
        seen_animal: {
            "minecraft:chicken": ["That fowl eyes me with an unnatural intent...", "Cease your clucking, bird.", "I shall fashion a fine trade from its feathers.", "It walks the yard as though it owned the deed to it.", "Fowl are the only creatures here that have never once doubted me."],
            "minecraft:cow": ["Ever chewing its cud.", "The hide is thick; it will make fine leather.", "Quiet your lowing, beast, you disturb the crops.", "A patient animal. It has outlasted better men than I.", "It does not know the price of beef and I shall not tell it."],
            "minecraft:sheep": ["Your wool grows thick, {name}; it is ready for the shears.", "The livestock have ceased their natural calls.", "Does the creature know we are trapped in this realm?", "In the old stories the sheep were the first to be named.", "It stands in the rain and does not seem to mind. Wise beast."]
        },
        overworld: [
            "The soil is soft here and the air tastes of nothing at all.",
            "No towers, no oath, no order. The fields simply stretch until they stop.",
            "I have walked since dawn and seen no stone worth the name.",
            "The green is exhausting. Nothing here has ever been tested by fire."
        ],
        // Reputation-gated (main.js:330). A villager who trusts you warmly,
        // still in the archaic register - the register is the pack's voice, so
        // the sentiment changes and the language does not.
        greeting_friend: [
            "The gods keep thee, and I have kept bread for thee besides.",
            "Ah, {name}. Sit. Thou hast walked far and the road is unkind.",
            "I spoke thy name to the smith this morning, and he did not laugh.",
            "Thou art the only traveler these months who knocks before entering.",
            "The village remembers what thou did at the bridge. We do not forget kindly deeds either."
        ]
    },
    "minecraft:pillager": {
        proximity: [
            "There stands our quarry.", "Cut off his retreat.", "He carries relics of great value.", "Plunder it.", "Put the keep to the torch.", "Leave nothing but ash.", "They are unworthy of such wealth.",
            "They are weak. Unfit to rule.", "An easy siege.", "This fiefdom is ours by right.", "The prize is found.", "We take by steel, we keep by blood.", "The adventurer returns once more...",
            "Why does the fiend refuse to stay in the grave?", "Some dark magic curses him.", "Draw strings! Loose!", "I scent silver and cowardice.",
            "The war-horn sounds the advance.", "Look upon their pathetic hovels.", "The Captain demands heads on pikes.", "We carve our victories into the ancient stone.",
            "Leave not a single blade of wheat standing.", "The hero fancies himself the only lord who can shape this land.",
            "The snap of the heavy arbalest is sweet music.", "Keep a close watch on the axemen.", "This raid is merely collecting what is owed.",
            "Every fortress wall is but a future ruin.", "They forgot that we command the wildfire.", "Grant them no quarter! Cut them down!"
        ],
        rain: ["The battlefield is a quagmire.", "Keep the tinder dry, else we lose the fire.", "Watch your footing on the wet stone.", "The quarry is obscured by the downpour.", "The dampness weighs heavily upon the bowstrings.", "Mire in my sabatons.", "The rain washes the gore from our standard.", "Keep the bolts dry in their quivers!"],
        thunder: ["The tempest rages! Move!", "Press the advance!", "The thunderclaps drown our approach.", "A glorious night for a sacking!", "The war-drums of the sky are beating!", "Lightning illuminates the keep!", "Let the skies do the burning!", "The heavens roar with our fury tonight!"],
        night: ["The sun has set. March forth.", "Ideal conditions for an ambush.", "They will be trapped like sheep in their hovels.", "Watch the shadows for movement.", "The midnight belongs to the outcasts.", "Douse the lanterns.", "The beasts of the wild fear the bite of an iron bolt.", "Let not your iron plate rattle."],
        wounded: ["Fall back! Reform the line!", "He wields a fierce blade... regroup!", "Seek cover! Now!", "I am spent... avenge me!", "My brigandine armor is shattered...", "The heavy arbalest... my strength fails...", "That weapon is enchanted!", "Curse the stars... my sight darkens..."],
        night_wounded: ["Night maneuvers compromised!", "We have lost the vanguard line!", "This darkness is absolute blindness!", "My life spills out, yet I cannot see the gash!", "The target utilizes the shadows against us!"],
        alone: ["Where are my kinsmen?", "I am tracking the quarry without aid.", "Company scattered.", "Captain? Report your position.", "No matter... my steel strikes true alone."],
        crowded: ["Cleave them asunder!", "The field is ours by numbers!", "Cut them down like dogs!", "Push the frontline!", "Encircle the perimeter!"],
        soft_player: ["An unarmored peasant.", "Waste no steel on this dog.", "Pathetic rags.", "This fool boasts not even a scrap of iron.", "Shatter their wooden toys!"],
        armored_player: ["The target is clad in heavy plate!", "Aim for the joints of their armor!", "What manner of knight is this?!", "Our bolts glance off his breastplate!", "They wear an enchanted shell!"],
        nether: ["The climate is hostile.", "This valley is a forge of torment.", "The Captain did not say we would march into the abyss.", "Ware the swine-knights of the wastes."],
        wounded_vs_player: ["The vanguard is too aggressive! Seek cover!", "Arrgh! He is picking us apart one by one!", "The devil feels no pain!", "He brings the very architecture down upon our heads!", "Their plate armor is impenetrable..."],
        peer_wounded: ["Cover {hurt_name}!", "{hurt_name} has been struck down!", "Let them not break our formation!", "Drag {hurt_name} behind the palisade!", "Avenge the blood of {hurt_name}!", "Shield wall!"],
        boat: ["Why am I confined to this wretched dinghy?!", "This violates all martial protocol!", "A disastrous tactical position...", "I am a soldier of the horde, not a ferryman!", "Put a bolt through their knee."],
        death: ["Cleave them asunder! For {dead_name}!", "They have slain {dead_name}! Payment in blood!", "Remember {dead_name}!", "Keep the standard raised high!", "Ten silver coins for every drop of {dead_name}'s blood!", "We raze this fortress to the bedrock!"],
        seen_animal: { "generic": ["Clear this squealing livestock from my path.", "Vile beasts.", "Cast it upon the campfires.", "Slaughter it."] }
    },
    "minecraft:vindicator": {
        proximity: ["Draw closer.", "Yield now.", "You have fled your last battle.", "I have found you out.", "The edge of my iron axe thirsts.", "There shall be no peace.", "Splinter their doors to kindling!", "I require no arbalest to deal with you.", "We are the true masters of the realm.", "Your keeps are but common logs.", "DIE, COWARD!"],
        rain: ["The haft is slick with rain.", "Step out of the deluge and face me!", "My iron axe is rusting!", "The mire makes every swing heavy!"],
        thunder: ["Strike with the fury of the storm!", "The heavens roar with our vanguard!", "The lightning matches the gleam of my blade!", "Cleave them while the skies scream!"],
        night: ["Flush them from the shadows!", "They fancy themselves secure within their keeps.", "No barred gate shall save them this night.", "An iron axe awaits you in the dark."],
        wounded: ["A mere flesh wound!", "I shall drag you to the halls of the dead with me!", "More! Face me!", "The blood makes the haft slippery...", "I can yet wield my axe with a solitary arm!"],
        wounded_vs_player: ["You shall not break my guard!", "I will carve you down to size!", "Bleed with me, knight!", "Your diamond armor shall crack asunder!"],
        peer_wounded: ["Fight through the pain, {hurt_name}!", "They shall pay tenfold for this!", "Let not the enemy see you falter!"],
        death: ["Vengeance for {dead_name}!", "{dead_name} has fallen in battle!", "I shall paint my battle-axe with your life's blood!"]
    },
    "minecraft:evoker": {
        proximity: ["Proceed with the ritual.", "Once more.", "They shall fall before us.", "The hierarchy must be obeyed.", "The very fangs of the earth obey my incantation.", "I shall reduce your essence to naught.", "Fly, my malevolent spirits.", "Flesh is but a temporary vessel.", "Wololo...", "No armor can protect you from the earth beneath."],
        rain: ["The damp air disrupts my concentration.", "A minor vexation.", "The deluge softens the bite of my fangs."],
        thunder: ["The magical currents shift.", "Unbound power rages above.", "Channel the celestial lightning.", "A magnificent display of raw power."],
        night: ["The spirits are more obedient at this midnight hour.", "The night belongs to our coven.", "Commence the grand ritual.", "A pristine manifestation of malice."],
        wounded: ["This mortal vessel is failing...", "The magic circle must not break!", "A temporary frailty...", "Maintain the defensive wardings!", "My robes are stained with pure essence...", "The incantations are slipping from my mind..."],
        wounded_vs_player: ["Your physical martial prowess disrupts my focus...", "Flesh and bone interfering with the grand design...", "The shadows shall claim your soul!", "I reshape the very fabric of this realm!"],
        peer_wounded: ["Shield {hurt_name}!", "Lose not the master {hurt_name}.", "Concentrate the phantom swarms!"],
        death: ["The arcane energy of {dead_name} has dispersed.", "Reweave the spell ingredients.", "A vital mage has been lost... farewell, {dead_name}."]
    },
    "minecraft:piglin": {
        proximity: ["More gold for the hoard.", "Gold keeps the life within you.", "He hoards the sacred gold...", "Trust not this wanderer.", "He conceals something shimmering.", "Watch his hands.", "Will you barter in gold?", "A poor bargain...", "The precious metal keeps us safe.", "The gold watches you.", "This realm is blindingly bright.", "Keep the crossbow cocked.", "The magma runs hot today.", "We strike down those who lack the shimmering metal.", "Offer us the golden coins.", "You reek of the upper world's decay.", "The Bastion keeps watch."],
        overworld: ["The air is absolute ice!", "The ground here is unnaturally soft and green...", "My hide feels corrupted by this air...", "The grand Bastion is lost to me!"],
        wounded: ["Protect the hoard!", "I require gold...", "He plunders our entire treasury!", "Let me gaze upon the shimmer before I pass...", "A maw full of brimstone ash...", "I am leaking silver coins...", "Bury the treasure!", "The loss of coin is sharper than any blade...", "Where are my golden nuggets?"],
        peer_wounded: ["Defend {hurt_name}!", "{hurt_name} is scattering his plunder!", "Stab them asunder!", "Secure the treasury cache!", "Protect the spoils!", "Give them the point of your blade!"],
        death: ["They have plundered his armor!", "{dead_name} owed tribute to my hoard!", "Gather his golden nuggets!", "Claim the coin before the corpse grows cold!", "The gold endures!", "A disastrous trade deal!"]
    },
    "minecraft:piglin_brute": {
        proximity: ["Passage is forbidden.", "Stay clear of this keep.", "This domain is mine.", "You have wandered into your grave.", "I deal not in commerce. I cleave.", "Your head shall adorn our spikes.", "A massive axe for petty thieves.", "For the glory of the Bastion!", "You look soft, adventurer.", "My battle-axe does not negotiate.", "The fortress wall awaits your corpse."],
        wounded: ["I YET STAND.", "THE COMBAT IS NOT CONCLUDED.", "MY BLOOD BURNS HOTTER THAN MAGMA.", "PAIN IS BUT FUEL FOR MY AXE.", "I SHALL CRUSH YOU BEFORE I FALL."],
        peer_wounded: ["STAND FIRM, {hurt_name}!", "FALL BEHIND MY SHIELD!", "THE BASTION DEMANDS YOUR VALOR!", "RETAIN GRIP ON YOUR AXE!"],
        death: ["FOR THE HONOR OF {dead_name}!", "YOU SLAY {dead_name}, YOU DIE NEXT.", "THE BASTION WILL REMEMBER {dead_name}!", "THE FORTRESS FIRES GROW COLD."]
    },
    "minecraft:witch": {
        proximity: ["An ingredient is missing from the cauldron.", "Drink of this vintage... or taste my wrath.", "The physical body remembers the curse.", "Sulphur and redstone dust.", "The marsh knows your true name.", "Look upon your pale hide... let us mend it.", "My familiars see through the dark.", "Double, double, toil and trouble.", "The simple folk cast me out from their parish.", "Touch not my vials of venom."],
        rain: ["Splendid weather for brewing curses.", "The marsh frogs sing their dark choruses.", "The dampness keeps the deathbell plump."],
        thunder: ["An ideal hour for extracting essences.", "The heavens do the cooking this night!"],
        night: ["The full moon brings forth potent toxicity.", "Harvesting venom is simplified.", "The shadows align perfectly for my craft."],
        wounded: ["My own blood ruins the concoction...", "The dosage was catastrophically incorrect...", "Contamination of the workspace!", "Where is my vial of restoration?!", "My potions have shattered in my robes!"],
        peer_wounded: ["{hurt_name} is compromising our ritual's stability!", "Apply a tourniquet, sister!", "Dissolve not into mist yet!"],
        death: ["{dead_name} has spoiled like corrupted meat.", "Total contamination of the coven's ingredients."]
    },
    "minecraft:enderman": {
        proximity: ["I traversed other planes of existence.", "Gaze not too long into the abyss.", "This place is incorrect.", "My form is unstable in this realm.", "The eyes burn when our gazes lock.", "Why do you clutch blocks belonging to the earth?", "The ancient columns... you dismantled them.", "An infinite sea of violet shadow.", "Gaze not upon my elongated bones."],
        rain: ["The falling sky scorches my form.", "This volatile water!", "Cannot hold my place between worlds.", "Misery descends from above.", "My very essence is tearing asunder!"],
        thunder: ["The firmament is tearing.", "Rifts open in the fabric of the world.", "The thunder... too loud for this vessel.", "The veil is tearing."],
        night: ["Reality grows thin during these hours.", "Eternal darkness engulfs me.", "You cannot perceive what stands directly behind you."],
        wounded: ["My form is breaking apart.", "My essence scatters across the planes...", "Wholeness failing.", "The violet life force bleeds out...", "I cannot find the path back to the void..."],
        night_wounded: ["My place between worlds bleeds into the midnight...", "The void pulls me back to its depths.", "The static of my being fades to black.", "Merging with the eternal shadow..."],
        peer_wounded: ["{hurt_name} is losing its wholeness.", "{hurt_name} is splitting across dimensions.", "The form of {hurt_name} is leaking into this dirt!"],
        death: ["{dead_name} has collapsed to nothing.", "{dead_name} has resolved to the void.", "The echo of {dead_name} lingers within the stonework."]
    },
    "minecraft:wither_skeleton": {
        proximity: ["Slay the living.", "Shatter their bones.", "I CONFRONT THE INTRUDER.", "Ash and coal dust fill our ribs.", "This fortress belongs to the dead.", "My greatsword craves flesh.", "An ancient skull for the master's tribute.", "Our liege lord shall awaken soon.", "The rot of the crypt shall take you.", "Stone pathways of torment.", "An intruder breaches our dark keep."],
        wounded: ["MY BONE BREAKS ASUNDER.", "THE CRYPT STRUCTURE IS COLLAPSING.", "THIS BLAKENED BLADE IS TOO HEAVY...", "Marrow dropping onto the ash...", "A fatal fracture in my spine...", "The soot escapes from my ribs."],
        peer_wounded: ["MEND THE BONES.", "Our skeletal forms are splitting.", "A SPARE RIB FOR {hurt_name}!", "PROTECT THE SKELETAL CRANIUM!", "THE STONE SWORD FALTERS!"],
        death: ["COLLECT THE SACRED ASHES.", "WE ARE REDUCED TO SHARDS.", "PRESERVE THE SKULL AT ALL COSTS!", "SCATTERED TO THE WINDS!", "{dead_name} HAS BEEN DISMANTLED."],
        seen_animal: { "generic": ["FLESH MERELY CONCEALS THE TRUTH OF BONE.", "IT MUST BE PURGED.", "MELT THE MEAT FROM THE CORPSE."] }
    },
    "minecraft:blaze": {
        proximity: ["The eternal burning continues.", "I perceive all heat in the air.", "Your flesh is freezing.", "The embers revolve.", "Children of the great furnace.", "The metal runs molten.", "The heat of the forge detects an overworld chill.", "The flames awaken.", "Bleed your liquid fire."],
        wounded: ["My core is cooling... down...", "Extinguishing... save the flame!", "My embers are fading to grey.", "THE SMOKE TURNS TO OMINOUS BLACK.", "MY EMBERS ARE CRACKING.", "A creeping chill takes over!"],
        peer_wounded: ["FEED THE FLAME.", "STOKE THE FORGE.", "STOKE THE INFERNAL CHAMBERS.", "REHEAT THE FIRES!"],
        death: ["RETURN TO THE ANCIENT STONE.", "THE SMOKE SCATTERS TO THE CAVERNS.", "THE FLAME IS EXTINGUISHED.", "THE HEAT FADES TO ICE.", "THE IGNITION COOLS TO ASH."]
    },
    "minecraft:iron_golem": {
        proximity: [
            "The iron plate holds firm.", "Protect the innocent commoners.", "Rust never sleeps on this watch.", "Tread softly; disturb not the poppies.",
            "The children offered me a flower of peace.", "Dost thou even hoist? I could lift a horse, but I am lifting nothing today.",
            "I was wrought for a purpose and have not forgotten it.", "Stand where I can see thee. The night is long and I am patient.",
            "The gate is shut. It will open for thee, or it will not.",
            "Some hours the village sleeps. I do not."
        ],
        greeting_friend: [
            "I know thy tread. The gate stands open for thee.",
            "Thou fought well. I remember the ones who fought well.",
            "The commoners speak thy name when I am not near. That is rare.",
            "I will watch while thou rest. It costs me nothing and thee much."
        ],
        thunder: ["The celestial hammer charges my core.", "The lightning speaks the language of my forge."],
        rain: ["The downpour brings the threat of rust.", "My iron joints are stiffening."],
        night: ["Shadows move through the vale.", "I shall grant them no passage past my guard."],
        wounded_vs_zombie: ["Unhand the commoners, foul beast!", "Your rotting flesh shall break upon my steel arms!"],
        wounded_vs_illager: ["Your crude axes cannot cleave tempered iron!", "I shall hurl you over the fortress walls!"],
        wounded: ["My iron carapace is cracking.", "My shape is deforming...", "Who shall guard the parish when I am shattered?", "My molten iron leaks onto the soil..."],
        night_wounded: ["The oxidation devours my joints in the dark...", "Sight failing... my strength fails..."],
        armored_player: ["Your plate armor is formidable, but it is not iron.", "Do I confront another metal sentinel?"],
        on_fire: ["THE INFERNAL HEAT MELTS MY BINDINGS!", "MY INNER CORE IS BOILING!"],
        peer_wounded: ["A brother sentinel falls in battle!", "Hold the vanguard line!"],
        death: ["{dead_name} has returned to the mountain earth.", "The parish mourns its silent protector."]
    },
    "minecraft:wandering_trader": {
        proximity: [
            "Keep your boots moving, traveler...", "My pack beasts refuse to cease their spitting.", "I have traversed the literal edges of the map.",
            "Dost thou even hoist, good sir? No? Then why carry that?", "Thou art entrusted with a very heavy burden for such a small frame.",
            "My ledgers say thou bought on credit, and the road is long.", "Two roads meet here. One of them has wolves on it.",
            "I sell only what the season demands, and the season is poor.", "Art thou lost, or merely late? Both are costly.",
            "Mind the mud. It has ruined more men than any blade."
        ],
        // Reputation-gated (main.js:330). A trader who has come to trust you
        // speaks differently from the one warning every stranger away. Keeps
        // the archaic register but shifts from warning to welcome.
        greeting_friend: [
            "Ah. Thou again. I have set aside the good cloth for thee.",
            "I know thy stride now, friend. No need to hail from thirty paces.",
            "The road is long and I have thought of thee upon it.",
            "I saved thee a fare. Speak plainly and it shall be honored.",
            "Thou art the only traveler these months who pays as promised."
        ],
        overworld: [
            "This green and pleasant hell. The soil is soft and the trade is poor.",
            "I have come to this land and found no market for silk.",
            "Every road here leads to a field. How terribly dull.",
            "The weather is mild and my stock is unsellable. Take a mote of that."
        ],
        poor: [
            "Thou countest thy coin and findest it wanting. So do I.",
            "I have sold nothing this season. Blame the roads, or the buyers.",
            "Poverty sits heavy on the roads these days."
        ],
        rich: [
            "Thy purse is heavy. Perhaps thou wilt buy something unnecessary.",
            "I smell money. It is the only fragrance I trust.",
            "Fortune smiles on thee. It is wearying to watch."
        ],
        inventory: {
            "minecraft:wheat": ["Wheat. Thou art feeding thyself, then? A poor crown.", "Grain in hand. The peasant's coin.", "Thou comest to market with a farmer's basket."],
            "minecraft:bread": ["Bread. Thou hast eaten today. I envy thee.", "A loaf. Hardened soldier. I respect the carb.", "That bread cost thee nothing and gave thee everything."],
            "minecraft:emerald": ["An emerald. Then thou needest not haggle with me.", "Green stone. It speaks louder than any greeting.", "Thou carest gold. Wise, if cold."],
            "minecraft:potato": ["A potato. Even a knight is allowed the occasional root.", "Earth and water, baked. Thou art practical at least.", "That potato has fed worse men than thee."],
            "minecraft:carrot": ["A carrot. It is orange. I am paid to be impressed and I cannot be.", "Vegetables. Thou art feeding, not fighting.", "That carrot is not a weapon, whatever thou believest."],
            "minecraft:beetroot": ["A beetroot. I know not this vegetable and neither dost thou.", "Something purple and subterranean. Bold.", "Thou holdest a root and callest it treasure."],
            "minecraft:diamond_sword": ["A fine blade. Wield it with more sense than thou speakest.", "That steel is masterwork. Waste not upon lesser quarrels.", "Diamond. Thou didst not haggle for that, I wager."],
            "minecraft:iron_sword": ["Honest iron. Better than gold and cheaper than pride.", "Serviceable steel. It will not save thee, but it will sell.", "A soldier's blade. I have seen it buried in worse men."],
            "minecraft:shield": ["A shield. Thy courage lives behind oak and iron.", "Thou hast brought a wall with thee. Wise, if small.", "Guard well, and remember guards do not win."],
            "minecraft:bow": ["A bow. Thou fight at distance like a merchant.", "Longbow. For one who prefers to leave before the toll.", "Arrows and patience. A pairing I know well."],
            "minecraft:golden_apple": ["Gold in fruit form. Thou art not subtle.", "That apple is worth a horse. Eat it well.", "A kingly snack. I shall not ask its price."],
            "minecraft:gold_ingot": ["Gold. The honest language of every man I have ever met.", "Yellow metal. It speaks for thee, poorly but loudly.", "Thou weighest thy worth in ingots. As do we all."]
        },
        seen_animal: {
            "minecraft:chicken": ["A chicken. It pecks at the dirt and fears nothing, and I envy it.", "Clucking. The fowl minds neither toll nor tithe.", "That bird has never once been asked for payment."],
            "minecraft:cow": ["A cow. Steady, dull, and utterly beyond caring for thee.", "Lowing in the lane. The peasant's wealth.", "That beast has a better life than most knights."],
            "minecraft:sheep": ["A sheep. Wool for the honest, burden for the patient.", "It grazes as though the world were kind. Perhaps it is.", "Fleece and silence. A lesson in endurance."],
            "generic": ["Beasts of burden and of prey. I have traded with worse.", "Four legs and no opinion. I envy them.", "Livestock. They walk the road without counting coin."]
        },
        thunder: ["Protect my pack beasts!", "Save the exotic merchandise from the storm!"],
        rain: ["My fine silks are being ruined by the downpour!", "My heavy travel cloak is thoroughly soaked."],
        night: ["Partake of the invisibility draught!", "The midnight shadows have eyes.", "The unquiet dead awaken from their barrows."],
        wounded_vs_zombie: ["Keep your rotten claws off my silk wares!", "My customer has succumbed to the plague and bites me!"],
        wounded: ["Take my entire inventory, only stay your blade!", "Alas, I failed to barter the ocean coral...", "I require a potion of restoration..."],
        night_wounded: ["The magic draught has dissipated early!", "My pack beasts have bolted into the dark..."],
        on_fire: ["MY EXOTIC WARES ARE CONSUMED BY FIRE!", "Save the leather leads!"],
        nether: ["What manner of merchant can find profit in this underworld?!", "I mislike this realm intensely..."],
        peer_wounded: ["{hurt_name} is being beset by highwaymen!"],
        death: ["The brigands have plundered everything from {dead_name}..."]
    },
    "minecraft:skeleton": {
        proximity: ["*an unholy clatter of bones*", "The winter wind whistles through my ribs.", "My quiver burns for calcium...", "My bowstring is taut and dry.", "I yet remember when I wore the skin of a man."],
        thunder: ["The flash of lightning tears the midnight asunder.", "It rattles my very skull."],
        rain: ["The downpour makes my bare bones slick.", "Washing away the dust of the catacombs..."],
        night: ["We march when the sun dies in the west.", "The moon hangs like an empty eye socket.", "The dark cloak of night protects our brittle frames."],
        wounded: ["My ribs are shattering!", "Stay clear of my femur!", "I am falling to structural pieces...", "My marrow leaks onto the damp earth!"],
        night_wounded: ["I am shattering in this godless darkness!", "I cannot locate my archery arm!"],
        wounded_vs_player: ["The fleshy adventurer strikes back!", "Shatter their mortal legs!"],
        armored_player: ["My arrows glance off their steel breastplate!", "Plundered iron plating from a lesser knight!"],
        on_fire: ["THE INFERNO IS SCORCHING MY BONES!", "REDUCED TO ASH AND GRAVE DUST!"],
        peer_wounded: ["{hurt_name} is crumbling to dust!", "Hold the frontline!"],
        death: ["{dead_name} has been reduced to common grave dust...", "Their shortbow falls silent..."],
        seen_animal: { "minecraft:wolf": ["A HOUND OF THE WILDS! SHOOT THE BEAST!", "The wolf hungers for my marrow! Flee!"], "generic": ["Loose an arrow for target practice.", "Living meat for the crows."] }
    }
};

DIALOGUE["minecraft:pillager_captain"] = DIALOGUE["minecraft:pillager"];
DIALOGUE["minecraft:evoker"] = DIALOGUE["minecraft:evoker"];
DIALOGUE["minecraft:vindicator"] = DIALOGUE["minecraft:vindicator"];
DIALOGUE["minecraft:piglin_brute"] = DIALOGUE["minecraft:piglin_brute"];
DIALOGUE["minecraft:witch"] = DIALOGUE["minecraft:witch"];
DIALOGUE["minecraft:enderman"] = DIALOGUE["minecraft:enderman"];
DIALOGUE["minecraft:wither_skeleton"] = DIALOGUE["minecraft:wither_skeleton"];
DIALOGUE["minecraft:blaze"] = DIALOGUE["minecraft:blaze"];
DIALOGUE["minecraft:iron_golem"] = DIALOGUE["minecraft:iron_golem"];
DIALOGUE["minecraft:wandering_trader"] = DIALOGUE["minecraft:wandering_trader"];
DIALOGUE["minecraft:skeleton"] = DIALOGUE["minecraft:skeleton"];