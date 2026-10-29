# Botica Viva · Studio de vídeo

Área local isolada para montar criativos e exportar MP4. Não altera a landing page, a aplicação nem o funil. Sem renderização na Vercel ou serviço pago de renderização configurado.

## Preparação

Na pasta `video-studio`, executar:

```powershell
npm ci
npm run browser
npm run prepare:media
```

O primeiro comando utiliza `npm-shrinkwrap.json`. Os pacotes Remotion estão fixos na versão 4.0.536 para corresponder à versão já utilizada no projeto. Chrome Headless Shell e os binários FFmpeg/FFprobe são geridos pelo Remotion; não é necessário alterar o PATH do Windows.

## Pastas locais

- `media/entrada/`: vídeos, imagens, locuções e música a utilizar.
- `media/referencias/`: materiais de referência.
- `projects/local/`: configurações de cada criativo.
- `../output/videos/`: MP4 finais e ficheiros de teste.

Estas pastas de materiais e resultados são ignoradas pelo Git e não são copiadas pelo exportador do site. Conservar os originais; trabalhar com cópias. Não colocar vídeos em `assets/nova-pagina/` nem na pasta pública da landing.

## Pré-visualizar e editar

```powershell
npm run studio
```

Abrir `http://localhost:3001`. Composições disponíveis: `BoticaVivaVertical` (1080 × 1920), `BoticaVivaQuadrado` (1080 × 1080) e `BoticaVivaHorizontal` (1920 × 1080), a 30 fps.

A composição vazia mostra apenas um teste técnico de dois segundos. Não é um criativo final. O conteúdo e o estilo da edição serão preparados depois de receber o vídeo e a referência.

`projects/exemplo.json` documenta o formato para montagem. Copiar para `projects/local/criativo.json` e substituir os exemplos pelos materiais reais. Os tempos são em fotogramas a 30 fps: 30 fotogramas = 1 segundo. `trimBefore` seleciona o início no vídeo de origem; `durationInFrames` define a duração de cada trecho. Os trechos são concatenados pela ordem da lista. As legendas usam os tempos da montagem final.

```powershell
npm exec -- remotion studio src/index.ts --props=projects/local/criativo.json --port=3001 --no-open
npm exec -- remotion render src/index.ts BoticaVivaVertical ../output/videos/criativo-01.mp4 --props=projects/local/criativo.json
```

MP4: H.264, áudio AAC quando presente, yuv420p, cor BT.709 e CRF 18. Os fotogramas intermédios usam PNG para preservar as cores da marca. Evitar reutilizar um nome de saída para preservar versões. `fit: "contain"` preserva todo o enquadramento; `"cover"` preenche o formato com corte das margens. Rever o enquadramento dos rostos em cada formato.

Atalhos de exportação da composição carregada por defeito:

```powershell
npm run render:vertical
npm run render:square
npm run render:horizontal
```

## Verificação

```powershell
npm run typecheck
npm test
```

O teste exporta os três formatos com áudio sintético discreto, verifica codecs, resolução, fps, duração e descodificação integral. Depois importa um MP4, une dois cortes e acrescenta uma legenda. Resultados em `../output/videos/verificacao.json` e `teste-*.mp4`.

Transcrição automática, geração de voz, sincronização palavra a palavra e serviços externos não estão configurados. As legendas desta base recebem texto e tempos aprovados. Não foi configurada nenhuma compra de licença ou subscrição; a utilização do Remotion continua sujeita à sua licença oficial: https://www.remotion.dev/license.

Documentação: https://www.remotion.dev/docs/cli/render, https://www.remotion.dev/docs/cli/studio e https://www.remotion.dev/docs/offthreadvideo.
