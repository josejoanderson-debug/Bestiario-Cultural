# Guia de hospedagem independente do Bestiário Cultural

> **Nota (atualizado):** este documento é de uma fase anterior do projeto e menciona TiDB/MySQL e Cloudinary. O banco de dados atual é **Postgres** (Supabase) e as imagens ficam no **Supabase Storage**. Para o caminho principal e testado de publicação, siga [`docs/DEPLOY_VERCEL_SUPABASE.md`](DEPLOY_VERCEL_SUPABASE.md). O restante deste guia (arquitetura geral, backups, plano de migração) continua válido como referência.

## Objetivo e resposta direta

É possível deixar o Bestiário Cultural fora da hospedagem do Manus e manter **site, área administrativa, banco de dados, fotos e aplicativo Android** funcionando com serviços externos. No entanto, nenhum serviço gratuito de terceiros pode ser prometido como gratuito ou disponível “para sempre”: planos e limites podem mudar, e uma conta pode ser suspensa se ultrapassar a franquia. A estratégia realmente duradoura é manter o **código em um repositório GitHub**, o **banco exportável**, as **imagens em armazenamento externo** e backups periódicos. Assim, trocar de provedor passa a ser uma migração, e não uma reconstrução da obra.

> **Recomendação para este projeto:** comece com **GitHub + Render + TiDB Cloud Starter + Cloudinary**. É a rota mais simples para preservar a arquitetura Node/Express + MySQL já existente. O site pode ficar sem custo enquanto permanecer dentro das franquias, mas o servidor gratuito do Render dorme após inatividade; portanto, há uma espera inicial de aproximadamente um minuto na primeira abertura após o repouso.[1]

| Camada | Serviço recomendado | Função | Custo inicial e ressalvas |
|---|---|---|---|
| Código e histórico | GitHub | Guarda o projeto e permite recuperação/atualização | Gratuito para repositórios pessoais. |
| Site, API e administração | Render Web Service | Executa o servidor Node/Express e entrega o React compilado | Há plano gratuito, porém o serviço inativo é suspenso após 15 minutos.[1] |
| Banco de dados | TiDB Cloud Starter | Mantém capítulos, fontes, fotos cadastradas e publicação | Compatível com MySQL; a franquia informada inclui 5 GiB e 50 milhões de RUs mensais.[2] |
| Fotos enviadas pelo admin | Cloudinary Free | Armazena e distribui imagens por CDN | Plano gratuito sem cartão, sujeito a 25 créditos mensais.[3] |
| Domínio | Subdomínio do Render inicialmente; domínio próprio depois | Endereço público do site | O subdomínio é grátis. Um domínio próprio normalmente é pago anualmente. |
| Aplicativo | Capacitor/Android Studio | Empacota o leitor como APK | O APK precisa ser recompilado apenas ao trocar a URL do servidor ou alterar código nativo. |

## O que será alterado no código

O projeto atual usa recursos específicos do ambiente Manus. Antes da primeira publicação externa, é necessário substituir esses pontos por equivalentes comuns de mercado. Isso não muda a aparência, o leitor, o catálogo ou o painel administrativo; apenas torna a infraestrutura independente.

| Arquivo ou recurso atual | Situação na hospedagem externa | Ação necessária |
|---|---|---|
| `server/_core/oauth.ts` e `registerOAuthRoutes` | Login Manus não existe fora do Manus | Remover a rota de OAuth do Manus e manter o login local de administrador já presente. |
| `server/_core/env.ts` | Lê variáveis fornecidas pela plataforma | Trocar por `process.env` validado com Zod ou `dotenv`. |
| `server/storage.ts` e `/manus-storage/` | Usam o armazenamento interno atual | Reescrever para enviar imagens ao Cloudinary ou ao Cloudflare R2. |
| URLs `/manus-storage/...` nos créditos e fotos | Não existirão fora do Manus | Migrar cada arquivo para o novo provedor e atualizar suas URLs no registro de imagens. |
| `DATABASE_URL` atual | Aponta para o banco gerenciado atual | Substituir pela string TLS do TiDB Cloud. |
| `android-wrapper/capacitor.config.json` | Aponta para o endereço publicado atual | Atualizar `server.url` para o novo endereço HTTPS e gerar um novo APK. |

## Passo 1 — Criar a cópia definitiva no GitHub

Crie uma conta em [GitHub](https://github.com) e um repositório privado chamado, por exemplo, `bestiario-cultural`. No painel do projeto, use a opção de exportar o código para o GitHub ou faça o download do ZIP e envie os arquivos para esse repositório. Não envie arquivos `.env`, chaves, senhas, certificados, a pasta `node_modules` nem APKs de depuração.

Depois de enviar, confirme que o repositório contém `client/`, `server/`, `shared/`, `drizzle/`, `scripts/`, `package.json` e `pnpm-lock.yaml`. O GitHub passa a ser a cópia principal e permite restaurar o projeto mesmo que qualquer plataforma de hospedagem deixe de existir.

## Passo 2 — Criar o banco de dados no TiDB Cloud

Abra uma conta no [TiDB Cloud](https://tidbcloud.com/free-trial/) e crie uma instância **Starter**. O TiDB Cloud Starter é MySQL-compatível e não exige cartão enquanto a utilização permanecer na franquia.[2] Escolha uma região próxima do público sempre que possível e, na área **Connect**, copie a URL de conexão segura.

Crie uma variável local temporária chamada `DATABASE_URL` com essa conexão. Em uma cópia local do repositório, execute o esquema em um banco novo e, em seguida, carregue o acervo:

```bash
pnpm install
pnpm drizzle-kit generate
pnpm drizzle-kit migrate
node scripts/seedCultural.mjs
```

Se o banco atual já recebeu adições feitas na área administrativa, exporte também seus dados antes da troca. A forma mais segura é gerar um backup SQL com tabelas e registros de `culturalChapters` e `culturalSources`, revisar o arquivo e importá-lo na instância TiDB. Faça primeiro uma importação de teste, compare a quantidade de capítulos e fontes e só então aponte o site novo para esse banco.

## Passo 3 — Mover as fotos para um armazenamento independente

Para a rota mais simples, crie uma conta no [Cloudinary](https://cloudinary.com/users/register_free). O plano Free traz API, upload e CDN sem cartão, dentro da franquia mensal de créditos.[3] No painel, copie `Cloud name`, `API Key` e `API Secret`.

No código, substitua o conteúdo de `server/storage.ts` por uma implementação do SDK do Cloudinary. O endpoint administrativo deve continuar recebendo o arquivo, mas deverá enviá-lo ao Cloudinary e guardar a URL HTTPS retornada em `photoUrl`. As variáveis necessárias no servidor serão:

```text
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

Migre as imagens já publicadas. Para cada item do `shared/photoLedger.ts`, baixe o arquivo de origem ou use o arquivo que você possui, envie-o ao Cloudinary e substitua a antiga URL `/manus-storage/...` pela URL CDN. Preserve sempre `photoCredit`, `photoSourceUrl` e `photoLicense`; hospedagem não substitui atribuição e licença.

Como alternativa, o **Cloudflare R2** oferece 10 GB-mês, 1 milhão de operações de escrita e 10 milhões de leituras gratuitas por mês, sem cobrança de tráfego de saída.[4] Ele é uma boa escolha se você preferir um armazenamento S3 compatível, mas é um pouco mais técnico de configurar do que o Cloudinary.

## Passo 4 — Remover dependências do ambiente atual

Crie uma ramificação no GitHub chamada `migracao-hospedagem` e faça essas alterações nela. Em `server/_core/index.ts`, remova `registerOAuthRoutes(app)` e `registerStorageProxy(app)`. Mantenha `express.json`, o middleware tRPC e `serveStatic`. O login local de administrador, com usuário e senha definidos por variáveis de ambiente, continua sendo a forma mais simples de gerir o acervo fora do Manus.

Crie ou adapte uma configuração de ambiente que leia apenas as chaves externas. No Render, as mesmas chaves devem ser cadastradas como segredos, nunca colocadas no GitHub:

```text
NODE_ENV=production
DATABASE_URL=<conexão TLS do TiDB Cloud>
JWT_SECRET=<texto aleatório longo; gere com openssl rand -base64 48>
ADMIN_LOCAL_USERNAME=<nome de administrador>
ADMIN_LOCAL_PASSWORD=<senha forte e exclusiva>
CLOUDINARY_CLOUD_NAME=<valor do Cloudinary>
CLOUDINARY_API_KEY=<valor do Cloudinary>
CLOUDINARY_API_SECRET=<valor do Cloudinary>
```

Também remova a dependência `vite-plugin-manus-runtime` e qualquer variável `VITE_*` que seja exclusiva do ambiente antigo. Faça uma revisão do `server/_core/context.ts`, `server/_core/cookies.ts` e `server/_core/env.ts` para assegurar que não haja referência a OAuth ou segredos do Manus. Antes de publicar, rode:

```bash
pnpm check
pnpm test
pnpm build
NODE_ENV=production PORT=3000 pnpm start
```

Abra `http://localhost:3000`, entre em `/admin`, edite uma cultura, envie uma imagem e confirme que a foto aparece no leitor e no catálogo. Essa validação local deve acontecer antes de alterar o endereço público.

## Passo 5 — Publicar site completo no Render

Crie uma conta no [Render](https://dashboard.render.com/register), clique em **New → Web Service** e conecte o repositório GitHub. Selecione a ramificação `main` somente depois de concluir e testar a migração. O Render documenta a publicação de aplicações Node/Express com comandos de construção e inicialização definidos pelo próprio projeto.[5]

Use os valores abaixo.

| Campo no Render | Valor |
|---|---|
| Runtime | Node |
| Branch | `main` |
| Build Command | `pnpm install --frozen-lockfile && pnpm build` |
| Start Command | `pnpm start` |
| Health Check Path | `/` |
| Variáveis de ambiente | Todas as variáveis listadas no passo 4 |

Após o primeiro deploy, o Render fornecerá uma URL HTTPS como `https://bestiario-cultural.onrender.com`. Teste o site em outra rede ou aba anônima, teste o painel administrativo e confirme que as alterações sobrevivem a um novo deploy. A cada `git push` na ramificação configurada, o Render recompila e publica a versão nova.[5]

> **Limitação importante:** o Render Free suspende o servidor após 15 minutos sem visitas, reinicia quando alguém abre o endereço e pode levar cerca de um minuto. Não armazene banco, fotos ou qualquer arquivo importante no disco do Render, pois ele é efêmero.[1]

## Passo 6 — Ajustar e recompilar o aplicativo Android

Abra `android-wrapper/capacitor.config.json` e substitua a URL antiga:

```json
{
  "server": {
    "url": "https://bestiario-cultural.onrender.com",
    "cleartext": false
  }
}
```

Com Android Studio e SDK Android instalados, execute:

```bash
cd android-wrapper
pnpm install
pnpm exec cap sync android
cd android
./gradlew assembleRelease
```

Para distribuir publicamente, gere uma chave de assinatura e use **Build → Generate Signed Bundle / APK** no Android Studio. O APK de depuração não é indicado para distribuição final. Como o aplicativo abre a URL HTTPS do servidor, capítulos, fotos, publicação e alterações feitas pelo admin aparecem no app na próxima abertura ou atualização da tela, sem necessidade de publicar um novo APK para cada conteúdo novo. Um novo APK só é necessário quando mudar o código nativo, ícone, permissões ou endereço do servidor.

## Passo 7 — Domínio, backup e manutenção

Comece com o subdomínio gratuito do Render. Se quiser um endereço próprio, compre um domínio quando puder e configure-o no Render; certificados TLS são fornecidos pela plataforma para domínios conectados.[1] Não é obrigatório comprar domínio para o site permanecer acessível.

Faça uma rotina mensal de backup. Exporte o banco para SQL, baixe as fotos originais para uma pasta organizada e mantenha uma cópia do repositório em outro lugar além do GitHub. Ative alertas de uso no TiDB Cloud, Render e Cloudinary. Caso uma franquia seja excedida ou o plano gratuito mude, o código e os dados estarão prontos para outro provedor.

| Frequência | Ação de manutenção |
|---|---|
| A cada alteração de código | `pnpm check`, `pnpm test`, `git commit` e `git push`. |
| Mensalmente | Exportar banco SQL e conferir utilização de banco, fotos e hospedagem. |
| A cada nova foto | Verificar licença, autor e link de origem antes de publicar. |
| A cada seis meses | Testar a restauração do backup em um banco vazio. |
| Quando trocar de domínio | Atualizar `server.url` no Capacitor e gerar APK assinado novo. |

## Decisão recomendada

Para colocar o Bestiário no ar rapidamente e completo, use a pilha **Render + TiDB + Cloudinary**. Ela exige somente uma migração de código para remover OAuth/armazenamento específicos e preserva o banco MySQL, Express, tRPC, painel e APK atuais. Para disponibilidade sem pausa inicial e garantia operacional mais forte, será necessário contratar ao menos um serviço pago ou manter um servidor próprio; isso não é uma falha do projeto, mas uma limitação normal de planos gratuitos.

Uma alternativa mais independente no longo prazo é reescrever o backend para **Cloudflare Workers + D1 + R2**. O Cloudflare Pages oferece ativos estáticos gratuitos e ilimitados, e a franquia gratuita do Workers soma até 100 mil requisições diárias para Functions.[6] Contudo, essa alternativa demanda conversão do servidor Express/tRPC e do banco MySQL, portanto não é a rota fácil para a versão atual.

## Referências

[1]: https://render.com/docs/free "Render — Deploy for Free"
[2]: https://docs.pingcap.com/tidbcloud/select-cluster-tier/ "TiDB Cloud — Select Your Plan"
[3]: https://cloudinary.com/pricing "Cloudinary — Pricing and Plans"
[4]: https://developers.cloudflare.com/r2/pricing/ "Cloudflare R2 — Pricing"
[5]: https://render.com/docs/deploy-node-express-app "Render — Deploy a Node/Express App"
[6]: https://developers.cloudflare.com/pages/functions/pricing/ "Cloudflare Pages Functions — Pricing"
