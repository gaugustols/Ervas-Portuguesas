# Entregável PDF · Mantém a Tua Horta Viva

Edição estética do PDF do Upsell 2 fornecido pelo utilizador, na identidade do webapp e do primeiro entregável Botica Viva. O original permanece intacto; o nome e o SHA-256 estão registados em `conteudo.json`.

## Resultado

- PDF final: `../../../output/pdf/botica-viva-mantem-a-tua-horta-viva-30-dias.pdf`.
- 43 páginas A4, aproximadamente 1,25 MB, fontes Plus Jakarta Sans incorporadas.
- Fundo quase preto, detalhes verdes e texto claro, com seis páginas finais de fichas em fundo branco para imprimir e preencher à mão. Não são formulários interativos.
- Trinta tarefas preservadas, em blocos «Faz», «Decide» e «Registo».
- Seis fichas fotográficas de plantas, com atribuição e licença na última página.
- Diagramas vetoriais de observação, rega, comparação de fotografias, revisões semanais e corte acima de um nó. São esquemas sem escala; as fotografias não são usadas como diagnóstico.

O conteúdo substantivo do original foi preservado. A diagramação distribui as tabelas e os dias por mais páginas, converte a consulta das plantas em blocos verticais, normaliza caixas de seleção e linhas para escrita e reúne frases partidas pelo exportador original. Os avisos e limites de colheita permanecem junto das instruções. As legendas e os diagramas explicam as orientações do próprio documento, sem acrescentar promessas de resultados ou alegações clínicas.

## Gerar e verificar

Executar da raiz do repositório, com Python e os pacotes `reportlab`, `PyMuPDF` e `Pillow` disponíveis:

```powershell
python meu-projeto/botica-viva-2026-10-19/upsell-2-pdf/gerar.py
python meu-projeto/botica-viva-2026-10-19/upsell-2-pdf/verificar.py
```

Para extrair novamente o original, apenas se necessário:

```powershell
python meu-projeto/botica-viva-2026-10-19/upsell-2-pdf/preparar_conteudo.py "CAMINHO_DO_ORIGINAL.pdf"
```

`estilo.py` mantém os elementos editoriais desta edição, derivados do estilo do primeiro PDF, sem alterar os ficheiros do Upsell 1.

## Verificação desta edição · 23/10/2026

- 541 fragmentos de texto/células conferidos, sem faltas.
- Trinta tarefas diárias e seis páginas com fotografias verificadas.
- Limites A4, caracteres, ligações HTTPS e altura das células das tabelas imprimíveis conferidos.
- 12 ligações externas e 42 marcadores de navegação.
- Todas as 43 páginas renderizadas e revistas visualmente na versão final.
- O conteúdo é material editorial do utilizador; não foi feita uma revisão científica ou agronómica independente.

O verificador gera PNGs e folhas de contacto em `tmp/pdfs/manutencao-review/`. A inspeção visual desses ficheiros continua necessária após alterações de paginação.

## Entrega

O PDF pago e as fontes ficam fora da exportação pública da Vercel. Não adicionar a `public/` ou a ligações abertas da landing. O carregamento na Hotmart e o teste de entrega após pagamento continuam por realizar. Não foram alterados a landing, o webapp, as páginas do funil, os checkouts nem o manual de acesso. Alterações locais de outras tarefas devem permanecer fora deste commit.
