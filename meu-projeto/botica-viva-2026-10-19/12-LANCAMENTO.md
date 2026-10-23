# Lançamento inicial · Botica Viva · 23/10/2026

**Correção posterior solicitada pelo utilizador:** a reescrita da landing foi anulada e os nove ficheiros da página e das suas fontes de geração voltaram à versão `875f3b9`. Abaixo fica o registo da auditoria anterior, não a descrição da copy atual. O teste `scripts/check-launch.mjs`, criado para impor a reescrita, foi removido. Web app, manual e condições confirmadas mantidos.

**Estado: ainda não validado de ponta a ponta.** Correções editoriais e verificações locais não substituem o teste de compra, entrega e apoio.

## Condições de referência

| Condição | Situação |
| --- | --- |
| Produto | Botica Viva, ID 8746348, confirmado nos dois checkouts públicos |
| Entrega | Web app de consulta de plantas e preparações caseiras, sem envio físico |
| Básico | €7,90 · 38 plantas, seis módulos, biblioteca, favoritos, fichas e progresso |
| PRO | €14,90 · Básico + oito fichas de infusões, cultivo de seis plantas e quatro modelos para imprimir |
| Garantia | 7 dias nos dados públicos de ambas as ofertas; não foi criado pedido de reembolso |
| Pagamento | PayPal e cartão observados; no ambiente desta consulta PayPal em EUR e cartão convertido para BRL. País Portugal e moeda final precisam de teste no checkout |
| Prazo de acesso | Vitalício, confirmado pelo utilizador em 23/10/2026 e incluído na comunicação. Sem prazo de expiração imposto pelo app atual |
| Suporte | Contacto próprio por definir. Ajuda atual aponta para contacto do produtor nos detalhes da compra Hotmart |
| Entrada | Ligações do Básico/PRO e páginas de obrigado existentes; redirecionamento na conta Hotmart não verificado |
| Manual PDF | Atualizado com ligações reais aos dois planos, 38 fichas e condições confirmadas. Continua em revisão porque o apoio e o percurso real de entrega ainda não foram validados |
| Plano comercial | Básico e PRO mantidos, conforme confirmação do utilizador em 23/10/2026 |

## Conteúdo e comunicação

As dez entradas complementares são Boldo-do-Chile, Aloé, Capim-limão, Quebra-pedra, Picão-preto, Erva-cidreira, Alecrim, Hortelã-grossa, Manjericão e Mastruz. Estão incluídas nas 38 plantas de cada plano, com fotografia principal e versão pequena, identificação, preparação, modo de usar e cuidados. Os nomes científicos e créditos permitem distinguir espécies com nomes populares semelhantes.

O teste automático `scripts/check-launch.mjs` verifica as dez entradas, ficheiros/fotografias HTTP, quantidades anunciadas, isolamento PRO, amostras, ligações de compra e preservação do Pixel. `scripts/testar-fichas.mjs` verifica as 38 fichas de cada plano num DOM em memória. Isto não equivale a revisão botânica ou clínica profissional.

A landing deixa de atribuir o produto à autora de uma obra diferente, de mostrar depoimentos sobre receção de livros e de prometer cura, entrega em dois minutos, milhares de utilizadores ou expiração de uma oferta sem prazo real. O acesso vitalício foi confirmado pelo utilizador e está explícito na oferta. Mantidos tema, cores, fontes, vídeo escolhido, âncora de preços, dois checkouts e Pixel PageView. A amostra passa a mostrar plantas efetivamente incluídas.

## Matriz do percurso solicitado

| Etapa | O que pode ser verificado nesta sessão | O que continua por concluir |
| --- | --- | --- |
| Landing no telemóvel | HTML e recursos por HTTP; regras responsivas existentes | Inspeção visual num telemóvel/navegador real, indisponível nesta sessão |
| Clique e produto | URLs dos dois CTAs; dados públicos com ID 8746348 | Clique num dispositivo e conferência visual |
| Preço, moeda, condições | Preços base EUR, nome, descrição, garantia e métodos públicos; acesso vitalício confirmado pelo produtor | País Portugal, moeda final e condições de acesso exibidas na plataforma |
| Pagamento | Nenhum dado introduzido, nenhuma transação iniciada | Recurso de teste autorizado na conta Hotmart; não pressupor que exista sandbox |
| Mensagem de acesso | Páginas de obrigado e ligações reais disponíveis | Configuração no painel e e-mail de entrega efetivamente recebido |
| Abrir como novo utilizador | Conteúdo, recursos e testes do motor sem conta | Navegador limpo e percurso completo depois de pagamento aprovado |
| Apoio | Ligação de ajuda Hotmart existente | Contacto do produtor, teste de resposta e instruções confirmadas |

O navegador não está disponível e não foi encontrado plugin Hotmart na pesquisa de integrações desta sessão. Não foi utilizado e-mail, dados pessoais ou pagamento real. Não houve alteração de configuração na Hotmart. Uma compra aprovada, um e-mail recebido ou um canal de suporte funcional não foram simulados nem declarados como concluídos.

O vídeo YouTube escolhido pelo utilizador foi preservado; a reprodução e o conteúdo do vídeo não foram revistos nesta sessão. O novo rótulo do botão descreve a ação de iniciar a reprodução, sem afirmar que já começou.

O build completo passou após repetir uma falha de gravação do HTML. TypeScript, headline, componente de avaliação arquivado, verificação de oferta e fichas passaram. A verificação da entrega encontrou oito cópias antigas de imagens na exportação local ignorada `public/`: removidos apenas esses ficheiros gerados, sem tocar nos originais. A exportação voltou a respeitar a lista de ficheiros usados por cada plano. A verificação estrutural do app mantém dois avisos de peso sobre fotografias preexistentes, sem falhas.

## Próxima ação que desbloqueia o lançamento

Definir o contacto de suporte e concluir o manual com esse dado. Na conta Hotmart do produto 8746348, conferir a moeda para Portugal, refletir o acesso vitalício confirmado, configurar entrega/obrigado e realizar o teste disponível na plataforma com um novo comprador. Validar a mensagem recebida, a entrada no plano correto e a resposta do apoio antes da divulgação.

Nota interna: conteúdo e preparação técnica revistos; sem nota de prontidão comercial enquanto o percurso de pagamento e entrega não estiver concluído.
