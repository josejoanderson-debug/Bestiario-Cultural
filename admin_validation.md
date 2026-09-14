# Validação do fluxo administrativo

| Aspecto verificado | Evidência | Resultado |
| --- | --- | --- |
| Painel autenticado | Visualização responsiva de `/admin` com lista do acervo e formulário editorial completo | Aprovado |
| Inclusão e edição | `scripts/verifyAdminCrud.mjs` cria um registro temporário, edita seu título e remove o registro ao fim do teste | Aprovado após execução |
| Publicação pública | O mesmo script confere que um registro publicado aparece em `cultural.list` e desaparece após despublicação | Aprovado após execução |
| Visibilidade administrativa | O mesmo script confere que um registro despublicado continua disponível em `admin.listCultures` | Aprovado após execução |
| Atualização para visitantes | A página pública reconsulta o acervo a cada 30 segundos e quando a janela volta ao foco | Implementado |

> A execução integrada é reversível: o registro de validação e sua fonte são removidos automaticamente no bloco de limpeza, sem alterar o acervo editorial do projeto.

## Evidência de percurso admin → público

Em **19/08/2026**, foi criado pelo procedimento administrativo o registro temporário `validacao-admin-1787165835810`. A validação integrada confirmou sua criação, despublicação, edição e republicação por meio dos mesmos contratos tRPC usados pela interface. A navegação renderizada da página pública confirmou explicitamente o título **“Validação técnica atualizada”** e o resumo “Capítulo temporário para confirmar a publicação pública”; a captura integral registrou **21 resultados** no catálogo e a card ao final da grade, além da entrada correspondente em Créditos e referências. Depois desse registro visual verificável, o capítulo e sua fonte foram removidos pelo script `cleanupValidationRecord.mjs`, restaurando o acervo editorial para 20 capítulos.
