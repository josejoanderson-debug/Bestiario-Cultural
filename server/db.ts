import { asc, eq, inArray } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { culturalChapters, culturalExtraPageImages, culturalExtraPages, culturalSources, InsertUser, users } from "../drizzle/schema";
import { culturalEntries, type CulturalCategory, type CulturalEntry, type CulturalExtraPage, type CulturalSource } from "../shared/culturalData";

let _db: ReturnType<typeof drizzle> | null = null;
let _client: ReturnType<typeof postgres> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
// `prepare: false` is required when DATABASE_URL points at Supabase's pooled
// connection (PgBouncer in transaction mode, port 6543) — see docs/DEPLOY_VERCEL_SUPABASE.md.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _client = postgres(process.env.DATABASE_URL, { prepare: false, max: 1 });
      _db = drizzle(_client);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onConflictDoUpdate({
      target: users.openId,
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

const categoryLabels: Record<CulturalCategory, CulturalEntry["categoryLabel"]> = {
  musica: "Música",
  danca: "Dança",
  artesanato: "Artesanato",
  festa: "Festa",
};

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

function toSlug(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("pt-BR")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 96);
}

function normalizeSource(source: CulturalSource): CulturalSource {
  return {
    title: source.title.trim(),
    institution: source.institution.trim(),
    url: source.url.trim(),
    note: source.note.trim(),
  };
}

export function mapCulturalEntries(
  chapters: Array<typeof culturalChapters.$inferSelect>,
  sources: Array<typeof culturalSources.$inferSelect>,
  extraPages: Array<typeof culturalExtraPages.$inferSelect>,
  extraImages: Array<typeof culturalExtraPageImages.$inferSelect>,
): CulturalEntry[] {
  return chapters.map((chapter) => ({
    number: chapter.chapterNumber,
    photoUrl: chapter.photoUrl,
    photoCredit: chapter.photoCredit,
    photoSourceUrl: chapter.photoSourceUrl,
    photoLicense: chapter.photoLicense,
    extraPages: extraPages
      .filter((page) => page.chapterSlug === chapter.slug)
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map((page) => ({
        id: page.id,
        eyebrow: page.eyebrow,
        title: page.title,
        content: page.content,
        images: extraImages
          .filter((image) => image.pageId === page.id)
          .sort((a, b) => a.sortOrder - b.sortOrder)
          .map((image) => ({
            id: image.id,
            imageUrl: image.imageUrl,
            altText: image.altText,
            credit: image.credit,
            sourceUrl: image.sourceUrl,
            license: image.license,
          })),
      })),
    slug: chapter.slug,
    title: chapter.title,
    subtitle: chapter.subtitle,
    category: chapter.category,
    categoryLabel: categoryLabels[chapter.category],
    region: chapter.territory,
    territorialNote: chapter.territorialNote,
    excerpt: chapter.excerpt,
    story: chapter.content.split(/\n\n+/).map((paragraph) => paragraph.trim()).filter(Boolean),
    visualMotif: chapter.illustrationLabel.replace(/^Ilustração artística\s*[—–-]\s*/i, ""),
    isPublished: chapter.isPublished,
    sources: sources
      .filter((source) => source.chapterSlug === chapter.slug)
      .map((source) => ({
        title: source.title,
        institution: source.institution,
        url: source.sourceUrl,
        note: source.note,
      })),
  }));
}

export function publicCulturalEntries(entries: CulturalEntry[]): CulturalEntry[] {
  return entries
    .filter((entry) => entry.isPublished !== false)
    .map(({ isPublished, ...entry }) => entry);
}

export async function listCulturalEntries(options?: { includeUnpublished?: boolean }): Promise<CulturalEntry[]> {
  const db = await getDb();
  const includeUnpublished = options?.includeUnpublished ?? false;

  if (!db) {
    return includeUnpublished ? culturalEntries : culturalEntries;
  }

  const chapters = includeUnpublished
    ? await db.select().from(culturalChapters).orderBy(asc(culturalChapters.chapterNumber))
    : await db.select().from(culturalChapters).where(eq(culturalChapters.isPublished, true)).orderBy(asc(culturalChapters.chapterNumber));

  if (!chapters.length) return [];
  const chapterSources = await db.select().from(culturalSources).where(inArray(culturalSources.chapterSlug, chapters.map((chapter) => chapter.slug)));
  const pageRows = await db.select().from(culturalExtraPages).where(inArray(culturalExtraPages.chapterSlug, chapters.map((chapter) => chapter.slug)));
  const pageIds = pageRows.map((page) => page.id);
  const imageRows = pageIds.length ? await db.select().from(culturalExtraPageImages).where(inArray(culturalExtraPageImages.pageId, pageIds)) : [];
  const entries = mapCulturalEntries(chapters, chapterSources, pageRows, imageRows);
  return includeUnpublished ? entries : publicCulturalEntries(entries);
}

export async function getCulturalEntryBySlug(slug: string, includeUnpublished = false) {
  const entries = await listCulturalEntries({ includeUnpublished });
  return entries.find((entry) => entry.slug === slug) ?? null;
}

async function replaceSources(chapterSlug: string, sources: CulturalSource[]) {
  const db = await getDb();
  if (!db) throw new Error("Banco de dados indisponível.");

  await db.delete(culturalSources).where(eq(culturalSources.chapterSlug, chapterSlug));
  if (sources.length) {
    await db.insert(culturalSources).values(
      sources.map((source) => {
        const item = normalizeSource(source);
        return {
          chapterSlug,
          title: item.title,
          institution: item.institution,
          sourceUrl: item.url,
          note: item.note,
        };
      }),
    );
  }
}

async function replaceExtraPages(chapterSlug: string, pages: CulturalExtraPage[]) {
  const db = await getDb();
  if (!db) throw new Error("Banco de dados indisponível.");

  const previousPages = await db.select({ id: culturalExtraPages.id }).from(culturalExtraPages).where(eq(culturalExtraPages.chapterSlug, chapterSlug));
  const previousIds = previousPages.map((page) => page.id);
  if (previousIds.length) {
    await db.delete(culturalExtraPageImages).where(inArray(culturalExtraPageImages.pageId, previousIds));
  }
  await db.delete(culturalExtraPages).where(eq(culturalExtraPages.chapterSlug, chapterSlug));

  for (let pageIndex = 0; pageIndex < pages.length; pageIndex += 1) {
    const page = pages[pageIndex];
    const created = await db
      .insert(culturalExtraPages)
      .values({
        chapterSlug,
        sortOrder: pageIndex,
        eyebrow: page.eyebrow.trim(),
        title: page.title.trim(),
        content: page.content.trim(),
      })
      .returning({ id: culturalExtraPages.id });
    const pageId = created[0].id;
    await db.insert(culturalExtraPageImages).values(
      page.images.map((image, imageIndex) => ({
        pageId,
        sortOrder: imageIndex,
        imageUrl: image.imageUrl.trim(),
        altText: image.altText.trim(),
        credit: image.credit.trim(),
        sourceUrl: image.sourceUrl.trim(),
        license: image.license.trim(),
      })),
    );
  }
}

export async function createCulturalEntry(input: CulturalChapterInput) {
  const db = await getDb();
  if (!db) throw new Error("Banco de dados indisponível.");

  const slug = toSlug(input.slug || input.title);
  if (!slug) throw new Error("Não foi possível gerar o identificador da cultura.");

  const existing = await db.select({ slug: culturalChapters.slug }).from(culturalChapters).where(eq(culturalChapters.slug, slug)).limit(1);
  if (existing.length) throw new Error("Já existe uma cultura com este identificador.");

  const current = await db.select({ chapterNumber: culturalChapters.chapterNumber }).from(culturalChapters);
  const chapterNumber = Math.max(0, ...current.map((chapter) => chapter.chapterNumber)) + 1;

  await db.insert(culturalChapters).values({
    chapterNumber,
    photoUrl: input.photoUrl.trim(),
    photoCredit: input.photoCredit.trim(),
    photoSourceUrl: input.photoSourceUrl.trim(),
    photoLicense: input.photoLicense.trim(),
    slug,
    title: input.title.trim(),
    subtitle: input.subtitle.trim(),
    category: input.category,
    territory: input.region.trim(),
    territorialNote: input.territorialNote.trim(),
    excerpt: input.excerpt.trim(),
    content: input.story.map((paragraph) => paragraph.trim()).filter(Boolean).join("\n\n"),
    illustrationLabel: `Ilustração artística — ${input.visualMotif.trim()}`,
    isPublished: input.isPublished,
  });
  await replaceSources(slug, input.sources);
  await replaceExtraPages(slug, input.extraPages);

  return getCulturalEntryBySlug(slug, true);
}

export async function updateCulturalEntry(originalSlug: string, input: CulturalChapterInput) {
  const db = await getDb();
  if (!db) throw new Error("Banco de dados indisponível.");

  const existing = await db.select().from(culturalChapters).where(eq(culturalChapters.slug, originalSlug)).limit(1);
  if (!existing.length) return null;

  const slug = toSlug(input.slug || input.title);
  if (!slug) throw new Error("Não foi possível gerar o identificador da cultura.");
  if (slug !== originalSlug) {
    const duplicate = await db.select({ slug: culturalChapters.slug }).from(culturalChapters).where(eq(culturalChapters.slug, slug)).limit(1);
    if (duplicate.length) throw new Error("Já existe uma cultura com este identificador.");
  }

  await db.update(culturalChapters).set({
    slug,
    photoUrl: input.photoUrl.trim(),
    photoCredit: input.photoCredit.trim(),
    photoSourceUrl: input.photoSourceUrl.trim(),
    photoLicense: input.photoLicense.trim(),
    title: input.title.trim(),
    subtitle: input.subtitle.trim(),
    category: input.category,
    territory: input.region.trim(),
    territorialNote: input.territorialNote.trim(),
    excerpt: input.excerpt.trim(),
    content: input.story.map((paragraph) => paragraph.trim()).filter(Boolean).join("\n\n"),
    illustrationLabel: `Ilustração artística — ${input.visualMotif.trim()}`,
    isPublished: input.isPublished,
  }).where(eq(culturalChapters.slug, originalSlug));

  if (slug !== originalSlug) {
    await db.update(culturalSources).set({ chapterSlug: slug }).where(eq(culturalSources.chapterSlug, originalSlug));
    await db.update(culturalExtraPages).set({ chapterSlug: slug }).where(eq(culturalExtraPages.chapterSlug, originalSlug));
  }
  await replaceSources(slug, input.sources);
  await replaceExtraPages(slug, input.extraPages);

  return getCulturalEntryBySlug(slug, true);
}

export async function setCulturalEntryPublication(slug: string, isPublished: boolean) {
  const db = await getDb();
  if (!db) throw new Error("Banco de dados indisponível.");

  await db.update(culturalChapters).set({ isPublished }).where(eq(culturalChapters.slug, slug));
  return getCulturalEntryBySlug(slug, true);
}
