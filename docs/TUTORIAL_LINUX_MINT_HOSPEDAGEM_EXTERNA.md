# Tutorial para Linux Mint: publicar o Bestiário Cultural fora do Manus

> **Nota (atualizado):** este tutorial é de uma fase anterior e usa TiDB Cloud + Cloudinary + Render. O caminho atual e recomendado é **Vercel + Supabase** (banco Postgres e fotos no Supabase Storage) — siga [`docs/DEPLOY_VERCEL_SUPABASE.md`](DEPLOY_VERCEL_SUPABASE.md). Este tutorial continua funcional se você preferir Render, mas troque as instruções de TiDB/Cloudinary pelas de Supabase (banco e Storage) descritas naquele guia.

## Resultado esperado

Ao terminar este roteiro, o Bestiário ficará operando fora do Manus com o código no **GitHub**, o banco no **TiDB Cloud**, as novas fotos no **Cloudinary** e o site/API no **Render**. O aplicativo Android poderá apontar para o mesmo endereço externo, de modo que alterações feitas na administração sejam exibidas no navegador e no app.

> **Faça cada fase na ordem.** Não desative a versão atual antes de abrir o site novo, entrar no painel administrativo, salvar uma cultura de teste e conferir as imagens. Nenhuma opção gratuita garante funcionamento eterno, portanto o GitHub e os backups são partes obrigatórias do plano.

| Fase | Onde é feita | O que você terá ao final |
|---|---|---|
| 1. Preparar computador | Linux Mint | Terminal com Git, Node.js e pnpm instalados. |
| 2. Guardar o código | GitHub | Repositório particular e histórico de alterações. |
| 3. Criar banco | TiDB Cloud | Banco MySQL compatível com capítulos, fontes e páginas extras. |
| 4. Criar mídia | Cloudinary | URLs externas para fotos enviadas na administração. |
| 5. Publicar | Render | Site e painel em um endereço HTTPS externo. |
| 6. Gerar aplicativo | Android Studio | APK conectado ao endereço novo. |

## 1. Preparar o Linux Mint

Abra o **Terminal** com `Ctrl` + `Alt` + `T`. Primeiro, atualize a lista de programas e instale as ferramentas básicas. O Linux Mint é derivado de Ubuntu/Debian, portanto usa o gerenciador `apt`; a própria documentação do Git recomenda instalar o programa pelo gerenciador de pacotes da distribuição.[1]

```bash
sudo apt update
sudo apt install -y git curl unzip build-essential
```

Confira que o Git foi instalado:

```bash
git --version
```

### Instalar Node.js com NVM

Este projeto precisa de uma versão LTS moderna do Node.js. O método abaixo usa o **NVM**, que permite instalar a versão LTS sem depender da versão antiga que possa existir no repositório do Linux Mint. Baixe primeiro o instalador, leia-o se desejar e só então execute-o.

```bash
cd ~/Downloads
curl -fsSLO https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh
less install.sh
bash install.sh
rm install.sh
```

Feche o Terminal e abra-o novamente. Em seguida, instale e ative a versão LTS, habilite o Corepack e instale o `pnpm` usado pelo projeto.

```bash
nvm install --lts
nvm use --lts
node --version
npm --version
corepack enable
corepack prepare pnpm@10.4.1 --activate
pnpm --version
```

Se o comando `nvm` não existir após reabrir o Terminal, execute `source ~/.bashrc` e tente novamente. A página oficial de download do Node.js identifica a linha LTS como a escolha indicada para estabilidade.[2]

## 2. Extrair o projeto e criar o repositório GitHub

Baixe o arquivo `bestiario-cultural-github.zip` que foi preparado anteriormente. No Linux Mint, abra a pasta **Downloads**, clique com o botão direito no ZIP e escolha **Extrair aqui**. Para organizar o projeto, mova a pasta extraída para `Documentos`:

```bash
mkdir -p ~/Documentos/projetos
mv ~/Downloads/bestiario-cultural ~/Documentos/projetos/
cd ~/Documentos/projetos/bestiario-cultural
```

Se o nome da pasta extraída for diferente, use `ls ~/Downloads` para vê-lo e ajuste o comando `mv`.

No GitHub, clique no botão **+** no canto superior direito, escolha **New repository** e use o nome `bestiario-cultural`. Escolha a visibilidade **Private** inicialmente. Não marque as opções para criar README, `.gitignore` ou licença, pois o pacote já possui esses arquivos; o GitHub orienta não pré-preencher esses itens ao importar um projeto existente, para evitar conflitos.[3]

Clique em **Create repository** e copie a URL que aparece, no formato abaixo:

```text
https://github.com/SEU-USUARIO/bestiario-cultural.git
```

No Terminal, informe a identificação dos seus commits apenas uma vez. Depois, envie o projeto para GitHub, substituindo `SEU-USUARIO` pelo seu nome de usuário real.

```bash
git config --global user.name "Seu nome"
git config --global user.email "seu-email@exemplo.com"
git init
git add .
git status
git commit -m "Publicação externa inicial do Bestiário Cultural"
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/bestiario-cultural.git
git push -u origin main
```

Antes de confirmar `git add .`, observe a saída de `git status`: **não pode aparecer um arquivo chamado `.env`**. Esse arquivo conterá senhas e ficará somente no seu computador e no painel do Render.

## 3. Criar o banco de dados no TiDB Cloud

Abra [TiDB Cloud](https://tidbcloud.com/free-trial), crie sua conta e entre em **My TiDB**. Clique em **Create Resource**, mantenha o tipo **Starter**, escolha uma região e crie a instância. A documentação do TiDB descreve o Starter como o fluxo inicial e informa que ele utiliza protocolo compatível com MySQL.[4]

Na página da instância, clique em **Connect**, crie uma senha em **Generate Password** e selecione a opção de conexão **MySQL CLI**. Copie a URL de conexão completa. Guarde essa URL em um gerenciador de senhas; ela contém acesso ao banco.

Agora crie o arquivo local de configuração. No Terminal, ainda dentro da pasta do projeto, execute:

```bash
nano .env
```

Cole este modelo e preencha somente os valores entre `< >`. Para sair do Nano, use `Ctrl` + `O`, `Enter` e depois `Ctrl` + `X`.

```dotenv
DATABASE_URL=<COLE_A_URL_COMPLETA_DO_TIDB_AQUI>
JWT_SECRET=<COLE_UMA_CHAVE_ALEATORIA_AQUI>
ADMIN_LOCAL_USERNAME=<SEU_USUARIO_DE_ADMINISTRACAO>
ADMIN_LOCAL_PASSWORD=<SUA_SENHA_FORTE>
CLOUDINARY_CLOUD_NAME=<PREENCHER_NA_PROXIMA_ETAPA>
CLOUDINARY_API_KEY=<PREENCHER_NA_PROXIMA_ETAPA>
CLOUDINARY_API_SECRET=<PREENCHER_NA_PROXIMA_ETAPA>
```

Abra outro Terminal, gere uma chave segura e copie o resultado para `JWT_SECRET`:

```bash
openssl rand -base64 48
```

Para disponibilizar as variáveis desse arquivo no Terminal atual, execute estes comandos sempre que abrir uma nova sessão de trabalho:

```bash
set -a
source .env
set +a
```

Crie as tabelas — incluindo tabelas de páginas extras e galerias — e carregue os 20 capítulos iniciais:

```bash
pnpm install
pnpm db:push
node scripts/seedCultural.mjs
```

No TiDB Cloud, abra **SQL Editor** e execute esta consulta de conferência:

```sql
SELECT COUNT(*) AS capitulos FROM culturalChapters;
```

O resultado deverá indicar 20 capítulos iniciais. Se você já havia criado novas culturas ou páginas no site anterior, importe primeiro um backup dessas tabelas após as migrações: `culturalChapters`, `culturalSources`, `culturalExtraPages` e `culturalExtraPageImages`.

## 4. Criar a conta Cloudinary para fotos

Entre em [Cloudinary](https://cloudinary.com/users/register_free), crie uma conta e abra **Console Settings → API Keys**. Copie **Cloud name**, **API Key** e **API Secret**. A documentação oficial indica essa página para encontrar as credenciais e alerta para não expor o segredo da API no frontend ou em código público.[5]

Abra novamente o arquivo `.env`:

```bash
nano .env
```

Preencha as três variáveis `CLOUDINARY_*`, salve e carregue o arquivo outra vez:

```bash
set -a
source .env
set +a
pnpm external:check
```

Faça a primeira verificação local:

```bash
pnpm check
pnpm test
pnpm build
pnpm start
```

Abra [http://localhost:3000/admin](http://localhost:3000/admin), entre com o usuário e a senha escolhidos no `.env` e envie uma foto de teste. A URL nova deve começar com `https://res.cloudinary.com/`. O fluxo de upload do Cloudinary usa HTTPS e pode receber arquivos ou URLs públicas pelo SDK Node.js.[5]

### Migrar as imagens antigas

As imagens já cadastradas com endereços que começam por `/manus-storage/` não continuarão disponíveis fora da hospedagem atual. Antes de desligar a versão antiga, baixe as fotos originais ou obtenha-as novamente pela fonte licenciada indicada nos créditos. Depois, em cada cultura no painel novo, envie os arquivos ao Cloudinary e preencha **crédito**, **fonte** e **licença** antes de salvar.

| Imagem | Onde atualizar |
|---|---|
| Foto da cultura | Abra a cultura no painel, use **Enviar arquivo** em “Fotografia da cultura” e salve. |
| Foto de página extra | Abra a página extra, envie pelo menos duas imagens e preencha autoria, fonte, licença e texto alternativo de cada uma. |
| Foto de Wikimedia Commons | Preserve o autor e a licença; use a página do arquivo como fonte. |
| Capa do site | Publique no Cloudinary e altere a URL correspondente no código antes do próximo `git push`. |

## 5. Publicar no Render

Entre em [Render](https://render.com), autorize a conexão com GitHub e escolha **New → Blueprint**. Selecione o repositório `bestiario-cultural` e a ramificação `main`. O arquivo `render.yaml`, já incluso no pacote, preenche a configuração de publicação. A documentação do Render também permite criar um **Web Service** manual, escolhendo Node e definindo comandos próprios de build e inicialização.[6]

No formulário de variáveis de ambiente do Render, adicione as mesmas variáveis do arquivo `.env`. Não anexe nem envie o arquivo `.env`; copie os valores um a um pelo painel.

| Variável | Valor no Render |
|---|---|
| `NODE_ENV` | `production` |
| `DATABASE_URL` | URL integral copiada do TiDB Cloud |
| `JWT_SECRET` | Chave gerada com `openssl` |
| `ADMIN_LOCAL_USERNAME` | Usuário escolhido para o painel |
| `ADMIN_LOCAL_PASSWORD` | Senha forte escolhida para o painel |
| `CLOUDINARY_CLOUD_NAME` | Cloud name do Cloudinary |
| `CLOUDINARY_API_KEY` | API Key do Cloudinary |
| `CLOUDINARY_API_SECRET` | API Secret do Cloudinary |

Se usar o modo manual em vez de Blueprint, informe:

```text
Build Command: pnpm install --frozen-lockfile && pnpm build
Start Command: pnpm start
```

Clique em **Create Blueprint** ou **Create Web Service**. Ao término, o Render mostrará uma URL HTTPS, parecida com `https://bestiario-cultural.onrender.com`. Abra a URL em janela anônima, depois abra `/admin`, entre, altere uma cultura de teste, crie uma página extra com duas fotos e confirme a exibição no leitor. O Render faz publicação automática a cada `git push` na ramificação conectada.[6]

> No plano gratuito, o Render pode pausar o servidor quando não recebe visitas. O primeiro acesso após esse período pode ser mais lento; o banco e as fotos não serão perdidos se estiverem no TiDB e Cloudinary, e não no disco do servidor.

## 6. Gerar o APK no Linux Mint

Esta etapa é opcional para deixar o site online, mas necessária para atualizar o APK. Instale o Android Studio pela página oficial. Baixe o arquivo para Linux, extraia-o, mova-o para `/opt` e execute o script de inicialização; a documentação do Android Studio fornece instruções específicas para Linux e download do pacote `.tar.gz`.[7]

```bash
cd ~/Downloads
tar -xzf android-studio-*-linux.tar.gz
sudo mv android-studio /opt/android-studio
/opt/android-studio/bin/studio.sh
```

Na primeira abertura, aceite as licenças e deixe o assistente instalar o Android SDK, Platform Tools e Build Tools. Depois, feche o Android Studio e execute, dentro do projeto, substituindo a URL pelo endereço final do Render ou pelo seu domínio:

```bash
cd ~/Documentos/projetos/bestiario-cultural/android-wrapper
pnpm install
APP_ORIGIN=https://bestiario-cultural.onrender.com pnpm exec cap sync android
pnpm exec cap open android
```

O Android Studio abrirá o projeto Android. Para um teste, selecione **Build → Build APK(s)**. Para distribuição profissional, use **Build → Generate Signed Bundle / APK**, escolha **Android App Bundle** e crie uma chave de assinatura que deverá ser guardada com segurança. Uma alteração de conteúdo feita no painel não exige APK novo; uma alteração de código nativo, ícone ou domínio exige.

## 7. Como fazer atualizações depois

Para alterar capítulos, páginas extras ou fotos, use o painel em `https://SEU-ENDERECO/admin`. Para alterar código, use sempre esta sequência no Linux Mint:

```bash
cd ~/Documentos/projetos/bestiario-cultural
set -a && source .env && set +a
pnpm check
pnpm test
git add .
git commit -m "Descreva a alteração"
git push
```

O GitHub Actions validará o código e o Render publicará a versão nova automaticamente. Não faça ajustes diretamente no painel de arquivos do Render; mantenha o GitHub como a cópia principal.

## 8. Backup mensal obrigatório

Uma vez por mês, faça uma cópia do código, banco e imagens. No GitHub, confirme que todos os commits já foram enviados. No TiDB, use o SQL Editor ou uma ferramenta MySQL para exportar os dados. No Cloudinary, baixe as fotos originais ou mantenha-as organizadas também no computador/HD externo. Em seguida, copie sua pasta de projeto para um HD externo ou serviço de nuvem privado.

| Problema | Primeiro item a conferir |
|---|---|
| O site abre sem fotos | A URL ainda começa com `/manus-storage/`; mova essa imagem para Cloudinary. |
| Render mostra falha de build | Abra os logs, confirme `pnpm install --frozen-lockfile && pnpm build` e revise as variáveis. |
| Painel não aceita a senha | Confira `ADMIN_LOCAL_USERNAME`, `ADMIN_LOCAL_PASSWORD` e `JWT_SECRET` no Render. |
| Site abre sem capítulos | Verifique `DATABASE_URL`, execute migrações e a carga inicial. |
| APK abre o endereço antigo | Execute novamente `cap sync` com `APP_ORIGIN` da URL nova e gere outro APK. |

## Referências

[1]: https://git-scm.com/install/linux "Git — Install for Linux"
[2]: https://nodejs.org/en/download "Node.js — Download"
[3]: https://docs.github.com/en/repositories/creating-and-managing-repositories/creating-a-new-repository "GitHub Docs — Creating a new repository"
[4]: https://docs.pingcap.com/tidbcloud/tidb-cloud-quickstart "TiDB Cloud — Quick Start"
[5]: https://cloudinary.com/documentation/node_image_and_video_upload "Cloudinary — Node.js image and video upload"
[6]: https://render.com/docs/deploy-node-express-app "Render — Deploy a Node Express App"
[7]: https://developer.android.com/studio/install "Android Developers — Install Android Studio"
