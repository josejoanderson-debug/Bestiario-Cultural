import { useAuth } from "@/_core/hooks/useAuth";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { culturalCategories, type CulturalCategory, type CulturalEntry, type CulturalExtraPage, type CulturalExtraPageImage, type CulturalSource } from "@shared/culturalData";
import { ArrowLeft, Eye, EyeOff, FilePenLine, ImagePlus, KeyRound, Link, Loader2, Plus, Save, ShieldAlert, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";

type CultureDraft = {
  slug: string;
  title: string;
  subtitle: string;
  category: CulturalCategory;
  region: string;
  territorialNote: string;
  excerpt: string;
  storyText: string;
  visualMotif: string;
  sources: CulturalSource[];
  photoUrl: string;
  photoCredit: string;
  photoSourceUrl: string;
  photoLicense: string;
  extraPages: CulturalExtraPage[];
  isPublished: boolean;
};

const categoryNames: Record<CulturalCategory, string> = {
  musica: "Música",
  danca: "Dança",
  artesanato: "Artesanato",
  festa: "Festa",
};

function emptySource(): CulturalSource {
  return { title: "", institution: "", url: "https://", note: "" };
}

function emptyExtraImage(): CulturalExtraPageImage {
  return { imageUrl: "", altText: "", credit: "", sourceUrl: "https://", license: "" };
}

function emptyExtraPage(): CulturalExtraPage {
  return { eyebrow: "Aprofundamento", title: "", content: "", images: [emptyExtraImage(), emptyExtraImage()] };
}

function emptyDraft(): CultureDraft {
  return {
    slug: "",
    title: "",
    subtitle: "",
    category: "musica",
    region: "",
    territorialNote: "",
    excerpt: "",
    storyText: "",
    visualMotif: "",
    sources: [emptySource()],
    photoUrl: "",
    photoCredit: "",
    photoSourceUrl: "",
    photoLicense: "",
    extraPages: [],
    isPublished: true,
  };
}

function toDraft(entry: CulturalEntry): CultureDraft {
  return {
    slug: entry.slug,
    title: entry.title,
    subtitle: entry.subtitle,
    category: entry.category,
    region: entry.region,
    territorialNote: entry.territorialNote,
    excerpt: entry.excerpt,
    storyText: entry.story.join("\n\n"),
    visualMotif: entry.visualMotif,
    sources: entry.sources.length ? entry.sources : [emptySource()],
    photoUrl: entry.photoUrl ?? "",
    photoCredit: entry.photoCredit ?? "",
    photoSourceUrl: entry.photoSourceUrl ?? "",
    photoLicense: entry.photoLicense ?? "",
    extraPages: entry.extraPages ?? [],
    isPublished: entry.isPublished !== false,
  };
}

function AdminContent() {
  const { user, loading } = useAuth();
  const [, setLocation] = useLocation();
  const utils = trpc.useUtils();
  const [selectedSlug, setSelectedSlug] = useState<string | "new">("new");
  const [draft, setDraft] = useState<CultureDraft>(emptyDraft);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { data: localSession, isLoading: isLocalSessionLoading } = trpc.admin.localSession.useQuery();
  const forceLocalLogin = new URLSearchParams(window.location.search).get("acesso") === "local";
  const isAuthorized = !forceLocalLogin && (user?.role === "admin" || localSession?.authenticated === true);
  const { data: cultures = [], isLoading } = trpc.admin.listCultures.useQuery(undefined, { enabled: isAuthorized });

  const selectedCulture = useMemo(() => cultures.find((culture) => culture.slug === selectedSlug) ?? null, [cultures, selectedSlug]);

  useEffect(() => {
    setDraft(selectedCulture ? toDraft(selectedCulture) : emptyDraft());
  }, [selectedCulture]);

  const invalidateEntries = async () => {
    await Promise.all([utils.admin.listCultures.invalidate(), utils.cultural.list.invalidate()]);
  };

  const createCulture = trpc.admin.createCulture.useMutation({
    onSuccess: async (culture) => {
      await invalidateEntries();
      if (culture) setSelectedSlug(culture.slug);
      toast.success("Nova cultura salva no acervo público.");
    },
    onError: (error) => toast.error(error.message),
  });

  const updateCulture = trpc.admin.updateCulture.useMutation({
    onSuccess: async (culture) => {
      await invalidateEntries();
      if (culture) setSelectedSlug(culture.slug);
      toast.success("Alterações publicadas no acervo.");
    },
    onError: (error) => toast.error(error.message),
  });

  const setPublication = trpc.admin.setPublication.useMutation({
    onSuccess: async () => {
      await invalidateEntries();
      toast.success("Status de publicação atualizado.");
    },
    onError: (error) => toast.error(error.message),
  });

  const uploadPhoto = trpc.admin.uploadPhoto.useMutation({ onError: (error) => toast.error(error.message) });

  const localLogin = trpc.admin.localLogin.useMutation({
    onSuccess: async () => {
      setPassword("");
      await Promise.all([utils.admin.localSession.invalidate(), utils.admin.listCultures.invalidate()]);
      setLocation("/admin");
      toast.success("Acesso administrativo liberado.");
    },
    onError: (error) => toast.error(error.message),
  });

  const patchDraft = <K extends keyof CultureDraft>(key: K, value: CultureDraft[K]) => {
    setDraft((current) => ({ ...current, [key]: value }));
  };

  const updateSource = (index: number, key: keyof CulturalSource, value: string) => {
    setDraft((current) => ({
      ...current,
      sources: current.sources.map((source, sourceIndex) => sourceIndex === index ? { ...source, [key]: value } : source),
    }));
  };

  const updateExtraPage = (pageIndex: number, key: Exclude<keyof CulturalExtraPage, "images" | "id">, value: string) => {
    patchDraft("extraPages", draft.extraPages.map((page, index) => index === pageIndex ? { ...page, [key]: value } : page));
  };

  const updateExtraImage = (pageIndex: number, imageIndex: number, key: Exclude<keyof CulturalExtraPageImage, "id">, value: string) => {
    patchDraft("extraPages", draft.extraPages.map((page, index) => index === pageIndex ? {
      ...page,
      images: page.images.map((image, currentImageIndex) => currentImageIndex === imageIndex ? { ...image, [key]: value } : image),
    } : page));
  };

  const handlePhotoFile = (file: File | undefined) => {
    if (!file) return;
    if (!/^image\/(jpeg|png|webp|gif)$/.test(file.type)) {
      toast.error("Escolha uma imagem JPG, PNG, WEBP ou GIF.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("A imagem deve ter no máximo 5 MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = async () => {
      const result = typeof reader.result === "string" ? reader.result.split(",")[1] : "";
      if (!result) {
        toast.error("Não foi possível ler a imagem.");
        return;
      }
      try {
        const uploaded = await uploadPhoto.mutateAsync({ fileName: file.name, mimeType: file.type as "image/jpeg" | "image/png" | "image/webp" | "image/gif", base64: result });
        patchDraft("photoUrl", uploaded.url);
        toast.success("Imagem enviada. Complete o crédito e a licença antes de salvar.");
      } catch {
        // O erro já é apresentado pelo callback da mutação.
      }
    };
    reader.onerror = () => toast.error("Não foi possível ler a imagem.");
    reader.readAsDataURL(file);
  };

  const handleExtraPhotoFile = (pageIndex: number, imageIndex: number, file: File | undefined) => {
    if (!file) return;
    if (!/^image\/(jpeg|png|webp|gif)$/.test(file.type) || file.size > 5 * 1024 * 1024) {
      toast.error("Escolha uma imagem JPG, PNG, WEBP ou GIF de até 5 MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = typeof reader.result === "string" ? reader.result.split(",")[1] : "";
      if (!base64) return toast.error("Não foi possível ler a imagem.");
      try {
        const result = await uploadPhoto.mutateAsync({ fileName: file.name, mimeType: file.type as "image/jpeg" | "image/png" | "image/webp" | "image/gif", base64 });
        updateExtraImage(pageIndex, imageIndex, "imageUrl", result.url);
        toast.success("Imagem de aprofundamento enviada. Informe crédito, fonte e licença.");
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Não foi possível enviar a imagem.");
      }
    };
    reader.onerror = () => toast.error("Não foi possível ler a imagem.");
    reader.readAsDataURL(file);
  };

  const save = () => {
    const sources = draft.sources.map((source) => ({
      title: source.title.trim(),
      institution: source.institution.trim(),
      url: source.url.trim(),
      note: source.note.trim(),
    }));
    const story = draft.storyText.split(/\n\s*\n/).map((paragraph) => paragraph.trim()).filter(Boolean);
    const payload = {
      slug: draft.slug.trim() || undefined,
      title: draft.title.trim(),
      subtitle: draft.subtitle.trim(),
      category: draft.category,
      region: draft.region.trim(),
      territorialNote: draft.territorialNote.trim(),
      excerpt: draft.excerpt.trim(),
      story,
      visualMotif: draft.visualMotif.trim(),
      sources,
      photoUrl: draft.photoUrl.trim(),
      photoCredit: draft.photoCredit.trim(),
      photoSourceUrl: draft.photoSourceUrl.trim(),
      photoLicense: draft.photoLicense.trim(),
      extraPages: draft.extraPages.map((page) => ({
        eyebrow: page.eyebrow.trim(),
        title: page.title.trim(),
        content: page.content.trim(),
        images: page.images.map((image) => ({ imageUrl: image.imageUrl.trim(), altText: image.altText.trim(), credit: image.credit.trim(), sourceUrl: image.sourceUrl.trim(), license: image.license.trim() })),
      })),
      isPublished: draft.isPublished,
    };

    if (selectedSlug === "new") {
      createCulture.mutate(payload);
    } else {
      updateCulture.mutate({ originalSlug: selectedSlug, culture: payload });
    }
  };

  if (loading || isLocalSessionLoading) {
    return <div className="grid min-h-[45vh] place-items-center"><Loader2 className="animate-spin text-[#a6412d]" /></div>;
  }

  if (!isAuthorized) {
    return (
      <div className="mx-auto grid min-h-[55vh] max-w-xl place-items-center py-10 text-center">
        <div className="rounded-[1.4rem] border border-[#cba66e] bg-[#fff8e7] p-8 shadow-[8px_8px_0_rgba(127,57,36,.12)]">
          <KeyRound className="mx-auto mb-4 text-[#a6412d]" size={36} />
          <h1 className="font-[var(--font-display)] text-4xl font-bold tracking-tight text-[#432a20]">Acesso restrito</h1>
          <p className="mt-3 text-sm leading-6 text-[#6c5140]">Informe as credenciais administrativas para gerir o acervo editorial.</p>
          <form className="mt-6 space-y-3 text-left" onSubmit={(event) => { event.preventDefault(); localLogin.mutate({ username, password }); }}>
            <label className="block text-xs font-bold uppercase tracking-[.12em] text-[#764431]">Nome de acesso<input value={username} onChange={(event) => setUsername(event.target.value)} autoComplete="username" className="mt-1.5 w-full rounded-md border border-[#cda970] bg-[#fffaf0] px-3 py-2 text-sm text-[#432a20]" /></label>
            <label className="block text-xs font-bold uppercase tracking-[.12em] text-[#764431]">Senha<input value={password} onChange={(event) => setPassword(event.target.value)} type="password" autoComplete="current-password" className="mt-1.5 w-full rounded-md border border-[#cda970] bg-[#fffaf0] px-3 py-2 text-sm text-[#432a20]" /></label>
            <Button className="w-full bg-[#762a25] text-[#fff8e7] hover:bg-[#5f221f]" disabled={localLogin.isPending} type="submit">{localLogin.isPending ? <Loader2 size={16} className="animate-spin" /> : <KeyRound size={16} />} Entrar na administração</Button>
          </form>
          <Button variant="outline" className="mt-4 border-[#bb8654] bg-transparent text-[#762a25]" onClick={() => setLocation("/")}><ArrowLeft size={16} /> Voltar à obra</Button>
        </div>
      </div>
    );
  }

  const isSaving = createCulture.isPending || updateCulture.isPending;

  return (
    <div className="mx-auto max-w-7xl pb-12 text-[#432a20]">
      <div className="mb-8 flex flex-col justify-between gap-5 border-b border-[#d8b673] pb-6 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-bold uppercase tracking-[.16em] text-[#a6412d]">Gestão editorial</p>
          <h1 className="mt-1 font-[var(--font-display)] text-5xl font-bold tracking-[-.05em]">Acervo cultural</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#6d5040]">Crie, edite, publique ou retire da exibição pública as manifestações da obra. As alterações são gravadas no banco e passam a orientar a leitura de todos os visitantes.</p>
        </div>
        <Button onClick={() => setSelectedSlug("new")} className="w-fit bg-[#a6412d] text-[#fff8e7] hover:bg-[#7c3024]"><Plus size={16} /> Nova cultura</Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[18rem_minmax(0,1fr)]">
        <aside className="rounded-xl border border-[#d8b673] bg-[#fbefd6] p-3 shadow-sm">
          <p className="px-2 pb-2 text-[.62rem] font-extrabold uppercase tracking-[.14em] text-[#86553c]">{cultures.length} registros no acervo</p>
          <div className="max-h-[65vh] space-y-1 overflow-y-auto pr-1">
            {isLoading ? <div className="grid h-28 place-items-center"><Loader2 className="animate-spin text-[#a6412d]" /></div> : cultures.map((culture) => (
              <button key={culture.slug} type="button" onClick={() => setSelectedSlug(culture.slug)} className={`flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2.5 text-left transition-colors ${selectedSlug === culture.slug ? "bg-[#762a25] text-[#fff8e7]" : "hover:bg-[#f3dfb5]"}`}>
                <span className="min-w-0"><b className="block truncate font-[var(--font-display)] text-lg leading-none">{culture.title}</b><small className={`mt-1 block text-[.58rem] font-bold uppercase tracking-[.1em] ${selectedSlug === culture.slug ? "text-[#f3d388]" : "text-[#825b45]"}`}>{categoryNames[culture.category]}</small></span>
                {culture.isPublished === false ? <EyeOff size={15} className="shrink-0" aria-label="Não publicado" /> : <Eye size={15} className="shrink-0" aria-label="Publicado" />}
              </button>
            ))}
          </div>
        </aside>

        <section className="rounded-xl border border-[#d8b673] bg-[#fff8e7] p-5 shadow-[8px_8px_0_rgba(127,57,36,.08)] sm:p-7">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2"><FilePenLine size={18} className="text-[#a6412d]" /><h2 className="font-[var(--font-display)] text-3xl font-bold tracking-[-.04em]">{selectedSlug === "new" ? "Adicionar cultura" : "Editar cultura"}</h2></div>
            {selectedSlug !== "new" && <Button type="button" variant="outline" onClick={() => setPublication.mutate({ slug: selectedSlug, isPublished: !draft.isPublished })} disabled={setPublication.isPending} className="border-[#bb8654] bg-transparent text-[#7b3528] hover:bg-[#f4e3bd]">{draft.isPublished ? <><EyeOff size={15} /> Despublicar</> : <><Eye size={15} /> Publicar</>}</Button>}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Nome da manifestação"><input value={draft.title} onChange={(event) => patchDraft("title", event.target.value)} placeholder="Ex.: Festa das Rendeiras" /></Field>
            <Field label="Subtítulo temático"><input value={draft.subtitle} onChange={(event) => patchDraft("subtitle", event.target.value)} placeholder="Uma frase de apresentação" /></Field>
            <Field label="Identificador da página" hint="Opcional; gera-se a partir do nome quando vazio."><input value={draft.slug} onChange={(event) => patchDraft("slug", event.target.value)} placeholder="festa-das-rendeiras" /></Field>
            <Field label="Categoria"><select value={draft.category} onChange={(event) => patchDraft("category", event.target.value as CulturalCategory)}>{culturalCategories.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}</select></Field>
          </div>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <Field label="Região ou território"><textarea rows={3} value={draft.region} onChange={(event) => patchDraft("region", event.target.value)} placeholder="Onde a prática se organiza e circula" /></Field>
            <Field label="Nota de território"><textarea rows={3} value={draft.territorialNote} onChange={(event) => patchDraft("territorialNote", event.target.value)} placeholder="Contextualização histórica, territorial ou curatorial" /></Field>
          </div>
          <div className="mt-4"><Field label="Resumo para o catálogo"><textarea rows={3} value={draft.excerpt} onChange={(event) => patchDraft("excerpt", event.target.value)} placeholder="Síntese curta para a card do catálogo" /></Field></div>
          <div className="mt-4 grid gap-4 md:grid-cols-[1fr_16rem]"><Field label="Texto do capítulo" hint="Separe os parágrafos com uma linha em branco."><textarea rows={10} value={draft.storyText} onChange={(event) => patchDraft("storyText", event.target.value)} placeholder="História e contexto cultural da manifestação..." /></Field><Field label="Motivo visual"><textarea rows={4} value={draft.visualMotif} onChange={(event) => patchDraft("visualMotif", event.target.value)} placeholder="Ex.: fitas, terra e sanfona" /></Field></div>

          <div className="mt-7 border-t border-[#e3c98e] pt-6">
            <div className="mb-4 flex items-start gap-2"><ImagePlus size={18} className="mt-0.5 text-[#a6412d]" /><div><p className="text-xs font-bold uppercase tracking-[.14em] text-[#a6412d]">Fotografia da cultura</p><p className="mt-1 text-xs leading-5 text-[#73533f]">Envie uma imagem ou informe uma URL HTTPS. Registre autoria, fonte e condição de uso antes de publicar.</p></div></div>
            <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_13rem]">
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Enviar arquivo" hint="JPG, PNG, WEBP ou GIF · até 5 MB"><input type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={(event) => handlePhotoFile(event.target.files?.[0])} disabled={uploadPhoto.isPending} />{uploadPhoto.isPending && <span className="mt-2 inline-flex items-center gap-2 text-xs text-[#7b3528]"><Loader2 size={13} className="animate-spin" /> Enviando imagem...</span>}</Field>
                <Field label="URL da imagem" hint="Use uma URL HTTPS ou o arquivo enviado acima."><input value={draft.photoUrl} onChange={(event) => patchDraft("photoUrl", event.target.value)} placeholder="https://..." /></Field>
                <Field label="Crédito / autoria"><input value={draft.photoCredit} onChange={(event) => patchDraft("photoCredit", event.target.value)} placeholder="Ex.: Ana Silva · CC BY 4.0" /></Field>
                <Field label="Licença ou condição de uso"><input value={draft.photoLicense} onChange={(event) => patchDraft("photoLicense", event.target.value)} placeholder="Ex.: CC BY-SA 4.0" /></Field>
                <div className="md:col-span-2"><Field label="Página da fonte" hint="Link para o arquivo, portfólio ou instituição de origem."><input value={draft.photoSourceUrl} onChange={(event) => patchDraft("photoSourceUrl", event.target.value)} placeholder="https://..." /></Field></div>
              </div>
              <div className="rounded-lg border border-[#d8b673] bg-[#f7e6bd] p-3">
                <p className="mb-2 flex items-center gap-1 text-[.62rem] font-bold uppercase tracking-[.1em] text-[#7b3528]"><Link size={12} /> Prévia</p>
                {draft.photoUrl ? <img src={draft.photoUrl} alt="Prévia da fotografia cadastrada" className="aspect-[4/3] w-full rounded-md object-cover" onError={(event) => { event.currentTarget.style.display = "none"; }} /> : <div className="grid aspect-[4/3] place-items-center rounded-md border border-dashed border-[#c69a59] px-3 text-center text-xs leading-5 text-[#806047]">Nenhuma imagem definida.</div>}
              </div>
            </div>
          </div>

          <div className="mt-7 border-t border-[#e3c98e] pt-6">
            <div className="mb-4 flex flex-wrap items-start justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-[.14em] text-[#a6412d]">Páginas de aprofundamento</p><p className="mt-1 max-w-2xl text-xs leading-5 text-[#73533f]">Acrescente quantas páginas quiser ao capítulo. Cada uma precisa reunir um texto próprio e de duas a três imagens, com atribuição individual.</p></div><Button type="button" variant="outline" size="sm" onClick={() => patchDraft("extraPages", [...draft.extraPages, emptyExtraPage()])} className="border-[#bb8654] bg-transparent text-[#7b3528]"><Plus size={14} /> Página extra</Button></div>
            <div className="space-y-5">
              {draft.extraPages.map((page, pageIndex) => (
                <section key={`${page.id ?? "nova"}-${pageIndex}`} className="rounded-xl border border-[#d8b673] bg-[#fdf2d8] p-4">
                  <div className="mb-4 flex flex-wrap items-center justify-between gap-3"><div><p className="text-[.62rem] font-extrabold uppercase tracking-[.14em] text-[#7b3528]">Página extra {String(pageIndex + 1).padStart(2, "0")}</p><p className="mt-1 text-xs text-[#806047]">A ordem no formulário é a ordem de leitura no livro.</p></div><div className="flex gap-2"><Button type="button" variant="outline" size="sm" disabled={pageIndex === 0} onClick={() => { const pages = [...draft.extraPages]; [pages[pageIndex - 1], pages[pageIndex]] = [pages[pageIndex], pages[pageIndex - 1]]; patchDraft("extraPages", pages); }}>Subir</Button><Button type="button" variant="outline" size="sm" disabled={pageIndex === draft.extraPages.length - 1} onClick={() => { const pages = [...draft.extraPages]; [pages[pageIndex], pages[pageIndex + 1]] = [pages[pageIndex + 1], pages[pageIndex]]; patchDraft("extraPages", pages); }}>Descer</Button><Button type="button" variant="outline" size="sm" onClick={() => patchDraft("extraPages", draft.extraPages.filter((_, index) => index !== pageIndex))} className="border-[#c7826c] text-[#a6412d]"><Trash2 size={14} /> Remover</Button></div></div>
                  <div className="grid gap-4 md:grid-cols-2"><Field label="Marcador editorial"><input value={page.eyebrow} onChange={(event) => updateExtraPage(pageIndex, "eyebrow", event.target.value)} placeholder="Ex.: Memória e continuidade" /></Field><Field label="Título da página"><input value={page.title} onChange={(event) => updateExtraPage(pageIndex, "title", event.target.value)} placeholder="Título do aprofundamento" /></Field></div>
                  <div className="mt-4"><Field label="Texto de aprofundamento" hint="Separe parágrafos com uma linha em branco."><textarea rows={6} value={page.content} onChange={(event) => updateExtraPage(pageIndex, "content", event.target.value)} placeholder="Contexto, memória, vozes, técnicas ou outros caminhos de leitura..." /></Field></div>
                  <div className="mt-5 border-t border-[#e4c98d] pt-4"><div className="mb-3 flex items-center justify-between"><div><p className="text-[.62rem] font-extrabold uppercase tracking-[.14em] text-[#a6412d]">Galeria documental</p><p className="mt-1 text-xs text-[#806047]">Mínimo de duas e máximo de três imagens por página.</p></div>{page.images.length < 3 && <Button type="button" variant="outline" size="sm" onClick={() => patchDraft("extraPages", draft.extraPages.map((currentPage, index) => index === pageIndex ? { ...currentPage, images: [...currentPage.images, emptyExtraImage()] } : currentPage))} className="border-[#bb8654] bg-transparent text-[#7b3528]"><Plus size={14} /> Imagem</Button>}</div>
                    <div className="grid gap-4 xl:grid-cols-2">{page.images.map((image, imageIndex) => <div key={`${image.id ?? "nova"}-${imageIndex}`} className="rounded-lg border border-[#e2c486] bg-[#fff8e7] p-3"><div className="mb-2 flex items-center justify-between"><b className="text-xs text-[#7b3528]">Imagem {String(imageIndex + 1).padStart(2, "0")}</b>{page.images.length > 2 && <button type="button" onClick={() => patchDraft("extraPages", draft.extraPages.map((currentPage, index) => index === pageIndex ? { ...currentPage, images: currentPage.images.filter((_, currentImageIndex) => currentImageIndex !== imageIndex) } : currentPage))} className="rounded p-1 text-[#a6412d] hover:bg-[#f1d8b1]" aria-label={`Remover imagem ${imageIndex + 1}`}><Trash2 size={15} /></button>}</div><div className="grid gap-3"><Field label="Enviar arquivo"><input type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={(event) => handleExtraPhotoFile(pageIndex, imageIndex, event.target.files?.[0])} disabled={uploadPhoto.isPending} /></Field><Field label="URL da imagem"><input value={image.imageUrl} onChange={(event) => updateExtraImage(pageIndex, imageIndex, "imageUrl", event.target.value)} placeholder="https://..." /></Field><Field label="Texto alternativo"><input value={image.altText} onChange={(event) => updateExtraImage(pageIndex, imageIndex, "altText", event.target.value)} placeholder="Descrição objetiva da fotografia" /></Field><Field label="Crédito / autoria"><input value={image.credit} onChange={(event) => updateExtraImage(pageIndex, imageIndex, "credit", event.target.value)} placeholder="Pessoa autora ou instituição" /></Field><Field label="Fonte"><input value={image.sourceUrl} onChange={(event) => updateExtraImage(pageIndex, imageIndex, "sourceUrl", event.target.value)} placeholder="https://..." /></Field><Field label="Licença"><input value={image.license} onChange={(event) => updateExtraImage(pageIndex, imageIndex, "license", event.target.value)} placeholder="Ex.: CC BY 4.0" /></Field>{image.imageUrl && <img src={image.imageUrl} alt="Prévia da imagem de aprofundamento" className="aspect-[4/3] w-full rounded-md object-cover" onError={(event) => { event.currentTarget.style.display = "none"; }} />}</div></div>)}</div>
                  </div>
                </section>
              ))}
              {!draft.extraPages.length && <div className="rounded-lg border border-dashed border-[#c69a59] bg-[#f8e9c8] px-4 py-5 text-sm leading-6 text-[#73533f]">Ainda não há páginas extras. Use “Página extra” para criar um novo aprofundamento com galeria própria.</div>}
            </div>
          </div>

          <div className="mt-7 border-t border-[#e3c98e] pt-6">
            <div className="mb-3 flex items-center justify-between"><div><p className="text-xs font-bold uppercase tracking-[.14em] text-[#a6412d]">Fontes e créditos</p><p className="mt-1 text-xs text-[#73533f]">Inclua pelo menos uma referência verificável para sustentar o capítulo.</p></div><Button type="button" variant="outline" size="sm" onClick={() => patchDraft("sources", [...draft.sources, emptySource()])} className="border-[#bb8654] bg-transparent text-[#7b3528]"><Plus size={14} /> Fonte</Button></div>
            <div className="space-y-3">
              {draft.sources.map((source, index) => (
                <div key={index} className="rounded-lg border border-[#e2c486] bg-[#fdf2d8] p-3">
                  <div className="mb-2 flex items-center justify-between"><b className="text-xs text-[#7b3528]">Fonte {String(index + 1).padStart(2, "0")}</b>{draft.sources.length > 1 && <button type="button" onClick={() => patchDraft("sources", draft.sources.filter((_, sourceIndex) => sourceIndex !== index))} className="rounded p-1 text-[#a6412d] hover:bg-[#f1d8b1]" aria-label={`Remover fonte ${index + 1}`}><Trash2 size={15} /></button>}</div>
                  <div className="grid gap-3 md:grid-cols-2"><Field label="Título"><input value={source.title} onChange={(event) => updateSource(index, "title", event.target.value)} /></Field><Field label="Instituição"><input value={source.institution} onChange={(event) => updateSource(index, "institution", event.target.value)} /></Field><Field label="URL"><input value={source.url} onChange={(event) => updateSource(index, "url", event.target.value)} /></Field><Field label="Nota"><input value={source.note} onChange={(event) => updateSource(index, "note", event.target.value)} /></Field></div>
                </div>
              ))}
            </div>
          </div>

          <label className="mt-6 flex items-center gap-3 rounded-lg border border-[#d6b071] bg-[#f8e9c8] px-4 py-3 text-sm text-[#5b4031]"><input type="checkbox" checked={draft.isPublished} onChange={(event) => patchDraft("isPublished", event.target.checked)} className="size-4 accent-[#a6412d]" /><span><b>Publicar no catálogo e no livro.</b> Desative para manter o registro salvo, mas oculto para visitantes.</span></label>
          <div className="mt-6 flex justify-end border-t border-[#e3c98e] pt-5"><Button type="button" disabled={isSaving} onClick={save} className="bg-[#a6412d] text-[#fff8e7] hover:bg-[#7c3024]">{isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}{selectedSlug === "new" ? "Salvar cultura" : "Salvar alterações"}</Button></div>
        </section>
      </div>
    </div>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return <label className="block"><span className="block text-[.66rem] font-bold uppercase tracking-[.1em] text-[#764431]">{label}</span>{hint && <span className="mt-1 block text-[.66rem] text-[#886854]">{hint}</span>}<span className="mt-1.5 block [&_input]:w-full [&_input]:rounded-md [&_input]:border [&_input]:border-[#cda970] [&_input]:bg-[#fffaf0] [&_input]:px-3 [&_input]:py-2 [&_input]:text-sm [&_input]:text-[#432a20] [&_select]:w-full [&_select]:rounded-md [&_select]:border [&_select]:border-[#cda970] [&_select]:bg-[#fffaf0] [&_select]:px-3 [&_select]:py-2 [&_select]:text-sm [&_select]:text-[#432a20] [&_textarea]:w-full [&_textarea]:resize-y [&_textarea]:rounded-md [&_textarea]:border [&_textarea]:border-[#cda970] [&_textarea]:bg-[#fffaf0] [&_textarea]:px-3 [&_textarea]:py-2 [&_textarea]:text-sm [&_textarea]:leading-6 [&_textarea]:text-[#432a20]">{children}</span></label>;
}

export default function AdminPage() {
  return <DashboardLayout><AdminContent /></DashboardLayout>;
}
