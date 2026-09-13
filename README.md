# Bestiário Cultural — Vercel + Supabase

Projeto independente do ambiente Manus AI, preservando a interface editorial, leitor em formato de livro e painel administrativo.

## Arquitetura
- React + Vite no frontend
- Express + tRPC no backend
- Supabase Postgres para culturas, fontes e páginas extras
- Supabase Storage para imagens enviadas pelo administrador
- Vercel para hospedagem do servidor Node e frontend
- Login administrativo local por cookie HMAC

## Configuração
1. Execute `supabase/schema.sql` no SQL Editor do projeto Supabase.
2. Crie no Vercel as variáveis:
   - `SUPABASE_URL`
   - `SUPABASE_SECRET_KEY` (preferencial) ou `SUPABASE_SERVICE_ROLE_KEY` (legada)
   - `SUPABASE_STORAGE_BUCKET=cultural-images`
   - `ADMIN_LOCAL_USERNAME`
   - `ADMIN_LOCAL_PASSWORD`
   - `JWT_SECRET`
3. No Vercel, use o diretório raiz do projeto e `npm run build` como build command.
4. Não coloque `.env` no GitHub.

A primeira leitura do acervo inicializa automaticamente o banco com os dados de `shared/culturalData.ts` quando a tabela está vazia.

## Desenvolvimento local
```bash
npm install
npm run dev
```

Teste:
- `/`
- `/admin`
- `/api/health`

Build:
```bash
npm run check
npm run build
npm start
```

## Imagens
O administrador pode informar URLs HTTPS ou enviar arquivos de até 5 MB. Os uploads são gravados no bucket `cultural-images` do Supabase Storage e a URL pública é armazenada junto ao conteúdo cultural.

A chave secreta do Supabase só é usada no servidor. Nunca coloque `SUPABASE_SECRET_KEY` ou `SUPABASE_SERVICE_ROLE_KEY` no frontend.
