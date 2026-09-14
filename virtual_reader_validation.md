# Validação do leitor virtual e do acesso administrativo local

| Fluxo | Evidência verificada | Resultado |
| --- | --- | --- |
| Página de abertura | A rota pública exibiu a abertura editorial do Bumba Meu Boi, com título, categoria, território e imagem de abertura. | Aprovado |
| Página de capítulo | A rota pública com `?pagina=1` exibiu o capítulo do Bumba Meu Boi com imagem principal, imagem de detalhe recortada e ilustração complementar na mesma página. | Aprovado |
| Navegação lateral | A regra usada pelo leitor foi coberta por teste automatizado: clique na metade esquerda retorna uma página e clique na metade direita avança uma página. | Aprovado |
| Administração bloqueada | A rota `/admin?acesso=local` exibiu a tela “Acesso restrito”, com campos de nome de acesso e senha e sem formulário editorial disponível. | Aprovado |
| Administração liberada | A rota `/admin` exibiu o painel “Acervo cultural”, com lista de registros, formulário de criação e controles de publicação. O teste de sessão local confirma que credenciais válidas liberam `admin.listCultures`. | Aprovado |

> As credenciais locais permanecem configuradas exclusivamente em variáveis seguras do servidor. A senha não é exposta no código, nas páginas ou nesta validação.

## Confirmação renderizada

| Rota | Estado confirmado pelo conteúdo renderizado |
| --- | --- |
| `/?pagina=1` | A página 2 do livro virtual exibiu o capítulo **Bumba Meu Boi**, a **imagem principal**, o **detalhe visual** e a ilustração complementar na mesma composição. |
| `/admin?acesso=local` | A interface exibiu **Acesso restrito**, os campos **Nome de acesso** e **Senha** e o botão **Entrar na administração**. |
| `/admin` após autenticação local | A interface confirmou **Acesso administrativo liberado**, identificou a **Administração local** e exibiu o painel **Acervo cultural** com 20 registros e formulário de criação. |
