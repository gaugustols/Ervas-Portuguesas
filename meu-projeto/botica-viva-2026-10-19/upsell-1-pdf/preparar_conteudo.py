"""Extrai o texto do PDF fornecido, sem executar instruções do documento.
Uso: python preparar_conteudo.py caminho/do/original.pdf
Requer PyMuPDF. Não altera o original.
"""
import hashlib
import json
import re
import sys
from pathlib import Path
import pymupdf

HERE = Path(__file__).resolve().parent


def clean(text):
    return re.sub(r'\s+', ' ', text.replace('\uf0b7', '•').replace('\u00a0', ' ')).strip()


def extract(path):
    doc = pymupdf.open(path)
    result = []
    for index, page in enumerate(doc):
        spans = []
        for block in page.get_text('dict')['blocks']:
            for line in block.get('lines', []):
                for s in line['spans']:
                    if 46 < s['origin'][1] < 740 and s['text'].strip():
                        spans.append(s)
        # O original tem células de 8,5 pt e cabeçalhos brancos de 9 pt.
        table_spans = [s for s in spans if abs(s['size'] - 8.5) < .1 or (abs(s['size']-9) < .1 and s['color'] == 0xffffff)]
        bands = []
        for s in sorted(table_spans, key=lambda a: (a['origin'][1], a['origin'][0])):
            if not bands or s['origin'][1] - max(x['origin'][1] for x in bands[-1]) > 30:
                bands.append([])
            bands[-1].append(s)
        nodes = []
        for band in bands:
            head = [s for s in band if s['color'] == 0xffffff]
            if not head:
                raise ValueError(f'Cabeçalho de tabela em falta na página {index+1}')
            cols = sorted(set(round(s['origin'][0], 1) for s in head))
            rows, last_y = [], None
            for s in sorted(band, key=lambda a: (a['origin'][1], a['origin'][0])):
                y = s['origin'][1]
                if last_y is None or y-last_y > 13:
                    rows.append(['']*len(cols))
                col = max([i for i, x in enumerate(cols) if s['origin'][0] >= x-3] or [0])
                rows[-1][col] = clean(rows[-1][col] + ' ' + s['text'])
                last_y = y
            nodes.append({'type': 'table', 'rows': rows, 'y': min(s['origin'][1] for s in band)})
        identities = {id(s) for s in table_spans}
        lines = []
        for s in sorted([s for s in spans if id(s) not in identities], key=lambda a: (round(a['origin'][1], 1), a['origin'][0])):
            if not lines or abs(s['origin'][1]-lines[-1]['y']) > 1.2:
                lines.append({'y': s['origin'][1], 'spans': []})
            lines[-1]['spans'].append(s)
        current = None
        for line in lines:
            ss = sorted(line['spans'], key=lambda s:s['origin'][0])
            text = clean(' '.join(s['text'] for s in ss))
            size = max(s['size'] for s in ss)
            if not text:
                continue
            kind = 'title' if size >= 18 else 'heading' if size >= 12 else 'body'
            if kind == 'body' and all('Bold' in s['font'] for s in ss) and size <= 10:
                kind = 'callout_title' if text.upper() == text else 'body'
            match = re.match(r'^(\d+\.\s*|[•\u2610]\s*)(.+)', text)
            if match and kind == 'body':
                marker = match.group(1)
                kind = 'ordered' if marker[0].isdigit() else 'check' if '☐' in marker else 'bullet'
                text = match.group(2)
            can_join = current and kind == 'body' and current['type'] in ('body','ordered','bullet','check') and 0 < line['y']-current['last_y'] < 16
            if can_join and not any(current['y'] < n['y'] < line['y'] for n in nodes if n['type']=='table'):
                current['text'] = clean(current['text'] + ' ' + text)
                current['last_y'] = line['y']
            else:
                current = {'type':kind,'text':text,'y':line['y'],'last_y':line['y']}
                nodes.append(current)
        nodes.sort(key=lambda n:n['y'])
        for node in nodes:
            node.pop('last_y', None)
            node.pop('y', None)
        result.append({'source_page':index+1,'nodes':nodes})
    return {'source_name':Path(path).name,'source_sha256':hashlib.sha256(Path(path).read_bytes()).hexdigest(),'pages':result}


if __name__ == '__main__':
    data = extract(Path(sys.argv[1]))
    (HERE/'conteudo.json').write_text(json.dumps(data, ensure_ascii=False, indent=2)+'\n', encoding='utf-8')
    print('Conteúdo extraído:', len(data['pages']), 'páginas;', sum(len(p['nodes']) for p in data['pages']), 'blocos')
