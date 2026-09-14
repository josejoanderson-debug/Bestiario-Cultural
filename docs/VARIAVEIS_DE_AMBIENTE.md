# Variáveis de ambiente para hospedagem externa

Cadastre estas variáveis no provedor de hospedagem. Os valores nunca devem entrar no GitHub.

| Variável | Obrigatória | Finalidade |
|---|---:|---|
| `NODE_ENV` | Sim | Use `production` no servidor publicado. |
| `PORT` | Não | O provedor normalmente fornece este valor automaticamente. |
| `DATABASE_URL` | Sim | URL TLS do banco MySQL/TiDB externo. |
| `JWT_SECRET` | Sim | Chave longa e aleatória para assinar a sessão administrativa. |
| `ADMIN_LOCAL_USERNAME` | Sim | Nome de acesso do painel administrativo. |
| `ADMIN_LOCAL_PASSWORD` | Sim | Senha exclusiva e forte do painel administrativo. |
| `CLOUDINARY_CLOUD_NAME` | Sim | Identificação da conta Cloudinary. |
| `CLOUDINARY_API_KEY` | Sim | Chave pública da API Cloudinary. |
| `CLOUDINARY_API_SECRET` | Sim | Segredo da API Cloudinary. |

Para gerar um `JWT_SECRET` localmente, use `openssl rand -base64 48`. Em Render, GitHub Actions e Android, somente o servidor precisa receber essas variáveis; o aplicativo web e o APK nunca devem conter `API_SECRET`, senha ou conexão do banco.
