import { describe, expect, it } from "vitest";
import { chapterIndexFromPage, isOpeningPage, openingPageForChapter, pageDirectionFromPointer, pagePositionInChapter, virtualPageCount } from "../shared/reader";

describe("sequência do leitor virtual", () => {
  it("cria abertura, capítulo, caderno e fontes para cada cultura", () => {
    expect(virtualPageCount(20)).toBe(80);
    expect(openingPageForChapter(0)).toBe(0);
    expect(openingPageForChapter(4)).toBe(16);
  });

  it("mantém a alternância entre página de abertura e página de capítulo", () => {
    expect(isOpeningPage(0)).toBe(true);
    expect(isOpeningPage(1)).toBe(false);
    expect(chapterIndexFromPage(0)).toBe(0);
    expect(chapterIndexFromPage(3)).toBe(0);
    expect(chapterIndexFromPage(79)).toBe(19);
    expect(pagePositionInChapter(0)).toBe(0);
    expect(pagePositionInChapter(1)).toBe(1);
    expect(pagePositionInChapter(2)).toBe(2);
    expect(pagePositionInChapter(3)).toBe(3);
  });

  it("avança ou retorna conforme a metade clicada da página", () => {
    expect(pageDirectionFromPointer(80, 400)).toBe(-1);
    expect(pageDirectionFromPointer(320, 400)).toBe(1);
  });
});
