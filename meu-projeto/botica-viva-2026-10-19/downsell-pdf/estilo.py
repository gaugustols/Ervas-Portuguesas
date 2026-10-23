"""Estilo editorial da coleção de PDFs Botica Viva. ReportLab + conteúdo extraído.
Executar da raiz. Não publica o produto nem altera o PDF original.
"""
import json
import io
import math
import re
from html import unescape
from pathlib import Path
from xml.sax.saxutils import escape
from reportlab.pdfgen import canvas
from reportlab.lib.colors import HexColor, Color, white
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import BaseDocTemplate, PageTemplate, Frame, Paragraph, Spacer, Table, TableStyle, PageBreak, NextPageTemplate, Flowable, KeepTogether
from reportlab.lib.utils import ImageReader
from PIL import Image, ImageOps

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[2]
PROJECT = HERE.parent
OUTPUT = ROOT/'output/pdf/botica-viva-o-meu-primeiro-vaso.pdf'
DATA = json.loads((HERE/'conteudo.json').read_text(encoding='utf-8'))
CREDITS = json.loads((PROJECT/'media/creditos.json').read_text(encoding='utf-8'))
W,H = A4
M = 44
CW = W-2*M
BG=HexColor('#080b09'); CARD=HexColor('#101611'); LINE=HexColor('#29352c')
TEXT=HexColor('#f4f7f4'); SUB=HexColor('#b7c7bc'); GREEN=HexColor('#0b6b2c'); MINT=HexColor('#78d895')
INK=HexColor('#17291f'); PALE=HexColor('#edf5ef')
IMAGE_CACHE={}
for weight in ('400','600'):
    pdfmetrics.registerFont(TTFont('Jakarta'+weight,str(ROOT/f'assets/nova-pagina/fonts/plus-jakarta-sans-{weight}.ttf')))
pdfmetrics.registerFontFamily('Jakarta400',normal='Jakarta400',bold='Jakarta600',italic='Jakarta400',boldItalic='Jakarta600')


def style(name, light=False):
    color=INK if light else TEXT
    muted=HexColor('#516359') if light else SUB
    st={
      'body': dict(fontSize=10.4,leading=15.6,textColor=color,spaceAfter=8),
      'small':dict(fontSize=8.5,leading=12.7,textColor=muted,spaceAfter=8),
      'title':dict(fontName='Jakarta600',fontSize=26,leading=32,textColor=color,spaceAfter=18,keepWithNext=True),
      'heading':dict(fontName='Jakarta600',fontSize=12.5,leading=17.5,textColor=GREEN if light else MINT,spaceBefore=8,spaceAfter=6,keepWithNext=True),
      'kicker':dict(fontName='Jakarta600',fontSize=8.5,leading=12,textColor=GREEN if light else MINT,spaceAfter=10,keepWithNext=True),
      'cell':dict(fontSize=9.1,leading=13.7,textColor=color,spaceAfter=0),
    }[name]
    return ParagraphStyle(name,fontName='Jakarta400',**st) if 'fontName' not in st else ParagraphStyle(name,**st)


def normalize(text):
    return text.replace('–','-').replace('—','-').replace('‑','-').replace('−','-').replace('☐','[ ]')


def P(text, kind='body', light=False):
    if text.startswith('Guardei a fotografia inicial:'):
        text='Guardei a fotografia inicial: [ ] Sim   [ ] Não'
    if light and kind=='body':
        return Paragraph(escape(normalize(text)),ParagraphStyle('form-body',parent=style(kind,light),fontSize=9.8,leading=14.5,spaceAfter=7))
    return Paragraph(escape(normalize(text)), style(kind,light))


class Numbered(Flowable):
    def __init__(self,text,number=None,check=False,light=False):
        Flowable.__init__(self); self.p=P(text,light=light);self.number=number;self.check=check;self.light=light
    def wrap(self,a,h):
        self.width=a; self.pw,self.ph=self.p.wrap(a-32,h);self.height=self.ph+4;return self.width,self.height
    def draw(self):
        c=self.canv;c.setStrokeColor(GREEN if self.light else MINT);c.setFillColor(GREEN if self.light else MINT)
        if self.check:c.roundRect(1,self.height-15,10,10,2,fill=0,stroke=1)
        elif self.number is not None:
            c.setFont('Jakarta600',9);c.drawString(0,self.height-12,f'{self.number:02}')
        else:c.circle(5,self.height-10,2,fill=1,stroke=0)
        self.p.drawOn(c,30,self.height-self.ph)


def box(title,text,light=False):
    t=Table([[P(title,'kicker',light)],[P(text,'body',light)]],colWidths=[CW-32],splitByRow=0)
    t.setStyle(TableStyle([('BACKGROUND',(0,0),(-1,-1),PALE if light else HexColor('#13271b')),('BOX',(0,0),(-1,-1),.6,HexColor('#365641')),('LEFTPADDING',(0,0),(-1,-1),16),('RIGHTPADDING',(0,0),(-1,-1),16),('TOPPADDING',(0,0),(-1,0),14),('BOTTOMPADDING',(0,0),(-1,0),0),('TOPPADDING',(0,1),(-1,1),0),('BOTTOMPADDING',(0,1),(-1,1),9)]))
    return t


class Photo(Flowable):
    def __init__(self,herb,height=190):Flowable.__init__(self);self.herb=herb;self.height=height
    def wrap(self,a,h):self.width=a;return a,self.height
    def draw(self):
        c=self.canv
        if self.herb not in IMAGE_CACHE:
            image=ImageOps.exif_transpose(Image.open(PROJECT/'media'/CREDITS[self.herb]['ficheiro'])).convert('RGB')
            image.thumbnail((1100,1100),Image.Resampling.LANCZOS)
            buffer=io.BytesIO();image.save(buffer,format='JPEG',quality=87,optimize=True);buffer.seek(0)
            IMAGE_CACHE[self.herb]=ImageReader(buffer)
        image=IMAGE_CACHE[self.herb];iw,ih=image.getSize()
        k=max(self.width/iw,self.height/ih);dw,dh=iw*k,ih*k
        c.saveState();path=c.beginPath();path.roundRect(0,0,self.width,self.height,14);c.clipPath(path,stroke=0)
        c.drawImage(image,(self.width-dw)/2,(self.height-dh)/2,width=dw,height=dh,mask='auto');c.restoreState()


class PhotoGrid(Flowable):
    def wrap(self,a,h):self.width=a;self.height=350;return a,self.height
    def draw(self):
        ids=['erva-1','erva-5','erva-6','erva-2','erva-12','erva-7']
        names=['Alecrim','Tomilho','Orégãos','Hortelã-verde','Erva-cidreira','Salsa']
        latin=['Salvia rosmarinus','Thymus vulgaris','Origanum vulgare','Mentha spicata','Melissa officinalis','Petroselinum crispum']
        for i,(herb,name,sp) in enumerate(zip(ids,names,latin)):
            cw=(self.width-24)/3;x=(i%3)*(cw+12);y=190-(i//3)*175
            photo=Photo(herb,112);photo.wrap(cw,112);photo.drawOn(self.canv,x,y+45)
            c=self.canv;c.setFillColor(TEXT);c.setFont('Jakarta600',10);c.drawString(x,y+26,name)
            c.setFillColor(SUB);c.setFont('Jakarta400',7.5);c.drawString(x,y+11,sp)


def leaf(c,x,y,s=1):
    c.saveState();c.translate(x,y);c.scale(s,s);c.setStrokeColor(MINT);c.setLineWidth(1.2)
    c.line(0,0,0,38)
    for side,yy in [(1,8),(-1,17),(1,26)]:
        p=c.beginPath();p.moveTo(0,yy);p.curveTo(14*side,yy,17*side,yy+9,16*side,yy+13);p.curveTo(4*side,yy+12,0,yy+5,0,yy);c.drawPath(p)
    c.restoreState()


def pot(c,x,y,w=75,h=65,light=False,soil=True):
    c.saveState();c.setStrokeColor(HexColor('#739880'));c.setFillColor(HexColor('#274a33') if not light else HexColor('#d9e8dd'))
    p=c.beginPath();p.moveTo(x,y+h);p.lineTo(x+w,y+h);p.lineTo(x+w*.83,y);p.lineTo(x+w*.17,y);p.close();c.drawPath(p,fill=1,stroke=1)
    if soil:
        c.setFillColor(HexColor('#52604a'));c.ellipse(x+4,y+h-15,x+w-4,y+h-3,stroke=0,fill=1)
    c.setStrokeColor(MINT if not light else GREEN);c.setLineWidth(2);c.line(x+w*.42,y+1,x+w*.58,y+1);c.restoreState()


class Diagram(Flowable):
    def __init__(self,kind,height=160,light=False):Flowable.__init__(self);self.kind=kind;self.height=height;self.light=light
    def wrap(self,a,h):self.width=a;return a,self.height
    def draw(self):
        c=self.canv;w=self.width;h=self.height;c.setFillColor(PALE if self.light else CARD);c.setStrokeColor(LINE);c.roundRect(0,0,w,h,14,fill=1,stroke=1)
        fg=INK if self.light else TEXT;c.setFillColor(fg);c.setFont('Jakarta600',10)
        if self.kind in ('trio','cover'):
            for i,name in enumerate(['Um vaso','Uma espécie','Cuidados próprios']):
                x=w*(i+.5)/3-35;pot(c,x,35,70,60,self.light);leaf(c,x+35,88,.85)
                c.setFillColor(fg);c.setFont('Jakarta600',9);c.drawCentredString(x+35,16,name)
        elif self.kind=='light':
            c.setFillColor(MINT);c.circle(36,h-35,10,fill=1,stroke=0)
            c.setStrokeColor(MINT)
            for k in range(8):
                a=k*math.pi/4;c.line(36+15*math.cos(a),h-35+15*math.sin(a),36+21*math.cos(a),h-35+21*math.sin(a))
            for i,label in enumerate(['09:00','11:00','13:00','15:00','17:00']):
                x=92+i*(w-125)/4;c.setFillColor(fg);c.setFont('Jakarta600',9);c.drawCentredString(x,h-36,label)
                c.setStrokeColor(HexColor('#52765d'));c.roundRect(x-20,h-78,40,26,6,fill=0,stroke=1)
            c.setFillColor(fg);c.setFont('Jakarta400',9);c.drawString(22,20,'Marca quando o sol chega diretamente ao local dos vasos.')
        elif self.kind=='transplant':
            pot(c,45,28,110,82,self.light);leaf(c,100,104,.6)
            pot(c,268,28,110,82,self.light);leaf(c,323,104,.6)
            c.setStrokeColor(MINT);c.setLineWidth(1);c.setDash(3,3);c.line(30,100,w-25,100);c.setDash()
            c.setFillColor(fg);c.setFont('Jakarta600',9);c.drawString(32,h-21,'Mantém a altura original do colo da planta')
            c.setFont('Jakarta400',9);c.drawCentredString(100,10,'Vaso de origem');c.drawCentredString(323,10,'Novo vaso com furos')
            c.setStrokeColor(MINT);c.line(188,72,232,72);c.line(225,78,232,72);c.line(225,66,232,72)
        elif self.kind=='water':
            pot(c,42,24,100,90,self.light);leaf(c,92,100,.8)
            c.setStrokeColor(MINT);c.setLineWidth(2);c.line(132,119,132,91);c.line(129,94,132,91);c.line(135,94,132,91)
            c.setFillColor(fg);c.setFont('Jakarta600',10);c.drawString(186,h-30,'Verifica antes de regar')
            for j,t in enumerate(['1. Toca no substrato.','2. Compara o peso do vaso.','3. Decide: regar ou esperar.']):
                c.setFont('Jakarta400',10);c.drawString(186,h-58-j*23,t)
        elif self.kind=='drain':
            pot(c,52,38,90,75,self.light);leaf(c,97,100,.75)
            c.setStrokeColor(MINT);c.line(70,21,124,21);c.line(70,21,65,26);c.line(124,21,129,26)
            c.setFillColor(fg);c.setFont('Jakarta600',10);c.drawString(180,h-30,'A água tem de conseguir sair')
            for j,t in enumerate(['Furos livres na base.','Substrato adequado à espécie.','Prato vazio depois de drenar.']):c.setFont('Jakarta400',10);c.drawString(180,h-58-j*22,t)
        elif self.kind=='decision':
            c.setFillColor(fg);c.setFont('Jakarta600',11);c.drawCentredString(w/2,h-24,'Folhas murchas? Verifica a terra primeiro.')
            for x,title,line1,line2 in [(18,'Terra seca','Rega lenta e reavalia','após algumas horas.'),(w/2+6,'Terra encharcada','Verifica os furos e','esvazia o prato.')]:
                c.setStrokeColor(HexColor('#416b4c'));c.roundRect(x,20,w/2-24,h-65,10,fill=0,stroke=1)
                c.setFillColor(MINT);c.setFont('Jakarta600',11);c.drawString(x+14,h-65,title)
                c.setFillColor(fg);c.setFont('Jakarta400',9.5);c.drawString(x+14,h-88,line1);c.drawString(x+14,h-103,line2)


class BlankCell(Flowable):
    def __init__(self,label='',checkbox=False):Flowable.__init__(self);self.label=label;self.checkbox=checkbox
    def wrap(self,a,h):self.width=a;self.height=16;return a,16
    def draw(self):
        c=self.canv;c.setStrokeColor(HexColor('#71917b'));c.setLineWidth(.6)
        if self.checkbox:c.roundRect(0,3,10,10,1.5,stroke=1,fill=0)
        else:
            if self.label:c.setFillColor(HexColor('#71917b'));c.setFont('Jakarta400',9);c.drawString(0,5,self.label)
            c.line(15 if self.label else 0,3,self.width,3)


def table(rows,light=False):
    n=len(rows[0]); widths=([42,CW*.37,CW-42-CW*.37] if n==3 and rows[0][:2]==['Dia','O que vais fazer'] else [CW*.34,65,CW*.66-65] if n==3 and rows[0][:2]==['Dia','Terminei?'] else [CW/n]*n)
    cells=[]
    for i,row in enumerate(rows):
        cells.append([BlankCell(checkbox=True) if cell.strip()=='☐' else BlankCell(re.sub(r'[_\s]+','',cell)) if '_' in cell and not re.search(r'[A-Za-zÀ-ÿ]',cell) else Paragraph(escape(normalize(cell)),ParagraphStyle('table',parent=style('cell',light),fontName='Jakarta600' if i==0 else 'Jakarta400',textColor=white if i==0 else INK if light else TEXT)) for cell in row])
    heights=([32]+[49]*(len(rows)-1)) if rows[0][:2]==['Dia','Terminei?'] else None
    t=Table(cells,colWidths=widths,rowHeights=heights,repeatRows=1,hAlign='LEFT')
    commands=[('VALIGN',(0,0),(-1,-1),'TOP'),('BACKGROUND',(0,0),(-1,0),GREEN),('LEFTPADDING',(0,0),(-1,-1),10),('RIGHTPADDING',(0,0),(-1,-1),10),('TOPPADDING',(0,0),(-1,-1),7),('BOTTOMPADDING',(0,0),(-1,-1),7),('LINEBELOW',(0,0),(-1,-1),.4,HexColor('#cddfd2') if light else LINE)]
    for r in range(1,len(rows)):commands.append(('BACKGROUND',(0,r),(-1,r),white if light and r%2==0 else PALE if light else CARD if r%2 else HexColor('#152019')))
    t.setStyle(TableStyle(commands));return t


class Doc(BaseDocTemplate):
    def afterFlowable(self,f):
        if isinstance(f,Paragraph) and f.style.name=='title':
            title=f.getPlainText();self.canv.bookmarkPage('section-'+str(self.page));self.canv.addOutlineEntry(title,'section-'+str(self.page),level=0,closed=False)


def frame(c,doc,light=False,cover=False):
    c.saveState();c.setFillColor(white if light else BG);c.rect(0,0,W,H,stroke=0,fill=1)
    if cover:
        c.setFillColor(HexColor('#102a19'));c.circle(W+75,H-100,245,stroke=0,fill=1)
    c.setStrokeColor(HexColor('#d5e4d9') if light else LINE);c.line(M,H-73,W-M,H-73);c.line(M,44,W-M,44)
    leaf(c,M+8,H-61,.5);c.setFillColor(INK if light else TEXT);c.setFont('Jakarta600',14);c.drawString(M+28,H-51,'Botica Viva')
    c.setFont('Jakarta400',8);c.setFillColor(HexColor('#526759') if light else SUB);c.drawRightString(W-M,H-51,'O MEU PRIMEIRO VASO')
    c.setFont('Jakarta400',8);c.drawString(M,28,'Conhecer. Preparar. Cultivar com método.');c.drawRightString(W-M,28,f'{doc.page:02}')
    c.restoreState()


def nodes_to_flow(nodes,light=False):
    out=[];counter=0;i=0
    while i<len(nodes):
        n=nodes[i];kind=n['type'];text=n.get('text','')
        if kind=='table':out.extend([table(n['rows'],light),Spacer(1,14)])
        elif kind=='title':out.append(P(text,'title',light));counter=0
        elif kind=='heading':out.append(P(text,'heading',light));counter=0
        elif kind=='callout_title':
            if i+1<len(nodes) and nodes[i+1]['type']=='body':
                out.extend([Spacer(1,9),box(text,nodes[i+1]['text'],light),Spacer(1,12)]);i+=1
            else:out.append(P(text,'kicker',light))
        elif kind in ('ordered','bullet','check'):
            if kind=='ordered':counter+=1
            out.append(Numbered(text,n.get('number',counter) if kind=='ordered' else None,kind=='check',light))
        else:
            if 'Estas páginas podem ser preenchidas no ficheiro Word ou impressas.' in text:
                text=text.replace('Estas páginas podem ser preenchidas no ficheiro Word ou impressas.','Estas fichas podem ser impressas e preenchidas à mão.')
            out.append(P(text,light=light))
        i+=1
    return out
