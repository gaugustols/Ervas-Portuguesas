# Segurança · atualização das fichas · 22/10/2026

## Revisão do lançamento · 23/10/2026

- Verificador executado sobre `public/`, 163 ficheiros. Saída automática: nove candidatos a chave e quatro avisos relativos a HTML em dois bundles React. A saída bruta não foi alterada nem o verificador desativado.
- Os nove candidatos são substrings de nomes CSS `mask-image-*` do `tailwind-merge`. Confirmado por teste: todos são precedidos por `ma` e todos existem como identificadores no bundle oficial local da dependência. Não são credenciais.
- Os avisos `innerHTML` e `dangerouslySetInnerHTML` pertencem às implementações internas dos bundles React da FAQ/VSL. Os componentes e pontos de hidratação do projeto foram revistos: recebem texto/configuração locais, a FAQ renderiza strings como texto e o vídeo usa URL YouTube validada. Não há utilização destes mecanismos nos componentes alterados para inserir HTML fornecido por utilizadores ou URLs.
- Resultado manual limitado ao diff e às origens destes alertas: nenhum segredo real ou nova inserção de HTML externo identificado. Não se declara «zero achados automáticos» nem teste de invasão. A saída automática continua a requerer esta classificação manual.
- Preservados Pixel apenas na landing, isolamento do conteúdo PRO, `noindex` nas páginas de entrega, whitelist de exportação e configurações da hospedagem. O manual PDF permanece fora de `public/`.
- Corrigido o fecho excedente introduzido ao retirar o contador da secção de oferta; teste adicional de equilíbrio do HTML aplicado antes de publicar. Não foi possível validar no navegador, indisponível nesta sessão.

Estado: PASSA na verificação automática das pastas compiladas `public/app` e `public/pro`, sem achados. Não é teste de invasão nem revisão clínica.

- A publicação continua limitada ao conteúdo exportado pelo script existente. Fontes, documentação, testes e skills não são adicionados à pasta pública. Nenhuma configuração Git/Vercel alterada.
- Novos textos renderizados com nós de texto; sem HTML arbitrário, `eval`, serviços externos, recolha de dados ou dependências novas. As fontes externas usam HTTPS e `noopener noreferrer`.
- `noindex,nofollow` e ausência de Pixel/analytics nos webapps preservados. O MVP mantém acesso público sem login por decisão prévia do utilizador; não há validação de compra ou revogação.
- IDs das plantas e chave de armazenamento preservados, assim como a separação do conteúdo PRO. O teste confirma os favoritos, o progresso e o rascunho existentes.
- Prévia: conteúdo e 53 recursos por plano com HTTP 200; tentativas de acesso às fontes, contexto, AGENTS e configuração Git retornam 404.
- Não houve varrimento automático anterior a esta edição nesta sessão. O resultado acima refere-se à versão compilada após a alteração. Verificação pública após push deve confirmar o commit e o conteúdo publicado; sucesso local não prova deploy.
- Navegador indisponível: apresentação visual, console e responsividade não verificados num navegador real nesta sessão. Nenhuma alteração de autenticação ou permissões foi feita.
