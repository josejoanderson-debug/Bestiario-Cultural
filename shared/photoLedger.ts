export type PhotoLedgerItem = {
  image: string;
  label: string;
  url: string;
  kind?: "documentary" | "contextual-reference";
};

/** Fonte única para fotografia, atribuição e página de licença exibidas na interface. */
export const photoLedger: Record<string, PhotoLedgerItem> = {
  "bumba-meu-boi": { image: "https://commons.wikimedia.org/wiki/Special:FilePath/Bumba_meu_boi_-_Maranh%C3%A3o%2C_Brasil.jpg", label: "CDI Europe · CC BY-SA 2.0", url: "https://commons.wikimedia.org/wiki/File:Bumba_meu_boi_-_Maranh%C3%A3o,_Brasil.jpg" },
  forro: { image: "https://commons.wikimedia.org/wiki/Special:FilePath/Festa_de_forr%C3%B3.jpg", label: "minc_brasil · CC BY-SA 2.0", url: "https://commons.wikimedia.org/wiki/File:Festa_de_forr%C3%B3.jpg" },
  "coco-de-roda": { image: "https://commons.wikimedia.org/wiki/Special:FilePath/Coco_de_roda_-_dance_from_northeast_of_Brazil.jpg", label: "Wikimedia Commons · Coco de Roda", url: "https://commons.wikimedia.org/wiki/File:Coco_de_roda_-_dance_from_northeast_of_Brazil.jpg" },
  "quadrilha-junina": { image: "https://commons.wikimedia.org/wiki/Special:FilePath/Quadrilha_junina_na_Bahia.jpg", label: "Turismo Bahia · CC BY-SA 2.0", url: "https://commons.wikimedia.org/wiki/File:Quadrilha_junina_na_Bahia.jpg" },
  maracatu: { image: "https://commons.wikimedia.org/wiki/Special:FilePath/Maracatu_Blackface_Queen.jpg", label: "Wikimedia Commons · Maracatu", url: "https://commons.wikimedia.org/wiki/File:Maracatu_Blackface_Queen.jpg" },
  "cavalo-marinho": { image: "https://commons.wikimedia.org/wiki/Special:FilePath/Cavalo_Marinho.jpg", label: "Wikimedia Commons · Cavalo-Marinho", url: "https://commons.wikimedia.org/wiki/File:Cavalo_Marinho.jpg" },
  "repente-cordel": { image: "https://commons.wikimedia.org/wiki/Special:FilePath/Literatura_de_cordel_REFON.jpg", label: "Wikimedia Commons · CC BY 2.5", url: "https://commons.wikimedia.org/wiki/File:Literatura_de_cordel_REFON.jpg" },
  "carnaval-de-rua": { image: "https://commons.wikimedia.org/wiki/Special:FilePath/Carnaval_de_rua_2024.jpg", label: "Wikimedia Commons · Carnaval de Rua", url: "https://commons.wikimedia.org/wiki/File:Carnaval_de_rua_2024.jpg" },
  fandango: { image: "https://commons.wikimedia.org/wiki/Special:FilePath/Fandango_CTG.webm", label: "Wikimedia Commons · CC0 1.0", url: "https://commons.wikimedia.org/wiki/File:Fandango_CTG.webm" },
  ciranda: { image: "https://commons.wikimedia.org/wiki/Special:FilePath/Ciranda_%28dan%C3%A7a%29.jpg", label: "Wikimedia Commons · CC BY-SA 2.0", url: "https://commons.wikimedia.org/wiki/File:Ciranda_(dan%C3%A7a).jpg" },
  pastoril: { image: "https://commons.wikimedia.org/wiki/Special:FilePath/Reisado_Cearense.jpg", label: "Wikimedia Commons · CC BY 4.0 · referência de folguedo", url: "https://commons.wikimedia.org/wiki/File:Reisado_Cearense.jpg", kind: "contextual-reference" },
  reisado: { image: "https://commons.wikimedia.org/wiki/Special:FilePath/Reisado_Cearense.jpg", label: "Wikimedia Commons · CC BY 4.0", url: "https://commons.wikimedia.org/wiki/File:Reisado_Cearense.jpg" },
  baiao: { image: "https://commons.wikimedia.org/wiki/Special:FilePath/Luiz_Gonzaga_1988.png", label: "Mauro Coelho · domínio público", url: "https://commons.wikimedia.org/wiki/File:Luiz_Gonzaga_1988.png" },
  xaxado: { image: "https://commons.wikimedia.org/wiki/Special:FilePath/Apresenta%C3%A7%C3%A3o_do_Grupo_de_Dan%C3%A7a_Xaxado_%2819529557050%29.jpg", label: "Wikimedia Commons · CC BY 2.0", url: "https://commons.wikimedia.org/wiki/File:Apresenta%C3%A7%C3%A3o_do_Grupo_de_Dan%C3%A7a_Xaxado_(19529557050).jpg" },
  cangaco: { image: "https://commons.wikimedia.org/wiki/Special:FilePath/Vestimenta_de_cangaceiro.jpg", label: "Luci Correia · CC BY 2.0", url: "https://commons.wikimedia.org/wiki/File:Vestimenta_de_cangaceiro.jpg" },
  "artesanato-de-barro": { image: "https://commons.wikimedia.org/wiki/Special:FilePath/Maragogipinho_Bahia_Olaria_2019-2-5.jpg", label: "Wikimedia Commons · CC BY-SA 4.0", url: "https://commons.wikimedia.org/wiki/File:Maragogipinho_Bahia_Olaria_2019-2-5.jpg" },
  "renda-renascenca": { image: "https://commons.wikimedia.org/wiki/Special:FilePath/RENDEIRA_FAZENDO_RENDA_RENASCEN%C3%87A.jpg", label: "Wikimedia Commons · CC BY-SA 4.0", url: "https://commons.wikimedia.org/wiki/File:RENDEIRA_FAZENDO_RENDA_RENASCEN%C3%87A.jpg" },
  "ceramica-de-caruaru": { image: "https://commons.wikimedia.org/wiki/Special:FilePath/Potes_de_Barro_-_Feira_de_Caruaru_1990.jpg", label: "Wikimedia Commons · Feira de Caruaru", url: "https://commons.wikimedia.org/wiki/File:Potes_de_Barro_-_Feira_de_Caruaru_1990.jpg" },
  lapinha: { image: "https://commons.wikimedia.org/wiki/Special:FilePath/Pres%C3%A9pio%2C_lapinha_rochinha_minimalista.jpg", label: "Wikimedia Commons · CC BY 2.0", url: "https://commons.wikimedia.org/wiki/File:Pres%C3%A9pio,_lapinha_rochinha_minimalista.jpg" },
  "festa-de-sao-joao": { image: "https://commons.wikimedia.org/wiki/Special:FilePath/Festa_junina_Festa_de_S%C3%A3o_Jo%C3%A3o_periperi_Raul_Golinelli_Salvador_Bahia_01.jpg", label: "Wikimedia Commons · CC BY-SA 4.0", url: "https://commons.wikimedia.org/wiki/File:Festa_junina_Festa_de_S%C3%A3o_Jo%C3%A3o_periperi_Raul_Golinelli_Salvador_Bahia_01.jpg" },
};
