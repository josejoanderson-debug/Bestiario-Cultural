# Publicar o Bestiário Cultural na Vercel + Supabase

Este guia parte do princípio de que você já tem:
- O repositório no GitHub (com o conteúdo deste projeto).
- Um projeto criado no [Supabase](https://supabase.com).
- Uma conta na [Vercel](https://vercel.com).

## 1. Banco de dados (Supabase)

1. No painel do Supabase, abra **Project Settings → Database → Connection string**.
2. Copie a string no modo **Connection pooling** (porta `6543`, "Transaction" pooler). É essa que vai para produção/Vercel. Guarde também a de conexão **direta** (porta `5432`) — ela é útil para rodar comandos administrativos do seu computador.
3. No seu computador, dentro da pasta do projeto:
   ```bash
   cp .env.example .env
   ```
   Preencha `DATABASE_URL` no `.env` com a connection string (pode usar a direta, porta 5432, para este passo local).
4. Instale as dependências e gere as tabelas no banco:
   ```bash
   corepack enable
   pnpm install
   pnpm db:push
   ```
   Isso cria as tabelas `users`, `culturalChapters`, `culturalSources`, `culturalExtraPages` e `culturalExtraPageImages` no seu projeto Supabase.
5. Carregue o acervo inicial (os 20 capítulos-base):
   ```bash
   pnpm db:seed
   ```

## 2. Imagens (Cloudinary)

O painel administrativo envia fotos direto do navegador para o Cloudinary — isso evita o limite de 4,5 MB por requisição que a Vercel aplica a Serverless Functions.

1. Crie uma conta gratuita em [cloudinary.com](https://cloudinary.com), se ainda não tiver.
2. No Dashboard, anote o **Cloud name** (aparece no topo).
3. Vá em **Settings → Upload → Upload presets → Add upload preset**.
   - **Signing Mode**: `Unsigned`.
   - Dê um nome ao preset (ex.: `bestiario-cultural`) e salve.
4. Ainda em Settings, anote também **API Key** e **API Secret** (usados apenas pela rota legada de upload via servidor, caso você venha a hospedar em outro lugar além da Vercel).

## 3. Variáveis de ambiente

No seu `.env` local e, em seguida, no painel da Vercel (**Project Settings → Environment Variables**), configure:

| Variável | Valor |
| --- | --- |
| `DATABASE_URL` | Connection string do Supabase (pooler, porta 6543, em produção) |
| `JWT_SECRET` | Uma string aleatória com 32+ caracteres (`openssl rand -base64 48`) |
| `ADMIN_LOCAL_USERNAME` | Usuário para acessar `/admin` |
| `ADMIN_LOCAL_PASSWORD` | Senha para acessar `/admin` |
| `CLOUDINARY_CLOUD_NAME` | Cloud name do Cloudinary |
| `CLOUDINARY_API_KEY` | API key do Cloudinary |
| `CLOUDINARY_API_SECRET` | API secret do Cloudinary |
| `VITE_CLOUDINARY_CLOUD_NAME` | Mesmo cloud name (exposto ao navegador) |
| `VITE_CLOUDINARY_UPLOAD_PRESET` | Nome do upload preset criado no passo 2 |

Antes de publicar, você pode validar tudo de uma vez:
```bash
pnpm external:check
```

## 4. Publicar na Vercel

1. Em [vercel.com/new](https://vercel.com/new), importe o repositório do GitHub.
2. A Vercel deve detectar o `vercel.json` do projeto automaticamente (build do cliente com Vite + função serverless em `/api`). Não é necessário alterar nenhuma configuração de build manualmente.
3. Cole as variáveis de ambiente da tabela acima em **Environment Variables** (ambiente "Production" — e "Preview"/"Development" também, se for usar branches).
4. Clique em **Deploy**.
5. Quando terminar, acesse a URL gerada. A página inicial (`/`) é o livro público; `/admin` é o painel administrativo (login com `ADMIN_LOCAL_USERNAME`/`ADMIN_LOCAL_PASSWORD`).

## 5. Depois do primeiro deploy

- **Adicionar/editar culturas e páginas de aprofundamento**: acesse `/admin`, faça login e use os formulários — inclusive para as até 40 páginas extras por cultura.
- **Corrigir uma foto que não carregou**: no Wikimedia Commons, arquivos raramente somem, mas se acontecer, basta pegar uma nova URL HTTPS (ou enviar um arquivo pelo painel) e colar no campo "URL da imagem" daquela cultura.
- **Domínio próprio**: em **Project Settings → Domains** na Vercel, adicione seu domínio e siga as instruções de DNS.
- **Atualizações futuras**: qualquer `git push` para a branch de produção (geralmente `main`) dispara um novo deploy automático na Vercel.

## Observações técnicas

- A função serverless (`/api/index.ts`) reaproveita o mesmo Express app usado pelo servidor tradicional (`server/_core/index.ts`), então o comportamento é idêntico ao rodar localmente com `pnpm dev`.
- Se preferir hospedar em um servidor Node tradicional (Render, VPS) em vez da Vercel, o `render.yaml` e os guias em `docs/guia_hospedagem_independente.md` e `docs/TUTORIAL_LINUX_MINT_HOSPEDAGEM_EXTERNA.md` continuam funcionando — nesse caso, a rota de upload via servidor (`admin.uploadPhoto`) também está disponível como alternativa ao upload direto do navegador.
- `pnpm test` e `pnpm check` continuam validando o projeto localmente antes de cada deploy; o GitHub Actions (`.github/workflows/ci.yml`) já roda isso a cada push/PR.
