# Hook Question na landing page

O projeto continua a publicar `index.html` e os recursos em `assets/nova-pagina/`.
React e TypeScript são usados para gerar o bloco da headline durante a compilação.
A página entregue mantém HTML legível sem JavaScript; a animação funciona por CSS.

## Estrutura e configuração

- `components/ui/hook-question.tsx`: componente reutilizável e metadados fornecidos.
- `components.json`: configuração shadcn/ui, com `aliases.ui` em `@/components/ui`.
- `styles/hook-question.css`: fonte Tailwind v4, com prefixo `hq` e sem Preflight.
- `assets/nova-pagina/css/hook-question.css`: CSS compilado servido pela landing.
- `video/hook-question/hook-question.schema.ts`: props, validação Zod e texto padrão.
- `video/hook-question/hook-question.tsx`: adaptador que recebe o frame do Remotion.
- `demo.tsx` e `video/index.tsx`: composição Remotion, 1920 × 1080, 30 fps, 105 frames.
- `scripts/build-hook-question.tsx`: gera somente o bloco da headline e seu link CSS.

`components/ui` não existia antes. A pasta concentra os componentes reutilizáveis e
corresponde ao destino configurado do CLI shadcn. O alias `@/*` está no `tsconfig.json`.
O restante da página mantém os estilos existentes em `assets/nova-pagina/css/styles.css`.

## Instalação e uso

```sh
npm ci
npm run typecheck
npm run build
npm run check:hook
npm run preview
```

Abra `http://127.0.0.1:4173`. Os arquivos estáticos gerados são versionados junto com
o código; a integração existente de publicação permanece responsável pelo deploy.
Para editar o texto, altere `defaults` no schema e execute `npm run build`.

O componente recebe `question`, `answer`, `colors` e `fonts`. `frame` permite
renderização determinística no vídeo; sem essa prop, a página executa a animação
CSS uma vez. Não utiliza providers, estado global, imagens ou ícones.

A headline desliza de baixo e termina no frame 20. A subheadline aparece do frame
45 ao 60 e permanece visível. O CSS respeita `prefers-reduced-motion`. O texto
completo atual ultrapassa a sugestão de 72 caracteres dos metadados originais;
ele é preservado e quebra em quantas linhas forem necessárias, sem truncar.

A composição pode ser aberta num ambiente Remotion com:

```sh
npm exec --package=@remotion/cli@4.0.536 -- remotion studio video/index.tsx
```

Esse comando é opcional para prévia de vídeo e não faz parte da publicação da landing.
As fontes locais e o CSS compilado são reutilizados na demo.

## shadcn, Tailwind e TypeScript

A configuração foi adicionada manualmente porque esta landing não é uma aplicação
Vite/Next. Não é necessário executar o inicializador para este componente. Para
um **novo projeto React separado**, o fluxo do CLI é:

```sh
npx shadcn@latest init --template vite --name minha-app
```

Não execute esse inicializador sobre a landing existente: ele cria uma aplicação
e pode alterar arquivos globais. O Tailwind desta integração é compilado pelo
CLI (`tailwindcss` e `@tailwindcss/cli`); o TypeScript é verificado por `tsc`.

Referências: [configuração shadcn](https://ui.shadcn.com/docs/components-json),
[Tailwind CLI](https://tailwindcss.com/docs/installation/tailwind-cli),
[Preflight opcional](https://tailwindcss.com/docs/preflight),
[schema Remotion](https://www.remotion.dev/docs/schemas).
