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
        greeting_foe: [
            "Vós outra vez, e ainda não sois bem-vindo nestes campos.",
            "Não olvidarei o que as vossas mãos fizeram, amigo ou inimigo.",
            "A aldeia conta as suas sebes. Vós contais de outra maneira.",
            "Mantenha a distância da minha porta. Aqui não há colheita para vós.",
            "Lembramos. Esse é o problema que temos."
        ],
        soft_player: [
            "Pano e esperança. Os campos perdoam essa armadura.",
            "Não trazes ferro. Nem, creio, muito cuidado.",
            "Um peregrino, pelo aspecto. Bem-vindos, mas com fome.",
            "Mãos nuas e coração cheio. Isso já serviu a alguns.",
            "Um lavrador, talvez. Então somos do mesmo ofício."
        ],
        armored_player: [
            "Aço e uma montada! O alcaide-vos pedirá o vosso nome.",
            "Sois soldado, então. Deus vos guarde da minha casa.",
            "Ferro como esse custa a uma aldeia uma colheita inteira.",
            "Saúdo-vos, senhor. Não confio em vós, mas saúdo-vos.",
            "Um cavaleiro no meu cevadal. O dia torna-se estranho."
        ],
        
        inventory: {
            "minecraft:wheat": [
                "Os talos sussurram-me antigas profecias.",
                "Trago o ouro da terra.",
                "Isto pertence à minha herdade.",
                "Traz o aroma da terra aquecida pelo sol.",
                "Cultivado a partir de uma única semente de vida.",
                "Isto é para o dízimo do senhor?",
                "Agora só preciso da bancada de trabalho.",
                "Porque amadureceram tão depressa?",
                "As feras selvagens seguem o meu rasto?",
                "A minha bolsa cheira a um celeiro bem cuidado."
            ],
            "minecraft:bread": [
                "Trago alimento... louvor lhe seja.",
                "Tenho de partir o pão... as forças faltam-me.",
                "Já comi a minha ração?",
                "O meu vigor esgota-se. Preciso de sustento.",
                "Cáscara rija por fora, miolo tenro por dentro.",
                "Três feixes de trigo foram sacrificados por este pão.",
                "Não grita, nem sede de sangue tem.",
                "Não hei de ser devorado se estiver bem provido!",
                "Um pão perfeito para um mundo ordenado.",
                "Fui eu que o cozi, ou caiu do céu para a minha bolsa?"
            ],
            "minecraft:emerald": [
                "Que nenhum ladrão lhe ponha os olhos. É meu direito soberano.",
                "Ganhei esta moeda pelo comércio honesto.",
                "Agora pertence ao meu tesouro.",
                "Algum viajante a deixou cair... reclamei-a por lei.",
                "A única gema que conserva o valor.",
                "Esta gema cintilante exige melhor preço às corporações.",
                "A esmeralda dorme na minha bolsa!",
                "Vale pelo menos doze raízes frescas.",
                "Não assinei nenhum livro e a pedra é minha!",
                "Se a perder, perco o meu prestígio perante o jarl."
            ],
            "minecraft:potato": [
                "Uma humilde raiz desenterrada da lama.",
                "Que os bandidos não pisem a colheita do senhor!",
                "É esta a raiz maldita que faz a minha vista cintilar?",
                "Há de vender-se por bom preço no mercado.",
                "Tem olhos e, ainda assim, não vê as abominações.",
                "Colhida dos sulcos profundos."
            ],
            "minecraft:carrot": [
                "Pontuda, dourada e doce.",
                "Trago as raízes estaladiças da terra.",
                "Cultivei-a eu, ou a terra deu-a por magia?",
                "Uma colheita simples para um camponês simples.",
                "Cresceu direita dentro da terra escura.",
                "Se trocar estas, ganharei belas gemas."
            ],
            "minecraft:beetroot": [
                "A beterraba rubra mancha a minha gibão.",
                "Os senhores a prezam menos do que um bom pão.",
                "O próprio sangue da terra.",
                "Para que colhi esta raiz?",
                "Uma colheita pesada e redonda.",
                "Trago a colheita sangrenta do vale."
            ]
        },
        seen_animal: {
            "minecraft:chicken": [
                "Essa galinha olha-me com uma intenção antinatural...",
                "Deixa de cacarejar, ave.",
                "Farei bom negócio com as suas penas.",
                "Caminha o terreiro como se a propriedade fosse sua.",
                "As galinhas são as únicas criaturas que nunca duvidaram de mim."
            ],
            "minecraft:cow": [
                "A mastigar o cudo sem parar.",
                "A pele é grossa; dará bom couro.",
                "Cala-te, besta, perturbas a colheita.",
                "Um animal paciente. Sobreviveu a homens melhores do que eu.",
                "Não sabe o preço da carne e não lhas direi."
            ],
            "minecraft:sheep": [
                "A tua lã cresce espessa, {name}; já está pronta para a tesoura.",
                "O gado cessou os seus chamados naturais.",
                "Saberá a criatura que estamos presos neste reino?",
                "Nas histórias antigas as ovelhas foram as primeiras a serem nomeadas.",
                "Está sob a chuva e não parece importar-se. Sábia besta."
            ]
        },
        overworld: [
            "A terra é mole aqui e o ar não sabe a nada.",
            "Sem torres, sem juramento, sem ordem. Os campos simplesmente estendem-se até onde acabam.",
            "Caminhei desde a alvorada e não vi pedra que mereça o nome.",
            "O verde é exaustivo. Nada aqui foi alguma vez provado pelo fogo."
        ],
        greeting_friend: [
            "Os deuses te guardem, e eu guardei-te pão para além disso.",
            "Ah, {name}. Senta-te. Andaste muito e o caminho é cruel.",
            "Falei do teu nome ao ferreiro esta manhã, e ele não riu.",
            "És o único viajante destes meses que bate à porta antes de entrar.",
            "A aldeia lembra o que fizeste na ponte. Também não esquecemos os bondosos."
        ],
        
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
        ,
        "Fala, viajante, mas não semeis a discórdia.",
        "Pelos deuses, algo perturbou o equilíbrio deste lugar...",
        "Um mau presságio... como se uma época chegasse ao seu fim.",
        "Até as bestas do campo parecem inquietas hoje.",
        "Perdoai, a minha mente vagueia por velhas histórias.",
        "De novo?",
        "Assim é, se o dizes.",
        "Ai, a destruição segue-te.",
        "Pelo alto rei, isso foi um erro Manifesto.",
        "Certamente, não estava escrito que isso acontecesse.",
        "Guarda bem os teus dedos, amigo; a minha bolsa sente-se leve.",
        "A nossa estacada de madeira guarda as bestas, mas o que guarda a paz de ti?",
        "Ouviste aquele eco sobrenatural das catacumbas de lá?",
        "Sonhei com uma fortaleza antiga erguida de monólitos maciços...",
        "Ele vela durante as horas de meia-noite. Vi o fogo da sua lareira.",
        "O grande sentinela está calado desde a manhã.",
        "Os lohristas falam de um grande vazio à beira do mundo.",
        "Por arte de bruxaria, a própria alvenaria se move quando desvio o olhar.",
        "O gado ficou estranhamente silencioso.",
        "Estamos à espera do decreto da coroa?",
        "Um olho invisível observa-nos do firmamento acima.",
        "O solo cheira hoje a antigos campos de batalha.",
        "Por favor, não te afastes da segurança dos lanternões de ferro.",
        "Outro longo dia a lavrar a terra do senhor.",
        "Olhas para o meu esconderijo de esmeraldas com grande interesse, aventureiro.",
        "Esse {item} tem ar de ter visto muitas batalhas... ou nenhuma.",
        "Pareces {health}... um espetáculo sombrio para um aventureiro."],
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
        ,
        "O sobresalto desvanece-se; as sombras reconquistam a terra.",
        "{name}, fechaste as pesadas portas de carvalho?"],
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
,
    "minecraft:pillager_captain": {
        greeting_friend: [
            "Bom encontro. O capitão recorda quem cumpriu a sua palavra.",
            "Custaste-nos pouco. Isso granjeia-lhe muito.",
            "Duas vezes saíste vivo das minhas emboscadas. Começo a perguntar-me.",
            "A horda não guarda amigos. Mas guarda dívidas, e as minhas pago.",
            "Então é um lobo que corre com a matilha. Raro de ver."
        ],
        greeting_foe: [
            "Ousas entrar sozinho no meu acampamento?",
            "Já te medi, e ficasse curto.",
            "O capitão não esquece. O capitão não perdoa.",
            "Todos os caminhos que tomares acabam numa partida de saque. É o meu desígnio.",
            "Prefiro bater duas vezes do que falar contigo uma."
        ],
        
        proximity: [
            "Ali está a nossa presa.",
            "Corta-lhe a retirada.",
            "Traz relíquias de grande valor.",
            "Saqueia-lhe.",
            "Põe o castelo a arder.",
            "Não deixes mais do que cinzas.",
            "Não merecem uma riqueza assim.",
            "São fracos. Inaptos para governar.",
            "Um cerco fácil.",
            "Este feudo é nosso por direito.",
            "O prémio está encontrado.",
            "Tomamos com aço, conservamos com sangue.",
            "O aventureiro regressa mais uma vez...",
            "Porque é que o demónio se recusa a ficar na sepultura?",
            "Alguma magia negra amaldiçoa-o.",
            "Tensai as cordas! Lastai!",
            "Sinto cheiro a prata e a cobardia.",
            "A buzina de guerra marca o avanço.",
            "Olhai para as suas miseráveis choupanas.",
            "O capitão exige cabeças em picas.",
            "Gravamos as nossas vitórias na pedra antiga.",
            "Não deixes uma única espiga de trigo de pé.",
            "O herói julga-se o único senhor capaz de moldar esta terra.",
            "O estalo do balestrego pesado é música doce.",
            "Vigia de perto os machadeiros.",
            "Esta incursão limita-se a cobrar o que é devido.",
            "Toda muralha é uma ruína futura.",
            "Esqueceram que comandamos o incêndio.",
            "Não lhes dei quartel! Abatam-nos!"
        ],
        rain: [
            "O campo de batalha é um lameiro.",
            "Mantém seco o isco, senão perdemos o fogo.",
            "Cuidado com o teu footing na pedra molhada.",
            "A chuva forte oculta a pedreira.",
            "A humidade pesa sobre as cordas do arco.",
            "A lama enche-me as sabatonas.",
            "A chuva lava o sangue do nosso estandarte.",
            "Mantém secos os virotes nos carcjos!"
        ],
        thunder: [
            "A tempestade ruges! Movei-vos!",
            "Avancem com pressão!",
            "Os trovões abafam a nossa aproximação.",
            "Noite gloriosa para um saque!",
            "Os tambores do céu estão a bater!",
            "O relâmpago ilumina a fortaleza!",
            "Que o céu faça o fogo!",
            "Os céus rugem com a nossa fúria esta noite!"
        ],
        night: [
            "O sol já se pôs. Avancem.",
            "Condições ideais para uma emboscada.",
            "Ficarão presos como ovelhas nos seus casebres.",
            "Vigia as sombras em busca de movimento.",
            "A meia-noite pertence aos desterrados.",
            "Apagai as lanternas.",
            "As feras da mata temem o dente de uma seta de ferro.",
            "Não deixes a tua armadura tilintar."
        ],
        wounded: [
            "Recuar! Reformar a linha!",
            "Empunha uma lâmina feroz... reagrupai-vos!",
            "Procurai cobertura! Agora!",
            "Estou exausto... vingai-me!",
            "A minha armadura de brigandina está em cacos...",
            "O balestrego pesado... as forças falham-me...",
            "Essa arma está encantada!",
            "Amaldiçoem-se as estrelas... a vista escurece-me..."
        ],
        night_wounded: [
            "As manobras nocturnas foram descobertas!",
            "Perdemos a linha da vanguarda!",
            "Esta escuridão é cegueira absoluta!",
            "A vida escapa-me e não vejo o corte!",
            "O alvo usa as sombras contra nós!"
        ],
        alone: [
            "Onde estão os meus pares?",
            "Rastreio a presa sem auxílio.",
            "A companhia dispersou-se.",
            "Capitão! Relata a tua posição.",
            "Tanto faz... o meu aço acerta sozinho."
        ],
        crowded: [
            "Parti-os ao meio!",
            "O campo é nosso pelo número!",
            "Abatam-nos como cães!",
            "Avancem pela frente!",
            "Cercem o perímetro!"
        ],
        soft_player: [
            "Um camponês sem armadura.",
            "Não gastes aço neste cão.",
            "Trapos patéticos.",
            "Este tolo nem sequer se gabar de um fragmento de ferro.",
            "Parti em pedaços os seus brinquedos de madeira!"
        ,
        "Pano e confiança. Não é uma armadura.",
        "Não gastem uma brasa nisto.",
        "As suas mãos não sabem nada de uma espada.",
        "Se correr, caçamo-lo antes do anoitecer.",
        "Cuidado com as armadilhas, senta-te também."],
        armored_player: [
            "O alvo veste placas pesadas!",
            "Mirai para as juntas da armadura!",
            "Que maneira de cavaleiro é este?!",
            "Os nossos virotes ricocheteiam no peitoral!",
            "Vestem uma couraça encantada!"
        ,
        "Aço temperado. Boa presa para a caça.",
        "Às juntas, sempre às juntas.",
        "As suas placas resistiram a melhores do que ele.",
        "Que pague cada rebite com o seu sangue.",
        "Este é digno da caçada."],
        nether: [
            "O clima é hostil.",
            "Este vale é uma forja de tormento.",
            "O capitão não disse que marcharíamos para o abismo.",
            "Guardai-vos dos cavaleiros suínos das Eras."
        ],
        wounded_vs_player: [
            "A vanguarda é demasiado agressiva! Procurai cobertura!",
            "Ah! Está a desferrar-nos um a um!",
            "O diabo não sente dor!",
            "Trouxe o próprio edifício acima das nossas cabeças!",
            "A armadura de placas é impenetrável..."
        ],
        peer_wounded: [
            "Cobre {hurt_name}!",
            "{hurt_name} foi abatido!",
            "Não os deixem quebrar a nossa formação!",
            "Arrastrem {hurt_name} para trás da paliçada!",
            "Vingai o sangue de {hurt_name}!",
            "Muro de escudos!"
        ],
        boat: [
            "Porque estou preso nesta miserável barca?!",
            "Isto viola todo o protocolo marcial!",
            "Uma posição táctica desastrosa...",
            "Sou um soldado da horda, não um barqueiro!",
            "Lança-lhe um virote ao joelho."
        ],
        death: [
            "Parti-os ao meio! Por {dead_name}!",
            "Mataram {dead_name}! O pagamento é em sangue!",
            "Lembrai-vos de {dead_name}!",
            "Mantenham o estandarte erguido!",
            "Dez moedas de prata por cada gota de sangue de {dead_name}!",
            "Reduzimos esta fortaleza até à rocha-mãe!"
        ],
        seen_animal: {
            "generic": [
                "Afasta este gado guinchoso do meu caminho.",
                "Bestas vis.",
                "Atira-o para as fogueiras.",
                "Mata-o."
            ]
        },
    }
};

DIALOGUE_PT["minecraft:pillager"] = {
        greeting_friend: [
            "Vós outra vez. Os homens do alcaide já conhecem o vosso rosto.",
            "O capitão fala bem de vós. Isso é raro, e perigoso.",
            "Caminhais as nossas estradas sem portagem. Notei-o.",
            "Lutastes ao nosso lado na ponte. Não me esqueci.",
            "Assim que sois amigo da horda. Não me façais arrepender-me."
        ],
        greeting_foe: [
            "Vós. O capitão ouvirá o vosso nome outra vez.",
            "Enterrámos a nossa parte de vós na última travessia.",
            "As buzinas conhecem esse passo. E eu também.",
            "Corre, se te ajudar. Não ajudará muito.",
            "Sois uma dívida que esta horda tenciona cobrar."
        ],
        
        rain: [
            "O campo de batalha é um lameiro.",
            "Mantém seco o isco, senão perdemos o fogo.",
            "Cuidado com o teu footing na pedra molhada.",
            "A chuva forte oculta a pedreira.",
            "A humidade pesa sobre as cordas do arco.",
            "A lama enche-me as sabatonas.",
            "A chuva lava o sangue do nosso estandarte.",
            "Mantém secos os virotes nos carcjos!"
        ],
        thunder: [
            "A tempestade ruges! Movei-vos!",
            "Avancem com pressão!",
            "Os trovões abafam a nossa aproximação.",
            "Noite gloriosa para um saque!",
            "Os tambores do céu estão a bater!",
            "O relâmpago ilumina a fortaleza!",
            "Que o céu faça o fogo!",
            "Os céus rugem com a nossa fúria esta noite!"
        ],
        night: [
            "O sol já se pôs. Avancem.",
            "Condições ideais para uma emboscada.",
            "Ficarão presos como ovelhas nos seus casebres.",
            "Vigia as sombras em busca de movimento.",
            "A meia-noite pertence aos desterrados.",
            "Apagai as lanternas.",
            "As feras da mata temem o dente de uma seta de ferro.",
            "Não deixes a tua armadura tilintar."
        ],
        wounded: [
            "Recuar! Reformar a linha!",
            "Empunha uma lâmina feroz... reagrupai-vos!",
            "Procurai cobertura! Agora!",
            "Estou exausto... vingai-me!",
            "A minha armadura de brigandina está em cacos...",
            "O balestrego pesado... as forças falham-me...",
            "Essa arma está encantada!",
            "Amaldiçoem-se as estrelas... a vista escurece-me..."
        ],
        night_wounded: [
            "As manobras nocturnas foram descobertas!",
            "Perdemos a linha da vanguarda!",
            "Esta escuridão é cegueira absoluta!",
            "A vida escapa-me e não vejo o corte!",
            "O alvo usa as sombras contra nós!"
        ],
        alone: [
            "Onde estão os meus pares?",
            "Rastreio a presa sem auxílio.",
            "A companhia dispersou-se.",
            "Capitão! Relata a tua posição.",
            "Tanto faz... o meu aço acerta sozinho."
        ],
        crowded: [
            "Parti-os ao meio!",
            "O campo é nosso pelo número!",
            "Abatam-nos como cães!",
            "Avancem pela frente!",
            "Cercem o perímetro!"
        ],
        soft_player: [
            "Um camponês sem armadura.",
            "Não gastes aço neste cão.",
            "Trapos patéticos.",
            "Este tolo nem sequer se gabar de um fragmento de ferro.",
            "Parti em pedaços os seus brinquedos de madeira!"
        ,
        "Um camponês com ferramentas, não com aço.",
        "Nem uma cota de couro, e ainda assim nos cospe.",
        "As suas mãos são feitas para o rebanho, não para a espada.",
        "Matá-lo a punhos, e isso ofende-nos.",
        "Que corra. É mais divertido perseguir uma lebre."],
        armored_player: [
            "O alvo veste placas pesadas!",
            "Mirai para as juntas da armadura!",
            "Que manner de cavaleiro é este?!",
            "Os nossos virotes ricocheteiam no peitoral!",
            "Vestem uma couraça encantada!"
        ,
        "Placas pesadas. Afinal algo que merece o aço.",
        "Procurai as juntas da armadura, depressa!",
        "Os meus virotes ressoamam contra o peitoral.",
        "Um verdadeiro cavaleiro. Raro, nestes tempos.",
        "Que lhe caia uma vez e não haverá segunda."],
        nether: [
            "O clima é hostil.",
            "Este vale é uma forja de tormento.",
            "O capitão não disse que marcharíamos para o abismo.",
            "Guardai-vos dos cavaleiros suínos das Eras."
        ],
        wounded_vs_player: [
            "A vanguarda é demasiado agressiva! Procurai cobertura!",
            "Ah! Está a desferrar-nos um a um!",
            "O diabo não sente dor!",
            "Trouxe o próprio edifício acima das nossas cabeças!",
            "A armadura de placas é impenetrável..."
        ],
        peer_wounded: [
            "Cobre {hurt_name}!",
            "{hurt_name} foi abatido!",
            "Não os deixem quebrar a nossa formação!",
            "Arrastrem {hurt_name} para trás da paliçada!",
            "Vingai o sangue de {hurt_name}!",
            "Muro de escudos!"
        ],
        death: [
            "Parti-os ao meio! Por {dead_name}!",
            "Mataram {dead_name}! O pagamento é em sangue!",
            "Lembrai-vos de {dead_name}!",
            "Mantenham o estandarte erguido!",
            "Dez moedas de prata por cada gota de sangue de {dead_name}!",
            "Reduzimos esta fortaleza até à rocha-mãe!"
        ],
        seen_animal: {
            "generic": [
                "Tira este gado guinchoso do meu caminho.",
                "Bestas vis.",
                "Atira-o para as fogueira.",
                "Mata-o."
            ]
        },
        boat: [
            "Porque estou preso nesta miserável barca?!",
            "Isto viola todo o protocolo marcial!",
            "Uma posição táctica desastrosa...",
            "Sou um soldado da horda, não um barqueiro!",
            "Lança-lhe um virote ao joelho."
        ],
        
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
        rain: [
            "O cabo escorrega com a chuva.",
            "Sai da dilúvio e encara-me!",
            "O meu machado de ferro enferruja!",
            "A lama torna pesado cada golpe!"
        ],
        thunder: [
            "Golpeia com a fúria da tempestade!",
            "Os céus rugem com a nossa vanguarda!",
            "O relâmpago iguala o brilho da minha lâmina!",
            "Parti-os enquanto os céus gritam!"
        ],
        night: [
            "Expulsai-vos das sombras!",
            "Julgaram-se a salvo dentro das suas fortalezas.",
            "Nenhuma porta trancada vos salvará esta noite.",
            "Um machado de ferro espera-vos na escuridão."
        ],
        wounded: [
            "Um simples corte de carne!",
            "Arrastar-te-ei comigo para as salas dos mortos!",
            "Mais! Enfrenta-me!",
            "O sangue torna escorregadio o cabo...",
            "Ainda posso brandir a minha machada com um só braço!"
        ],
        wounded_vs_player: [
            "Não quebrarás a minha guarda!",
            "Vou cortar-te à tua medida!",
            "Sangue comigo, cavaleiro!",
            "A tua armadura de diamante vai estilhaçar-se!"
        ],
        peer_wounded: [
            "Luta apesar da dor, {hurt_name}!",
            "Pagarão dez vezes por isto!",
            "Não deixes que o inimigo te veja hesitar!"
        ],
        death: [
            "Vingança por {dead_name}!",
            "{dead_name} caiu em batalha!",
            "Pintarei a minha machada de guerra com o teu sangue!"
        ],
        
    proximity: [
        "Aproximai-vos.", "Rendei-vos agora.", "Huis de vossa última batalha.", "Descobri-vos.", "O fio de meu machado de ferro tem sede.", "Não haverá paz.", "Fazei em lascas suas portas!", "Não preciso de besta para tratar de vós.", "Somos os verdadeiros mestres do reino.", "Vossas torres não são mais que simples troncos.", "MORRE, COVARDE!"
    ]
};

DIALOGUE_PT["minecraft:evoker"] = {
        rain: [
            "O ar húmido altera a minha concentração.",
            "Uma pequena inconveniência.",
            "A chuva forte abrandou o fio dos meus dentes."
        ],
        thunder: [
            "As correntes mágicas deslocam-se.",
            "Um poder desimpedido ruges acima.",
            "Canaliza o relâmpago celeste.",
            "Um espetáculo magnífico de poder bruto."
        ],
        night: [
            "Os espíritos são mais obedientes nesta hora de meia-noite.",
            "A noite pertence ao nosso coven.",
            "Começa o grande ritual.",
            "Uma manifestação pristina da maldade."
        ],
        wounded: [
            "Este recipiente mortal está a falhar...",
            "O círculo mágico não pode romper-se!",
            "Uma fragilidade passageira...",
            "Mantenhai as protecções defensivas!",
            "As minhas vestes mancham-se de essência pura...",
            "Os encantamentos escorrem-me da mente..."
        ],
        wounded_vs_player: [
            "A tua perícia física desvia-me o foco...",
            "Carne e osso interferem com o grande desígnio!",
            "As sombras reclamarão a tua alma!",
            "Remodelo o próprio tecido deste reino!"
        ],
        peer_wounded: [
            "Protege {hurt_name}!",
            "Não percais a mestra {hurt_name}.",
            "Concentrai as hordas espectrais!"
        ],
        death: [
            "A energia arcana de {dead_name} dispersou-se.",
            "Refazei os ingredientes do feitiço.",
            "Perdemos uma maga essencial... adeus, {dead_name}."
        ],
        
    proximity: [
        "Procedei com o ritual.", "Mais uma vez.", "Cairão ante nós.", "A hierarquia deve ser obedecida.", "Os próprios caninos da terra obedecem meu conjuro.", "Reduzirei vossa essência a nada.", "Voa, meus espíritos malévolos.", "A carne não é mais que um vaso temporário.", "Wololo...", "Nenhuma armadura pode proteger-vos da terra."
    ]
};

DIALOGUE_PT["minecraft:piglin"] = {
        witness: [
            "Caiu. Quanto levava consigo?",
            "Bateu no chão. Ouvi daqui.",
            "Que a terra o guarde. Eu guardo o ouro.",
            "A horda olha e não pergunta.",
            "Um a menos. Os dele, meus."
        ],
        
        overworld: [
            "O ar é gelo absoluto!",
            "A terra aqui é anormalmente mole e verde...",
            "A minha pele sente-se corrompida por este ar...",
            "Perdi o grande Bastião!"
        ],
        wounded: [
            "Protegai o tesouro!",
            "Preciso de ouro...",
            "Rouba-nos o tesouro inteiro!",
            "Deixa-me contemplar o brilho antes de morrer...",
            "Uma boca cheia de cinza de enxofre...",
            "Escorrem-me moedas de prata...",
            "Enterrem o tesouro!",
            "Perder o ouro dói mais do que qualquer lâmina...",
            "Onde estão as minhas pepitas douradas?"
        ],
        peer_wounded: [
            "Defende {hurt_name}!",
            "{hurt_name} está a espalhar o seu saque!",
            "Apunhai-lhes!",
            "Assegurai a arca do tesouro!",
            "Protegai o saque!",
            "Dai-lhes com a ponta da vossa lâmina!"
        ],
        death: [
            "Despojaram-no da armadura!",
            "{dead_name} devia tributo ao meu tesouro!",
            "Recolhei as suas pepitas douradas!",
            "Reivindicai a moeda antes que o cadáver arrefeça!",
            "O ouro perdura!",
            "Um negócio desastroso!"
        ],
        
    proximity: [
        "Mais ouro para o tesouro.", "O ouro mantém a vida dentro de vós.", "Ele acumula o ouro sagrado...", "Não confieis neste errante.", "Esconde algo brilhante.", "Vigiai suas mãos.", "Negociareis com ouro?", "Um mau negócio...", "O metal precioso nos mantém a salvo.", "O ouro vos vigia.", "Este reino é cegadoramente brilhante.", "Mantende a besta engatilhada.", "O magma corre quente hoje.", "Derrubamos os que carecem do metal brilhante.", "Oferecei-nos as moedas de ouro.", "Cheirais à podridão do mundo superior.", "O Bastião vigia."
    ]
};

DIALOGUE_PT["minecraft:piglin_brute"] = {
        wounded: [
            "AINDA ESTOU DE PÉ.",
            "O COMBATE NÃO TERMINOU.",
            "O MEU SANGUE ARDE MAIS QUENTE QUE A MAGMA.",
            "A DOR É APENAS COMBUSTÍVEL PARA O MEU MACHADO.",
            "ESMAGAR-TE-EI ANTES DE CAIR."
        ],
        peer_wounded: [
            "PERMANECE FIRME, {hurt_name}!",
            "CAI ATRÁS DO MEU ESCUDO!",
            "O BASTIÃO EXIGE O TEU VALOR!",
            "SEGURA O MACHADO!"
        ],
        death: [
            "PELA HONRA DE {dead_name}!",
            "SE MATARES {dead_name}, MORRES A SEGUINDA.",
            "O BASTIÃO LEMBRARÁ {dead_name}!",
            "AS FORNALHAS DA FORTALEZA ARREFECEM."
        ],
        
    proximity: [
        "A passagem está proibida.", "Mantende-vos longe deste torreão.", "Este domínio é meu.", "Caminhastes rumo a vossa tumba.", "Não trato com comércio. Eu esquartejo.", "Vossa cabeça adornará nossas lanças.", "Um machado massivo para ladrões de pouca monta.", "Pela glória do Bastião!", "Pareceis macio, aventureiro.", "Meu machado de batalha não negocia.", "O muro da fortaleza aguarda vosso cadáver."
    ]
};

DIALOGUE_PT["minecraft:witch"] = {
        rain: [
            "Tempo esplêndido para preparar maldições.",
            "As rãs do pântano cantam os seus coros sombrios.",
            "A humidade mantém a campana da morte túmida."
        ],
        thunder: [
            "Uma hora ideal para extrair essências.",
            "Esta noite são os céus que cozinham!"
        ],
        night: [
            "A lua cheia traz uma toxicidade potente.",
            "A colheita de veneno simplifica-se.",
            "As sombras alinham-se na perfeição para a minha arte."
        ],
        wounded: [
            "O meu próprio sangue arruína a poção...",
            "A dose foi catastróficamente incorreta...",
            "Contaminação do local de trabalho!",
            "Onde está o meu frasco de restauração?!",
            "As minhas poções quebraram-se nas vestes!"
        ],
        peer_wounded: [
            "{hurt_name} está a comprometer a estabilidade do nosso ritual!",
            "Aplica-te um torniquete, irmã!",
            "Não te dissolvas ainda em névoa!"
        ],
        death: [
            "{dead_name} estragou-se como carne corrompida.",
            "Contaminação total dos ingredientes do coven."
        ],
        
    proximity: [
        "Falta um ingrediente no caldeirão.", "Bebi desta colheita... ou provai minha ira.", "O corpo físico lembra a maldição.", "Enxofre e pó de pedra vermelha.", "O pântano conhece vosso verdadeiro nome.", "Olhai vossa pele pálida... vamos curá-la.", "Meus familiares veem através da escuridão.", "Dobra, dobra, labuta e aflição.", "A gente simples expulsou-me de sua paróquia.", "Não toqueis meus frascos de veneno."
    ]
};

DIALOGUE_PT["minecraft:enderman"] = {
        rain: [
            "O céu que cai incendeia a minha forma.",
            "Água tão volátil!",
            "Não consigo manter o meu lugar entre os mundos.",
            "A miséria desce de cima.",
            "A minha própria essência está a estilhaçar-se!"
        ],
        thunder: [
            "O firmamento rasga-se.",
            "Abrem-se fendas no tecido do mundo.",
            "O trovão... forte demais para este recipiente.",
            "O véu rasga-se."
        ],
        night: [
            "A realidade adelgaça-se a estas horas.",
            "A escuridão eterna envolve-me.",
            "Não consegues perceber o que está mesmo atrás de ti."
        ],
        wounded: [
            "A minha forma está a desfazer-se.",
            "A minha essencial dispersa-se pelos planos...",
            "A integridade falha.",
            "A força vital violeta escoa-se...",
            "Não encontro o caminho de volta ao vazio..."
        ],
        night_wounded: [
            "O meu lugar entre os mundos sangra para a meia-noite...",
            "O vazio puxa-me de volta às suas profundezas.",
            "A estática do meu ser desvanece-se.",
            "A fundir-me com a sombra eterna..."
        ],
        peer_wounded: [
            "{hurt_name} está a perder a sua integridade.",
            "{hurt_name} está a fraturar-se entre dimensões.",
            "A forma de {hurt_name} está a verter-se nesta terra!"
        ],
        death: [
            "{dead_name} colapsou para o nada.",
            "{dead_name} dissolveu-se no vazio.",
            "O eco de {dead_name} permanece na cantaria."
        ],
        
    proximity: [
        "Atravessei outros planos de existência.", "Não olheis demasiado tempo ao abismo.", "Esta lugar está incorreta.", "Minha forma é instável neste reino.", "Os olhos ardem quando nossos olhares se cruzam.", "Por que aferrais blocos que pertencem à terra?", "As antigas colunas... vós as desmantelastes.", "Um mar infinito de sombra violeta.", "Não olheis meus ossos alongados."
    ]
};

DIALOGUE_PT["minecraft:wither_skeleton"] = {
        witness: [
            "O OSSO CAIU. EU CONTO-O.",
            "OUTRO NÓ PERDEU A MALHA.",
            "FARINHA. AS FENDAS ESTÃO ABERTAS.",
            "ENQUANTO ASSIM, NINGUÉM PARA.",
            "OS MORTOS CONTAM-SE. NÃO SE CHORAM."
        ],
        
        wounded: [
            "O MEU OSSO ESTÁ A ESTILHAÇAR.",
            "A ESTRUTURA DA CRIPTA ESTÁ A DESABAR.",
            "ESTA LÂMINA NEGRA É PESADA DEMAIS...",
            "A medula cai sobre a cinza...",
            "Uma fratura mortal na minha coluna...",
            "A fuligem escapa-me das costelas."
        ],
        peer_wounded: [
            "REMENDAI OS OSSOS.",
            "As nossas formas esqueléticas estão a partir-se.",
            "UMA COSTELA DE RESERVA PARA {hurt_name}!",
            "PROTEGEI O CRÂNIO ÓSSEO!",
            "A ESPADA DE PEDRA FALHA!"
        ],
        death: [
            "RECOLHEI AS CINZAS SAGRADAS.",
            "REDUZIMOS-NOS A CASCOS.",
            "CONSERVAI O CRÂNIO A TODO O CUSTO!",
            "DISPERSOS COM O VENTO!",
            "{dead_name} FOI DESMONTADO."
        ],
        seen_animal: {
            "generic": [
                "A CARNE APENAS OCULTA A VERDADE DO OSSO.",
                "DEVE SER PURGADA.",
                "DERRETE A CARNE DO CADÁVERE."
            ]
        },
        
    proximity: [
        "Matai os vivos.", "Destroçai seus ossos.", "ENFRENTO O INTRUSO.", "Cinza e pó de carvão enchem nossas costelas.", "Esta fortaleza pertence aos mortos.", "Minha espada larga anseia carne.", "Um crânio antigo para o tributo do mestre.", "Nosso senhor despertará em breve.", "A podridão da cripta vos tomará.", "Sendas de pedra de tormento.", "Um intruso rompe nossa torre escura."
    ]
};

DIALOGUE_PT["minecraft:blaze"] = {
        wounded: [
            "O meu núcleo arrefece... a... apagar...",
            "A apagar... salvai a chama!",
            "As minhas brasas tornam-se cinzentas.",
            "O FUMO TORNA-SE NEGRO AUSPICIOSO.",
            "AS MINHAS BRASAS ESTÃO A ESTALAR.",
            "Um frio crescente toma conta de mim!"
        ],
        peer_wounded: [
            "ALIMENTAI A CHAMA.",
            "AVAIVAI A FORJA.",
            "AVAIVAI AS CÂMARAS INFERNAL!",
            "REAVIVAI O FOGO!"
        ],
        death: [
            "REGRESAI À PEDRA ANTIGA.",
            "O FUMO DISPERSA-SE PELAS CAVERNAS.",
            "A CHAMA APAGOU-SE.",
            "O CALOR DESVANECE-SE EM GELO.",
            "A IGNIÇÃO ARREFECE ATÉ VIRAR CINZA."
        ],
        
    proximity: [
        "Arderei eternamente.", "Percebo todas as assinaturas térmicas.", "Vossa carne congela.", "Voltas dão as varas elementais.", "Filhos da grande forja.", "Ponto de fusão alcançado.", "A rede térmica detecta um frio do mundo superior.", "Sequência de ignição iniciada.", "Sangrai vosso fogo líquido."
    ]
};

DIALOGUE_PT["minecraft:iron_golem"] = {
        witness: [
            "Um servidor caiu. Recalculando a guarda.",
            "Caiu no cumprimento do dever. O seu nome fica na pedra.",
            "Ferro por ferro. Cinza por cinza.",
            "A aldeia sente falta de uma sombra que não fala.",
            "Outro turno. Menos mãos."
        ],
        
        greeting_friend: [
            "Conheço o teu passo. O portão está aberto para ti.",
            "Luchaste bem. Lembro-me dos que lutaram bem.",
            "Os aldeões falam o teu nome quando não estou por perto. Isso é raro.",
            "Vigiarei enquanto descansas. A mim não me custa nada e a ti muito."
        ],
        thunder: [
            "O martelo celeste carrega o meu núcleo.",
            "O relâmpago fala a linguagem da minha forja."
        ],
        rain: [
            "A chuva forte traz a ameaça da ferrugem.",
            "As minhas juntas de ferro estão a endurecer."
        ],
        night: [
            "As sombras movem-se pelo vale.",
            "Não lhes concederei passagem para além da minha guarda."
        ],
        wounded_vs_zombie: [
            "Larga os aldeões, besta podre!",
            "A tua carne apodrecida estilhaçar-se-á contra os meus braços de aço!"
        ],
        wounded_vs_illager: [
            "As vossas machadas toscas não podem cortar ferro temperado!",
            "Lançar-vos-ei para além dos muros da fortaleza!"
        ],
        wounded: [
            "A minha carapaça de ferro está a rachar.",
            "A minha forma está a deformar-se...",
            "Quem guardará a paróquia quando eu estiver destruído?",
            "O meu ferro fundido derrama-se sobre a terra..."
        ],
        night_wounded: [
            "A oxidação devora as minhas juntas na escuridão...",
            "A vista falha-me... as forças falham-me..."
        ],
        armored_player: [
            "A tua armadura de placas é formidável, mas não é ferro.",
            "Confrontar-me com outra sentinela de metal?"
        ],
        on_fire: [
            "O CALOR INFERNAL FUNDE AS MINHAS CORRENTES!",
            "O MEU NÚCLEO INTERNO ESTÁ A FERVER!"
        ],
        peer_wounded: [
            "Cai um irmão sentinela em batalha!",
            "Mantendei a linha da vanguarda!"
        ],
        death: [
            "{dead_name} voltou à terra da montanha.",
            "A paróquia chora o seu silencioso protector."
        ],
        
    proximity: [
        "A placa de ferro se mantém firme.", "Protegei os plebeus inocentes.", "A ferrugem nunca dorme nesta vigília.", "Pisai suavemente; não molesteis as papoulas.", "As crianças ofereceram-me uma flor de paz."
    ,
    "A minha criação custou caro. Que o teu peso não me seja estranho.",
    "Não preciso falar. O meu dever é claro.",
    "A aldeia cala-se enquanto eu atravesso.",
    "Se buscas paz, não busques guerra aqui.",
    "A minha sombra precede-te. Não a sigas.",
    "Passo. Nada mais."]
};

DIALOGUE_PT["minecraft:wandering_trader"] = {
        greeting_friend: [
            "Ah. Tu outra vez. Reservei-te o bom tecido.",
            "Já conheço o teu passo, amigo. Não é preciso cumprimentar a trinta passos.",
            "O caminho é longo e nele pensei em ti.",
            "Guardei-te uma tarifa. Fala com clareza e será honrada.",
            "És o único viajante destes meses que paga como promete."
        ],
        overworld: [
            "Este inferno verde e agradável. A terra é mole e o comércio é fraco.",
            "Cheguei a esta terra e não encontrei mercado para a seda.",
            "Todos os caminhos aqui levam a um campo. Que tédio absoluto.",
            "O clima é ameno e a minha mercadoria não se vende. Considera um pouco disso."
        ],
        poor: [
            "Contas a tua moeda e achas-na escassa. Tal como eu.",
            "Não vendi nada esta estação. Culpa as estradas, ou os compradores.",
            "A pobreza pesa nas estradas nestes dias."
        ],
        rich: [
            "A tua bolsa pesa. Talvez compres algo desnecessário.",
            "Cheiro a dinheiro. É o único perfume em que confio.",
            "A fortuna sorri-te. Canso-me de ver."
        ],
        inventory: {
            "minecraft:wheat": [
                "Trigo. Estás a alimentar-te a ti próprio, pois não? Uma pobre coroa.",
                "Grão na mão. A moeda do camponês.",
                "Vens ao mercado com um cesto de agricultor."
            ],
            "minecraft:bread": [
                "Pão. Comeste hoje. Invejo-te.",
                "Um pão. Soldado endurecido. Respeito o carboidrato.",
                "Esse pão não te custou nada e deu-te tudo."
            ],
            "minecraft:emerald": [
                "Uma esmeralda. Então não precisas regatear comigo.",
                "Pedra verde. Fala mais alto do que qualquer saudação.",
                "Importas-te com o ouro. Sensato, embora frio."
            ],
            "minecraft:potato": [
                "Uma batata. Até um cavaleiro pode dar-se ao luxo de uma raiz de vez em quando.",
                "Terra e água, assadas. Ao menos és prático.",
                "Essa batata alimentou homens piores do que tu."
            ],
            "minecraft:carrot": [
                "Uma cenoura. É laranja. Pagam-me para me impressionar e não posso.",
                "Legumes. Estás a alimentar-te, não a lutar.",
                "Essa cenoura não é uma arma, digas o que disseres."
            ],
            "minecraft:beetroot": [
                "Uma beterraba. Não conheço esse legume e tu também não.",
                "Algo roxo e subterrâneo. Audaz.",
                "Tens uma raiz e chamas-lhe tesouro."
            ],
            "minecraft:diamond_sword": [
                "Uma lâmina fina. Usa-a com mais bom senso do que falas.",
                "Esse aço é obra-prima. Não o gastes em disputas menores.",
                "Diamante. Aposto que não regateaste por isso."
            ],
            "minecraft:iron_sword": [
                "Ferro honesto. Melhor que o ouro e mais barato que o orgulho.",
                "Aço útil. Não te salvará, mas vender-se-á.",
                "A lâmina de um soldado. Vi-a cravada em homens piores."
            ],
            "minecraft:shield": [
                "Um escudo. O teu valor esconde-se atrás do carvalho e do ferro.",
                "Trouxeste uma parede contigo. Sensato, embora pequeno.",
                "Guarda-o bem, e lembra-te de que os guardas não ganham."
            ],
            "minecraft:bow": [
                "Um arco. Lutas à distância como um mercador.",
                "Arco longo. Para quem prefere partir-se antes da portagem.",
                "Flechas e paciência. Uma combinação que conheço bem."
            ],
            "minecraft:golden_apple": [
                "Oro em forma de fruta. Não és subtil.",
                "Essa maçã vale um cavalo. Sabe-a bem.",
                "Uma guloseima real. Não perguntarei o preço."
            ],
            "minecraft:gold_ingot": [
                "Ouro. A linguagem honesta de cada homem que conheci.",
                "Metal amarelo. Fala por ti, mal mas em voz alta.",
                "Midas o teu valor em lingotes. Como todos."
            ]
        },
        seen_animal: {
            "minecraft:chicken": [
                "Uma galinha. Bica a terra e não teme nada, e eu invejo-lhe isso.",
                "Cacareja. As galinhas não atendem a portagens nem a dízimos.",
                "Essa ave nunca foi cobrada por um pagamento."
            ],
            "minecraft:cow": [
                "Uma vaca. Tranquila, aborrecida, e completamente alheia a ti.",
                "Muge no caminho. A riqueza do camponês.",
                "Essa besta tem melhor vida do que a maioria dos cavaleiros."
            ],
            "minecraft:sheep": [
                "Uma ovelha. Lã para os honestos, fardo para os pacientes.",
                "Pasteja como se o mundo fosse benevolente. Talvez seja.",
                "Lã e silêncio. Uma lição de resistência."
            ],
            "generic": [
                "Bestas de carga e de presa. Negociei com piores.",
                "Quatro patas e nenhuma opinião. Invejo-lhes.",
                "Gado. Caminham a estrada sem contar moedas."
            ]
        },
        thunder: [
            "Protegai as minhas bestas de carga!",
            "Salvai a mercadoria exótica da tempestade!"
        ],
        rain: [
            "As minhas sedas finas estão a arruinar-se com a chuva!",
            "O meu pesado manto de viagem está completamente encharcado."
        ],
        night: [
            "Bebei a poção de invisibilidade!",
            "As sombras da meia-noite têm olhos.",
            "Os mortos inquietos despertam nos seus túmulos."
        ],
        wounded_vs_zombie: [
            "Afastai as vossas garras podres da minha seda!",
            "O meu cliente sucumbiu à peste e está a morder-me!"
        ],
        wounded: [
            "Leva o meu inventário inteiro, apenas detém a tua lâmina!",
            "Ai, não cheguei a negociar o coral marinho...",
            "Preciso de uma poção de restauração..."
        ],
        night_wounded: [
            "A poção mágica dissipou-se mais cedo!",
            "As minhas bestas de carga fugiram para a escuridão!"
        ],
        on_fire: [
            "A MINHA MERCADORIA EXÓTICA CONSOME-SE NO FOGO!",
            "Salvai as rédeas de couro!"
        ],
        nether: [
            "Que maneira de mercador encontra lucro neste submundo?!",
            "Detesto profundamente este reino..."
        ],
        peer_wounded: [
            "{hurt_name} está a ser assaltado por bandidos!"
        ],
        death: [
            "Os bandidos roubaram tudo a {dead_name}..."
        ],
        
    proximity: [
        "Segui caminhando, viajante...", "Minhas bestas de carga recusam parar de cuspir.", "Atravessei as bordas literais do mapa."
    ,
    "Bom dia, viajante. Esse fardo é pesado para a estrada.",
    "Sem mercadorias hoje, mas há sempre amanhã.",
    "Pareces um homem que andou muito.",
    "Cuidado, a ponte junto ao moinho desfez-se.",
    "Nunca vi uma espada levada com tão pouco cuidado.",
    "Os preços são os que são. A estação é fraca.",
    "Compra alguma coisa, ou ao menos sorria."]
};

DIALOGUE_PT["minecraft:skeleton"] = {
        thunder: [
            "O relâmpago rasga a meia-noite.",
            "Ressoa no meu próprio crânio."
        ],
        rain: [
            "A chuva forte torna escorregadizos os meus ossos nusos.",
            "Arrastando o pó das catacumbas..."
        ],
        night: [
            "Marchamos quando o sol morre a oeste.",
            "A lua pende como uma cavidade ocular vazia.",
            "O manto escuro da noite protege os nossos ossos frágeis."
        ],
        wounded: [
            "As minhas costelas estilhaçam-se!",
            "Afastai-vos do meu fémur!",
            "Desabo em pedaços estruturais...",
            "A medula derrama-se sobre a terra húmida!"
        ],
        night_wounded: [
            "Estilhaço-me nesta escuridão sem deus!",
            "Não encontro o meu braço de arqueiro!"
        ],
        wounded_vs_player: [
            "O aventureiro carnudo contra-ataca!",
            "Parti-lhe as pernas mortais!"
        ],
        armored_player: [
            "As minhas setas ricocheteiam no peitoral de aço!",
            "Chapas de ferro roubadas a um cavaleiro menor!"
        ],
        on_fire: [
            "O INFERNO QUEIMA OS MEUS OSSOS!",
            "REDUZIDO A CINZA E PÓ DE SEPULCRO!"
        ],
        peer_wounded: [
            "{hurt_name} desfaz-se em poeira!",
            "Mantendei a primeira linha!"
        ],
        death: [
            "{dead_name} foi reduzido a pó de sepultura comum...",
            "O seu arco curto cai em silêncio..."
        ],
        seen_animal: {
            "minecraft:wolf": [
                "UM CÃO SELVAGEM! DISPARAI À BESTA!",
                "O lobo tem fome da minha medula! Fugi!"
            ],
            "generic": [
                "Lança uma flecha para treino.",
                "Carne viva para os corvos."
            ]
        },
        
    proximity: [
        "*um tinir profano de ossos*", "O vento de inverno assobia entre minhas costelas.", "Meu aljava arde por cálcio...", "A corda de meu arco está tensa e seca.", "Ainda lembro quando vestia a pele de um homem."
    ]
};
