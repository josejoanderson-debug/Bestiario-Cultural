import { eq } from "drizzle-orm";
import { culturalChapters, culturalSources } from "../drizzle/schema.ts";
import { getDb } from "../server/db.ts";

const slug = process.argv[2];
if (!slug) throw new Error("Informe o identificador do registro temporário a remover.");

const db = await getDb();
if (!db) throw new Error("Banco de dados indisponível para a limpeza.");

await db.delete(culturalSources).where(eq(culturalSources.chapterSlug, slug));
await db.delete(culturalChapters).where(eq(culturalChapters.slug, slug));
console.log(`Registro temporário removido: ${slug}`);
process.exit(0);
