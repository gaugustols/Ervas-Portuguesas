# Segurança · atualização das fichas · 22/10/2026

Estado: PASSA na verificação automática das pastas compiladas `public/app` e `public/pro`, sem achados. Não é teste de invasão nem revisão clínica.

- A publicação continua limitada ao conteúdo exportado pelo script existente. Fontes, documentação, testes e skills não são adicionados à pasta pública. Nenhuma configuração Git/Vercel alterada.
- Novos textos renderizados com nós de texto; sem HTML arbitrário, `eval`, serviços externos, recolha de dados ou dependências novas. As fontes externas usam HTTPS e `noopener noreferrer`.
- `noindex,nofollow` e ausência de Pixel/analytics nos webapps preservados. O MVP mantém acesso público sem login por decisão prévia do utilizador; não há validação de compra ou revogação.
- IDs das plantas e chave de armazenamento preservados, assim como a separação do conteúdo PRO. O teste confirma os favoritos, o progresso e o rascunho existentes.
- Prévia: conteúdo e 53 recursos por plano com HTTP 200; tentativas de acesso às fontes, contexto, AGENTS e configuração Git retornam 404.
- Não houve varrimento automático anterior a esta edição nesta sessão. O resultado acima refere-se à versão compilada após a alteração. Verificação pública após push deve confirmar o commit e o conteúdo publicado; sucesso local não prova deploy.
- Navegador indisponível: apresentação visual, console e responsividade não verificados num navegador real nesta sessão. Nenhuma alteração de autenticação ou permissões foi feita.
