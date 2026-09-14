import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { culturalEntries } from "./culturalData";
import { photoLedger } from "./photoLedger";

describe("registro fotográfico documental", () => {
  const ledger = readFileSync(new URL("../photo_credits.md", import.meta.url), "utf8");
  const rows = ledger.split("\n").filter((line) => line.startsWith("| ") && !line.startsWith("| ---"));

  it("mantém imagem, crédito e URL únicos para cada capítulo publicado", () => {
    expect(rows).toHaveLength(culturalEntries.length + 1);
    for (const entry of culturalEntries) {
      expect(rows.some((row) => row.includes(`| ${entry.title} |`))).toBe(true);
      expect(photoLedger[entry.slug]?.image).toMatch(/^https:\/\/commons\.wikimedia\.org\//);
      expect(photoLedger[entry.slug]?.label).toBeTruthy();
      expect(photoLedger[entry.slug]?.url).toMatch(/^https:\/\//);
      expect(ledger).toContain(photoLedger[entry.slug].url);
    }
  });

  it("não aceita páginas de categoria como origem da fotografia", () => {
    for (const row of rows.slice(1)) {
      expect(row).toContain("https://");
      expect(row).not.toContain("/Category:");
      expect(row).not.toContain("licença a confirmar");
    }
  });

  it("sinaliza explicitamente a exceção curatorial do Pastoril", () => {
    expect(photoLedger.pastoril.kind).toBe("contextual-reference");
    expect(ledger).toContain("não como registro da apresentação específica de Pastoril");
  });
});
