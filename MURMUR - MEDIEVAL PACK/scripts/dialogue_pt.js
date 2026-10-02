// --- RANDOM NAME POOLS (PORTUGUÊS - BRASIL) ---
export const VILLAGER_NAMES_PT = [
    "Aldous", "Giles", "Godric", "Osric", "Wymond", "Bartolomeu", "Hodge", "Pate", "Clemente", "Jocelyn", "Drogo", "Rulf",
    "Lamberto", "Winifreda", "Gervasio", "Piers", "Anselmo", "Benedito", "Cutberto", "Eldred", "Milo", "Geofredo", "Dunstan", "Reynold",
    "Seward", "Bram", "Gull", "Finch", "Wray", "Walter", "Huberto", "Gavin", "Cedric", "Silvestre", "Rowland", "Tristão"
];

export const GOLEM_NAMES_PT = [
    "Égide", "Blindado", "Portador de Ferrugem", "O Guardião", "Nascido na Forja", "Mão Pesada",
    "Sentinela", "Coração de Aço", "O Vigilante", "Rocha", "Bigorna", "Tito", "Gideão",
    "Castelão", "Paladino", "Baluarte", "Guarda de Ferro", "Monolito"
];

// --- DIALOGUE DATABASES (PORTUGUÊS - BRASIL) ---
export const DIALOGUE_PT = {
    "minecraft:villager_v2": {
        proximity: [
            "Bênçãos dos Oito sobre vós, caminhante.", "Uma aura estranha vos sombreia...", "Contemplai vossa carga, amigo — carregais demais?", "O que traz um aventureiro de volta à nossa humilde morada?",
            "Bom dia, viajante. Que novidades trazeis?",
            "A colheita é abundante nesta estação, pela graça dos céus.",
            "Sois um cavaleiro de algum reino distante? Vosso porte é nobre.",
            "Cuidai na floresta à noite; as sombras movem-se onde não deveriam.",
            "Tenho um pressentimento estranho sobre essas nuvens. Uma tempestade se aproxima.",
            "Vistes §gO-Ferreiro§r? Estava procurando seu martelo.",
            "Vosso/ vossa {item} está curiosamente fabricado/a. É do longínquo oriente?",
            "Pareceis {health}. Por favor, descansai um pouco na taberna.",
            "Os sinos soarão ao meio-dia. Marcai bem a hora.",
            "Os gólems protegem vossas terras tão bem quanto as nossas?",
            "Vi §gPike§r junto ao velho poço. Falou de um/uma {item} encontrado/a nas profundezas.",
            "Um dia alegre para um passeio sob o sol, não é?",
            "Que vossa espada permaneça afiada e vosso espírito firme."
        ],
        sneaking: [
            "Por que vos agachais nas sombras, viajante?", "Sois um assassino ou apenas tímido?", "Vosso comportamento é o mais curioso... detende vossa mão.",
            "As sombras não são lugar para uma alma nobre.", "O que buscais no pó?", "Estais a brincar de ser um fantasma?"
        ],
        jumping: [
            "Um salto ágil, bom senhor!", "Tendes a graça de uma gazela, {name}.", "A pressa traz o desperdício, abrandai vosso passo.",
            "Estais a treinar para o torneio?", "Que molejo tendes em vosso passo esta manhã!", "A gravidade deste reino parece leve para vós."
        ],
        holding_weapon: [
            "Uma fina lâmina tendes aí.", "Vosso/ vossa {item} brilha como o próprio sol.", "Sois um cavaleiro do reino?",
            "Mantende vosso aço na bainha a menos que vos vejais ameaçado.", "Uma arma de grande qualidade, sem dúvida.", "Ireis defender a fronteira, presumo."
        ],
        holding_useful: [
            "Conferindo a hora? Os sinos soarão em breve.", "Um mapa do reino, vejo. Estais perdido?", "Tendes bom olho com esse telescópio.",
            "Ferramentas finas para um fino viajante.", "O conhecimento é o maior tesouro de todos.", "Para onde vos leva vosso caminho hoje?"
        ],
        jukebox: [
            "Uma melodia alegre para um dia alegre!", "Os bardos teriam inveja de tal aparelho.", "A música é o alimento do amor, continuai tocando!",
            "Não ouço tal melodia desde o festival da primavera.", "Uma caixa mágica de canções! Verdadeiramente uma maravilha."
        ],
        wealth: [
            "Diamante dos altos cumes! Uma vista rara.", "Vosso tesouro deve ser vasto com efeito, {name}.", "Um monumento dourado a vossas nobres façanhas.",
            "A vila brilha com tais riquezas por perto.", "A riqueza traz tantos amigos quanto inimigos, cuidai."
        ],
        rain: [
            "A lama estraga a fornada diária...", "Minhas boneco de couro estão completamente encharcadas.", "O mesmo lodo se torna um pântano traiçoeiro.", "Cuidado ao pisar, o caminho de pedra está escorregadio.",
            "A terra bebe profundamente; a colheita será generosa.", "Este clima úmido arruína minha túnica de lã fina.", "Os céus choram sobre estas terras esquecidas.",
            "Os nevoeiros da montanha pousam sobre nossos telhados de palha hoje.", "Minhas velhas articulações doem terrivelmente antes do dilúvio.", "O aguaceiro apaga todo rastro e traição."
        ],
        thunder: [
            "A ira dos céus se desencadeou!", "O céu golpeia com furiosos raios!", "Abrigai-vos! {name}, salvai-vos!", "Os deuses da tempestade exigem sangue!",
            "Um carvalho poderoso foi partido ao meio!", "A tempestade torna a meia-noite num meio-dia flamejante.", "Buscai refúgio sob as pesadas capas tecidas!",
            "Esse trovão terrível sacode os próprios alicerces de minha tenda!", "O fogo celestial busca presa!", "Mantende-vos longe das portas de ferro, {name}!"
        ],
        night: [
            "O crepúsculo recua; as sombras reclamam a terra.", "{name}, trancastes as pesadas portas de carvalho?", "Ouço o tinir profano de ossos ímpios lá fora.", "A escuridão que espreita move-se com malícia...",
            "Mantende-vos longe das janelas; o mal caminha pelas veredas.", "O descanso me foge enquanto os condenados gemem nos campos exteriores.", "Flechas negras voam densas pelo ar da meia-noite.",
            "Fiéis engendros arranham a alvenaria de pedra com longas garras.", "A lua pende acima como um escudo pálido e congelado.", "Não olheis aos olhos dos altos e sombrios caminhantes.",
            "Os mortos inquietos batem em nossas maçanetas de ferro.", "Se nossas tochas falhassem, a escuridão nos engoliria número.", "Senti um olhar maligno por baixo da estrutura de madeira.",
            "As vis abominações explosivas espreitam as veredas, {name}!", "O amanhecer se aproxima?", "Escalam as muralhas! Estão sobre o telhado!",
            "Os vis aracnídeos tecem suas redes por perto...", "Não vos aventureis no selvagem, {name}!", "O abismo nos rodeia... escutai-me, {name}!", "Quem ousa deixar a porta do santuário aberta?!",
            "Um espectro oco olha através dos painéis de vidro fosco.", "Embora meu leito seja macio, os muros do castelo gemem com inquietação."
        ],
        wounded: [
            "Minha força se desvanece...", "Matai-os! Que alguém me socorra!", "Minha força vital se derrama sobre as pedras...", "Um frio mortal me invade...", "Minhas pernas já não suportam meu peso...",
            "Titubeio... meus joelhos fraquejam...", "Há um curandeiro entre vós? Minha vista se turva...", "Informai o cartógrafo... vi a borda absoluta...",
            "Não me deixeis aos corvos!", "Ai! A rocha afiada mordeu fundo!", "Por que o caminho é tão perigoso?", "Sofri uma queda estrondosa...",
            "Meu coração... seu ritmo constante me falha...", "Uma névoa carmesim turva minha visão!", "Minha vitalidade se esvai!",
            "Piedade, meu crânio... soltou-se alguma pedra do parapeito?", "Não estou em condições de regatear mercadorias...", "A ferida arde com uma mordida venenosa!", "Meus ossos rangeram de forma a mais antinatural!"
        ],
        night_wounded: [
            "O sudário da noite velam minhas feridas...", "Não me deixeis perecer nesta escuridão ímpia.", "As sombras que espreitam infetam meus cortes abertos!",
            "Trazei uma tocha... titubeio!", "Emergem da negrura absoluta, {name}!"
        ],
        alone: ["Onde estão os guardas? Onde está todo o mundo?", "Desgosta-me estar separado da segurança do sino paroquial.", "Se o draugr atacar agora, nenhuma alma ouvirá meu grito.", "Um silêncio ominoso paira sobre o vale..."],
        crowded: ["Esta câmara é sufocantemente estreita, {name}.", "Cessai vosso empurrão, amigo.", "Não há quartel aqui... nenhum...", "Cuidado com vossos esporões, senhor!", "Muitas mãos ansiosas reclamam minha mercadoria."],
        on_fire: ["AS CHAMAS CONSUMEM! MINHAS VESTES ARDEM!", "Água! Trazei os baldes do poço!", "PELA FORJA, ESTão-ME ASSANDO VIVO!", "Meu traje tornou-se cinza!", "Socorro! O incêndio se alastra pelas madeiras!"],
        poor: ["Minha bolsa de moedas está lamentavelmente leve hoje...", "Sem ouro, não há folga do trabalho honesto...", "Baratei toda uma colheita e mal recebi uma miséria...",         "Não possuo nem um pedaço de pederneira.", "Se o castelão perguntar, jurai que meus impostos estão por chegar."],
        rich: ["Os maravedis de ouro tintinam alegremente a cada passada, {name}.", "Uma colheita real. Mantende-a oculta de olhos de bandidos.", "Estas gemas brilhantes... um tesouro pesado.", "Se os saqueadores romperem os muros, minha perda será absoluta.", "Minha tesouraria está cheia."],
        nether: ["O solo aqui é carmesim e grita de tormento.", "Esta é uma visão imunda do inframundo, {name}.", "Por que feitiçaria a água é espessa e laranja derretida?!", "O ar sulfuroso queima meus próprios pulmões!", "Os porcos deste reino andam eretos como homens!"],
        wounded_vs_zombie: [
            "Os mortos imundos buscam minha carne! {name}, desembainhai vosso aço!", "O fedor da carne podre... sufoca!", "Recuso-me a erguer-me como um desses ghouls profanos!",
            "Sua pele corrompida se desprende sobre minha túnica!", "A fome do vazio está em seus olhos...", "Deuses, tinha o rosto de nossa linhagem!",
            "{name}, é esse vosso rosto? POR QUE BATEIS EM VOSSO IRMão!", "Recua, besta imunda! Não sou ração para os mortos!", "O engendro rasga meu casaco de linho!", "Zombaria? Tomou a praga vosso juízo?!",
            "Vossas mandíbulas são um poço de podridão!", "Por que geme assim a criatura?!", "Despedaça-me os braços com fúria selvagem!", "Socorro! Nosso primo esfarrapado sucumbiu à loucura!", "Descanse tua alma, amigo! Rende-te! Rende-te!"
        ],
        wounded_vs_illager: [
            "Os saqueadores rompem as portas! Refugiai-vos!", "Piedade! Tomai toda minha prata, só detendei vossas lâminas!", "Suas machadinhas... não conhecem quartel!",
            "Os demônios de pele cinzenta escarnecem de nosso pesar!", "Desceram dos bosques profundos e esquecidos...", "Meus campos! Pisaram a generosidade do senhor!",
            "A que vem essa hostilidade?! Somos do mesmo sangue!", "Fugi para a fortaleza de pedra!", "Estão a estilhaçar as portas!",
            "Os lobos cinzentos voltaram a saquear!", "Onde está nosso protetor de ferro?!", "Retirai vossos olhos de meu baú fechado!", "O corno de guerra ressoa pelo vale!",
            "Se desmantelardes minha forja, os preços devem refletir a perda!", "Embainhai vossa besta, bandido!", "Não podeis simplesmente saquear meu domínio!",
            "Minhas raízes! Pisoteais-nas, {name}!", "Detendei essa machadinha malvada, vos rogo!", "Ainda podemos negociar termos de tributo!",
            "Arruínais minha reputação com o jarl!", "Sou um homem simples, não levo flechas!", "A guarda da cidade ouvirá deste ultraje!", "PELOS DEUSES, essa não é forma de apresentar um tributo!",
            "Ai! Meu livro de contas não tem lugar para tal violência!", "O pacto não foi selado!", "É isso um machado de ferro temperado?! Piedade!",
            "Alto! Estais a derramar sangue em meu inventário!", "Um tipo de câmbio da mais traiçoeira!", "A ferida grave não é moeda, camarada!"
        ],
        wounded_vs_player: [
            "Por que traís vosso juramento para conosco, {name}?!", "Contávamos convosco como aliado, {name}!", "Colheis nossos cultivos e agora derramais nosso sangue?!",
            "Oferecemos-vos porto seguro! Detende vossa mão!", "O herói de vanguarda {name} tornou-se tirano!", "Ai... troquei-vos minha melhor gema por essa traição!",
            "Erguestes nossas defesas! Por que agora me bateis até cair?!", "O mestre construtor sucumbiu à sede de sangue!", "Concedi-vos o uso de meu próprio lar, {name}!",
            "Respeitamos os limites de vossa propriedade!", "Por que empregais tão magnífica armadura de placas contra um aldeão?", "O aventureiro silencioso carrega uma lâmina amaldiçoada hoje!",
            "Trazeis ruína e vermelha ira a nossas terras! Piedade!", "É isto vingança por uma colheita pobre?", "Não posso ajudar quando os armazéns estão vazios!",
            "Tomai todos meus bens mundanos, {name}, só perdoai minha vida!", "O feudo é vosso! Cessai essa massacre!", "Vi-vos a pisar as betterrabas do senhor, e ainda assim guardei silêncio!",
            "Posso avivar os fornos! Pães frescos para vossa viagem!", "Não quis ofender com meus preços altos!", "Meus fardos não contêm senão semente comum!", "Baixarei os dízimos! Rendo-me!"
        ],
        peer_wounded: [
            "Mantende-vos firme, {hurt_name}! Os guardas vêm!", "{hurt_name} está gravemente ferido! Ao seu lado!", "Estão a fazer em pedaços {hurt_name}!", "Recuai de {hurt_name}, demônios!",
            "Soai o alarme! Invocai o grande sentinela!", "Não cedais à escuridão, {hurt_name}!", "Acuaram {hurt_name} junto à forja do ferreiro!", "Foge, {hurt_name}! Busca santuário na capela!",
            "Prenderam {hurt_name} junto às obras exteriores!", "Pelos deuses! {hurt_name} ainda deve tributo à minha casa!", "Defende-os, {hurt_name}!",
            "{hurt_name} está a brilhar com uma túnica mágica! Que feitiçaria é esta?!", "Defendei o ateliê de {hurt_name} com vossas vidas!", "Socorro! {hurt_name} está a espalhar seu inventário real!",
            "Batem em {hurt_name}! Um golpe catastrófico para nosso comércio!", "Foge, {hurt_name}, atrás das madeiras trancadas!", "O próprio solo fere {hurt_name}!",
            "Levantai-vos, {hurt_name}! As abóboras do senhor devem ser colhidas!", "Ai, as finas vestes de mercador de {hurt_name} estão arruinadas!", "Entregai-lhes a colheita, {hurt_name}!",
            "Por que {hurt_name} faz o som de cerâmica quebrando?!", "Não fecheis vossos livros de comércio, {hurt_name}!", "Assegurastes o contrato antes de cair?!",
            "O errante fura {hurt_name} com uma pica cruel e afiada!", "Refugiai-vos atrás dos fardos de feno, {hurt_name}!", "Rápido, passai a {hurt_name} algo de sustento!",
            "Estão a saquear os bens mundanos de {hurt_name}!", "Olhai {hurt_name}! Cai sobre a terra!", "Mantende-vos longe desse aparelho de madeira volátil!",
            "Estão a destruir o sustento de {hurt_name}!", "Rápido! Lançai a {hurt_name} uma raiz restauradora!", "Os coletores de impostos estão a auditar {hurt_name} com aço!",
            "Por que colapsa {hurt_name} fora de seus esporões?!", "Informai-os de que não tratais com paus baratos e afiados!"
        ],
        boat: [
            "Com que propósito nos sentamos nesta vasilha de madeira sobre terra seca?", "Para onde viajamos? Aguarda-nos um lar quente?", "Minha armadura aperta forte contra meu queixo, {name}.",
            "Permanecemos imóveis, contudo a paisagem muda por alguma ilusão...", "Estamos destinados ao mar?", "Esta é uma vasilha notavelmente confinada.", "Não me lanceis ao escuro e profundo abismo!",
            "Acho esta madeira flutuante... aceitável?", "Não há rodas de ferro nesta nau!", "Se o draugr nos cercasse, estaríamos presos como aves."
        ],
        death: [
            "Soberanos do além! {dead_name} caiu!", "{dead_name} partiu deste plano mortal.", "Suas possessões terrenas jazem espalhadas pela relva...", "Tocai o sino paroquial por {dead_name}!",
            "Nosso assentamento se torna menor... boa viagem aos salões de outrora, {dead_name}.", "Seu lugar junto ao fogo estará vazio esta noite.", "Ai, todo o patrimônio de {dead_name} caiu à terra!",
            "Quem cuidará agora dos campos de cultivo do senhor?!", "Foram reduzidos a mero saque!", "Nosso grêmio comercial está quebrado!",
            "Pelos deuses! {dead_name} nunca viveu para ver sua última colheita!", "Seu posto de trabalho fica abandonado...", "Colapsou no lodo e não se levantou mais!",
            "Perdemos um grande mestre do ofício!", "A posição de nosso assentamento diminuiu!", "Desvaneceram-se no fumo e na memória!",
            "Olhai sobre o solo... todas as sementes de {dead_name} jogadas!", "Nem uma moeda trocada... nem um pacto selado... só pão espalhado..."
        ]
    }
};

DIALOGUE_PT["minecraft:pillager"] = {
    proximity: [
        "Ali está nossa presa.", "Cortai sua retirada.", "Carrega relíquias de grande valor.", "Saqueai-o.", "Pegai fogo à torre.", "Não deixe mais que cinza.", "São indignos de tamanha riqueza.",
        "São fracos. Incapazes de governar.", "Um cerco fácil.", "Este feudo é nosso por direito.", "O prêmio foi encontrado.", "Tomamos pelo aço, mantemos pelo sangue.", "O aventureiro retorna mais uma vez...",
        "Por que o engendro se recusa a ficar no túmulo?", "Alguma magia negra o amaldiçoa.", "Estendei cordas! Fogo!", "Sinto cheiro de prata e covaria.",
        "O corno de guerra soa ao avanço.", "Olhai seus tugúrios patéticos.", "O Capitão exige cabeças em lanças.", "Talhamos nossas vitórias na pedra antiga.",
        "Não deixe nem um talo de trigo em pé.", "O herói crê ser o único senhor que pode dar forma a esta terra.",
        "O estalo da pesada besta é música doce.", "Vigiai de perto os machadores.", "Este assalto é só recolher o que nos é devido.",
        "Cada muro de fortaleza não é mais que uma futura ruína.", "Esqueceram que nós comandamos o fogo fátuo.", "Não lhes deis quartel! Derrubai-os!"
    ]
};

DIALOGUE_PT["minecraft:vindicator"] = {
    proximity: [
        "Aproximai-vos.", "Rendei-vos agora.", "Huis de vossa última batalha.", "Descobri-vos.", "O fio de meu machado de ferro tem sede.", "Não haverá paz.", "Fazei em lascas suas portas!", "Não preciso de besta para tratar de vós.", "Somos os verdadeiros mestres do reino.", "Vossas torres não são mais que simples troncos.", "MORRE, COVARDE!"
    ]
};

DIALOGUE_PT["minecraft:evoker"] = {
    proximity: [
        "Procedei com o ritual.", "Mais uma vez.", "Cairão ante nós.", "A hierarquia deve ser obedecida.", "Os próprios caninos da terra obedecem meu conjuro.", "Reduzirei vossa essência a nada.", "Voa, meus espíritos malévolos.", "A carne não é mais que um vaso temporário.", "Wololo...", "Nenhuma armadura pode proteger-vos da terra."
    ]
};

DIALOGUE_PT["minecraft:piglin"] = {
    proximity: [
        "Mais ouro para o tesouro.", "O ouro mantém a vida dentro de vós.", "Ele acumula o ouro sagrado...", "Não confieis neste errante.", "Esconde algo brilhante.", "Vigiai suas mãos.", "Negociareis com ouro?", "Um mau negócio...", "O metal precioso nos mantém a salvo.", "O ouro vos vigia.", "Este reino é cegadoramente brilhante.", "Mantende a besta engatilhada.", "O magma corre quente hoje.", "Derrubamos os que carecem do metal brilhante.", "Oferecei-nos as moedas de ouro.", "Cheirais à podridão do mundo superior.", "O Bastião vigia."
    ]
};

DIALOGUE_PT["minecraft:piglin_brute"] = {
    proximity: [
        "A passagem está proibida.", "Mantende-vos longe deste torreão.", "Este domínio é meu.", "Caminhastes rumo a vossa tumba.", "Não trato com comércio. Eu esquartejo.", "Vossa cabeça adornará nossas lanças.", "Um machado massivo para ladrões de pouca monta.", "Pela glória do Bastião!", "Pareceis macio, aventureiro.", "Meu machado de batalha não negocia.", "O muro da fortaleza aguarda vosso cadáver."
    ]
};

DIALOGUE_PT["minecraft:witch"] = {
    proximity: [
        "Falta um ingrediente no caldeirão.", "Bebi desta colheita... ou provai minha ira.", "O corpo físico lembra a maldição.", "Enxofre e pó de pedra vermelha.", "O pântano conhece vosso verdadeiro nome.", "Olhai vossa pele pálida... vamos curá-la.", "Meus familiares veem através da escuridão.", "Dobra, dobra, labuta e aflição.", "A gente simples expulsou-me de sua paróquia.", "Não toqueis meus frascos de veneno."
    ]
};

DIALOGUE_PT["minecraft:enderman"] = {
    proximity: [
        "Atravessei outros planos de existência.", "Não olheis demasiado tempo ao abismo.", "Esta lugar está incorreta.", "Minha forma é instável neste reino.", "Os olhos ardem quando nossos olhares se cruzam.", "Por que aferrais blocos que pertencem à terra?", "As antigas colunas... vós as desmantelastes.", "Um mar infinito de sombra violeta.", "Não olheis meus ossos alongados."
    ]
};

DIALOGUE_PT["minecraft:wither_skeleton"] = {
    proximity: [
        "Matai os vivos.", "Destroçai seus ossos.", "ENFRENTO O INTRUSO.", "Cinza e pó de carvão enchem nossas costelas.", "Esta fortaleza pertence aos mortos.", "Minha espada larga anseia carne.", "Um crânio antigo para o tributo do mestre.", "Nosso senhor despertará em breve.", "A podridão da cripta vos tomará.", "Sendas de pedra de tormento.", "Um intruso rompe nossa torre escura."
    ]
};

DIALOGUE_PT["minecraft:blaze"] = {
    proximity: [
        "Arderei eternamente.", "Percebo todas as assinaturas térmicas.", "Vossa carne congela.", "Voltas dão as varas elementais.", "Filhos da grande forja.", "Ponto de fusão alcançado.", "A rede térmica detecta um frio do mundo superior.", "Sequência de ignição iniciada.", "Sangrai vosso fogo líquido."
    ]
};

DIALOGUE_PT["minecraft:iron_golem"] = {
    proximity: [
        "A placa de ferro se mantém firme.", "Protegei os plebeus inocentes.", "A ferrugem nunca dorme nesta vigília.", "Pisai suavemente; não molesteis as papoulas.", "As crianças ofereceram-me uma flor de paz."
    ]
};

DIALOGUE_PT["minecraft:wandering_trader"] = {
    proximity: [
        "Segui caminhando, viajante...", "Minhas bestas de carga recusam parar de cuspir.", "Atravessei as bordas literais do mapa."
    ]
};

DIALOGUE_PT["minecraft:skeleton"] = {
    proximity: [
        "*um tinir profano de ossos*", "O vento de inverno assobia entre minhas costelas.", "Meu aljava arde por cálcio...", "A corda de meu arco está tensa e seca.", "Ainda lembro quando vestia a pele de um homem."
    ]
};
