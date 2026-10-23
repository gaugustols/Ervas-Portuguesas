"""Extrai o conteúdo editorial do downsell, sem executar instruções do PDF."""
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
            # O original tem uma tabela por página, identificada pelo cabeçalho branco de 9 pt.
            head=[s for s in spans if abs(s['size']-9)<.1 and s['color']==0xffffff]
            if head:
                ts=[s for s in spans if abs(s['size']-9)<.1 and s['color'] in (0xffffff,2377527)]
                cols=sorted(set(round(s['origin'][0],1) for s in head));rows=[];last_y=None
                for s in sorted(ts,key=lambda s:(s['origin'][1],s['origin'][0])):
                    y=s['origin'][1]
                    if last_y is None or y-last_y>14:rows.append(['']*len(cols))
                    col=max([i for i,x in enumerate(cols) if s['origin'][0]>=x-3] or [0])
                    rows[-1][col]=clean(rows[-1][col]+' '+s['text']);last_y=y;used.add(id(s))
                nodes.append({'type':'table','rows':rows,'y':min(s['origin'][1] for s in ts)})
            # Os sete cartões do calendário têm um selo lateral «DIA / nn».
            badges=sorted([s for s in spans if s['text'].strip()=='DIA' and abs(s['size']-14)<.1],key=lambda s:s['origin'][1])
            for i,badge in enumerate(badges):
                y=badge['origin'][1]
                number=next(s for s in spans if s['color']==0xffffff and s['text'].strip().isdigit() and y<s['origin'][1]<y+30)
                end=badges[i+1]['origin'][1]-10 if i+1<len(badges) else (480 if index==6 else 600)
                body=[s for s in spans if s['origin'][0]>110 and y-10<=s['origin'][1]<end]
                task_lines=[clean(' '.join(s['text'] for s in sorted(l['spans'],key=lambda s:s['origin'][0]))) for l in lines_from(body)]
                title=task_lines[0];duration=re.search(r'\([^)]*\)$',title).group()
                task={'type':'task','day':int(number['text']),'title':title[:title.rfind(duration)].strip(),'duration':duration,'items':[],'done':'','y':y-6}
                for text in task_lines[1:]:
                    if text.startswith('•'):task['items'].append(text.lstrip('• ').strip())
                    elif text.startswith('Feito quando:'):task['done']=text
                    elif task['done']:task['done']=clean(task['done']+' '+text)
                    elif task['items']:task['items'][-1]=clean(task['items'][-1]+' '+text)
                    else:raise ValueError('Linha de tarefa inesperada: '+text)
                assert task['items'] and task['done']
                nodes.append(task);used.update(id(s) for s in body+[badge,number])
            current=None
            for line in lines_from([s for s in spans if id(s) not in used]):
                ss=sorted(line['spans'],key=lambda s:s['origin'][0]);text=clean(' '.join(s['text'] for s in ss));size=max(s['size'] for s in ss)
                if not text:continue
                if size>=23:kind='title'
                elif size>=13:kind='heading'
                elif all('Bold' in s['font'] for s in ss) and ss[0]['color']==3894096 and size<=9:kind='callout_title' if size>=9 else 'kicker'
                else:kind='body'
                match=re.match(r'^(\d{2}\s+|•\s*|\[\s*\]\s*)(.+)',text)
                number=None
                if match and kind=='body':
                    marker=match.group(1);kind='ordered' if marker.strip().isdigit() else 'check' if '[' in marker else 'bullet';text=match.group(2)
                    if kind=='ordered':number=int(marker.strip())
                can_join=current and kind=='body' and current['type'] in ('body','ordered','bullet','check') and 0<line['y']-current['last_y']<19
                if can_join and not any(current['y']<n['y']<line['y'] for n in nodes if n['type'] in ('table','task')):
                    current['text']=clean(current['text']+' '+text);current['last_y']=line['y']
                else:
                    current={'type':kind,'text':text,'y':line['y'],'last_y':line['y']}
                    if number is not None:current['number']=number
                    nodes.append(current)
            nodes.sort(key=lambda n:n['y'])
            for n in nodes:n.pop('last_y',None);n.pop('y',None)
            result.append({'source_page':index+1,'nodes':nodes})
    return {'source_name':Path(path).name,'source_sha256':hashlib.sha256(Path(path).read_bytes()).hexdigest(),'pages':result}


if __name__=='__main__':
    data=extract(Path(sys.argv[1]));(HERE/'conteudo.json').write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n',encoding='utf8')
    print('Extraído:',len(data['pages']),'páginas;',sum(len(p['nodes']) for p in data['pages']),'blocos')
