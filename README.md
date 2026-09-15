# Bestiário Cultural

Livro digital interativo sobre manifestações culturais populares da Paraíba. Esta base é independente de plataforma: usa React, Express, tRPC e Supabase (Postgres + Storage) para dados e imagens enviadas pelo painel administrativo.

## Publicar na Vercel + Supabase (recomendado)

Siga o passo a passo completo em [`docs/DEPLOY_VERCEL_SUPABASE.md`](docs/DEPLOY_VERCEL_SUPABASE.md): banco Postgres e upload de imagens direto para o Supabase Storage (sem passar pelo limite de payload da Vercel), e deploy da função serverless em `/api`.

## Publicar em um servidor Node tradicional (alternativa)

1. Crie um repositório no GitHub e envie este código, sem arquivos `.env` ou chaves.
2. Crie um banco Postgres externo (Supabase, Neon, RDS etc.) e configure `DATABASE_URL`.
3. Crie um bucket público `cultural-photos` no Supabase Storage e as políticas de acesso (passo 2 de [`docs/DEPLOY_VERCEL_SUPABASE.md`](docs/DEPLOY_VERCEL_SUPABASE.md)); cadastre `VITE_SUPABASE_URL`/`VITE_SUPABASE_ANON_KEY` no servidor.
4. No Render, importe o repositório como Blueprint. O arquivo `render.yaml` define build e início.
5. Preencha os segredos descritos em [`docs/VARIAVEIS_DE_AMBIENTE.md`](docs/VARIAVEIS_DE_AMBIENTE.md).
6. Aplique o esquema com `pnpm db:push`, carregue o acervo com `pnpm db:seed` e publique.

O fluxo de CI em `.github/workflows/ci.yml` valida tipos, testes e build a cada envio para `main`.

## Desenvolvimento

```bash
pnpm install
pnpm check
pnpm test
pnpm dev
```

Para validar os segredos antes de uma publicação, use `pnpm external:check`. Para instruções adicionais, consulte também [`docs/DEPLOY_EXTERNO.md`](docs/DEPLOY_EXTERNO.md) e [`docs/guia_hospedagem_independente.md`](docs/guia_hospedagem_independente.md) (escritos originalmente para MySQL/Render — os comandos de banco nesses dois arquivos devem ser lidos como `pnpm db:push`/`pnpm db:seed`, já adaptados para Postgres).

