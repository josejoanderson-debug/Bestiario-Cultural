import { describe, expect, it } from "vitest";
import { culturalCategories, culturalEntries } from "../shared/culturalData";

describe("acervo editorial do Bestiário Cultural", () => {
  it("mantém exatamente os 20 capítulos aprovados e em ordem", () => {
    expect(culturalEntries).toHaveLength(20);
    expect(culturalEntries.map((entry) => entry.number)).toEqual(Array.from({ length: 20 }, (_, index) => index + 1));
    expect(culturalEntries.map((entry) => entry.title)).toEqual([
      "Bumba Meu Boi", "Forró", "Coco de Roda", "Quadrilha Junina", "Maracatu",
      "Cavalo-Marinho", "Repente / Cordel", "Carnaval de Rua", "Fandango", "Ciranda",
      "Pastoril", "Reisado", "Baião", "Xaxado", "Cangaço", "Artesanato de Barro",
      "Renda Renascença", "Cerâmica de Caruaru", "Lapinha", "Festa de São João",
    ]);
  });

  it("mantém categorias permitidas, identificadores únicos e referências para todos os capítulos", () => {
    const allowedCategories = new Set(culturalCategories.map((category) => category.value));
    const slugs = culturalEntries.map((entry) => entry.slug);

    expect(new Set(slugs).size).toBe(20);
    culturalEntries.forEach((entry) => {
      expect(allowedCategories.has(entry.category)).toBe(true);
      expect(entry.story.length).toBeGreaterThanOrEqual(2);
      expect(entry.sources.length).toBeGreaterThan(0);
      expect(entry.territorialNote.length).toBeGreaterThan(40);
    });
  });
});
