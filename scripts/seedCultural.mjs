import postgres from "postgres";
import { culturalEntries } from "../shared/culturalData.ts";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL indisponível para carga do acervo.");
}

const sql = postgres(process.env.DATABASE_URL, { prepare: false, max: 1 });

try {
  await sql.begin(async (tx) => {
    for (const entry of culturalEntries) {
      await tx`
        INSERT INTO "culturalChapters" (
          "chapterNumber", slug, title, subtitle, category, territory, "territorialNote", excerpt, content, "illustrationLabel", "isPublished"
        ) VALUES (
          ${entry.number}, ${entry.slug}, ${entry.title}, ${entry.subtitle}, ${entry.category}, ${entry.region}, ${entry.territorialNote}, ${entry.excerpt}, ${entry.story.join("\n\n")}, ${`Ilustração artística — ${entry.visualMotif}`}, ${true}
        )
        ON CONFLICT (slug) DO UPDATE SET
          "chapterNumber" = EXCLUDED."chapterNumber",
          title = EXCLUDED.title,
          subtitle = EXCLUDED.subtitle,
          category = EXCLUDED.category,
          territory = EXCLUDED.territory,
          "territorialNote" = EXCLUDED."territorialNote",
          excerpt = EXCLUDED.excerpt,
          content = EXCLUDED.content,
          "illustrationLabel" = EXCLUDED."illustrationLabel",
          "isPublished" = EXCLUDED."isPublished"
      `;
    }

    const slugs = culturalEntries.map((entry) => entry.slug);
    await tx`DELETE FROM "culturalSources" WHERE "chapterSlug" IN ${tx(slugs)}`;

    for (const entry of culturalEntries) {
      for (const source of entry.sources) {
        await tx`
          INSERT INTO "culturalSources" ("chapterSlug", title, institution, "sourceUrl", note)
          VALUES (${entry.slug}, ${source.title}, ${source.institution}, ${source.url}, ${source.note})
        `;
      }
    }
  });

  console.log(`Acervo sincronizado: ${culturalEntries.length} capítulos.`);
} finally {
  await sql.end();
}
