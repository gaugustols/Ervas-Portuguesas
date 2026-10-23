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
