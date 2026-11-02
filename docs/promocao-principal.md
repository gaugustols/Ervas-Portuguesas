# Promoção da landing PRO à página principal

O utilizador confirmou explicitamente a promoção para «página principal». A entrega passa a usar a branch `main`, pelo fluxo GitHub → Vercel existente, sem alterar domínio, preços, produtos, Pixel ou integrações de pagamento.

## Rotas

- `/` e `/index.html`: landing PRO com a headline «Tens ervas na cozinha, mas só sabes fazer chá com elas?», mockup real, três exemplos e quatro CTAs para a oferta PRO existente de €14,90.
- `/original.html`: versão anterior preservada, com ambos os planos e `noindex` para evitar duplicação nos motores de pesquisa.
- `/teste-ervas.html`: cópia da landing PRO para comparação, também com `noindex`.

A principal não conserva o `noindex` usado na homologação. A descrição nos metadados foi alinhada com a proposta e o preço PRO, sem o antigo «a partir de 7,90 €». Os links mantêm `P108062599Y`, `off=uszcskzv` e `checkoutMode=10`.

## Build e rastreamento

Os geradores dos componentes React e da otimização trabalham agora sobre `original.html`. Depois, `scripts/build-test-hero.mjs` gera a landing principal e a cópia de teste. Isto impede que um build na Vercel restaure silenciosamente a headline ou a primeira dobra antigas. O export inclui as três rotas; o servidor local também as serve.

Foram preservados os scripts de atribuição e de eventos já validados. A principal mantém `lp_variant=ervas-cozinha`, os UTMs e os identificadores de campanha permitidos. Não existe emissão de `InitiateCheckout` por clique. O Pixel continua a ser `891065599076214`, com uma inicialização e um `PageView`.

## Verificação antes do envio

- `npm run typecheck`: passou.
- Build completo: passou. Um segundo build produziu hashes idênticos em `index.html`, `original.html` e `teste-ervas.html`.
- `check:conversion -- --browser`: passaram **12 combinações**, cobrindo as três rotas nas larguras 360, 390, 768 e 1366 px. Confirmados CTAs, ofertas, UTMs, eventos sem duplicação local, imagem, ausência de overflow, FAQ, carrossel e navegação sem JavaScript.
- `check:hook` e `check:rating`: passaram sobre os componentes preservados.
- `check:performance`: passou para a nova principal, com export exato, orçamento de payload, 14 recursos HTTP e caminhos privados protegidos.
- `check:thank-you`: passou com a nova lista de ficheiros exportados.
- `git diff --check`: passou.

Os testes de browser isolam serviços externos e não enviam eventos sintéticos à Meta. A receção no Events Manager, eventuais eventos CAPI externos, o carregamento real da Hotmart e o preço mostrado no checkout continuam sem validação externa.

## Publicação e confirmação externa

Endereço de produção já configurado no projeto: https://ervasportuguesas.vercel.app/

A publicação é solicitada pelo envio do commit de promoção à `main`. O push confirmado não é, por si só, prova de que o build da Vercel terminou ou de que a página pública já atualizou. Os checks do commit no GitHub e a tentativa de leitura HTTP devem ser reportados separadamente.

Nas tentativas anteriores, o proxy bloqueou os domínios Vercel e Hotmart com erro de túnel HTTP 403. Não se deve apresentar esse erro do ambiente como erro da aplicação ou afirmar que o site carregou quando o pedido não chegou ao destino.

Para uma reversão exata à produção anterior, o commit remoto da `main` antes desta promoção era `364746af1bfa3bce2c8e249c43bf4ce5baea7f1f`. A versão anterior também permanece consultável em `/original.html`; não foi efetuado reset destrutivo do histórico.
