# Entregável PDF · A Minha Botica Organizada

Edição estética do kit fornecido pelo utilizador, seguindo a identidade do webapp e dos três PDFs anteriores Botica Viva. O original permanece intacto; nome e SHA-256 estão registados em `conteudo.json`.

## Resultado

- PDF final: `../../../output/pdf/botica-viva-a-minha-botica-organizada.pdf`.
- 28 páginas A4, 88 084 bytes, com fontes Plus Jakarta Sans incorporadas e texto selecionável.
- Fundo quase preto, detalhes verdes, texto claro e oito páginas de modelos em fundo branco para imprimir.
- Diagramas vetoriais de recipientes, fluxo de organização e três zonas, sem fotografias decorativas.
- Seis etiquetas completas, doze rápidas, inventário, movimentos, compras, quatro revisões semanais, mapa e duas fichas de ocorrência.
- 27 marcadores de navegação.

O conteúdo substantivo, exemplos fictícios, avisos e campos dos oito modelos foram preservados. Os quadros em branco mantêm dez linhas no inventário e onze em movimentos e compras. O texto ganhou hierarquia, espaçamento e paginação na estética da coleção.

Quatro referências à edição Word foram adaptadas ao formato entregue: preencher no Word passou a anotar num leitor de PDF; duplicar modelos no Word passou a repetir a impressão; guardar o PDF ou Word passou a guardar o PDF; duplicar a página no Word passou a voltar a imprimi-la. As substituições exatas estão em `gerar.py` e são consideradas por `verificar.py`. Acrescentada uma indicação para usar ferramentas de anotação no telemóvel. Não existem campos automáticos ou formulários interativos.

## Gerar e verificar

Executar da raiz do repositório com Python e os pacotes `reportlab`, `PyMuPDF` e `Pillow` disponíveis:

```powershell
python meu-projeto/botica-viva-2026-10-19/oferta-final-pdf/gerar.py
python meu-projeto/botica-viva-2026-10-19/oferta-final-pdf/verificar.py
```

Para extrair novamente o original, apenas se necessário:

```powershell
python meu-projeto/botica-viva-2026-10-19/oferta-final-pdf/preparar_conteudo.py "CAMINHO_DO_ORIGINAL.pdf"
```

`estilo.py` contém os elementos editoriais desta edição, derivados do estilo da coleção. Não altera os outros entregáveis.

## Verificação desta edição · 23/10/2026

- 684 fragmentos de texto, células e modelos comparados, sem faltas, considerando apenas as quatro adaptações documentadas.
- Nenhuma palavra fora dos limites A4 ou carácter de substituição.
- Alturas das células imprimíveis e quantidades de etiquetas e fichas conferidas.
- Todas as 28 páginas renderizadas e revistas visualmente na versão final.
- Original preservado; não foi feita revisão científica ou agronómica independente.

As renderizações temporárias e o relatório são gerados em `tmp/pdfs/organizada-review/`. Voltar a inspecionar as imagens após alterações de paginação.

## Entrega

O PDF pago e as fontes ficam fora da exportação pública da Vercel. Não os adicionar a `public/` nem a ligações abertas da landing. O carregamento na Hotmart e o teste de entrega após pagamento continuam por realizar. Landing, webapp, páginas do funil, checkouts e manual de acesso não foram alterados; alterações locais preexistentes permanecem fora deste commit.
