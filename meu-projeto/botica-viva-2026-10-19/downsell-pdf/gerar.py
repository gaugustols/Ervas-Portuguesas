"""Edição visual de O Meu Primeiro Vaso. Não altera a landing nem o PDF original."""
import re
from html import unescape
from xml.sax.saxutils import escape
from estilo import (
    DATA,CREDITS,OUTPUT,W,H,M,CW,CARD,LINE,TEXT,SUB,GREEN,MINT,INK,PALE,
    P,style,normalize,Numbered,Photo,Diagram,Doc,frame,leaf,pot,box,table,BlankCell,
    Paragraph,ParagraphStyle,Table,TableStyle,Flowable,Frame,PageTemplate,
    PageBreak,NextPageTemplate,Spacer,
)
from reportlab.lib.colors import HexColor,white

REFERENCES={
    'Leva a lista da página 4':'Leva a lista da secção «Leva só o necessário»',
    'Segue os dez passos da página 5':'Segue os dez passos da secção «Transplanta sem complicar»',
}


def editorial(text):
    for old,new in REFERENCES.items():text=text.replace(old,new)
    return normalize(text)


def para(text,kind='body',light=False):return P(editorial(text),kind,light)


class Document(Doc):
    def afterFlowable(self,f):
        super().afterFlowable(f)
        if isinstance(f,Paragraph) and f.style.name=='title':
            if f.getPlainText()=='Leva só o necessário':self.canv.bookmarkPage('compras')
            if f.getPlainText()=='Transplanta sem complicar':self.canv.bookmarkPage('transplante')


class SinglePot(Flowable):
    def wrap(self,a,h):self.width=a;self.height=180;return a,180
    def draw(self):
        c=self.canv;c.setFillColor(CARD);c.setStrokeColor(LINE);c.roundRect(0,0,self.width,180,14,fill=1,stroke=1)
        pot(c,44,30,112,80);leaf(c,100,106,1.5)
        c.setFillColor(TEXT);c.setFont('Jakarta600',18);c.drawString(201,116,'Um começo simples.')
        c.setFillColor(MINT);c.setFont('Jakarta600',11);c.drawString(201,91,'Hortelã-verde · Mentha spicata')
        c.setFillColor(SUB);c.setFont('Jakarta400',10);c.drawString(201,65,'Uma planta identificada.')
        c.drawString(201,45,'Um vaso com furos. Cuidados próprios.')
        c.setFont('Jakarta400',8);c.drawString(22,12,'Demonstração esquemática, sem escala.')


class PhotoComparison(Flowable):
    def wrap(self,a,h):self.width=a;self.height=132;return a,132
    def draw(self):
        c=self.canv;c.setFillColor(CARD);c.setStrokeColor(LINE);c.roundRect(0,0,self.width,132,14,fill=1,stroke=1)
        for x,label in [(22,'Fotografia inicial'),(self.width/2+10,'Nova observação')]:
            c.setStrokeColor(HexColor('#52765d'));c.roundRect(x,36,self.width/2-32,75,8,stroke=1,fill=0);leaf(c,x+75,44,1.2)
            c.setFillColor(TEXT);c.setFont('Jakarta600',9);c.drawString(x+14,18,label)
        c.setFillColor(SUB);c.setFont('Jakarta400',8);c.drawCentredString(self.width/2,5,'Compara o mesmo vaso e regista as alterações.')


class DayCard(Flowable):
    def __init__(self,node):Flowable.__init__(self);self.node=node
    def wrap(self,a,h):
        self.width=a;self.parts=[];height=16
        data=[(f"DIA {self.node['day']:02} · {self.node['title']}",'Jakarta600',12,17,TEXT),
              (self.node['duration'],'Jakarta400',8.7,13,SUB)]
        data += [('• '+t,'Jakarta400',10.3,15.5,TEXT) for t in self.node['items']]
        data += [(self.node['done'],'Jakarta600',10.1,15.5,MINT)]
        for text,font,size,leading,color in data:
            text=escape(editorial(text))
            for label,target in [('Leva só o necessário','compras'),('Transplanta sem complicar','transplante')]:
                text=text.replace('«'+label+'»',f'<link href="#{target}" color="#78d895">«{label}»</link>')
            p=Paragraph(text,ParagraphStyle('task',fontName=font,fontSize=size,leading=leading,textColor=color))
            _,ph=p.wrap(a-32,h);self.parts.append((p,ph));height+=ph+8
        self.height=height+10;return a,self.height
    def draw(self):
        c=self.canv;c.setFillColor(CARD);c.setStrokeColor(LINE);c.roundRect(0,0,self.width,self.height,12,fill=1,stroke=1)
        y=self.height-16
        for p,ph in self.parts:y-=ph;p.drawOn(c,16,y);y-=8


class Fields(Flowable):
    def __init__(self,fields,heights=30):Flowable.__init__(self);self.fields=fields;self.requested=heights
    def wrap(self,a,h):self.width=a;self.height=self.requested;return a,self.height
    def draw(self):
        c=self.canv;c.setFillColor(INK);c.setStrokeColor(HexColor('#8ba997'));c.setLineWidth(.6)
        n=len(self.fields);gap=14;w=(self.width-gap*(n-1))/n
        for i,label in enumerate(self.fields):
            x=i*(w+gap);c.setFont('Jakarta400',9.2);c.drawString(x,self.height-12,label);c.line(x,7,x+w,7)
            if self.height>=50:c.line(x,27,x+w,27)


class Checks(Flowable):
    def __init__(self,labels):Flowable.__init__(self);self.labels=labels
    def wrap(self,a,h):self.width=a;self.height=26;return a,26
    def draw(self):
        c=self.canv;x=0;c.setStrokeColor(HexColor('#6e967a'));c.setFillColor(INK);c.setFont('Jakarta400',8.6)
        for label in self.labels:
            c.roundRect(x,10,9,9,1.5,stroke=1,fill=0);c.drawString(x+14,11,label);x+=c.stringWidth(label,'Jakarta400',8.6)+28


def worksheet_table(rows):
    widths=[35,195,135,CW-365];cells=[]
    for i,row in enumerate(rows):
        cells.append([BlankCell() if i>0 and set(cell)=={'_'} else Paragraph(escape(cell),ParagraphStyle('cell',fontName='Jakarta600' if i==0 else 'Jakarta400',fontSize=9.1,leading=13.7,textColor=white if i==0 else INK)) for cell in row])
    heights=[42]+[34]*(len(rows)-1)
    for i,row in enumerate(cells):
        for j,cell in enumerate(row):
            if cell.wrap(widths[j]-18,10000)[1]+14>heights[i]+.01:raise ValueError('Célula sem altura suficiente')
    t=Table(cells,colWidths=widths,rowHeights=heights,hAlign='LEFT',repeatRows=1)
    t.setStyle(TableStyle([('VALIGN',(0,0),(-1,-1),'TOP'),('BACKGROUND',(0,0),(-1,0),GREEN),('ROWBACKGROUNDS',(0,1),(-1,-1),[PALE,white]),('LEFTPADDING',(0,0),(-1,-1),9),('RIGHTPADDING',(0,0),(-1,-1),9),('TOPPADDING',(0,0),(-1,-1),7),('BOTTOMPADDING',(0,0),(-1,-1),7),('LINEBELOW',(0,0),(-1,-1),.4,HexColor('#d0dfd4'))]))
    return t


def render(nodes,light=False):
    out=[];i=0;counter=0
    while i<len(nodes):
        n=nodes[i];kind=n['type'];text=n.get('text','')
        if kind=='table':out.extend([worksheet_table(n['rows']) if light else table(n['rows']),Spacer(1,12)])
        elif kind=='title':out.append(para(text,'title',light));counter=0
        elif kind=='heading':out.append(para(text,'heading',light));counter=0
        elif kind=='kicker':out.append(para(text,'kicker',light))
        elif kind=='callout_title':
            assert nodes[i+1]['type']=='body'
            out.extend([Spacer(1,8),box(editorial(text),editorial(nodes[i+1]['text']),light),Spacer(1,12)]);i+=1
        elif kind=='task':out.extend([DayCard(n),Spacer(1,16)])
        elif kind in ('ordered','bullet','check'):
            if kind=='ordered':counter=n.get('number',counter+1)
            out.append(Numbered(editorial(text),counter if kind=='ordered' else None,kind=='check',light))
        else:out.append(para(text,light=light))
        i+=1
    return out


def N(kind,text):return {'type':kind,'text':text}


def main():
    OUTPUT.parent.mkdir(parents=True,exist_ok=True)
    doc=Document(str(OUTPUT),pagesize=(W,H),leftMargin=M,rightMargin=M,topMargin=96,bottomMargin=58,title='O Meu Primeiro Vaso | Botica Viva',author='Botica Viva',subject='Hortelã-verde em casa: plano de sete dias',pageCompression=1)
    for name,light,cover in [('cover',False,True),('dark',False,False),('light',True,False)]:
        doc.addPageTemplates(PageTemplate(id=name,frames=[Frame(M,58,CW,H-154,leftPadding=0,rightPadding=0,topPadding=0,bottomPadding=0)],onPage=lambda c,d,l=light,co=cover:frame(c,d,l,co)))
    story=[]
    def section(nodes,light=False,art=None):
        if story:story.extend([NextPageTemplate('light' if light else 'dark'),PageBreak()])
        if art:
            title=next(i for i,n in enumerate(nodes) if n['type']=='title');story.extend(render(nodes[:title+1],light));story.extend([art,Spacer(1,18)]);nodes=nodes[title+1:]
        story.extend(render(nodes,light))
    pages=DATA['pages'];cover=pages[0]['nodes']
    story.extend([para(cover[0]['text'],'kicker'),Spacer(1,22),Paragraph('O Meu<br/><font color="#78d895">Primeiro Vaso</font>',ParagraphStyle('cover-title',parent=style('title'),fontSize=42,leading=50,spaceAfter=20))])
    story.extend(render(cover[3:5]));story.extend([Spacer(1,16),SinglePot(),Spacer(1,18)]);story.extend(render(cover[5:]))
    nodes=pages[1]['nodes'];cut=next(i for i,n in enumerate(nodes) if n.get('text','').startswith('É hortelã-verde'))
    section(nodes[:cut]);section([N('kicker','CONHECE A TUA PLANTA'),N('title','Hortelã-verde'),nodes[cut]])
    story.extend([Photo('erva-2',245),Spacer(1,10),para('Mentha spicata · Fotografia para estudo, não para confirmar consumo.','small'),Spacer(1,12)]);story.extend(render(nodes[cut+1:]))
    nodes=pages[2]['nodes'];cut=next(i for i,n in enumerate(nodes) if n['type']=='table')
    section(nodes[:cut],art=Diagram('light',130));section([nodes[0],N('title','Confirma as condições do local')]+nodes[cut:],art=Diagram('drain',150))
    section(pages[3]['nodes'])
    nodes=pages[4]['nodes'];cut=next(i for i,n in enumerate(nodes) if n.get('number')==6)
    section(nodes[:cut],art=Diagram('transplant',150));section([nodes[0],N('title','Termina a montagem do vaso')]+nodes[cut:],art=Diagram('water',150))
    nodes=pages[5]['nodes'];cut=next(i for i,n in enumerate(nodes) if n.get('text')=='Casos que confundem quem começa')
    section(nodes[:cut],art=Diagram('water',150));section([nodes[0],N('title',nodes[cut]['text'])]+nodes[cut+1:],art=Diagram('decision',150))
    nodes=pages[6]['nodes'];tasks=[n for n in nodes if n['type']=='task'];end=next(i for i,n in enumerate(nodes) if n.get('text')=='Se não transplantares no Dia 3')
    section(nodes[:3]+tasks[:2]);section([nodes[0],N('title','Dia 3 · Instala a tua hortelã')]+tasks[2:]+nodes[end:])
    nodes=pages[7]['nodes'];tasks=[n for n in nodes if n['type']=='task']
    section(nodes[:3]+tasks[:2]);section([nodes[0],N('title','Dias 6 e 7 · Observa e define a rotina')]+tasks[2:],art=PhotoComparison())
    nodes=pages[8]['nodes'];cut=next(i for i,n in enumerate(nodes) if n.get('text')=='O que fazer se a planta piorar')
    section(nodes[:cut]);section([nodes[0],N('title',nodes[cut]['text'])]+nodes[cut+1:],art=PhotoComparison())
    nodes=pages[9]['nodes'];cut=next(i for i,n in enumerate(nodes) if n.get('text')=='Checklist da missão cumprida')
    section(nodes[:cut]);section([nodes[0],N('title',nodes[cut]['text'])]+nodes[cut+1:],art=SinglePot())
    nodes=pages[10]['nodes'];ti=next(i for i,n in enumerate(nodes) if n['type']=='table')
    section(nodes[:3],light=True)
    story.extend([para('Para escrever no telemóvel, usa um leitor de PDF com ferramentas de anotação.','small',True),Fields(['Nome:','Data de início: ____ / ____ / ______']),Fields(['Local do vaso:']),Fields(['Sol direto (aprox.):','Horário:']),Fields(['Espécie no rótulo: Mentha spicata','Vaso (cm):']),Checks(['Transplantado? Sim','Não']),para('Lista de compras','heading',True),Checks(['Planta identificada','Vaso com furos','Substrato','Prato','Etiqueta']),para('Registo dos sete dias','heading',True),worksheet_table(nodes[ti]['rows'])])
    section([nodes[0],N('title','O meu registo de observação'),N('heading','Se apareceu um problema')],light=True)
    story.extend([Fields(['Sinal:'],60),Fields(['O que confirmei antes de agir:'],60),Fields(['Uma ação que fiz:'],60),Fields(['Volto a avaliar em:']),para('O meu próximo passo','heading',True),Fields(['Dia da próxima observação:']),Fields(['Local definido:']),Spacer(1,16),box('A regra que fica',nodes[-1]['text'],True)])
    section([N('title','Créditos e imagens'),N('body','A fotografia ajuda a estudar a hortelã-verde. A identificação segura depende do nome botânico e da origem, não apenas da imagem.')])
    cr=CREDITS['erva-2'];author=unescape(re.sub('<[^>]+>','',cr['autor'])).split('--')[0].strip()
    story.extend([para('Hortelã-verde · Mentha spicata','heading'),para(f'{author} · {cr["licenca"]}','body')])
    story.append(Paragraph(f'<link href="{escape(cr["pagina"])}" color="#78d895">Fotografia original no Wikimedia Commons</link> · <link href="{escape(cr["licencaUrl"].replace("http:","https:"))}" color="#78d895">Licença</link>',style('body')))
    story.extend([para('Fotografia da biblioteca Botica Viva, redimensionada e enquadrada nesta edição.','small'),Spacer(1,24),para('Demonstrações visuais','heading'),para('Diagramas vetoriais e composição editorial: Botica Viva. Os desenhos são esquemas de demonstração, sem escala. Não servem para identificar uma planta ou diagnosticar uma doença.'),Spacer(1,16),para('Leitura e registos','heading'),para('As folhas claras foram preparadas para impressão e escrita à mão. Para adicionar texto no telemóvel, utiliza as ferramentas de anotação de um leitor de PDF. Este documento não inclui campos de formulário interativos.')])
    doc.build(story);print('PDF criado:',OUTPUT)


if __name__=='__main__':main()
