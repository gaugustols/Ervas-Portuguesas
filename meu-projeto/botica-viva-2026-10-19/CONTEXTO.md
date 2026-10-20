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
- Configurar `/obrigado.html` no estado de compra aprovada na Hotmart e testar as duas ofertas; definir apoio real e atualizar o manual PDF com os acessos publicados. Após validar o MVP, implementar login/autorização por compra e revogação por reembolso. A revisão profissional do conteúdo e das alegações de saúde permanece necessária.
