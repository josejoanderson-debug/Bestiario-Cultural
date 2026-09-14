import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import type { User } from "../../drizzle/schema";

/**
 * Contexto portável: o Bestiário é público e a administração é protegida pelo
 * cookie HMAC de `localAdmin.ts`. Nenhum provedor de OAuth externo é necessário.
 */
export type TrpcContext = {
  req: CreateExpressContextOptions["req"];
  res: CreateExpressContextOptions["res"];
  user: User | null;
};

export async function createContext(opts: CreateExpressContextOptions): Promise<TrpcContext> {
  return { req: opts.req, res: opts.res, user: null };
}
