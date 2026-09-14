import "dotenv/config";
import { createServer } from "http";
import { createApp } from "./app";
import { serveStatic, setupVite } from "./vite";

// Este arquivo só roda em desenvolvimento local (`pnpm dev`) ou em uma
// hospedagem Node tradicional e sempre ativa (Render, Railway, VPS, etc.).
// Na Vercel, quem atende as requisições é `api/index.ts`, que reaproveita o
// mesmo `createApp()` sem chamar `listen()` (a Vercel gerencia o ciclo de
// vida da função). Veja docs/DEPLOY_VERCEL_SUPABASE.md.
async function startServer() {
  const app = createApp();
  const server = createServer(app);

  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const port = Number(process.env.PORT ?? 3000);
  server.listen(port, "0.0.0.0", () => console.log(`Bestiário Cultural em execução na porta ${port}.`));
}

startServer().catch((error) => {
  console.error("Não foi possível iniciar o servidor:", error);
  process.exit(1);
});
