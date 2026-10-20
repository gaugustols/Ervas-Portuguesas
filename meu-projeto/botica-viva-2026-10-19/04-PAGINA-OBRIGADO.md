# Página de obrigado · Botica Viva

## Atualização · MVP sem login (20/10/2026)

Esta atualização substitui as pendências de acesso do registo inicial abaixo. O utilizador autorizou publicar o MVP por link, sem login. Não há aprovação, identificação do comprador ou autorização por plano implementadas nesta versão.

- `obrigado.html`: escolha explícita entre «Abrir o Plano Básico» (`/app/`) e «Abrir o Plano PRO» (`/pro/`). Ambos são links HTTPS do domínio `ervasportuguesas.vercel.app`.
- `obrigado-basico.html` e `obrigado-pro.html`: uma única ação para a versão correspondente. Geradas a partir do mesmo template; sem dados de comprador na URL.
- Recomendação para o painel da Hotmart: usar `https://ervasportuguesas.vercel.app/obrigado.html` no estado de compra aprovada. Como as duas ofertas pertencem ao mesmo produto, o destino comum funciona sem depender de uma configuração por oferta. Caso a conta permita destinos por oferta, as variantes estão disponíveis; essa opção específica não foi verificada no painel.
- O contacto próprio de apoio continua por definir; permanece a ajuda oficial da Hotmart. Não foram enviados e-mails nem alteradas as configurações da conta Hotmart.
- Configuração: `WEBAPP_ACCESS_URL`, `PRO_WEBAPP_ACCESS_URL` e `SUPPORT_URL` em `lib/thank-you-config.mjs`. O exportador inclui os três HTMLs e apenas os ficheiros compilados dos apps.
- Testes do obrigado: 320/375/768/1440 px, dois CTAs visíveis na primeira dobra, teclado, FAQ nativo, sem dependência de JavaScript e sem erros de consola/HTTP. Os links individuais e a escolha de plano foram verificados. A landing original não foi alterada.

Nota interna atual: **9/10**, mantendo clareza 2/2, identidade/PT-PT 2/2, acessibilidade 2/2, revisão de segurança no escopo do MVP 2/2 e entrega 1/2 (configuração real na Hotmart e compra de ponta a ponta ainda não testadas). A ausência de login é uma decisão do MVP, não uma funcionalidade de proteção.

## Registo inicial (anterior à decisão de publicar o MVP)

## Estado e decisão

Página escrita para a etapa posterior à compra aprovada. O comprador já conhece o produto: o formato é curto, com uma ação principal, os primeiros passos e apoio. Foram aplicadas as skills locais `creator-pagina`, `checkout-upsell` (apenas a etapa de obrigado), `pos-venda` (ativação D0) e `auditoria-seguranca`.

O utilizador confirmou em 20/10/2026 que os links públicos do webapp e o contacto de apoio ainda não estão definidos. **A entrega do webapp não está operacional.** A página usa um destino real de consulta de compras da Hotmart enquanto o acesso não for configurado. Não há envio automático de e-mail, validação de pagamento, login, área de membros ou autorização por plano implementados nesta página.

## Ficheiros

- `../../obrigado.html`: página gerada para publicação, PT-PT e `noindex,nofollow,noarchive`.
- `../../templates/obrigado.html`: texto e estrutura de origem.
- `../../assets/nova-pagina/css/obrigado.css`: estilo independente; fontes locais da marca.
- `../../lib/thank-you-config.mjs`: `WEBAPP_ACCESS_URL` e `SUPPORT_URL`.
- `../../scripts/build-thank-you.mjs`: geração estática, validação de HTTPS e escape dos valores.
- `../../scripts/check-thank-you.mjs`: verificação de configuração, exportação, HTTP e navegador.
- Exportador e servidor local ampliados apenas para incluir `obrigado.html`.

## Copy e direção visual

- H1: «A sua Botica Viva começa aqui.»
- Uma ação principal. Sem endereço de app: «Ver a minha compra na Hotmart». Com endereço: «Abrir o meu webapp».
- Passo inicial: «No webapp, abra “Início”, escolha “Começar o primeiro passo” e siga as orientações do módulo 1.»
- Fundo quase preto; texto branco; CTA #0b6b2c; verde claro de apoio com contraste para textos pequenos.
- Plus Jakarta Sans local; cards com contorno discreto, botão arredondado, três passos e FAQ nativo.
- Sem fotografias, contadores, upsells, testemunhos ou provas de aprovação inventados. Não é necessário gerar imagens.
- Apoio provisório: artigo oficial de contacto do produtor na Hotmart, sem inventar e-mail ou WhatsApp.

## Ativação D0

A página indica uma ação de cada vez: consultar a compra/abrir o webapp → começar pelo módulo 1 → criar a primeira ficha. Não foi configurada automação de e-mail ou WhatsApp. A conta de comprador da Hotmart utiliza o e-mail da compra; as mensagens e credenciais pertencem ao fluxo da plataforma.

## Como concluir a configuração

1. Escolher uma área de acesso HTTPS que identifique o comprador e liberte apenas o plano comprado. O webapp local atual não tem essa proteção. Não usar parâmetros `?plano=pro` como autorização nem publicar as duas pastas pagas em aberto.
2. Definir esse endereço em `WEBAPP_ACCESS_URL`, e o contacto real em `SUPPORT_URL` (URL HTTPS ou `mailto:` simples). Gerar a página com `npm.cmd run build:thank-you` e a exportação com `npm.cmd run build`.
3. Testar o percurso de cada oferta: Básico `dv3haixa` e PRO `uszcskzv`. Se o serviço exigir entradas diferentes por plano, adaptar a entrega autenticada antes de ativar o redirecionamento. A página atual é uma entrada comum; não escolhe nem desbloqueia planos.
4. Depois do deploy, utilizar `https://ervasportuguesas.vercel.app/obrigado.html` apenas no estado de **compra aprovada** da Hotmart. Não ativar como entrega direta do webapp enquanto o passo 1 estiver pendente.
5. Na Hotmart: Produtos → selecionar o produto → Ferramentas → Configurações de pagamento → Pós-venda → Externa → URL para compras aprovadas → Salvar. Manter instruções próprias para pagamentos pendentes ou em análise; esta página não confirma pagamentos por si só.

A configuração no painel da Hotmart não foi realizada. Fonte primária consultada em 20/10/2026: [Como configuro a Página de Obrigado do meu produto?](https://suportehotmart.zendesk.com/hc/pt-br/articles/360005081432-Como-configuro-a-P%C3%A1gina-de-Obrigado-do-meu-produto). [Ajuda para contactar o produtor](https://suportehotmart.zendesk.com/hc/pt-br/articles/360000649492-Como-entro-em-contato-com-o-Produtor).

## Qualidade e limites

A rubrica de copy de vendas da skill exige preço, promessa financeira, frequência, múltiplos CTAs e secções comerciais. Não se aplica a uma página pós-compra em PT-PT. Não foi alterada a landing nem acrescentado conteúdo comercial para aumentar artificialmente essa pontuação.

Grelha interna de pós-compra, de 0 a 2 por dimensão: clareza do próximo passo 2; coerência visual/PT-PT 2; acessibilidade/responsividade 2; privacidade/exportação restrita 2; entrega real ao webapp 0, por falta de endereço e plataforma. **Total: 8/10, com entrega pendente.** O botão de consulta Hotmart funciona como alternativa, sem ser apresentado como acesso ao webapp.

O build completo passou. O verificador de páginas da skill passou com zero falhas e zero avisos na nova página. A auditoria da nova página passou sem achados; a triagem dos falsos positivos da pasta pública está no relatório de segurança. Foram testados os estados com e sem URL configurada, destinos inválidos, escape, funcionamento sem JavaScript e isolamento de ficheiros internos. O teste no Chrome verifica 320/375/768/1440 px, CTA sem rolar, teclado e FAQ nativo; capturas ficam na pasta temporária. Não foi feita uma compra nem um teste em Safari ou telemóvel físico.
