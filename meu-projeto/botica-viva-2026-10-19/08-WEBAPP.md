# Webapp · Botica Viva

## Resultado

Entregável original em português de Portugal, criado com a skill `creator-webapp`. Versões estáticas autónomas em `app/index.html` (Básico) e `pro/index.html` (PRO). Mantida a identidade preta, verde e branca e a família Plus Jakarta Sans. Nenhum ficheiro da landing page foi alterado.

O template da skill forneceu a base de dados JSON, gravação local, ferramenta e gatilhos. Foi ampliado para cumprir a experiência que a própria skill exige: boas-vindas, biblioteca pesquisável, evidências escritas, painel, favoritos, exportação e impressão. Corrigido o comportamento do template que podia mostrar várias ofertas e voltar a mostrar ofertas dispensadas.

## Conteúdo entregue

| Material | Básico | PRO |
| --- | --- | --- |
| Guia de plantas com 32 fichas e fotografias licenciadas | Sim | Sim |
| 72 temas de consulta: 64 sinais/condições e 8 contextos especiais | Sim | Sim |
| 6 módulos com objetivo, passos, exemplo, erro comum e evidência | Sim | Sim |
| 6 métodos de preparação, tabela de nutrientes e capítulo sobre aromas | Sim | Sim |
| Gerador de fichas, favoritos, progresso e exportação | Sim | Sim |
| 4 modelos copiáveis de organização | Sim | Sim |
| Caderno Ilustrado de Infusões: 8 fichas | — | Sim |
| Guia de Cultivo e Conservação: 6 plantas | — | Sim |
| Fichas Práticas para Imprimir: 4 modelos preenchíveis | — | Sim |

Os temas de consulta ajudam a formular perguntas e reconhecer limites. Não representam 64 tratamentos vegetais. A contagem não é uma validação de eficácia das alegações clínicas da landing. As fotografias servem para estudo, nunca como confirmação de identificação para ingestão. Quantidades e tempos de infusões seguem o produto alimentar identificado; não foram inventadas doses terapêuticas.

Conteúdo novo sem atribuição à autora, especialistas ou compradores da página. Referências de consulta exibidas na app: NCCIH, NHS, EMA, RHS e SNS. Fotografias locais de licenças abertas, com autor, original, licença e indicação de redimensionamento/enquadramento. A revisão visual substituiu três imagens pouco claras por fotografias de plantas/partes vegetais.

## Primeiro resultado e marcos

- Dia 1 / até 72 horas: guardar uma ficha de planta identificada e documentar uma decisão responsável, mesmo que seja não utilizar até esclarecer.
- O módulo 1 só conclui com uma ficha guardada, evidência escrita e confirmação dos passos.
- Outros marcos: método documentado, rotina definida e módulos concluídos. O painel mede ações reais guardadas; não mede melhoria clínica.

## Teste de recusa total

| Percurso de quem compra só o Básico e recusa o PRO | Onde está |
| --- | --- |
| Receber o ficheiro/acesso após pagamento | A plataforma de checkout/entrega ainda precisa de configuração; não foi inventada integração |
| Abrir o material recebido | `app/index.html`, com recursos locais |
| Saber por onde começar | Início → «Começar o primeiro passo» |
| Identificar um produto alimentar e ler os cuidados | Trilha m1, passo 1 → Plantas |
| Decidir como utilizar ou não utilizar | Trilha m1, passo 2; cuidados na ficha da planta |
| Criar e guardar o registo | Ficha prática; campos obrigatórios, decisão e confirmação |
| Documentar o primeiro resultado | Trilha m1, passo 3; evidência escrita |
| Recusar o próximo plano | «Agora não», persistente após recarregar |
| Continuar sem o PRO | Todos os seis módulos, guia, ferramenta, biblioteca e painel continuam disponíveis |
| Guardar uma cópia fora do navegador | Progresso → exportar dados ou descarregar ficha |

Não há passo de aprendizagem dependente do PRO. **A entrega após pagamento continua pendente**: o ficheiro está pronto, mas ainda não existe plataforma/destino de acesso definido. O gate do percurso de pagamento até acesso não deve ser apresentado como operacional.

## Oferta por progresso

Uma única oferta real, o PRO de €14,90, após conclusão de m1. Nunca antes da primeira ficha/evidência. No máximo um card por ecrã; «Agora não» elimina-o também de «Próximo nível» e persiste ao recarregar. O PRO não mostra outra oferta. O preço é integral, sem crédito ou suplemento inventado.

`#PLACEHOLDER-CHECKOUT-PRO` permanece intencional e produz botão desativado. Para ativar, inserir URL HTTPS real em `scripts/gerar.mjs` e gerar novamente. Nenhum conteúdo do caderno, cultivo ou fichas PRO está no JSON do Básico. A separação de pastas não é autenticação.

## Validação executada

- `node --check`: motor, conteúdo, gerador, aquisição de imagens, testes e servidor.
- `scripts/gerar.mjs`: 32 plantas, 72 temas, 6 módulos em cada plano; sem dependências novas.
- `creator-webapp/scripts/verificar_site.py` em cada pasta: Básico 0 falhas / 1 placeholder de checkout intencional; PRO 0 falhas / 0 pendências. Usado Python 3.14.4 portátil oficial em pasta temporária, sem instalação no sistema.
- Chrome isolado via CDP: larguras 375, 768 e 1440 px; rotas de ambos os planos sem transbordo horizontal; primeiro CTA visível em 375 px; imagens, CSS, JavaScript e as duas fontes com HTTP 200.
- Testes de interação: módulo 1 bloqueado sem ficha, rascunho após recarregar, gravação de ficha, conclusão com evidência, oferta única após gatilho, checkout desativado, dispensa persistente, pesquisa sem acentos, favoritos, filtro de temas e exportação JSON com a ficha real.
- PRO: oito fichas de infusão, quatro modelos preenchíveis, persistência dos campos e geração de PDF pela impressão do navegador. Modelo de planta de teste em uma página A4.
- Console sem erros JavaScript e sem respostas HTTP de erro nos percursos testados. Servidor local não expõe os ficheiros de `src/` por travessia de caminho.
- Verificações suplementares: CTA visível também em 375×667, navegação por Enter, falha de armazenamento tratada com aviso e abertura autónoma `file://` com as fontes locais carregadas.
- Capturas desktop/mobile revistas e quadro visual das 32 imagens inspecionado; artefactos de teste guardados apenas na pasta temporária.

O navegador interno não estava disponível nesta sessão; foi utilizado Chrome headless real com perfil de teste isolado. Não foram realizados testes manuais em telemóvel físico ou com leitor de ecrã. Os testes não constituem revisão clínica ou botânica profissional.

## Autoavaliação

A skill não fornece escala numérica. A seguinte grelha interna deriva dos seus critérios «Pronto quando», com corte de 1,5/2 por dimensão:

| Dimensão | Nota / 2 | Evidência / limite |
| --- | --- | --- |
| Primeiro resultado autónomo no Básico | 2,0 | Percurso completo na app, sem compra adicional |
| Experiência e utilidade | 1,8 | Trilha, ferramenta, painel e biblioteca; sem sincronização |
| Qualidade técnica e apresentação | 1,8 | Testes em três larguras e revisão visual; sem teste assistivo manual |
| Conteúdo e correspondência com oferta | 1,5 | Volume entregue; revisão profissional e alinhamento de alegações clínicas pendentes |
| Gatilhos e continuidade | 1,7 | Oferta/recusa testadas; checkout e entrega pós-compra pendentes |
| **Total interno** | **8,8 / 10** | **Funcionamento local validado; comercialização integrada ainda pendente** |

Revisões antes da entrega: menu mobile com todas as áreas visíveis, imagens com atribuição e fotografia apropriada, espera correta pela conclusão do download de teste e campos de impressão que acomodam texto.

## Operação e limites

Lançar `node meu-projeto/botica-viva-2026-10-19/servidor-app.mjs` para abrir as duas versões por HTTP. Também são ficheiros estáticos portáveis, sem compilação no dispositivo do comprador. O comportamento de armazenamento de páginas `file://` depende do navegador; para utilização estável entre sessões, entregar numa plataforma com origem HTTPS estável.

Os dados ficam no navegador, separados por plano. Não há conta, envio de fichas, medição de resultados clínicos, recolha de senhas, sincronização ou migração automática entre planos. Existe exportação, sem importação. Ficheiros de teste, perfil do navegador e Python portátil não integram o entregável.

O exportador da landing continua a copiar apenas a página existente e `assets/nova-pagina/`; não publica estes materiais na Vercel. Commit/push do código seguem a autorização permanente em AGENTS.md. Não foi executado deploy separado. O resultado do push e o estado Vercel do commit são comunicados na entrega.

## Próximo passo recomendado

Escolher a plataforma de entrega pós-compra para distribuir apenas o plano adquirido, porque é a peça que liga o pagamento ao acesso. Configurar os checkouts reais nessa etapa. Antes de comercializar o conteúdo novo, rever profissionalmente as alegações de saúde da oferta e a redação; não confundir aprovação dos testes técnicos com validação clínica.
