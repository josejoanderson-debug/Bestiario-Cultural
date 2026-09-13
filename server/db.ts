import {
  type CulturalCategory,
  type CulturalEntry,
  type CulturalExtraPage,
  type CulturalSource,
  culturalEntries as seedEntries,
} from "../shared/culturalData";
import { getSupabaseAdmin } from "./supabase";

type ChapterRow = {
  id: number;
  chapterNumber: number;
  slug: string;
  title: string;
  subtitle: string;
  category: CulturalCategory;
  territory: string;
  territorialNote: string;
  excerpt: string;
  content: string;
  illustrationLabel: string;
  photoUrl: string;
  photoCredit: string;
  photoSourceUrl: string;
  photoLicense: string;
  isPublished: boolean;
};

type SourceRow = { title: string; institution: string; sourceUrl: string; note: string; chapterSlug: string };
type PageRow = { id: number; chapterSlug: string; sortOrder: number; eyebrow: string; title: string; content: string };
type ImageRow = { id: number; pageId: number; sortOrder: number; imageUrl: string; altText: string; credit: string; sourceUrl: string; license: string };

export type CulturalChapterInput = {
  slug?: string;
  title: string;
  subtitle: string;
  category: CulturalCategory;
  region: string;
  territorialNote: string;
  excerpt: string;
  story: string[];
  visualMotif: string;
  sources: CulturalSource[];
  photoUrl: string;
  photoCredit: string;
  photoSourceUrl: string;
  photoLicense: string;
  extraPages: CulturalExtraPage[];
  isPublished: boolean;
};

const categoryLabels: Record<CulturalCategory, string> = {
  musica: "Música",
  danca: "Dança",
  artesanato: "Artesanato",
  festa: "Festa",
};

function toSlug(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()
    .replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "").slice(0, 96);
}

function mapEntries(chapters: ChapterRow[], sources: SourceRow[], pages: PageRow[], images: ImageRow[]): CulturalEntry[] {
  return chapters.map((chapter) => ({
    number: chapter.chapterNumber,
    slug: chapter.slug,
    title: chapter.title,
    subtitle: chapter.subtitle,
    category: chapter.category,
    categoryLabel: categoryLabels[chapter.category],
    region: chapter.territory,
    territorialNote: chapter.territorialNote,
    excerpt: chapter.excerpt,
    story: chapter.content.split(/\n\n+/).map((p) => p.trim()).filter(Boolean),
    visualMotif: chapter.illustrationLabel.replace(/^Ilustração artística\s*[—–-]\s*/i, ""),
    sources: sources.filter((s) => s.chapterSlug === chapter.slug).map((s) => ({
      title: s.title, institution: s.institution, url: s.sourceUrl, note: s.note,
    })),
    photoUrl: chapter.photoUrl,
    photoCredit: chapter.photoCredit,
    photoSourceUrl: chapter.photoSourceUrl,
    photoLicense: chapter.photoLicense,
    extraPages: pages.filter((p) => p.chapterSlug === chapter.slug).sort((a,b)=>a.sortOrder-b.sortOrder).map((p) => ({
      id: p.id, eyebrow: p.eyebrow, title: p.title, content: p.content,
      images: images.filter((i) => i.pageId === p.id).sort((a,b)=>a.sortOrder-b.sortOrder).map((i) => ({
        id:i.id, imageUrl:i.imageUrl, altText:i.altText, credit:i.credit, sourceUrl:i.sourceUrl, license:i.license,
      })),
    })),
    isPublished: chapter.isPublished,
  }));
}

function normalizeInput(input: CulturalChapterInput) {
  return {
    slug: toSlug(input.slug || input.title),
    title: input.title.trim(),
    subtitle: input.subtitle.trim(),
    category: input.category,
    territory: input.region.trim(),
    territorialNote: input.territorialNote.trim(),
    excerpt: input.excerpt.trim(),
    content: input.story.map((p)=>p.trim()).filter(Boolean).join("\n\n"),
    illustrationLabel: `Ilustração artística — ${input.visualMotif.trim()}`,
    photoUrl: input.photoUrl?.trim() || "",
    photoCredit: input.photoCredit?.trim() || "",
    photoSourceUrl: input.photoSourceUrl?.trim() || "",
    photoLicense: input.photoLicense?.trim() || "",
    isPublished: input.isPublished,
  };
}

async function seedIfEmpty() {
  const supabase = getSupabaseAdmin();
  const { data: existing, error } = await supabase.from("culturalChapters").select("id").limit(1);
  if (error) throw new Error(`Supabase culturalChapters: ${error.message}`);
  if (existing?.length) return;

  const rows = seedEntries.map((e) => {
    const n = normalizeInput({
      slug:e.slug,title:e.title,subtitle:e.subtitle,category:e.category,region:e.region,
      territorialNote:e.territorialNote,excerpt:e.excerpt,story:e.story,visualMotif:e.visualMotif,
      sources:e.sources,photoUrl:e.photoUrl||"",photoCredit:e.photoCredit||"",photoSourceUrl:e.photoSourceUrl||"",
      photoLicense:e.photoLicense||"",extraPages:e.extraPages||[],isPublished:true,
    });
    return { chapterNumber:e.number, ...n };
  });
  const { error: insertError } = await supabase.from("culturalChapters").insert(rows);
  if (insertError) throw new Error(`Falha ao popular o acervo inicial: ${insertError.message}`);

  const sourceRows = seedEntries.flatMap((e) => e.sources.map((s) => ({
    chapterSlug:e.slug,title:s.title,institution:s.institution,sourceUrl:s.url,note:s.note,
  })));
  if (sourceRows.length) {
    const { error: sourceError } = await supabase.from("culturalSources").insert(sourceRows);
    if (sourceError) throw new Error(`Falha ao popular fontes: ${sourceError.message}`);
  }
}

async function loadEntries(includeUnpublished = false) {
  const supabase = getSupabaseAdmin();
  const { data: chapters, error: chapterError } = await supabase.from("culturalChapters").select("*").order("chapterNumber");
  if (chapterError) throw new Error(`Supabase culturalChapters: ${chapterError.message}`);
  const selected = (chapters || []).filter((c: ChapterRow) => includeUnpublished || c.isPublished);
  if (!selected.length) return [];

  const slugs = selected.map((c: ChapterRow) => c.slug);
  const [sourcesRes, pagesRes] = await Promise.all([
    supabase.from("culturalSources").select("*").in("chapterSlug", slugs),
    supabase.from("culturalExtraPages").select("*").in("chapterSlug", slugs).order("sortOrder"),
  ]);
  if (sourcesRes.error) throw new Error(`Supabase culturalSources: ${sourcesRes.error.message}`);
  if (pagesRes.error) throw new Error(`Supabase culturalExtraPages: ${pagesRes.error.message}`);

  const pages = (pagesRes.data || []) as PageRow[];
  const pageIds = pages.map((p) => p.id);
  let images: ImageRow[] = [];
  if (pageIds.length) {
    const imageRes = await supabase.from("culturalExtraPageImages").select("*").in("pageId", pageIds).order("sortOrder");
    if (imageRes.error) throw new Error(`Supabase culturalExtraPageImages: ${imageRes.error.message}`);
    images = (imageRes.data || []) as ImageRow[];
  }
  return mapEntries(selected as ChapterRow[], (sourcesRes.data || []) as SourceRow[], pages, images);
}

export async function listCulturalEntries(options?: { includeUnpublished?: boolean }) {
  try {
    await seedIfEmpty();
    return await loadEntries(options?.includeUnpublished ?? false);
  } catch (error) {
    if (!process.env.SUPABASE_URL) return seedEntries;
    throw error;
  }
}

export async function getCulturalEntryBySlug(slug: string, includeUnpublished = false) {
  const entries = await listCulturalEntries({ includeUnpublished });
  return entries.find((e) => e.slug === slug) ?? null;
}

async function replaceSources(chapterSlug: string, sources: CulturalSource[]) {
  const supabase = getSupabaseAdmin();
  const { error: deleteError } = await supabase.from("culturalSources").delete().eq("chapterSlug", chapterSlug);
  if (deleteError) throw new Error(deleteError.message);
  if (!sources.length) return;
  const { error } = await supabase.from("culturalSources").insert(sources.map((s)=>({
    chapterSlug, title:s.title.trim(), institution:s.institution.trim(), sourceUrl:s.url.trim(), note:s.note.trim(),
  })));
  if (error) throw new Error(error.message);
}

async function replaceExtraPages(chapterSlug: string, pages: CulturalExtraPage[]) {
  const supabase = getSupabaseAdmin();
  const { data: previous, error: prevError } = await supabase.from("culturalExtraPages").select("id").eq("chapterSlug", chapterSlug);
  if (prevError) throw new Error(prevError.message);
  const ids = (previous || []).map((p:any)=>p.id);
  if (ids.length) {
    const { error } = await supabase.from("culturalExtraPageImages").delete().in("pageId", ids);
    if (error) throw new Error(error.message);
  }
  const { error: deleteError } = await supabase.from("culturalExtraPages").delete().eq("chapterSlug", chapterSlug);
  if (deleteError) throw new Error(deleteError.message);

  for (let index=0; index<pages.length; index++) {
    const page=pages[index];
    const { data: created, error: pageError } = await supabase.from("culturalExtraPages").insert({
      chapterSlug, sortOrder:index, eyebrow:page.eyebrow.trim(), title:page.title.trim(), content:page.content.trim(),
    }).select("id").single();
    if (pageError) throw new Error(pageError.message);
    if (page.images.length) {
      const { error: imageError } = await supabase.from("culturalExtraPageImages").insert(page.images.map((image,imageIndex)=>({
        pageId:created.id, sortOrder:imageIndex, imageUrl:image.imageUrl.trim(), altText:image.altText.trim(),
        credit:image.credit.trim(), sourceUrl:image.sourceUrl.trim(), license:image.license.trim(),
      })));
      if (imageError) throw new Error(imageError.message);
    }
  }
}

export async function createCulturalEntry(input: CulturalChapterInput) {
  const supabase = getSupabaseAdmin();
  const row = normalizeInput(input);
  if (!row.slug) throw new Error("Não foi possível gerar o identificador da cultura.");
  const { data: duplicate } = await supabase.from("culturalChapters").select("slug").eq("slug", row.slug).limit(1);
  if (duplicate?.length) throw new Error("Já existe uma cultura com este identificador.");
  const { data: current, error: currentError } = await supabase.from("culturalChapters").select("chapterNumber").order("chapterNumber",{ascending:false}).limit(1);
  if (currentError) throw new Error(currentError.message);
  const chapterNumber = (current?.[0]?.chapterNumber || 0) + 1;
  const { error } = await supabase.from("culturalChapters").insert({chapterNumber,...row});
  if (error) throw new Error(error.message);
  await replaceSources(row.slug,input.sources);
  await replaceExtraPages(row.slug,input.extraPages);
  return getCulturalEntryBySlug(row.slug,true);
}

export async function updateCulturalEntry(originalSlug: string, input: CulturalChapterInput) {
  const supabase = getSupabaseAdmin();
  const { data: existing } = await supabase.from("culturalChapters").select("*").eq("slug",originalSlug).limit(1);
  if (!existing?.length) return null;
  const row = normalizeInput(input);
  if (!row.slug) throw new Error("Não foi possível gerar o identificador da cultura.");
  if (row.slug !== originalSlug) {
    const { data: duplicate } = await supabase.from("culturalChapters").select("slug").eq("slug",row.slug).limit(1);
    if (duplicate?.length) throw new Error("Já existe uma cultura com este identificador.");
  }
  const { error } = await supabase.from("culturalChapters").update(row).eq("slug",originalSlug);
  if (error) throw new Error(error.message);
  if (row.slug !== originalSlug) {
    const { error: sourceMove } = await supabase.from("culturalSources").update({chapterSlug:row.slug}).eq("chapterSlug",originalSlug);
    if (sourceMove) throw new Error(sourceMove.message);
  }
  await replaceSources(row.slug,input.sources);
  await replaceExtraPages(row.slug,input.extraPages);
  return getCulturalEntryBySlug(row.slug,true);
}

export async function setCulturalEntryPublication(slug:string,isPublished:boolean) {
  const supabase=getSupabaseAdmin();
  const {error}=await supabase.from("culturalChapters").update({isPublished}).eq("slug",slug);
  if(error) throw new Error(error.message);
  return getCulturalEntryBySlug(slug,true);
}
