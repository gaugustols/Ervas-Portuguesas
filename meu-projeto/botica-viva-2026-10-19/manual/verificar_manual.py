"""Verifica o PDF entregue e renderiza páginas apenas numa pasta temporária."""
from pathlib import Path
from tempfile import mkdtemp
import json
from pypdf import PdfReader
import pymupdf

root = Path(__file__).resolve().parents[3]
pdf = root / 'output/pdf/botica-viva-manual-de-acesso.pdf'
reader = PdfReader(pdf)
document = pymupdf.open(pdf)
preview = Path(mkdtemp(prefix='botica-viva-manual-'))
summary = {'pdf': str(pdf), 'paginas': len(reader.pages), 'bytes': pdf.stat().st_size, 'previews': str(preview), 'links': []}
texts = []
for i, page in enumerate(document):
    text = page.get_text()
    texts.append(text)
    page.get_pixmap(matrix=pymupdf.Matrix(1.5, 1.5), alpha=False).save(preview / f'pagina-{i+1}.png')
    assert abs(page.rect.width - 595.2756) < 1 and abs(page.rect.height - 841.8898) < 1, 'Formato diferente de A4'
    for block in page.get_text('dict')['blocks']:
        for line in block.get('lines', []):
            for span in line.get('spans', []):
                x0, y0, x1, y1 = span['bbox']
                assert x0 >= -1 and y0 >= -1 and x1 <= page.rect.width + 1 and y1 <= page.rect.height + 1, ('Texto fora da página', i+1, span['text'])
    for link in page.get_links():
        if 'uri' in link:
            assert link['uri'].startswith('https://'), 'Ligação externa inválida'
            summary['links'].append(link['uri'])
        elif 'page' in link:
            assert 0 <= link['page'] < len(document), 'Destino interno inexistente'
    print(f'Página {i+1}: {len(text)} caracteres; início: {text[:105]!r}')
fulltext = '\n'.join(texts)
assert len(document) == 5, 'O manual deve ter exatamente cinco páginas'
assert '127.0.0.1' not in fulltext and 'localhost' not in fulltext
assert 'utilização' in fulltext and 'telemóvel' in fulltext
assert 'VERSÃO PARA REVISÃO' in fulltext and 'por configurar' in fulltext
assert 'Guardar a minha ficha' in fulltext and 'Exportar todos os dados' in fulltext
assert '\ufffd' not in fulltext, 'Caráter de substituição detetado'
assert not any(dash in fulltext for dash in ['\u2010','\u2011','\u2012','\u2013','\u2014']), 'Utilizar apenas hífen ASCII'
summary['links'] = sorted(set(summary['links']))
(preview / 'verificacao.json').write_text(json.dumps(summary, ensure_ascii=False, indent=2), encoding='utf8')
print(json.dumps(summary, ensure_ascii=False, indent=2))
