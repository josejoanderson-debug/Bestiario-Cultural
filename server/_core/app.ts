import express, { type Express } from "express";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { appRouter } from "../routers";
import { createContext } from "./context";

/**
 * Fábrica do app Express, isolada de `listen()`/Vite para poder ser
 * reaproveitada tanto pelo servidor tradicional (`server/_core/index.ts`,
 * usado em `pnpm dev`/`pnpm start` e em hospedagens como Render) quanto pela
 * função serverless da Vercel (`api/index.ts`).
 *
 * Atenção ao limite de payload: a Vercel restringe o corpo das requisições a
 * Serverless Functions a 4,5 MB, independentemente do limite configurado
 * aqui. O envio de fotos do painel administrativo é feito diretamente do
 * navegador para o Cloudinary (upload não assinado) exatamente para não
 * esbarrar nesse limite — ver client/src/lib/cloudinaryUpload.ts.
 */
export function createApp(): Express {
  const app = express();

  app.set("trust proxy", 1);
  app.use(express.json({ limit: "6mb" }));
  app.use(express.urlencoded({ limit: "6mb", extended: true }));
  app.use("/api/trpc", createExpressMiddleware({ router: appRouter, createContext }));

  return app;
}
