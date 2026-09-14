import { describe, expect, it } from "vitest";
import { mapCulturalEntries } from "./db";

describe("páginas extras persistidas", () => {
  it("anexa páginas ordenadas e suas galerias ao capítulo público correspondente", () => {
    const entries = mapCulturalEntries(
      [{ id: 1, chapterNumber: 1, slug: "cultura-teste", title: "Cultura teste", subtitle: "Leitura ampliada", category: "festa", territory: "Brasil", territorialNote: "Nota", excerpt: "Resumo", content: "Texto principal", illustrationLabel: "Ilustração artística — fitas", photoUrl: "", photoCredit: "", photoSourceUrl: "", photoLicense: "", isPublished: true } as never],
      [],
      [{ id: 9, chapterSlug: "cultura-teste", sortOrder: 0, eyebrow: "Memória", title: "Página extra", content: "Conteúdo aprofundado" } as never],
      [
        { id: 21, pageId: 9, sortOrder: 1, imageUrl: "https://example.org/segunda.jpg", altText: "Segunda fotografia", credit: "Acervo", sourceUrl: "https://example.org/segunda", license: "CC BY 4.0" } as never,
        { id: 20, pageId: 9, sortOrder: 0, imageUrl: "https://example.org/primeira.jpg", altText: "Primeira fotografia", credit: "Acervo", sourceUrl: "https://example.org/primeira", license: "CC BY 4.0" } as never,
      ],
    );

    expect(entries[0].extraPages).toEqual([{
      id: 9,
      eyebrow: "Memória",
      title: "Página extra",
      content: "Conteúdo aprofundado",
      images: [
        expect.objectContaining({ id: 20, imageUrl: "https://example.org/primeira.jpg" }),
        expect.objectContaining({ id: 21, imageUrl: "https://example.org/segunda.jpg" }),
      ],
    }]);
  });
});
