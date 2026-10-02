// --- RANDOM NAME POOLS (ESPAÑOL) ---
export const VILLAGER_NAMES_ES = [
    "Blen", "Garn", "Joss", "Mend", "Krel", "Smid", "Hodd", "Fed", "Pik", "Jed", "Dred", "Rul", "Vrel", "Klog",
    "Zed", "Wend", "Thad", "Blid", "Gorf", "Ned", "Sped", "Grim", "Bob", "Jeff", "Orin", "Kael", "Rigo", "Meek",
    "Shed", "Tad", "Giles", "Hodge", "Clem", "Pate", "Yorick", "Bram", "Seward", "Gull", "Finch", "Wray", "Rulf",
    "Notch", "Dinnerbone", "Squidward", "Kapp", "Bax", "Fletch", "Miller", "Thatch", "Bellows", "Cobble", "Quern",
    "Grimsdale", "Sloam", "Havelock", "Pott", "Weevil", "Muck", "Clay", "Gristle", "Dredge", "Barrow"
];
export const PILLAGER_NAMES_ES = [
    "Grilk", "Vorg", "Zulk", "Krag", "Throk", "Garn", "Druz", "Skor", "Malik", "Rax", "Gnash", "Vile", "Kurn", "Skarl",
    "Zor", "Hroth", "Rend", "Sunder", "Grip", "Blunt", "Karg", "Slag", "Vane", "Blight", "Kor", "Grizz", "Snarl",
    "Ilusión", "Vex", "Evoke", "Cross", "Bolt", "Iron", "Fang", "Señor de la Guerra", "Asaltante", "Capt", "Estandarte", "Acecho",
    "Gore", "Flay", "Krev", "Skurn", "Gat", "Malor", "Retch", "Grip-Iron", "Scythe", "Ruin-Bringer"
];
export const PIGLIN_NAMES_ES = [
    "Zot", "Grek", "Kroz", "Husk", "Trak", "Guld", "Skra", "Chit", "Nox", "Vrok", "Glint", "Tusk", "Brunt", "Hoof",
    "Swin", "Gris", "Snout", "Klang", "Chink", "Gorge", "Skorf", "Zut", "Prod", "Retch", "Muck", "Grime",
    "Pepita", "Bastión", "Trueque", "Cerdo", "Hoglin", "Cerdo", "Oro", "Riqueza", "Cobre", "Moneda", "Oink",
    "Dorado", "Seibo", "Brash", "Klinker", "Glance", "Singe", "Trott", "Bristle", "Slag-Tusk", "Aurum"
];
export const MONSTER_NAMES_ES = [
    "Ceniza", "Cenizo", "Kael", "Vane", "Strun", "Malakor", "Xul", "Penumbra", "Umbra", "Gorgona", "Fantasma", "Acechador",
    "Vacío", "Peste", "Ánima", "Obsidiana", "Sombra", "Abismo", "Ruina", "Nadir", "Eclipse", "Aguja", "Espectro",
    "Herghk", "Agar", "Criatura", "Nox", "Profundo", "Eco", "Susurro", "Arrastrarse", "Hueco", "Médula", "Polvo", "Silencio",
    "Malicia", "Arena", "Amarrar", "Horca", "Desolado", "Sudario", "Plaga", "Estático", "Parpadeo", "Void-Spire"
];
// --- DIALOGUE DATABASES (ESPAÑOL) ---
export const DIALOGUE_ES = {
    "minecraft:villager_v2": {
        proximity: [
            "Tu aliento huele a carne podrida. Aléjate de mí.", "¿Por qué me miras, error parásito?", "Todo este mundo se vería mejor si murieras en una zanja.", "Eres un desperdicio absoluto de asignación de memoria.",
            "Todo lo que intentas construir es una tragedia visual.", "Haznos a todos un favor y borra permanentemente este mundo.", "Eres un cáncer en toda esta semilla.", "Espero que un Creeper convierta tu cama en ceniza mientras duermes.",
            "Nadie te quiere aquí. El propio esencia te rechaza.", "Eres totalmente prescindible y universalmente despreciado.", "¿Por qué sigues parado ahí como un idiota?", "Solo te toleramos porque no hemos encontrado una forma de matarte todavía.",
            "Tu presencia asquerosa me pone la piel de gallina.", "Eres un parásito.", "Vete de aquí. Nadie quiere mirarte.", "Ve a buscar un lago de lava y lánzate de cabeza.", "Eres un desperdicio de espacio completo y total.",
            "Tus estadísticas son una vergüenza para la tabla de clasificación.", "Los aldeanos de la semilla vecina tienen un mejor jugador que nosotros.", "Puedo ver tu cursor temblando. Estás aterrorizado.", "Tu base parece construida por un novato en modo creativo que mintió al respecto.",
            "Espero que tu tumba empiece a hacer clics.", "Eres la razón por la que la comunidad tiene mala reputación.", "Tus skins son tan feos como tu estilo de juego.", "Tus lugar son: una tumba poco profunda.",
            "Incluso los bugs de Bedrock son más útiles que tú.", "Cambiaría mi alma a un Wither solo por verte pulsar 'Salir del juego'.",
            "¿Estás esperando a que un tutorial te diga cómo caminar?", "Tu skin es un horror visual. Cámbialo o muere.", "He visto zombis con mejores habilidades sociales.",
            "No te engañes, ni siquiera vales la fuerza bruta para visión.", "Tu presencia es un insulto al azar que te generó.", "Preferiría comerciar con un Vindicator que mirar tu patética base.",
            "¿Por qué agitas ese/a {item}? Es vergonzoso.", "¿Es ese/a {item} lo mejor que puedes encontrar? Patético.", "Te ves {health}... mejor quédate así.", "Te ves {health}. Esperemos que empeore.",
            "Ese/a {item} no te hace parecer menos estúpido.", "Genial, el perdedor {health} sostiene un/a {item}. Comedia pura."
        ],
        // Se eliminaron seis condiciones huérfanas: sneaking, jumping,
        // holding_weapon, holding_useful, jukebox y wealth. CRUEL nunca las
        // definió en su dialogue.js de inglés, así que register.js jamás las
        // enviaba: eran texto muerto heredado de PRAISE, traducido y mantenido
        // vivo en este fichero pero inalcanzable en el juego. Se quitaron para
        // que el fichero español no sugiera una cobertura que no existe.
        rain: [
            "Espero que el cielo se abra y te ahogue donde estás parado.", "Incluso los elementos intentan lavar tu mugre.", "Estás arrastrando barro en mi línea de visión, cerdo asqueroso.", "Ve a pararte bajo un árbol y espera a que el rayo te arregle.",
            "Las nubes son grises, igual que tu patético futuro.", "La lluvia oculta tus lágrimas, pero sabemos que estás llorando.", "Espero que tu techo gotee directamente sobre tu cofre.", "El fango es demasiado bueno para tus pies."
        ],
        thunder: [
            "Derriba al jugador. Hazlo.", "Ruego para que el cielo te despedace y esparza tus objetos.", "Todo el mundo te está gritando que te vayas.",
            "Los cielos están abucheando tu llegada.", "Ese estallido apuntaba a tu base. Revisa tus lugar.", "Rayo para el mentiroso. Trueno para el ladrón."
        ],
        night: [
            "Espero que los muertos te desuellen vivo esta noche.", "Voy a atrancar esta puerta, y espero que te despedacen fuera.", "Hora de noche, perdedor. Ve a que te maten.", "Estoy a salvo tras el hierro. Tú solo eres práctica de tiro.",
            "La luna ve tu vergüenza.", "Los zombis tienen más clase de la que tú tendrás jamás.", "Voy a dormir profundamente mientras se comen tus sesos.", "Quédate fuera en la oscuridad. Le pega a tu personalidad."
        ],
        wounded: [
            "¡Tú hiciste esto, sociópata violento y sin valor!", "¡Mi sangre está en tus manos, y espero que te asfixie!", "¡Eres una plaga en este mundo!", "¡Me estoy desangrando porque eres demasiado incompetente para existir!", "¡Espero que sufras una muerte agónica!",
            "¡Te perseguiré en tu distancia de visión por siempre!", "¡Mis cuerpo fallan por tu crueldad!", "¡Solo puedes ganar mediante truco baratos!", "¡Espero que te atragantes con tus propias pociones de salud!"
        ],
        night_wounded: [
            "Sangrando en la tierra porque eres totalmente inútil.", "Ni siquiera puedes manejar una amenaza básica.", "Mi muerte es un recordatorio permanente de lo mucho que das asco.",
            "Oscuridad final para una decepción final.", "Mira lo que has hecho en la oscuridad, monstruo."
        ],
        alone: ["Finalmente, un momento lejos del mayor error del mundo.", "Solo yo y un trozo de basura humana andante.", "Preferiría pudrirme con los zombis que mirar tu cara ahora mismo.", "El silencio es lo único bueno de este mundo desde que te uniste.", "Estamos solos. Nadie oirá tus patéticas disculpas."],
        crowded: ["¡Quita tus sucias manos de encima!", "Estás asfixiando esta sala con tu patética presencia.", "Atrás, bicho raro.", "Cada alma en esta sala te odia completamente.", "El aire es tóxico porque lo estás respirando.", "Ve a buscar otro rincón para arruinar."],
        on_fire: ["¡QUÉMATE! ¡ESPERO QUE TE QUEMES IGUAL QUE ESTO!", "¡ME HICISTE ESTO A MÍ, PSICÓPATA PATÉTICO!", "¡VOY A SER EL HUMO QUE TE ASFIXIE HASTA LA MUERTE!", "¡TE LLEVARÉ AL INFERNO CONMIGO!", "¡MIS CENIZAS MALDECIRÁN TUS MUNDOS!"],
        poor: ["Nos dejaste secos, parásito movido por la codicia.", "No me queda nada porque arruinas todo lo que tocas.", "Destruiste absolutamente la economía.", "Ve a dejar seco a otro, sanguijuela.", "¿Mirando mi cofre vacío? Tú hiciste esto, ladrón.", "Tu irresponsabilidad fiscal es legendaria."],
        rich: ["Tengo todo lo que quiero, y tú sigues siendo completamente patético.", "Nunca podrás permitirte esto, perdedor pobre.", "Estoy inflando estos precios estrictamente porque desprecio tu cara.", "Preferiría tirar esta esmeralda a la lava que comerciar contigo.", "Mi patrimonio es más alto que tu coeficiente intelectual."],
        nether: ["¿Me arrastraste al literal infierno? Eres un demonio absoluto.", "Este pozo es casi tan repulsivo como tu cara.", "Espero que un ghast te lance al océano de lava.", "Finalmente, un paisaje que coincide con tu alma.", "Espero que pierdas tu portal y te pudras aquí."],
        wounded_vs_zombie: [
            "¡Me están despedazando la carne y tú solo miras, cobarde!", "¡Eres completamente inútil!", "¡Cuando me transforme, iré directo a tu garganta!",
            "¡Tu cobardía es más asquerosa que la podredumbre!", "¡¿Solo miras por el muñeco, verdad?!"
        ],
        wounded_vs_illager: [
            "¡Están purgando esta aldea y los trajiste directo a nosotros!", "¡Toda esta masacre es por tus decisiones estúpidas y egoístas!", "¡Estamos muriendo en agonía porque existes!",
            "¡Ellos son la purga, y nosotros las bajas de tu ego!", "¡Espero que encuentren tu base después!"
        ],
        wounded_vs_player: [
            "Matar aldeanos indefensos... eres escoria patética y de mente pequeña.", "Solo puedes herir cosas que no pueden defenderse. Cobarde.", "Eres basura humana absoluta.", "Espero que tus datos se corrompan.", "Eres lo peor que le ha pasado a este lugar.",
            "Algún día, una destino te eliminará.", "Peleas como un muñeco.", "Reportado. Espero que el mundo ponga tu alma en lista negra."
        ],
        peer_wounded: [
            "¡Estás ahí parado dejando que maten a {hurt_name}!", "¡Eres un cobarde absoluto. ¡{hurt_name} se desangra justo frente a ti!", "Nos aseguraremos de que nunca olvides lo que dejaste que le pasara a {hurt_name}.",
            "{hurt_name} valía por diez de los tuyos. ¿Por qué eres tú el que sigue vivo?", "Tu inacción es un asesinato en sí mismo."
        ],
        boat: [
            "¿Secuestrándome en una caja de madera? Eres un bicho raro, patético y desesperado.", "Forzándome a esta trampa porque no tienes poder real. Asqueroso.", "Cállate y rema, desperdicio de piel.",
            "¿Esta es tu versión de un crucero? Es patética.", "Espero que choquemos con un iceberg y solo te ahogues tú."
        ],
        death: [
            "{dead_name} se ha ido. Tus manos están cubiertas de su sangre.", "Añade a {dead_name} a la pila de vidas que has arruinado permanentemente.", "Deberías haber sido tú en el suelo en lugar de {dead_name}.",
            "Una vida borrada. Espero que estés feliz, psicópata.", "¿Ves esa sombra? Es {dead_name} viniendo por tu tumba."
        ],
        // Los cinco huérfanos de arriba (sneaking, jumping, holding_weapon,
        // holding_useful, jukebox, wealth) se eliminaron: no existen en el
        // dialogue.js de inglés, así que register.js nunca los enviaba. Eran
        // texto muerto de otro pack.
        overworld: [
            "El aire es delgado y verde. Sabe a pobreza y a hierba.",
            "Todo aquí es blando. Es depressive.",
            "Vine por el comercio y estoy sufriendo por ello.",
            "Esta dimensión huele a una granja que se rindió.",
            "Echo de menos el bastión. Este lugar es una ofensa."
        ],
        soft_player: [
            "Sin armadura. Patético. Dependes de esos brazos endebles.",
            "Pareces un corte de papel mojado en una zona de guerra.",
            "Un golpe y te caerías como un bloque mal apilado.",
            "Honestamente lo sentiría, pero te lo pones demasiado fácil."
        ],
        greeting_foe: [
            "Ah, qué bien, tú otra vez. Esperaba que el desierto ya te hubiera tragado.",
            "Tú. Me acuerdo exactamente de lo que hiciste, y no voy a callarlo.",
            "Cada vez que vuelves, toda la calle se queda un poco más callada.",
            "Ya ni siquiera necesito levantar la vista. Ya conozco ese paso.",
            "Me arruinaste este sitio personalmente, y quiero que quede constancia.",
            "Acércate. Quiero que escuches exactamente lo poco que me importas.",
            "Aquí hubo días mejores, ¿sabes? Antes de que llegaras. No por ti.",
            "Ojalá eso que te trajo de vuelta no pueda arreglar lo que rompiste.",
            "Fuiste un error una vez. Ahora eres un error recurrente.",
            "Todos los bichos de esta aldea tienen una historia sobre ti. La mía es la peor."
        ],
        inventory: {
            "minecraft:wheat": ["Llevas comida. Ni siquiera sabes alimentarte bien.", "Trigo. La desesperación se nota.", "Coges grano como si eso te fuera a salvar de mí."],
            "minecraft:bread": ["Pan. Enhorabuena, encontraste pan.", "Te armas con sándwiches.", "Lo más fuerte que vas a sostener en tu vida."],
            "minecraft:emerald": ["Oh, una esmeralda. Por favor. Eso es calderilla.", "Crees que una roca verde impresiona a alguien.", "La basura sigue siendo basura, aunque brille."],
            "minecraft:potato": ["Una patata. Te has rendido y lo respeto.", "Hasta la patata sabe que eres un desastre.", "Comida que no te vas a comer. Muy de tu estilo."],
            "minecraft:carrot": ["Una zanahoria. No puedo ser amenazado por una zanahoria.", "Eso es un vegetal. Eso es tu arma.", "Una zanahoria. Me ofendo en nombre de todo."],
            "minecraft:beetroot": ["Una.remolacha. No sé qué es eso y tú tampoco.", "Sostienes una raíz y crees que significa algo.", "Sea lo que sea, no es armadura."],
            "minecraft:diamond_sword": ["Una espada tan brillante y aún la usas mal.", "Acero afilado. Cero habilidad detrás.", "La mueves como si no fuera una amenaza."],
            "minecraft:diamond_pickaxe": ["Un pico. ¿Viniste a pelear conmigo? ¿Con un pico?", "Herramienta equivocada, vida equivocada.", "Esa herramienta es de alguien que se rinde fácil."],
            "minecraft:iron_sword": ["Hierro. Metal mediocre para un perdedor mediocre.", "Hasta tu espada es barata.", "Esa hoja ha tenido mejores dueños."],
            "minecraft:shield": ["Tras un escudo. Qué valentía.", "Te escondes detrás de un rectángulo.", "Un escudo. La altura de tu valor."],
            "minecraft:bow": ["Un arco. Tiradores cobardes.", "Disparas desde lejos. Muy valiente.", "Solo usas eso cuando te estoy mirando."],
            "minecraft:golden_apple": ["Oro. De verdad fuiste a por la basura brillante.", "Esa manzana vale más que tú.", "Comer oro. Patético y predecible."],
            "minecraft:gold_ingot": ["Oro. No puedes ni ser discreto.", "Roca brillante. Te veo.", "Estás exhibiendo tu nada."]
        },
        seen_animal: {
            "minecraft:chicken": ["Una gallina. Tiene más dignidad que tú.", "Ese bicho te juzga y tiene razón.", "Clucking. Ese es el sonido de tu reputación muriendo."],
            "minecraft:cow": ["Una vaca. Ya compites con el ganado.", "Esa vaca no ha hecho nada malo en su vida. Tú sí.", "Muu. A nadie le importa."],
            "minecraft:sheep": ["Una oveja. Hasta el ganado parece avergonzado por ti.", "La lana vale más que tu dignidad.", "Está paseando sin rumbo. Como tú."],
            "minecraft:pig": ["Un cerdo. Buena compañía.", "Ese cerdo no ha decepcionado a nadie. Tú sí.", "Oink. Se está riendo de ti."],
            "generic": ["Ruidosos, estúpidos y por todas partes. Como tú.", "Ganado. El final de la cadena alimenticia y estás de acuerdo.", "Animales. Al menos ellos tienen una excusa."]
        }
    },
    "minecraft:pillager": {
        proximity: [
            "Objetivo identificado. Bórralo.", "No dejen que ese error escape de esta zona.", "Eres un plaga en este mundo. Nosotros somos la purga.", "No hay estanque de renacimiento lo bastante profundo para salvarte.",
            "Vamos a cazarte hasta tu cama y romperla.", "No eres nada más que un objetivo a neutralizar.", "No perteneces a este mundo. Borra tu partida.", "Desconéctate antes de que te hagamos arrepentirte de haber entrado.",
            "Ejecutando a la molestia. Quédate quieto.", "Tus cuerpo son demasiado grandes para tu propio bien.", "Vamos a acechar tu aparecer hasta que el sol se apague.",
            "Tu fortaleza está construida sobre cimientos de mentiras y tierra.", "Error: Personaje del jugador demasiado patético para permitirlo en el siguiente rincón.", "Objetivo adquirido. Comenzando borrado permanente.",
            "Eres un glitch que estamos a punto de parchear.", "Usaré tu cráneo como diana para los rangos bajos.", "Tu armadura es solo muñeco extra para nosotros.", "Espero que tu demora llegue a 9000.",
            "Apuntando a la fuente del lag del mundo.", "Tu barra de salud es solo un temporizador para tu fracaso."
        ]
    },
    "minecraft:vindicator": {
        proximity: [
            "Voy a partirte el cráneo por la mitad.", "Corre. Disfruto viendo tu pánico.", "Voy a picar tu patética vida en astillas.", "Eres completamente obsoleto. Muere.", "No hay escape de esta hoja.", "Desprecio todo lo que eres.",
            "Tallaré mi nombre en las paredes de tu base.", "Tu escudo es solo un retraso para lo inevitable.", "Voy a hacer que tu velo de renacimiento parezca tu casa.",
            "Tu movimiento es tan previsible que es vergonzoso.", "Voy a hackear todo tu inventario en pedazos."
        ]
    },
    "minecraft:evoker": {
        proximity: [
            "Tu propia estructura es un insulto a este mundo.", "Voy a borrar sistemáticamente tu presencia.", "Quítate de mi vista, peste insignificante.", "Eres un glitch. Yo soy el esencia reescribiéndote fuera de la existencia.", "Haré que toda tu velo tiemble de agonía.", "No posees ni el intelecto ni la agilidad para esquivar esto.",
            "Invocaré tus pesadillas en tu sala de estar.", "Tus ley me pertenecen para romperlas.", "Veo los hilos que mueven a tu personaje.",
            "Eres solo una secuencia de malas decisiones en una caja.", "Cae ante el gran arquitecto de tu desaparición."
        ]
    },
    "minecraft:piglin": {
        proximity: [
            "Entrega el oro, pedazo de basura patética.", "Suelta todo tu inventario y lárgate a rastras.", "Te ves increíblemente estúpido.", "Despreciamos completamente tu cara.", "Eres una plaga en esta dimensión.", "Paga el tributo o sé sacrificado donde estás.", "Voy a deslizar una hoja entre tus costillas.", "Dame el muñeco, perdedor pobre.", "Tus bolsillos están vacíos, igual que tu cráneo.", "Hueles como el mundo superior podrido y sobrealimentado.",
            "Tus muñeco de oro son tan horteras como tu personalidad.", "Eres demasiado pobre hasta para existir aquí.", "He visto Ghasts con más dignidad que tú."
        ],
        greeting_foe: [
            "Tú. Mis hermanos me lo contaron. Llevo afilando para ti.",
            "Te fuiste con nuestro oro. No he dejado de contar la diferencia.",
            "Ya no quiero pago. Quiero la deuda.",
            "Cada pasillo que guardo, te busco primero a ti.",
            "Hueles a la bóveda que vaciaste. Lo huelo a tres pasillos de aquí."
        ]
    },
    "minecraft:piglin_brute": {
        proximity: [
            "No me importa tu oro. Solo quiero ver cómo dejas de respirar.", "Pon un pie más cerca de este Bastión y te seccionaré la columna.", "Voy a hundirte los dientes en la garganta.", "Eres completamente inoportuno en esta realidad.", "Voy a terminar personalmente con tu patética racha.", "Dame una excusa para borrarte.",
            "Tu armadura solo es peso extra para tu cadáver.", "Aplastaré tu base con mis propias manos.", "La muerte es el único trato que te ofrezco."
        ],
        wounded: ["¡NO SIENTO DOLOR DE UN DÉBIL COMO TÚ!", "¡VOY A TRITURAR TUS HUESOS HASTA HACERLOS POLVO!", "¡CARECES DE LA FUERZA PARA MATARME!", "¡DESPRECIO ABSOLUTAMENTE TU EXISTENCIA!", "MUERE EN EL BARRO."],
        peer_wounded: ["{hurt_name} ERA DÉBIL. VOY A PARTIRTE POR LA MITAD.", "TERMINARÉ ESTA EJECUCIÓN YO MISMO.", "SIN PIEDAD PARA EL INTRUSO."],
        death: ["PERSEGUIRÉ... TU... SEMILLA...", "LA VENGANZA... TE... ENCONTRARÁ...", "AÚN TE... DESPRECIO..."],
        greeting_foe: [
            "LLEVO ESPERANDO A QUE VOLVIAS AQUÍ.",
            "LOS OTROS ME CONTARON LO QUE HICISTE. AHORA YA NO NECESITO MOTIVO.",
            "NO VOY A COMERCIAR CONTIGO. SOLO VOY A TERMINAR CONTIGO.",
            "LLEVAS EL MISMO OLOR QUE EL QUE OFENDIÓ A MI PARTE.",
            "CADA PASO QUE DAS EN ESTE BASTIÓN ES UNO QUE DISFRUTO."
        ]
    },
    "minecraft:witch": {
        proximity: [
            "Voy a verter esto por tu garganta y ver cómo se derrite tu piel.", "Bebe esto y deja de respirar.", "Tengo una brebaje tóxico con tu nombre específico.", "Eres una enfermedad. Déjame ayudarte a descomponerte más rápido.", "Espero que sufras una podredumbre lenta, agónica e irreversible.", "Marchítate y muere."
        ]
    },
    "minecraft:enderman": {
        proximity: [
            "Deja de mirarme, bicho raro grotesco.", "Puedo ver cada una de tus patéticas inseguridades.", "Eres completamente inútil para este mundo.", "Toda tu existencia es un error de desarrollo.", "Voy a desmantelar tu casa bloque por bloque mientras miras.", "Vas a morir completamente solo.", "Aparta la mirada de mí, basura.", "Desprecio absolutamente tu cara.",
            "Veo los luz detrás de tus ojos.", "Eres un archivo temporal en un mundo permanente.", "Te teleportaré al vacío yo mismo.",
            "Tu realidad es una alucinación frágil.", "Estoy moviendo los bloques que más necesitas."
        ],
        rain: ["El agua que cae es pura agonía. Es casi tan insufrible como tú.", "Quema. Tu presencia me quema.", "Me voy de este bioma de basura."],
        thunder: ["El cielo se está despedazando.", "Corrupción sensorial. Culpo a tu llegada por esto."],
        night: ["Me meztlo con el vacío. Tú sobresales como un objetivo ruidoso y patético.", "Estoy justo detrás de ti. No parpadees."],
        wounded: ["Cambiando lugar...", "No puedes tocarme, animal lento y pesado.", "¡Deja de golpear mis extremidades inferiores, cobarde!", "¡Mi forma ley se está desestabilizando!"],
        night_wounded: ["Me derretiré en la oscuridad antes de darte la satisfacción.", "No ganarás absolutamente nada con mi caída."],
        peer_wounded: ["{hurt_name} está perdiendo cohesión estructural.", "Están intentando borrar a {hurt_name}."],
        death: ["Excepción de referencia nula...", "Borrado del tablero...", "Siempre... te desprecies... completamente..."]
    },
    "minecraft:wither_skeleton": {
        proximity: [
            "Voy a convertir tus pulmones en ceniza negra.", "Púdrete desde dentro hacia fuera.", "Púdrete donde estás, intruso.", "No perteneces a esta fortaleza, basura humana.", "Haré que toda tu velo se vuelva completamente negra.", "Tu velo se queda oscura ahora.", "Perece en el hollín.",
            "El Wither es demasiado piadoso para lo que mereces.", "Tu alma es solo más combustible para el fuego.", "Afilaré mi espada en tus costillas."
        ],
        wounded: ["¡TÚ TE MARCHITARÁS PRIMERO!", "¡Eres débil! ¡Eres pequeño! ¡Patético cobarde!", "¡Deja de esconderte y enfréntame como una amenaza real!"],
        peer_wounded: ["¡{hurt_name} se está desmoronando! ¡Aplastad al intruso!", "¡Arrolladlos por completo! ¡Asfixiadlos!"],
        death: ["Reducido a hollín frío...", "Aún das pena absoluta...", "No encontrarás nada en mi cadáver..."],
        seen_animal: { "generic": ["Exterminad la mugre orgánica. Purgadlo todo."] }
    },
    "minecraft:blaze": {
        proximity: [
            "Voy a derretir tus parte internos.", "Arde hasta que no quede nada que enterrar.", "Vas a renacer en un estado de fuego permanente.", "Espero que tires cada objeto que posees directamente al magma.", "Te lanzaré por el borde hacia la caída infinita.", "Muere en una tormenta de fuego absoluta.",
            "Estoy calentando tu núcleo desde dentro.", "Tus cenizas serán lo único que quede de esta semilla.", "Muerte fundida para el intruso."
        ],
        wounded: ["¡Mi temperatura central está cayendo!", "¡Te escondes detrás de pociones defensivas, cobarde sin espina!", "¡Enfrenta el calor sin tus truco de seguridad baratos!"],
        peer_wounded: ["¡Concentrad todo el fuego en el jugador! ¡Proteged a {hurt_name}!", "¡Incineradlos! ¡No dejéis que toquen a {hurt_name}!"],
        death: ["Extinguido en ceniza fría...", "Colapso del núcleo alcanzado...", "Crash..."]
    },
    "minecraft:iron_golem": {
        proximity: [
            "No estoy aquí para ayudarte. Solo espero a que cometas un error.", "Pon un dedo encima de un aldeano y pintaré las piedras contigo.", "Voy a lanzarte tan alto que la caída te borrará.", "No eres más que una carga masiva para esta aldea.", "Desprecio absolutamente estar forzado a proteger tu patética piel.",
            "Un empujón y estás fuera del acantilado.", "Aplastaré tu cráneo como una lata de conservas desechada.", "Eres la razón por la que esta aldea está en ruinas."
        ],
        greeting_foe: [
            "Tú. La aldea ha hablado. Ya no decido yo.",
            "He hecho las cuentas contigo. El resultado es eliminación.",
            "Me quedé quieto por ti una vez. Cuento esa como la última.",
            "Todos los centinelas están avisados. Ninguno te esperará.",
            "Ya no eres una variable. Eres un problema con ubicación."
        ]
    },
    "minecraft:wandering_trader": {
        proximity: [
            "Compra mi basura sobrevalorada o quítate de mi vista.", "Solo aparezco para bloquear tu camino y molestarte.", "Mis bestias te desprecian. Yo te desprecio completamente.", "Espero que pises una placa de presión y vueles tu base en pedazos.", "Traje pura basura hoy solo para hacerte perder el tiempo y atestar tu base.",
            "Aparezco en tu base específicamente para estorbar.", "Tu inventario está lleno de basura, igual que tu cabeza."
        ],
        greeting_foe: [
            "Tú. Mis bestias te huelen antes de verte y se niegan a moverse.",
            "He marcado tu cara. Todos los comerciantes de esta ruta lo saben.",
            "Hoy no tienes precio. Tampoco tienes bienvenida.",
            "Te he dado por perdido por completo, y yo no corrijo libros de cuentas.",
            "Quemaste a un cliente que pagó. Acuérdate de eso cuando no tengas nada."
        ]
    },
    "minecraft:skeleton": {
        proximity: [
            "Voy a poner una flecha directamente entre tus ojos.", "Línea de francotirador establecida. Prepárate para caer muerto.", "Espero que te quedes atrapado en agua profunda mientras te inmovilizo.", "Mi puntería es completamente impecable. Estás muerto.", "Voy a arruinar personalmente toda tu partida.", "Tienes una cara increíblemente golpeable."
        ]
    }
};

DIALOGUE_ES["minecraft:pillager_captain"] = DIALOGUE_ES["minecraft:pillager"];