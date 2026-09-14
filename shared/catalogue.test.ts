import { describe, expect, it } from "vitest";
import { filterCulturalEntries } from "./catalogue";
import { culturalEntries } from "./culturalData";

describe("filtros do catálogo cultural", () => {
  it("filtra as manifestações por uma das quatro categorias permitidas", () => {
    const arts = filterCulturalEntries(culturalEntries, "", "artesanato");

    expect(arts.map((entry) => entry.title)).toEqual([
      "Artesanato de Barro",
      "Renda Renascença",
      "Cerâmica de Caruaru",
    ]);
  });

  it("localiza capítulos por nome, sem depender de acentuação", () => {
    const result = filterCulturalEntries(culturalEntries, "baiao", "all");

    expect(result).toHaveLength(1);
    expect(result[0]?.slug).toBe("baiao");
  });

  it("combina busca e categoria sem retornar itens fora do recorte", () => {
    const result = filterCulturalEntries(culturalEntries, "festa", "festa");

    expect(result.map((entry) => entry.slug)).toEqual([
      "bumba-meu-boi",
      "carnaval-de-rua",
      "cangaco",
      "lapinha",
      "festa-de-sao-joao",
    ]);
  });
});
