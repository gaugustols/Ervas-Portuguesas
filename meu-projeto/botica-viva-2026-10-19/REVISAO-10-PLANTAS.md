# Revisão local — 10 fichas de plantas

Estado: publicação autorizada pelo utilizador após revisão local.

## Rever no navegador

- Básico: http://127.0.0.1:4174/app/#plantas
- Pro: http://127.0.0.1:4174/pro/#plantas

O servidor local está em execução. Para o voltar a iniciar, use o ficheiro Rever-webapp.cmd na raiz do projeto local.

## Alterações

- Quatro espécies existentes enriquecidas (alecrim, erva-cidreira, manjericão e aloé), preservando IDs, usos e precauções anteriores.
- Seis espécies novas: boldo-do-Chile, capim-limão, quebra-pedra, picão-preto, hortelã-grossa e mastruz. Total: 38 espécies em cada plano.
- Descrição, utilizações tradicionais/investigadas, preparação, ingredientes quando adequados, passos, precauções e referências nas fichas já existentes.
- Pesquisa por nomes alternativos: babosa, Plectranthus amboinicus, hortelã-grosso, entre outros.
- Mesma estrutura, CSS, tipografia, pesquisa, filtros, favoritos e fichas práticas. Materiais exclusivos Pro preservados.
- As quantidades do pedido foram mantidas como exemplos alimentares para adultos, sem frequência terapêutica inventada. Boldo, quebra-pedra e picão-preto sem dose medicinal doméstica; mastruz sem receita de ingestão.

## Fotografias

Dez fotografias reais do Wikimedia Commons, com metadados de espécie e licenças que permitem uso comercial. Todas em WebP, versões de 480 e 960 px, srcset/sizes e carregamento diferido. Os créditos estão visíveis nas fichas e na área Fontes. Não foram usados placeholders ou imagens geradas.

| Planta | Autor | Licença | Original |
|---|---|---|---|
| Alecrim | Margalob | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0) | [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Rosemary_in_bloom.JPG) |
| Manjericão | Photo by David J. Stang | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0) | [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Ocimum_basilicum_8zz.jpg) |
| Erva-cidreira | Amitchell125 | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0) | [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Lemon_balm_plant.jpg) |
| Aloé (babosa) | Chris and Kelly | [CC BY-SA 2.0](https://creativecommons.org/licenses/by-sa/2.0) | [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Aloe_vera_offsets.jpg) |
| Boldo-do-Chile | Krzysztof Ziarnek, Kenraiz | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0) | [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Peumus_boldus_kz04.jpg) |
| Capim-limão | Obsidian Soul | [CC0](https://creativecommons.org/publicdomain/zero/1.0/deed.en) | [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Tanglad_(lemongrass,_Cymbopogon_citratus)_-_Philippines.jpg) |
| Quebra-pedra | Toluaye | [Public domain](https://creativecommons.org/publicdomain/mark/1.0/) | [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Quebra-Pedra._Phyllanthus_niruri.JPG) |
| Picão-preto | Prenn | [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0) | [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Bidens_pilosa_02.JPG) |
| Hortelã-grossa | Aathavan jaffna | [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0) | [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Plectranthus_amboinicus_in_jaffna.JPG) |
| Mastruz | Forest & Kim Starr | [CC BY 3.0](https://creativecommons.org/licenses/by/3.0) | [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Starr_050816-3669_Chenopodium_ambrosioides.jpg) |

Metadados completos e alterações: media/creditos.json. Originais descarregados mantidos em media/.

## Validação

- Suite existente: 38 fotografias por plano, 72 temas, 6 módulos, separação dos planos, recursos HTTP, pesquisa, favoritos, persistência, progresso, exportação e impressão.
- Suite específica: 10 fichas nos dois planos, 20 WebP por plano, nomes alternativos, ausência de duplicações, preservação das 32 espécies originais e suas utilizações.
- Chrome isolado a 375, 768 e 1440 px: imagens carregadas, sem transbordo horizontal ou erros JavaScript.
- Capturas para revisão: revisao-local/erva-34-375.png, erva-34-1440.png, erva-38-375.png e erva-38-1440.png.

## Ficheiros principais

- src/plantas-complementares.mjs: dez fichas em pt-PT.
- src/conteudo.mjs: integração por espécie.
- src/app.js: apresentação nos componentes existentes e pesquisa por sinónimos.
- scripts/gerar.mjs: gera Básico e Pro, incluindo imagens responsivas.
- scripts/testar-novas-plantas.mjs: verificações adicionais.

As referências de saúde são consultáveis em cada ficha (EMA, NCCIH e outras fontes identificadas). O uso tradicional está distinguido de eficácia demonstrada.
