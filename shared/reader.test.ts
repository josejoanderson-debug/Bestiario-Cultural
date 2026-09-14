import { describe, expect, it } from "vitest";
import { chapterIndexFromPage, isOpeningPage, openingPageForChapter, pagePositionInChapter, virtualPageCount } from "./reader";

describe("sequência do leitor virtual", () => {
  it("cria quatro páginas de leitura para cada cultura", () => {
    expect(virtualPageCount(20)).toBe(80);
    expect(openingPageForChapter(0)).toBe(0);
    expect(openingPageForChapter(4)).toBe(16);
  });

  it("mantém o agrupamento de quatro páginas por capítulo", () => {
    expect(isOpeningPage(0)).toBe(true);
    expect(isOpeningPage(1)).toBe(false);
    expect(chapterIndexFromPage(0)).toBe(0);
    expect(chapterIndexFromPage(1)).toBe(0);
    expect(chapterIndexFromPage(79)).toBe(19);
  });

  it("inclui páginas de aprofundamento sem deslocar a abertura dos capítulos seguintes", () => {
    const chapters = [
      { extraPages: [{}, {}] },
      { extraPages: [{}] },
      { extraPages: [] },
    ];

    expect(virtualPageCount(chapters)).toBe(15);
    expect(openingPageForChapter(1, chapters)).toBe(6);
    expect(openingPageForChapter(2, chapters)).toBe(11);
    expect(chapterIndexFromPage(5, chapters)).toBe(0);
    expect(chapterIndexFromPage(6, chapters)).toBe(1);
    expect(isOpeningPage(11, chapters)).toBe(true);
    expect(pagePositionInChapter(10, chapters)).toBe(4);
  });
});
