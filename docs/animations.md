# ScrollReveal e ProgressiveBlur

## Componentes reutilizáveis

`components/ScrollReveal.tsx` é client-side e usa a Intersection Observer API através de `lib/scroll-reveal.ts`. Propriedades: `direction` (`up`, `down`, `left`, `right`, `none`), `delay` em ms, `duration` (700 ms), `distance` (`40px`), `className`, `once` (true), `threshold` (0.15), `children` e `style` opcional. Todos os estados, transformações e transições são inline. Curva: `cubic-bezier(0.25, 0.46, 0.45, 0.94)`. Margem do observer: `0px 0px -50px 0px`.

```tsx
import ScrollReveal from "@/components/ScrollReveal";
import ProgressiveBlur from "@/components/ProgressiveBlur";

// Colocar as classes de posição no wrapper e a altura no card interno.
<ScrollReveal direction="up" className="hq:col-span-2" delay={150}>
  <div className="hq:h-full">Conteúdo do card</div>
</ScrollReveal>

// Num layout React/Next, colocar após Footer e fora de main.
<ProgressiveBlur />
```

O ScrollReveal mantém o HTML do servidor legível sem JavaScript. O layout effect prepara o estado inicial de opacidade 0 e deslocamento antes do primeiro paint do componente hidratado. Se houver preferência por movimento reduzido ou faltar a API, mostra o conteúdo imediatamente. O foco de teclado revela o elemento sem espera. A limpeza remove observers, listeners e temporizadores e repõe os estilos anteriores. Após a entrada, remove `will-change` e devolve as transições de hover existentes. `once={false}` permite repetir a entrada depois de sair do viewport.

`components/ProgressiveBlur.tsx` é um componente puro, sem `use client`, hooks ou dependências de animação. Tem oito camadas de 0.25 a 32 px, com máscaras graduais e as propriedades WebKit, todas inline. Container de 200 px, fixo em baixo, z-index 999 e sem capturar cliques. Não cria bundle JavaScript.

## Integração na landing existente

A entrada continua a ser `index.html`, uma página estática com ilhas React. Não foi convertida para Next.js. O build gera o blur após o rodapé e inclui um pequeno módulo nativo, `assets/nova-pagina/js/scroll-reveal.js`, que partilha o motor do componente. A seleção e os intervalos estão em `lib/landing-reveals.ts`; não acrescenta wrappers à página e preserva o grid e `display: contents` do mobile.

- Hero: badge, headline, subheadline e botão com entrada pela esquerda e delays 0/150/300/450 ms; marcadores com entrada de baixo e 600 ms; VSL pela direita, 300 ms e duração 800 ms. A posição da VSL acima da headline permanece como estava.
- Conteúdo: headings, descrições e cards com entrada de baixo e intervalos de 150 ms. Grupos longos reiniciam o stagger a cada três itens para evitar esperas excessivas no mobile.
- História e método: texto/itens pela esquerda ou de baixo; retrato e imagens pela direita, 200 ms e duração 800 ms. Os três passos usam index × 150 ms.
- Oferta: planos com 350/500 ms e duração 800 ms; garantia e rodapé entram de baixo.

As entradas CSS antigas dos mesmos alvos são desativadas inline para evitar dois efeitos concorrentes. Não há novas dependências nem alterações à copy, preços, links, imagens, analytics ou ordem das secções. O CTA fixo tem z-index 1000 para continuar nítido acima do blur, e uma reserva de 200 px após o rodapé permite deslocar o texto final para fora da área desfocada. A raiz usa `overflow-x: clip` durante a execução para não criar scroll horizontal com as entradas laterais.

Executar `npm run build:animations` para atualizar o blur e o módulo, ou `npm run build` para a exportação completa da landing. O build é idempotente e o blur usa apenas HTML e estilos inline, sem ficheiro CSS adicional.

Referências de API: [Intersection Observer](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API), [backdrop-filter](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/backdrop-filter) e [React effects](https://react.dev/reference/react/useEffect).

## Verificação

`npm run check:animations` verifica a renderização estática, as oito camadas e os prefixos, a preservação do HTML anterior e o comportamento no Chrome através de CDP. Requer a página em `http://127.0.0.1:4173` e uma instância de teste do Chrome com remote debugging na porta 9236. Os testes cobrem desktop (1440 px), mobile emulado (375 px), direções, threshold, delay, repetição, preferência por movimento reduzido, ausência de overflow horizontal, libertação de `will-change`, cliques no CTA fixo e leitura do fim do rodapé. As capturas ficam apenas na pasta temporária do sistema.

Passaram também o build completo, TypeScript, os testes existentes da headline e das avaliações, a sintaxe do módulo gerado e a verificação HTTP dos 24 recursos locais, incluindo dependências indiretas de CSS. A inspeção visual foi feita em Chrome; Safari e dispositivos móveis físicos não foram testados. Os dois CSS compilados incluem as utilidades de grid e altura usadas no exemplo reutilizável, sem alterar as regras existentes.
