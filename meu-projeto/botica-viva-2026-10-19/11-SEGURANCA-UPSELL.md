# Verificação do Upsell 1 · 23/10/2026

## Escopo

Nova página `upsell-1.html`, respetivo gerador, configuração, estilos e integração na lista de ficheiros exportados. As páginas existentes, a aplicação e o manual não são objeto de uma nova auditoria integral nesta etapa. Skills utilizadas: checkout-upsell e auditoria-seguranca.

## Resultado local

- `check:upsell`: HTML estático, estados de compra desativada/configurada, URLs seguras, recusa, isolamento de query strings, noindex e exportação aprovados. Duas folhas de estilo e duas fontes verificadas por HTTP.
- Verificador da skill checkout-upsell sobre uma cópia dos cinco recursos da nova página: zero falhas e um aviso para «garantido». Revisto: o termo está na copy fornecida pelo utilizador, sobre o acesso à compra anterior, não numa promessa de cura ou retorno financeiro. A página não valida pagamentos.
- Auditor da skill auditoria-seguranca sobre os mesmos cinco recursos: zero achados e zero críticos. Isto não equivale a teste de invasão ou auditoria do restante site.
- CSP no HTML: sem scripts, formulários ou origens remotas; CSS e fontes locais. `noindex, nofollow, noarchive` e política de referência `no-referrer`.
- Nenhuma credencial, recolha de dados, cookie novo ou ligação direta para o conteúdo pago da horta. Sem novas bibliotecas.
- Exportação continua por lista explícita para `public/`; só o novo HTML e CSS são acrescentados ao site público. Templates, configuração, documentos e scripts de desenvolvimento não são exportados.
- O checkout adicional está vazio por indicação do utilizador. O botão é nativamente desativado, sem `href` fictício. O checkout configurado no futuro deve usar HTTPS e o domínio Hotmart esperado; nenhum valor da URL do visitante é interpretado como autorização ou destino.
- A recusa permanece disponível sem JavaScript e leva ao seletor dos planos existentes. Não é confirmação de pagamento nem validação de plano.

## Limites e ativação

Navegador indisponível: não foi feita validação visual em telemóvel/desktop nem inspeção de console. As regras de CSS usam colunas flexíveis, margens e quebra responsiva; não há largura fixa a impor overflow aos cards.

O preço de referência €29,90, a oferta de €9,50 e a linha de garantia/acesso foram fornecidos pelo utilizador. Não foi validado um histórico independente do preço de referência. O complemento e o checkout ainda têm de existir antes de ativar a compra. Recursos Hotmart de um clique, pagamento e entrega não foram verificados nesta etapa.

Não foram alteradas configurações de GitHub ou Vercel. Confirmar o deployment correspondente ao commit e os recursos públicos após o push; o resultado remoto deve ser reportado na conclusão da tarefa.

## Upsell 2 — verificação adicional em 23/10/2026

- Nova página `upsell-2.html`, gerada a partir de `templates/upsell-2.html`, com a mesma CSP, noindex e os quatro recursos locais do Upsell 1. Sem alteração dos estilos partilhados e sem novos scripts no navegador.
- Preço de €7,90 confirmado explicitamente pelo utilizador no destaque e no CTA; referência de €17,90 fornecida na copy. Teste impede a reaparição de €4,90 na página.
- `UPSELL2_CHECKOUT_URL` vazio: botão de compra desativado. Recusa para `https://consumer.hotmart.com/`, permitindo consultar o plano de sete dias sem inventar uma ligação de entrega. Não é redirecionamento de pagamento nem prova de compra.
- O gerador passou a partilhar a renderização das duas páginas. O HTML do Upsell 1 continua idêntico após o build, incluindo a sua recusa para a página de obrigado. A lista de destinos de recusa contém apenas o seletor existente e as compras Hotmart, com caminhos fixos e sem query strings; entradas arbitrárias continuam rejeitadas.
- `check:upsell`: estados de compra, preço, destinos, query strings, exportação e HTTP das duas páginas aprovados. `check:thank-you` sem navegador aprovado. Sintaxe dos JavaScripts modificados e diff verificados.
- Verificador da skill checkout-upsell sobre uma cópia dos cinco recursos da página: zero falhas e zero avisos. Auditor de segurança sobre os mesmos recursos: zero achados e zero críticos. Não é uma nova auditoria integral do restante site.
- Confirmado que landing, Upsell 1, templates/estilos anteriores, obrigado, versões Básico/PRO e manual PDF foram preservados. Nenhum checkout real foi chamado ou pagamento realizado.
- Navegador indisponível: sem validação visual de responsividade ou console. Avaliação interna de fidelidade e consistência técnica: 8,5/10; não é nota de conversão.
- A copy pressupõe aquisição do Upsell 1. Na ativação futura, configurar a passagem após a aprovação dessa compra, e não após a recusa. Recursos Hotmart de um clique e entrega continuam por verificar; downsell e oferta final aguardam as copys do utilizador.

## Downsell — verificação adicional em 23/10/2026

- Nova página `downsell.html`, gerada a partir de `templates/downsell.html`, com a copy fornecida para «O Meu Primeiro Vaso»: referência €7,90 e preço/CTA €4,90. Sem alteração dos dois upsells ou dos estilos partilhados.
- Configuração independente `DOWNSELL_CHECKOUT_URL` vazia; botão nativamente desativado até receber o checkout próprio. Recusa disponível sem JavaScript para o seletor do plano já adquirido em `/obrigado.html`.
- Mantidos noindex, CSP restritiva, política de referência e fontes locais. Nenhum script no navegador, formulário, credencial, recolha adicional de dados ou ligação direta para o novo entregável.
- Geração e exportação aprovadas. `check:upsell` testa as três páginas, incluindo o downsell com query strings e os estados de compra vazia/configurada. `check:thank-you`, verificações de sintaxe e diff aprovados; quatro recursos CSS/fontes verificados por HTTP.
- Verificadores das skills checkout-upsell e auditoria-seguranca sobre cópia dos cinco recursos da nova página: zero falhas, zero avisos e zero achados/críticos. Esta checagem não audita integralmente o restante site.
- Preservação da landing, ambos os upsells, templates/estilos anteriores, obrigado, versões Básico/PRO e manual PDF confirmada. Recursos sensíveis de desenvolvimento permanecem fora da exportação pública.
- Navegador indisponível: não foram avaliados o aspeto renderizado no telemóvel/desktop ou o console. Avaliação interna de fidelidade à copy e consistência técnica: 8,5/10; não mede conversão.
- Checkout, entrega do novo conteúdo e encaminhamentos Hotmart continuam por configurar; não foi efetuado pagamento. A copy corresponde ao ramo de recusa do Upsell 1, mas os links das páginas anteriores não foram alterados antes da definição do percurso completo.

## Oferta final — verificação adicional em 23/10/2026

- Nova página `oferta-final.html`, template próprio e recursos CSS/fontes partilhados com as três páginas anteriores. Copy preservada: «A Minha Botica Organizada», referência €9,90 e preço/CTA €3,70 fornecidos pelo utilizador.
- `FINAL_OFFER_CHECKOUT_URL` vazio mantém a compra desativada. Recusa para `https://consumer.hotmart.com/` sem condicionar o acesso a uma nova compra. Não há scripts no navegador, formulários, credenciais, recolha adicional de dados ou ligação direta para o novo entregável.
- Noindex, CSP e política de referência preservados do padrão anterior. Página e recursos exportados para `public/` por lista explícita; fontes de desenvolvimento continuam excluídas.
- Geração/exportação e verificações de sintaxe aprovadas. `check:upsell` ampliado para as quatro páginas, incluindo estado de compra configurada/desativada, recusa, isolamento de parâmetros e quatro recursos HTTP de CSS/fontes. `check:thank-you` executado sem opção de navegador.
- Verificador da skill checkout-upsell e auditor de segurança sobre cópia dos cinco recursos da oferta final: zero falhas, zero avisos, zero achados/críticos. Não constitui auditoria integral do restante site.
- Comparação confirmou preservação da landing, dos dois upsells, do downsell, templates/estilos anteriores, obrigado, versões Básico/PRO e manual PDF.
- Navegador indisponível: sem validação visual de responsividade ou console. Nota interna de fidelidade à copy e consistência técnica: 8,5/10; não é uma medição de conversão.
- A página está preparada para publicar; a conta Hotmart, pagamento, encaminhamentos e entrega não foram configurados ou testados. Não interpretar query strings como prova de compra nem afirmar um fluxo de pagamento completo em funcionamento.
