# Contas do checkout e upsell · Botica Viva

23/10/2026 · Estado: dados comerciais existentes registados; cálculo de margem por completar. Este documento é interno e não contém uma previsão de vendas.

## Valores confirmados

- Básico: €7,90.
- PRO direto: €14,90.
- Diferença entre planos: €7,00, apenas uma conta; preço de upgrade não aprovado.
- Garantia: 7 dias.
- Acesso: vitalício, sem subscrição definida.

## Ticket médio bruto, antes das taxas

**Decisão posterior do utilizador:** um único funil para Básico e PRO. O Upsell 1 «A Minha Horta Medicinal em 7 Dias» tem preço indicado de €9,50. Ainda não há checkout nem vendas desta oferta. A proposta anterior de upgrade do Básico para PRO não é a oferta do funil atual.

Quando o Upsell 1 estiver ativo, se `a` for a proporção de compradores dos dois planos que o compram:

`ticket bruto com Upsell 1 = ticket atual + €9,50 × a`.

Se uma pessoa aceitar apenas esse complemento, o total bruto é €17,40 após o Básico ou €24,40 após o PRO. Estes são totais aritméticos, não previsões de adesão ou lucro. Os preços das restantes etapas e as regras de passagem ainda não foram enviados; não somar ofertas sem considerar os caminhos e as taxas de aceitação condicionais.

Se `p` for a proporção das vendas diretas do PRO, entre 0 e 1:

`ticket atual = €7,90 × (1 − p) + €14,90 × p = €7,90 + €7,00 × p`.

Sem a mistura real das vendas, o valor atual não pode ser reduzido a um único número. O intervalo possível, considerando apenas os dois planos, é €7,90–€14,90.

Para a coorte que compra o Básico, se o upgrade tiver preço `U`, adesão `a`, e o bump tiver preço `B`, adesão `b`:

`ticket proposto da coorte Básico = €7,90 + U × a + B × b`.

Não adicionar o valor completo do PRO às vendas de upgrade nem contar o mesmo comprador duas vezes na média. Enquanto não houver upgrade ou bump ativos, os termos adicionais são zero. Se ambos estiverem disponíveis, medir as adesões na mesma coorte e controlar quem já tem cada conteúdo.

## Dados ainda necessários

| Dado | Estado |
| --- | --- |
| Conteúdo e preço do upsell | Escolha do utilizador pendente |
| Bump criado, preço e oferta Hotmart | Proposta interna; não ativo |
| Taxas percentuais e fixas reais em EUR | Não verificadas na conta |
| Impostos aplicáveis ao vendedor | Não fornecidos |
| Custo de entrega, alojamento e apoio por venda | Não fornecido |
| CPA observado | Não fornecido |
| Taxa de reembolso observada | Não fornecida; não confundir garantia com taxa de reembolso |
| Mistura Básico/PRO e adesão aos extras | Sem dados observados |

## Critério para o teste de caixa

`margem Básico = €7,90 − taxas − impostos − custos − apoio − provisão de reembolsos`.

O front só se paga sozinho se essa margem cobrir o CPA, sem depender do bump ou do upsell. Não é possível confirmar esta condição com os dados atuais.

O script `.agents/skills/checkout-upsell/scripts/economia.py` só deve ser executado com entradas documentadas. Não foi criado um `contas.json` com zeros ou taxas inventadas para aparentar lucro. O script identifica a moeda como R$; ao usá-lo com valores em EUR, adaptar a apresentação numa ferramenta do projeto e não confundir moedas. Valores de cenários devem ser rotulados internamente como premissas e separados das métricas observadas.
