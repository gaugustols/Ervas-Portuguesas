# Segurança · página de obrigado

## Atualização · publicação do MVP sem login (20/10/2026)

O utilizador autorizou expressamente o acesso por link sem login para validar o produto. Por isso, `/app/` e `/pro/` passam a ser destinos públicos intencionais. Separação por pastas, `noindex` e identificação do plano na interface não constituem autenticação. A implementação não afirma validar compras e não restringe pessoas que recebam uma ligação partilhada.

- Exportação restrita: cada versão inclui 38 ficheiros — HTML, runtime, CSS, duas fontes, licença e 32 fotografias. A lista é derivada do HTML compilado e validada; não copia documentação, configurações, fonte de conteúdo, skills, credenciais, ZIPs ou testes.
- Cada app foi revisto com os verificadores locais: **zero falhas, zero avisos e zero achados automáticos de segurança**. O HTML mantém `noindex,nofollow` e `no-referrer`. Não foram introduzidos formulários de login, chaves, APIs externas ou dados de comprador em query strings.
- Teste de navegação pelo servidor recusa tentativas de travessia de diretórios, rotas de fonte e ficheiros internos. A exportação é comparada byte a byte aos ficheiros compilados; raiz pública limitada a landing, recursos, três páginas de obrigado e apps.
- Os nove falsos positivos `mask-image-*` e os avisos do runtime React da landing permanecem os mesmos, já triados abaixo. Os webapps usam o DOM nativo e não adicionam esses bundles.
- Chrome isolado: recursos HTTP de ambos os planos, 375/768/1440 px, primeira ficha, módulo com evidência, dispensa persistente de oferta, exportação e impressão passaram. Página de obrigado verificada também em 320 px. Sem erros JS ou de rede nos percursos testados.
- Após deploy, verificar 200 em `/app/`, `/pro/`, três páginas de obrigado e recursos; 404 em `meu-projeto/`, `.agents/`, `lib/`, `templates/`, ficheiros de contexto e ZIPs. Não existem login, controlo por compra ou revogação automática de acesso neste MVP.

## Registo inicial (antes da decisão de acesso por link)

## Escopo

Nova página e respetivos recursos, exportação pública e servidor local. Sem alterações a autenticação, permissões, GitHub ou configuração da Vercel. Não foi executado um deploy separado da integração Git existente. Não foi realizado um teste de invasão.

## Resultado local

**PASSA na revisão da página; entrega do webapp pendente.** `auditar_seguranca.py` da skill, executado num snapshot apenas da página e dos seus três recursos locais: quatro ficheiros, nenhum achado automático. `verificar_site.py`: zero falhas e zero avisos.

- `noindex,nofollow,noarchive`; política `no-referrer` para não transmitir o URL de retorno da compra a outros destinos.
- CSP em meta: sem scripts, formulários, frames, recursos externos ou alterações de base; CSS e fontes apenas locais. Não se afirma que existem cabeçalhos HTTP de segurança adicionais na hospedagem.
- Nenhuma leitura de nome, e-mail, estado de transação, plano ou destino a partir de query strings. Sem `innerHTML`, cookies, armazenamento, formulários ou tracking de conversão novo.
- Configuração de acesso HTTPS validada e escapada no build. Destinos HTTP, credenciais, portas especiais, endereços privados e controlos são recusados; contacto de apoio aceita `mailto:` simples sem query.
- A página não verifica aprovação de pagamentos nem substitui uma área autenticada. `noindex` e um URL pouco divulgado não são controlo de acesso. Não publicar conteúdos pagos diretamente nesta página.
- A exportação permite apenas `index.html`, `obrigado.html` e a pasta de recursos de produção existente. `meu-projeto/`, `.agents/`, `templates/`, `lib/`, relatórios e ZIPs ficam fora de `public/`.
- Ficheiros de testes, capturas e perfil do navegador ficam fora do repositório/publicação.
- A nova página não usa nem descarrega os bundles React existentes da landing; funciona sem JavaScript.

## Triagem da auditoria da pasta pública completa

O script original retorna «NÃO PASSA (9 críticos)» no bundle pré-existente `faq.js`. Os nove valores são classes `mask-image-*`: a regex encontra a sequência interna `sk-image-*` e confunde-a com um formato de chave. Todos os nove foram conferidos com o prefixo `ma`, confirmando os nomes CSS completos. **Falsos positivos; não são credenciais.** Nenhum verificador foi alterado para ocultar o resultado.

Os avisos `innerHTML`/`dangerouslySetInnerHTML` em `faq.js` e `vsl-player.js` pertencem ao runtime React incluído nos bundles existentes. A pesquisa nos componentes e nos clientes de origem não encontrou uso desses sinks na implementação autoral; FAQ vem da configuração local estática e a URL do vídeo é validada. Esses bundles não foram modificados por esta tarefa. A nova página não contém JavaScript.

## Pendências e verificação após publicação

- Endereço público autenticado do webapp e contacto próprio do produtor: não definidos pelo utilizador.
- Validação de compra, separação por plano e revogação por reembolso: não implementadas no entregável local; escolher a plataforma de entrega antes de ativar o fluxo.
- Redirecionamento por estado na Hotmart e percurso real Básico/PRO: não verificados; dependem da configuração da conta e dos acessos.
- Confirmar HTTP 200 da página/CSS/fontes e HTTP 404 de `.git`, `AGENTS.md`, `.agents/`, `meu-projeto/`, `templates/`, `lib/` e ZIP de branding após o deploy. O teste local passou nesses caminhos.
- Safari, dispositivos físicos e leitor de ecrã manual: não testados.
