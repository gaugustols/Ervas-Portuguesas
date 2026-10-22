import { plantasComplementares } from './plantas-complementares.mjs';
import { completarFichas } from './fichas-plantas.mjs';
// Redação original Botica Viva. Fontes consultadas em 19/10/2026.
export const fontes = [
 ['NCCIH · Plantas: evidência e segurança','https://www.nccih.nih.gov/health/herbsataglance'],
 ['NHS · Produtos à base de plantas','https://www.nhs.uk/tests-and-treatments/herbal-medicines-and-complementary-therapies/'],
 ['EMA · Monografias de plantas','https://www.ema.europa.eu/pt/human-regulatory-overview/herbal-medicinal-products/european-union-monographs-list-entries'],
 ['RHS · Cultivar e colher ervas','https://www.rhs.org.uk/herbs/growing'],
 ['NHS · Vitaminas e minerais','https://www.nhs.uk/conditions/vitamins-and-minerals/'],
 ['NCCIH · Camomila','https://www.nccih.nih.gov/health/chamomile'],
 ['NCCIH · Hortelã-pimenta','https://www.nccih.nih.gov/health/peppermint-oil'],
 ['NCCIH · Gengibre','https://www.nccih.nih.gov/health/ginger'],
 ['NCCIH · Canela','https://www.nccih.nih.gov/health/cinnamon'],
 ['NCCIH · Curcuma','https://www.nccih.nih.gov/health/turmeric'],
 ['NCCIH · Aloé','https://www.nccih.nih.gov/health/aloe-vera'],
 ['RHS · Alecrim','https://www.rhs.org.uk/herbs/rosemary/grow-your-own'],
 ['RHS · Manjericão','https://www.rhs.org.uk/herbs/basil/grow-your-own'],
 ['NHS · Refluxo','https://www.nhs.uk/conditions/heartburn-and-acid-reflux/'],
 ['NHS · Insónia','https://www.nhs.uk/conditions/insomnia/'],
 ['NHS · Asma','https://www.nhs.uk/conditions/asthma/'],
 ['SNS · Quando ligar 112','https://www.sns.min-saude.pt/wp-content/uploads/2024/02/FAQs_Urgencia-Pediatrica-Referenciada.pdf'],
 ['NCCIH · Hipericão e interações','https://www.nccih.nih.gov/health/st-johns-wort-and-depression-in-depth'],
 ['NCCIH · Valeriana','https://www.nccih.nih.gov/health/valerian'],
 ['NCCIH · Equinácea','https://www.nccih.nih.gov/health/echinacea'],
];

// Nome, espécie, página fotográfica, grupo, parte, cozinha/estudo, cuidado específico.
const plantas = [
 ['Alecrim','Salvia rosmarinus','Rosemary','Aromáticas','Folhas','Perfuma legumes assados; retire os ramos lenhosos antes de servir.','Óleo essencial e extratos não equivalem ao tempero alimentar.'],
 ['Hortelã-verde','Mentha spicata','Mentha spicata','Aromáticas','Folhas','Junte folhas lavadas a uma salada ou água aromatizada para consumo imediato.','Não confundir diferentes espécies de hortelã nem usar o aroma para identificar plantas.'],
 ['Hortelã-pimenta','Mentha × piperita','Peppermint','Aromáticas','Folhas','Estude a diferença entre folhas, chá e cápsulas de óleo padronizado.','Preparações de hortelã podem agravar o refluxo; o óleo não é uma receita caseira.'],
 ['Manjericão','Ocimum basilicum','Basil','Aromáticas','Folhas','Adicione no fim da confeção a tomate ou massa. Lave antes de picar.','Pesto caseiro necessita de higiene e conservação no frio; não guardar ervas em óleo à temperatura ambiente.'],
 ['Tomilho','Thymus vulgaris','Thymus vulgaris','Aromáticas','Folhas e ramos tenros','Use como tempero em sopas e legumes, retirando talos duros.','Não aplicar óleo essencial puro na pele nem o ingerir.'],
 ['Orégãos','Origanum vulgare','Origanum vulgare','Aromáticas','Folhas','Use pequenas quantidades de folhas alimentares secas em molhos.','Óleo concentrado não tem o mesmo perfil do tempero.'],
 ['Salsa','Petroselinum crispum','Parsley','Aromáticas','Folhas','Pique sobre sopa já pronta; conserve o restante no frigorífico.','Sementes e extratos concentrados não são equivalentes às folhas culinárias.'],
 ['Coentros','Coriandrum sativum','Coriander','Aromáticas','Folhas ou sementes alimentares','Separe o uso de folhas frescas do de sementes em especiaria.','Alergias alimentares também podem ocorrer com ervas e especiarias.'],
 ['Cebolinho','Allium schoenoprasum','Chives','Aromáticas','Folhas','Corte com tesoura limpa e junte a pratos já cozinhados.','Não colher plantas semelhantes junto de bolbos ornamentais.'],
 ['Louro','Laurus nobilis','Laurus nobilis','Aromáticas','Folhas','Perfume um estufado com folha alimentar e retire-a antes de comer.','Loureiro-cerejo e outros ornamentais não são substitutos do louro alimentar.'],
 ['Sálvia','Salvia officinalis','Salvia officinalis','Aromáticas','Folhas','Use folhas alimentares em pequenas quantidades como tempero.','Evite extratos concentrados e óleo essencial por iniciativa própria.'],
 ['Erva-cidreira','Melissa officinalis','Melissa officinalis','Infusões','Folhas','Para bebida, escolha produto alimentar identificado e siga o rótulo.','O nome popular varia; não pressupõe eficácia para ansiedade ou insónia.'],
 ['Camomila','Matricaria chamomilla','Matricaria chamomilla','Infusões','Capítulos florais','Compare os nomes científicos no rótulo antes de preparar uma bebida.','Pode causar alergia, sobretudo em pessoas sensíveis a Asteraceae; interações são possíveis.'],
 ['Funcho','Foeniculum vulgare','Fennel','Infusões','Fruto alimentar, folhas e bolbo','Use o bolbo na cozinha; para infusão de frutos, respeite o produto alimentar.','Não dar infusões a bebés por iniciativa própria; não recolher umbelíferas silvestres.'],
 ['Lúcia-lima','Aloysia citrodora','Aloysia citrodora','Infusões','Folhas','Folhas secas de fornecedor identificado podem aromatizar uma bebida.','Não confundir com capim-limão: são espécies diferentes.'],
 ['Chá','Camellia sinensis','Camellia sinensis','Infusões','Folhas processadas','Chá verde e preto provêm desta espécie; siga o tempo indicado na embalagem.','Contém cafeína; extratos de chá verde não equivalem à bebida.'],
 ['Hibisco','Hibiscus sabdariffa','Hibiscus sabdariffa','Infusões','Cálices alimentares','Escolha cálices embalados para alimentação, não flores ornamentais.','Uso de medicamentos ou tensão baixa exige esclarecer a compatibilidade antes do uso regular.'],
 ['Gengibre','Zingiber officinale','Ginger','Cozinha','Rizoma','Rale um pouco como especiaria em sopa ou salteado.','Pode causar azia e desconforto; suplementos requerem aconselhamento, sobretudo com medicação.'],
 ['Curcuma','Curcuma longa','Turmeric','Cozinha','Rizoma','Use como especiaria num prato, sem procurar uma dose terapêutica.','Suplementos de elevada absorção foram associados a lesão do fígado; não equivalem ao alimento.'],
 ['Canela-do-ceilão','Cinnamomum verum','Cinnamomum verum','Cozinha','Casca alimentar','Aromatize fruta cozida com um pouco de canela alimentar.','Não usar canela para controlar a diabetes; a canela-cássia pode conter mais cumarina.'],
 ['Alho','Allium sativum','Garlic','Cozinha','Bolbo','Use no tempero, bem conservado e sem bolor.','Suplementos podem interferir com medicamentos; evite conservas caseiras de alho em óleo fora do frio.'],
 ['Cebola','Allium cepa','Onion','Cozinha','Bolbo','Inclua numa base de legumes; descarte partes deterioradas.','Não aplicar cebola em feridas nem usar sumos como gotas.'],
 ['Limão','Citrus × limon','Lemon','Cozinha','Fruto e raspa alimentar','Lave a casca antes de raspar para um prato ou bebida.','Acidez pode agravar refluxo; não aplicar sumo na pele antes de exposição solar.'],
 ['Laranjeira-doce','Citrus × sinensis','Orange (fruit)','Cozinha','Fruto','Prefira comer a fruta inteira; raspa apenas de casca própria para alimentação.','Sumos não substituem água nem tratamento; não confundir com extratos de laranja-amarga.'],
 ['Romã','Punica granatum','Pomegranate','Cozinha','Arilos do fruto','Junte os bagos a uma salada ou iogurte.','Não preparar decocções de casca ou raiz por iniciativa própria.'],
 ['Agrião','Nasturtium officinale','Watercress','Cozinha','Folhas e caules tenros','Compre de origem controlada e lave segundo indicação do produtor.','Não colher em cursos de água desconhecidos devido a risco de contaminação.'],
 ['Couve','Brassica oleracea','Brassica oleracea','Cozinha','Folhas alimentares','Cozinhe numa sopa variada; evite atribuir propriedades de desintoxicação.','Quem usa varfarina deve discutir consistência da vitamina K na dieta com a equipa clínica.'],
 ['Lavanda','Lavandula angustifolia','Lavandula angustifolia','Estudo','Flores de produto próprio para o uso','Estude primeiro o rótulo: decoração, cosmético e alimento são categorias diferentes.','Não ingerir óleo essencial; aroma forte pode ser desconfortável e não substitui cuidados de saúde.'],
 ['Equinácea','Echinacea purpurea','Echinacea purpurea','Estudo','Preparações comerciais identificadas','Consulte a evidência e a composição do produto antes de considerar qualquer uso.','Possíveis alergias e interações; não usar como substituto de vacinação ou cuidados numa infeção.'],
 ['Valeriana','Valeriana officinalis','Valeriana officinalis','Estudo','Raiz em produto regulamentado','É um tema para conversar com o farmacêutico, não uma receita culinária.','Pode causar sonolência; não combinar por iniciativa própria com sedativos ou álcool.'],
 ['Hipericão','Hypericum perforatum','Hypericum perforatum','Estudo','Preparações regulamentadas','Leve o nome e a lista de medicamentos ao farmacêutico antes de ponderar o uso.','Interage com muitos medicamentos, incluindo contracetivos e antidepressivos. Não iniciar nem suspender sozinho.'],
 ['Aloé','Aloe vera','Aloe vera','Estudo','Produtos comerciais de uso específico','Distinga cosmético, gel, látex e folha inteira; não são intercambiáveis.','Não ingerir preparações caseiras da folha ou do látex; não aplicar em queimaduras graves.'],
];

export const ervas = plantas.map((p,i)=>({id:`erva-${i+1}`,nome:p[0],especie:p[1],pagina:p[2],grupo:p[3],parte:p[4],uso:p[5],cuidado:p[6],fonte:({Camomila:5,'Hortelã-pimenta':6,Gengibre:7,'Canela-do-ceilão':8,Curcuma:9,Aloé:10,Alecrim:11,Manjericão:12,Hipericão:17,Valeriana:18,Equinácea:19})[p[0]] ?? (p[3]==='Estudo'?0:3)}));

// Enriquece quatro espécies existentes e acrescenta seis, sem alterar IDs guardados.
for (const nova of plantasComplementares) {
 const existente = ervas.find(e => e.especie === nova.especie);
 const referencias = nova.referencias.map(ref => {
  let i = fontes.findIndex(f => f[1] === ref[1]);
  if (i < 0) { i = fontes.length; fontes.push(ref); }
  return i;
 });
 if (existente) {
  const cuidadoAnterior = existente.cuidado;
  Object.assign(existente, nova, {fonte:referencias[0], referencias});
  existente.cuidado = cuidadoAnterior + ' ' + nova.cuidado;
 } else {
  ervas.push({...nova, id:'erva-'+(ervas.length+1), uso:'Consulte a preparação e as precauções desta ficha.', fonte:referencias[0], referencias});
 }
}

completarFichas(ervas, fontes);

export const modulos = [
 {id:'m1',titulo:'A sua primeira ficha',tempo:'8 min',objetivo:'Sair com uma planta identificada e uma decisão de uso documentada.',texto:'Comece por uma erva alimentar embalada que já conhece. Um nome popular ou uma fotografia não bastam para confirmar uma espécie silvestre. A primeira vitória é saber o que tem nas mãos e quando não usar.',passos:['Leia o nome, a origem e a validade no rótulo. Compare a espécie com a biblioteca.','Escolha uma utilização culinária simples. Se a identificação ou compatibilidade gerar dúvida, registe «não utilizar» e a pergunta para o farmacêutico.','Na ferramenta Ficha prática, guarde a planta, a origem e a decisão. Volte aqui e registe o título da ficha.'],exemplo:'Alecrim alimentar do supermercado, rótulo conservado. Utilização: aromatizar legumes assados. Não usar óleo essencial. Ficha guardada: «Alecrim da cozinha».',erro:'Colher uma planta desconhecida porque se parece com uma fotografia.',evidencia:'Título da ficha guardada e decisão de uso',requerFicha:true},
 {id:'m2',titulo:'Preparar com método',tempo:'10 min',objetivo:'Distinguir infusão, decocção e utilização alimentar.',texto:'A parte da planta e a indicação do produto determinam a preparação. Ferver tudo durante muito tempo não torna uma preparação melhor. Não converta quantidades de extratos em colheres de folhas.',passos:['Leia os seis métodos na biblioteca e escolha o adequado ao produto que tem.','Separe utensílios limpos, água potável e a embalagem. Siga as quantidades e o tempo do rótulo, sem aumentar a concentração.','Registe o método, a quantidade indicada e a hora de preparação; descarte se houver alteração de cheiro ou aspeto.'],exemplo:'Infusão alimentar embalada de erva-cidreira: água e tempo conforme embalagem; chávena limpa; consumir após arrefecer o suficiente.',erro:'Usar uma receita de folhas para uma raiz ou para um óleo essencial.',evidencia:'Método escolhido e instrução do rótulo transcrita'},
 {id:'m3',titulo:'Ler tradição e evidência',tempo:'7 min',objetivo:'Reconhecer os limites de uma afirmação sobre plantas.',texto:'Uso tradicional descreve uma história de utilização. Um estudo de um extrato específico não prova que uma infusão caseira tem o mesmo efeito. A EMA avalia preparações concretas; o nome da planta, sozinho, não valida todas as utilizações.',passos:['Escolha uma ficha e abra a fonte de consulta.','Separe o que é uso alimentar, tradição e resultado de investigação. Identifique a preparação estudada.','Escreva uma afirmação que não pode concluir a partir daquela fonte.'],exemplo:'Há investigação sobre cápsulas de óleo de hortelã-pimenta. Isso não permite afirmar que o chá cura o refluxo; preparações de hortelã podem até agravá-lo.',erro:'Confundir «natural» com «seguro para qualquer pessoa».',evidencia:'Uma conclusão válida e uma afirmação que a fonte não sustenta'},
 {id:'m4',titulo:'Saber quando pedir ajuda',tempo:'8 min',objetivo:'Preparar uma conversa útil com um profissional de saúde.',texto:'Se toma medicamentos, está grávida, amamenta ou tem uma doença crónica, esclareça a compatibilidade antes de usar plantas com finalidade de saúde. Este guia destina-se a adultos e não contém doses pediátricas.',passos:['Abra os temas de consulta e procure a questão que quer esclarecer.','Anote fora da app, para levar à consulta, medicamentos e produtos que utiliza; não suspenda terapêutica prescrita.','Registe aqui apenas a pergunta geral que pretende fazer, sem dados clínicos pessoais.'],exemplo:'«Esta preparação identificada é compatível com a minha medicação?» Levar a embalagem à farmácia.',erro:'Experimentar várias misturas enquanto adia a avaliação de um sintoma persistente.',evidencia:'Pergunta preparada e local de esclarecimento escolhido'},
 {id:'m5',titulo:'Montar a sua prateleira',tempo:'10 min',objetivo:'Ter um pequeno conjunto de ervas alimentares bem organizado.',texto:'Poucos produtos identificados são mais úteis do que uma coleção sem rótulos. Separe alimentação, cosméticos e limpeza. Mantenha embalagens e instruções até terminar o produto.',passos:['Faça uma lista de três produtos alimentares que realmente utiliza.','Verifique validade, recipiente, sinais de humidade e exposição ao calor. Siga a conservação da embalagem.','Crie etiquetas com nome, origem e data de abertura; remova produtos sem identificação segura.'],exemplo:'Orégãos: recipiente fechado, armário seco e protegido da luz, data de abertura na etiqueta. Hortelã fresca: conservação conforme indicação do fornecedor.',erro:'Guardar ervas sobre o fogão ou juntar sobras de lotes diferentes.',evidencia:'Três produtos e uma melhoria de conservação realizada'},
 {id:'m6',titulo:'Criar uma rotina possível',tempo:'6 min',objetivo:'Repetir uma tarefa simples e rever as suas fichas.',texto:'Aprender sobre ervas é um hábito de observação e organização. O painel acompanha fichas e módulos concluídos; não mede efeitos clínicos nem atribui alterações de saúde a uma planta.',passos:['Escolha um momento da semana para rever a prateleira e as fichas.','Defina uma ação pequena: ler um rótulo, experimentar um tempero alimentar ou preparar uma pergunta.','Escreva dia, ação e critério de conclusão. Exporte as suas fichas para guardar uma cópia.'],exemplo:'Domingo, depois do almoço: conferir três rótulos; concluído quando as datas estiverem legíveis. Exportar as fichas no fim.',erro:'Transformar uma rotina alimentar num tratamento por conta própria.',evidencia:'Dia, ação e critério de conclusão da sua próxima rotina'},
];

export const metodos = [
 ['Infusão','Para produtos alimentares indicados para infusão, normalmente partes delicadas.','1. Confirme espécie, validade e instruções. 2. Coloque a quantidade indicada numa chávena ou filtro limpo. 3. Junte água potável à temperatura indicada, tape se o rótulo recomendar e aguarde o tempo previsto. 4. Coe se necessário e deixe arrefecer antes de beber.','Não há tempo ou dose universal para todas as plantas. Não use plantas de identificação incerta.'],
 ['Decocção','Fervura de uma matéria vegetal quando o produto expressamente a prevê.','1. Leia se o produto pede decocção. 2. Meça água e matéria-prima conforme instrução. 3. Use recipiente próprio para alimentos e controle o tempo indicado. 4. Coe com cuidado e deixe arrefecer.','Não concentrar por fervura prolongada nem aplicar este método a qualquer casca ou raiz encontrada.'],
 ['Tempero culinário','Ervas alimentares numa refeição habitual.','1. Escolha um produto próprio para alimentação. 2. Lave as ervas frescas segundo indicação do fornecedor. 3. Remova partes deterioradas e talos duros. 4. Junte à receita em pequena quantidade, prove e ajuste o sabor.','A utilização culinária não estabelece uma dose medicinal.'],
 ['Bebida de fruta e hortaliça','Uma preparação alimentar para consumo imediato.','1. Lave mãos, utensílios e alimentos. 2. Use água potável, se necessária. 3. Prepare apenas a porção a consumir. 4. Prefira também fruta inteira e refeições com fibra.','Sumos não desintoxicam o organismo nem substituem uma alimentação variada ou medicamentos.'],
 ['Compressa e uso externo','Conhecer o limite do autocuidado e as instruções de produtos próprios para a pele.','1. Confirme que o produto é indicado para uso externo. 2. Leia as restrições e verifique a integridade da pele. 3. Use material limpo e temperatura confortável. 4. Interrompa se houver irritação.','Não aplicar preparações caseiras em olhos, feridas abertas, infeções ou queimaduras graves.'],
 ['Gargarejo e higiene oral','Apenas produtos especificamente indicados para esse fim.','1. Leia indicação e restrições etárias do produto. 2. Siga a diluição e o tempo da embalagem. 3. Não engula. 4. Dor persistente exige avaliação dentária ou médica.','Infusões, óleos essenciais e extratos não são automaticamente adequados para gargarejar.'],
];

const gruposTemas = [
 ['Digestão',['Azia','Refluxo','Enfartamento','Gases','Náuseas','Vómitos','Diarreia','Obstipação'], 'Registe quando começou e a relação com alimentos; peça orientação se persistir. Não procure uma erva para esconder sintomas.', 'Converse sobre a causa e a compatibilidade de qualquer produto. Na azia, a hortelã pode piorar o desconforto.',13],
 ['Sono e bem-estar',['Insónia','Despertares noturnos','Sono irregular','Cansaço','Ansiedade','Stress','Irritabilidade','Dificuldade de concentração'], 'Prepare uma descrição da rotina e da duração da dificuldade. Evite assumir que uma mistura sedativa resolve a causa.', 'Que hábitos e avaliação são adequados? Como evitar combinar plantas com sedativos ou álcool?',14],
 ['Respiração',['Tosse','Pieira','Falta de ar','Asma','Congestão nasal','Espirros','Dor de garganta','Rouquidão'], 'Asma e dificuldade respiratória precisam de cuidados próprios. Não substituir inaladores por chás ou inalações de vapor.', 'Que plano de cuidados devo seguir? Aromas ou óleos podem irritar as vias respiratórias?',15],
 ['Dor e movimento',['Dor de cabeça','Enxaqueca','Dor lombar','Dor cervical','Dores musculares','Dores articulares','Cãibras','Dor menstrual'], 'Anote localização, início e impacto para uma conversa clínica. Uma dor nova, intensa ou persistente precisa de avaliação.', 'Que sinais exigem observação e que medidas são compatíveis com o meu contexto?',1],
 ['Pele e boca',['Pele seca','Comichão','Vermelhidão','Acne','Dermatite','Aftas','Gengivas sensíveis','Lábios secos'], 'Não aplique óleos puros nem preparações de plantas desconhecidas em pele ou mucosas. A irritação pode ser uma reação ao próprio produto.', 'Devo suspender um cosmético ou procurar avaliação? Qual é o produto adequado à zona?',1],
 ['Saúde metabólica',['Colesterol elevado','Tensão arterial elevada','Tensão arterial baixa','Diabetes','Glicemia alterada','Excesso de peso','Falta de apetite','Anemia'], 'Estes temas não se resolvem com um catálogo de ervas. Não alterar medicamentos nem suplementos prescritos com base neste guia.', 'Que medições, alimentação e acompanhamento são apropriados? Há interações com o produto que estou a considerar?',1],
 ['Conforto diário',['Boca seca','Mau hálito','Olhos secos','Pernas cansadas','Inchaço','Transpiração excessiva','Sensação de frio','Tonturas'], 'Uma fotografia ou descrição breve não esclarece a causa. Evite gotas caseiras para olhos e misturas ingeridas para compensar sintomas.', 'Quando devo ser observado? Que produtos devo levar à consulta para verificar segurança?',1],
 ['Outros sinais',['Secura nasal','Arrotos','Soluços','Estômago pesado','Inchaço abdominal','Ardor ao urinar','Urinar com frequência','Dor de ouvidos'], 'Não tente mascarar sinais persistentes com plantas. Registe a dúvida para a equipa de saúde e não aplique gotas ou soluções caseiras.', 'Que avaliação é necessária e que informação devo levar?',1],
 ['Contextos especiais',['Gravidez','Amamentação','Infância','Doença renal','Doença hepática','Anticoagulantes','Sedativos','Cirurgia programada'], 'Não iniciar produtos à base de plantas com finalidade de saúde sem aconselhamento individual. Este guia não fornece doses para estes contextos.', 'Devo evitar este produto? Que informação precisa a equipa de saúde antes de uma cirurgia ou alteração de medicação?',1],
];
export const temas = gruposTemas.flatMap(([grupo,nomes,orientacao,pergunta,fonte])=>nomes.map(nome=>({nome,grupo,orientacao,pergunta,fonte})));
const observacoes = [
 'Em que momento aparece o ardor e o que estava a comer ou a fazer?',
 'A sensação sobe até à garganta? Em que posições ou horários acontece?',
 'Depois de que refeições surge a sensação de estar cheio?',
 'A dificuldade é recente ou acompanha uma mudança na alimentação?',
 'Quando começaram e que alimentos ou produtos foram consumidos antes?',
 'Quantos episódios houve e consegue manter líquidos? Leve esta informação à avaliação.',
 'Quando mudou o trânsito intestinal? Registe duração e eventuais produtos novos.',
 'Como mudou a frequência habitual? Descreva a rotina alimentar sem procurar uma mistura laxante.',
 'Quanto tempo demora a adormecer e há quanto tempo isso acontece?',
 'A que horas acorda e como se sente durante o dia?',
 'Os horários de deitar e levantar variam entre os dias de trabalho e descanso?',
 'Quando começou o cansaço e que atividades habituais passaram a ser difíceis?',
 'Que situações acompanham a dificuldade e como afeta as atividades do dia?',
 'Que exigências da rotina coincidiram com o início do desconforto?',
 'Há mudanças recentes no sono, rotina ou produtos utilizados?',
 'Em que tarefas nota a dificuldade e desde quando?',
 'É uma tosse recente ou recorrente? Descreva a duração e o contexto à equipa de saúde.',
 'Quando começou o som ao respirar? Não use aromas para tentar o suprimir.',
 'A dificuldade aparece em repouso ou esforço? Se for importante, procure ajuda de emergência.',
 'Tem um plano de cuidados prescrito e sabe onde o consultar? Leve as dúvidas à equipa.',
 'É uma dificuldade num lado ou nos dois e quando começou?',
 'Em que locais ou momentos aparecem os episódios?',
 'Quando começou e há dificuldade em engolir? Explique isto na avaliação.',
 'Há quanto tempo a voz mudou e que utilização faz da voz durante o dia?',
 'Onde dói, quando começou e é diferente do habitual?',
 'Que diagnóstico ou plano já foi estabelecido e que dúvida ficou por esclarecer?',
 'Que movimento ou situação coincidiu com o início da dor?',
 'Como afeta o movimento e as atividades habituais?',
 'Que esforço recente existiu e há quanto tempo dura a dificuldade?',
 'Que articulações estão envolvidas e o que mudou na função habitual?',
 'Quando aparecem e que medicação ou produtos deve levar à consulta?',
 'Como se relaciona com o ciclo e como mudou em relação ao habitual?',
 'Que zona da pele mudou e que produtos entraram recentemente na rotina?',
 'A comichão começou antes ou depois de um cosmético, planta ou produto novo?',
 'Onde está a vermelhidão e como evoluiu desde o início?',
 'Que produtos usa na pele e quais parecem irritar?',
 'Há diagnóstico e cuidados já indicados? Que produto vegetal quer esclarecer antes de usar?',
 'Há quanto tempo a lesão está presente e é recorrente?',
 'A sensibilidade surge com a escovagem ou alimentação? Prepare a dúvida para o dentista.',
 'Que produtos aplica e desde quando nota a secura?',
 'Que resultados e datas de análises deve levar à consulta? Não os guarde nesta app.',
 'Tem registos de medições feitos conforme orientação? Leve-os à equipa clínica.',
 'Quando nota desconforto e que medições já foram orientadas?',
 'Qual é a pergunta sobre a compatibilidade de plantas com o seu plano de cuidados?',
 'Que análise motivou a dúvida e que seguimento foi indicado?',
 'Que objetivo alimentar sustentável quer discutir sem recorrer a misturas para emagrecer?',
 'Há quanto tempo mudou o apetite e como está a afetar as refeições?',
 'Há diagnóstico confirmado e uma causa esclarecida? Prepare esta pergunta para a consulta.',
 'A secura é contínua ou surge em momentos específicos?',
 'Quando foi a última avaliação dentária e que cuidados de higiene mantém?',
 'Como afeta o conforto visual? Não coloque preparações vegetais nos olhos.',
 'Em que situações aparece a sensação e como afeta a mobilidade?',
 'Em que zona aparece e quando começou?',
 'É uma alteração recente e em que momentos acontece?',
 'A sensação é nova e existe em ambientes com temperatura confortável?',
 'Em que posição ou atividade surgem os episódios? Evite conduzir se se sentir instável.',
 'Que produtos usa no nariz e desde quando sente secura?',
 'Em que momentos ocorrem e houve mudança na rotina alimentar?',
 'Há quanto tempo duram e com que frequência voltam?',
 'Depois de que refeições aparece esta sensação e como evoluiu?',
 'A sensação é recorrente ou uma alteração nova? Descreva a duração.',
 'Quando começou e que outros sinais precisa de contar à equipa de saúde?',
 'Como mudou o padrão habitual e em que período do dia é mais evidente?',
 'Quando começou e utilizou gotas ou outros produtos? Não introduza preparações caseiras.',
 'Que produto identificado quer esclarecer com a equipa que acompanha a gravidez?',
 'Qual é a preparação e quem a recomendou? Leve a embalagem ao profissional.',
 'Qual é a idade e a questão para o profissional? Esta biblioteca não fornece doses infantis.',
 'Que restrições do plano de cuidados devem ser verificadas antes de considerar um produto?',
 'Que produto ou suplemento quer levar à equipa para confirmar compatibilidade?',
 'Qual é o nome exato do produto vegetal? Mostre a embalagem ao farmacêutico.',
 'Que preparação pretende usar e como evitar combinações por iniciativa própria?',
 'A equipa cirúrgica conhece todos os produtos vegetais e suplementos que utiliza?',
];
temas.forEach((t,i)=>{t.observacao=observacoes[i]});
export const nutrientes = [
 ['Vitamina A / carotenoides','Cenoura, espinafres, batata-doce; ovos e laticínios fornecem retinol.','Visão e manutenção de tecidos.','Não usar suplementos de vitamina A por iniciativa própria na gravidez.','vitamin-a/'],
 ['Vitaminas B','Leguminosas, cereais integrais e alimentos variados; B12 em alimentos de origem animal ou fortificados.','Funções diferentes no metabolismo e sistema nervoso.','Dietas veganas precisam de uma fonte fiável de B12; confirme com profissional.','vitamin-b/'],
 ['Vitamina C','Citrinos, pimento, brócolos e morangos.','Manutenção de tecidos e função antioxidante.','Infusão não substitui fruta e hortícolas.','vitamin-c/'],
 ['Vitamina D','Peixe gordo, gema de ovo e alimentos fortificados.','Regulação de cálcio e saúde óssea.','Ervas não são uma fonte fiável; necessidade de suplementação é individual.','vitamin-d/'],
 ['Vitamina K','Hortícolas de folha verde.','Coagulação normal.','Quem toma varfarina deve discutir alterações relevantes da dieta com a equipa clínica.','vitamin-k/'],
 ['Ferro','Leguminosas, carne e alimentos fortificados.','Formação de glóbulos vermelhos.','Suspeita de anemia precisa de avaliação; não prescrever ferro por conta própria.','iron/'],
 ['Cálcio','Laticínios, alternativas fortificadas e alguns hortícolas.','Ossos, dentes e função muscular.','Compare rótulos: teor e fortificação variam.','calcium/'],
];
export const modelos = [
 ['Etiqueta de frasco','Nome do produto:\nEspécie no rótulo:\nFornecedor e lote:\nValidade:\nData de abertura:\nConservação indicada:\nUso alimentar ou outra categoria:'],
 ['Pergunta para a farmácia','Quero esclarecer se este produto identificado é adequado ao meu contexto. Vou levar a embalagem e a lista atual de medicamentos à farmácia. Não vou substituir a terapêutica prescrita.'],
 ['Lista de preparação','Produto identificado e dentro da validade\nInstruções lidas\nUtensílios limpos e água potável\nQuantidade e tempo conforme rótulo\nTemperatura confortável\nConservação e descarte planeados'],
 ['Revisão semanal','Data:\nTrês rótulos conferidos:\nProduto a repor ou retirar:\nUma dúvida a esclarecer:\nPróxima ação e dia:\nCópia das fichas exportada:'],
];

export const aromas = {
 titulo:'Aromas e óleos essenciais: reconhecer os limites',
 texto:'Um aroma pode fazer parte de um ambiente agradável, mas preferência olfativa não demonstra um efeito clínico. Óleos essenciais são concentrados: não são equivalentes a uma folha, infusão ou tempero. Este capítulo não inclui doses de ingestão nem fórmulas de diluição caseiras.',
 passos:['Leia a categoria do produto e a via de utilização autorizada. Não ingerir óleos essenciais nem aplicar puros na pele.','Ventile o espaço e pare a utilização se surgir desconforto. Não faça inalações sobre água a ferver.','Guarde na embalagem original, fechado, longe de crianças e animais. Não aplique perto do rosto de bebés.','Gravidez, asma, alergias ou uso de medicamentos exigem esclarecimento individual antes de considerar produtos aromáticos.']
};

export const pro = {
 infusoes:[
 ['Camomila simples','Camomila alimentar embalada','Confirme o nome científico e alergias a Asteraceae.','Prepare a quantidade, água e tempo conforme rótulo. Coe e deixe arrefecer.','Compare o aspeto antes e depois; anote o aroma. Não atribua a uma chávena um efeito no sono.','erva-13'],
 ['Erva-cidreira','Folhas alimentares de Melissa officinalis','Confirme a espécie: «cidreira» pode designar plantas diferentes.','Use chávena e filtro limpos; siga a preparação indicada pelo fornecedor.','Registe se prefere o aroma suave ou intenso sem prolongar o tempo além do rótulo.','erva-12'],
 ['Lúcia-lima','Folhas alimentares de Aloysia citrodora','Não substituir por uma planta de jardim apenas pelo cheiro a limão.','Siga a quantidade e o tempo do produto alimentar. Consuma à temperatura confortável.','Anote a origem e o lote para repetir a experiência alimentar.','erva-15'],
 ['Hortelã-pimenta','Folhas alimentares de Mentha × piperita','Se tem refluxo, esclareça antes a adequação: pode agravar o problema.','Siga a embalagem e não adicione óleo essencial.','Registe o produto utilizado e a decisão de voltar a usar ou evitar.','erva-3'],
 ['Chá verde','Chá verde de Camellia sinensis','Contém cafeína; não substituir por extratos concentrados.','Use temperatura e tempo da embalagem; tempos excessivos podem tornar a bebida mais amarga.','Anote o horário para decidir se esta bebida se adapta à sua rotina.','erva-16'],
 ['Hibisco','Cálices alimentares de Hibiscus sabdariffa','Em contexto de medicação, esclareça a compatibilidade antes de uso regular.','Prepare conforme rótulo, sem usar flores ornamentais.','Observe a cor como característica da bebida, sem a interpretar como prova de eficácia.','erva-17'],
 ['Funcho','Frutos alimentares de Foeniculum vulgare','Não colher umbelíferas silvestres e não oferecer a bebés por iniciativa própria.','Siga as instruções do produto; não usar óleo essencial em substituição.','Distinga no seu registo fruto para infusão e bolbo utilizado na cozinha.','erva-14'],
 ['Gengibre alimentar','Produto de gengibre próprio para infusão','Pode provocar azia; não usar para compensar sintomas persistentes.','Siga as instruções do produto. Para cozinhar com rizoma fresco, consulte a ficha culinária.','Anote o produto e a preparação sem criar uma dose medicinal.','erva-18'],
 ],
 cultivo:[
 ['Alecrim','Local luminoso e substrato drenante. Evite manter as raízes encharcadas.','Observe a humidade antes de regar; colha pequenos ramos sem desfolhar toda a planta.','Seque folhas limpas em local ventilado ou conserve conforme uso alimentar; identifique a data.','erva-1',11],
 ['Manjericão','Local quente e luminoso, protegido do frio. Vaso com escoamento de água.','Mantenha a humidade sem água parada e colha pontas para uso culinário.','Use folhas frescas ou congele porções higienizadas; não faça conservas em óleo à temperatura ambiente.','erva-4',12],
 ['Hortelã-verde','Vaso próprio ajuda a conter o crescimento. Dê luz e acompanhe a humidade.','Observe a superfície do substrato; retire folhas deterioradas com utensílio limpo.','Para uso alimentar, lave e conserve no frio conforme estado e instruções de origem.','erva-2',3],
 ['Tomilho','Luz abundante e boa drenagem; o excesso de água é um problema frequente.','Colha moderadamente e mantenha o vaso com saída de água desobstruída.','Secagem apenas de material em bom estado, em pequenas porções, protegido de pó.','erva-5',3],
 ['Salsa','Vaso com drenagem e humidade acompanhada; evite calor excessivo e secura prolongada.','Colha folhas exteriores sem retirar toda a folhagem de uma vez.','Lave antes de usar e congele porções se não for consumir brevemente.','erva-7',3],
 ['Cebolinho','Cultive em recipiente drenante e com boa luz.','Corte folhas com tesoura limpa, deixando a base recuperar.','Use fresco ou congele pequenas porções identificadas.','erva-9',3],
 ],
 fichas:[
 ['Ficha de planta','Nome comum:\nNome científico confirmado:\nFornecedor / origem:\nParte utilizada:\nCategoria do produto:\nValidade e lote:\nUtilização prevista:\nDúvida a esclarecer:\nDecisão: utilizar como alimento / não utilizar'],
 ['Ficha de preparação','Data:\nProduto e lote:\nMétodo:\nQuantidade conforme rótulo:\nÁgua / temperatura indicada:\nTempo indicado:\nUtensílios:\nHora de preparação:\nConservação / descarte:\nObservações de sabor e aroma:'],
 ['Diário de cultivo','Planta e espécie:\nData de plantação:\nLocal e luz:\nVaso e drenagem:\nHumidade observada:\nRega realizada:\nFolhas / pragas observadas:\nColheita:\nPróxima tarefa:'],
 ['Controlo da prateleira','Data da revisão:\nProduto:\nNome e lote legíveis:\nValidade:\nData de abertura:\nRecipiente seco e fechado:\nSinais de alteração:\nDecisão: manter / repor / descartar'],
 ]
};
