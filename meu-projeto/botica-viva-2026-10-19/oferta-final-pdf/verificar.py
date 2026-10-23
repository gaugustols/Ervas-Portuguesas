"""Confere texto, quantidades de modelos e renderiza todas as páginas para revisão."""
import hashlib
import json
import re
import unicodedata
from pathlib import Path
import pymupdf
from PIL import Image,ImageDraw

HERE=Path(__file__).resolve().parent
ROOT=HERE.parents[2]
PDF=ROOT/'output/pdf/botica-viva-a-minha-botica-organizada.pdf'
REVIEW=ROOT/'tmp/pdfs/organizada-review'
EDITS={
 'Preencher diretamente no Word':'Anotar num leitor de PDF',
 'Podes imprimir só as folhas de que precisas ou duplicá-las no Word.':'Podes imprimir só as folhas de que precisas ou repetir a impressão dos modelos.',
 'Guarda este PDF ou o Word no telemóvel para poderes consultar ou voltar a imprimir.':'Guarda este PDF no telemóvel para poderes consultar ou voltar a imprimir.',
 'Um ID por recipiente/lote. Podes tirar fotocópias ou duplicar esta página no Word.':'Um ID por recipiente/lote. Podes tirar fotocópias ou voltar a imprimir esta página.',
}


def canonical(text):return ''.join(c for c in unicodedata.normalize('NFKC',text).lower() if c.isalnum())


def main():
    data=json.loads((HERE/'conteudo.json').read_text(encoding='utf8'));doc=pymupdf.open(PDF)
    full=' '.join(p.get_text() for p in doc);canon=canonical(full);checked=0;missing=[];outside=[];counts=[];rendered=[]
    for page in data['pages']:
        for n in page['nodes']:
            pieces=[cell for row in n['rows'] for cell in row] if n['type']=='table' else n['lines'] if 'lines' in n else [n['text']]
            for text in pieces:
                for a,b in EDITS.items():text=text.replace(a,b)
                if canonical(text) and canonical(text) not in canon:missing.append({'source_page':page['source_page'],'text':text})
                checked+=1
    REVIEW.mkdir(parents=True,exist_ok=True)
    for old in REVIEW.iterdir():
        if re.fullmatch(r'(page|sheet)-\d+\.png',old.name):old.unlink()
    for i,page in enumerate(doc):
        assert abs(page.rect.width-595.276)<1 and abs(page.rect.height-841.89)<1
        words=page.get_text('words');counts.append(len(words));assert len(words)>25,f'Página quase vazia: {i+1}'
        assert not list(page.widgets()) and not page.get_images()
        for w in words:
            if w[0]<20 or w[1]<12 or w[2]>page.rect.width-20 or w[3]>page.rect.height-12:outside.append({'page':i+1,'word':w[4]})
        path=REVIEW/f'page-{i+1:02}.png';page.get_pixmap(matrix=pymupdf.Matrix(1.25,1.25),alpha=False).save(path);rendered.append(path)
    for start in range(0,len(rendered),4):
        sheet=Image.new('RGB',(1220,1770),'#303832');draw=ImageDraw.Draw(sheet)
        for j,path in enumerate(rendered[start:start+4]):
            with Image.open(path) as im:
                im.thumbnail((595,842));x=10+(j%2)*610;y=28+(j//2)*885
                draw.text((x,y-18),f'PÁGINA {start+j+1:02}',fill='white');sheet.paste(im,(x,y))
        sheet.save(REVIEW/f'sheet-{start//4+1:02}.png')
    assert '�' not in full and not any(c in full for c in '\u2011\u2013\u2014') and 'Word' not in full
    quantities={'complete_labels':canon.count(canonical('BOTICA VIVA / COMPLETA ID: BV')),'quick_labels':canon.count(canonical('BOTICA VIVA / ETIQUETA RÁPIDA ID: BV')),'weekly_reviews':len(re.findall(r'SEMANA\s+[1-4]',full)),'incidents':len(re.findall(r'OCORRÊNCIA\s+[12]',full))}
    assert quantities=={'complete_labels':6,'quick_labels':12,'weekly_reviews':4,'incidents':2},quantities
    assert re.findall(r'FICHAS IMPRIMÍVEIS / (0[1-8])',full)==[f'{n:02}' for n in range(1,9)]
    report={'pages':len(doc),'bytes':PDF.stat().st_size,'sha256':hashlib.sha256(PDF.read_bytes()).hexdigest(),'content_fragments_checked':checked,'missing':missing,'outside':outside,'word_counts':counts,'models':quantities,'bookmarks':len(doc.get_toc())}
    (REVIEW/'verification.json').write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding='utf8');print(json.dumps(report,ensure_ascii=False,indent=2))
    if missing or outside:raise SystemExit(1)


if __name__=='__main__':main()
