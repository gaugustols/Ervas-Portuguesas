# Checkout, upsell e acesso · Botica Viva · 23/10/2026

## Desenvolvimento atual

**Estado: Upsell 1 gerado e verificado localmente; compra desativada, à espera do checkout próprio.** Skill: `.agents/skills/checkout-upsell`. O utilizador definiu um funil comum para Básico e PRO e decidiu enviar a própria copy de Upsell 1, Upsell 2, downsell e oferta final. As sugestões anteriores de upgrade e de novos complementos foram substituídas por esta decisão.

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

**Copy:** fornecida pelo utilizador e preservada no template, incluindo «PASSO 2», «Já tens o guia», os parágrafos, os três benefícios e a linha de garantia/acesso/Hotmart. A oferta propõe escolher três plantas, reunir materiais e montar os primeiros vasos em sete dias, respeitando as condições do espaço. O conteúdo do novo entregável não foi criado nesta tarefa.

**Preço:** €9,50. Referência de €29,90 apresentada na copy do utilizador e preservada; não foi consultado um histórico independente desse preço. Não foram acrescentadas contagens regressivas, vagas, testemunhos ou números de vendas.

**Configuração:** `../../lib/upsell-config.mjs`, variável `UPSELL1_CHECKOUT_URL` vazia. O utilizador confirmou que ainda não há checkout e autorizou desenvolver a página para inserir a ligação depois. O botão está nativamente desativado e identificado por «Compra indisponível de momento». O marcador `#PLACEHOLDER-CHECKOUT` é apenas uma convenção interna, não um destino clicável publicado.

**Aceitação:** «Acrescenta agora à tua Botica Viva», preparada para um checkout próprio da Hotmart. Um link comum não é, por si só, uma integração de compra de um clique. A validação do gerador rejeita destinos inesperados, HTTP e URLs com credenciais.

**Recusa:** «Não, obrigado. Quero continuar ao meu acesso.» → `https://ervasportuguesas.vercel.app/obrigado.html`, com escolha do plano adquirido. Esta opção funciona sem JavaScript e não exige aceitar uma compra adicional.

## Próximas páginas do mesmo funil

- `/upsell-2.html`: aguarda copy, preço e checkout do utilizador.
- `/downsell.html`: aguarda copy, preço e checkout do utilizador.
- `/oferta-final.html`: aguarda copy, preço e checkout do utilizador.

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
