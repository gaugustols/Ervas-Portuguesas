"""Manual original PT-PT. Requer reportlab; pypdf e pymupdf para verificar/renderizar.
Executar na raiz: python meu-projeto/botica-viva-2026-10-19/manual/gerar_manual.py
Os endereços por configurar mantêm o documento explicitamente em revisão.
"""
from pathlib import Path
from xml.sax.saxutils import escape
from reportlab.pdfgen import canvas
from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import BaseDocTemplate, PageTemplate, Frame, Paragraph, Spacer, Table, TableStyle, PageBreak, NextPageTemplate, KeepTogether

ROOT = Path(__file__).resolve().parents[3]
OUTPUT = ROOT / 'output' / 'pdf' / 'botica-viva-manual-de-acesso.pdf'
BASIC_ACCESS_URL = 'https://ervasportuguesas.vercel.app/app/'
PRO_ACCESS_URL = 'https://ervasportuguesas.vercel.app/pro/'
SUPPORT_CONTACT = ''
ACCESS_READY = bool(BASIC_ACCESS_URL and PRO_ACCESS_URL)
DRAFT = not (ACCESS_READY and SUPPORT_CONTACT)
for access_url in [BASIC_ACCESS_URL, PRO_ACCESS_URL]:
    if access_url and not access_url.startswith('https://'):
        raise ValueError('Use uma ligação pública HTTPS real para o acesso.')
CONSUMER = 'https://consumer.hotmart.com/'
HELP = 'https://help.hotmart.com/pt-br/'
ACCESS_HELP = 'https://suportehotmart.zendesk.com/hc/pt-br/articles/215827338-Como-acesso-o-produto-que-comprei-na-Hotmart'
SUPPORT_HELP = 'https://suportehotmart.zendesk.com/hc/pt-br/articles/360000649492-Como-entro-em-contato-com-o-Produtor'

BLACK = colors.HexColor('#090e0b')
GREEN = colors.HexColor('#0b6b2c')
MINT = colors.HexColor('#9ee1b2')
INK = colors.HexColor('#17251c')
MUTED = colors.HexColor('#526157')
PALE = colors.HexColor('#edf4ee')
LINE = colors.HexColor('#d7e2d9')
WHITE = colors.white
W, H = A4
CONTENT = W - 88
TOTAL = 5

for weight in ['400', '600']:
    pdfmetrics.registerFont(TTFont('Jakarta' + weight, str(ROOT / 'assets/nova-pagina/fonts' / ('plus-jakarta-sans-' + weight + '.ttf'))))
pdfmetrics.registerFontFamily('Jakarta400', normal='Jakarta400', bold='Jakarta600', italic='Jakarta400', boldItalic='Jakarta600')

styles = {
 'body': ParagraphStyle('body', fontName='Jakarta400', fontSize=10.2, leading=15.7, textColor=INK, spaceAfter=10),
 'small': ParagraphStyle('small', fontName='Jakarta400', fontSize=8.4, leading=12.4, textColor=MUTED, spaceAfter=8),
 'title': ParagraphStyle('title', fontName='Jakarta600', fontSize=28, leading=34, textColor=INK, spaceAfter=13),
 'h2': ParagraphStyle('h2', fontName='Jakarta600', fontSize=14.2, leading=20, textColor=GREEN, spaceBefore=13, spaceAfter=8),
 'kicker': ParagraphStyle('kicker', fontName='Jakarta600', fontSize=8.6, leading=13, textColor=GREEN, spaceAfter=10),
 'cover-title': ParagraphStyle('cover-title', fontName='Jakarta600', fontSize=38, leading=45, textColor=WHITE, spaceAfter=18),
 'cover-body': ParagraphStyle('cover-body', fontName='Jakarta400', fontSize=12, leading=19, textColor=colors.HexColor('#d0dfd4'), spaceAfter=16),
 'cover-kicker': ParagraphStyle('cover-kicker', fontName='Jakarta600', fontSize=9.2, leading=15, textColor=MINT, spaceAfter=20),
}

def P(text, style='body'):
    return Paragraph(text, styles[style])

def gap(height=10):
    return Spacer(1, height)

def box(title, text, warning=False, dark=False):
    bg = colors.HexColor('#fff3d7') if warning else (colors.HexColor('#13271a') if dark else PALE)
    color = MINT if dark else GREEN
    title_style = ParagraphStyle('box-title', parent=styles['body'], fontName='Jakarta600', fontSize=10, textColor=color, spaceAfter=6)
    body_style = ParagraphStyle('box-body', parent=styles['body'], fontSize=9.3, leading=14.3, textColor=colors.HexColor('#e2eee5') if dark else INK, spaceAfter=0)
    t = Table([[Paragraph(title, title_style)], [Paragraph(text, body_style)]], colWidths=[CONTENT-30])
    t.setStyle(TableStyle([('BACKGROUND',(0,0),(-1,-1),bg),('LEFTPADDING',(0,0),(-1,-1),15),('RIGHTPADDING',(0,0),(-1,-1),15),('TOPPADDING',(0,0),(-1,0),13),('BOTTOMPADDING',(0,-1),(-1,-1),14),('TOPPADDING',(0,1),(-1,1),0)]))
    return t

def step(number, title, text):
    num_style = ParagraphStyle('num', parent=styles['body'], textColor=GREEN, fontName='Jakarta600', fontSize=15, leading=20)
    t = Table([[Paragraph(f'{number:02}', num_style), [P('<b>'+title+'</b>'), P(text)]]], colWidths=[38, CONTENT-38])
    t.setStyle(TableStyle([('VALIGN',(0,0),(-1,-1),'TOP'),('LEFTPADDING',(0,0),(-1,-1),0),('RIGHTPADDING',(0,0),(-1,-1),4),('TOPPADDING',(0,0),(-1,-1),4),('BOTTOMPADDING',(0,0),(-1,-1),8),('LINEBELOW',(0,0),(-1,-1),.4,LINE)]))
    return t

def leaf(c,x,y,scale=1):
    c.saveState();c.translate(x,y);c.scale(scale,scale);c.setStrokeColor(MINT);c.setLineWidth(1.1)
    c.line(13,0,13,29)
    for ox,oy,d in [(13,9,1),(13,17,-1)]:
        p=c.beginPath();p.moveTo(ox,oy);p.curveTo(ox+12*d,oy+1,ox+15*d,oy+8,ox+14*d,oy+13);p.curveTo(ox+5*d,oy+12,ox+1*d,oy+7,ox,oy);c.drawPath(p)
    c.restoreState()

def frame(c,doc,cover=False):
    c.saveState()
    if cover:
        c.setFillColor(BLACK);c.rect(0,0,W,H,fill=1,stroke=0)
        c.setFillColor(colors.HexColor('#11291a'));c.circle(W+95,H-80,225,fill=1,stroke=0)
        leaf(c,45,H-79,1)
    else:
        c.setFillColor(WHITE);c.rect(0,0,W,H,fill=1,stroke=0)
        c.setFillColor(GREEN);c.roundRect(44,H-67,5,24,2,fill=1,stroke=0)
    c.setFillColor(WHITE if cover else GREEN);c.setFont('Jakarta600',16);c.drawString(79 if cover else 59,H-58,'Botica Viva')
    c.setFont('Jakarta400',7.6);c.setFillColor(MINT if cover else MUTED);c.drawRightString(W-44,H-53,'MANUAL DO UTILIZADOR')
    c.setStrokeColor(colors.HexColor('#294632') if cover else LINE);c.line(44,49,W-44,49)
    c.setFont('Jakarta400',7.2);c.setFillColor(colors.HexColor('#bacdbf') if cover else MUTED)
    c.drawString(44,33,'Botica Viva | Português de Portugal | Outubro de 2026')
    c.drawRightString(W-44,33,f'{doc.page:02} / {TOTAL:02}')
    if DRAFT:
        c.setFont('Jakarta600',6.6);c.drawRightString(W-44,20,'VERSÃO PARA REVISÃO - APOIO POR DEFINIR')
    names=['inicio','acesso','primeira-ficha','materiais','dados-e-apoio']
    if doc.page <= len(names):
        c.bookmarkPage(names[doc.page-1]);c.addOutlineEntry(['Boas-vindas','Acesso após a compra','A primeira ficha','Materiais do seu plano','Dados e apoio'][doc.page-1],names[doc.page-1],level=0)
    c.restoreState()

def newpage():
    return [PageBreak()]

story=[]
story += [gap(44),P('O SEU GUIA PARA COMEÇAR','cover-kicker'),P('O saber das ervas,<br/>mais perto de si.','cover-title'),P('Manual de acesso e utilização<br/>do webapp Botica Viva.','cover-body'),gap(20)]
story += [box('Conhecer. Preparar. Guardar.','Aprenda a orientar-se no webapp, crie a sua primeira ficha e descubra os materiais incluídos no plano que adquiriu.',dark=True),gap(20)]
if DRAFT:
    story += [box('Versão para revisão','As ligações de acesso estão incluídas. Falta definir o contacto direto de apoio e testar o percurso de compra e entrega antes de disponibilizar este manual aos compradores.',warning=True),gap(18)]
for label, target in [('01 / Aceder após a compra','acesso'),('02 / Criar a primeira ficha','primeira-ficha'),('03 / Explorar o seu plano','materiais'),('04 / Guardar os dados e pedir apoio','dados-e-apoio')]:
    story.append(Paragraph(f'<link href="#{target}" color="#cde7d5">{label}</link>',ParagraphStyle('toc',parent=styles['cover-body'],fontSize=10,leading=17,spaceAfter=5)))
story += [NextPageTemplate('body'),PageBreak()]

story += [P('01 / ACESSO','kicker'),P('Abra o webapp<br/>do seu plano.','title'),P('A Botica Viva é uma ferramenta digital de consulta de plantas e preparações caseiras. Acesso vitalício ao plano adquirido; garantia de 7 dias, conforme as condições da compra na Hotmart.')]
story += [step(1,'Confirme a compra','Procure a confirmação de pagamento da Hotmart no e-mail utilizado na compra. Verifique também as pastas de spam e correio não solicitado.'),step(2,'Consulte a compra, se necessário',f'Aceda a <link href="{CONSUMER}" color="#0b6b2c"><b>consumer.hotmart.com</b></link> com o e-mail da compra. A conta Hotmart é separada do webapp.'),step(3,'Confirme o plano adquirido','Na área <b>Minhas compras</b>, selecione Botica Viva, produto <b>8746348</b>, e consulte os detalhes da compra.'),step(4,'Abra o webapp','Use a ligação do Básico ou PRO abaixo e guarde-a nos favoritos. O app atual não pede login próprio.')]
if not ACCESS_READY:
    story += [gap(8),box('Ligação ao webapp: por configurar','Esta versão do manual não contém um botão de entrada no Botica Viva. O endereço local de desenvolvimento não permite o acesso dos compradores.',warning=True)]
else:
    basic_link = escape(BASIC_ACCESS_URL, {'"': '&quot;'})
    pro_link = escape(PRO_ACCESS_URL, {'"': '&quot;'})
    story += [box('As suas ligações de acesso',f'<link href="{basic_link}" color="#0b6b2c">Abrir o Plano Básico</link><br/><link href="{pro_link}" color="#0b6b2c">Abrir o Plano PRO</link>')]
story += [gap(12),P('Para utilizar no computador, tablet ou telemóvel, abra o endereço num navegador atualizado. A conta Hotmart e o webapp são serviços separados; a versão atual do Botica Viva não tem uma conta própria.','small')]
story += newpage()

story += [P('02 / PRIMEIRA UTILIZAÇÃO','kicker'),P('Crie a sua<br/>primeira ficha.','title'),P('Comece por um produto alimentar identificado que já conhece. Não confirme a segurança de uma planta silvestre apenas por uma fotografia.')]
story += [step(1,'Comece no Início','Selecione <b>Começar o primeiro passo</b> e leia o módulo <b>A sua primeira ficha</b>, na área <b>O meu percurso</b>.'),step(2,'Consulte a biblioteca de plantas','Abra <b>Plantas</b>, pesquise o nome e selecione <b>Ver ficha</b>. Leia os blocos <b>Para que é usada</b>, <b>Modo de preparar</b>, <b>Modo de usar</b> e <b>Cuidados</b>. Pode guardar a planta nos favoritos.'),step(3,'Preencha a Ficha prática','Indique planta, título, origem, decisão, método, instruções do rótulo ou dúvida a esclarecer e próxima ação. Se tiver dúvidas, selecione <b>Não utilizar até esclarecer</b>.'),step(4,'Guarde e conclua o módulo','Confirme a leitura das instruções e selecione <b>Guardar a minha ficha</b>. Regresse ao primeiro módulo, escreva a evidência do que fez, assinale a confirmação e escolha <b>Guardar e concluir módulo</b>.')]
story += [gap(10),box('O que conta como primeiro resultado?','Ter uma ficha guardada e uma decisão responsável documentada. A conclusão do primeiro módulo exige esse registo; apenas assinalar uma caixa não chega.'),gap(11),P('As fichas e os módulos concluídos ficam disponíveis em <b>Progresso</b>. O painel acompanha ações registadas, não efeitos sobre sintomas.','small')]
story += newpage()

story += [P('03 / O SEU CONTEÚDO','kicker'),P('Explore os materiais<br/>do seu plano.','title')]
rows=[
 [P('<b>Área</b>','small'),P('<b>Para que serve</b>','small')],
 [P('O meu percurso'),P('Seis módulos curtos, com passos, exemplos e registos de conclusão.')],
 [P('Plantas'),P('38 fichas com fotografia, utilizações, preparação, modo de usar, cuidados e fontes.')],
 [P('Ficha prática'),P('Organizar as informações do produto e guardar uma decisão de utilização.')],
 [P('Progresso'),P('Consultar módulos concluídos, marcos e fichas guardadas.')],
 [P('Biblioteca'),P('Métodos de preparação, temas de consulta, nutrientes, modelos e aromas.')],
]
t=Table(rows,colWidths=[132,CONTENT-132],hAlign='LEFT');t.setStyle(TableStyle([('BACKGROUND',(0,0),(-1,0),PALE),('VALIGN',(0,0),(-1,-1),'TOP'),('LEFTPADDING',(0,0),(-1,-1),12),('RIGHTPADDING',(0,0),(-1,-1),12),('TOPPADDING',(0,0),(-1,-1),10),('BOTTOMPADDING',(0,0),(-1,-1),4),('LINEBELOW',(0,0),(-1,-1),.4,LINE)]));story += [t,gap(14)]
story += [box('Plano Básico - 7,90 EUR','Inclui as 38 fichas, as instruções de preparação, o percurso, a biblioteca, o gerador de fichas e o painel de progresso.'),gap(11),box('Plano PRO - 14,90 EUR','Inclui tudo o que existe no Básico, mais oito fichas no <b>Caderno Ilustrado de Infusões</b>, cultivo de seis plantas e quatro modelos de <b>Fichas Práticas para Imprimir</b>. Estes materiais estão em <b>Materiais PRO</b>.'),gap(13)]
story += [P('Como utilizar os modelos PRO','h2'),P('Em <b>Materiais PRO</b>, escolha <b>Preencher e imprimir</b>. Preencha a ficha e selecione <b>Imprimir / guardar PDF</b>. Na janela do navegador, escolha a impressora ou a opção para guardar em PDF. Os nomes podem variar entre dispositivos.','small')]
story += newpage()

story += [P('04 / DADOS E APOIO','kicker'),P('Guarde o seu trabalho.<br/>Saiba onde pedir ajuda.','title')]
story += [box('Os seus registos ficam neste navegador','Utilize o mesmo dispositivo e navegador para retomar o trabalho. Limpar os dados do navegador ou usar navegação privada pode eliminar os registos. Não há sincronização automática, transferência entre planos nem importação de cópias JSON.'),gap(11)]
story += [P('Faça uma cópia regularmente','h2'),P('Em <b>Progresso</b>, selecione <b>Exportar todos os dados</b> para guardar os registos num ficheiro JSON. Para uma ficha legível fora do webapp, utilize <b>Descarregar ficha</b> ou <b>Imprimir as fichas</b>. A cópia JSON é um ficheiro de consulta; a app atual não a importa.')]
pending_note = ' Nesta versão de revisão, a ligação ainda está por configurar.' if not ACCESS_READY else ''
story += [P('Se não conseguir entrar','h2'),P('<b>A compra não aparece:</b> confirme o e-mail de compra e a confirmação de pagamento. Para dificuldades com a conta Hotmart, consulte a <link href="'+HELP+'" color="#0b6b2c">Central de Ajuda</link>.<br/><b>A ligação está ausente ou não abre:</b> contacte o produtor pelo canal indicado nos detalhes da compra.'+pending_note+'<br/><b>O progresso desapareceu:</b> confirme se está no mesmo navegador, dispositivo e versão do plano. Consulte as fichas em texto ou PDF que guardou.')]
story += [P('Contactar o produtor','h2')]
if SUPPORT_CONTACT:
    story += [P(escape(SUPPORT_CONTACT))]
else:
    story += [P('<b>Contacto direto: por configurar nesta versão.</b> Na Hotmart, abra <b>Minhas compras</b>, selecione o produto e consulte <b>Mostrar detalhes</b> para encontrar o contacto registado pelo produtor.')]
story += [P('Na mensagem de apoio, descreva o problema e indique o e-mail da compra e o código da transação, se necessário. Nunca envie a sua palavra-passe, códigos de acesso ou dados de cartão. Não introduza informação clínica pessoal nas fichas.','small'),gap(4),P('Conteúdo educativo para adultos. Não substitui aconselhamento de saúde, diagnóstico ou tratamento. Não suspenda medicamentos com base no guia.','small')]
story += [P('Ajuda oficial consultada em 19/10/2026: <link href="'+ACCESS_HELP+'" color="#0b6b2c">acesso a uma compra</link> e <link href="'+SUPPORT_HELP+'" color="#0b6b2c">contacto do produtor</link>. Os rótulos da Hotmart são mantidos como aparecem na plataforma.','small')]

OUTPUT.parent.mkdir(parents=True,exist_ok=True)
doc=BaseDocTemplate(str(OUTPUT),pagesize=A4,leftMargin=44,rightMargin=44,topMargin=92,bottomMargin=66,title='Botica Viva - Manual de acesso e utilização'+(' - Versão para revisão' if DRAFT else ''),author='Botica Viva',subject='Instruções de acesso após a compra e utilização do webapp',pageCompression=1)
doc.addPageTemplates([PageTemplate(id='cover',frames=[Frame(44,66,CONTENT,H-158,leftPadding=0,rightPadding=0,topPadding=0,bottomPadding=0)],onPage=lambda c,d:frame(c,d,True)),PageTemplate(id='body',frames=[Frame(44,66,CONTENT,H-158,leftPadding=0,rightPadding=0,topPadding=0,bottomPadding=0)],onPage=frame)])
doc.build(story)
print(OUTPUT)
