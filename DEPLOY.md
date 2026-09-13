# Deploy

## Supabase
Abra o SQL Editor e execute `supabase/schema.sql` uma única vez.

Depois copie:
- Project URL -> `SUPABASE_URL`
- Secret key (`sb_secret_...`) -> `SUPABASE_SECRET_KEY`

A chave secreta é exclusiva do backend.

## Vercel
Importe o repositório pelo GitHub.

- Root Directory: `.`
- Build Command: `npm run build`
- Install Command: `npm install`
- Output Directory: deixe vazio
- Framework Preset: Other

Environment Variables:
```
SUPABASE_URL=...
SUPABASE_SECRET_KEY=...
SUPABASE_STORAGE_BUCKET=cultural-images
ADMIN_LOCAL_USERNAME=...
ADMIN_LOCAL_PASSWORD=...
JWT_SECRET=...
```

Depois de salvar as variáveis, faça um novo deploy.

O backend é detectado a partir do `server.ts` na raiz. Não crie `api/[...path].ts`, `api/index.ts` ou configurações antigas de Functions para este projeto.
