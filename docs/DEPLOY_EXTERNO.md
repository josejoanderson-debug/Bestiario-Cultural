# Publicação externa do Bestiário Cultural

## Antes de publicar

Copie `.env.example` para `.env` e preencha as credenciais do TiDB Cloud/MySQL e Cloudinary. Nunca envie `.env` ou chaves ao GitHub. Rode `pnpm check`, `pnpm test` e `pnpm build` localmente.

## GitHub

Crie um repositório, envie o projeto e proteja a ramificação `main`. O workflow `.github/workflows/ci.yml` executará verificação de tipos, testes e build em cada alteração.

## Banco e fotos

Crie um banco MySQL compatível com TLS, defina `DATABASE_URL` e aplique as migrações com `pnpm drizzle-kit migrate`. Depois, carregue o acervo inicial com `node scripts/seedCultural.mjs`. Configure uma conta Cloudinary e informe suas três credenciais; o painel administrativo então grava fotos em URLs HTTPS externas.

## Render

No Render, crie um Blueprint e selecione este repositório. O arquivo `render.yaml` informa os comandos corretos. Preencha os segredos solicitados no painel. Após o deploy, teste `/`, `/admin`, edição de cultura e envio de imagem. O Render usará sua porta definida automaticamente em `PORT`.

## Android

Defina a URL HTTPS do Render na variável `APP_ORIGIN`. Em seguida execute `APP_ORIGIN=https://seu-projeto.onrender.com pnpm exec cap sync android` dentro de `android-wrapper` e gere um APK assinado no Android Studio. O app consulta o mesmo servidor remoto e refletirá alterações editoriais sem uma nova instalação.
