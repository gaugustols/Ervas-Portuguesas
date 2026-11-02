# Auditoria e teste da passagem para o checkout

> Registo da primeira implementação. A preparação posterior para homologação tornou todos os CTAs da variante exclusivos do PRO e acrescentou atribuição. Para o estado atual e a publicação, consulte [homologacao.md](homologacao.md).

## Diagnóstico e arquitetura

Landing estática em `index.html`, com estilos compilados inline, recursos em `assets/nova-pagina/` e servidor Node em `servidor-local.mjs`. React/TypeScript, Tailwind e esbuild geram os blocos estáticos e pequenos scripts de interação; não há servidor de aplicação nem confirmação de pagamentos neste repositório. `scripts/export-static.mjs` publica os ficheiros estáticos em `public/`. O estúdio Remotion é separado deste fluxo.

Os números fornecidos (330 visualizações, um checkout iniciado, zero vendas) correspondem a cerca de 0,30% de visualizações com início de checkout reportado. Não permitem atribuir a causa a um botão ou ao checkout: faltavam eventos intermédios na LP. O anúncio vencedor fala de usos além do chá, enquanto a primeira dobra original abre com vídeo e uma headline longa sobre problemas de saúde. Os dois primeiros CTAs originais levam aos bónus, exigindo mais navegação antes da compra. Estas são hipóteses de fricção, não uma demonstração causal.

Antes das alterações, o código continha uma única inicialização do Meta Pixel **891065599076214**, um `PageView` e o fallback `noscript` correspondente. Não foram encontrados `CTA_Click`, `Pricing_View`, `Checkout_Click`, `InitiateCheckout` nem integração servidor/CAPI no código da LP. A configuração interna da Hotmart e do Gestor de Eventos não está disponível no repositório; eventos que possam ser emitidos nesses serviços não foram presumidos ausentes.

## Versões e alterações

- **Original:** `/` ou `/index.html`. Copy, aspeto, preços e destinos dos botões preservados. Acrescentados apenas identificadores dos CTAs e o script partilhado de eventos; corrigido o preload obsoleto descrito abaixo.
- **Teste:** `/teste-ervas.html`, gerado por `scripts/build-test-hero.mjs`. Headline e subheadline exatamente como pedidas; mockup de telemóvel com captura real existente do produto; três preparações reais; CTA nativo para o PRO de €14,90. Mantém a paleta escura/verde, tipografia do sistema e botões da identidade atual. O resto da página é partilhado com a original. A variante recebe `noindex` para evitar indexação como página duplicada.
- A variante entra no build completo, no servidor local e no export estático. Não há redirecionamento, substituição da original ou distribuição automática de tráfego.
- Corrigido em `scripts/optimize-landing.mjs` um preload responsivo antigo que referenciava `vsl-poster-768.webp` e `vsl-poster-1280.webp`, ficheiros inexistentes. O preload passa a usar o poster realmente presente no vídeo, sem mudar o seu aspeto. O erro foi reproduzido no navegador a 768 px.
- Não foram alterados produtos, preços, URLs de checkout, domínio, integrações de pagamento ou ID do Pixel. Não foi feito deploy nem alterada qualquer campanha Meta.

As três preparações — **Hortelã-verde na salada**, **Tomilho nos legumes** e **Orégãos no molho de tomate** — constam de `meu-projeto/botica-viva-2026-10-19/src/fichas-plantas.mjs` (`erva-2`, `erva-5` e `erva-6`). Não foram inventadas receitas, quantidades, resultados de saúde ou características do produto. A captura usada é `assets/nova-pagina/images/aplicacao-real/mobile.webp`; o produto continua descrito como acesso digital no navegador.

## Auditoria de todos os controlos da LP

| Controlo | Original | Teste | Validação local |
| --- | --- | --- | --- |
| CTA principal (`hero-primary`) | `#bonus-incluidos` | Checkout PRO existente | Toque, evento e destino; no teste está visível na primeira dobra |
| CTA após avaliações (`content-access`) | `#bonus-incluidos` | Mesmo destino | Toque e âncora existente |
| Plano Básico (`pricing-basic`) | Checkout Básico | Mesmo destino | Toque, oferta e evento com `basic`, 7.90 EUR |
| Plano PRO (`pricing-pro`) | Checkout PRO | Mesmo destino | Toque, oferta e evento com `pro`, 14.90 EUR |
| CTA final (`final-access`) | `#plano-pro` | Mesmo destino | Toque e âncora existente |
| Créditos de imagens | Ficheiro HTML local | Mesmo destino | HTTP 200 |
| Reproduzir vídeo | Cria iframe YouTube após toque | Retirado apenas da primeira dobra de teste | Criação do iframe verificada; reprodução externa não validada |
| Setas anterior/seguinte do carrossel | Navegam entre cartões | Mesmo comportamento | Avanço, recuo e estados desativados nos limites verificados |
| Seis botões de perguntas frequentes | Abrem/fecham respostas | Mesmo comportamento | Todos os seis testados por toque e `aria-expanded` |

Inventário: **15 controlos na original e 14 na variante**, em cada uma das quatro larguras testadas. Não foram encontrados botões principais pendentes/desativados. As setas do carrossel ficam desativadas legitimamente nos limites. O README antigo dizia que os checkouts estavam desativados e referia um CTA fixo; essa informação não correspondia ao HTML atual e foi corrigida. Não existem links de atendimento, termos ou privacidade na LP atual; não foram criados destinos para os substituir.

Destinos existentes preservados literalmente:

- Básico: `https://pay.hotmart.com/P108062599Y?off=dv3haixa&checkoutMode=10`
- PRO: `https://pay.hotmart.com/P108062599Y?off=uszcskzv&checkoutMode=10`

**Limite da verificação externa:** uma consulta pública ao checkout PRO foi impedida pelo proxy da nuvem (`CONNECT tunnel failed, response 403`, sem resposta HTTP da Hotmart). Isto não demonstra que o checkout esteja indisponível para os clientes. Foram confirmados os links já presentes no projeto, as ofertas em cada botão e a navegação nativa do CTA PRO, mas não o carregamento real dos dois checkouts nem os preços apresentados pela Hotmart nesta sessão. Não foram introduzidos dados pessoais, iniciados pagamentos ou efetuadas compras.

## Eventos

Implementação partilhada em `assets/nova-pagina/js/conversion-events.js`, carregada uma vez em cada versão. Usa `fbq('trackCustom', ...)` do Pixel existente; não inicializa outro Pixel nem repete `PageView`.

| Evento | Condição | Parâmetros |
| --- | --- | --- |
| `CTA_Click` | Clique num dos cinco links principais `.btn`, incluindo os que levam ao checkout | `lp_variant`, `cta_id` |
| `Pricing_View` | Pelo menos 50% de um bloco de valor/preço visível; uma ocorrência por visualização da página | `lp_variant`, `visible_plan` |
| `Checkout_Click` | Clique num CTA com plano `basic`/`pro` e destino Hotmart existente | `lp_variant`, `cta_id`, `plan`, `value`, `currency: 'EUR'` |
| `InitiateCheckout` | **Não emitido pela LP**: não existe confirmação verificável de início no checkout externo | Depende de confirmação na integração do checkout |

`lp_variant` é `original` ou `ervas-cozinha`. `visible_plan` indica o primeiro plano cujo preço foi visto, não uma seleção de compra. Observar o bloco de preço, em vez da secção inteira, evita que uma secção mais alta do que o ecrã nunca atinja o limiar no telemóvel. O preço no CTA superior do teste não conta como visualização da secção de preços.

Um clique no checkout emite **um `CTA_Click` e um `Checkout_Click`**: são etapas diferentes, não duas iniciações de checkout. Cliques repetidos são novas intenções e contam individualmente; voltar a ver os preços não duplica `Pricing_View`. Uma guarda evita registar os listeners duas vezes caso o script seja reinserido. A navegação não espera pela Meta e não é bloqueada se o Pixel falhar ou estiver ausente. Não são enviados texto livre, dados pessoais ou parâmetros da URL.

Não se deduz `InitiateCheckout` de um clique, temporizador, carregamento desta LP, parâmetro da URL ou visita à página de agradecimento. Para o validar é necessário consultar a integração Hotmart/Meta e observar o evento no checkout com o mesmo Pixel. Se já existir ali, deve ser mantido sem duplicação. Esta parte fica pendente de verificação externa; não foi criada uma falsa confirmação no frontend.

## Testes realizados

- `npm ci --no-audit --no-fund`: dependências fixadas instaladas, sem alterar o lockfile.
- `npm run typecheck` e `npm run build`: passaram; o build gera a original, a variante e o export de ambas.
- `npm run check:hook` e `npm run check:rating`: passaram.
- `PREVIEW_URL=http://127.0.0.1:4180/ npm run check:performance`: passou, incluindo orçamento, export exato, 13 recursos HTTP e bloqueio dos caminhos privados.
- `PREVIEW_ORIGIN=http://127.0.0.1:4180 npm run check:upsell`: passou para as quatro páginas e seis recursos locais.
- `PREVIEW_ORIGIN=http://127.0.0.1:4180 npm run check:thank-you`: passou, incluindo export atualizado, páginas de agradecimento, rotas app/PRO e isolamento dos ficheiros privados.
- `npm run check:conversion -- --browser`: passaram as **oito combinações** de duas páginas com larguras **360, 390, 768 e 1366 px**, altura de 800 px. Mobile com densidade 2×; Chromium 154, com emulação de toque.
- Confirmados: ausência de overflow horizontal; CTA de teste dentro da primeira dobra; carregamento da imagem real; navegação por âncoras; todos os CTAs de plano; nomes, valores, moeda e variante dos eventos; exatamente uma inicialização e um `PageView`; um único `Pricing_View` após voltar à secção; ausência de `InitiateCheckout` falso; não duplicação após reinserir o script; todos os botões FAQ; setas do carrossel; criação do iframe de vídeo na original; nenhum erro JavaScript ou resposta local com erro nos percursos testados.
- Navegação nativa do CTA PRO sem JavaScript: passou, com o destino externo intercetado pelo teste. Verificadas também falhas/ausência do Pixel sem impedir a navegação.
- Testes de eventos usam um SDK Meta simulado e destinos externos isolados, para não enviar tráfego sintético ao Pixel real. Isto valida as chamadas e os parâmetros no browser, não a receção em produção pelo Gestor de Eventos.
- Inspeção visual das capturas mobile e desktop: realizada. Todos os 14 caminhos locais distintos `src`/`href` de cada HTML existem no checkout.

Medição local de payload: original **149 206 bytes / 24 367 bytes Brotli**; teste **148 737 / 24 215**; script adicional **2 022 / 790**. Os tamanhos Brotli são calculados localmente, não prova de compressão configurada no alojamento. Não se afirmou um resultado Lighthouse, LCP de produção ou desempenho de rede móvel real.

Capturas das quatro larguras e inventário/eventos por execução ficam em `/tmp/ervas-conversion-tests/` (`test-*.png` e `results.json`), gerados novamente pelo teste. Não foram testados Safari/iPhone físico, reprodução externa do YouTube, entrega real dos eventos à Meta ou transações Hotmart.

## Reproduzir e comparar

Na raiz do projeto:

```sh
npm ci --no-audit --no-fund
npm run typecheck
npm run build
PREVIEW_PORT=4180 node servidor-local.mjs
```

Noutro terminal, na mesma pasta:

```sh
npm run check:conversion
npm run check:conversion -- --browser
PREVIEW_URL=http://127.0.0.1:4180/ npm run check:performance
PREVIEW_ORIGIN=http://127.0.0.1:4180 npm run check:upsell
PREVIEW_ORIGIN=http://127.0.0.1:4180 npm run check:thank-you
```

O teste de navegador usa Playwright e Chromium disponibilizados pelo ambiente de nuvem. Fora deste ambiente, disponibilize Playwright e indique, se necessário, `PLAYWRIGHT_MODULE` e `CHROMIUM_PATH`; não há nova dependência de produção. `PREVIEW_ORIGIN` permite escolher outro servidor no teste de conversão. A execução de rede/escuta local pode requerer o modo autorizado do executor.

Para comparar, use `/` como controlo e `/teste-ervas.html` como tratamento no mesmo domínio, após o processo normal de publicação. Distribua tráfego comparável mantendo criativo, público e período equivalentes. Analise `Checkout_Click / PageView` por página e `lp_variant`, usando o início real de checkout e as compras confirmadas na Hotmart/Meta como etapas seguintes. O `lp_variant` acompanha os eventos personalizados; o `PageView` continua original e pode ser segmentado pelo URL da página. A comparação é entre duas primeiras dobras completas, não um teste isolado da headline.

Antes de usar `InitiateCheckout` como objetivo, confirme-o no Gestor de Eventos e na integração de checkout existente. Não o substitua por `Checkout_Click`. A receção dos eventos reais e o carregamento do checkout ainda precisam de validação num contexto com acesso aos serviços externos. A variante está implementada e testada localmente, sem alegação de aumento de conversão ou publicação em produção.
