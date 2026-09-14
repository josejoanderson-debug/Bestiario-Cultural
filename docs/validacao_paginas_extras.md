# Registro de validação — páginas extras e abrangência brasileira

- A página pública carregou com a nova capa em xilogravura e a apresentação “Arquivo vivo · Brasil”, sem limitar o Bestiário à Paraíba.
- O leitor público continuou a carregar suas páginas-base e a contagem inicial de 80 páginas foi preservada quando não há aprofundamentos cadastrados.
- Durante a inspeção do login administrativo em `http://127.0.0.1:3000/admin`, identificou-se que o cookie local usava `SameSite=None` em HTTP, combinação rejeitada por navegadores. A configuração foi corrigida para `SameSite=Lax`, mantendo `Secure` condicionado à presença de HTTPS.
- A área administrativa passou a listar os 20 capítulos persistidos e exibiu, ao criar uma página extra, os campos de marcador, título, texto e duas galerias documentadas obrigatórias. O painel também oferece controle para incluir uma terceira imagem, reordenar páginas e removê-las.
- A validação automatizada cobre o bloqueio de páginas com menos de duas imagens, a montagem ordenada de páginas e galerias a partir dos registros persistidos e a paginação variável no leitor público.
- Uma página extra temporária foi gravada no capítulo Bumba Meu Boi com duas imagens e créditos, aberta publicamente em `?pagina=4` e confirmada no leitor com título, texto, galeria e atribuições visíveis. A rotina de limpeza foi executada em seguida, restaurando o acervo sem conteúdo de teste.
