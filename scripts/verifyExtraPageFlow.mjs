import postgres from "postgres";

const action = process.argv[2];
if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL não está configurada.");
if (action !== "apply" && action !== "cleanup") throw new Error("Use apply ou cleanup.");

const sql = postgres(process.env.DATABASE_URL, { prepare: false, max: 1 });

async function removeValidationPage() {
  const pages = await sql`
    SELECT id FROM "culturalExtraPages" WHERE "chapterSlug" = ${"bumba-meu-boi"} AND eyebrow = ${"Validação temporária"}
  `;
  const ids = pages.map((page) => page.id);
  if (ids.length) {
    await sql`DELETE FROM "culturalExtraPageImages" WHERE "pageId" IN ${sql(ids)}`;
    await sql`DELETE FROM "culturalExtraPages" WHERE "chapterSlug" = ${"bumba-meu-boi"} AND eyebrow = ${"Validação temporária"}`;
  }
}

try {
  await removeValidationPage();
  if (action === "apply") {
    const created = await sql`
      INSERT INTO "culturalExtraPages" ("chapterSlug", "sortOrder", eyebrow, title, content)
      VALUES (${"bumba-meu-boi"}, ${999}, ${"Validação temporária"}, ${"Galeria de verificação"}, ${"Esta página temporária verifica a exibição pública de conteúdo complementar.\n\nEla será removida automaticamente após a conferência visual."})
      RETURNING id
    `;
    const pageId = created[0].id;
    await sql`
      INSERT INTO "culturalExtraPageImages" ("pageId", "sortOrder", "imageUrl", "altText", credit, "sourceUrl", license)
      VALUES
        (${pageId}, ${0}, ${"/manus-storage/bumba-meu-boi_34c2e09c.jpg"}, ${"Fotografia documental do Bumba Meu Boi."}, ${"CDI Europe"}, ${"https://commons.wikimedia.org/wiki/File:Bumba_meu_boi_-_Maranh%C3%A3o,_Brasil.jpg"}, ${"CC BY-SA 2.0"}),
        (${pageId}, ${1}, ${"/manus-storage/bumba-meu-boi_34c2e09c.jpg"}, ${"Segundo registro documental do Bumba Meu Boi para validação."}, ${"CDI Europe"}, ${"https://commons.wikimedia.org/wiki/File:Bumba_meu_boi_-_Maranh%C3%A3o,_Brasil.jpg"}, ${"CC BY-SA 2.0"})
    `;
    console.log("Página temporária criada para validação visual.");
  } else {
    console.log("Página temporária removida.");
  }
} finally {
  await sql.end();
}
