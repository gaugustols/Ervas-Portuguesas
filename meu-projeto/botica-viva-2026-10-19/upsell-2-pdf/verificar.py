"""Confere conteúdo, formato, ligações e gera imagens para revisão visual."""
import hashlib
import json
import re
import unicodedata
from pathlib import Path
import pymupdf
from PIL import Image, ImageDraw

HERE=Path(__file__).resolve().parent
ROOT=HERE.parents[2]
PDF=ROOT/'output/pdf/botica-viva-mantem-a-tua-horta-viva-30-dias.pdf'
REVIEW=ROOT/'tmp/pdfs/manutencao-review'


def canonical(text):
    return ''.join(c for c in unicodedata.normalize('NFKC',text).lower() if c.isalnum())


def main():
    data=json.loads((HERE/'conteudo.json').read_text(encoding='utf8'))
    doc=pymupdf.open(PDF);full=' '.join(p.get_text() for p in doc);canon=canonical(full)
    checked=0;missing=[];outside=[];counts=[];links=[];images=[];rendered=[]
    for page in data['pages']:
        for node in page['nodes']:
            pieces=[cell for row in node['rows'] for cell in row] if node['type']=='table' else [node['text']]
            for text in pieces:
                if canonical(text) and canonical(text) not in canon:missing.append({'source_page':page['source_page'],'text':text})
                checked+=1
    REVIEW.mkdir(parents=True,exist_ok=True)
    for old in REVIEW.iterdir():
        if re.fullmatch(r'(page|sheet)-\d+\.png',old.name):old.unlink()
    for i,page in enumerate(doc):
        assert abs(page.rect.width-595.276)<1 and abs(page.rect.height-841.89)<1
        words=page.get_text('words');counts.append(len(words));images.append(len(page.get_images()))
        assert len(words)>25,f'Página quase vazia: {i+1}'
        for word in words:
            if word[0]<20 or word[1]<12 or word[2]>page.rect.width-20 or word[3]>page.rect.height-12:outside.append({'page':i+1,'word':word[4]})
        assert not list(page.widgets()),'As folhas são para impressão, sem campos interativos.'
        for link in page.get_links():
            if link.get('uri'):assert link['uri'].startswith('https://');links.append(link['uri'])
        path=REVIEW/f'page-{i+1:02}.png';page.get_pixmap(matrix=pymupdf.Matrix(1.25,1.25),alpha=False).save(path);rendered.append(path)
    for start in range(0,len(rendered),4):
        sheet=Image.new('RGB',(1220,1770),'#303832');draw=ImageDraw.Draw(sheet)
        for j,path in enumerate(rendered[start:start+4]):
            with Image.open(path) as im:
                im.thumbnail((595,842));x=10+(j%2)*610;y=28+(j//2)*885
                draw.text((x,y-18),f'PÁGINA {start+j+1:02}',fill='white');sheet.paste(im,(x,y))
        sheet.save(REVIEW/f'sheet-{start//4+1:02}.png')
    assert '�' not in full
    assert not any(c in full for c in '\u2011\u2013\u2014')
    assert len(re.findall(r'Dia\s+\d{2}\s*\|',full))==30,'Devem estar presentes 30 tarefas diárias.'
    assert sum(n>0 for n in images)==6,'As seis fichas usam fotografias.'
    assert len(links)==12
    report={'pages':len(doc),'bytes':PDF.stat().st_size,'sha256':hashlib.sha256(PDF.read_bytes()).hexdigest(),'content_fragments_checked':checked,'missing':missing,'outside':outside,'word_counts':counts,'images_per_page':images,'external_links':len(links),'bookmarks':len(doc.get_toc())}
    (REVIEW/'verification.json').write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding='utf8')
    print(json.dumps(report,ensure_ascii=False,indent=2))
    if missing or outside:raise SystemExit(1)


if __name__=='__main__':main()
