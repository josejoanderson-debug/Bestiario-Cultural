import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { culturalEntries } from "../shared/culturalData";

// Simula a cadeia encadeável do drizzle (select().from().where().orderBy())
// terminando numa Promise controlável — sem isso, testar o que acontece
// quando a consulta ao Postgres falha exigiria um banco real.
function makeChain(result: () => Promise<unknown[]>) {
  const chain: Record<string, unknown> = {};
  const methods = ["from", "where", "orderBy", "limit", "values", "set", "returning"];
  for (const method of methods) {
    chain[method] = vi.fn(() => chain);
  }
  chain.then = (onFulfilled: (value: unknown[]) => unknown, onRejected?: (reason: unknown) => unknown) =>
    result().then(onFulfilled, onRejected);
  return chain;
}

const dbState = vi.hoisted(() => ({
  shouldFail: false,
  chapters: [] as unknown[],
}));

vi.mock("postgres", () => ({ default: vi.fn(() => ({})) }));

vi.mock("drizzle-orm/postgres-js", () => ({
  drizzle: vi.fn(() => ({
    select: vi.fn(() =>
      makeChain(async () => {
        if (dbState.shouldFail) throw new Error("connection terminated unexpectedly");
        return dbState.chapters;
      }),
    ),
  })),
}));

describe("listCulturalEntries — resiliência a falhas do banco", () => {
  const originalDatabaseUrl = process.env.DATABASE_URL;

  beforeEach(() => {
    process.env.DATABASE_URL = "postgresql://user:pass@localhost:5432/postgres";
    dbState.shouldFail = false;
    dbState.chapters = [];
    vi.resetModules();
  });

  afterEach(() => {
    process.env.DATABASE_URL = originalDatabaseUrl;
  });

  it("recua para o acervo estático na leitura pública quando o banco falha", async () => {
    dbState.shouldFail = true;
    const { listCulturalEntries } = await import("./db");

    const entries = await listCulturalEntries();

    expect(entries).toEqual(culturalEntries);
  });

  it("propaga o erro real para o painel administrativo em vez de simular dados", async () => {
    dbState.shouldFail = true;
    const { listCulturalEntries } = await import("./db");

    await expect(listCulturalEntries({ includeUnpublished: true })).rejects.toThrow(/connection terminated/);
  });

  it("usa o acervo estático quando DATABASE_URL não está configurada", async () => {
    delete process.env.DATABASE_URL;
    const { listCulturalEntries } = await import("./db");

    const entries = await listCulturalEntries();

    expect(entries).toEqual(culturalEntries);
  });
});
