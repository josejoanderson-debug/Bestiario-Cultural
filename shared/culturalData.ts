export type CulturalCategory = "musica" | "danca" | "artesanato" | "festa";

export type CulturalSource = {
  title: string;
  institution: string;
  url: string;
  note: string;
};

export type CulturalExtraPageImage = {
  id?: number;
  imageUrl: string;
  altText: string;
  credit: string;
  sourceUrl: string;
  license: string;
};

export type CulturalExtraPage = {
  id?: number;
  eyebrow: string;
  title: string;
  content: string;
  images: CulturalExtraPageImage[];
};

export type CulturalEntry = {
  number: number;
  slug: string;
  title: string;
  category: CulturalCategory;
  categoryLabel: string;
  region: string;
  territorialNote: string;
  subtitle: string;
  excerpt: string;
  story: string[];
  visualMotif: string;
  sources: CulturalSource[];
  photoUrl?: string;
  photoCredit?: string;
  photoSourceUrl?: string;
  photoLicense?: string;
  extraPages?: CulturalExtraPage[];
  isPublished?: boolean;
};

const sources = {
  forro: {
    title: "Matrizes tradicionais do forró",
    institution: "IPHAN — Bem Brasileiro",
    url: "https://bcr.iphan.gov.br/bens-culturais/matrizes-tradicionais-do-forro/",
    note: "Registro no Livro das Formas de Expressão, com abrangência nacional que inclui a Paraíba.",
  },
  cavalo: {
    title: "Cavalo-Marinho",
    institution: "IPHAN — Bem Brasileiro",
    url: "https://bcr.iphan.gov.br/bens-culturais/cavalo-marinho/",
    note: "Ficha institucional de referência para a brincadeira, seus personagens e práticas de salvaguarda.",
  },
  bumba: {
    title: "Dossiê de registro — Complexo Cultural do Bumba-meu-boi do Maranhão",
    institution: "IPHAN — Bem Brasileiro",
    url: "https://bcr.iphan.gov.br/documentos-do-process/dossie-de-registro-complexo-cultural-do-bumba-meu-boi-do-maranhao/",
    note: "Referência comparativa para as matrizes do bumba-meu-boi; não atribui origem maranhense às práticas paraibanas.",
  },
  junina: {
    title: "Símbolos da cultura popular brasileira, festas juninas ganham força com políticas culturais do MinC",
    institution: "Ministério da Cultura",
    url: "https://www.gov.br/culturaviva/pt-br/acesso-a-informacao/noticias/simbolos-da-cultura-popular-brasileira-festas-juninas-ganham-forca-com-politicas-culturais-do-minc",
    note: "Contextualiza matrizes das festas juninas, políticas culturais e reconhecimento das quadrilhas.",
  },
  renda: {
    title: "Renda Renascença",
    institution: "Programa do Artesanato Paraibano",
    url: "https://pap.pb.gov.br/artesaosparaibanos/renda-renascenca",
    note: "Apresenta o uso de linha, agulha e lacê e registra a importância da atividade no Cariri paraibano.",
  },
  patrimonio: {
    title: "Bem Brasileiro — Bens Culturais Imateriais Registrados",
    institution: "IPHAN",
    url: "https://bcr.iphan.gov.br/bens-culturais/",
    note: "Portal institucional de consulta para patrimônio cultural imaterial e ações de salvaguarda.",
  },
  iphaep: {
    title: "Histórico institucional",
    institution: "IPHAEP — Governo da Paraíba",
    url: "https://iphaep.pb.gov.br/institucional/historico",
    note: "Referência para a política de reconhecimento e preservação do patrimônio cultural paraibano.",
  },
  repente: {
    title: "Repente",
    institution: "IPHAN — Bem Brasileiro",
    url: "https://bcr.iphan.gov.br/bens-culturais/repente/",
    note: "Referência institucional para a cantoria improvisada e sua transmissão entre gerações.",
  },
  pbArt: {
    title: "Programa do Artesanato Paraibano",
    institution: "Governo da Paraíba",
    url: "https://pap.pb.gov.br/",
    note: "Portal público de referência para técnicas, artesãs e artesãos do estado.",
  },
  fandango: {
    title: "Fandango's Living Museum",
    institution: "UNESCO — Intangible Cultural Heritage",
    url: "https://ich.unesco.org/en/video/27969",
    note: "Referência comparativa para os fandangos brasileiros; não afirma origem paraibana para o Fandango Caiçara.",
  },
  cocoCiranda: {
    title: "A história vista de baixo: coco de roda e ciranda na Paraíba",
    institution: "ANPPOM",
    url: "https://anppom-congressos.org.br/index.php/31anppom/31CongrAnppom/paper/view/786/464",
    note: "Pesquisa acadêmica sobre Coco de Roda e Ciranda como patrimônio imaterial, luta e resistência na Paraíba.",
  },
  maracatuPb: {
    title: "Maracatu à paraibana: uma análise das reinvenções e conexões político-sociais-religiosas",
    institution: "Repositório Institucional da UFPB",
    url: "https://repositorio.ufpb.br/jspui/handle/123456789/13333",
    note: "Dissertação sobre o Maracatu Pé de Elefante e processos de reinvenção do maracatu no estado.",
  },
  lapinhaPb: {
    title: "Lapinha em Cabedelo-PB",
    institution: "Paraíba Criativa",
    url: "https://paraibacriativa.com.br/artista/lapinha-em-cabedelo-pb/",
    note: "Verbete sobre a Lapinha em Cabedelo, seus cordões, personagens, canções e o ciclo de Reis.",
  },
  pastorilPb: {
    title: "Pastoril Profano em cartaz em João Pessoa",
    institution: "JPB2 — Globoplay",
    url: "https://globoplay.globo.com/v/13328743/",
    note: "Registro audiovisual público de apresentação de Pastoril Profano no Teatro do Sesc, no Centro de João Pessoa.",
  },
  reisadoPb: {
    title: "Reisado de Zabelê",
    institution: "Mapa Cultural da Paraíba",
    url: "https://mapacultural.pb.gov.br/espaco/635/Reisadodezabele",
    note: "Cadastro cultural paraibano de referência para o grupo tradicional de Reisado em Zabelê.",
  },
  xaxadoPb: {
    title: "Grupo de Xaxado Bandoleiros do Sertão",
    institution: "Paraíba Criativa",
    url: "https://paraibacriativa.com.br/artista/grupo-de-xaxado-bandoleiros-do-sertao/",
    note: "História de grupo criado em Triunfo-PB, com referência explícita a processos de aprendizagem e recriação do xaxado.",
  },
  cangacoPb: {
    title: "Lugares de memória: Jesuíno Brilhante e os testemunhos do Cangaço",
    institution: "Repositório Institucional da UFPB",
    url: "https://repositorio.ufpb.br/jspui/handle/tede/5783",
    note: "Pesquisa sobre memória, imaginário e representações do cangaço na fronteira paraibana.",
  },
  ceramicPb: {
    title: "Cerâmica",
    institution: "Programa do Artesanato Paraibano",
    url: "https://pap.pb.gov.br/artesaosparaibanos/ceramica",
    note: "Fonte oficial sobre o trabalho com argila e a produção cerâmica no território paraibano.",
  },
  caruaru: {
    title: "Museu do Barro de Caruaru — MUBAC",
    institution: "Secretaria de Cultura de Pernambuco",
    url: "https://www.cultura.pe.gov.br/pagina/espacosculturais/museu-do-barro-de-caruaru-mubac/",
    note: "Referência territorial pernambucana para a cerâmica de Caruaru; o portal pode estar temporariamente indisponível.",
  },
  carnivalPb: {
    title: "O carnaval como elemento identitário e atrativo turístico: análise do projeto Folia de Rua em João Pessoa",
    institution: "Revista CULTUR",
    url: "http://periodicos.uesc.br/index.php/cultur/article/view/296",
    note: "Estudo sobre a Folia de Rua como expressão organizada pela população de João Pessoa com apoio público e privado.",
  },
};

const baseCulturalEntries: CulturalEntry[] = [
  {
    number: 1,
    slug: "bumba-meu-boi",
    title: "Bumba Meu Boi",
    category: "festa",
    categoryLabel: "Festa",
    region: "Litoral, Brejo e circuitos de cultura popular",
    territorialNote: "Na Paraíba, as brincadeiras de boi dialogam com formas nordestinas de cortejo, música, personagens e comicidade; as variantes locais devem ser lidas em seu próprio contexto comunitário.",
    subtitle: "O boi como drama, cortejo e invenção coletiva.",
    excerpt: "Uma festa dramática em que música, mascaramento, narrativa e comunidade se encontram em torno da figura do boi.",
    story: [
      "Bumba Meu Boi reúne canto, dança, teatro popular e devoção em narrativas centradas na morte e na volta do boi. Sua força está menos em uma forma única do que na capacidade de cada grupo organizar personagens, sotaques, instrumentos e repertórios de acordo com as memórias de seu território. No universo paraibano, a brincadeira se aproxima de folguedos de Reis e de bois locais, preservando a roda, o cortejo e o diálogo com o público.",
      "A presença do amo, de vaqueiros, de figuras cômicas, de cantadores e de brincantes transforma o enredo em ação partilhada. O capítulo trata o Bumba Meu Boi como uma matriz nordestina em circulação, evitando confundir as formas paraibanas com o complexo específico registrado no Maranhão. O essencial é reconhecer as pessoas que sustentam a brincadeira: quem costura, toca, canta, organiza, ensaia e reconta o boi a cada ciclo festivo.",
    ],
    visualMotif: "boi bordado, estandarte e pandeiro",
    sources: [sources.bumba, sources.patrimonio, sources.iphaep],
  },
  {
    number: 2,
    slug: "forro",
    title: "Forró",
    category: "musica",
    categoryLabel: "Música",
    region: "Todo o estado, com destaque para Campina Grande, Cariri, Agreste e Sertão",
    territorialNote: "A Paraíba integra a abrangência do registro das Matrizes Tradicionais do Forró e mantém redes de baile, festa junina, ensino musical e criação autoral.",
    subtitle: "Sanfona, zabumba e triângulo como idioma de encontro.",
    excerpt: "Mais que ritmo, o forró reúne dança, instrumentos, festas, ofícios e vínculos sociais em permanente renovação.",
    story: [
      "Forró nomeia um amplo campo de práticas: música, dança, baile, festa e lugar de encontro. Em suas matrizes tradicionais, sanfona, zabumba e triângulo organizam sonoridades que acolhem baião, xote, xaxado, coco, arrasta-pé e toada. A experiência nasce do corpo em dupla, do salão comunitário, da festa de rua e do aprendizado transmitido por escuta, convivência e repetição.",
      "Na Paraíba, o forró estrutura calendários de São João, repertórios de músicos locais e circuitos que atravessam cidade e campo. A inscrição das Matrizes Tradicionais do Forró no Livro das Formas de Expressão, em 2021, reconhece justamente esse sistema cultural: instrumentos, repertórios, modos de dançar, saberes de mestres e práticas de organizar a festa. Preservar o forró exige valorizar quem o executa e os espaços em que ele acontece.",
    ],
    visualMotif: "sanfona aberta, zabumba e triângulo",
    sources: [sources.forro, sources.junina],
  },
  {
    number: 3,
    slug: "coco-de-roda",
    title: "Coco de Roda",
    category: "danca",
    categoryLabel: "Dança",
    region: "Litoral e Zona da Mata, em diálogo com o Nordeste",
    territorialNote: "A prática circula em redes nordestinas e assume formações, versos e batidas próprias conforme os grupos e comunidades paraibanas.",
    subtitle: "Roda, sapateado e resposta cantada.",
    excerpt: "Uma dança de participação coletiva em que a percussão e o canto responsorial conduzem passos, versos e improvisos.",
    story: [
      "O coco de roda é reconhecido pela roda de brincantes, pelo sapateado marcado e pelo diálogo entre quem puxa o canto e quem responde. A percussão de ganzás, pandeiros, zabumbas ou tambores cria uma base para versos de trabalho, amor, humor e comentário cotidiano. A coreografia não é fixa: cresce com o grupo, com o espaço e com a habilidade de cada participante em entrar na roda.",
      "Na Paraíba, o coco se relaciona com memórias de comunidades do litoral e da Zona da Mata, além de circular em festivais, escolas e grupos de cultura popular. Sua continuidade depende do reconhecimento da oralidade, do corpo e da escuta como formas de arquivo. Este capítulo apresenta o coco como prática viva, sem reduzir sua diversidade a uma única origem ou a uma coreografia de palco.",
    ],
    visualMotif: "roda de passos, ganzá e lua de terreiro",
    sources: [sources.cocoCiranda, sources.patrimonio],
  },
  {
    number: 4,
    slug: "quadrilha-junina",
    title: "Quadrilha Junina",
    category: "danca",
    categoryLabel: "Dança",
    region: "Campina Grande, João Pessoa e municípios do interior",
    territorialNote: "As quadrilhas integram os calendários juninos paraibanos e conjugam tradição, criação cênica, costura, música e organização comunitária.",
    subtitle: "Uma coreografia coletiva que transforma o arraial em cena.",
    excerpt: "A quadrilha articula pares, comandos, figurino e narrativa em uma das formas mais reconhecíveis das festas juninas.",
    story: [
      "A quadrilha junina se organiza como dança coletiva de pares, guiada por marcador, música e sequência coreográfica. Casamento matuto, passeio, túnel, roda e despedida são referências recorrentes, mas cada grupo recria enredos, figurinos e desenhos de cena. O que parece apenas espetáculo depende de meses de ensaio, costura, composição musical, produção e mobilização de famílias e bairros.",
      "Na Paraíba, a quadrilha ocupa praças, escolas, associações e grandes festas, com importante presença em Campina Grande e João Pessoa. O reconhecimento legal das quadrilhas como manifestação da cultura nacional reforça sua relevância, mas não substitui o apoio às pessoas que sustentam a prática durante todo o ano. Ler a quadrilha é ler uma pedagogia de convivência e cooperação, traduzida em música, passos e cor.",
    ],
    visualMotif: "bandeirolas, pares em roda e fitas",
    sources: [sources.junina, sources.forro],
  },
  {
    number: 5,
    slug: "maracatu",
    title: "Maracatu",
    category: "danca",
    categoryLabel: "Dança",
    region: "João Pessoa e circuitos urbanos de cultura popular",
    territorialNote: "Grupos paraibanos dialogam com matrizes afro-brasileiras e pernambucanas, produzindo repertórios e processos formativos situados no estado.",
    subtitle: "Cortejo, percussão e memória afro-brasileira.",
    excerpt: "O maracatu articula baque, dança, estandarte e cortejo em uma linguagem de presença coletiva e afirmação cultural.",
    story: [
      "Maracatu é palavra de muitos sentidos, associada a cortejos, percussões, danças e referências históricas afro-brasileiras. O toque dos tambores organiza a caminhada, enquanto estandartes, personagens e indumentárias fazem da rua um espaço de memória e invenção. Seus diferentes modos de existir exigem atenção às comunidades que os praticam, sem apagar as distinções entre nações, baques e territórios.",
      "Na Paraíba, iniciativas culturais e grupos de João Pessoa aproximam formação percussiva, dança e debates sobre ancestralidade. O capítulo reconhece que algumas matrizes históricas são fortemente ligadas a Pernambuco, ao mesmo tempo em que valoriza a presença paraibana como processo local de criação, ensino e mobilização cultural. A ênfase está no trabalho coletivo: tocar junto, aprender junto e ocupar a cidade com respeito às tradições de matriz africana.",
    ],
    visualMotif: "alfaia, estandarte e cortejo",
    sources: [sources.maracatuPb, sources.iphaep],
  },
  {
    number: 6,
    slug: "cavalo-marinho",
    title: "Cavalo-Marinho",
    category: "danca",
    categoryLabel: "Dança",
    region: "Litoral Norte e Zona da Mata, em conexão com a Mata Norte nordestina",
    territorialNote: "A brincadeira possui circulação histórica entre Pernambuco e Paraíba; suas realizações devem ser reconhecidas pela rede de mestres, famílias e grupos de cada localidade.",
    subtitle: "Uma brincadeira de personagens, música e noite longa.",
    excerpt: "Cavalo-Marinho condensa teatro popular, música, dança e poesia em uma sucessão de personagens e cenas.",
    story: [
      "O Cavalo-Marinho é uma brincadeira de longa duração, composta por música, dança, poesia, máscara e improviso. O banco, as rabecas, os pandeiros e os personagens constroem uma dramaturgia em que figuras de autoridade, bichos, trabalhadores e seres fantásticos entram e saem da roda. A experiência não cabe em uma definição única: é ritual de convivência, arquivo de memória e ação cênica que se recria em cada apresentação.",
      "A proximidade territorial entre a Mata Norte de Pernambuco e o Litoral Norte paraibano ajuda a explicar vínculos, viagens de mestres e circulação de repertórios, mas não autoriza tratar a Paraíba como simples extensão de outro estado. O reconhecimento patrimonial deve se transformar em condições concretas de continuidade: aprendizado com mestres, apoio aos instrumentos, registro das narrativas e valorização dos lugares onde a brincadeira acontece.",
    ],
    visualMotif: "cavalo de fita, rabeca e máscara",
    sources: [sources.cavalo, sources.patrimonio],
  },
  {
    number: 7,
    slug: "repente-cordel",
    title: "Repente / Cordel",
    category: "musica",
    categoryLabel: "Música",
    region: "Sertão, Cariri e redes de feira em todo o estado",
    territorialNote: "A cantoria de viola e a literatura de cordel formam um campo nordestino de forte presença paraibana, ligado a feiras, rádios, festivais e encontros de violeiros.",
    subtitle: "A palavra medida, cantada e impressa.",
    excerpt: "Repente e cordel são artes da voz e da escrita popular, unidas pelo verso, pela métrica e pela circulação pública.",
    story: [
      "No repente, dois ou mais cantadores improvisam versos obedecendo a esquemas de rima, métrica e tema. A viola organiza o diálogo e oferece tempo para que a inteligência poética transforme notícia, lembrança, crítica e humor em canto. O valor da prática está tanto no domínio técnico quanto na relação imediata com quem escuta, reage, pede um mote e reconhece a qualidade da resposta.",
      "O cordel compartilha com a cantoria o gosto pelo verso narrativo, pela oralidade e pela circulação em espaços populares. Folhetos, capas xilogravadas, feiras e leituras em voz alta tornam a literatura de cordel um meio de memória e comentário social. Na Paraíba, essa tradição se articula com sertões, cidades e instituições de cultura, mantendo viva a ideia de que a palavra também é instrumento, documento e festa.",
    ],
    visualMotif: "viola, folheto e xilogravura",
    sources: [sources.repente, sources.patrimonio],
  },
  {
    number: 8,
    slug: "carnaval-de-rua",
    title: "Carnaval de Rua",
    category: "festa",
    categoryLabel: "Festa",
    region: "João Pessoa e municípios do litoral",
    territorialNote: "A experiência paraibana se organiza por blocos, agremiações, frevos, marchinhas, orquestras e ocupação dos espaços públicos.",
    subtitle: "A cidade em bloco, ritmo e encontro.",
    excerpt: "O carnaval de rua transforma ruas e praças em território temporário de música, fantasia, sociabilidade e criação coletiva.",
    story: [
      "Carnaval de rua não é apenas um calendário de shows: é uma forma de ocupar a cidade com blocos, orquestras, fantasias, marchinhas, frevos e repertórios que passam de geração em geração. Cada agremiação estabelece uma identidade, um percurso e uma rede de trabalho que envolve músicos, costureiras, produtores, moradores e comerciantes. O espaço urbano ganha outra escala quando a multidão acompanha o ritmo e transforma a rua em palco compartilhado.",
      "Em João Pessoa e em cidades litorâneas, o carnaval dialoga com tradições locais e com circuitos nordestinos mais amplos. Sua preservação pede políticas para grupos pequenos, segurança sem descaracterização, acessibilidade e memória dos bairros. Este capítulo enfoca o valor público do carnaval: a possibilidade de encontrar pessoas diferentes, contar histórias da cidade e renovar, a cada ano, formas de celebrar em comum.",
    ],
    visualMotif: "confete, estandarte e metais",
    sources: [sources.carnivalPb, sources.iphaep],
  },
  {
    number: 9,
    slug: "fandango",
    title: "Fandango",
    category: "danca",
    categoryLabel: "Dança",
    region: "Referência comparativa: circulação brasileira, sem origem paraibana documentada",
    territorialNote: "O Fandango Caiçara é associado a comunidades do litoral de São Paulo e Paraná. Ele integra a lista por solicitação editorial e é apresentado com transparência, como contraste para pensar circulação, território e salvaguarda.",
    subtitle: "Uma dança de território, trabalho e transmissão.",
    excerpt: "O capítulo introduz o Fandango como referência comparativa e deixa explícito que sua origem não é paraibana.",
    story: [
      "Fandango designa práticas musicais e coreográficas diversas, mas o Fandango Caiçara é especialmente ligado a comunidades tradicionais do litoral de São Paulo e Paraná. Rabeca, viola, adufo, dança de pares e repertórios transmitidos em festas e mutirões compõem uma forma cultural profundamente vinculada a um território específico. Por isso, deslocá-lo para a Paraíba como se fosse manifestação originária do estado seria historicamente incorreto.",
      "A presença deste capítulo cumpre a lista editorial definida para o livro e funciona como exercício de leitura crítica do patrimônio. Ele convida o leitor a observar como músicas e danças podem viajar, inspirar e ser estudadas sem perder o vínculo com suas comunidades de origem. O Bestiário Cultural assume aqui uma prática de curadoria responsável: informar o limite territorial em vez de inventar uma relação que as fontes não confirmam.",
    ],
    visualMotif: "rabeca, viola e passos de madeira",
    sources: [sources.fandango, sources.patrimonio],
  },
  {
    number: 10,
    slug: "ciranda",
    title: "Ciranda",
    category: "danca",
    categoryLabel: "Dança",
    region: "Litoral e espaços de convivência comunitária",
    territorialNote: "A ciranda circula pelo Nordeste e ganha, em grupos paraibanos, formas próprias de canto, roda, repertório e encontro intergeracional.",
    subtitle: "Uma roda aberta para cantar e pertencer.",
    excerpt: "Na ciranda, o gesto simples de dar as mãos constrói uma dança de participação, escuta e continuidade.",
    story: [
      "A ciranda se reconhece na roda que acolhe diferentes idades e experiências. Os passos acompanhados, o canto de chamada e resposta e a repetição criam uma forma acessível de participação, mas sua simplicidade é aparente: cada mestre, grupo e comunidade define repertórios, ritmos e modos de conduzir a dança. A roda é também uma imagem de pertencimento, pois ninguém ocupa o centro sozinho.",
      "Na Paraíba, a ciranda aparece em contextos de cultura popular, educação e festividades litorâneas. O capítulo evita aprisioná-la em uma coreografia escolar, destacando sua dimensão coletiva e sua relação com memória, mar, festa e conversa. Sustentar a ciranda significa garantir condições para que os encontros continuem, com respeito a quem guarda os repertórios e a quem convida novas pessoas para a roda.",
    ],
    visualMotif: "mãos dadas, mar e lua",
    sources: [sources.cocoCiranda, sources.iphaep],
  },
  {
    number: 11,
    slug: "pastoril",
    title: "Pastoril",
    category: "danca",
    categoryLabel: "Dança",
    region: "Brejo, Litoral e ciclos natalinos",
    territorialNote: "As formas de pastoril na Paraíba se vinculam ao calendário natalino e às redes locais de canto, dança e devoção popular.",
    subtitle: "Canto de Natal, cores de cordão e devoção popular.",
    excerpt: "O pastoril reúne personagens, música e dança em celebrações do ciclo natalino e da memória religiosa popular.",
    story: [
      "Pastoril é um folguedo do ciclo natalino em que grupos de pastoras cantam, dançam e encenam referências ao nascimento de Jesus. Cordões coloridos, personagens cômicos, pastorinhas e mestras configuram diferentes formas de apresentação. Embora tenha raízes em tradições religiosas, o pastoril se faz também como brincadeira, espetáculo e espaço de sociabilidade, com repertórios que se ajustam a cada comunidade.",
      "Na Paraíba, o pastoril encontra continuidade em igrejas, praças, grupos culturais e famílias que mantêm a prática durante o período de Natal e Reis. O que merece ser documentado não é somente a aparência do figurino, mas o processo de ensinar cantos, preparar roupas, organizar apresentações e construir pertencimento. O folguedo revela como fé, arte e convivência podem coexistir em uma linguagem popular complexa.",
    ],
    visualMotif: "cordões azul e encarnado, estrela e fitas",
    sources: [sources.pastorilPb, sources.lapinhaPb],
  },
  {
    number: 12,
    slug: "reisado",
    title: "Reisado",
    category: "danca",
    categoryLabel: "Dança",
    region: "Sertão, Cariri, Brejo e ciclos de Reis",
    territorialNote: "O reisado se manifesta em formas locais de visita, canto, dança e personagens, especialmente no período entre o Natal e o Dia de Reis.",
    subtitle: "Visita, canto e personagens para abrir o ano.",
    excerpt: "O reisado leva música e dramatização a casas, ruas e terreiros, atualizando um calendário de fé, brincadeira e memória.",
    story: [
      "O reisado é um conjunto de práticas do ciclo de Natal e Reis que reúne cantoria, visitação, dança, figuras mascaradas e encenação. Os grupos percorrem caminhos definidos pela memória da comunidade, levando versos e personagens que alternam louvação, comicidade e diálogo. O sentido da brincadeira muda conforme o território, pois cada conjunto desenvolve seu modo de cantar, vestir e receber.",
      "Na Paraíba, a presença de reisados se relaciona com festas de fim de ano, comunidades rurais e urbanas e processos de transmissão familiar. O capítulo propõe olhar para os detalhes que sustentam a continuidade: a preparação do grupo, o aprendizado das toadas, o cuidado com os objetos e a hospitalidade de quem recebe. Mais que vestígio do passado, o reisado é uma maneira de organizar o tempo festivo e reforçar laços sociais.",
    ],
    visualMotif: "coroa, viola e estrela de Reis",
    sources: [sources.reisadoPb, sources.iphaep],
  },
  {
    number: 13,
    slug: "baiao",
    title: "Baião",
    category: "musica",
    categoryLabel: "Música",
    region: "Cariri, Agreste, Sertão e circuitos de forró",
    territorialNote: "O baião integra o campo das matrizes tradicionais do forró e circula na Paraíba por repertórios de baile, rádio, festivais e ensino musical.",
    subtitle: "O pulso que faz caminhar a música nordestina.",
    excerpt: "Baião é ritmo, repertório e modo de organizar o balanço entre sanfona, zabumba, triângulo e voz.",
    story: [
      "O baião tornou-se uma das sonoridades mais reconhecidas do Nordeste, articulando um pulso marcado, dança e narrativas sobre trabalho, migração, paisagem e afetos. Sua difusão no século XX não apagou raízes anteriores de práticas populares; ao contrário, ampliou a circulação de instrumentos e repertórios que já faziam parte dos forrós. A sanfona conduz frases melódicas, enquanto zabumba e triângulo sustentam uma base de movimento constante.",
      "Na Paraíba, o baião habita festejos juninos, conjuntos de forró, escolas de música e escutas familiares. O capítulo o apresenta como parte de uma rede de gêneros, e não como peça isolada de museu. Sua preservação passa por ouvir mestres, apoiar espaços de baile, registrar repertórios e garantir que novas gerações possam tocar e dançar sem perder a ligação com os contextos em que o ritmo ganhou sentido.",
    ],
    visualMotif: "sanfona, sol do sertão e zabumba",
    sources: [sources.forro, sources.junina],
  },
  {
    number: 14,
    slug: "xaxado",
    title: "Xaxado",
    category: "danca",
    categoryLabel: "Dança",
    region: "Sertão e rotas de memória do cangaço",
    territorialNote: "A dança é historicamente associada ao sertão pernambucano e às narrativas do cangaço; na Paraíba, aparece em repertórios regionais, apresentações e ações de memória sertaneja.",
    subtitle: "Passo riscado, canto de marcha e imaginação sertaneja.",
    excerpt: "O xaxado é uma dança de forte marcação rítmica, vinculada à memória do sertão e às narrativas sobre o cangaço.",
    story: [
      "O xaxado é geralmente descrito como dança de passos arrastados ou marcados, acompanhados por canto, palmas e forte senso de marcha. Sua imagem pública foi ligada às narrativas do cangaço e ao sertão de Pernambuco, mas a circulação de filmes, canções, festas e grupos culturais tornou a dança uma referência regional mais ampla. A forma de dançar também varia: há grupos que privilegiam a roda, outros que enfatizam fileiras e encenações.",
      "Na Paraíba, o xaxado deve ser lido como presença em circuitos sertanejos e de memória regional, e não como origem local automaticamente comprovada. Essa distinção não diminui seu valor cultural; ao contrário, permite reconhecer as viagens de repertórios, os intercâmbios e as releituras. O capítulo propõe acompanhar a dança por seus usos contemporâneos, seus contextos de apresentação e as pessoas que decidem mantê-la ativa.",
    ],
    visualMotif: "passos no chão seco, chapéu e sanfona",
    sources: [sources.xaxadoPb, sources.forro],
  },
  {
    number: 15,
    slug: "cangaco",
    title: "Cangaço",
    category: "festa",
    categoryLabel: "Festa",
    region: "Sertão e rotas de memória regional",
    territorialNote: "O cangaço é um fenômeno histórico, não uma manifestação cultural única. A categoria ‘Festa’ é usada aqui apenas para organizar o capítulo conforme a taxonomia solicitada; o conteúdo trata de memória, representação e debate crítico.",
    subtitle: "Memória sertaneja entre história, mito e representação.",
    excerpt: "O cangaço é apresentado como tema de memória cultural e não como espetáculo descontextualizado ou categoria folclórica homogênea.",
    story: [
      "Cangaço nomeia experiências históricas de bandos armados e conflitos sociais que marcaram o Nordeste entre fins do século XIX e primeiras décadas do século XX. Fotografias, canções, cordéis, cinema, indumentárias e narrativas familiares contribuíram para formar uma imagem pública duradoura, muitas vezes oscilando entre romantização e condenação. Por isso, falar de cangaço exige separar o fato histórico das encenações e dos símbolos que ele inspirou.",
      "Na Paraíba, o tema pertence a geografias sertanejas, memórias de fronteira e repertórios culturais que dialogam com estados vizinhos. O livro o inclui como capítulo crítico, pois a lista editorial o exige, mas evita reduzir violência e desigualdade a decoração de festa. O foco recai sobre como comunidades, artistas e pesquisadores elaboram o passado: por meio de narrativas, objetos, roteiros culturais e perguntas sobre justiça, memória e identidade.",
    ],
    visualMotif: "chapéu de couro, mapa de rotas e cordel",
    sources: [sources.cangacoPb, sources.iphaep],
  },
  {
    number: 16,
    slug: "artesanato-de-barro",
    title: "Artesanato de Barro",
    category: "artesanato",
    categoryLabel: "Artesanato",
    region: "Agreste, Brejo e comunidades de oleiras e oleiros",
    territorialNote: "A produção de barro na Paraíba se relaciona a técnicas, matérias-primas e circuitos de venda próprios de cada comunidade; o estado mantém ampla diversidade de objetos utilitários e figurativos.",
    subtitle: "Terra, água, fogo e mão: o tempo da matéria.",
    excerpt: "O artesanato de barro transforma argila e memória em utensílios, figuras e objetos que carregam saberes comunitários.",
    story: [
      "Trabalhar o barro requer conhecer a terra, escolher a argila, preparar a massa, modelar, secar e queimar. Cada etapa envolve observação do clima, domínio do fogo e experiência transmitida em oficinas, quintais e famílias. Panelas, potes, brinquedos, imagens, recipientes e figuras não são apenas produtos: guardam escolhas estéticas, utilitárias e afetivas de quem reconhece na matéria uma linguagem própria.",
      "Na Paraíba, o artesanato de barro conecta comunidades de oleiras e oleiros a feiras, salões e políticas de valorização do trabalho manual. O capítulo destaca a necessidade de reconhecer autoria, remuneração justa e sustentabilidade na coleta de matéria-prima. Preservar o ofício é assegurar condições para que as pessoas continuem fazendo, ensinando e vendendo seus objetos sem que a tradição seja esvaziada em uma imagem genérica do Nordeste.",
    ],
    visualMotif: "pote, argila e forno de queima",
    sources: [sources.ceramicPb, sources.pbArt],
  },
  {
    number: 17,
    slug: "renda-renascenca",
    title: "Renda Renascença",
    category: "artesanato",
    categoryLabel: "Artesanato",
    region: "Cariri paraibano",
    territorialNote: "A produção é fortemente associada ao Cariri e envolve milhares de rendeiras. A técnica utiliza o lacê como base para desenhos construídos com linha e agulha.",
    subtitle: "Linhas que desenham memória e trabalho no Cariri.",
    excerpt: "A Renda Renascença une precisão técnica, imaginação ornamental e transmissão feminina de saberes em comunidades do Cariri.",
    story: [
      "Na Renda Renascença, um fitilho chamado lacê organiza o desenho que será preenchido e unido por pontos feitos com linha e agulha. Flores, arabescos e folhas ganham forma pela repetição cuidadosa de gestos, em um trabalho que demanda tempo, visão e concentração. A técnica se aprende pela convivência: observando mães, avós, tias, vizinhas e mestras que conhecem tanto o ponto quanto o ritmo de produção.",
      "O Programa do Artesanato Paraibano registra a permanência de milhares de rendeiras no Cariri e aponta a Indicação Geográfica como instrumento de valorização. Ainda assim, a renda não se preserva apenas por selo: ela depende de renda digna, redes de comercialização, formação de novas artesãs e reconhecimento público do trabalho. O capítulo aproxima a beleza da peça das condições concretas de quem a produz.",
    ],
    visualMotif: "lacê, arabescos e agulha",
    sources: [sources.renda, sources.pbArt],
  },
  {
    number: 18,
    slug: "ceramica-de-caruaru",
    title: "Cerâmica de Caruaru",
    category: "artesanato",
    categoryLabel: "Artesanato",
    region: "Caruaru, Pernambuco — referência regional comparativa",
    territorialNote: "A cerâmica de Caruaru pertence a uma tradição pernambucana. O capítulo é mantido por exigência da lista e explicita que não se trata de origem paraibana.",
    subtitle: "Figuras de barro e a ética de nomear o território certo.",
    excerpt: "A cerâmica de Caruaru é apresentada como referência nordestina comparativa, com origem explicitamente vinculada a Pernambuco.",
    story: [
      "A cerâmica figurativa de Caruaru está associada ao agreste pernambucano e a uma tradição de modelagem que transformou cenas do cotidiano, animais, personagens religiosos e tipos sociais em objetos de barro. Sua circulação nacional contribuiu para que o imaginário da arte popular nordestina fosse reconhecido muito além de seu território, mas essa projeção não deve apagar a origem concreta de seus criadores e de sua cidade.",
      "Este capítulo mantém a denominação solicitada e assume seu caráter comparativo. Em vez de atribuir a técnica à Paraíba, ele convida a observar afinidades e diferenças entre centros artesanais do Nordeste, incluindo comunidades paraibanas de cerâmica e barro. Uma curadoria responsável começa por nomear corretamente os lugares: admirar uma tradição não exige deslocá-la de seus vínculos históricos.",
    ],
    visualMotif: "figura de barro, feira e forno",
    sources: [sources.caruaru, sources.ceramicPb],
  },
  {
    number: 19,
    slug: "lapinha",
    title: "Lapinha",
    category: "festa",
    categoryLabel: "Festa",
    region: "Brejo, Litoral e ciclos natalinos",
    territorialNote: "A lapinha participa das celebrações de Natal e Reis, reunindo presépio, canto, visitação e repertórios compartilhados com outros folguedos religiosos.",
    subtitle: "Presépio vivo, canto e visita no tempo de Natal.",
    excerpt: "Lapinha designa práticas em torno do presépio e do ciclo natalino, onde devoção e celebração popular se encontram.",
    story: [
      "Lapinha é nome associado ao presépio e, em diferentes localidades, a práticas de canto, visitação e encenação ligadas ao nascimento de Jesus. As figuras do presépio, a montagem do espaço, as toadas e os encontros familiares criam uma temporalidade própria entre dezembro e o Dia de Reis. Como acontece em outros folguedos, as formas não são uniformes: mudam com a comunidade, a paróquia, a casa e a memória de quem organiza.",
      "Na Paraíba, lapinhas convivem com pastoril, reisado e outras expressões do ciclo natalino. Documentá-las exige olhar para o detalhe doméstico e comunitário: o cuidado de guardar imagens, renovar enfeites, ensinar canções e receber visitantes. O capítulo valoriza essa escala íntima da cultura, em que uma celebração pode atravessar gerações sem deixar de se adaptar ao presente.",
    ],
    visualMotif: "presépio, estrela e lamparina",
    sources: [sources.lapinhaPb, sources.patrimonio],
  },
  {
    number: 20,
    slug: "festa-de-sao-joao",
    title: "Festa de São João",
    category: "festa",
    categoryLabel: "Festa",
    region: "Campina Grande, Cariri, Agreste, Sertão e municípios de todo o estado",
    territorialNote: "A festa de São João tem grande expressão na Paraíba, combinando dimensões religiosas, culinárias, musicais, turísticas e comunitárias com características próprias de cada município.",
    subtitle: "Fogueira, milho, forró e comunidade em celebração.",
    excerpt: "São João é uma constelação de práticas: devoção, culinária, dança, música, brincadeira e encontro em torno da colheita e da cidade.",
    story: [
      "As festas de São João resultam de encontros entre calendários católicos, saberes agrícolas, práticas indígenas, heranças africanas e invenções locais. Fogueira, milho, bandeirolas, comidas, dança e música compõem uma celebração que muda de escala entre quintais, ruas, arraiais e grandes eventos. O sentido da festa não se resume ao palco: está também nas cozinhas, nas quadrilhas, nos ensaios e na preparação feita por comunidades inteiras.",
      "Na Paraíba, Campina Grande tornou-se uma referência amplamente conhecida, mas os festejos se distribuem por diversas cidades e comunidades, cada uma com suas formas de celebrar. A valorização cultural precisa equilibrar visibilidade, trabalho local e respeito às práticas de pequena escala. Este capítulo propõe enxergar o São João como patrimônio vivido, onde tradição não é repetição imóvel, mas capacidade de reunir pessoas em torno de memória, música e partilha.",
    ],
    visualMotif: "fogueira, milho e bandeirolas",
    sources: [sources.junina, sources.forro],
  },
];

/**
 * Texto-base redigido capítulo a capítulo. As notas de campo permanecem em
 * `editorialNotes` e são apresentadas pelo leitor na página complementar,
 * sem interpolar ou diluir a narrativa principal.
 */
export const culturalEntries: CulturalEntry[] = baseCulturalEntries;

export const culturalCategories: { value: CulturalCategory; label: string }[] = [
  { value: "musica", label: "Música" },
  { value: "danca", label: "Dança" },
  { value: "artesanato", label: "Artesanato" },
  { value: "festa", label: "Festa" },
];
