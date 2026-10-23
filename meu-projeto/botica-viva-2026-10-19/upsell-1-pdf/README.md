# Entregável PDF · Horta em 7 Dias

Edição visual do PDF fornecido pelo utilizador, na identidade da aplicação Botica Viva. O original `Botica_Viva_Horta_7_Dias_Guia.pdf` permanece intacto. A origem e o SHA-256 estão registados em `conteudo.json`.

## Resultado

- PDF final: `../../../output/pdf/botica-viva-horta-em-7-dias.pdf`.
- 30 páginas A4, 1 219 501 bytes, fontes Plus Jakarta Sans incorporadas.
- Fundo quase preto, verdes da marca e quatro páginas claras para imprimir e preencher à mão. Não são campos interativos de formulário.
- Seis fotografias da biblioteca existente, com autores, licenças e ligações na última página.
- Diagramas vetoriais de luz, drenagem, transplante, rega e observação. São demonstrações esquemáticas, sem escala.
- Marcadores de navegação e texto selecionável.

O conteúdo substantivo do original foi preservado. Ajustes editoriais: renumeração dos passos por secção; substituição da referência ao preenchimento num ficheiro Word por instruções de impressão; normalização de caixas de seleção; aviso sobre luz insuficiente deslocado para «Antes de começar», mantendo o texto. Não foram acrescentadas alegações clínicas.

## Gerar e verificar

Executar da raiz do repositório com Python e os pacotes `reportlab`, `PyMuPDF` e `Pillow` disponíveis:

```powershell
python meu-projeto/botica-viva-2026-10-19/upsell-1-pdf/gerar.py
python meu-projeto/botica-viva-2026-10-19/upsell-1-pdf/verificar.py
```

Para extrair novamente o original, apenas se necessário:

```powershell
python meu-projeto/botica-viva-2026-10-19/upsell-1-pdf/preparar_conteudo.py "CAMINHO_DO_ORIGINAL.pdf"
```

O verificador compara os 528 fragmentos de texto/células, confere formato e limites de página, ligações HTTPS e caracteres inválidos; também produz PNGs e folhas de contacto em `tmp/pdfs/horta-review/` para inspeção visual. Uma verificação automática não substitui essa inspeção.

## Verificação desta edição · 23/10/2026

- 528 fragmentos conferidos; nenhum em falta.
- Nenhuma palavra fora dos limites; sem caracteres de substituição.
- 12 ligações externas HTTPS e 29 marcadores de navegação.
- Todas as 30 páginas renderizadas e revistas visualmente na versão final, sem cortes ou sobreposições identificados.
- Conteúdo tratado como material editorial do utilizador; não houve revisão científica ou agronómica independente.

## Entrega

O PDF pago e as fontes ficam fora da exportação pública da Vercel. Não adicionar o ficheiro a `public/`, à landing nem a ligações públicas de acesso livre. O carregamento do ficheiro na Hotmart e o teste de entrega após pagamento continuam por realizar. As páginas, o webapp, o manual de acesso e as configurações de checkout não foram alterados.
