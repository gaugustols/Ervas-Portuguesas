"""Compõe o entregável de manutenção sem alterar o original ou a publicação web."""
import re
from xml.sax.saxutils import escape
from estilo import (
    DATA, CREDITS, OUTPUT, W, H, M, CW, BG, CARD, LINE, TEXT, SUB, GREEN, MINT,
    INK, PALE, P, style, normalize, Numbered, Photo, Diagram, Doc, frame, leaf,
    box, table, nodes_to_flow, Paragraph, ParagraphStyle, Table, TableStyle,
    Flowable, Frame, PageTemplate, PageBreak, NextPageTemplate, Spacer, KeepTogether,
)
from reportlab.lib.colors import HexColor, white
from html import unescape


class Ribbon(Flowable):
    def wrap(self,a,h): self.width=a;self.height=94;return a,94
    def draw(self):
        c=self.canv;c.setFillColor(CARD);c.setStrokeColor(LINE);c.roundRect(0,0,self.width,94,12,fill=1,stroke=1)
        names=['Observa','Toca','Confere','Recorda','Decide']
        c.setStrokeColor(HexColor('#365641'));c.line(50,57,self.width-50,57)
        for i,name in enumerate(names):
            x=self.width*(i+.5)/5;c.setFillColor(GREEN);c.circle(x,57,14,fill=1,stroke=0)
            c.setFont('Jakarta600',10);c.setFillColor(white);c.drawCentredString(x,53,str(i+1))
            c.setFont('Jakarta600',9);c.setFillColor(TEXT);c.drawCentredString(x,24,name)


class HarvestDiagram(Flowable):
    def wrap(self,a,h): self.width=a;self.height=158;return a,158
    def draw(self):
        c=self.canv;c.setFillColor(CARD);c.setStrokeColor(LINE);c.roundRect(0,0,self.width,158,14,fill=1,stroke=1)
        c.setStrokeColor(MINT);c.setLineWidth(2);c.line(88,25,88,133)
        for y in [43,78,113]:
            for sign in [-1,1]:
                p=c.beginPath();p.moveTo(88,y);p.curveTo(88+sign*20,y,88+sign*30,y+14,88+sign*28,y+20);p.curveTo(88+sign*8,y+20,88,y+9,88,y);c.drawPath(p,stroke=1)
        c.setDash(3,3);c.line(56,101,126,101);c.setDash();c.line(130,101,166,101)
        c.setFillColor(TEXT);c.setFont('Jakarta600',11);c.drawString(181,112,'Corte acima de um nó com folhas')
        c.setFont('Jakarta400',9.2);c.drawString(181,89,'Esquema para hastes como as da hortelã.')
        c.drawString(181,69,'Preserva a maior parte da folhagem.')
        c.setFillColor(SUB);c.drawString(181,42,'Na salsa, conserva o centro da planta.')
        c.setFont('Jakarta400',8);c.drawString(20,10,'Demonstração esquemática, sem escala. Consulta a regra de cada espécie.')


class SupportDiagram(Flowable):
    def __init__(self,kind):Flowable.__init__(self);self.kind=kind
    def wrap(self,a,h):self.width=a;self.height=130;return a,130
    def draw(self):
        c=self.canv;c.setFillColor(CARD);c.setStrokeColor(LINE);c.roundRect(0,0,self.width,130,14,fill=1,stroke=1)
        if self.kind=='photos':
            for x,label in [(24,'Fotografia de referência'),(self.width/2+12,'Nova observação')]:
                c.setStrokeColor(HexColor('#52765d'));c.roundRect(x,36,self.width/2-36,75,8,stroke=1,fill=0)
                leaf(c,x+70,44,1.2)
                c.setFillColor(TEXT);c.setFont('Jakarta600',9);c.drawString(x+12,17,label)
            c.setFillColor(SUB);c.setFont('Jakarta400',8);c.drawCentredString(self.width/2,5,'Compara o mesmo vaso, do mesmo ângulo.')
        elif self.kind=='weather':
            for i,(label,detail) in enumerate([('Luz','Horas de sol'),('Tempo','Chuva, calor e vento'),('Substrato','Humidade real')]):
                x=22+i*(self.width-28)/3;c.setStrokeColor(HexColor('#52765d'));c.roundRect(x,45,(self.width-64)/3,62,8,stroke=1,fill=0)
                c.setFillColor(MINT);c.setFont('Jakarta600',12);c.drawCentredString(x+(self.width-64)/6,68,label)
                c.setFillColor(TEXT);c.setFont('Jakarta400',8.4);c.drawCentredString(x+(self.width-64)/6,27,detail)
        else:
            c.setFillColor(TEXT);c.setFont('Jakarta600',10);c.drawString(20,106,'Uma revisão por semana. Uma decisão por vaso.')
            for i,label in enumerate(['Dia 7','Dia 14','Dia 21','Dia 28']):
                x=20+i*(self.width-32)/4;c.setStrokeColor(HexColor('#52765d'));c.roundRect(x,23,(self.width-76)/4,60,8,stroke=1,fill=0)
                c.setFillColor(MINT);c.setFont('Jakarta600',10);c.drawCentredString(x+(self.width-76)/8,59,label)
                c.setStrokeColor(MINT)
                for j in range(3):c.line(x+12,47-j*8,x+(self.width-76)/4-12,47-j*8)


class TaskCard(Flowable):
    def __init__(self,text):
        Flowable.__init__(self)
        match=re.fullmatch(r'(Dia \d+ \| .+?) FAZ: (.+?) DECIDE: (.+?) Registo: (.+)',text)
        if not match:raise ValueError('Tarefa não reconhecida: '+text)
        self.title,self.action,self.decision,self.record=match.groups()
    def wrap(self,a,h):
        self.width=a;self.parts=[];height=16
        for text,font,size,leading,color in [
            (self.title,'Jakarta600',12,17,TEXT),
            ('FAZ: '+self.action,'Jakarta400',10,15,TEXT),
            ('DECIDE: '+self.decision,'Jakarta400',10,15,MINT),
        ]:
            p=Paragraph(escape(normalize(text)),ParagraphStyle('task',fontName=font,fontSize=size,leading=leading,textColor=color))
            _,ph=p.wrap(a-32,h);self.parts.append((p,ph));height+=ph+9
        self.height=height+24
        return a,self.height
    def draw(self):
        c=self.canv;c.setFillColor(CARD);c.setStrokeColor(LINE);c.roundRect(0,0,self.width,self.height,12,fill=1,stroke=1)
        y=self.height-16
        for p,ph in self.parts:y-=ph;p.drawOn(c,16,y);y-=9
        c.setFont('Jakarta400',8.2);c.setFillColor(SUB);c.drawString(16,14,'Registo:')
        for x,label in [(65,'Feito'),(120,'Não aplicável')]:
            c.setStrokeColor(MINT);c.roundRect(x,13,8,8,1,fill=0,stroke=1);c.drawString(x+13,14,label)
        c.drawString(218,14,'Nota:');c.setStrokeColor(HexColor('#688774'));c.line(244,12,self.width-16,12)


class FormLine(Flowable):
    def __init__(self,text):Flowable.__init__(self);self.text=text
    def wrap(self,a,h):
        self.width=a
        text=self.text.replace('☐','').strip()
        checkbox={
            'Solo nesse momento: seco ligeiramente húmido muito molhado':('Solo nesse momento:',['Seco','Ligeiramente húmido','Muito molhado']),
            'Pragas ou bolor visíveis? sim não Onde? _________________________________':('Pragas ou bolor visíveis?',['Sim','Não']),
            'Fotografias guardadas? geral detalhe verso das folhas':('Fotografias guardadas?',['Geral','Detalhe','Verso das folhas']),
            'Melhorou Igual Piorou Pedi ajuda a um viveiro':('',['Melhorou','Igual','Piorou','Pedi ajuda a um viveiro']),
        }
        self.options=checkbox.get(re.sub(r'\s+',' ',text));self.lines=[]
        if self.options:self.height=45 if self.options[0] else 25;return a,self.height
        label=re.sub(r'_+','',text).strip();self.blank=not label
        self.p=Paragraph(escape(label),ParagraphStyle('form',parent=style('body',True),fontSize=9.7,leading=14)) if label else None
        self.ph=self.p.wrap(a,h)[1] if self.p else 0
        self.height=max(24,self.ph+13)
        return a,self.height
    def draw(self):
        c=self.canv;c.setStrokeColor(HexColor('#8ba997'));c.setFillColor(INK);c.setFont('Jakarta400',9)
        if self.options:
            label,values=self.options;y=self.height-14
            if label:c.drawString(0,y,label);y-=22
            x=0
            for value in values:
                c.roundRect(x,y-1,9,9,1.5,stroke=1,fill=0);c.drawString(x+15,y,value)
                x+=c.stringWidth(value,'Jakarta400',9)+36
            if 'Onde?' in self.text:c.drawString(x,y,'Onde?');c.line(x+32,y-2,self.width,y-2)
        else:
            if self.p:self.p.drawOn(c,0,self.height-self.ph)
            c.line(0,5,self.width,5)


def render(nodes,light=False):
    out=[];counter=0
    prefixes=['Segurança','A promessa deste guia','Evita a regra do «copo por dia»','Regra de recuperação','Antes de usar ervas na cozinha ou em qualquer preparação','Critério de sucesso','Terminaste quando...']
    for n in nodes:
        text=n.get('text','');kind=n['type']
        if light and ('_' in text or any(text.startswith(s) for s in ['Solo nesse momento:','Pragas ou bolor visíveis?','Fotografias guardadas?','Melhorou Igual'])):
            out.append(FormLine(text));continue
        if kind=='table':
            rows=n['rows']
            if light:out.extend([worksheet_table(rows),Spacer(1,12)])
            else:out.extend([table(rows),Spacer(1,12)])
        elif kind=='title':out.append(P(text,'title',light));counter=0
        elif kind=='heading':out.append(P(text,'heading',light));counter=0
        elif kind=='kicker' or text.startswith(('PLANO DE 30 DIAS','FOLHAS IMPRIMÍVEIS','CONSULTA RÁPIDA','CONSULTA SOS','BOTICA VIVA • CADERNO','BOTICA VIVA • FIM')):out.append(P(text,'kicker',light))
        elif any(text.startswith(prefix+' ') for prefix in prefixes):
            prefix=next(prefix for prefix in prefixes if text.startswith(prefix+' '));out.extend([Spacer(1,7),box(prefix,text[len(prefix):].strip(),light),Spacer(1,10)])
        elif kind in ('bullet','check','ordered'):
            if kind=='ordered':counter+=1
            out.append(Numbered(text,counter if kind=='ordered' else None,kind=='check',light))
        else:out.append(P(text,light=light))
    return out


def worksheet_table(rows):
    n=len(rows[0]);headers=rows[0]
    if headers[0]=='Data / vaso':widths=[65,100,75,138,CW-378];heights=[42]+[31]*(len(rows)-1)
    elif headers[0]=='Semana / data':widths=[90,45,95,110,CW-340];heights=[54]+[32]*(len(rows)-1)
    elif headers[0]=='Vaso':widths=[48,110,108,111,CW-377];heights=[42]+[42]*(len(rows)-1)
    else:widths=[CW*.38,CW*.62];heights=None
    cells=[]
    for i,row in enumerate(rows):
        new=[]
        for cell in row:
            if i>0 and set(cell.strip())=={'_'}:
                from estilo import BlankCell
                new.append(BlankCell());continue
            cell=re.sub(r'_{13,}','____________',cell)
            new.append(Paragraph(escape(normalize(cell)),ParagraphStyle('worksheet',fontName='Jakarta600' if i==0 else 'Jakarta400',fontSize=9.1,leading=13.1,textColor=white if i==0 else INK)))
        cells.append(new)
    if heights:
        for i,row in enumerate(cells):
            for j,cell in enumerate(row):
                needed=cell.wrap(widths[j]-18,10000)[1]+14
                if needed>heights[i]+.01:raise ValueError(f'Célula sem altura suficiente: {headers[0]}, linha {i}, coluna {j}')
    t=Table(cells,colWidths=widths,rowHeights=heights,repeatRows=1,hAlign='LEFT')
    t.setStyle(TableStyle([('VALIGN',(0,0),(-1,-1),'TOP'),('BACKGROUND',(0,0),(-1,0),GREEN),('ROWBACKGROUNDS',(0,1),(-1,-1),[PALE,white]),('LINEBELOW',(0,0),(-1,-1),.4,HexColor('#d0dfd4')),('LEFTPADDING',(0,0),(-1,-1),9),('RIGHTPADDING',(0,0),(-1,-1),9),('TOPPADDING',(0,0),(-1,-1),7),('BOTTOMPADDING',(0,0),(-1,-1),7)]))
    return t


def N(kind,text):return {'type':kind,'text':text}


def main():
    OUTPUT.parent.mkdir(parents=True,exist_ok=True)
    doc=Doc(str(OUTPUT),pagesize=(W,H),leftMargin=M,rightMargin=M,topMargin=96,bottomMargin=58,title='Mantém a Tua Horta Viva | 30 Dias | Botica Viva',author='Botica Viva',subject='Caderno prático de manutenção da horta',pageCompression=1)
    for name,light,cover in [('cover',False,True),('dark',False,False),('light',True,False)]:
        doc.addPageTemplates(PageTemplate(id=name,frames=[Frame(M,58,CW,H-154,leftPadding=0,rightPadding=0,topPadding=0,bottomPadding=0)],onPage=lambda c,d,l=light,co=cover:frame(c,d,l,co)))
    story=[]
    def section(nodes,light=False,art=None):
        if story:story.extend([NextPageTemplate('light' if light else 'dark'),PageBreak()])
        if art:
            title=next(i for i,n in enumerate(nodes) if n['type']=='title');story.extend(render(nodes[:title+1],light));story.extend([art,Spacer(1,18)]);nodes=nodes[title+1:]
        story.extend(render(nodes,light))
    pages=DATA['pages']
    # Capa, com conteúdo original e a linguagem visual da coleção.
    cover=pages[0]['nodes'];story.append(P(cover[0]['text'],'kicker'));story.append(Spacer(1,12))
    story.append(Paragraph('Mantém a Tua<br/><font color="#78d895">Horta Viva</font>',ParagraphStyle('cover-title',parent=style('title'),fontSize=39,leading=47,spaceAfter=20)))
    story.extend(render([N('body',cover[3]['text']+' '+cover[4]['text']),cover[5]]));story.extend([Spacer(1,8),Diagram('trio',130),Spacer(1,16)]);story.extend(render(cover[6:]))
    # Ponto de partida e regras, sem misturar instruções de cultivo com tratamentos.
    nodes=pages[1]['nodes'];cut=next(i for i,n in enumerate(nodes) if n.get('text')=='As quatro regras que evitam mais erros')
    # Reúne apenas as duas linhas de uma frase originalmente partidas pelo exportador.
    nodes=[nodes[0],N('body',nodes[1]['text']+' '+nodes[2]['text'])]+nodes[3:];cut-=1
    section(nodes[:cut],art=Ribbon());section([N('title','As regras que protegem a tua horta')]+nodes[cut:],art=Diagram('trio',130))
    # Decisão de rega: passos, tabela e demonstração em páginas próprias.
    nodes=pages[2]['nodes'];ti=next(i for i,n in enumerate(nodes) if n['type']=='table');wi=next(i for i,n in enumerate(nodes) if n.get('text')=='Como regar quando a planta precisa')
    section(nodes[:ti],art=Ribbon());section([N('title','Da observação à próxima decisão')]+nodes[ti:wi],art=Diagram('decision',150));section([N('title',nodes[wi]['text'])]+nodes[wi+1:],art=Diagram('water',150))
    # Tabela geral com mais largura de leitura, dividida por percurso.
    nodes=pages[3]['nodes'];ti=next(i for i,n in enumerate(nodes) if n['type']=='table');rows=nodes[ti]['rows']
    intro=[nodes[0],N('body',nodes[1]['text']+' '+nodes[2]['text'])]
    section(intro+[N('heading','Percurso A · Alecrim, tomilho e orégãos'),{'type':'table','rows':rows[:4]}],art=Diagram('light',120))
    section([N('title','Cada planta tem a sua regra'),N('heading','Percurso B · Hortelã-verde, erva-cidreira e salsa'),{'type':'table','rows':[rows[0]]+rows[4:]}]+nodes[ti+1:])
    # Os trinta dias: três blocos por semana, para haver espaço para ler e registar.
    for page in pages[4:9]:
        nodes=page['nodes'];tasks=[n['text'] for n in nodes if n.get('text','').startswith('Dia ')]
        groups=[tasks[:3],tasks[3:5],tasks[5:]] if len(tasks)==7 else [tasks]
        for index,group in enumerate(groups):
            if not group:continue
            if index==0:head=nodes[:3]
            else:head=[nodes[0],N('title',f"Dias {int(group[0].split()[1])} a {int(group[-1].split()[1])}"),nodes[2]]
            section(head)
            for task in group:story.extend([TaskCard(task),Spacer(1,16)])
            # Páginas com duas tarefas recebem uma demonstração de consulta útil.
            if len(group)==2:
                first=int(group[0].split()[1])
                if first==4:art=Diagram('water',130)
                elif first in (6,13):art=SupportDiagram('photos')
                elif first in (11,20):art=SupportDiagram('weather')
                elif first==18:art=Diagram('decision',130)
                elif first==27:art=HarvestDiagram()
                else:art=SupportDiagram('review')
                story.extend([Spacer(1,6),art])
    # Seis fichas fotográficas; a tabela original passa a quatro blocos verticais.
    ids=['erva-1','erva-5','erva-6','erva-2','erva-12','erva-7'];count=0
    for page in pages[9:11]:
        nodes=page['nodes'];starts=[i for i,n in enumerate(nodes) if n['type']=='heading' and ' | ' in n.get('text','')]
        for k,start in enumerate(starts):
            end=starts[k+1] if k+1<len(starts) else len(nodes);part=nodes[start:end];rows=part[1]['rows']
            section([nodes[0],N('title',part[0]['text'])])
            story.extend([P(nodes[1]['text'],'small'),Photo(ids[count],180),Spacer(1,8),P('Fotografia para estudo. Confirma a identificação pelo nome botânico.','small')])
            for label,body in zip(rows[0],rows[1]):story.extend([P(label,'heading'),P(body)])
            story.extend(render(part[2:]));count+=1
    # SOS em grupos de quatro, sem usar fotografias como diagnóstico.
    sos=pages[11]['nodes']+pages[12]['nodes'];cases=[];current=None;recovery=None
    for n in sos:
        if n['type']=='heading' and re.match(r'^\d+\.',n['text']):current=[n];cases.append(current)
        elif n.get('text','').startswith('Regra de recuperação'):recovery=n
        elif current is not None:current.append(n)
    for start in range(0,len(cases),4):
        section([N('kicker','CONSULTA SOS / IDENTIFICAR ANTES DE AGIR'),N('title','SOS: 12 situações comuns e o que fazer' if start==0 else f'SOS · Situações {start+1} a {start+4}')]+[n for case in cases[start:start+4] for n in case]+([recovery] if start==8 else []))
    # Pragas e colheita: as verificações de segurança mantêm-se junto das ações.
    nodes=pages[13]['nodes'];cut=next(i for i,n in enumerate(nodes) if n['type']=='title' and i>0)
    section(nodes[:cut]);section(nodes[cut:])
    nodes=pages[14]['nodes'];cut=next(i for i,n in enumerate(nodes) if n.get('text','').startswith('Depois do primeiro corte:'))
    section([N('title',nodes[0]['text'])]+nodes[1:cut],art=HarvestDiagram())
    section([N('title',nodes[cut]['text'])]+nodes[cut+1:],art=Diagram('trio',125))
    nodes=pages[15]['nodes'];cut=next(i for i,n in enumerate(nodes) if n.get('text')=='Como pedir ajuda sem perder tempo')
    section(nodes[:cut])
    help_nodes=[]
    for node in nodes[cut+1:]:
        if node.get('text','').startswith('Se precisares de apoio'):
            help_nodes.extend(N('body',part.strip()) for part in re.split(r'(?=[1-7]\) )',node['text']) if part.strip())
        else:help_nodes.append(node)
    section([N('title',nodes[cut]['text'])]+help_nodes,art=SupportDiagram('photos'))
    # Folhas imprimíveis em fundo claro; cada tabela mantém linhas para escrita.
    for page in pages[16:20]:section(page['nodes'],light=True)
    nodes=pages[20]['nodes'];cut=next(i for i,n in enumerate(nodes) if n.get('text')=='A minha rotina para os próximos 30 dias')
    section(nodes[:cut],light=True);section([nodes[0],N('title',nodes[cut]['text'])]+nodes[cut+1:],light=True)
    # Atribuições de todas as fotografias reutilizadas na edição.
    section([N('title','Créditos das fotografias'),N('body','As fotografias da biblioteca Botica Viva ajudam a estudar as plantas. Não confirmam, por si só, a identificação segura nem servem para diagnosticar problemas de cultivo. As licenças indicadas aplicam-se às respetivas imagens.')])
    for name,herb in zip(['Alecrim','Tomilho','Orégãos','Hortelã-verde','Erva-cidreira','Salsa'],ids):
        cr=CREDITS[herb];author=unescape(re.sub('<[^>]+>','',cr['autor'])).split('--')[0].strip()
        story.extend([P(name,'heading'),P(f'{author} · {cr["licenca"]}','small')])
        story.append(Paragraph(f'<link href="{escape(cr["pagina"])}" color="#78d895">Fotografia original no Wikimedia Commons</link> · <link href="{escape(cr["licencaUrl"].replace("http:","https:"))}" color="#78d895">Licença</link>',style('small')))
        story.append(P('Imagem redimensionada e enquadrada para esta edição.','small'))
    story.extend([Spacer(1,12),P('Composição editorial e diagramas vetoriais: Botica Viva. Demonstrações esquemáticas; não estão à escala.','small')])
    doc.build(story)
    print('PDF criado:',OUTPUT)


if __name__=='__main__':main()
