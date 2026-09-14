import type { CulturalCategory, CulturalEntry } from "./culturalData";

export type CatalogueCategory = "all" | CulturalCategory;

function normalize(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("pt-BR");
}

export function filterCulturalEntries(entries: CulturalEntry[], query: string, category: CatalogueCategory) {
  const normalizedQuery = normalize(query.trim());

  return entries.filter((entry) => {
    const matchesCategory = category === "all" || entry.category === category;
    const searchable = normalize(`${entry.title} ${entry.excerpt} ${entry.categoryLabel}`);
    return matchesCategory && searchable.includes(normalizedQuery);
  });
}
