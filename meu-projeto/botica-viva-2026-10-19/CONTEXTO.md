# CONTEXTO · Botica Viva

## Projeto
- Nome: Botica Viva · slug: `botica-viva-2026-10-19` · criado em 19/10/2026.
- Tipo: produto informativo digital; MVP estático público sem login, por decisão do utilizador.
- Etapa: publicação das versões Básico e PRO no domínio existente, com acesso pela página de obrigado; redirecionamento no painel Hotmart ainda não configurado por nós.

## Referência
- Oferta atual: `../../index.html`, secção de preços, 19/10/2026.
- Skill utilizada: `../../creator-webapp/SKILL.md` e respetivo template, referências e verificador.
- Não existiam `02`, contexto ou materiais finais do produto. O utilizador autorizou criar conteúdo original a partir da oferta.
- A página inclui alegações de saúde que não constituem validação clínica. Não reproduzir promessas de cura, substituição de medicamentos ou prova inexistente.

## Público
- Adultos de língua portuguesa interessados em ervas tradicionais, identificação responsável, preparação alimentar e organização de uma pequena botica doméstica.
- Entrada pela landing page existente. Entrega por ligações públicas sem login nesta fase de validação.

## Promessa escolhida
- Aprender a conhecer e preparar ervas com método, criar fichas e organizar a rotina.
- Primeiro resultado: uma ficha de planta identificada e uma decisão de utilização registada, no dia 1 / até 72 horas. Não é um prazo de efeito sobre sintomas.
- Marcos: primeira ficha, módulo 1 com evidência, método documentado e rotina definida.

## Oferta
- Básico €7,90: guia completo, trilha, ferramenta, biblioteca e painel.
- PRO €14,90: Básico + Caderno Ilustrado de Infusões + Guia de Cultivo e Conservação + Fichas Práticas para Imprimir.
- Garantia comunicada na página: 7 dias, tratada pelo vendedor/plataforma fora da app.
- Sem order bump ou subscrição definidos.
- Oferta PRO dentro do Básico só após primeiro resultado; dispensável e sem checkout inventado.

## Identidade
- Fundo quase preto, verde #0b6b2c, verde claro de apoio, texto branco, Plus Jakarta Sans local.
- Português de Portugal. Tom próximo, claro, educativo. Evitar alegações clínicas sem suporte e associação inventada a profissionais.

## Links e placeholders
- Básico: `https://ervasportuguesas.vercel.app/app/`; PRO: `https://ervasportuguesas.vercel.app/pro/` (verificar após o deploy desta alteração).
- Prévia integrada: `http://127.0.0.1:4173/app/` e `http://127.0.0.1:4173/pro/`.
- Checkouts da landing configurados: Básico `https://pay.hotmart.com/P108062599Y?off=dv3haixa`; PRO `https://pay.hotmart.com/P108062599Y?off=uszcskzv`.
- O checkout interno do Básico usa o mesmo link PRO da landing, após a primeira ficha e conclusão de m1; recusa persistente preservada.
- Obrigado comum: `https://ervasportuguesas.vercel.app/obrigado.html`, com escolha do plano comprado. Versões individuais: `/obrigado-basico.html` e `/obrigado-pro.html`.
- Configuração em `../../lib/thank-you-config.mjs`; o contacto próprio de apoio continua por definir, com alternativa real de ajuda Hotmart.
- A exportação copia apenas o HTML compilado e os 37 recursos de cada versão para `public/app/` e `public/pro/`. Fontes do projeto, documentação e skills continuam fora da publicação.
- Sem controlo de acesso: qualquer pessoa com a ligação pode abrir a respetiva versão. `noindex` apenas orienta os motores de pesquisa. Não há validação de compra, bloqueio por plano nem revogação automática nesta fase.

## Decisões
- 19/10/2026 · Conteúdo original autorizado pelo utilizador; nenhuma autoria clínica inventada.
- 19/10/2026 · Duas versões autónomas: conteúdo pago PRO fora do HTML do Básico.
- 19/10/2026 · Template ampliado para incluir a experiência exigida pela própria skill: biblioteca, boas-vindas, evidência real, painel e oferta única dispensável. Sem novas bibliotecas.
- 19/10/2026 · Imagens de botânica com licenças abertas e atribuição; fontes e imagens locais, sem dependência de CDN em execução.
- 19/10/2026 · Sem login, backend ou subscrição: não solicitados. Não confundir armazenamento local com controlo de acesso ou sincronização.
- 19/10/2026 · Manual PDF para acesso após compra na Hotmart. O utilizador confirmou que o endereço público e o contacto de apoio ainda não estão definidos; documento assinalado como versão para revisão, sem ligações de acesso inventadas.
- 20/10/2026 · Página de obrigado a partir das skills locais: uma ação principal, instruções D0, FAQ e ajuda Hotmart, PT-PT e sem scripts no comprador. Sem alegar aprovação de pagamento por parâmetros. Não publicados os conteúdos pagos do Básico/PRO.
- 20/10/2026 · Decisão posterior: utilizador autorizou publicar o webapp sem login como MVP, com melhorias de acesso após validação. Usar o domínio existente e a integração Git/Vercel; não criar um projeto separado nem comprar domínio. Obrigado com escolha explícita de plano; sem tratar URLs ou parâmetros como prova de pagamento.

## Arquivos
- `02-OFERTA.md` · escrito: correspondência com a oferta e limites.
- `src/` · escrito: conteúdo, template, estilos e motor.
- `app/` · funcionando: entregável Básico autónomo.
- `pro/` · funcionando: entregável PRO autónomo.
- `scripts/` · escrito: geração, fotografias e verificação.
- `08-WEBAPP.md` · escrito: validação, recusa total, nota interna 8,8/10 e próximos passos.
- `manual/` e `../../output/pdf/botica-viva-manual-de-acesso.pdf` · escrito e verificado: manual de cinco páginas, PT-PT, com acesso e apoio por configurar.
- `04-PAGINA-OBRIGADO.md` e `11-SEGURANCA-OBRIGADO.md` · escritos: decisões, configuração Hotmart, verificações e limites da nova página.

## Próxima ação
- 23/10/2026 · Decisão posterior: utilizador quer um funil comum para Básico e PRO e fornecerá a copy de Upsell 1, Upsell 2, downsell e oferta final. Substitui a recomendação de upgrade PRO e as propostas de complemento anteriores. Upsell 1 fornecido: «A Minha Horta Medicinal em 7 Dias», referência €29,90 e oferta €9,50. Criada `/upsell-1.html` na estética da página de obrigado, com `lib/upsell-config.mjs`, template/gerador, estilos e testes. Utilizador confirmou que ainda não há checkout e pediu para o inserir depois: compra desativada, recusa para `/obrigado.html`. As próximas três páginas aguardam as respetivas copys; não há encaminhamento para páginas inexistentes. Landing, aplicação, manual e obrigado preservados. Relatório em `11-SEGURANCA-UPSELL.md`; integração automática Git/Vercel, sem mudanças de configuração da hospedagem.
- 23/10/2026 · Utilizador invocou a skill `checkout-upsell` da pasta `.agents`. Textos dos dois checkouts e propostas internas em `06-CHECKOUT-E-UPSELL.md`; modelo de ticket bruto e dados em falta em `03-CONTAS.md`. Recomendado oferecer os extras do PRO após o Básico, com preço e checkout próprios ainda por definir. Pergunta de escolha enviada ao utilizador. Não usar o checkout PRO integral como se cobrasse apenas a diferença; não ativar bump nem vender conteúdo ainda não criado. Recursos Hotmart de bump, um clique e encaminhamento continuam não verificados. Landing, aplicação, manual e páginas de obrigado preservados nesta etapa.
- 23/10/2026 · Correção de escopo: o utilizador não autorizou a reescrita integral da copy e pediu a reposição. Restaurar a landing e as fontes/builders associados ao commit `875f3b9`, preservando webapp e manual. Não reaplicar a reescrita em builds nem em tarefas futuras sem pedido explícito.
- 23/10/2026 · Alinhamento do lançamento: checkouts públicos confirmam produto 8746348, ofertas base €7,90/€14,90 e garantia de 7 dias. O utilizador confirmou manter Básico e PRO, acesso vitalício e apoio ainda por definir. Landing reposicionada como ferramenta digital com a entrega existente, sem referências à obra antiga, cura, envio em dois minutos ou escassez sem prazo real. «Trilha» substituída por «percurso» na interface, mantendo as rotas. Manual atualizado com acessos reais e conteúdo atual, ainda em revisão pelo apoio e teste de entrega pendentes. Condições em `12-LANCAMENTO.md` e textos de checkout/acesso em `06-CHECKOUT-E-UPSELL.md`. Não declarar lançamento validado sem compra e entrega testadas.
- 22/10/2026 · Fichas das 38 plantas uniformizadas em quatro blocos: utilizações, preparação, modo de usar e cuidados, nos dois planos. Pesquisa ampliada pelo resumo, atalhos com foco e fontes por ficha. Mantidos IDs/registos, fotografias, oferta e separação PRO. Não foram atribuídas doses medicinais universais; o louro segue produto alimentar identificado. Fontes e testes documentados em `08-WEBAPP.md` e `11-SEGURANCA.md`. QA visual pendente por indisponibilidade do navegador.
- Configurar `/obrigado.html` no estado de compra aprovada na Hotmart e testar as duas ofertas; definir apoio real e atualizar o manual PDF com os acessos publicados. Após validar o MVP, implementar login/autorização por compra e revogação por reembolso. A revisão profissional do conteúdo e das alegações de saúde permanece necessária.
