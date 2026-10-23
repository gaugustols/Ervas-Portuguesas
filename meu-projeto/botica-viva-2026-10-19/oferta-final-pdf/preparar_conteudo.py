"""Extrai texto e modelos do PDF fornecido; não executa instruções nele contidas."""
import hashlib
import json
import re
import sys
from pathlib import Path
import pymupdf

HERE=Path(__file__).resolve().parent


def clean(text):return re.sub(r'\s+',' ',text.replace('\u00a0',' ')).strip()


def lines_from(spans):
    lines=[]
    for s in sorted(spans,key=lambda s:(round(s['origin'][1],1),s['origin'][0])):
        if not lines or abs(s['origin'][1]-lines[-1]['y'])>1.2:lines.append({'y':s['origin'][1],'spans':[]})
        lines[-1]['spans'].append(s)
    return lines


def extract(path):
    result=[]
    with pymupdf.open(path) as doc:
        for index,page in enumerate(doc):
            spans=[s for b in page.get_text('dict')['blocks'] for l in b.get('lines',[]) for s in l['spans'] if 46<s['origin'][1]<785 and s['text'].strip()]
            nodes=[];used=set()
            if index in (13,14):
                starts=[s for s in spans if s['text'].startswith('BOTICA VIVA  /  ')]
                for start in starts:
                    x,y=start['origin'];height=125 if index==13 else 60
                    group=[s for s in spans if abs(s['origin'][0]-x)<3 and y-.5<=s['origin'][1]<y+height]
                    nodes.append({'type':'label','variant':'complete' if index==13 else 'quick','lines':[clean(' '.join(s['text'] for s in l['spans'])) for l in lines_from(group)],'y':y})
                    used.update(id(s) for s in group)
            if index in (18,20):
                prefix='SEMANA ' if index==18 else 'OCORRÊNCIA '
                starts=sorted([s for s in spans if s['text'].startswith(prefix)],key=lambda s:s['origin'][1])
                for i,start in enumerate(starts):
                    y=start['origin'][1];end=starts[i+1]['origin'][1]-8 if i+1<len(starts) else (720 if index==18 else 640)
                    group=[s for s in spans if y-.5<=s['origin'][1]<end and not (abs(s['size']-8.5)<.1 and s['color']==5793374)]
                    nodes.append({'type':'review' if index==18 else 'incident','lines':[clean(' '.join(s['text'] for s in sorted(l['spans'],key=lambda s:s['origin'][0]))) for l in lines_from(group)],'y':y})
                    used.update(id(s) for s in group)
            heads=[s for s in spans if s['color']==0xffffff]
            header_groups=[]
            for s in sorted(heads,key=lambda s:s['origin'][1]):
                if not header_groups or s['origin'][1]-max(t['origin'][1] for t in header_groups[-1])>25:header_groups.append([])
                header_groups[-1].append(s)
            for head in header_groups:
                y=min(s['origin'][1] for s in head)
                end=min([s['origin'][1] for s in spans if s['origin'][1]>y+1 and s['size']>=10.5]+[785])
                ts=[s for s in spans if y-.5<=s['origin'][1]<end and (s['color']==0xffffff or (s['color']==1523508 and s['size']<=9))]
                cols=sorted(set(round(s['origin'][0],1) for s in head));rows=[];last_y=None
                for s in sorted(ts,key=lambda s:(s['origin'][1],s['origin'][0])):
                    if last_y is None or s['origin'][1]-last_y>14:rows.append(['']*len(cols))
                    col=max([i for i,x in enumerate(cols) if s['origin'][0]>=x-3] or [0]);rows[-1][col]=clean(rows[-1][col]+' '+s['text']);last_y=s['origin'][1];used.add(id(s))
                if index in (15,16,17):
                    boundaries=sorted(set(round(d['rect'].y0,1) for d in page.get_drawings() if d['fill'] is None and d['rect'].height<1 and d['rect'].width>400 and y<d['rect'].y0<end))
                    assert len(boundaries)==(11 if index==15 else 12), f'Grelha inesperada: página {index+1}'
                    rows += [['']*len(cols) for _ in range(len(boundaries)-1)]
                nodes.append({'type':'table','rows':rows,'y':y})
            current=None
            for line in lines_from([s for s in spans if id(s) not in used]):
                ss=sorted(line['spans'],key=lambda s:s['origin'][0]);text=clean(' '.join(s['text'] for s in ss));size=max(s['size'] for s in ss)
                if not text:continue
                if size>=19:kind='title'
                elif size>=12:kind='heading'
                elif all('Bold' in s['font'] for s in ss) and size>=10 and text.upper()==text:kind='callout_title'
                elif all('Bold' in s['font'] for s in ss) and size<=8:kind='kicker'
                else:kind='body'
                match=re.match(r'^(\d{2}\s+|•\s*)(.+)',text);number=None
                if match and kind=='body':
                    marker=match.group(1);kind='ordered' if marker.strip().isdigit() else 'bullet';text=match.group(2)
                    if kind=='ordered':number=int(marker.strip())
                can_join=current and kind=='body' and current['type'] in ('body','bullet','ordered') and 0<line['y']-current['last_y']<20
                if can_join and not any(current['y']<n['y']<line['y'] for n in nodes if n['type'] in ('table','label','review','incident')):
                    current['text']=clean(current['text']+' '+text);current['last_y']=line['y']
                else:
                    current={'type':kind,'text':text,'y':line['y'],'last_y':line['y']}
                    if number is not None:current['number']=number
                    nodes.append(current)
            nodes.sort(key=lambda n:n['y'])
            for n in nodes:n.pop('y',None);n.pop('last_y',None)
            result.append({'source_page':index+1,'nodes':nodes})
    return {'source_name':Path(path).name,'source_sha256':hashlib.sha256(Path(path).read_bytes()).hexdigest(),'pages':result}


if __name__=='__main__':
    data=extract(Path(sys.argv[1]));(HERE/'conteudo.json').write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n',encoding='utf8')
    print('Extraído:',len(data['pages']),'páginas;',sum(len(p['nodes']) for p in data['pages']),'blocos')
