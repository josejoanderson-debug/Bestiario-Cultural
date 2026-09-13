import { culturalCategories, culturalEntries, type CulturalCategory, type CulturalEntry } from "@shared/culturalData";
import { filterCulturalEntries } from "@shared/catalogue";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { BookMarked, BookOpen, ChevronLeft, ChevronRight, Compass, ExternalLink, Feather, Search, Sparkles } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { trpc } from "@/lib/trpc";
import { editorialNotes } from "@shared/editorialNotes";
import { chapterIndexFromPage, openingPageForChapter, pageDirectionFromPointer, pagePositionInChapter, virtualPageCount } from "@shared/reader";
import { photoLedger } from "@shared/photoLedger";

const coverArt = "/cover.svg";

const navItems = [
  { label: "Capa", target: "capa" },
  { label: "Livro", target: "livro" },
  { label: "Catálogo", target: "catalogo" },
  { label: "Créditos", target: "creditos" },
] as const;

const chapterGlyphs: Record<string, string> = {
  "bumba-meu-boi": "✠",
  forro: "♬",
  "coco-de-roda": "◌",
  "quadrilha-junina": "⌘",
  maracatu: "♜",
  "cavalo-marinho": "♞",
  "repente-cordel": "✎",
  "carnaval-de-rua": "✹",
  fandango: "⌇",
  ciranda: "◎",
  pastoril: "✧",
  reisado: "♔",
  baiao: "♩",
  xaxado: "⌁",
  cangaco: "⌖",
  "artesanato-de-barro": "◒",
  "renda-renascenca": "❋",
  "ceramica-de-caruaru": "◐",
  lapinha: "✦",
  "festa-de-sao-joao": "✺",
};

const chapterImages: Record<string, string> = {
  "bumba-meu-boi": photoLedger["bumba-meu-boi"]?.image ?? "/cover.svg",
  forro: photoLedger["forro"]?.image ?? "/cover.svg",
  "coco-de-roda": photoLedger["coco-de-roda"]?.image ?? "/cover.svg",
  "quadrilha-junina": photoLedger["quadrilha-junina"]?.image ?? "/cover.svg",
  maracatu: photoLedger["maracatu"]?.image ?? "/cover.svg",
  "cavalo-marinho": photoLedger["cavalo-marinho"]?.image ?? "/cover.svg",
  "repente-cordel": photoLedger["repente-cordel"]?.image ?? "/cover.svg",
  "carnaval-de-rua": photoLedger["carnaval-de-rua"]?.image ?? "/cover.svg",
  fandango: photoLedger["fandango"]?.image ?? "/cover.svg",
  ciranda: photoLedger["ciranda"]?.image ?? "/cover.svg",
  pastoril: photoLedger["pastoril"]?.image ?? "/cover.svg",
  reisado: photoLedger["reisado"]?.image ?? "/cover.svg",
  baiao: photoLedger["baiao"]?.image ?? "/cover.svg",
  xaxado: photoLedger["xaxado"]?.image ?? "/cover.svg",
  cangaco: photoLedger["cangaco"]?.image ?? "/cover.svg",
  "artesanato-de-barro": photoLedger["artesanato-de-barro"]?.image ?? "/cover.svg",
  "renda-renascenca": photoLedger["renda-renascenca"]?.image ?? "/cover.svg",
  "ceramica-de-caruaru": photoLedger["ceramica-de-caruaru"]?.image ?? "/cover.svg",
  lapinha: photoLedger["lapinha"]?.image ?? "/cover.svg",
  "festa-de-sao-joao": photoLedger["festa-de-sao-joao"]?.image ?? "/cover.svg",
};

const chapterImageCaptions: Record<string, string> = {
  "artesanato-de-barro": "Imagem de referência · Programa do Artesanato Paraibano",
  "renda-renascenca": "Imagem de referência · Programa do Artesanato Paraibano",
  "ceramica-de-caruaru": "Imagem de referência · Marco Zero Conteúdo",
  lapinha: "Imagem de referência · acervo cultural público",
  "festa-de-sao-joao": "Imagem de referência · acervo de festa junina",
};

const documentaryImages: Record<string, string> = {
  "bumba-meu-boi": "/cover.svgbumba-meu-boi_34c2e09c.jpg", forro: "/cover.svgforro_8901ecc1.jpg", "coco-de-roda": "/cover.svgcoco-de-roda_e5478b12.jpg", "quadrilha-junina": "/cover.svgquadrilha-junina_0ddf4bd9.jpg", maracatu: "/cover.svgmaracatu_020caab7.jpg", "cavalo-marinho": "/cover.svgcavalo-marinho_4da2b290.jpg", "repente-cordel": "/cover.svgrepente-cordel_b381ea3b.webp", "carnaval-de-rua": "/cover.svgcarnaval-de-rua_7f848f59.jpg", fandango: "/cover.svgfandango_ea14383b.jpg", ciranda: "/cover.svgciranda_a30db3fe.jpg", pastoril: "/cover.svgpastoril_a22f25b4.jpg", reisado: "/cover.svgreisado_2d47cb8d.jpg", baiao: "/cover.svgbaiao_b94fbf39.jpg", xaxado: "/cover.svgxaxado_71a11060.jpg", cangaco: "/cover.svgcangaco_19b956c1.jpg", "artesanato-de-barro": "/cover.svgartesanato-de-barro_2eaae156.jpg", "renda-renascenca": "/cover.svgrenda-renascenca_b6ac2887.png", "ceramica-de-caruaru": "/cover.svgceramica-de-caruaru_bc78edd2.jpg", lapinha: "/cover.svglapinha_9999adef.jpg", "festa-de-sao-joao": "/cover.svgfesta-de-sao-joao_57dbc621.webp",
};

const documentaryCredits: Record<string, { label: string; url: string }> = {
  "bumba-meu-boi": { label: "CDI Europe · CC BY-SA 2.0", url: "https://commons.wikimedia.org/wiki/File:Bumba_meu_boi_-_Maranh%C3%A3o,_Brasil.jpg" }, forro: { label: "Wikimedia Commons · Forró", url: "https://commons.wikimedia.org/wiki/Category:Forr%C3%B3" }, "coco-de-roda": { label: "Wikimedia Commons · Coco de Roda", url: "https://commons.wikimedia.org/wiki/File:Coco_de_roda_-_dance_from_northeast_of_Brazil.jpg" }, "quadrilha-junina": { label: "Turismo Bahia · CC BY-SA 2.0", url: "https://commons.wikimedia.org/wiki/File:Quadrilha_junina_na_Bahia.jpg" }, maracatu: { label: "Wikimedia Commons · Maracatu", url: "https://commons.wikimedia.org/wiki/File:Maracatu_Blackface_Queen.jpg" }, "cavalo-marinho": { label: "Wikimedia Commons · Cavalo-Marinho", url: "https://commons.wikimedia.org/wiki/File:Cavalo_Marinho.jpg" }, "repente-cordel": { label: "Acervo de Repente e Cordel", url: "https://www.gov.br/iphan/pt-br/assuntos/noticias/repente-completa-um-ano-como-patrimonio-cultural-do-brasil" }, "carnaval-de-rua": { label: "Wikimedia Commons · Carnaval de Rua", url: "https://commons.wikimedia.org/wiki/File:Carnaval_de_rua_2024.jpg" }, fandango: { label: "Paisagens Caiçaras · crédito de origem · licença a confirmar", url: "https://paisagenscaicaras.com.br/fotografias-do-fandango-caicara/" }, ciranda: { label: "Registro cultural de João Pessoa", url: "https://jpcultura.joaopessoa.pb.gov.br/agente/2689/grupo_acaua" }, pastoril: { label: "Pastoril Profano · crédito de origem · licença a confirmar", url: "https://globoplay.globo.com/v/13328743/" }, reisado: { label: "Mapa Cultural da Paraíba", url: "https://mapacultural.pb.gov.br/espaco/635/Reisadodezabele" }, baiao: { label: "Wikimedia Commons · Luiz Gonzaga", url: "https://commons.wikimedia.org/wiki/Category:Luiz_Gonzaga" }, xaxado: { label: "Encontro Nordestino de Xaxado", url: "https://www.folhape.com.br/cultura/serra-talhada-realiza-16-encontro-nordestino-de-xaxado/" }, cangaco: { label: "Wikimedia Commons · Cangaço", url: "https://commons.wikimedia.org/wiki/Category:Canga%C3%A7o" }, "artesanato-de-barro": { label: "Programa do Artesanato Paraibano", url: "https://pap.pb.gov.br/artesaosparaibanos/ceramica" }, "renda-renascenca": { label: "Programa do Artesanato Paraibano", url: "https://pap.pb.gov.br/artesaosparaibanos/renda-renascenca" }, "ceramica-de-caruaru": { label: "Wikimedia Commons · Feira de Caruaru", url: "https://commons.wikimedia.org/wiki/File:Potes_de_Barro_-_Feira_de_Caruaru_1990.jpg" }, lapinha: { label: "Lapinha em Santa Rita, PB", url: "https://paraibacriativa.com.br/artista/lapinha-em-cabedelo-pb/" }, "festa-de-sao-joao": { label: "São João de Campina Grande", url: "https://campinagrande.pb.gov.br/" },
};

const licensedDocumentaryImages: Record<string, string> = {
  forro: "/cover.svgforro-festa-cc-by-sa-2_b1d72f04.jpg", "repente-cordel": "/cover.svgrepente-cordel_c8de79ce.jpg", fandango: "/cover.svgfandango-cc0_18d69836.jpg", ciranda: "/cover.svgciranda_01eb8ef8.jpg", pastoril: "/cover.svgreisado_e58610c6.jpg", reisado: "/cover.svgreisado_e58610c6.jpg", baiao: "/cover.svgbaiao-luiz-gonzaga-pd_a4553ff8.png", xaxado: "/cover.svgxaxado_00165cf9.jpg", cangaco: "/cover.svgcangaco-vestimenta-cc-by-2_f415966a.jpg", "artesanato-de-barro": "/cover.svgartesanato-de-barro_ab7de161.jpg", "renda-renascenca": "/cover.svgrenda-renascenca_cd76cef5.jpg", lapinha: "/cover.svglapinha_43482360.jpg", "festa-de-sao-joao": "/cover.svgfesta-de-sao-joao_16276d5b.jpg",
};

const verifiedPhotoCredits: Record<string, { label: string; url: string }> = {
  forro: { label: "minc_brasil · CC BY-SA 2.0", url: "https://commons.wikimedia.org/wiki/File:Festa_de_forr%C3%B3.jpg" }, "repente-cordel": { label: "Wikimedia Commons · CC BY 2.5", url: "https://commons.wikimedia.org/wiki/File:Literatura_de_cordel_REFON.jpg" }, fandango: { label: "Wikimedia Commons · CC0 1.0", url: "https://commons.wikimedia.org/wiki/File:Fandango_CTG.webm" }, ciranda: { label: "Wikimedia Commons · CC BY-SA 2.0", url: "https://commons.wikimedia.org/wiki/File:Ciranda_(dan%C3%A7a).jpg" }, pastoril: { label: "Wikimedia Commons · CC BY 4.0 · referência de folguedo", url: "https://commons.wikimedia.org/wiki/File:Reisado_Cearense.jpg" }, reisado: { label: "Wikimedia Commons · CC BY 4.0", url: "https://commons.wikimedia.org/wiki/File:Reisado_Cearense.jpg" }, baiao: { label: "Mauro Coelho · domínio público", url: "https://commons.wikimedia.org/wiki/File:Luiz_Gonzaga_1988.png" }, xaxado: { label: "Wikimedia Commons · CC BY 2.0", url: "https://commons.wikimedia.org/wiki/File:Apresenta%C3%A7%C3%A3o_do_Grupo_de_Dan%C3%A7a_Xaxado_(19529557050).jpg" }, cangaco: { label: "Luci Correia · CC BY 2.0", url: "https://commons.wikimedia.org/wiki/File:Vestimenta_de_cangaceiro.jpg" }, "artesanato-de-barro": { label: "Wikimedia Commons · CC BY-SA 4.0", url: "https://commons.wikimedia.org/wiki/File:Maragogipinho_Bahia_Olaria_2019-2-5.jpg" }, "renda-renascenca": { label: "Wikimedia Commons · CC BY-SA 4.0", url: "https://commons.wikimedia.org/wiki/File:RENDEIRA_FAZENDO_RENDA_RENASCEN%C3%87A.jpg" }, lapinha: { label: "Wikimedia Commons · CC BY 2.0", url: "https://commons.wikimedia.org/wiki/File:Pres%C3%A9pio,_lapinha_rochinha_minimalista.jpg" }, "festa-de-sao-joao": { label: "Wikimedia Commons · CC BY-SA 4.0", url: "https://commons.wikimedia.org/wiki/File:Festa_junina_Festa_de_S%C3%A3o_Jo%C3%A3o_periperi_Raul_Golinelli_Salvador_Bahia_01.jpg" },
};

const chapterDetailImages: Record<string, string> = {
  "bumba-meu-boi": photoLedger["bumba-meu-boi" as keyof typeof photoLedger]?.image ?? "/cover.svg",
  forro: photoLedger[forro as keyof typeof photoLedger]?.image ?? "/cover.svg",
  "coco-de-roda": photoLedger["coco-de-roda" as keyof typeof photoLedger]?.image ?? "/cover.svg",
  "quadrilha-junina": photoLedger["quadrilha-junina" as keyof typeof photoLedger]?.image ?? "/cover.svg",
  maracatu: photoLedger[maracatu as keyof typeof photoLedger]?.image ?? "/cover.svg",
  "cavalo-marinho": photoLedger["cavalo-marinho" as keyof typeof photoLedger]?.image ?? "/cover.svg",
  "repente-cordel": photoLedger["repente-cordel" as keyof typeof photoLedger]?.image ?? "/cover.svg",
  "carnaval-de-rua": photoLedger["carnaval-de-rua" as keyof typeof photoLedger]?.image ?? "/cover.svg",
  fandango: photoLedger[fandango as keyof typeof photoLedger]?.image ?? "/cover.svg",
  ciranda: photoLedger[ciranda as keyof typeof photoLedger]?.image ?? "/cover.svg",
  pastoril: photoLedger[pastoril as keyof typeof photoLedger]?.image ?? "/cover.svg",
  reisado: photoLedger[reisado as keyof typeof photoLedger]?.image ?? "/cover.svg",
  baiao: photoLedger[baiao as keyof typeof photoLedger]?.image ?? "/cover.svg",
  xaxado: photoLedger[xaxado as keyof typeof photoLedger]?.image ?? "/cover.svg",
  cangaco: photoLedger[cangaco as keyof typeof photoLedger]?.image ?? "/cover.svg",
  "artesanato-de-barro": photoLedger["artesanato-de-barro" as keyof typeof photoLedger]?.image ?? "/cover.svg",
  "renda-renascenca": photoLedger["renda-renascenca" as keyof typeof photoLedger]?.image ?? "/cover.svg",
  "ceramica-de-caruaru": photoLedger["ceramica-de-caruaru" as keyof typeof photoLedger]?.image ?? "/cover.svg",
  lapinha: photoLedger[lapinha as keyof typeof photoLedger]?.image ?? "/cover.svg",
  "festa-de-sao-joao": photoLedger["festa-de-sao-joao" as keyof typeof photoLedger]?.image ?? "/cover.svg",
};

function scrollToSection(target: string) {
  document.getElementById(target)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function Ornament({ className = "" }: { className?: string }) {
  return <span aria-hidden="true" className={`ornament ${className}`}>✦</span>;
}

function ChapterIllustration({ entry, compact = false }: { entry: CulturalEntry; compact?: boolean }) {
  const glyph = chapterGlyphs[entry.slug] ?? "✦";
  return (
    <div
      className={`chapter-illustration chapter-illustration--${entry.category} ${compact ? "chapter-illustration--compact" : ""}`}
      role="img"
      aria-label={`Ilustração artística representando ${entry.title}: ${entry.visualMotif}.`}
    >
      <span className="illustration-sun" />
      <span className="illustration-hill illustration-hill--one" />
      <span className="illustration-hill illustration-hill--two" />
      <span className="illustration-symbol">{glyph}</span>
      <span className="illustration-motif">{entry.visualMotif}</span>
      {!compact && <span className="illustration-label">Ilustração artística</span>}
    </div>
  );
}

function Cover({ onOpen }: { onOpen: () => void }) {
  const reducedMotion = useReducedMotion();

  return (
    <section id="capa" className="cover-section" aria-labelledby="cover-title">
      <div className="cover-noise" aria-hidden="true" />
      <motion.div
        className="cover-book"
        initial={reducedMotion ? false : { opacity: 0, y: 26, rotate: -1.4 }}
        animate={{ opacity: 1, y: 0, rotate: 0 }}
        transition={{ duration: 0.72, ease: [0.23, 1, 0.32, 1] }}
      >
        <div className="cover-book__spine" aria-hidden="true" />
        <img className="cover-book__art" src={coverArt} alt="Ilustração em xilogravura inspirada nas culturas populares brasileiras." />
        <div className="cover-book__wash" aria-hidden="true" />
        <div className="cover-book__content">
          <span className="cover-kicker">Arquivo vivo · Brasil</span>
          <div className="cover-rule"><Ornament /></div>
          <h1 id="cover-title">Bestiário<br />Cultural</h1>
          <p className="cover-subtitle">Um arquivo vivo das culturas populares brasileiras</p>
          <div className="cover-rule cover-rule--bottom"><Ornament /></div>
          <button className="cover-open" type="button" onClick={onOpen}>
            <BookOpen size={17} strokeWidth={1.8} />
            Entrar na obra
          </button>
          <p className="cover-imprint">Edição digital · 20 capítulos</p>
        </div>
      </motion.div>
      <p className="cover-note">Uma experiência de leitura para escutar histórias, gestos e territórios.</p>
    </section>
  );
}

function BookSpread({ entries, activePage, onChange }: { entries: CulturalEntry[]; activePage: number; onChange: (next: number) => void }) {
  const reducedMotion = useReducedMotion();
  const touchStart = useRef<number | null>(null);
  const entryIndex = chapterIndexFromPage(activePage, entries);
  const entry = entries[entryIndex];
  const pagePosition = pagePositionInChapter(activePage, entries);
  const totalPages = virtualPageCount(entries);
  const canGoBack = activePage > 0;
  const canGoForward = activePage < totalPages - 1;
  const registeredPhoto = entry?.photoUrl ? {
    image: entry.photoUrl,
    label: [entry.photoCredit, entry.photoLicense].filter(Boolean).join(" · ") || "Imagem cadastrada pelo acervo",
    url: entry.photoSourceUrl || entry.photoUrl,
  } : undefined;
  const image = registeredPhoto?.image ?? photoLedger[entry?.slug ?? ""]?.image ?? chapterImages[entry?.slug ?? ""] ?? coverArt;
  const detailImage = chapterDetailImages[entry?.slug ?? ""] ?? image;
  const imageCredit = registeredPhoto ?? photoLedger[entry?.slug ?? ""];
  const imageCaption = imageCredit?.label ?? chapterImageCaptions[entry?.slug ?? ""] ?? "Ilustração editorial";
  const isContextualReference = !registeredPhoto && photoLedger[entry?.slug ?? ""]?.kind === "contextual-reference";
  const imageDescription = isContextualReference ? `Imagem de referência de folguedo para ${entry.title}; não é um registro específico de Pastoril.` : `Fotografia documental de ${entry.title}.`;
  const imageHeading = isContextualReference ? "Imagem de referência" : "Fotografia documental";
  const note = editorialNotes[entry?.slug ?? ""];
  const extraPage = pagePosition >= 4 ? entry?.extraPages?.[pagePosition - 4] : undefined;
  const runningLabel = pagePosition < 4
    ? ["Abertura", "Leitura", "Caderno de território", "Foto e fontes"][pagePosition]
    : extraPage?.eyebrow ?? "Aprofundamento";

  if (!entry) return null;

  const move = (direction: -1 | 1) => {
    const candidate = activePage + direction;
    if (candidate >= 0 && candidate < totalPages) onChange(candidate);
  };

  const handleBookClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement;
    if (target.closest("button, a")) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    move(pageDirectionFromPointer(x, rect.width));
  };

  return (
    <section id="livro" className="book-section" aria-labelledby="book-heading">
      <div className="section-heading section-heading--light">
        <p className="eyebrow">Leitura imersiva</p>
        <h2 id="book-heading">Folhear a obra</h2>
        <p>Clique no lado esquerdo ou direito da página para voltar e avançar na leitura.</p>
      </div>

      <div className="book-stage">
        <div className="book-progress" aria-label={`Página ${activePage + 1} de ${totalPages}`}>
          <span>{String(activePage + 1).padStart(2, "0")}</span>
          <i />
          <span>{String(totalPages).padStart(2, "0")}</span>
        </div>

        <div
          className="virtual-book"
          onClick={handleBookClick}
          onTouchStart={(event) => { touchStart.current = event.touches[0]?.clientX ?? null; }}
          onTouchEnd={(event) => {
            const end = event.changedTouches[0]?.clientX;
            if (touchStart.current === null || end === undefined) return;
            const distance = end - touchStart.current;
            if (Math.abs(distance) > 42) move(distance < 0 ? 1 : -1);
            touchStart.current = null;
          }}
          tabIndex={0}
          role="group"
          aria-label={`Livro virtual na página ${activePage + 1}. Clique à esquerda para página anterior e à direita para próxima.`}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.article
              key={`${entry.slug}-${pagePosition}`}
              className={`virtual-page ${pagePosition === 0 ? "virtual-page--opening" : "virtual-page--chapter"}`}
              initial={reducedMotion ? false : { opacity: 0, rotateY: -10, x: 20 }}
              animate={{ opacity: 1, rotateY: 0, x: 0 }}
              exit={reducedMotion ? undefined : { opacity: 0, rotateY: 10, x: -20 }}
              transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
            >
              <div className="virtual-page__running"><span>Bestiário Cultural</span><span>{runningLabel}</span></div>
              {pagePosition === 0 ? (
                <div className="opening-page">
                  <div className="opening-page__copy">
                    <p className="chapter-label">{entry.categoryLabel}</p>
                    <span className="chapter-index">{String(entry.number).padStart(2, "0")}</span>
                    <h3>{entry.title}</h3>
                    <p className="opening-page__subtitle">{entry.subtitle}</p>
                    <p className="chapter-territory"><Compass size={14} strokeWidth={1.8} /> {entry.region}</p>
                    <div className="page-divider"><Ornament /></div>
                    <p>{entry.excerpt}</p>
                  </div>
                  <figure className="opening-page__image"><img src={image} alt={imageDescription} /><figcaption><a href={imageCredit?.url} target="_blank" rel="noreferrer">{imageCaption}</a></figcaption></figure>
                </div>
              ) : pagePosition === 1 ? (
                <div className="culture-page">
                  <div className="culture-page__head"><div><p className="chapter-label">{entry.categoryLabel}</p><h3>{entry.title}</h3></div><span className="chapter-seal">{String(entry.number).padStart(2, "0")}</span></div>
                  <div className="culture-page__gallery" role="group" aria-label={`Galeria de ${entry.title}: imagem principal, detalhe visual e ilustração complementar.`}>
                    <figure><img src={image} alt={imageDescription} /><figcaption><a href={imageCredit?.url} target="_blank" rel="noreferrer">{imageCaption}</a></figcaption></figure>
                    <figure className="culture-page__detail"><img src={detailImage} alt={`Detalhe visual de ${entry.title}.`} /><figcaption>Detalhe visual</figcaption></figure>
                    <ChapterIllustration entry={entry} compact />
                  </div>
                  <div className="chapter-copy">{entry.story.map((paragraph, index) => <p key={index}>{paragraph}</p>)}</div>
                  <p className="territorial-note"><b>Nota de território.</b> {entry.territorialNote}</p>
                </div>
              ) : pagePosition === 2 ? (
                <div className="field-page"><figure className="field-page__photo"><img src={image} alt={imageDescription} /><figcaption><a href={imageCredit?.url} target="_blank" rel="noreferrer">{imageCaption}</a></figcaption></figure><div className="field-page__copy"><p className="chapter-label">Caderno de território</p><h3>{note?.heading ?? entry.title}</h3><p>{note?.fieldNote ?? entry.excerpt}</p><blockquote>{note?.invitation ?? entry.territorialNote}</blockquote></div></div>
              ) : pagePosition === 3 ? (
                <div className="sources-page"><p className="chapter-label">Registro e continuidade</p><h3>Em torno de {entry.title}</h3><p className="sources-page__lede">Esta página convida a tratar a manifestação como presença viva: uma prática feita de pessoas, ensaios, objetos, territórios e transformações.</p><div className="sources-page__grid"><ChapterIllustration entry={entry} /><div><h4>{imageHeading}</h4><a className="photo-source" href={imageCredit?.url} target="_blank" rel="noreferrer">{imageCaption} <ExternalLink size={14} /></a><h4>Para continuar a leitura</h4><ul>{entry.sources.slice(0, 2).map((source) => <li key={source.url}><a href={source.url} target="_blank" rel="noreferrer">{source.institution} · {source.title}</a></li>)}</ul></div></div></div>
              ) : extraPage ? (
                <div className="extra-page">
                  <div className="extra-page__head"><p className="chapter-label">{extraPage.eyebrow}</p><h3>{extraPage.title}</h3></div>
                  <div className="extra-page__copy">{extraPage.content.split(/\n\s*\n/).filter(Boolean).map((paragraph, index) => <p key={index}>{paragraph}</p>)}</div>
                  <div className={`extra-page__gallery extra-page__gallery--${extraPage.images.length}`} role="group" aria-label={`Galeria de aprofundamento: ${extraPage.title}`}>
                    {extraPage.images.map((photo) => <figure key={`${photo.imageUrl}-${photo.sourceUrl}`}><img src={photo.imageUrl} alt={photo.altText} /><figcaption><a href={photo.sourceUrl} target="_blank" rel="noreferrer">{photo.credit} · {photo.license}</a></figcaption></figure>)}
                  </div>
                </div>
              ) : null}
              <div className="page-number">{String(activePage + 3).padStart(3, "0")}</div>
            </motion.article>
          </AnimatePresence>
          <button className="virtual-page-hitbox virtual-page-hitbox--prev" type="button" disabled={!canGoBack} onClick={() => move(-1)} aria-label="Folhear para a página anterior"><ChevronLeft /></button>
          <button className="virtual-page-hitbox virtual-page-hitbox--next" type="button" disabled={!canGoForward} onClick={() => move(1)} aria-label="Folhear para a próxima página"><ChevronRight /></button>
        </div>
        <p className="book-instruction">Clique na margem esquerda para voltar <i>·</i> clique na margem direita para avançar</p>
      </div>
    </section>
  );
}

function Catalogue({ entries, onSelect }: { entries: CulturalEntry[]; onSelect: (index: number) => void }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<"all" | CulturalCategory>("all");
  const reducedMotion = useReducedMotion();
  const filtered = useMemo(() => filterCulturalEntries(entries, query, category), [category, entries, query]);

  return (
    <section id="catalogo" className="catalogue-section" aria-labelledby="catalogue-heading">
      <div className="catalogue-intro">
        <div className="section-heading">
          <p className="eyebrow">Inventário</p>
          <h2 id="catalogue-heading">Catálogo de manifestações</h2>
          <p>Vinte portas de entrada para leituras, escutas e memórias culturais.</p>
        </div>
        <div className="catalogue-count"><span>{String(filtered.length).padStart(2, "0")}</span><small>resultados</small></div>
      </div>
      <div className="catalogue-controls">
        <label className="search-field">
          <Search size={18} />
          <span className="sr-only">Buscar manifestação</span>
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar pelo nome" type="search" />
        </label>
        <div className="filter-list" role="group" aria-label="Filtrar por categoria">
          <button type="button" className={category === "all" ? "is-active" : ""} onClick={() => setCategory("all")}>Todas</button>
          {culturalCategories.map((item) => <button key={item.value} type="button" className={category === item.value ? "is-active" : ""} onClick={() => setCategory(item.value)}>{item.label}</button>)}
        </div>
      </div>
      <div className="catalogue-grid" aria-live="polite">
        {filtered.map((entry, index) => {
          const originalIndex = entries.findIndex((candidate) => candidate.slug === entry.slug);
          return (
            <motion.article
              className="catalogue-card"
              key={entry.slug}
              initial={reducedMotion ? false : { opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ delay: reducedMotion ? 0 : Math.min(index * 0.025, 0.2), duration: 0.32 }}
            >
              <div className="catalogue-card__top"><span>{String(entry.number).padStart(2, "0")}</span><span>{entry.categoryLabel}</span></div>
              <img className="catalogue-card__photo" src={entry.photoUrl || photoLedger[entry.slug]?.image || chapterImages[entry.slug]} alt={photoLedger[entry.slug]?.kind === "contextual-reference" && !entry.photoUrl ? `Imagem de referência de folguedo para ${entry.title}.` : `Fotografia documental de ${entry.title}.`} />
              <h3>{entry.title}</h3>
              <p>{entry.excerpt}</p>
              <button type="button" onClick={() => onSelect(originalIndex)}>
                Abrir capítulo <ChevronRight size={15} />
              </button>
            </motion.article>
          );
        })}
      </div>
      {!filtered.length && <div className="empty-state"><Feather size={23} /><p>Nenhuma manifestação encontrada com esse filtro.</p></div>}
    </section>
  );
}

function Credits({ entries }: { entries: CulturalEntry[] }) {
  return (
    <section id="creditos" className="credits-section" aria-labelledby="credits-heading">
      <div className="section-heading section-heading--light">
        <p className="eyebrow">Caderno de fontes</p>
        <h2 id="credits-heading">Créditos e referências</h2>
        <p>As sínteses foram redigidas para esta edição a partir de fontes institucionais, acadêmicas e comunitárias. Ilustrações do livro são identificadas como artísticas.</p>
      </div>
      <div className="credits-notice"><Sparkles size={18} /><p><b>Nota curatorial.</b> O acervo explicita os vínculos territoriais de cada prática sem deslocar a autoria das comunidades e dos grupos que a mantêm viva.</p></div>
      <div className="sources-grid">
        {entries.map((entry) => (
          <article className="source-card" key={entry.slug}>
            <div className="source-card__head"><span>{String(entry.number).padStart(2, "0")}</span><h3>{entry.title}</h3></div>
            {(entry.photoUrl || photoLedger[entry.slug]) && <p className="source-card__photo-credit"><a href={entry.photoSourceUrl || entry.photoUrl || photoLedger[entry.slug].url} target="_blank" rel="noreferrer">{photoLedger[entry.slug]?.kind === "contextual-reference" && !entry.photoUrl ? "Imagem de referência" : "Foto documental"}: {[entry.photoCredit, entry.photoLicense].filter(Boolean).join(" · ") || photoLedger[entry.slug]?.label || "Imagem cadastrada pelo acervo"}</a></p>}
            <ul>
              {entry.sources.map((source) => (
                <li key={`${entry.slug}-${source.url}`}>
                  <a href={source.url} target="_blank" rel="noreferrer">
                    <span><b>{source.institution}</b>{source.title}</span>
                    <ExternalLink size={14} />
                  </a>
                  <p>{source.note}</p>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}

export default function Home() {
  const { data } = trpc.cultural.list.useQuery(undefined, {
    staleTime: 15_000,
    refetchInterval: 30_000,
    refetchOnWindowFocus: true,
  });
  const entries = data ?? culturalEntries;
  const [activePage, setActivePage] = useState(() => {
    const requestedPage = Number.parseInt(new URLSearchParams(window.location.search).get("pagina") ?? "0", 10);
    return Number.isFinite(requestedPage) && requestedPage > 0 ? requestedPage : 0;
  });

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement;
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") return;
      if (event.key === "ArrowLeft") setActivePage((current) => Math.max(0, current - 1));
      if (event.key === "ArrowRight") setActivePage((current) => Math.min(virtualPageCount(entries) - 1, current + 1));
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [entries]);

  useEffect(() => {
    setActivePage((current) => Math.min(current, Math.max(virtualPageCount(entries) - 1, 0)));
  }, [entries]);

  const openBook = () => scrollToSection("livro");
  const selectChapter = (index: number) => {
    setActivePage(openingPageForChapter(index, entries));
    window.setTimeout(() => scrollToSection("livro"), 60);
  };

  return (
    <main className="bestiario-app">
      <a className="skip-link" href="#livro">Pular para o livro</a>
      <header className="site-header">
        <button type="button" className="wordmark" onClick={() => scrollToSection("capa")} aria-label="Voltar para a capa">
          <span className="wordmark-mark">BC</span>
          <span className="wordmark-copy"><b>Bestiário</b><small>Cultural</small></span>
        </button>
        <nav aria-label="Navegação principal">
          {navItems.map((item) => <button key={item.target} type="button" onClick={() => scrollToSection(item.target)}>{item.label}</button>)}
        </nav>
      </header>
      <Cover onOpen={openBook} />
      <BookSpread entries={entries} activePage={activePage} onChange={setActivePage} />
      <Catalogue entries={entries} onSelect={selectChapter} />
      <Credits entries={entries} />
      <footer className="site-footer"><BookMarked size={16} /> <span>Bestiário Cultural · arquivo digital de pesquisa e valorização cultural</span><a href="/admin">Área administrativa</a></footer>
    </main>
  );
}
