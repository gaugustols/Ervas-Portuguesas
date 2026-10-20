# CONTEXTO · Botica Viva

## Projeto
- Nome: Botica Viva · slug: `botica-viva-2026-10-19` · criado em 19/10/2026.
- Tipo: produto informativo digital; aplicação estática local sem conta.
- Etapa: webapp local validado; página de obrigado criada; entrega integrada do webapp pendente.

## Referência
- Oferta atual: `../../index.html`, secção de preços, 19/10/2026.
- Skill utilizada: `../../creator-webapp/SKILL.md` e respetivo template, referências e verificador.
- Não existiam `02`, contexto ou materiais finais do produto. O utilizador autorizou criar conteúdo original a partir da oferta.
- A página inclui alegações de saúde que não constituem validação clínica. Não reproduzir promessas de cura, substituição de medicamentos ou prova inexistente.

## Público
- Adultos de língua portuguesa interessados em ervas tradicionais, identificação responsável, preparação alimentar e organização de uma pequena botica doméstica.
- Entrada pela landing page existente. Acesso pós-compra ainda não configurado.

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
- Básico local: `http://127.0.0.1:4174/app/`.
- PRO local: `http://127.0.0.1:4174/pro/`.
- Checkouts da landing configurados: Básico `https://pay.hotmart.com/P108062599Y?off=dv3haixa`; PRO `https://pay.hotmart.com/P108062599Y?off=uszcskzv`.
- O checkout interno do webapp continua como `#PLACEHOLDER-CHECKOUT-PRO` (botão inativo); não foi alterado pela configuração da landing.
- Nenhum domínio de acesso ou sistema de entrega pós-compra foi definido; confirmado novamente pelo utilizador em 20/10/2026.
- Página de obrigado: `../../obrigado.html`, com configuração em `../../lib/thank-you-config.mjs`. Sem URL de app, usa apenas a consulta de compras da Hotmart. Endereço previsto na hospedagem existente: `https://ervasportuguesas.vercel.app/obrigado.html`; confirmar após deploy. Não usar como entrega direta do webapp até existir área de acesso real.
- A exportação da landing para a Vercel não inclui estas pastas. Não existe proteção de acesso só por separar ficheiros; requer uma plataforma de entrega se se pretender controlo por compra.

## Decisões
- 19/10/2026 · Conteúdo original autorizado pelo utilizador; nenhuma autoria clínica inventada.
- 19/10/2026 · Duas versões autónomas: conteúdo pago PRO fora do HTML do Básico.
- 19/10/2026 · Template ampliado para incluir a experiência exigida pela própria skill: biblioteca, boas-vindas, evidência real, painel e oferta única dispensável. Sem novas bibliotecas.
- 19/10/2026 · Imagens de botânica com licenças abertas e atribuição; fontes e imagens locais, sem dependência de CDN em execução.
- 19/10/2026 · Sem login, backend ou subscrição: não solicitados. Não confundir armazenamento local com controlo de acesso ou sincronização.
- 19/10/2026 · Manual PDF para acesso após compra na Hotmart. O utilizador confirmou que o endereço público e o contacto de apoio ainda não estão definidos; documento assinalado como versão para revisão, sem ligações de acesso inventadas.
- 20/10/2026 · Página de obrigado a partir das skills locais: uma ação principal, instruções D0, FAQ e ajuda Hotmart, PT-PT e sem scripts no comprador. Sem alegar aprovação de pagamento por parâmetros. Não publicados os conteúdos pagos do Básico/PRO.

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
- Escolher a área de acesso HTTPS que identifica comprador/plano e definir apoio real; preencher `WEBAPP_ACCESS_URL`/`SUPPORT_URL`, verificar ambos os planos e só então ativar o URL de obrigado para compras aprovadas na Hotmart. O manual PDF continua por atualizar com esses dados. Rever profissionalmente conteúdo e alegações de saúde antes da comercialização.
