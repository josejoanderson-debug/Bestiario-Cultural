import { eq } from "drizzle-orm";
import { culturalChapters, culturalSources } from "../drizzle/schema.ts";
import {
  getDb,
} from "../server/db.ts";
import { appRouter } from "../server/routers.ts";

const slug = `validacao-admin-${Date.now()}`;
const baseCulture = {
  slug,
  title: "Validação temporária do acervo",
  subtitle: "Registro reversível de validação técnica.",
  category: "festa",
  region: "Ambiente de validação",
  territorialNote: "Registro temporário criado e removido automaticamente pelo teste integrado.",
  excerpt: "Capítulo temporário para confirmar a publicação pública.",
  story: ["Este é um registro técnico e temporário.", "Ele é removido ao final da verificação."],
  visualMotif: "selo de validação",
  sources: [{
    title: "Registro técnico de validação",
    institution: "Bestiário Cultural",
    url: "https://example.org/validacao",
    note: "Fonte temporária criada apenas para validar a persistência do fluxo administrativo.",
  }],
  isPublished: true,
};

const db = await getDb();
if (!db) throw new Error("Banco de dados indisponível para a validação integrada.");
const publicCaller = appRouter.createCaller({ user: null });
const adminCaller = appRouter.createCaller({ user: { role: "admin" } });
const keepValidationRecord = process.env.KEEP_VALIDATION === "true";

let exitCode = 0;

try {
  await adminCaller.admin.createCulture(baseCulture);
  const initiallyPublic = await publicCaller.cultural.list();
  if (!initiallyPublic.some((entry) => entry.slug === slug)) throw new Error("Registro publicado não apareceu na listagem pública.");

  await adminCaller.admin.setPublication({ slug, isPublished: false });
  const hiddenPublic = await publicCaller.cultural.list();
  const hiddenAdmin = await adminCaller.admin.listCultures();
  if (hiddenPublic.some((entry) => entry.slug === slug)) throw new Error("Registro despublicado ainda aparece para visitantes.");
  if (!hiddenAdmin.some((entry) => entry.slug === slug)) throw new Error("Registro despublicado não aparece na administração.");

  await adminCaller.admin.updateCulture({ originalSlug: slug, culture: { ...baseCulture, title: "Validação técnica atualizada", isPublished: true } });
  const republished = await publicCaller.cultural.list();
  if (!republished.some((entry) => entry.slug === slug && entry.title === "Validação técnica atualizada")) {
    throw new Error("Edição publicada não foi refletida na listagem pública.");
  }

  console.log("Validação integrada concluída: criar, editar, publicar e despublicar funcionam no banco.");
} catch (error) {
  exitCode = 1;
  console.error(error);
} finally {
  if (keepValidationRecord) {
    console.log(`Registro preservado temporariamente para evidência visual: ${slug}`);
  } else {
    await db.delete(culturalSources).where(eq(culturalSources.chapterSlug, slug));
    await db.delete(culturalChapters).where(eq(culturalChapters.slug, slug));
  }
  process.exit(exitCode);
}
