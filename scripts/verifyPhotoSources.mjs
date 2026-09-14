const sources = [
  ["Bumba Meu Boi", "https://commons.wikimedia.org/wiki/File:Bumba_meu_boi_-_Maranh%C3%A3o,_Brasil.jpg"],
  ["Forró", "https://commons.wikimedia.org/wiki/Category:Forr%C3%B3"],
  ["Coco de Roda", "https://commons.wikimedia.org/wiki/File:Coco_de_roda_-_dance_from_northeast_of_Brazil.jpg"],
  ["Quadrilha Junina", "https://commons.wikimedia.org/wiki/File:Quadrilha_junina_na_Bahia.jpg"],
  ["Maracatu", "https://commons.wikimedia.org/wiki/File:Maracatu_Blackface_Queen.jpg"],
  ["Cavalo-Marinho", "https://commons.wikimedia.org/wiki/File:Cavalo_Marinho.jpg"],
  ["Repente / Cordel", "https://www.gov.br/iphan/pt-br/assuntos/noticias/repente-completa-um-ano-como-patrimonio-cultural-do-brasil"],
  ["Carnaval de Rua", "https://commons.wikimedia.org/wiki/File:Carnaval_de_rua_2024.jpg"],
  ["Fandango", "https://paisagenscaicaras.com.br/fotografias-do-fandango-caicara/"],
  ["Ciranda", "https://jpcultura.joaopessoa.pb.gov.br/agente/2689/grupo_acaua"],
  ["Pastoril", "https://globoplay.globo.com/v/13328743/"],
  ["Reisado", "https://mapacultural.pb.gov.br/espaco/635/Reisadodezabele"],
  ["Baião", "https://commons.wikimedia.org/wiki/Category:Luiz_Gonzaga"],
  ["Xaxado", "https://www.folhape.com.br/cultura/serra-talhada-realiza-16-encontro-nordestino-de-xaxado/"],
  ["Cangaço", "https://commons.wikimedia.org/wiki/Category:Canga%C3%A7o"],
  ["Artesanato de Barro", "https://pap.pb.gov.br/artesaosparaibanos/ceramica"],
  ["Renda Renascença", "https://pap.pb.gov.br/artesaosparaibanos/renda-renascenca"],
  ["Cerâmica de Caruaru", "https://commons.wikimedia.org/wiki/File:Potes_de_Barro_-_Feira_de_Caruaru_1990.jpg"],
  ["Lapinha", "https://paraibacriativa.com.br/artista/lapinha-em-cabedelo-pb/"],
  ["Festa de São João", "https://campinagrande.pb.gov.br/"],
];

const rows = [];
for (const [chapter, url] of sources) {
  try {
    const response = await fetch(url, { headers: { "user-agent": "Bestiario Cultural source checker" } });
    const text = (await response.text()).toLowerCase();
    const license = /creative commons|cc-by|cc by|public domain|domínio público/.test(text);
    rows.push({ chapter, url, status: response.status, license });
  } catch {
    rows.push({ chapter, url, status: 0, license: false });
  }
}
console.log(JSON.stringify(rows, null, 2));
