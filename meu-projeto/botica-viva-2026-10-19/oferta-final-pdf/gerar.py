"""Diagrama o kit de organização na identidade Botica Viva; não publica o produto."""
import re
from xml.sax.saxutils import escape
from estilo import (
    DATA,OUTPUT,W,H,M,CW,CARD,LINE,TEXT,SUB,GREEN,MINT,INK,PALE,
    P,style,normalize,Numbered,Doc,frame,leaf,box,table,
    Paragraph,ParagraphStyle,Table,TableStyle,Flowable,Frame,PageTemplate,
    PageBreak,NextPageTemplate,Spacer,
)
from reportlab.lib.colors import HexColor,white

EDITS={
 'Preencher diretamente no Word':'Anotar num leitor de PDF',
 'Podes imprimir só as folhas de que precisas ou duplicá-las no Word.':'Podes imprimir só as folhas de que precisas ou repetir a impressão dos modelos.',
 'Guarda este PDF ou o Word no telemóvel para poderes consultar ou voltar a imprimir.':'Guarda este PDF no telemóvel para poderes consultar ou voltar a imprimir.',
 'Um ID por recipiente/lote. Podes tirar fotocópias ou duplicar esta página no Word.':'Um ID por recipiente/lote. Podes tirar fotocópias ou voltar a imprimir esta página.',
}


def editorial(text):
    for a,b in EDITS.items():text=text.replace(a,b)
    return normalize(text)


def para(text,kind='body',light=False):return P(editorial(text),kind,light)


def jar(c,x,y,w=65,h=80,label='ID'):
    c.setStrokeColor(HexColor('#50715b'));c.setFillColor(HexColor('#152a1c'));c.roundRect(x,y,w,h,9,stroke=1,fill=1)
    c.setFillColor(HexColor('#31563c'));c.roundRect(x-2,y+h-3,w+4,12,3,stroke=0,fill=1)
    c.setFillColor(PALE);c.roundRect(x+9,y+h*.31,w-18,h*.37,3,stroke=0,fill=1)
    c.setFont('Jakarta600',9);c.setFillColor(INK);c.drawCentredString(x+w/2,y+h*.48,label)


class Jars(Flowable):
    def wrap(self,a,h):self.width=a;self.height=146;return a,146
    def draw(self):
        c=self.canv;c.setFillColor(CARD);c.setStrokeColor(LINE);c.roundRect(0,0,self.width,146,14,fill=1,stroke=1)
        for i,label in enumerate(['ID','Origem','Local']):jar(c,30+i*100,32,68,80,label)
        c.setFillColor(TEXT);c.setFont('Jakarta600',12);c.drawString(350,91,'Informação')
        c.drawString(350,72,'que se conserva.')
        c.setFont('Jakarta400',8.5);c.setFillColor(SUB);c.drawString(350,46,'Etiqueta e inventário')
        c.drawString(350,31,'usam o mesmo ID.')
        c.setFont('Jakarta400',7.5);c.drawString(18,10,'Esquema de organização; transferir de embalagem não é obrigatório.')


class Zones(Flowable):
    def wrap(self,a,h):self.width=a;self.height=133;return a,133
    def draw(self):
        c=self.canv;gap=12;w=(self.width-2*gap)/3
        for i,(letter,title,detail) in enumerate([('A','Confirmado','Identificado e íntegro'),('B','Em revisão','NÃO USAR'),('C','Materiais','Utensílios limpos')]):
            x=i*(w+gap);c.setFillColor(CARD);c.setStrokeColor(HexColor('#3e644b'));c.roundRect(x,0,w,133,12,stroke=1,fill=1)
            c.setFillColor(MINT);c.setFont('Jakarta600',27);c.drawString(x+17,88,letter)
            c.setFillColor(TEXT);c.setFont('Jakarta600',11);c.drawString(x+17,57,title)
            c.setFillColor(SUB);c.setFont('Jakarta400',8.8);c.drawString(x+17,30,detail)


class Flow(Flowable):
    def wrap(self,a,h):self.width=a;self.height=100;return a,100
    def draw(self):
        c=self.canv;c.setFillColor(CARD);c.setStrokeColor(LINE);c.roundRect(0,0,self.width,100,12,stroke=1,fill=1)
        names=['Identifica','Regista','Localiza','Confere']
        for i,t in enumerate(names):
            x=self.width*(i+.5)/4;c.setFillColor(GREEN);c.circle(x,62,14,fill=1,stroke=0)
            c.setFillColor(white);c.setFont('Jakarta600',10);c.drawCentredString(x,58,str(i+1))
            c.setFillColor(TEXT);c.setFont('Jakarta600',9);c.drawCentredString(x,26,t)


class Labels(Flowable):
    def __init__(self,quick=False):Flowable.__init__(self);self.quick=quick
    def wrap(self,a,h):self.width=a;self.height=530 if self.quick else 498;return a,self.height
    def draw(self):
        c=self.canv;gap=12;w=(self.width-gap)/2;h=80 if self.quick else 158;rows=6 if self.quick else 3
        for row in range(rows):
            for col in range(2):
                x=col*(w+gap);y=self.height-(row+1)*h-row*(10 if self.quick else gap)
                c.setFillColor(white);c.setStrokeColor(HexColor('#759380'));c.setLineWidth(.7);c.roundRect(x,y,w,h,5,stroke=1,fill=1)
                c.setFillColor(GREEN);c.setFont('Jakarta600',7.6);c.drawString(x+10,y+h-17,'BOTICA VIVA / '+('ETIQUETA RÁPIDA' if self.quick else 'COMPLETA'))
                c.setFillColor(INK);c.setFont('Jakarta400',8);c.drawRightString(x+w-10,y+h-17,'ID: BV-____')
                c.setStrokeColor(HexColor('#bfd2c5'));c.line(x+10,y+h-24,x+w-10,y+h-24)
                c.setFont('Jakarta400',8.4)
                if self.quick:
                    c.drawString(x+10,y+36,'Planta: ___________________________________')
                    c.drawString(x+10,y+15,'Local: __________   Data: ___ / ___ / _____')
                else:
                    lines=['Planta / nome botânico: ____________________','Origem / fornecedor: _______________________','Lote (se houver): __________________________','Compra / colheita: ____ / ____ / ______','Data indicada na origem: ___________________']
                    for i,line in enumerate(lines):c.drawString(x+10,y+h-42-i*18,line)
                    c.drawString(x+10,y+26,'Local: ______  Rótulo original:')
                    c.rect(x+137,y+25,7,7,stroke=1,fill=0);c.drawString(x+149,y+26,'guardado')


class Review(Flowable):
    def __init__(self,index):Flowable.__init__(self);self.index=index
    def wrap(self,a,h):self.width=a;self.height=115;return a,115
    def draw(self):
        c=self.canv;w=self.width;c.setFillColor(PALE);c.setStrokeColor(HexColor('#bfd2c5'));c.roundRect(0,0,w,115,8,stroke=1,fill=1)
        c.setFillColor(GREEN);c.setFont('Jakarta600',10);c.drawString(13,97,f'SEMANA {self.index}')
        c.setFillColor(INK);c.setFont('Jakarta400',9);c.drawRightString(w-13,97,'DATA: ____ / ____ / ______')
        labels=['Etiquetas legíveis','Embalagens íntegras','Local seco e protegido','Inventário atualizado','Zona B revista','Compras conferidas']
        for i,label in enumerate(labels):
            x=13+(i%3)*(w-26)/3;y=74-(i//3)*18;c.setStrokeColor(HexColor('#668e73'));c.rect(x,y-1,8,8,stroke=1,fill=0)
            c.setFont('Jakarta400',8.5);c.drawString(x+13,y,label)
        for y,label in [(34,'O que encontrei:'),(14,'Ação e responsável:')]:
            c.setFont('Jakarta400',9);c.drawString(13,y,label);start=13+c.stringWidth(label,'Jakarta400',9)+7;c.line(start,y-2,w-13,y-2)


class Incident(Flowable):
    def __init__(self,index):Flowable.__init__(self);self.index=index
    def wrap(self,a,h):self.width=a;self.height=235;return a,235
    def draw(self):
        c=self.canv;w=self.width;c.setStrokeColor(HexColor('#bfd2c5'));c.setFillColor(white);c.roundRect(0,0,w,235,8,stroke=1,fill=1)
        c.setFillColor(GREEN);c.setFont('Jakarta600',11);c.drawString(14,214,f'OCORRÊNCIA {self.index}')
        c.setFont('Jakarta400',9);c.setFillColor(INK);c.drawString(14,190,'Data: ____ / ____ / ______     ID: __________      Local: __________')
        c.drawString(14,168,'O que observei:');c.line(93,166,w-14,166);c.line(14,147,w-14,147)
        def options(y,prefix,labels):
            c.setFont('Jakarta400',8.7);c.drawString(14,y,prefix);x=14+c.stringWidth(prefix,'Jakarta400',8.7)+9
            for label in labels:
                c.rect(x,y-1,8,8,stroke=1,fill=0);c.drawString(x+13,y,label);x+=c.stringWidth(label,'Jakarta400',8.7)+29
            if x>w:raise ValueError('Opções de ocorrência demasiado largas')
        options(124,'Origem / rótulo disponível?',['Sim','Não','Por confirmar'])
        options(99,'Medida:',['Separar','Confirmar informação','Descartar','Outra'])
        c.setFont('Jakarta400',9);c.drawString(14,74,'Decisão final e data:');c.line(111,72,w-14,72)
        options(43,'Registo atualizado no inventário?',['Sim','Ainda não'])


class FormFields(Flowable):
    def wrap(self,a,h):self.width=a;self.height=32;return a,32
    def draw(self):
        c=self.canv;c.setFillColor(INK);c.setStrokeColor(HexColor('#8aa794'));c.setFont('Jakarta400',8.8)
        c.drawString(0,21,'Local escolhido:');c.line(72,19,self.width*.47,19)
        c.drawString(self.width*.51,21,'Data da última reorganização: ____ / ____ / ______')


def sheet_table(rows):
    head=rows[0]
    widths=([112,107,98,78,CW-395] if head[0]=='ID + planta' else [70,60,100,126,CW-356] if head[0]=='Data' else [120,65,85,92,CW-362] if head[0]=='O que preciso?' else [115,205,CW-320])
    n=len(head);heights=[42]+[80 if n==3 else 39]*(len(rows)-1)
    cells=[]
    for i,row in enumerate(rows):
        cells.append([Paragraph(escape(editorial(cell)),ParagraphStyle('sheet',fontName='Jakarta600' if i==0 else 'Jakarta400',fontSize=9,leading=13.2,textColor=white if i==0 else INK)) for cell in row])
    for i,row in enumerate(cells):
        for j,cell in enumerate(row):
            if cell.wrap(widths[j]-18,10000)[1]+14>heights[i]+.01:raise ValueError(f'Célula sem altura: {head[0]}, {i}, {j}')
    t=Table(cells,colWidths=widths,rowHeights=heights,hAlign='LEFT',repeatRows=1)
    t.setStyle(TableStyle([('VALIGN',(0,0),(-1,-1),'TOP'),('BACKGROUND',(0,0),(-1,0),GREEN),('ROWBACKGROUNDS',(0,1),(-1,-1),[PALE,white]),('LEFTPADDING',(0,0),(-1,-1),9),('RIGHTPADDING',(0,0),(-1,-1),9),('TOPPADDING',(0,0),(-1,-1),7),('BOTTOMPADDING',(0,0),(-1,-1),7),('LINEBELOW',(0,0),(-1,-1),.4,HexColor('#bdcfc3')),('LINEAFTER',(0,0),(-2,-1),.4,HexColor('#cfddd3'))]))
    return t


def render(nodes,light=False):
    out=[];i=0;counter=0
    while i<len(nodes):
        n=nodes[i];kind=n['type'];text=n.get('text','')
        if kind=='table':
            rows=[[editorial(c) for c in row] for row in n['rows']];out.extend([sheet_table(rows) if light else table(rows),Spacer(1,12)])
        elif kind=='title':out.append(para(text,'title',light));counter=0
        elif kind=='heading':out.append(para(text,'heading',light));counter=0
        elif kind=='kicker':out.append(para(text,'kicker',light))
        elif kind=='callout_title':
            assert nodes[i+1]['type']=='body';out.extend([Spacer(1,8),box(editorial(text),editorial(nodes[i+1]['text']),light),Spacer(1,12)]);i+=1
        elif kind in ('ordered','bullet'):
            if kind=='ordered':counter=n.get('number',counter+1)
            out.append(Numbered(editorial(text),counter if kind=='ordered' else None,False,light))
        elif kind in ('label','review','incident'):raise ValueError('Modelo tratado fora da sequência de texto')
        else:out.append(para(text,light=light))
        i+=1
    return out


def N(kind,text):return {'type':kind,'text':text}


def main():
    OUTPUT.parent.mkdir(parents=True,exist_ok=True)
    doc=Doc(str(OUTPUT),pagesize=(W,H),leftMargin=M,rightMargin=M,topMargin=96,bottomMargin=58,title='A Minha Botica Organizada | Botica Viva',author='Botica Viva',subject='Kit de organização e registos domésticos',pageCompression=1)
    for name,light,cover in [('cover',False,True),('dark',False,False),('light',True,False)]:
        doc.addPageTemplates(PageTemplate(id=name,frames=[Frame(M,58,CW,H-154,leftPadding=0,rightPadding=0,topPadding=0,bottomPadding=0)],onPage=lambda c,d,l=light,co=cover:frame(c,d,l,co)))
    story=[]
    def section(nodes,light=False,art=None):
        if story:story.extend([NextPageTemplate('light' if light else 'dark'),PageBreak()])
        if art:
            title=next(i for i,n in enumerate(nodes) if n['type']=='title');story.extend(render(nodes[:title+1],light));story.extend([art,Spacer(1,18)]);nodes=nodes[title+1:]
        story.extend(render(nodes,light))
    pages=DATA['pages'];cover=pages[0]['nodes']
    story.extend([para(cover[0]['text'],'kicker'),Spacer(1,22),Paragraph('A Minha<br/><font color="#78d895">Botica Organizada</font>',ParagraphStyle('cover-title',parent=style('title'),fontSize=36,leading=44,spaceAfter=22))])
    story.extend(render(cover[3:6]));story.extend([Spacer(1,12),Jars(),Spacer(1,20),para(cover[-1]['text'],'small')])
    section([N('title','O teu kit, do primeiro passo à rotina')]+cover[6:-1],art=Flow())
    section(pages[1]['nodes'])
    nodes=pages[2]['nodes'];cut=next(i for i,n in enumerate(nodes) if n.get('text')=='O teste das cinco verificações')
    section(nodes[:cut],art=Jars());section([nodes[0],N('title',nodes[cut]['text'])]+nodes[cut+1:])
    nodes=pages[3]['nodes'];cut=next(i for i,n in enumerate(nodes) if n.get('text')=='Cria três zonas com funções diferentes')
    section(nodes[:cut],art=Jars());section([nodes[0],N('title',nodes[cut]['text'])]+nodes[cut+1:],art=Zones())
    nodes=pages[4]['nodes'];cut=next(i for i,n in enumerate(nodes) if n.get('text','').startswith('Exemplo preenchido:'))
    section(nodes[:cut]);section([nodes[0],N('title','Uma etiqueta preenchida, sem adivinhar')]+nodes[cut:])
    nodes=pages[5]['nodes'];cut=next(i for i,n in enumerate(nodes) if n.get('text')=='Se forem plantas cultivadas em casa')
    section(nodes[:cut],art=Flow());section([nodes[0],N('title','Conserva sem perder o critério')]+nodes[cut:],art=Zones())
    nodes=pages[6]['nodes'];cut=next(i for i,n in enumerate(nodes) if n.get('text')=='Quatro momentos em que atualizas')
    section(nodes[:cut]);section([nodes[0],N('title',nodes[cut]['text'])]+nodes[cut+1:],art=Flow())
    for p in pages[7:12]:section(p['nodes'])
    nodes=pages[12]['nodes'];cut=next(i for i,n in enumerate(nodes) if n.get('text')=='Quatro regras para imprimir')
    section(nodes[:cut]);section([nodes[0],N('title',nodes[cut]['text'])]+nodes[cut+1:]+[N('body','Para escrever no telemóvel, usa um leitor de PDF com ferramentas de anotação. Os modelos não incluem campos automáticos.')])
    for page in pages[13:15]:
        nodes=page['nodes'];section(nodes[:3],light=True);story.extend([Labels(page['source_page']==15),Spacer(1,12),para(nodes[-1]['text'],'small',True)])
    for page in pages[15:18]:section(page['nodes'],light=True)
    nodes=pages[18]['nodes'];section(nodes[:3],light=True)
    for i in range(1,5):story.extend([Review(i),Spacer(1,10)])
    story.append(para(nodes[-1]['text'],'small',True))
    nodes=pages[19]['nodes'];section(nodes[:-1],light=True);story.append(FormFields())
    nodes=pages[20]['nodes'];section(nodes[:3],light=True);story.extend([Incident(1),Spacer(1,16),Incident(2),Spacer(1,14),para(nodes[-1]['text'],'small',True),para('Composição editorial e diagramas: Botica Viva. Demonstrações esquemáticas, sem escala.','small',True)])
    doc.build(story);print('PDF criado:',OUTPUT)


if __name__=='__main__':main()
