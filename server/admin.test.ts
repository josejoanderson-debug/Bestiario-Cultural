import { beforeEach, describe, expect, it, vi } from "vitest";

const dbMocks = vi.hoisted(() => ({
  listCulturalEntries: vi.fn(),
  createCulturalEntry: vi.fn(),
  updateCulturalEntry: vi.fn(),
  setCulturalEntryPublication: vi.fn(),
  getCulturalEntryBySlug: vi.fn(),
}));

const storageMocks = vi.hoisted(() => ({ storagePut: vi.fn() }));

vi.mock("./db", async (importOriginal) => ({
  ...(await importOriginal<typeof import("./db")>()),
  ...dbMocks,
}));

vi.mock("./storage", () => ({ storagePut: storageMocks.storagePut }));

import { publicCulturalEntries } from "./db";
import { appRouter } from "./routers";

const cultureInput = {
  title: "Festa das Rendeiras",
  subtitle: "Linhas, memória e criação comunitária.",
  category: "artesanato" as const,
  region: "Cariri paraibano",
  territorialNote: "Registro editorial de uma prática comunitária.",
  excerpt: "Uma celebração dedicada aos saberes das rendeiras.",
  story: ["Primeiro parágrafo do novo capítulo.", "Segundo parágrafo do novo capítulo."],
  visualMotif: "renda, fitas e linhas",
  sources: [{ title: "Fonte cultural", institution: "Arquivo local", url: "https://example.org/fonte", note: "Referência de pesquisa." }],
  photoUrl: "https://example.org/foto-rendeiras.jpg",
  photoCredit: "Arquivo local · CC BY 4.0",
  photoSourceUrl: "https://example.org/foto-rendeiras",
  photoLicense: "CC BY 4.0",
  extraPages: [{
    eyebrow: "Saberes em detalhe",
    title: "O trabalho das rendeiras",
    content: "Um aprofundamento editorial sobre a continuidade do ofício.",
    images: [
      { imageUrl: "https://example.org/renda-1.jpg", altText: "Rendeira trabalhando com linha e almofada.", credit: "Arquivo local", sourceUrl: "https://example.org/renda-1", license: "CC BY 4.0" },
      { imageUrl: "https://example.org/renda-2.jpg", altText: "Detalhe da renda produzida à mão.", credit: "Arquivo local", sourceUrl: "https://example.org/renda-2", license: "CC BY 4.0" },
    ],
  }],
  isPublished: true,
};

function adminCaller() {
  return appRouter.createCaller({ user: { role: "admin" } } as never);
}

function userCaller() {
  return appRouter.createCaller({ user: { role: "user" } } as never);
}

describe("administração do acervo cultural", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("bloqueia usuários sem papel administrativo", async () => {
    await expect(userCaller().admin.listCultures()).rejects.toMatchObject({ code: "FORBIDDEN" });
    await expect(userCaller().admin.createCulture(cultureInput)).rejects.toMatchObject({ code: "FORBIDDEN" });
  });

  it("lista registros administrativos, inclusive os não publicados", async () => {
    dbMocks.listCulturalEntries.mockResolvedValue([{ slug: "rascunho", isPublished: false }]);

    await expect(adminCaller().admin.listCultures()).resolves.toEqual([{ slug: "rascunho", isPublished: false }]);
    expect(dbMocks.listCulturalEntries).toHaveBeenCalledWith({ includeUnpublished: true });
  });

  it("recebe imagem pelo painel e encaminha os bytes ao armazenamento protegido", async () => {
    storageMocks.storagePut.mockResolvedValue({ key: "cultural-photos/foto.jpg", url: "/manus-storage/foto.jpg" });
    const payload = { fileName: "foto.jpg", mimeType: "image/jpeg" as const, base64: Buffer.from("imagem de teste para envio").toString("base64") };

    await expect(userCaller().admin.uploadPhoto(payload)).rejects.toMatchObject({ code: "FORBIDDEN" });
    await expect(adminCaller().admin.uploadPhoto(payload)).resolves.toEqual({ key: "cultural-photos/foto.jpg", url: "/manus-storage/foto.jpg" });
    expect(storageMocks.storagePut).toHaveBeenCalledWith(expect.stringMatching(/^cultural-photos\//), expect.any(Buffer), "image/jpeg");
  });

  it("encaminha criação, edição e mudança de publicação ao armazenamento persistente", async () => {
    dbMocks.createCulturalEntry.mockResolvedValue({ slug: "festa-das-rendeiras" });
    dbMocks.updateCulturalEntry.mockResolvedValue({ slug: "festa-das-rendeiras" });
    dbMocks.setCulturalEntryPublication.mockResolvedValue({ slug: "festa-das-rendeiras", isPublished: false });

    await adminCaller().admin.createCulture(cultureInput);
    await adminCaller().admin.updateCulture({ originalSlug: "festa-das-rendeiras", culture: { ...cultureInput, isPublished: false } });
    await adminCaller().admin.setPublication({ slug: "festa-das-rendeiras", isPublished: false });

    expect(dbMocks.createCulturalEntry).toHaveBeenCalledWith(cultureInput);
    expect(dbMocks.updateCulturalEntry).toHaveBeenCalledWith("festa-das-rendeiras", { ...cultureInput, isPublished: false });
    expect(dbMocks.setCulturalEntryPublication).toHaveBeenCalledWith("festa-das-rendeiras", false);
  });

  it("exige duas imagens documentadas em cada página extra", async () => {
    const invalidInput = {
      ...cultureInput,
      extraPages: [{ ...cultureInput.extraPages[0], images: [cultureInput.extraPages[0].images[0]] }],
    };

    await expect(adminCaller().admin.createCulture(invalidInput)).rejects.toMatchObject({ code: "BAD_REQUEST" });
    expect(dbMocks.createCulturalEntry).not.toHaveBeenCalled();
  });

  it("expõe ao público apenas registros publicados", () => {
    const visible = publicCulturalEntries([
      { slug: "publicado", title: "Publicado", isPublished: true },
      { slug: "rascunho", title: "Rascunho", isPublished: false },
    ] as never);

    expect(visible).toEqual([{ slug: "publicado", title: "Publicado" }]);
  });
});
