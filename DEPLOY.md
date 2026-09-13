# Deploy — Bestiário Cultural

## Vercel

- Root Directory: `.`
- Framework Preset: Vite
- Install Command: `npm install`
- Build Command: `npm run build`
- Output Directory: deixe vazio
- Node.js: 24.x (ou a versão definida pelo projeto)

O projeto usa `server.ts` na raiz. O Vercel detecta servidores Node/Express com configuração zero.

## Variáveis de ambiente

Configure em Production, Preview e Development:

```text
SUPABASE_URL=https://SEU-PROJETO.supabase.co
SUPABASE_SECRET_KEY=sb_secret_...
SUPABASE_STORAGE_BUCKET=cultural-images
ADMIN_LOCAL_USERNAME=seu_usuario
ADMIN_LOCAL_PASSWORD=sua_senha
JWT_SECRET=uma_chave_aleatoria_longa
```

Não publique nenhuma dessas chaves no GitHub.

## Supabase

1. Crie um projeto novo.
2. Abra o SQL Editor.
3. Execute todo o conteúdo de `supabase/schema.sql`.
4. Confirme no Storage a existência do bucket `cultural-images`.
5. A chave secreta fica somente na Vercel/backend.

## Testes depois do deploy

```text
/
/api/health
/admin
```

`/api/health` deve responder JSON com `ok: true`.
