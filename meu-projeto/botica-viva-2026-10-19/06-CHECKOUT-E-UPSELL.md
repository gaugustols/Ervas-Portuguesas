# Checkout, upsell e acesso · Botica Viva · 23/10/2026

## Desenvolvimento atual

**Estado: Upsells 1 e 2 e downsell publicados; oferta final gerada e verificada localmente por €3,70; compras desativadas, à espera dos checkouts próprios.** Skill: `.agents/skills/checkout-upsell`. O utilizador definiu um funil comum para Básico e PRO e enviou a própria copy das quatro páginas. As sugestões anteriores de upgrade e de novos complementos foram substituídas por esta decisão.

Página criada: `../../upsell-1.html`, gerada por `../../scripts/build-upsell.mjs` a partir de `../../templates/upsell-1.html`. URL de publicação: `https://ervasportuguesas.vercel.app/upsell-1.html`. A estética reutiliza `obrigado.css` e acrescenta `upsell.css`, sem modificar a página de obrigado, a landing ou o produto. Não foram alteradas configurações no painel Hotmart.

## Texto do checkout Básico — pronto para colar

**Nome:** Botica Viva — Plano Básico

**Descrição curta:**

> Aplicação online com 38 fichas de plantas com fotografia, preparação, modo de usar e cuidados. Inclui seis módulos, pesquisa, favoritos e fichas de registo. Acesso vitalício no navegador, após aprovação do pagamento. Garantia de 7 dias. Sem envio físico.

**O que está incluído:**

- 38 fichas de plantas com fotografias, utilizações, preparação e cuidados.
- Pesquisa por nome comum, científico ou utilização.
- Um percurso de seis módulos e acompanhamento do progresso.
- Biblioteca com seis métodos de preparação e orientações de conservação.
- Favoritos e fichas de preparação, com exportação dos registos.

**Preço de referência da oferta:** €7,90. A moeda e o total apresentados ao comprador devem ser conferidos no checkout para Portugal.

**Entrega e utilização:**

> Após a aprovação do pagamento, segue as instruções de acesso disponibilizadas na tua compra na Hotmart. A Botica Viva funciona no navegador do telemóvel, tablet ou computador, sem instalação. Recebes acesso à aplicação, não um livro impresso. Os teus registos ficam guardados neste navegador; exporta uma cópia para os conservar.

**Garantia:**

> Tens 7 dias para pedir o reembolso, seguindo o procedimento indicado na tua compra na Hotmart.

## Texto do checkout PRO — pronto para colar

**Nome:** Botica Viva — Plano PRO

**Descrição curta:**

> Tudo o que está incluído no Básico, mais oito fichas de infusões, cultivo e conservação de seis plantas e quatro modelos para imprimir. Aplicação online com acesso vitalício no navegador, após aprovação do pagamento. Garantia de 7 dias. Sem envio físico.

**O que está incluído:**

- Todo o conteúdo e as ferramentas do Plano Básico.
- Caderno Ilustrado de Infusões: oito fichas para consulta.
- Guia de Cultivo e Conservação: seis plantas.
- Fichas Práticas para Imprimir: quatro modelos.

**Preço de referência da oferta:** €14,90. É o preço integral do PRO, não uma taxa adicional nem uma mensalidade.

**Entrega e garantia:** usar os mesmos textos do Básico, com acesso à versão PRO.

**Aviso comum aos dois checkouts:**

> Conteúdo educativo sobre plantas e preparações caseiras. Não substitui aconselhamento, diagnóstico ou tratamento por um profissional de saúde. As fotografias ajudam a estudar; não confirmam, por si só, que uma planta é segura para consumo.

**Apoio:** o contacto próprio ainda não foi definido. Até lá, orientar para o contacto do produtor nos detalhes da compra na Hotmart; não inventar email, WhatsApp ou horário de atendimento.

## Order bump — propostas anteriores, fora do funil atual

Preços abaixo são propostas internas, não ofertas ativas. O intervalo de 20–50% do Básico corresponde a €1,58–€3,95. Nota de cada critério: 0–2; total máximo 6. Notas editoriais, não resultados de vendas.

| Opção e título proposto | Entrega a criar | Preço proposto | Complementar | Decisão simples | Dentro do intervalo | Total |
| --- | --- | --- | --- | --- | --- | --- |
| «Sim, quero organizar os meus ingredientes» | Pequeno organizador digital de compras e stock de ingredientes alimentares, distinto dos modelos do PRO | €2,90 | 2 | 2 | 2 | 6/6 |
| «Sim, quero consultar sem ligação» | Edição PDF de consulta das 38 plantas, com cuidados e fontes, disponível sem ligação | €3,50 | 1 | 2 | 2 | 5/6 |
| «Sim, quero o meu calendário sazonal» | Calendário de tarefas de conservação e organização, sem recomendações clínicas | €2,50 | 1 | 1 | 2 | 4/6 |

**Bump recomendado, se for criado depois:** organizador de compras e stock, por €2,90. Resolve uma tarefa diferente da biblioteca e não deve reutilizar como extra pago nenhum recurso já incluído no Básico ou no PRO. Antes de o oferecer, criar e verificar a entrega e confirmar o preço. Para o lançamento atual, manter o checkout sem bump até essa entrega existir.

## Upsell 1 definido pelo utilizador — A Minha Horta Medicinal em 7 Dias

**Destinatários:** compradores de ambos os planos, Básico e PRO, com a mesma página e o mesmo complemento. Não é uma venda do upgrade PRO.

**Copy:** fornecida pelo utilizador e preservada no template, incluindo «PASSO 2», «Já tens o guia», os parágrafos, os três benefícios e a linha de garantia/acesso/Hotmart. A oferta propõe escolher três plantas, reunir materiais e montar os primeiros vasos em sete dias, respeitando as condições do espaço.

**Entregável PDF:** em 23/10/2026, o utilizador forneceu `Botica_Viva_Horta_7_Dias_Guia.pdf` e pediu uma edição estética na identidade da aplicação. Criado `../../output/pdf/botica-viva-horta-em-7-dias.pdf`: 30 páginas A4, seis fotografias com créditos, diagramas de demonstração e fichas claras para imprimir. Conteúdo preservado e comparado em 528 fragmentos; todas as páginas revistas visualmente. Fontes e decisões em `upsell-1-pdf/README.md`. O PDF fica fora da exportação pública. Ainda falta carregá-lo na Hotmart e testar a entrega após pagamento; a página e o checkout permanecem como estavam.

**Preço:** €9,50. Referência de €29,90 apresentada na copy do utilizador e preservada; não foi consultado um histórico independente desse preço. Não foram acrescentadas contagens regressivas, vagas, testemunhos ou números de vendas.

**Configuração:** `../../lib/upsell-config.mjs`, variável `UPSELL1_CHECKOUT_URL` vazia. O utilizador confirmou que ainda não há checkout e autorizou desenvolver a página para inserir a ligação depois. O botão está nativamente desativado e identificado por «Compra indisponível de momento». O marcador `#PLACEHOLDER-CHECKOUT` é apenas uma convenção interna, não um destino clicável publicado.

**Aceitação:** «Acrescenta agora à tua Botica Viva», preparada para um checkout próprio da Hotmart. Um link comum não é, por si só, uma integração de compra de um clique. A validação do gerador rejeita destinos inesperados, HTTP e URLs com credenciais.

**Recusa:** «Não, obrigado. Quero continuar ao meu acesso.» → `https://ervasportuguesas.vercel.app/obrigado.html`, com escolha do plano adquirido. Esta opção funciona sem JavaScript e não exige aceitar uma compra adicional.

## Próximas páginas do mesmo funil

- `/upsell-2.html`: «Mantém a Tua Horta Viva», copy recebida e página criada na mesma estética. Preço de referência €17,90 fornecido na copy; preço final €7,90 confirmado explicitamente pelo utilizador, incluindo o botão que originalmente dizia €4,90. Checkout próprio ainda por enviar; `UPSELL2_CHECKOUT_URL` vazio mantém a compra desativada.
- `/downsell.html`: «O Meu Primeiro Vaso», copy recebida e preservada, referência €7,90 e oferta €4,90. PASSO 3, alternativa ao plano de horta em sete dias. Página com os mesmos estilos dos upsells e checkout independente, ainda não enviado; `DOWNSELL_CHECKOUT_URL` vazio mantém a compra desativada. Recusa «Não, obrigado. Quero seguir apenas com a Botica Viva.» para `/obrigado.html`, sem bloquear o acesso ao plano adquirido.
- `/oferta-final.html`: «A Minha Botica Organizada», PASSO 4 DE 4, copy recebida e preservada. Kit digital para identificar recipientes, manter inventário e organizar compras; referência €9,90 e oferta/CTA €3,70 fornecidos pelo utilizador. Configuração `FINAL_OFFER_CHECKOUT_URL` vazia: compra desativada até envio do checkout próprio. Recusa «Não, obrigado. Quero aceder aos meus produtos.» para `https://consumer.hotmart.com/`, permitindo consultar as compras sem exigir esta oferta.

O Upsell 2 é o «PASSO 3», complementar ao plano de horta em sete dias. Preservados os quatro parágrafos, os três benefícios e o CTA de recusa «Não, obrigado. Quero continuar apenas com o plano de 7 dias.». A recusa aponta para `https://consumer.hotmart.com/`, onde o comprador consulta a compra anterior; não inventar uma ligação de entrega do novo plano. A página tem configuração independente e é gerada pelo mesmo script do Upsell 1, sem alterar o HTML ou a recusa da primeira página.

Como a copy do Upsell 2 pressupõe que a pessoa adquiriu o plano de sete dias, a ativação futura deve apresentá-lo após aprovação do Upsell 1. Não encaminhar automaticamente a recusa do Upsell 1 para esta página nem interpretar parâmetros de URL como prova de compra. O redirecionamento no painel Hotmart continua por configurar e testar.

**Entregável PDF do Upsell 2:** em 23/10/2026, o utilizador forneceu o guia de manutenção de 30 dias e pediu a mesma edição estética do Upsell 1. Criado `../../output/pdf/botica-viva-mantem-a-tua-horta-viva-30-dias.pdf`, com 43 páginas A4, trinta tarefas, seis fichas com fotografia, diagramas de demonstração e seis páginas de fichas para imprimir. Os 541 fragmentos de texto/células foram conferidos sem faltas; todas as páginas foram renderizadas e revistas visualmente. Fontes e decisões em `upsell-2-pdf/README.md`. Original preservado; PDF pago fora da exportação pública. Carregamento na Hotmart e teste de entrega continuam pendentes. Não foram alterados os checkouts nem as páginas do funil.

O downsell destina-se a quem recusa a horta completa; não é mais uma compra obrigatória depois de aceitar o Upsell 1. A cópia limita a entrega ao cultivo de um vaso de hortelã e aos primeiros sete dias. Não foi criado o entregável nem alterados os links das páginas anteriores nesta tarefa; o encadeamento final será configurado com os checkouts e a copy da oferta final. URL própria: `https://ervasportuguesas.vercel.app/downsell.html`. Template em `../../templates/downsell.html`; geração, testes e exportação reutilizam os scripts dos upsells.

A oferta final serve os diferentes caminhos descritos na copy, independentemente de a pessoa cultivar ou comprar ervas preparadas. URL própria: `https://ervasportuguesas.vercel.app/oferta-final.html`; template em `../../templates/oferta-final.html`. Reutiliza o mesmo CSS e gerador, sem modificar as páginas anteriores. As quatro páginas estão criadas; pagamento, encaminhamento após aceitação/recusa e entrega dos complementos continuam por configurar e testar na Hotmart. Não anunciar o funil como integrado apenas por os endereços estarem publicados.

Não foram criadas páginas vazias nem links para etapas inexistentes. A ordem de aceitação/recusa entre as quatro etapas e o destino após cada pagamento ainda precisam de ser definidos; não supor automaticamente que todas as pessoas devem passar por todas as páginas. Até lá, a recusa do Upsell 1 mantém a saída direta para o acesso comprado.

Usar o domínio Vercel atual com caminhos próprios, como combinado com o utilizador. Não criar projetos, domínios ou subdomínios separados. Não foi configurado o redirecionamento da Hotmart nem alterado o percurso de compra da landing.

O conteúdo das ofertas adicionais só pode ser entregue depois de existir. Não usar o endereço público ou parâmetros como prova de pagamento. O MVP sem login e a ajuda Hotmart atuais permanecem como estavam.

## Verificações e pendências desta etapa

- Texto em português de Portugal; aplicação online identificada como entrega principal.
- Preços, acesso vitalício e garantia preservados das condições confirmadas.
- Order bump, upsell de um clique, cupões e encaminhamento por oferta no painel Hotmart: **não verificado**.
- Página Upsell 1 com `noindex`, CSP restritiva, recursos locais e dois estados de compra testados. Testes em `../../scripts/check-upsell.mjs`; segurança em `11-SEGURANCA-UPSELL.md`.
- Ticket médio e margem: preparação em `03-CONTAS.md`; sem taxas, custos, CPA e adesões observadas não há validação de rentabilidade.
- Avaliação interna: 8,5/10 para fidelidade à copy, consistência com a página de obrigado e funcionamento técnico local. Não é uma medição de conversão nem uma validação visual: o navegador está indisponível. Compra, entrega do complemento e integração Hotmart continuam pendentes.

## Referência anterior do lançamento

Produto **Botica Viva · 8746348**, ferramenta digital de consulta de plantas e preparações caseiras. Não há envio físico. O utilizador confirmou manter Básico e PRO, ambos com acesso vitalício e garantia de 7 dias. Não foram criados bumps, descontos, assinaturas ou upsells novos.

## Descrição comum, já observada no checkout

> A Botica Viva é uma Web App dedicada aos saberes tradicionais sobre ervas e infusões. Reúne orientações práticas sobre preparação, conservação e utilização responsável, com conteúdos organizados para uma consulta simples e acessível no dia a dia.

## Textos de cada oferta, prontos para revisão na Hotmart

**Básico · €7,90:** Web app com 38 fichas de plantas, fotografias, utilizações, preparação e cuidados. Inclui seis módulos, favoritos e registos no navegador. Acesso vitalício e garantia de 7 dias, conforme condições da compra na Hotmart.

**PRO · €14,90:** Todo o Básico, mais oito fichas de infusões, cultivo de seis plantas e quatro modelos para imprimir. Consulta no navegador, com registos locais. Acesso vitalício e garantia de 7 dias, conforme condições da compra na Hotmart.

O acesso vitalício é uma condição confirmada pelo utilizador. Não afirmar envio de e-mail próprio ou entrega em dois minutos: não confirmados. O contacto real do produtor continua por definir. Não foram alterados campos da conta Hotmart nesta execução.

## Entrada após aprovação

- Básico: página de obrigado `https://ervasportuguesas.vercel.app/obrigado-basico.html`, com botão para `https://ervasportuguesas.vercel.app/app/`.
- PRO: página de obrigado `https://ervasportuguesas.vercel.app/obrigado-pro.html`, com botão para `https://ervasportuguesas.vercel.app/pro/`.
- Página comum, caso a plataforma não permita separar por oferta: `https://ervasportuguesas.vercel.app/obrigado.html`.
- Primeira ação: abrir «Plantas», procurar uma espécie, ler os quatro blocos e criar um registo. A ligação pode ser guardada nos favoritos.
- Apoio: contacto direto do produtor por definir; alternativa atual é consultar o contacto do produtor nos detalhes da compra Hotmart. Não foi enviada uma mensagem de teste.

As páginas estão prontas; a configuração do redirecionamento na Hotmart e a mensagem de entrega não foram verificadas. Sem login no MVP por decisão do utilizador: não existe validação de compra ou bloqueio automático por plano. A página comum pede a escolha do plano e não prova pagamento.

O PRO existente dentro do Básico mantém gatilho após primeiro resultado e recusa persistente. €14,90 é preço integral, sem crédito automático da primeira compra. Ticket médio do lançamento não calculado: não há mistura de vendas ou taxas de adesão observadas e não foram inventadas previsões.
