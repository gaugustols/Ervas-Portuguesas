# FAQ da Botica Viva

Componente do anexo adaptado para a landing estática existente, abaixo da garantia e antes do rodapé. Mantém o título grande, fundo quase preto, respostas em caixas arredondadas e ícone + que muda para x ao abrir. A primeira pergunta começa aberta; só uma fica aberta de cada vez e é possível fechar todas.

- Componente: `components/ui/frequently-asked-questions-with-accordion.tsx`.
- Primitivas Radix: `components/ui/frequently-asked-questions-with-accordion-utils/accordion.tsx`.
- Perguntas e contacto opcional: `lib/faq-config.ts`.
- Estilos isolados `.faq-*`: `assets/nova-pagina/css/styles.css`.
- Geração: `npm run build:faq`, já incluída no build principal. Gera HTML no marcador `faq:start` e o módulo local `assets/nova-pagina/js/faq.js`.

O projeto já usa a estrutura shadcn (`components.json`), TypeScript, Tailwind e o alias `@/components/ui`; não precisa de nova configuração. Motion e Radix Accordion são as dependências novas pedidas no anexo; lucide-react e as fontes locais já existiam. Não há imagens novas ou serviços externos para este FAQ.

O conteúdo está em português de Portugal e corresponde aos planos atuais e à garantia existente. Não foram utilizados os exemplos ingleses, política de 30 dias, prazos de resposta, chat, envio físico ou e-mail fictício do modelo. `supportEmail` permanece vazio e o componente omite o link de contacto enquanto não existir um e-mail válido.

As primitivas mantêm a semântica do acordeão, estados ARIA, interação por Enter/Espaço e navegação por setas/Home/End. A animação respeita a preferência por movimento reduzido. O título e a primeira resposta são pré-renderizados para evitar uma secção vazia antes do JavaScript.

Verificação realizada: build completo, TypeScript, verificações existentes de headline e depoimentos, sintaxe do JavaScript e 23 pedidos HTTP de recursos locais, incluindo fontes referenciadas pelo CSS. Chrome isolado em 375, 768 e 1440 px: abertura única, fecho de todas as respostas, teclado, foco visível, associações ARIA, movimento reduzido e console sem erros de JavaScript ou hidratação. Capturas desktop/mobile revistas; não foi utilizado um telemóvel físico ou leitor de ecrã. A repetição do build manteve o HTML e o bundle idênticos. Removendo apenas o bloco FAQ e o seu script do HTML gerado, o restante coincide com a versão anterior.
