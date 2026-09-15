# Publicar o Bestiário Cultural na Vercel + Supabase

Este guia parte do princípio de que você já tem:
- O repositório no GitHub (com o conteúdo deste projeto).
- Um projeto criado no [Supabase](https://supabase.com).
- Uma conta na [Vercel](https://vercel.com).

O Supabase cobre **tudo**: banco de dados (Postgres) e armazenamento das fotos (Storage). Não é necessário nenhum outro serviço externo.

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
5. Carregue o acervo inicial (os 20 capítulos-base):
   ```bash
   pnpm db:seed
   ```

## 2. Imagens (Supabase Storage)

O painel administrativo envia fotos direto do navegador para um bucket do Supabase — isso evita o limite de 4,5 MB por requisição que a Vercel aplica a Serverless Functions.

1. No painel do Supabase, vá em **Storage** (menu lateral) → **New bucket**.
2. Nome do bucket: `cultural-photos`. Marque **Public bucket**. Crie.
3. Vá em **SQL Editor** (menu lateral) → **New query**, cole e execute:
   ```sql
   create policy "Leitura pública das fotos culturais"
   on storage.objects for select
   to public
   using (bucket_id = 'cultural-photos');

   create policy "Envio público das fotos culturais"
   on storage.objects for insert
   to public
   with check (bucket_id = 'cultural-photos');
   ```
   Isso permite que qualquer pessoa **leia** os arquivos (necessário para as fotos aparecerem no site) e **envie** novos arquivos para dentro desse bucket específico (o mesmo modelo de confiança de um "unsigned upload preset" do Cloudinary — quem usa o painel administrativo do site é quem decide o que sobe; não há como listar, sobrescrever ou apagar arquivos de outra pessoa com essas políticas).
4. Em **Project Settings → API**, anote a **Project URL** e a **anon public key**.

## 3. Variáveis de ambiente

No seu `.env` local e, em seguida, no painel da Vercel (**Project Settings → Environment Variables**), configure:

| Variável | Valor |
| --- | --- |
| `DATABASE_URL` | Connection string do Supabase (pooler, porta 6543, em produção) |
| `JWT_SECRET` | Uma string aleatória com 32+ caracteres (`openssl rand -base64 48`) |
| `ADMIN_LOCAL_USERNAME` | Usuário para acessar `/admin` |
| `ADMIN_LOCAL_PASSWORD` | Senha para acessar `/admin` |
| `VITE_SUPABASE_URL` | Project URL do passo 2 |
| `VITE_SUPABASE_ANON_KEY` | anon public key do passo 2 |

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

## 5. Se algo der errado: como diagnosticar

Primeiro, abra `SUA-URL/api/health` diretamente no navegador. Essa rota não depende do banco — só confirma que a função está no ar e mostra quais variáveis de ambiente ela enxerga:
```json
{
  "ok": true,
  "url": "/api/health",
  "hasDatabaseUrl": true,
  "hasJwtSecret": true,
  "hasAdminCredentials": true,
  "hasSupabaseStorageConfig": true
}
```
- Se essa página **não carregar** (erro 404 da própria Vercel, não um JSON): o problema é de roteamento/deploy — confira se o build terminou sem erros em **Deployments → (seu deploy) → Building**.
- Se carregar mas algum campo `has...` estiver `false`: a variável de ambiente correspondente não foi configurada (ou foi configurada só para "Preview", não "Production") — revise em **Project Settings → Environment Variables** e faça um novo deploy.
- Se todos os campos forem `true` mas o site mesmo assim mostrar erro ao carregar as culturas ou ao salvar no painel: abra **Deployments → (seu deploy) → Functions** e veja o log da função `/api` no momento do erro — toda falha (inclusive de conexão com o banco) é registrada ali com a mensagem original, não só um genérico "erro 500".

## 6. Depois do primeiro deploy

- **Adicionar/editar culturas e páginas de aprofundamento**: acesse `/admin`, faça login e use os formulários — inclusive para as até 40 páginas extras por cultura.
- **Corrigir uma foto que não carregou**: no Wikimedia Commons, arquivos raramente somem, mas se acontecer, basta pegar uma nova URL HTTPS (ou enviar um arquivo pelo painel) e colar no campo "URL da imagem" daquela cultura.
- **Domínio próprio**: em **Project Settings → Domains** na Vercel, adicione seu domínio e siga as instruções de DNS.
- **Atualizações futuras**: qualquer `git push` para a branch de produção (geralmente `main`) dispara um novo deploy automático na Vercel.

## Observações técnicas

- A função serverless (`/api/index.ts`) reaproveita o mesmo Express app usado pelo servidor tradicional (`server/_core/index.ts`), então o comportamento é idêntico ao rodar localmente com `pnpm dev`.
- A conexão com o Postgres do Supabase exige TLS; isso já é feito automaticamente pelo projeto (`ssl: "require"` em `server/db.ts`) — não é preciso adicionar `?sslmode=require` na `DATABASE_URL` manualmente, embora não tenha problema se você adicionar.
- Criar ou editar uma cultura roda em uma única transação de banco: se qualquer etapa falhar (capítulo, fontes ou páginas extras), nada é salvo pela metade.
- Se a conexão com o banco falhar, a leitura pública (home) recua automaticamente para o acervo estático embutido no código, em vez de derrubar o site inteiro. O painel administrativo, por outro lado, sempre mostra o erro real — não faz sentido "fingir" que uma edição foi salva.
- Se preferir hospedar em um servidor Node tradicional (Render, VPS) em vez da Vercel, o `render.yaml` continua funcionando. Os guias em `docs/guia_hospedagem_independente.md` e `docs/TUTORIAL_LINUX_MINT_HOSPEDAGEM_EXTERNA.md` foram escritos numa fase anterior do projeto (mencionam Cloudinary) — a parte de banco de dados e deploy continua válida, mas para as fotos, siga a seção 2 deste guia (Supabase Storage) em vez das instruções de Cloudinary desses dois documentos.
- `pnpm test` e `pnpm check` continuam validando o projeto localmente antes de cada deploy; o GitHub Actions (`.github/workflows/ci.yml`) já roda isso a cada push/PR.
