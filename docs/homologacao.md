# Homologação da variante Ervas Portuguesas

## Estado da publicação

**Publicação não executada; URL pública de teste ainda indisponível.** Não foi alterado o site dos anúncios, nenhum alias de produção, domínio ou integração de pagamento.

O projeto usa referências a `ervasportuguesas.vercel.app`, mas não tem metadados locais `.vercel`, CLI Vercel instalada, ligação de publicação disponível nas ferramentas ou credenciais Vercel identificadas nos nomes das variáveis/configuração do ambiente. A consulta às publicações do GitHub pela API foi bloqueada (`Forbidden`). A existência de autenticação GitHub para outras operações não foi tratada como autorização/acesso à Vercel. Não foi feito push para tentar provocar uma publicação sem conhecer a configuração da integração.

Foi solicitado ao utilizador o acesso de preview ou a identificação de um fluxo já configurado. Tokens não devem ser enviados no chat. Após disponibilizar esse acesso, falta publicar apenas como **Preview**, obter a URL real e testar o respetivo caminho `/teste-ervas.html`. A autorização dada é para homologação; não autoriza promover a variante a página principal.

## Pacote preparado

- Pasta estática: `/workspace/ervas-homologacao/`.
- Arquivo pronto a transferir: `/workspace/ervas-homologacao.zip` (7 577 555 bytes).
- Manifesto SHA-256 por ficheiro: `/workspace/ervas-homologacao-manifest.json`.
- 86 ficheiros: `index.html`, `teste-ervas.html`, recursos locais e `vercel.json`.
- `index.html` mantém a original; não existe redirecionamento da raiz para a variante. Ambos os HTML foram comparados byte a byte com o resultado do build. Integridade do ZIP verificada.
- O pacote contém somente as landing pages e os recursos necessários, sem repositório Git, credenciais, código-fonte de build ou ficheiros da área paga app/PRO.
- O `vercel.json` conserva os caminhos `.html` e pede `X-Robots-Tag: noindex, nofollow` para o preview. A aplicação dessa configuração pela Vercel ainda não foi validada numa publicação real.

O pacote deve ser usado num deployment de preview do projeto autorizado, sem `--prod`, sem promoção de deployment e sem atribuir o domínio dos anúncios. Não foi criado um projeto noutra conta nem usado um serviço de publicação não autorizado.

## CTAs e preços

Os **quatro CTAs de compra da variante** (`hero-primary`, `content-access`, `pricing-pro`, `final-access`) usam o mesmo destino já existente:

```text
https://pay.hotmart.com/P108062599Y?off=uszcskzv&checkoutMode=10
```

Todos mostram «Quero o acesso PRO — €14,90» e têm `data-checkout-plan="pro"`. A variante de homologação apresenta apenas o cartão PRO; o Básico de €7,90 permanece na original com a sua oferta intacta. Não se transformou um botão de €7,90 numa compra de €14,90.

Os botões informativos FAQ/carrossel e o link de créditos conservam as suas funções; não são CTAs de compra. A original mantém os seus botões, preços, copy e comportamento anteriores. Não foi alterado `app.js`, onde já constam os URLs de pagamento.

**Limite externo:** a consulta pública à oferta PRO foi novamente bloqueada pelo proxy (`CONNECT tunnel failed, response 403`, sem resposta da Hotmart). O destino configurado e a navegação nativa foram validados, mas não o carregamento real do checkout, o preço que este mostra na Europa ou uma transação. Não foram introduzidos dados pessoais nem iniciados pagamentos.

## UTM e atribuição

`assets/nova-pagina/js/checkout-attribution.js` é carregado **apenas na variante**, depois da configuração dos links existente e antes dos eventos. Copia para os quatro links PRO:

- Parâmetros `utm_*` com nomes em minúsculas: por exemplo `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term`, `utm_id`.
- Identificadores presentes na URL: `fbclid`, `gclid`, `msclkid`, `ttclid`, `src`, `sck`.

Preserva os valores descodificados, incluindo acentos, espaços, `&` e `=`. Não substitui parâmetros já definidos no destino nem volta a acrescentá-los caso o script seja reinserido. Não usa armazenamento persistente nem cria identificadores de utilizador.

Parâmetros arbitrários da LP, incluindo `email`, **não** são copiados. Parâmetros da oferta/pagamento como `off`, `checkoutMode`, preço ou cupão não podem substituir a configuração do checkout. A URL de entrada foi testada com tentativas de mudar `off` e `checkoutMode`: todos os links mantiveram `off=uszcskzv` e `checkoutMode=10`.

A passagem ocorre com JavaScript ativo e aplica-se à visita atual. Sem JavaScript, o link nativo continua a abrir a oferta PRO, mas não pode incorporar dinamicamente os parâmetros da URL da LP. Não foi confirmada a aceitação/processamento desses identificadores pela Hotmart, nem atribuição de compra efetiva na Meta. Cookies `_fbp`/`_fbc` não são lidos ou reencaminhados manualmente; o Pixel existente mantém o seu comportamento.

## Meta Pixel e eventos

Mantido o Pixel **891065599076214**, com uma inicialização e um `PageView` por carregamento. A variante utiliza o script de eventos partilhado existente:

| Evento | Resultado esperado |
| --- | --- |
| `CTA_Click` | Um evento por clique num CTA de compra, com `cta_id` e `lp_variant` |
| `Pricing_View` | Um evento por visualização da página, ao ver pelo menos metade do bloco de preço |
| `Checkout_Click` | Um evento por clique de compra, com `plan=pro`, `value=14.9`, `currency=EUR`, `cta_id`, `lp_variant=ervas-cozinha` |
| `InitiateCheckout` | Nenhuma emissão a partir de cliques na LP |

Um `CTA_Click` e um `Checkout_Click` no mesmo clique são dois eventos de etapas diferentes. Reinserir o script não duplicou listeners ou os eventos. Regressar à secção de preço não repetiu `Pricing_View`.

**Meta Events Manager não validado:** não existe acesso autenticado disponibilizado nesta sessão. Os testes usam um SDK Meta simulado, sem enviar eventos sintéticos ao Pixel real. Validam as chamadas da LP e os parâmetros, não a receção pelo Events Manager, deduplicação com possíveis eventos servidor/CAPI ou atribuição em produção. Após obter acesso, testar no preview real e confirmar a sequência e os parâmetros. Não acrescentar outro Pixel nem emitir `InitiateCheckout` para simular uma confirmação do checkout.

## Testes concluídos

- Instalação mantida no lockfile existente; `npm run typecheck` e `npm run build` passaram.
- `npm run check:conversion -- --browser`: **oito combinações passaram**, original e variante em 360, 390, 768 e 1366 px de largura, altura de 800 px; em mobile, densidade 2× e emulação de toque no Chromium.
- Na variante: quatro CTAs PRO, captura do produto carregada, CTA superior dentro da primeira dobra, ausência de overflow, FAQ e carrossel operacionais. Inventário: 15 controlos na original e 13 na variante atual.
- Em todos os CTAs PRO: oferta correta, preço/metadados do evento e preservação dos parâmetros de atribuição testados. Reinserção dos scripts verificada sem duplicação.
- Testadas navegação nativa sem JavaScript, ausência/falha do Pixel sem bloquear navegação, uma inicialização, um `PageView`, um único `Pricing_View` e ausência de `InitiateCheckout` falso.
- Nenhum erro JavaScript ou resposta local com erro nos percursos de browser testados.
- `check:performance` passou: orçamento, export exato, 13 recursos HTTP e caminhos privados protegidos na original.
- `check:thank-you` passou: páginas de agradecimento, app/PRO e export mantidos; estas áreas não fazem parte do pacote reduzido do preview.
- `git diff --check` passou. Integridade e correspondência dos HTML do pacote verificadas.

Capturas e resultados estruturados: `/tmp/ervas-conversion-tests/test-*.png` e `results.json`. Os serviços externos foram isolados no teste do navegador. Não foram testados iPhone/Safari físico, a receção real na Meta, pagamentos, nem o preview público ainda inexistente.

Para reproduzir, na raiz do projeto:

```sh
npm run typecheck
npm run build
PREVIEW_PORT=4180 node servidor-local.mjs
```

Noutro terminal:

```sh
npm run check:conversion -- --browser
PREVIEW_URL=http://127.0.0.1:4180/ npm run check:performance
PREVIEW_ORIGIN=http://127.0.0.1:4180 npm run check:thank-you
```

Os testes usam Playwright/Chromium fornecidos pelo ambiente. A execução de rede/escuta pode requerer o modo autorizado do executor.

## Pendências separadas

1. **Publicação:** disponibilizar acesso ao alojamento ou um fluxo de preview verificável; publicar, obter a URL e confirmar que não existe promoção/alias de produção.
2. **Checkout externo:** abrir a URL real do preview no telemóvel e confirmar o carregamento da oferta PRO, preço em EUR e parâmetros no destino, num contexto com acesso à Hotmart.
3. **Meta:** verificar a receção dos três eventos no Events Manager, incluindo eventual duplicação por integrações externas que este repositório não expõe.
4. **Dispositivos reais:** confirmar no browser mobile usado pelo público, incluindo o navegador interno dos anúncios Meta; a validação atual é por emulação Chromium.

A página atual dos anúncios não foi substituída. A variante não será promovida a principal sem confirmação.
