import "dotenv/config";
import { createApp } from "../server/_core/app";

// Ponto de entrada usado pela Vercel. Todas as chamadas para /api/* são
// roteadas até aqui (ver rewrite em vercel.json), e o próprio Express
// resolve internamente a rota /api/trpc/*. Não chamamos `listen()` — a
// Vercel invoca este handler a cada requisição.
const app = createApp();

export default app;
