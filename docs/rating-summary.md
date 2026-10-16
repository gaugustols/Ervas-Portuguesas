# Rating Summary

O bloco em `components/ui/rating-summary.tsx` substitui as fotografias da secção
de depoimentos. A estrutura shadcn/ui, React, Tailwind e TypeScript existente é
reutilizada; Zod já estava instalado. Foi acrescentado `lucide-react` para as
estrelas e os ícones de citação. Não são usadas fotografias, avatares ou imagens
de stock neste bloco.

## Dados e origem

- Nota `4,9/5`: informada pelo proprietário nesta tarefa.
- Contagem `3`: refere-se apenas aos três comentários selecionados, sem afirmar
  um total de avaliações que não foi informado.
- Excertos transcritos das imagens originais `imagem-07.webp`, `imagem-08.webp` e
  `imagem-13.webp`; os nomes e a redação original são preservados.

Os dados ficam em `video/rating-summary/rating-summary.schema.ts`. O schema aceita
`score` entre 0 e 5, `count`, `countLabel`, `source`, até três `snippets`, cores e
fontes. Não são necessários providers ou estado global. A integração usa a
paleta preta, verde `#0b6b2c` e branca da landing.

## Compilação e estilos

```sh
npm ci
npm run build
npm run typecheck
npm run check:hook
npm run check:rating
npm run preview
```

- Fonte CSS: `styles/rating-summary.css`, com utilitários Tailwind prefixados `hq`.
- CSS servido: `assets/nova-pagina/css/rating-summary.css`.
- Geração do HTML: `scripts/build-rating-summary.tsx`.
- Animação na página: `assets/nova-pagina/js/rating-summary.js`.
- Saída de publicação: `public/`, produzida pelo build existente e ignorada no Git.

Sem JavaScript, a nota, as estrelas e os comentários já aparecem no HTML final.
A animação começa apenas quando o bloco entra no ecrã e executa uma vez. A nota
termina no frame 42; as estrelas, no 46; as citações entram nos frames 50, 58 e 66
e assentam no 78, a 30 fps. A preferência por movimento reduzido mostra o estado
final imediatamente. A contagem visual não altera os rótulos acessíveis.

O layout tem duas colunas no desktop e uma coluna até 860 px. A composição
`StarRatingSummaryComposition` em `demo.tsx` usa o adaptador
`video/rating-summary/rating-summary.tsx`: 1920 × 1080, 30 fps e 150 frames.
O adaptador controla o movimento pelo frame do Remotion, sem depender de tempo
de relógio. `video/index.tsx` regista a demo junto com a composição da headline.
