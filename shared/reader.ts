export const PAGES_PER_CHAPTER = 4;

type ReaderChapter = { extraPages?: unknown[] };
type ChaptersInput = number | ReaderChapter[];

function countExtraPages(chapter: ReaderChapter) {
  return Array.isArray(chapter.extraPages) ? chapter.extraPages.length : 0;
}

function pageCountFor(chapter: ReaderChapter) {
  return PAGES_PER_CHAPTER + countExtraPages(chapter);
}

function chapterCount(input: ChaptersInput) {
  return typeof input === "number" ? Math.max(0, input) : input.length;
}

function chapterPages(input: ChaptersInput, index: number) {
  if (typeof input === "number") return PAGES_PER_CHAPTER;
  return input[index] ? pageCountFor(input[index]) : PAGES_PER_CHAPTER;
}

export function virtualPageCount(chapters: ChaptersInput) {
  if (typeof chapters === "number") return chapterCount(chapters) * PAGES_PER_CHAPTER;
  return chapters.reduce((total, chapter) => total + pageCountFor(chapter), 0);
}

export function openingPageForChapter(chapterIndex: number, chapters: ChaptersInput = 0) {
  const safeIndex = Math.max(0, chapterIndex);
  let offset = 0;
  for (let index = 0; index < safeIndex; index += 1) offset += chapterPages(chapters, index);
  return offset;
}

export function chapterIndexFromPage(pageIndex: number, chapters: ChaptersInput = 0) {
  const safePage = Math.max(0, pageIndex);
  if (typeof chapters === "number") return Math.max(0, Math.floor(safePage / PAGES_PER_CHAPTER));

  let offset = 0;
  for (let index = 0; index < chapters.length; index += 1) {
    offset += pageCountFor(chapters[index]);
    if (safePage < offset) return index;
  }
  return Math.max(0, chapters.length - 1);
}

export function pagePositionInChapter(pageIndex: number, chapters: ChaptersInput = 0) {
  const index = chapterIndexFromPage(pageIndex, chapters);
  return Math.max(0, pageIndex - openingPageForChapter(index, chapters));
}

export function isOpeningPage(pageIndex: number, chapters: ChaptersInput = 0) {
  return pagePositionInChapter(pageIndex, chapters) === 0;
}

export function pageDirectionFromPointer(pointerX: number, pageWidth: number): -1 | 1 {
  return pointerX < pageWidth / 2 ? -1 : 1;
}
