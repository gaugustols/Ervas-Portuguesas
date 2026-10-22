// Fichas educativas em PT-PT. Receitas alimentares não são doses medicinais.
// Os índices de fontes são resolvidos por URL para preservar as referências anteriores.
const rhs = ['RHS · Ervas na cozinha e no jardim', 'https://www.rhs.org.uk/herbs/growing'];
const nccih = ['NCCIH · Evidência e segurança das plantas', 'https://www.nccih.nih.gov/health/herbsataglance'];
const nhs = ['NHS · Segurança dos produtos à base de plantas', 'https://www.nhs.uk/tests-and-treatments/herbal-medicines-and-complementary-therapies/'];
const ref = (nome, url) => [nome, url];
const receita = (titulo, ingredientes, passos, tipo = 'Preparação alimentar para adultos; não é uma dose medicinal') => ({titulo, tipo, ingredientes, passos});
const bebida = (nome, parte) => receita('Infusão de '+nome, [parte+' em produto alimentar identificado, na quantidade indicada na embalagem', 'Água potável, no volume e à temperatura indicados no rótulo'], [
 'Confirme a espécie, a parte da planta e os cuidados desta ficha. Use uma chávena e um filtro limpos.',
 'Coloque o produto no filtro e junte a água conforme a embalagem. Tape durante o tempo indicado, sem aumentar a concentração.',
 'Retire o filtro ou coe cuidadosamente. Deixe arrefecer até uma temperatura confortável e prepare apenas para consumo imediato.'
]);
const tempero = (titulo, ingredientes, passos) => receita(titulo, ingredientes, passos);
const ocasional = 'Como bebida alimentar ocasional, siga a porção e as instruções da embalagem, de preferência sem açúcar. Esta ficha não define uma frequência diária nem um ciclo de tratamento.';

// Cada entrada tem conteúdo próprio; não se atribuem benefícios clínicos a todos os alimentos.
const fichas = {
 'erva-1': {
  resumo:'Aroma e uso tradicional no conforto digestivo.',
  modoUsar:'Para a infusão alimentar, prepare apenas a porção descrita e consuma ocasionalmente, depois de coar. Na cozinha, use para aromatizar pratos e retire os ramos lenhosos. Não há aqui uma frequência de tratamento.'
 },
 'erva-2': {
  resumo:'Aromatizar saladas e bebidas alimentares.',
  beneficios:'A hortelã-verde dá frescura e aroma a saladas, molhos e bebidas. Este uso culinário não demonstra que trate ansiedade ou problemas digestivos.',
  preparacao:tempero('Hortelã-verde na salada', ['Folhas frescas de Mentha spicata próprias para alimentação', 'Uma salada pronta a temperar'], ['Lave as folhas em água potável e rejeite partes deterioradas.', 'Escorra e pique as folhas com um utensílio limpo.', 'Junte à salada pouco antes de servir. Guarde os ingredientes perecíveis no frigorífico.']),
  modoUsar:'Use como tempero de uma refeição, segundo o sabor pretendido. Para uma infusão embalada, siga as instruções desse produto; não substitua as folhas por óleo essencial.'
 },
 'erva-3': {
  resumo:'Bebida aromática; atenção ao refluxo.',
  beneficios:'A folha é utilizada em bebidas aromáticas. Há estudos de cápsulas específicas de óleo de hortelã-pimenta no síndrome do intestino irritável; esses resultados não demonstram o mesmo efeito num chá caseiro.',
  preparacao:bebida('hortelã-pimenta','Folhas de Mentha × piperita'), modoUsar:ocasional,
  referencias:[ref('NCCIH · Hortelã-pimenta','https://www.nccih.nih.gov/health/peppermint-oil')]
 },
 'erva-4': {resumo:'Tempero aromático para refeições.', modoUsar:'Use as folhas como tempero, de preferência no fim da confeção. A infusão descrita é uma opção alimentar ocasional, sem indicação de tomas diárias. Não a utilize para tratar gripe ou bronquite.'},
 'erva-5': {
  resumo:'Tempero; tradição em preparações para a tosse.',
  beneficios:'Na cozinha, o tomilho aromatiza sopas e legumes. A EMA reconhece uso tradicional de preparações medicinais específicas na tosse com expetoração associada a constipações; isso não valida qualquer chá nem substitui avaliação de sintomas persistentes.',
  preparacao:tempero('Tomilho nos legumes', ['Tomilho próprio para alimentação', 'Legumes para cozinhar'], ['Lave o tomilho fresco e os legumes.', 'Junte as folhas ou um pequeno ramo durante a confeção da sua receita.', 'Retire os talos duros antes de servir.']),
  modoUsar:'Use como tempero de uma refeição. Para finalidade medicinal, escolha um produto autorizado com orientação farmacêutica e siga o folheto; não converta a receita culinária em tratamento.',
  referencias:[ref('EMA · Tomilho','https://www.ema.europa.eu/en/medicines/herbal/thymi-herba')]
 },
 'erva-6': {
  resumo:'Aromatizar molhos, tomate e legumes.',
  beneficios:'Os orégãos são uma erva culinária de aroma intenso, útil para dar sabor aos pratos. O tempero não é um antibiótico nem um tratamento de infeções.',
  preparacao:tempero('Orégãos no molho de tomate', ['Folhas secas de orégãos alimentares', 'Molho de tomate da sua receita habitual'], ['Confirme a validade e rejeite folhas com humidade ou bolor.', 'Adicione uma pequena quantidade ao molho durante a confeção.', 'Misture e ajuste o sabor sem recorrer a óleo essencial.']),
  modoUsar:'Use como condimento de uma refeição. Guarde o produto seco e bem fechado, segundo o rótulo; não prepare concentrados para ingestão.'
 },
 'erva-7': {
  resumo:'Sabor fresco em sopas e outros pratos.',
  beneficios:'A salsa acrescenta aroma e variedade às refeições. Uma pequena quantidade como tempero não serve para corrigir anemia, fazer uma «desintoxicação» ou tratar os rins.',
  preparacao:tempero('Salsa picada para servir', ['Folhas de salsa próprias para alimentação', 'Sopa ou prato acabado de cozinhar'], ['Lave as folhas e escorra bem.', 'Pique com uma faca limpa e junte ao prato no fim da confeção.', 'Conserve a salsa restante no frigorífico; rejeite material deteriorado.']),
  modoUsar:'Use as folhas como tempero alimentar. Não transforme sementes, sumos concentrados ou extratos de salsa numa rotina medicinal.'
 },
 'erva-8': {
  resumo:'Aromatizar pratos com folhas ou sementes.',
  beneficios:'Os coentros dão aroma às refeições. Folhas frescas e sementes têm sabores e utilizações diferentes; nenhuma destas utilizações é apresentada como tratamento de doenças.',
  preparacao:tempero('Coentros frescos na refeição', ['Folhas de coentros próprias para alimentação', 'Um prato pronto a servir'], ['Lave e escorra as folhas.', 'Pique com um utensílio limpo, separando partes deterioradas.', 'Adicione no fim da confeção. Se usar sementes, siga uma receita própria para essa especiaria.']),
  modoUsar:'Use como condimento, segundo o sabor pretendido. Pare o consumo se notar uma reação e procure aconselhamento; não atribua a uma alergia o significado de «limpeza» do organismo.'
 },
 'erva-9': {
  resumo:'Tempero suave para pratos já cozinhados.',
  beneficios:'O cebolinho confere um sabor suave semelhante ao da cebola. É uma opção culinária; não há indicação nesta ficha para o usar no tratamento da tensão arterial ou do colesterol.',
  preparacao:tempero('Cebolinho cortado na hora', ['Folhas de cebolinho de origem alimentar', 'Sopa, omeleta ou outro prato pronto'], ['Lave as folhas e escorra.', 'Corte em pedaços pequenos com tesoura limpa.', 'Junte ao prato perto da hora de servir.']),
  modoUsar:'Use como tempero de uma refeição. Conserve as folhas no frio e não substitua por folhas de bolbos ornamentais.'
 },
 'erva-10': {
  tituloFicha:'Chá de louro: tradição e cuidados', resumo:'Aroma culinário e tradição nas bebidas caseiras.',
  descricao:'O louro é uma planta aromática muito usada na culinária e também em preparações caseiras. Confirme sempre Laurus nobilis e utilize folhas próprias para alimentação.',
  beneficios:'O louro aromatiza estufados, sopas e bebidas tradicionais. Um pequeno estudo em pessoas com diabetes avaliou folhas moídas em cápsulas, em conjunto com a medicação habitual; não avaliou chá. Não permite concluir que o chá controle a glicose ou alivie dores. Chá de louro não substitui medicamentos nem acompanhamento médico.',
  preparacao:receita('Chá de louro alimentar', ['Folhas secas de Laurus nobilis comercializadas para infusão, na quantidade indicada na embalagem', 'Água potável, na quantidade indicada no produto'], ['Confirme a espécie e leia o rótulo. Um frasco de tempero sem instruções de infusão não define uma dose de chá.', 'Aqueça a água e prepare a infusão ou decocção exatamente conforme as instruções do produto. Não aplique um tempo ou número de folhas universal.', 'Coe cuidadosamente, retire todas as folhas e deixe arrefecer antes de beber. Não ingira as folhas inteiras.']),
  modoUsar:'Como bebida alimentar ocasional, siga a porção indicada pelo fabricante, de preferência sem açúcar. Não use para ajustar a glicemia nem para reduzir medicação. Se não houver instruções para bebida, use o louro apenas como tempero ou esclareça com o farmacêutico.',
  cuidadoExtra:'Retire sempre as folhas inteiras antes de consumir: são rígidas e podem causar lesões. Quem toma medicamentos para a diabetes deve esclarecer a utilização regular com um profissional. Não há uma dose medicinal de chá validada nesta ficha.',
  referencias:[ref('Universidade de Wisconsin · Louro alimentar','https://hort.extension.wisc.edu/articles/sweet-bay-laurus-nobilis/'),ref('Estudo sobre louro em cápsulas · limites da evidência','https://pubmed.ncbi.nlm.nih.gov/19177188/')]
 },
 'erva-11': {
  resumo:'Aromatizar pratos com pequenas quantidades de folhas.',
  beneficios:'A sálvia é utilizada como tempero aromático. O uso de algumas preparações na tradição medicinal não permite atribuir ao tempero um efeito terapêutico nem recomendar chá concentrado.',
  preparacao:tempero('Sálvia como tempero', ['Folhas de Salvia officinalis próprias para alimentação', 'Um prato salgado da sua preferência'], ['Lave as folhas frescas e rejeite partes deterioradas.', 'Utilize uma pequena quantidade numa receita culinária conhecida.', 'Retire os ramos duros e sirva o prato. Não adicione óleo essencial.']),
  modoUsar:'Use em quantidades culinárias, como condimento. Para preparados com finalidade medicinal, peça orientação farmacêutica; esta ficha não define tomas de chá ou extratos.'
 },
 'erva-12': {resumo:'Uso tradicional no relaxamento e conforto digestivo.', modoUsar:'A infusão descrita é uma bebida alimentar ocasional. Para sintomas de stress ou dificuldades do sono, um produto medicinal deve seguir o respetivo folheto. Se os sintomas persistirem, procure avaliação em vez de aumentar a quantidade.'},
 'erva-13': {
  resumo:'Infusão tradicional associada ao relaxamento.',
  beneficios:'A camomila tem uma longa tradição como bebida de conforto e relaxamento. A evidência clínica não permite apresentar um chá como tratamento comprovado da insónia ou da ansiedade.',
  preparacao:bebida('camomila','Capítulos florais de Matricaria chamomilla'), modoUsar:ocasional,
  referencias:[ref('NCCIH · Camomila','https://www.nccih.nih.gov/health/chamomile')]
 },
 'erva-14': {
  resumo:'Alimento e tradição no conforto digestivo.',
  beneficios:'O bolbo é um alimento; os frutos são usados em infusões. Algumas preparações medicinais de funcho têm uso tradicional para gases e desconforto digestivo ligeiro, o que não equivale a benefício clínico garantido.',
  preparacao:bebida('funcho','Frutos alimentares de Foeniculum vulgare'), modoUsar:ocasional+' O bolbo pode ser usado como legume; não é intercambiável com frutos ou óleo essencial.',
  referencias:[ref('EMA · Fruto de funcho-doce','https://www.ema.europa.eu/en/medicines/herbal/foeniculi-dulcis-fructus')]
 },
 'erva-15': {
  resumo:'Bebida de aroma cítrico.',
  beneficios:'A lúcia-lima é apreciada em infusões pelo aroma cítrico e pela tradição como bebida de conforto. Esse uso não demonstra que trate uma perturbação de ansiedade ou do sono.',
  preparacao:bebida('lúcia-lima','Folhas de Aloysia citrodora'), modoUsar:ocasional
 },
 'erva-16': {
  resumo:'Bebida com cafeína; verde e preto são da mesma espécie.',
  beneficios:'As folhas de Camellia sinensis dão origem a diferentes chás, como verde e preto. A cafeína pode aumentar o estado de alerta; a bebida não é um tratamento para emagrecer nem substitui refeições.',
  preparacao:bebida('chá verde ou preto','Chá de Camellia sinensis do tipo escolhido'),
  modoUsar:'Consuma como bebida alimentar, atendendo à cafeína e à sua sensibilidade. Evite perto da hora de deitar se afetar o sono. Extratos concentrados não equivalem à chávena de chá.',
  referencias:[ref('NCCIH · Chá verde','https://www.nccih.nih.gov/health/green-tea')]
 },
 'erva-17': {
  resumo:'Infusão de sabor ácido e cor intensa.',
  beneficios:'Os cálices alimentares de hibisco dão uma bebida ácida e de cor intensa. Esta utilização alimentar não é uma indicação para substituir o tratamento da tensão arterial por uma infusão caseira.',
  preparacao:bebida('hibisco','Cálices de Hibiscus sabdariffa próprios para alimentação'), modoUsar:ocasional+' Se tem tensão baixa ou toma medicamentos, confirme a compatibilidade antes de uso regular.'
 },
 'erva-18': {
  resumo:'Especiaria; investigação sobre náuseas.',
  beneficios:'O gengibre dá sabor picante aos pratos. Alguns estudos de suplementos apontam benefício nas náuseas da gravidez, mas uma receita alimentar não é uma dose terapêutica; na gravidez, peça aconselhamento antes de o usar com essa finalidade.',
  preparacao:tempero('Gengibre na sopa', ['Rizoma de gengibre próprio para alimentação', 'Uma sopa ou um salteado da sua receita habitual'], ['Lave o rizoma e retire partes deterioradas.', 'Rale uma pequena quantidade com um utensílio limpo.', 'Junte durante a confeção e ajuste o sabor. Não substitua por um extrato ou óleo.']),
  modoUsar:'Use como especiaria de uma refeição. Não aumente a quantidade para procurar um efeito contra dores ou náuseas; suplementos e utilização com finalidade de saúde precisam de aconselhamento.'
 },
 'erva-19': {
  resumo:'Cor e sabor nas refeições.',
  beneficios:'A curcuma é uma especiaria que dá cor e sabor. Há investigação sobre curcumina, mas os resultados não estabelecem que uma preparação culinária trate inflamações ou dores.',
  preparacao:tempero('Curcuma no arroz ou nos legumes', ['Curcuma alimentar em pó', 'Arroz ou legumes da sua receita habitual'], ['Confirme a validade do pó e conserve-o seco.', 'Adicione uma pequena quantidade durante a confeção, de acordo com a receita.', 'Misture e sirva. Não adicione suplementos para aumentar a concentração.']),
  modoUsar:'Use como especiaria alimentar. Não a transforme em doses concentradas ou suplementos para tratar sintomas.'
 },
 'erva-20': {
  resumo:'Aromatizar fruta e sobremesas.',
  beneficios:'A canela-do-ceilão confere aroma a alimentos. A investigação não demonstra de forma clara que suplementos de canela sejam úteis no controlo da diabetes; um chá não substitui medicação.',
  preparacao:tempero('Fruta cozida com canela', ['Fruta lavada e preparada', 'Canela-do-ceilão alimentar, em pau ou em pó'], ['Prepare a fruta segundo a sua receita.', 'Junte um pouco de canela alimentar durante a confeção.', 'Se usar canela em pau, retire-a antes de servir.']),
  modoUsar:'Use como condimento ocasional. Não ingira pó seco às colheradas nem utilize a canela para alterar o tratamento da diabetes.'
 },
 'erva-21': {
  resumo:'Sabor no tempero das refeições.',
  beneficios:'O alho é um ingrediente culinário. Alguns suplementos foram estudados para fatores cardiovasculares, mas os resultados não permitem tratar colesterol ou tensão arterial com um dente de alho ou um chá.',
  preparacao:tempero('Alho na confeção', ['Dentes de alho em bom estado', 'Legumes ou outro prato para cozinhar'], ['Descasque e rejeite dentes deteriorados.', 'Pique com utensílio limpo.', 'Junte durante a confeção da sua receita. Não guarde alho em óleo à temperatura ambiente.']),
  modoUsar:'Use como ingrediente alimentar. Antes de tomar suplementos, confirme a compatibilidade com medicamentos, sobretudo os que afetam a coagulação.',
  referencias:[ref('NCCIH · Alho','https://www.nccih.nih.gov/health/garlic')]
 },
 'erva-22': {
  resumo:'Base de sabor para sopas e outros pratos.',
  beneficios:'A cebola contribui para o sabor e a variedade da alimentação. Não há nesta ficha indicação para a usar como remédio para tosse, infeções ou feridas.',
  preparacao:tempero('Cebola numa base de legumes', ['Cebola em bom estado', 'Legumes para sopa ou estufado'], ['Descasque, lave e corte com utensílio limpo.', 'Junte aos restantes ingredientes e cozinhe segundo a receita.', 'Conserve os alimentos preparados no frio, segundo as regras de higiene alimentar.']),
  modoUsar:'Inclua como alimento numa refeição. Não aplique sumo de cebola nos olhos, ouvidos ou pele lesionada.'
 },
 'erva-23': {
  resumo:'Acidez e aroma cítrico na cozinha.',
  beneficios:'O limão dá sabor a pratos e bebidas. É um alimento, sem indicação nesta ficha para «desintoxicar» o organismo, emagrecer ou tratar infeções.',
  preparacao:tempero('Água aromatizada com limão', ['Limão lavado, de origem alimentar', 'Água potável'], ['Lave a casca antes de cortar.', 'Junte uma rodela ou um pouco de sumo à água, conforme o sabor pretendido.', 'Prepare para consumo imediato e lave os utensílios.']),
  modoUsar:'Use na alimentação conforme a tolerância à acidez. Se agravar azia ou refluxo, evite a preparação. Não use sumo ou óleo de limão como tratamento da pele.'
 },
 'erva-24': {
  resumo:'Fruta e aroma para refeições variadas.',
  beneficios:'A laranja inteira contribui para a variedade alimentar e fornece fibra. Não previne nem trata por si uma constipação e não equivale a extratos de laranja-amarga.',
  preparacao:tempero('Laranja fresca', ['Laranja-doce própria para alimentação'], ['Lave o fruto antes de o descascar ou cortar.', 'Retire a casca e separe os gomos.', 'Sirva a fruta; se usar raspa, confirme que a casca é adequada para alimentação.']),
  modoUsar:'Consuma como fruta numa alimentação variada. Não substitua refeições por sumos nem use extratos de outras espécies como se fossem equivalentes.'
 },
 'erva-25': {
  resumo:'Bagos para saladas e iogurtes.',
  beneficios:'Os bagos da romã acrescentam sabor e variedade às refeições. A presença de compostos vegetais não prova que o fruto trate doenças cardiovasculares ou outras condições.',
  preparacao:tempero('Bagos de romã', ['Romã lavada', 'Salada ou iogurte, se desejar'], ['Corte o fruto com uma faca limpa.', 'Separe os bagos, retirando casca e membranas.', 'Sirva os bagos; conserve as porções restantes no frigorífico.']),
  modoUsar:'Consuma os bagos como alimento. Não prepare chá de casca ou raiz nem procure uma dose medicinal com sumos concentrados.'
 },
 'erva-26': {
  resumo:'Hortícola para sopas e refeições.',
  beneficios:'O agrião é um hortícola que pode integrar uma alimentação variada. Não é indicado nesta ficha para curar tosse ou infeções respiratórias.',
  preparacao:tempero('Agrião na sopa', ['Agrião de origem alimentar controlada', 'Uma sopa da sua receita habitual'], ['Rejeite folhas deterioradas e lave conforme as instruções do produtor.', 'Junte à sopa durante a confeção.', 'Cozinhe e sirva; não colha em cursos de água desconhecidos.']),
  modoUsar:'Use como hortícola numa refeição. Não faça xaropes ou sumos para substituir cuidados de saúde.'
 },
 'erva-27': {
  resumo:'Hortícola numa alimentação variada.',
  beneficios:'A couve fornece fibra e nutrientes, incluindo vitamina K. Isso não a torna uma preparação para «desintoxicação» nem um tratamento de doenças.',
  preparacao:tempero('Couve na sopa', ['Folhas de couve próprias para alimentação', 'Ingredientes da sua sopa habitual'], ['Separe as folhas, lave e retire partes deterioradas.', 'Corte com utensílio limpo.', 'Junte à sopa e cozinhe segundo a receita.']),
  modoUsar:'Inclua como alimento. Se toma varfarina, mantenha a alimentação consistente e esclareça mudanças relevantes com a equipa que o acompanha.'
 },
 'erva-28': {
  resumo:'Aroma; produtos alimentares e cosméticos são diferentes.',
  beneficios:'A lavanda é apreciada pelo aroma. A investigação de algumas preparações não permite atribuir o mesmo efeito a flores de jardim ou a qualquer óleo, nem apresentar o aroma como tratamento da ansiedade.',
  preparacao:receita('Confirmar o produto antes de utilizar', [], ['Leia no rótulo se o produto é alimentar, cosmético ou de outra categoria.', 'Confirme a espécie e a utilização prevista com o farmacêutico quando houver finalidade de saúde.', 'Não faça uma infusão com flores ornamentais e não adicione óleo essencial a uma bebida.'], 'Ficha de estudo; sem receita para ingestão'),
  modoUsar:'Siga apenas a via e as instruções de um produto identificado. Esta ficha não recomenda ingestão de óleo essencial, doses caseiras nem inalações sobre água a ferver.',
  referencias:[ref('NCCIH · Lavanda','https://www.nccih.nih.gov/health/lavender')]
 },
 'erva-29': {
  resumo:'Preparações estudadas nas constipações.',
  beneficios:'A equinácea foi estudada na prevenção e duração de constipações, com resultados variáveis entre produtos. Não é um tratamento de infeções graves nem substitui vacinação.',
  modoUsar:'Se ponderar um produto, confirme a adequação com o farmacêutico e siga o folheto. Não defina uma frequência a partir de uma fotografia ou de receitas de outras espécies.'
 },
 'erva-30': {
  resumo:'Uso tradicional no sono; pode causar sonolência.',
  beneficios:'A raiz de valeriana é utilizada tradicionalmente em preparações para o sono. Os estudos sobre insónia têm resultados inconsistentes; isso não permite recomendar uma dose caseira universal.',
  modoUsar:'Para um produto autorizado, siga o folheto após confirmar a compatibilidade com o farmacêutico. Não associe a álcool ou sedativos por iniciativa própria e não conduza se sentir sonolência.'
 },
 'erva-31': {
  resumo:'Interações importantes; avaliação antes de qualquer uso.',
  beneficios:'Alguns extratos de hipericão foram estudados na depressão ligeira a moderada. Esses resultados não validam chá caseiro nem utilização sem acompanhamento; as interações podem reduzir a eficácia de medicamentos.',
  modoUsar:'Não inicie, suspenda ou combine hipericão por iniciativa própria. Leve a embalagem e a lista de medicamentos ao médico ou farmacêutico, incluindo contracetivos e antidepressivos.'
 },
 'erva-32': {
  resumo:'Gel cosmético para cuidados externos da pele.',
  preparacao:receita('Gel cosmético de aloé', ['Gel cosmético de Aloe vera identificado para uso cutâneo'], ['Leia o rótulo e use apenas na zona e nas condições indicadas.', 'Comece numa pequena área de pele íntegra e pare se houver irritação.', 'Não prepare gel da folha para ingestão nem use em feridas profundas ou queimaduras graves.'], 'Apenas uso externo conforme o rótulo'),
  modoUsar:'Aplique um produto cosmético na quantidade e frequência indicadas pelo fabricante, apenas em pele íntegra. Não ingira folha, látex ou gel caseiro; pare se surgir ardor, vermelhidão ou comichão.'
 },
 'erva-33': {resumo:'Tradição digestiva; requer avaliação das vias biliares.', modoUsar:'Apenas após confirmar a adequação com um profissional e conforme o folheto do produto autorizado. A ficha não estabelece dose nem frequência doméstica; não utilize por iniciativa própria para dores abdominais.'},
 'erva-34': {resumo:'Infusão cítrica e tradição no conforto digestivo.', modoUsar:'A preparação descrita é uma bebida alimentar ocasional para adultos, depois de bem coada. Não há frequência medicinal definida e não substitui tratamento da tensão arterial.'},
 'erva-35': {resumo:'Tema de estudo; não dissolve cálculos por indicação desta ficha.', modoUsar:'Não utilize para tentar expulsar cálculos ou adiar uma avaliação de sintomas urinários. Qualquer utilização com finalidade de saúde exige avaliação individual; esta ficha não define dose ou frequência.'},
 'erva-36': {resumo:'Tradição popular com evidência clínica limitada.', modoUsar:'Não estabeleça uma rotina medicinal a partir de usos populares. Confirme com um profissional a identificação, o produto e a compatibilidade; a ficha não recomenda dose caseira.'},
 'erva-37': {resumo:'Tempero aromático; tradição no conforto da garganta.', modoUsar:'Utilize apenas folhas alimentares corretamente identificadas como tempero de uma refeição. Para finalidade medicinal, peça aconselhamento; não há dose de chá nem frequência de tratamento nesta ficha.'},
 'erva-38': {resumo:'Identificação e riscos; não preparar para ingestão.', modoUsar:'Não consumir chá, sumo ou óleo de mastruz nem usar como vermífugo caseiro. Esta ficha serve para reconhecer a planta e os seus riscos, sem dose ou modo de ingestão.'}
};

export function completarFichas(ervas, fontes) {
 const addFonte = f => {
  let i = fontes.findIndex(x => x[1] === f[1]);
  if (i < 0) { i = fontes.length; fontes.push(f); }
  return i;
 };
 for (const e of ervas) {
  const ficha = fichas[e.id];
  if (!ficha) throw new Error('Falta conteúdo da ficha '+e.id);
  const {referencias = [], cuidadoExtra, ...campos} = ficha;
  Object.assign(e, campos);
  e.descricao ||= e.nome+' ('+e.especie+'): conheça a parte utilizada, a preparação e os cuidados antes de decidir como usar.';
  if (!e.preparacao && e.grupo === 'Estudo') e.preparacao = receita('Antes de considerar um produto de '+e.nome.toLowerCase(), [], [
   'Confirme o nome científico e a composição na embalagem de um produto identificado.',
   'Leve a embalagem e a lista de medicamentos ao médico ou farmacêutico.',
   'Só prepare ou utilize se houver indicação adequada ao seu caso, seguindo o folheto. Não improvise doses de uma planta de jardim.'
  ], 'Orientação profissional; sem receita medicinal caseira');
  if (!e.beneficios || !e.preparacao || !e.modoUsar) throw new Error('Ficha incompleta: '+e.nome);
  if (cuidadoExtra) e.cuidado += ' '+cuidadoExtra;
  e.cuidadosGerais = 'Não substitui medicamentos nem acompanhamento médico. Gravidez, amamentação, infância, doença crónica ou medicação contínua exigem aconselhamento antes de usar plantas com finalidade de saúde. Uma fotografia não confirma a identificação para consumo.';
  e.referencias = [...new Set([...(e.referencias || [e.fonte]), ...referencias.map(addFonte), addFonte(nhs), addFonte(e.grupo === 'Estudo' ? nccih : rhs)])];
 }
}
