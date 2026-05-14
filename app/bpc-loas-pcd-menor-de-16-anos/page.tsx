'use client'

import Model from "@/libs/model"
import { FormHelper, labelToName } from "@/libs/form-support"
import { calculateAge, formatTextBasedOnAge, parseDescriptionWithCondition } from "@/libs/age"
import { useSearchParams } from 'next/navigation'

let quesitoConclusivo = true

function interview(Frm: FormHelper) {
  const age = Frm.data.dataDeNascimento ? calculateAge(Frm.data.dataDeNascimento) : '0 ano'

  const oEscolaridade = [
    '',
    'Não Frequenta Creche (< 3 anos)',
    'Frequenta Creche (< 3 anos)',
    'Não Frequenta a Escola (> 3 e < 17 anos)',
    'Educação Infantil (> 3 e < 7 anos)',
    'Ensino Fundamental - 1º ano (> 6 anos)',
    'Ensino Fundamental - 2º ano (> 6 anos)',
    'Ensino Fundamental - 3º ano (> 6 anos)',
    'Ensino Fundamental - 4º ano (> 6 anos)',
    'Ensino Fundamental - 5º ano (> 6 anos)',
    'Ensino Fundamental - 6º ano (> 10 anos)',
    'Ensino Fundamental - 7º ano (> 10 anos)',
    'Ensino Fundamental - 8º ano (> 10 anos)',
    'Ensino Fundamental - 9º ano (> 10 anos)',
    'Ensino Médio - 1ª série (> 14 anos)',
    'Ensino Médio - 2ª série (> 14 anos)',
    'Ensino Médio - 3ª série (> 14 anos)',
    'Curso Técnico (> 14 anos)',
    'Ensino Superior (> 17 anos)',
    'Mestrado (> 17 anos)',
    'Doutorado (> 17 anos)',
  ].filter(i => parseDescriptionWithCondition(age, i).valid).map(i => parseDescriptionWithCondition(age, i).text).map((i) => ({ id: `${i}`, name: i }))
  const oAlfabetizacao = [
    '',
    'Não É Alfabetizado(a)',
    'É Alfabetizado(a)'
  ].filter(i => parseDescriptionWithCondition(age, i).valid).map(i => parseDescriptionWithCondition(age, i).text).map((i) => ({ id: `${i}`, name: i }))

  const oSexo = [
    '',
    'Masculino',
    'Feminino'
  ].filter(i => parseDescriptionWithCondition(age, i).valid).map(i => parseDescriptionWithCondition(age, i).text).map((i) => ({ id: `${i}`, name: i }))

    const oJustificativa = [
    'Não foram observadas alterações ou as alterações no domínio como um todo são mínimas [de 0 a 4%]',
    'Ausência de elementos de convicção para qualificar'
  ].filter(i => parseDescriptionWithCondition(age, i).valid).map(i => parseDescriptionWithCondition(age, i).text).map((i) => ({ id: `${i}`, name: i }))

  const oFuncoesMentais = [
    '47. Funções da consciência (vigília, obnubilação, coma, estado vegetativo, estado de alerta, delírio, entre outros, entre outras), de forma compatível com a faixa etária - b110',
    '48. Funções da orientação (conhecimento e determinação da relação da pessoa consigo própria, com outras pessoas, objetos, espaço, tempo e/ou ambiente, entre outras), de forma compatível com a faixa etária - b114 (> 6 meses)',
    '49. Funções intelectuais (várias funções mentais integradas, incluindo as funções cognitivas e seu desenvolvimento ao longo da vida. Verificar: deficiência intelectual, transtorno mental, demência, entre outras), de forma compatível com a faixa etária - b117 (> 6 meses)',
    '50. Funções psicossociais globais (habilidades interpessoais necessárias para o estabelecimento de interações sociais recíprocas, em termos de significado e finalidade, interações interpessoais, entre outras), de forma compatível com a faixa etária - b122, b125 (> 1 ano)',
    '51. Funções do temperamento e personalidade (extroversão, introversão, amabilidade, responsabilidade, estabilidade psíquica e emocional, abertura e busca para novas experiências, otimismo, confiança, confiabilidade, entre outras), de forma compatível com a faixa etária - b126 (> 5 anos)',
    '52. Funções da energia e de impulsos (nível de energia, motivação, apetite, desejo intenso/dependência, controle de impulsos, entre outras), de forma compatível com a faixa etária - b130 (> 5 anos)',
    '53. Funções do sono (início, manutenção, quantidade e qualidade do sono), de forma compatível com a faixa etária - b134',
    '54. Funções da atenção (concentração, distração e distúrbios da atenção), de forma compatível com a faixa etária - b140 (> 6 meses)',
    '55. Funções da memória (distúrbios da memória recente, remota e amnésica), de forma compatível com a faixa etária - b144 (> 3 anos)',
    '56. Funções psicomotoras (atraso psicomotor, controle e coordenação de partes do corpo, marcha, postura, ecolalia, ecopraxia, excitação, agitação, catatonia, negativismo, ambivalência, convulsão epiléptica, entre outras), de forma compatível com a faixa etária - b147 (> 3 meses)',
    '57. Funções da emoção (funções mentais específicas relacionadas com a adequação, regulação e amplitude da emoção, tristeza, medo, raiva, ódio, tensão, ansiedade, apatia afetiva, labilidade emocional, depressão, entre outras), de forma compatível com a faixa etária - b152 (> 7 anos)',
    '58. Funções da percepção (reconhecimento e interpretação de estímulos sensoriais envolvendo a audição, visão, olfato, paladar e/ou tato e posição de objetos em relação a si e ao ambiente, como em alucinações ou ilusões, entre outras), de forma compatível com a faixa etária - b156  (> 3 meses)',
    '59. Funções do pensamento (delírios, obsessões, compulsões, bloqueio, incoerência, fuga de ideias, entre outras), de forma compatível com a faixa etária - b160 (> 7 anos)',
    '60. Funções cognitivas básicas (conhecimento sobre objetos, eventos e experiências, entre outras, e organização/aplicação deste conhecimento em tarefas que requerem atividade mental), de forma compatível com a faixa etária - b163 (> 3 anos)',
    '61. Funções cognitivas superiores (pensamento abstrato, organização de ideias, tomada de decisão, planejamento e execução, julgamento, flexibilidade mental, autoconhecimento, entre outras), de forma compatível com a faixa etária - b164 (> 10 anos)',
    '62. Funções mentais da linguagem (recepção e expressão de linguagem gestual, decodificação e produção de mensagens de gestos feitos pelas mãos e outros movimentos, entre outras), de forma compatível com a faixa etária - b167 (> 2 anos)',
    '63. Funções de cálculo (funções de operações matemáticas simples - adição, subtração, multiplicação e divisão e complexas, procedimentos aritméticos, com fórmulas matemáticas, entre outras), de forma compatível com a faixa etária - b172 (> 7 anos)',
    '64. Funções da experiência pessoal e de tempo (consciência da própria identidade, representação e consciência do corpo, duração e passagem do tempo, entre outras), de forma compatível com a faixa etária - b180 (> 3 anos)',
    ' Qualificador do domínio X-b1',
  ].filter(i => parseDescriptionWithCondition(age, i).valid).map(i => parseDescriptionWithCondition(age, i).text).map((i) => ({ label: i, name: `${labelToName(i, 'mentais')}` }))

  const oFuncoesSensoriaisDaVisao = [
    '65. Funções da visão (qualidade, acuidade, percepção de luz e cor, visão monocular e binocular, miopia, hipermetropia, astigmatismo, hemianopsia, presbiopia, cegueira de cores, visão em túnel, escotoma central e periférico, diplopia, cegueira noturna e adaptabilidade à luz, entre outras), de forma compatível com a faixa etária  - b210',
    '66. Funções das estruturas adjacentes ao olho (funções da acomodação, reflexo pupilar, funções da pálpebra, nistagmo, movimentos voluntários, movimentos de rastreamento, fixação do olho, estrabismo, funções das glândulas e canal lacrimonasal, entre outras), de forma compatível com a faixa etária - b215',
    '67. Sensações associadas ao olho e estruturas adjacentes (pressão, cansaço, ressecamento, prurido, irritação, queimação, entre outras), de forma compatível com a faixa etária - b220',
    ' Qualificador do domínio XI-b2',
  ].filter(i => parseDescriptionWithCondition(age, i).valid).map(i => parseDescriptionWithCondition(age, i).text).map((i) => ({ label: i, name: `${labelToName(i, 'visao')}` }))

  const oFuncoesSensoriaisDaAudicao = [
    '68. Funções auditivas (detecção, discriminação e localização do som e da fala, insuficiência e perda da audição, entre outras), de forma compatível com a faixa etária - b230',
    '69. Funções vestibulares (determinação da posição, equilíbrio e movimentação do corpo, entre outras), de forma compatível com a faixa etária - b235',
    '70. Sensações associadas à audição e à função vestibular (tontura, sensação de queda, vibração, vertigem, zumbido, irritação e pressão auricular, entre outras), de forma compatível com a faixa etária - b240',
    ' Qualificador do domínio XII-b2',
  ].filter(i => parseDescriptionWithCondition(age, i).valid).map(i => parseDescriptionWithCondition(age, i).text).map((i) => ({ label: i, name: `${labelToName(i, 'audicao')}` }))

  const oFuncoesSensoriaisAdicionaisEDor = [
    '71. Funções gustativas e olfativas, de forma compatível com a faixa etária - b250 / b255 (> 1 ano)',
    '72. Funções proprioceptivas (percepção da posição relativa de partes do corpo), de forma compatível com a faixa etária - b260 (> 1 ano)',
    '73. Função tátil (anestesia, parestesia, formigamento, hipoestesia, hiperestesia, entre outras) e funções sensoriais relacionadas à temperatura e outros estímulos (sensibilidade à temperatura, vibração, tremor ou oscilação, pressão superficial ou profunda, ardor, entre outras), de forma compatível com a faixa etária - b265 / b270 (> 6 meses)',
    '74.  Sensação de dor (dor generalizada ou localizada em uma ou mais parte do corpo, analgesia, hipoalgesia, hiperalgesia, entre outras), de forma compatível com a faixa etária - b280',
    ' Qualificador do domínio XIII-b2',
  ].filter(i => parseDescriptionWithCondition(age, i).valid).map(i => parseDescriptionWithCondition(age, i).text).map((i) => ({ label: i, name: `${labelToName(i, 'adicionais')}` }))

  const oFuncoesDaVozEDaFala = [
    '75. Funções da voz (produção e qualidade da voz, disfonia, afonia, rouquidão, hiponasalidade, hipernasalidade, entre outras), de forma compatível com a faixa etária - b310',
    '76. Funções da articulação (produção de sons da fala, disartria, anartria, articulação de fonemas, entre outras), de forma compatível com a faixa etária - b320 (> 1 ano)',
    '77.  Funções da fluência e ritmo da fala (alterações na fluência, gagueira, verborreia, dislalia - taquilalia, bradilalia, entre outras), de forma compatível com a faixa etária - b330 (> 2 anos)',
    ' Qualificador do domínio XIV-b3',
  ].filter(i => parseDescriptionWithCondition(age, i).valid).map(i => parseDescriptionWithCondition(age, i).text).map((i) => ({ label: i, name: `${labelToName(i, 'voz')}` }))

  const oFuncoesDoSistemaCardiovascular = [
    '78. Funções do coração (ritmo, frequência, contratilidade, insuficiência, isquemia, bloqueio, valvulopatias, miocardiopatias), de forma compatível com a faixa etária - b410',
    '79. Funções dos vasos sanguíneos (valvulares, arteriais, venosas e capilares; inclui alterações decorrentes de varizes, aterosclerose, aneurismas, entre outras), de forma compatível com a faixa etária - b415',
    '80. Funções da pressão sanguínea (hipotensão, hipertensão), de forma compatível com a faixa etária - b420',
    ' Qualificador do domínio XV-b4',
  ].filter(i => parseDescriptionWithCondition(age, i).valid).map(i => parseDescriptionWithCondition(age, i).text).map((i) => ({ label: i, name: `${labelToName(i, 'cardiovascular')}` }))

  const oFuncoesDoSistemaHematologico = [
    '81. Funções da produção de sangue, da medula óssea, do baço, do transporte de oxigênio e metabólitos (anemias, linfomas, leucemias, mielodisplasias, aplasia medular, mieloma múltiplo, trombastenia,  hemoglobinúrias, doença falciforme, talassemias, coagulopatias, entre outras), de forma compatível com a faixa etária - b430',
    ' Qualificador do domínio XVI-b4',
  ].filter(i => parseDescriptionWithCondition(age, i).valid).map(i => parseDescriptionWithCondition(age, i).text).map((i) => ({ label: i, name: `${labelToName(i, 'hematologico')}` }))

  const oFuncoesDoSistemaImunologico = [
    '82. Funções do sistema imunológico (alterações imunológicas mediadas por células ou por anticorpos, doença autoimune, imunossupressão medicamentosa e/ou em decorrência de outras morbidades, incluindo  CÂNCER, reações alérgicas, respostas a imunizações, alterações no sistema linfático, linfadenites, linfedema, entre outras), de forma compatível com a faixa etária - b435',
    ' Qualificador do domínio XVII-b4',
  ].filter(i => parseDescriptionWithCondition(age, i).valid).map(i => parseDescriptionWithCondition(age, i).text).map((i) => ({ label: i, name: `${labelToName(i, 'imunologico')}` }))

  const oFuncoesDoSistemaRespiratorio = [
    '83. Funções respiratórias - frequência, ritmo, profundidade e dificuldades (dispneia, taquipneia, respiração irregular, espasmo brônquico, enfisema pulmonar, entre outras), de forma compatível com a faixa etária - b440',
    ' Qualificador do domínio XVIII-b4',
  ].filter(i => parseDescriptionWithCondition(age, i).valid).map(i => parseDescriptionWithCondition(age, i).text).map((i) => ({ label: i, name: `${labelToName(i, 'respiratorio')}` }))

  const oFuncoesDoSistemaDigestivo = [
    '84. Funções de ingestão (sucção, mordedura, mastigação, mobilização de alimentos na boca, salivação, deglutição, regurgitação, vômito, entre outras), de forma compatível com a faixa etária - b510',
    '85. Funções digestivas (peristalse, degradação dos alimentos, absorção dos nutrientes, tolerância aos alimentos, entre outras), de forma compatível com a faixa etária - b515',
    '86. Funções da defecação (consistência, frequência e continência fecal, flatulência, entre outras), de forma compatível com a faixa etária - b525',
    '87. Funções de manutenção de peso (baixo peso, caquexia, emaciação, obesidade, entre outras), de forma compatível com a faixa etária -  b530',
    ' Qualificador do domínio XIX-b5',
  ].filter(i => parseDescriptionWithCondition(age, i).valid).map(i => parseDescriptionWithCondition(age, i).text).map((i) => ({ label: i, name: `${labelToName(i, 'digestivo')}` }))

  const oFuncoesDosSistemasMetabolicoEEndocrino = [
    '88. Funções metabólicas gerais (metabolismo basal, metabolismo de carboidratos, de proteínas ou gorduras, incluindo lipodistrofia, entre outras), de forma compatível com a faixa etária - b540',
    '89. Funções de equilíbrio hídrico, mineral e eletrolítico, de forma compatível com a faixa etária - b545',
    '90. Funções das glândulas endócrinas, inclusive as associadas à puberdade (hipo ou hiperpituitarismo, hipo ou hipertireoidismo, hipo ou hiperparatireoidismo, hipo ou hipergonadismo, nanismo, gigantismo, entre outras), de forma compatível com a faixa etária - b555 / b560',
    ' Qualificador do domínio XX-b5',
  ].filter(i => parseDescriptionWithCondition(age, i).valid).map(i => parseDescriptionWithCondition(age, i).text).map((i) => ({ label: i, name: `${labelToName(i, 'metabolico')}` }))

  const oFuncoesGeniturinariasEReprodutivas = [
    '91. Funções relacionadas à filtração ou eliminação da urina (insuficiência renal, anúria, oligúria, hidronefrose, bexiga hipotônica, obstrução do ureter, entre outras), de forma compatível com a faixa etária - b610',
    '92. Funções urinárias (frequência de micção, continência, urgência, retenção, fluxo excessivo, poliúria, entre outras), de forma compatível com a faixa etária - b620',
    '93. Função reprodutiva (funções sexuais, funções da menstruação, incluindo endometriose, funções de procriação, entre outras), de forma compatível com a faixa etária  - b640 / b650 / b660',
    ' Qualificador do domínio XXI-b6',
  ].filter(i => parseDescriptionWithCondition(age, i).valid).map(i => parseDescriptionWithCondition(age, i).text).map((i) => ({ label: i, name: `${labelToName(i, 'geniturinarias')}` }))

  const oFuncoesNeuromusculoesqueleticasERelacionadasAoMovimento = [
    '94. Funções das articulações e/ou dos ossos (mobilidade das articulações e dos ossos), de forma compatível com a faixa etária - b710 / b715 / b720',
    '95. Funções musculares (relacionadas à força, ao tônus e à resistência muscular), de forma compatível com a faixa etária - b730 / b735 / b740',
    '96. Funções dos movimentos (relacionadas aos reflexos motores e dos movimentos involuntários, controle voluntário e involuntário), de forma compatível com a faixa etária - b750 / b755 / b760 / b761 / b765',
    '97. Funções relacionadas ao padrão da marcha (deficiências como marcha espástica, hemiplégica, paraplégica, entre outras), de forma compatível com a faixa etária - b770',
    ' Qualificador do domínio XXII-b7',
  ].filter(i => parseDescriptionWithCondition(age, i).valid).map(i => parseDescriptionWithCondition(age, i).text).map((i) => ({ label: i, name: `${labelToName(i, 'neuromusculoesqueleticas')}` }))

  const oFuncoesDaPeleEEstruturasRelacionadas = [
    '98. Funções protetoras, reparadoras e outras funções da pele e fâneros (pênfigo, psoríase, hanseníase, neurofibromatose, dermatite de contato, albinismo, vitiligo, escalpelamento, queimaduras, entre outras), de forma compatível com a faixa etária - b810 / b820 / b830 / b840 / b850',
    ' Qualificador do domínio XXIII-b8',
  ].filter(i => parseDescriptionWithCondition(age, i).valid).map(i => parseDescriptionWithCondition(age, i).text).map((i) => ({ label: i, name: `${labelToName(i, 'pele')}` }))

  const oAprendizagemEAplicacaoDoConhecimento = [
    '99. Dificuldade para utilizar intencionalmente o sentido da visão (seguir objeto visualmente, observar pessoas, assistir a evento esportivo, observar pessoas, entre outras), de forma compatível com a faixa etária - d110 (> 1 ano)',
    '100. Dificuldade para utilizar intencionalmente o sentido da audição (ouvir rádio, música, voz humana, entre outras), de forma compatível com a faixa etária - d115 (> 6 meses)',
    '101. Dificuldade em percepções sensoriais intencionais de tato, paladar e olfato (tocar ou sentir texturas, saborear e sentir cheiros, entre outras), de forma compatível com a faixa etária - d120 (> 6 meses)',
    '102. Dificuldade para imitar ou copiar algo que configure aprendizagem básica (imitar, aprender brincando, copiar um gesto, som ou letras, jogos simbólicos ou “faz de conta”, entre outras situações simples), de forma compatível com a faixa etária - d130 / d131 (> 6 meses)',
    '103. Dificuldade para adquirir linguagem para representar pessoas, objetos, eventos, acontecimentos, sentimentos, por meio de palavras, símbolos, expressões, frases ou gestos, de forma compatível com a faixa etária - d133 / d134 (> 2 anos)',
    '104. Dificuldade para adquirir conceitos sobre tamanho, forma, quantidade, comprimento, igual/diferente, grande/pequeno, esquerdo/direito, de forma compatível com a faixa etária - d137 (> 3 anos)',
    '105. Dificuldade para aprender a ler e utilizar este conhecimento (ler, compreendendo o significado de vocábulos, frases e textos, inclusive em Braille, quando for o caso), de forma compatível com a faixa etária - d140 / d166 (> 6 anos)',
    '106. Dificuldade para aprender a escrever e utilizar este conhecimento (escrever, compreendendo o significado de vocábulos, frases e textos, inclusive em Braille, quando for o caso), de forma compatível com a faixa etária - d145 / d170 (> 6 anos)',
    '107. Dificuldade para aprender a calcular e aplicar este conhecimento (calcular, compreendendo o significado de símbolos e operações matemáticas), de forma compatível com a faixa etária - d150 / d172 (> 6 anos)',
    '108. Dificuldade para adquirir e executar habilidades básicas (usar talheres, lápis, entre outras) e complexas (jogos, esportes, utilizar ferramentas, relógio, entre outras), de forma compatível com a faixa etária - d155 (> 2 anos)',
    '109.  Dificuldade para concentrar a atenção, encontrar solução para problemas simples e complexos e tomar decisões, de forma compatível com a faixa etária - d160 / d175 / d177 (> 7 anos)',
    ' Qualificador do domínio d1',
  ].filter(i => parseDescriptionWithCondition(age, i).valid).map(i => parseDescriptionWithCondition(age, i).text).map((i) => ({ label: i, name: `${labelToName(i, 'aprendizagem')}` }))

  const oTarefasEDemandasGerais = [
    '110. Dificuldade para realizar uma única tarefa ou atender a um único comando (preensão palmar voluntária, pegar voluntariamente um objeto, entre outras), de forma compatível com a faixa etária - d210 (> 6 meses)',
    '111. Dificuldade para realizar tarefas múltiplas, atender a comandos múltiplos, realizar a rotina diária, de forma independente ou a comando de outros, de forma compatível com a faixa etária - d220/ d230 (> 7 anos)',
    '112. Dificuldade para gerenciar o próprio comportamento e emoções frente a determinadas demandas, de forma coerente e compatível com a faixa etária (considerar se a autorrepresentação da deficiência aumenta essa dificuldade) - d250 (> 7 anos)',
    ' Qualificador do domínio d2',
  ].filter(i => parseDescriptionWithCondition(age, i).valid).map(i => parseDescriptionWithCondition(age, i).text).map((i) => ({ label: i, name: `${labelToName(i, 'tarefa')}` }))

  const oComunicacao = [
    '113. Dificuldade na recepção de mensagens orais (compreender o significado de uma frase), de forma compatível com a faixa etária - d310 (> 1 ano)',
    '114. Dificuldade na recepção de mensagens não verbais (transmitidas por gestos, símbolos, fotos, desenhos e expressões faciais, leitura labial), de forma compatível com a faixa etária - d315 (> 2 anos)',
    '115. Dificuldade na recepção e compreensão de mensagens na Língua Brasileira de Sinais (LIBRAS), de forma compatível com a faixa etária - d320 (> 7 anos)',
    '116. Dificuldade na recepção e compreensão de mensagens escritas ou mensagens em braile (revistas, livros, jornais e outros), de forma compatível com a faixa etária - d325 (> 7 anos)',
    '117. Dificuldade na fala (produção de sílabas, palavras, frases ou mensagens compreensíveis), de forma compatível com a faixa etária - d330 (> 1 ano)',
    '118. Dificuldade na produção de mensagens não verbais (usar gestos, símbolos ou desenhos para se comunicar), de forma compatível com a faixa etária - d335 (> 1 ano)',
    '119. Dificuldade na produção de mensagens na Língua Brasileira de Sinais (LIBRAS), de forma compatível com a faixa etária - d340 (> 7 anos)',
    '120. Dificuldade na conversação (iniciar, manter e finalizar uma troca de pensamentos e ideias, usando qualquer forma de linguagem), de forma compatível com a faixa etária - d350 (> 3 anos)',
    ' Qualificador do domínio d3',
  ].filter(i => parseDescriptionWithCondition(age, i).valid).map(i => parseDescriptionWithCondition(age, i).text).map((i) => ({ label: i, name: `${labelToName(i, 'comunicacao')}` }))

  const oMobilidade = [
    '121. Dificuldade para mudar a posição básica do corpo (levantar, ajoelhar, agachar, deitar e/ou rolar), de forma compatível com a faixa etária - d410 (> 6 meses)',
    '122. Dificuldade para se mover na mesma superfície ou de uma superfície para outra, sem mudar a posição do corpo (ex. de deitado para deitado, de sentado para sentado), de forma compatível com a faixa etária - d420 (> 3 anos)',
    '123. Dificuldade para manusear, mover, deslocar e/ou carregar objetos, realizando movimentos finos, de forma compatível com a faixa etária - d430 / d435 / d440 / d445 (> 6 meses)',
    '124. Dificuldade para andar (mover-se a pé, por curtas ou longas distâncias, sem auxílio de pessoas, equipamentos ou dispositivos), de forma compatível com a faixa etária - d450 (> 2 anos)',
    '125. Dificuldade para se deslocar utilizando equipamento ou dispositivo específico para facilitar a movimentação (andador, cadeira de rodas, muletas, bengala e outros), de forma compatível com a faixa etária - d465 (> 3 anos)',
    ' Qualificador do domínio d4',
  ].filter(i => parseDescriptionWithCondition(age, i).valid).map(i => parseDescriptionWithCondition(age, i).text).map((i) => ({ label: i, name: `${labelToName(i, 'mobilidade')}` }))

  const oCuidadoPessoal = [
    '126. Dificuldade nos cuidados com o próprio corpo (lavar, secar, cuidar das mãos, dentes, unhas, nariz, cabelos e/ou higiene após excreção), de forma compatível com a faixa etária - d510/ d520/ d530 (> 5 anos)',
    '127. Dificuldade para se vestir (colocar, tirar e escolher roupas e calçados apropriados), de forma compatível com a faixa etária - d540 (> 3 anos)',
    '128. Dificuldade para coordenar os gestos para comer, beber alimentos e bebidas servidos, sem auxílio, de forma compatível com a faixa etária - d550/ d560 (> 3 anos)',
    '129. Dificuldade para evitar exposição a riscos ou situações perigosas, incluindo abusos e violência, de forma compatível com a faixa etária - d571 (> 7 anos)',
    ' Qualificador do domínio d5',
  ].filter(i => parseDescriptionWithCondition(age, i).valid).map(i => parseDescriptionWithCondition(age, i).text).map((i) => ({ label: i, name: `${labelToName(i, 'cuidado')}` }))

  const oQualificador = "0;1;2;3;4".split(';').map((i) => ({ id: `${i}`, name: i }))
  const oTotalParcial = "T;P".split(';').map((i) => ({ id: `${i}`, name: i }))
  const oNivel = "Grau A;Grau B;Grau C;Grau D".split(';').map((i) => ({ id: `${i.split(' ')[1]}`, name: i }))
  const oAtividadeFisica = [
    'Mudar e manter a posição do corpo (> 6 meses e < 7 anos)',
    'Ficar em pé e andar (> 1 e < 7 anos)',
    'Fazer caminhadas (> 7 anos)',
    'Permanecer em pé (> 7 anos)',
    'Subir e descer escadas (> 3 anos)',
    'Abaixar ou agachar (> 3 anos)',
    'Erguer peso (> 3 anos)',
    'Atividades com esforço físico e cardiorrespiratório (> 3 anos)',
  ].filter(i => parseDescriptionWithCondition(age, i).valid).map(i => parseDescriptionWithCondition(age, i).text).map((i) => ({ label: i, name: `${labelToName(i, 'atividades')}` }))

  const oAutoCuidado = [
    'Desenvolvimento neuropsicomotor (< 7 anos)',
    'Levar alimento à boca (> 10 meses e < 3 anos)',
    'Reconhecer e reagir a sons (< 7 anos)',
    'Orientação e percepção sensorial (> 3 e < 7 anos)',
    'Aceitar e negar o que lhe é oferecido (< 7 anos)',
    'Higiene pessoal (> 3 anos)',
    'Alimentar-se e beber (> 3 anos)',
    'Preparar alimentos simples (> 12 anos e < 17 anos)',
    'Preparar as próprias refeições (> 17 anos)',
    'Limpar a casa e/ou cômodo onde dorme (> 12 anos)',
    'Ficar sozinho(a) sem produzir riscos para si (> 12 anos)',
    'Organizar atividades domésticas, cuidado da casa, compras e pagamento de contas (> 17 anos)',
    'Cuidar de terceiros (> 17 anos)',
  ].filter(i => parseDescriptionWithCondition(age, i).valid).map(i => parseDescriptionWithCondition(age, i).text).map((i) => ({ label: i, name: `${labelToName(i, 'cuidados')}` }))

  const oRelacoes = [
    'Expectativa de aprendizagem futura (< 3 anos)',
    'Possibilidade de frequentar creche sem AEE - atendimento educacional especializado (< 3 anos)',
    'Atenção/Concentração em objetos e pessoas (> 6 meses e < 3 anos)',
    'Desenvolvimento da fala e linguagem (> 1 ano e < 3 anos)',
    'Interação com crianças e adultos no âmbito familiar e espaços sociais (> 1 e < 7 anos)',
    'Fala/Comunicação/Desenvolvimento da linguagem (> 3 e < 7 anos)',
    'Aprendizagem e aquisição de conceitos esperados para sua faixa etária (> 3 e < 7 anos)',
    'Frequentar educação infantil (> 3 e < 7 anos)',
    'Participar de atividades recreativas, esportivas e pedagógicas em grupo (> 3 e < 7 anos)',
    'Atenção/Concentração em objetos e pessoas (> 3 e < 7 anos)',
    'Ouvir (> 7 anos)',
    'Falar (> 7 anos)',
    'Orientar-se espacialmente e no tempo (> 7 anos)',
    'Juízo Crítico e capacidade de tomar decisões, inclusive sob estresse (> 7 anos)',
    'Frequentar estabelecimento de ensino e aprendizagem (> 7 e < 17 anos)',
    'Ler, escrever, fazer operações matemáticas e envolvendo raciocínio abstrato (> 7 e < 17 anos)',
    'Atenção e concentração nos estudos (> 7 e < 17 anos)',
    'Estabelecer interações interpessoais familiares, sociais (> 7 e < 17 anos)',
    'Utilizar transporte público (> 12 anos)',
    'Possibilidade de ingressar em estágio ou programas destinados a menor aprendiz (> 14 e < 17 anos)',
    'Compreender e ser compreendido (> 17 anos)',
    'Concentrar-se para a execução de tarefas (> 17 anos)',
    'Estabelecer interações interpessoais familiares, sociais e profissionais (> 17 anos)',
    'Possibilidade de se colocar no mercado de trabalho (> 17 anos)',
  ].filter(i => parseDescriptionWithCondition(age, i).valid).map(i => parseDescriptionWithCondition(age, i).text).map((i) => ({ label: i, name: `${labelToName(i, 'relacoes')}` }))

  let labelAlfabetizacao = parseDescriptionWithCondition(age, 'Alfabetização (> 6 anos)').textOrNull
  if (['Ensino Médio - 1ª série',
    'Ensino Médio - 2ª série',
    'Ensino Médio - 3ª série',
    'Curso Técnico',
    'Ensino Superior',
    'Mestrado',
    'Doutorado',
  ].includes(Frm.data.escolaridade)) {
    labelAlfabetizacao = null
  }

  return <>
    <Frm.Input label="Nome" name="nome" width={8} />
    {/* <Frm.Input label="Idade" name="idade" width={3} /> */}
    <Frm.DatePicker label="Data de Nascimento" name="dataDeNascimento" addAge={true} width={4} />
    <Frm.CPFInput label="CPF" name="cpf" width={4} />
    <Frm.Select label="Sexo" name="sexo" options={oSexo} width={4} />
    <Frm.Input label="Peso" name="peso" width={4} />
    <Frm.Input label="Altura" name="altura" width={4} />
    <Frm.Select label="Escolaridade" name="escolaridade" options={oEscolaridade} width={4} />
    <Frm.Select label={labelAlfabetizacao} name="alfabetizacao" options={oAlfabetizacao} width={4} />
    <Frm.Input label={parseDescriptionWithCondition(age, 'Outras informações sobre Escolaridade que o perito(a) considerar relevantes (> 7 anos)').textOrNull} name="outrasInformacoesSobreEscolaridade" width={12} />

    <Frm.TextArea label="História Clínica: Considerar todos os elementos relevantes da história clínica atual e pregressa, que darão subsídios para a avaliação e qualificação dos domínios abaixo relacionados, incluindo relatórios e laudos técnicos, prontuários e resultados de exames complementares, quando houver" name="historicoClinico" width={12} />
    <Frm.TextArea label="Informações de exames e laudos apresentados" name="exemesELaudos" width={12} />
    <Frm.TextArea label="Exame físico: Considerar as alterações relevantes observadas ao exame físico, que darão subsídios para a avaliação e qualificação dos domínios abaixo relacionados" name="exameFisico" width={12} />

    <Frm.TextArea label="Patologia(s) ou sequela(s) que acomete(m) a parte autora: Mencionar a(s) CID(s) indicando os documentos médicos que a comprovam" name="patologia" width={12} />
    <Frm.TextArea label="Resumo da História Clínica / Anamnese" name="anamnese" width={12} />
    <Frm.TextArea label="Informações de exames e laudos apresentados" name="examesELaudos" width={12} />

    <Frm.Input label="CID Principal (campo obrigatório)" name="cidPrincipal" width={8} />
    <Frm.Input label="Código CID" name="codigoCidPrincipal" width={4} />
    <Frm.Input label="CID Secundário (1)" name="cidSecundario" width={8} />
    <Frm.Input label="Código CID" name="codigoCidSecundario" width={4} />
    <Frm.Input label="CID Secundário (2)" name="cidSecundario2" width={8} />
    <Frm.Input label="Código CID" name="codigoCidSecundario2" width={4} />

    <div className="col col-12 mt-3">
      <h4>Funções do Corpo</h4>
    </div>

    <div className="col col-12 mt-3">
      <p>Qualificadores a serem utilizados: </p>
      <ul>
        <li>0 - Nenhuma: alteração de 0% a 4%;</li>
        <li>1 - Leve: alteração de 5% a 24%;</li>
        <li>2 - Moderada: alteração de 25% a 49%;</li>
        <li>3 - Grave: alteração de 50% a 95%;</li>
        <li>4 - Completa: alteração de 96% a 100%;</li>
      </ul>
    </div>

    <Frm.RadioButtonsTable label="X - FUNÇÕES MENTAIS - b1: referem-se às funções do cérebro, que incluem funções mentais globais, como consciência, energia e impulso, e funções mentais específicas, como memória, linguagem e cálculo." labelsAndNames={oFuncoesMentais} options={oQualificador} width={12} />
    {Frm.data.qualificadorDoDominioXb1 === '0' && <Frm.Select label="Justifique a atribuição de qualificador '0' para esse domínio" name="qualificadorDoDominioXb1Justificativa" options={oJustificativa} width={12} />}    
    <Frm.RadioButtonsTable label="XI - FUNÇÕES SENSORIAIS DA VISÃO - b2: referem-se à percepção de luz, tamanho e cor de um estímulo visual. Indicadores = discriminados nas unidades de classificação abaixo, entre parênteses." labelsAndNames={oFuncoesSensoriaisDaVisao} options={oQualificador} width={12} />
    {Frm.data.qualificadorDoDominioXIb2 === '0' && <Frm.Select label="Justifique a atribuição de qualificador '0' para esse domínio" name="qualificadorDoDominioXIb2Justificativa" options={oJustificativa} width={12} />}    
    <Frm.RadioButtonsTable label="XII - FUNÇÕES SENSORIAIS DA AUDIÇÃO - b2: referem-se à percepção de sons e discriminação de localização, intensidade, ruído e qualidade." labelsAndNames={oFuncoesSensoriaisDaAudicao} options={oQualificador} width={12} />
    {Frm.data.qualificadorDoDominioXIIb2 === '0' && <Frm.Select label="Justifique a atribuição de qualificador '0' para esse domínio" name="qualificadorDoDominioXIIb2Justificativa" options={oJustificativa} width={12} />}    
    <Frm.RadioButtonsTable label="XIII - FUNÇÕES SENSORIAIS ADICIONAIS E DOR - b2: referem-se às funções gustativas, olfativas, proprioceptivas, táteis e a sensações relacionadas à temperatura e outros estímulos e sensação de dor." labelsAndNames={oFuncoesSensoriaisAdicionaisEDor} options={oQualificador} width={12} />
    {Frm.data.qualificadorDoDominioXIIIb2 === '0' && <Frm.Select label="Justifique a atribuição de qualificador '0' para esse domínio" name="qualificadorDoDominioXIIIb2Justificativa" options={oJustificativa} width={12} />}    
    <Frm.RadioButtonsTable label="XIV - FUNÇÕES DA VOZ E DA FALA - b3: referem-se à produção de sons e da fala." labelsAndNames={oFuncoesDaVozEDaFala} options={oQualificador} width={12} />
    {Frm.data.qualificadorDoDominioXIVb3 === '0' && <Frm.Select label="Justifique a atribuição de qualificador '0' para esse domínio" name="qualificadorDoDominioXIVb3Justificativa" options={oJustificativa} width={12} />}    
    <Frm.RadioButtonsTable label="XV - FUNÇÕES DO SISTEMA CARDIOVASCULAR - b4: referem-se às funções do coração, vasos sanguíneos e pressão sanguínea." labelsAndNames={oFuncoesDoSistemaCardiovascular} options={oQualificador} width={12} />
    {Frm.data.qualificadorDoDominioXVb4 === '0' && <Frm.Select label="Justifique a atribuição de qualificador '0' para esse domínio" name="qualificadorDoDominioXVb4Justificativa" options={oJustificativa} width={12} />}    
    <Frm.RadioButtonsTable label="XVI - FUNÇÕES DO SISTEMA HEMATOLÓGICO - b4:  referem-se à produção de sangue, transporte de oxigênio e metabólitos e à coagulação." labelsAndNames={oFuncoesDoSistemaHematologico} options={oQualificador} width={12} />
    {Frm.data.qualificadorDoDominioXVIb4 === '0' && <Frm.Select label="Justifique a atribuição de qualificador '0' para esse domínio" name="qualificadorDoDominioXVIb4Justificativa" options={oJustificativa} width={12} />}    
    <Frm.RadioButtonsTable label="XVII - FUNÇÕES DO SISTEMA IMUNOLÓGICO - b4: referem-se à imunidade celular e humoral e alterações na função do sistema linfático." labelsAndNames={oFuncoesDoSistemaImunologico} options={oQualificador} width={12} />
    {Frm.data.qualificadorDoDominioXVIIb4 === '0' && <Frm.Select label="Justifique a atribuição de qualificador '0' para esse domínio" name="qualificadorDoDominioXVIIb4Justificativa" options={oJustificativa} width={12} />}    
    <Frm.RadioButtonsTable label="XVIII - FUNÇÕES DO SISTEMA RESPIRATÓRIO - b4: referem-se à frequência, ritmo e profundidade da respiração e às funções dos músculos respiratórios." labelsAndNames={oFuncoesDoSistemaRespiratorio} options={oQualificador} width={12} />
    {Frm.data.qualificadorDoDominioXVIIIb4 === '0' && <Frm.Select label="Justifique a atribuição de qualificador '0' para esse domínio" name="qualificadorDoDominioXVIIIb4Justificativa" options={oJustificativa} width={12} />}    
    <Frm.RadioButtonsTable label="XIX - FUNÇÕES DO SISTEMA DIGESTIVO - b5: referem-se à ingestão, digestão e eliminação de substâncias líquidas e sólidas." labelsAndNames={oFuncoesDoSistemaDigestivo} options={oQualificador} width={12} />
    {Frm.data.qualificadorDoDominioXIXb5 === '0' && <Frm.Select label="Justifique a atribuição de qualificador '0' para esse domínio" name="qualificadorDoDominioXIXb5Justificativa" options={oJustificativa} width={12} />}    
    <Frm.RadioButtonsTable label="XX - FUNÇÕES DOS SISTEMAS METABÓLICO E ENDÓCRINO - b5: referem-se às funções metabólicas gerais e das glândulas endócrinas, inclusive as associadas à puberdade." labelsAndNames={oFuncoesDosSistemasMetabolicoEEndocrino} options={oQualificador} width={12} />
    {Frm.data.qualificadorDoDominioXXb5 === '0' && <Frm.Select label="Justifique a atribuição de qualificador '0' para esse domínio" name="qualificadorDoDominioXXb5Justificativa" options={oJustificativa} width={12} />}    
    <Frm.RadioButtonsTable label="XXI - FUNÇÕES GENITURINÁRIAS E REPRODUTIVAS - b6: referem-se às funções urinárias e reprodutivas, incluindo funções sexuais e de procriação." labelsAndNames={oFuncoesGeniturinariasEReprodutivas} options={oQualificador} width={12} />
    {Frm.data.qualificadorDoDominioXXIb6 === '0' && <Frm.Select label="Justifique a atribuição de qualificador '0' para esse domínio" name="qualificadorDoDominioXXIb6Justificativa" options={oJustificativa} width={12} />}    
    <Frm.RadioButtonsTable label="XXII - FUNÇÕES NEUROMUSCULOESQUELÉTICAS E RELACIONADAS AO MOVIMENTO - b7: referem-se à mobilidade, funções das articulações, ossos, reflexos e músculos." labelsAndNames={oFuncoesNeuromusculoesqueleticasERelacionadasAoMovimento} options={oQualificador} width={12} />
    {Frm.data.qualificadorDoDominioXXIIb7 === '0' && <Frm.Select label="Justifique a atribuição de qualificador '0' para esse domínio" name="qualificadorDoDominioXXIIb7Justificativa" options={oJustificativa} width={12} />}    
    <Frm.RadioButtonsTable label="XXIII - FUNÇÕES DA PELE E ESTRUTURAS RELACIONADAS - b8: referem-se a funções da pele e seus anexos (pelos, cabelos e unhas)." labelsAndNames={oFuncoesDaPeleEEstruturasRelacionadas} options={oQualificador} width={12} />
    {Frm.data.qualificadorDoDominioXXIIIb8 === '0' && <Frm.Select label="Justifique a atribuição de qualificador '0' para esse domínio" name="qualificadorDoDominioXXIIIb8Justificativa" options={oJustificativa} width={12} />}    

    <div className="col col-12 mt-3">
      <h4>Atividades e Participação</h4>
    </div>

    <Frm.RadioButtonsTable label="XXVI - APRENDIZAGEM E APLICAÇÃO DE CONHECIMENTO - d1: referem-se ao desempenho em aprender, aplicar o conhecimento aprendido, pensar, resolver problemas e tomar decisões." labelsAndNames={oAprendizagemEAplicacaoDoConhecimento} options={oQualificador} options2={oTotalParcial} width={12} />
    <Frm.RadioButtonsTable label="XXVII - TAREFAS E DEMANDAS GERAIS - d2: referem-se aos aspectos gerais da execução de uma única tarefa ou de várias tarefas, organização de rotinas e superação do estresse." labelsAndNames={oTarefasEDemandasGerais} options={oQualificador} width={12} />
    <Frm.RadioButtonsTable label="XXVIII - COMUNICAÇÃO - d3: refere-se às características gerais e específicas da comunicação, por meio da linguagem, sinais e símbolos, incluindo a recepção e produção de mensagens, manutenção da conversação e utilização de dispositivos e técnicas de comunicação." labelsAndNames={oComunicacao} options={oQualificador} width={12} />
    <Frm.RadioButtonsTable label="XXIX - MOBILIDADE - d4: refere-se ao movimento de mudar o corpo de posição ou de lugar, carregar, mover ou manipular objetos, ao andar ou deslocar-se." labelsAndNames={oMobilidade} options={oQualificador} width={12} />
    <Frm.RadioButtonsTable label="XXX - CUIDADO PESSOAL - d5: refere-se ao cuidado pessoal como lavar-se e secar-se, cuidar do próprio corpo e de parte do corpo, vestir-se, comer, beber e cuidar da própria saúde." labelsAndNames={oCuidadoPessoal} options={oQualificador} width={12} />

    {/*
        <Frm.RadioButtonsTable label="Atividade Física" labelsAndNames={oAtividadeFisica} options={oNivel} width={12} />
    <Frm.RadioButtonsTable label={formatTextBasedOnAge(age, "{Desenvolvimento (< 7 anos)}{Auto Cuidado e Âmbito Doméstico (> 7 anos)}")} labelsAndNames={oAutoCuidado} options={oNivel} width={12} />
    <Frm.RadioButtonsTable label={formatTextBasedOnAge(age, "Relações Interpessoais e Sociais. Aprendizagem. Cognição. {Inserção Profissional. (> 7 anos)}")} labelsAndNames={oRelacoes} options={oNivel} width={12} />

    <div className="col col-12 mt-3">
      <h4>Quesitos Complementares</h4>
    </div>
    <Frm.TextArea label="Caso sejam constatadas limitações (graus B, C ou D) para atividades relacionadas no quadro acima, qual a data de início ou época aproximada em que a obstrução / impedimento / dificuldade passou a interferir na vida do(a) periciando(a)?" name="inicio" width={12} />
    <Frm.TextArea label="Caso sejam constatadas limitações (graus B, C ou D) para atividades relacionadas no quadro acima, é possível afirmar que a obstrução / impedimento / dificuldade irá perdurar por mais de 2 anos? Se menos de 2 anos, qual prognóstico de tempo para reversão?" name="prognosticoReversao" width={12} />
    <Frm.TextArea label="Há outras atividades individuais ou de participação social cotidianas (não elencadas no quadro acima) impactadas por limitações de natureza física, mental, intelectual ou sensorial da parte autora? Caso positivo, especifique e indique os graus (B, C ou D), bem como data de início ou época aproximada em que a obstrução / impedimento / dificuldade passou a interferir na vida do(a) periciando(a). É possível afirmar que irá perdurar por mais de 2 anos? Se menos de 2 anos, qual prognóstico de tempo para reversão?" name="outras" width={12} />
    <Frm.TextArea label="Sobre facilitadores - As alterações em funções e/ou estruturas do corpo podem ser solucionadas / compensadas, em tese, em menos de 2 anos? Como? A parte autora tem efetivo acesso a tecnologias / insumos de saúde facilitadores, que eliminam ou compensem as limitações de natureza física, mental, intelectual ou sensorial impostas pela patologia?" name="facilitadores" width={12} />
    <Frm.TextArea label={formatTextBasedOnAge(age, "{Há necessidade de medicações de uso contínuo e/ou alimentação especial? Há necessidade de comparecimento constante a estabelecimentos de saúde, terapia multidisciplinar, internações? Em caso positivo, tais medicações e/ou tratamentos/internações influenciam de forma significativa sua rotina ou a do(a) adulto(a) responsável pelo cuidado ou apoio? (< 17 anos)}{Há necessidade de medicações de uso contínuo? Em caso positivo, tais medicações influenciam de forma significativa a interação com as demais pessoas e/ou ambiente? (> 17 anos)}{ Há necessidade de assistência especial do cuidador na rotina diária da criança? (> 3 e < 7 anos)}{ Há necessidade de uso de fraldas? (> 7 anos)}")} name="medicacoesDeUsoContinuo" width={12} />
    <Frm.TextArea label={parseDescriptionWithCondition(age, "Caso seja possível à parte executar atividades (trabalhos formais ou informais) que lhe garantam sustento, há necessidade de afastamento periódico do trabalho para rotinas de tratamento ou internações? Em caso positivo, quantas vezes por dia (ou semana, ou mês) e respectiva duração. (> 17 anos)").textOrNull} name="afastamentoPeriodico" width={12} />
    <Frm.TextArea label={parseDescriptionWithCondition(age, "O(A) periciando(a) depende de supervisão ou acompanhamento permanente de terceiros em sua vida diária? (> 7 anos)").textOrNull} name="supervisao" width={12} />
    <Frm.TextArea label={quesitoConclusivo ? "A pessoa periciada apresenta impedimento de longo prazo de natureza física, mental, intelectual ou sensorial que, em interação com barreiras, obstrua sua participação plena e efetiva na sociedade em igualdade de condições com as demais pessoas da mesma faixa etária, que produza efeitos pelo prazo mínimo de 2 (dois) anos?" : null} name="impedimentoMinimoDoisAnos" width={12} />
    <Frm.TextArea label="Informações Adicionais que o(a) perito(a) entenda que possam ajudar no julgamento da lide." name="informacoesAdicionais" width={12} />
 */}
    {/* <div className="col col-12">
      <h4 className="mt-5">JSON</h4>
      <pre>
        {JSON.stringify(Frm.data, null, 2)}
      </pre>
  </div > */}
  </>
}

function document(data: any) {
  const Frm = new FormHelper()
  Frm.update(data)
  return <div className="row">
    <h1 className="text-center">Laudo Médico</h1>
    {interview(Frm)}
    <div className="assinatura text-center">__________________________________<br />Assinatura do Perito(a)</div>
  </div>
}

export default function BpcLoasPcd() {
  const searchParams = useSearchParams()
  quesitoConclusivo = searchParams.get('quesito-conclusivo') === 'false' ? false : true

  return Model(interview, document, { saveButton: false, pdfButton: true, pdfFileName: 'bpc-loas-pcd-mais-17' })
}