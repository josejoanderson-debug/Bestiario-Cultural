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
 * navegador para o Supabase Storage (bucket público "cultural-photos")
 * exatamente para não esbarrar nesse limite — ver
 * client/src/lib/supabaseUpload.ts.
 */
export function createApp(): Express {
  const app = express();

  app.set("trust proxy", 1);
  app.use(express.json({ limit: "6mb" }));
  app.use(express.urlencoded({ limit: "6mb", extended: true }));

  // Diagnóstico simples: não toca no banco nem em nenhuma dependência
  // externa, só confirma que a função está no ar e recebendo o caminho
  // completo da requisição (`req.url`/`req.path`). Útil para isolar se um
  // problema é de roteamento (Vercel não repassando o caminho certo até
  // aqui) ou de alguma dependência (banco, variáveis de ambiente).
  app.get("/api/health", (req, res) => {
    res.json({
      ok: true,
      url: req.originalUrl,
      hasDatabaseUrl: Boolean(process.env.DATABASE_URL),
      hasJwtSecret: Boolean(process.env.JWT_SECRET),
      hasAdminCredentials: Boolean(process.env.ADMIN_LOCAL_USERNAME && process.env.ADMIN_LOCAL_PASSWORD),
      // process.env também enxerga variáveis VITE_* na Vercel (o prefixo só
      // controla o que o Vite embute no bundle do navegador); útil aqui só
      // como diagnóstico de que o Storage foi configurado.
      hasSupabaseStorageConfig: Boolean(process.env.VITE_SUPABASE_URL && process.env.VITE_SUPABASE_ANON_KEY),
    });
  });

  app.use("/api/trpc", createExpressMiddleware({ router: appRouter, createContext }));

  // Qualquer requisição que chegue até aqui sem ter sido tratada (ex.: rota
  // de API inexistente) recebe JSON, nunca a página de erro HTML padrão do
  // Express — um corpo HTML onde o cliente tRPC espera JSON é exatamente o
  // tipo de falha que aparece para quem usa o site como um genérico "erro de
  // conexão"/"erro de contato".
  app.use("/api", (req, res) => {
    res.status(404).json({ error: "not_found", path: req.originalUrl });
  });

  // Rede de segurança final: captura qualquer erro síncrono ou assíncrono
  // (incluindo JSON malformado no corpo da requisição) que escape do
  // middleware do tRPC, registra os detalhes nos logs da função (Vercel →
  // Deployments → Functions) e sempre responde em JSON.
  app.use((err: unknown, req: express.Request, res: express.Response, _next: express.NextFunction) => {
    console.error("[Express] Erro não tratado:", err);
    if (res.headersSent) return;
    res.status(500).json({ error: "internal_server_error" });
  });

  return app;
}
