# Entregável PDF · O Meu Primeiro Vaso

Edição estética do downsell fornecido pelo utilizador, seguindo a identidade do webapp e dos dois PDFs anteriores Botica Viva. O original permanece intacto; o nome e o SHA-256 estão registados em `conteudo.json`.

## Resultado

- PDF final: `../../../output/pdf/botica-viva-o-meu-primeiro-vaso.pdf`.
- 21 páginas A4, aproximadamente 120 KB, com fontes Plus Jakarta Sans incorporadas.
- Fundo quase preto, detalhes verdes, texto claro e duas páginas de fichas em fundo branco.
- Sete tarefas organizadas por dia, com duração, ações e critério «Feito quando».
- Fotografia de hortelã-verde da biblioteca existente, com autor, licença e ligação na última página.
- Diagramas vetoriais de vaso, luz, drenagem, transplante, rega e comparação de observações.
- Marcadores de navegação e duas ligações internas para compras e transplante.

O texto substantivo foi preservado. A ilustração de capa foi redesenhada na estética da coleção, as tabelas e as instruções ganharam espaço e a ficha original foi distribuída por duas páginas. Foram normalizadas caixas de seleção e linhas para escrita. As duas referências às antigas páginas 4 e 5 foram substituídas pelos nomes das secções, com ligações internas verificadas. Foi acrescentada uma indicação de utilização de ferramentas de anotação para escrever no telemóvel; não se trata de um formulário interativo.

## Gerar e verificar

Executar da raiz do repositório, com Python e os pacotes `reportlab`, `PyMuPDF` e `Pillow` disponíveis:

```powershell
python meu-projeto/botica-viva-2026-10-19/downsell-pdf/gerar.py
python meu-projeto/botica-viva-2026-10-19/downsell-pdf/verificar.py
```

Para extrair novamente o original, apenas se necessário:

```powershell
python meu-projeto/botica-viva-2026-10-19/downsell-pdf/preparar_conteudo.py "CAMINHO_DO_ORIGINAL.pdf"
```

`estilo.py` contém os elementos editoriais desta edição, derivados do estilo da coleção. Não altera as fontes nem os PDFs dos outros complementos.

## Verificação desta edição · 23/10/2026

- 254 fragmentos de texto/células/tarefas comparados, sem faltas, considerando apenas as duas correções documentadas das referências internas.
- Sete dias presentes, uma fotografia, duas ligações externas HTTPS e duas ligações internas com destinos corretos.
- 20 marcadores de navegação; nenhuma palavra fora dos limites A4 ou carácter de substituição.
- Altura das células das tabelas imprimíveis conferida.
- Todas as 21 páginas renderizadas e revistas visualmente na versão final.
- O conteúdo é material editorial do utilizador; não foi feita revisão científica ou agronómica independente.

As renderizações temporárias e o relatório são gerados em `tmp/pdfs/vaso-review/`. Voltar a inspecionar as imagens após alterações de paginação.

## Entrega

O PDF pago e as fontes ficam fora da exportação pública da Vercel. Não os adicionar a `public/` nem a ligações abertas da landing. O carregamento na Hotmart e o teste de entrega após pagamento continuam por realizar. Landing, webapp, páginas do funil, checkouts e manual de acesso não foram alterados; alterações locais preexistentes devem permanecer fora deste commit.
