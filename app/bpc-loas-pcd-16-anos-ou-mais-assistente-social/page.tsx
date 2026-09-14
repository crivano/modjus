'use client'

import Model from "@/libs/model"
import { FormHelper, labelToName } from "@/libs/form-support"
import { calculateAge, parseDescriptionWithCondition } from "@/libs/age"
import { qualificadorFinalLetter } from "@/libs/bpc"

function interview(Frm: FormHelper) {
  const age = Frm.data.dataDeNascimento ? calculateAge(Frm.data.dataDeNascimento) : '0 ano'

  const oNaoSim = [
    '',
    'Não',
    'Sim',
  ].filter(i => parseDescriptionWithCondition(age, i).valid).map(i => parseDescriptionWithCondition(age, i).text).map((i) => ({ id: `${i}`, name: i }))

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

  const oEstadoCivil = [
    '',
    'Solteiro',
    'Casado',
    'União Estável',
    'Divorciado',
    'Separado de Fato',
    'Viúvo',
  ].filter(i => parseDescriptionWithCondition(age, i).valid).map(i => parseDescriptionWithCondition(age, i).text).map((i) => ({ id: `${i}`, name: i }))

  const oResponsavel = [
    '',
    'Mãe/Pai',
    'Tutor',
    'Curador',
    'Procurador',
    'Outro',
  ].filter(i => parseDescriptionWithCondition(age, i).valid).map(i => parseDescriptionWithCondition(age, i).text).map((i) => ({ id: `${i}`, name: i }))

  const oOndeVive = [
    '',
    'Residência',
    'Em Situação de Rua',
    'Instituição',
    'Instituição Carcerária - Regime Aberto',
    'Instituição Carcerária - Regime Fechado',
    'Instituição para Cumprimento de Medida Socioeducativa - Regime de Semiliberdade',
    'Instituição para Cumprimento de Medida Socioeducativa - Regime de Fechado',
  ].filter(i => parseDescriptionWithCondition(age, i).valid).map(i => parseDescriptionWithCondition(age, i).text).map((i) => ({ id: `${i}`, name: i }))

  const oSexo = [
    '',
    'Masculino',
    'Feminino'
  ].filter(i => parseDescriptionWithCondition(age, i).valid).map(i => parseDescriptionWithCondition(age, i).text).map((i) => ({ id: `${i}`, name: i }))

  const oDeficiencia = [
    '',
    'Visual - Sensorial',
    'Auditiva - Sensorial',
    'Intelectual',
    'Transtorno Mental',
    'Neuromusculoesquelética - Física',
    'Doença Crônica',
    'Múltipla',
    'Não Informada',
    'Outra',
  ].filter(i => parseDescriptionWithCondition(age, i).valid).map(i => parseDescriptionWithCondition(age, i).text).map((i) => ({ id: `${i}`, name: i }))

  const oResponsavelPelasInformacoes = [
    '',
    'Avaliado',
    'Acompanhante',
    'Representante Legal',
    'Avaliado Não Sabe Informar',
    'Avaliado Não Tem Condições de Informar',
    'Acompanhante ou Representante Legal Não Sabe Informar',
  ].filter(i => parseDescriptionWithCondition(age, i).valid).map(i => parseDescriptionWithCondition(age, i).text).map((i) => ({ id: `${i}`, name: i }))

  const oCobertura = [
    '',
    'Já foi beneficiário do BPC',
    'Nunca foi segurado',
    'Segurado sem carência',
    'Teve vinculo empregatício após ter sido beneficiário do BPC',
    'Perdeu a qualidade de segurado',
    'Dependente de segurado',
    'Tem qualidade de segurado',
    'Outra',
  ].filter(i => parseDescriptionWithCondition(age, i).valid).map(i => parseDescriptionWithCondition(age, i).text).map((i) => ({ id: `${i}`, name: i }))

  const oProdutosETecnologia = [
    '1. Produtos ou substâncias para consumo pessoal (alimentação, dieta especial, medicação prescrita, entre outros) - e110',
    '2. Produtos e tecnologia para uso pessoal e na vida diária (objetos necessários ou de uso pessoal disponíveis, como: roupas e móveis, inclusive os adequados e especialmente projetados, órtese/prótese, inclusive óculos e lentes de contato ou intraoculares, lupas, bolsa coletora, sonda nasogástrica, nasoenteral ou de gastrostomia, nebulizador, instrumentos e aparelhos/produtos de limpeza, aparelhos e produtos para cuidados e higiene pessoal, fralda descartável, colchão caixa ou casca de ovo, colchão d’água, cama hospitalar, entre outros) - e115',
    '3. Produtos e tecnologia para mobilidade e transporte pessoal em ambientes internos e externos (objetos necessários para mobilidade, como: cadeira de rodas, cadeira para banho, muletas, andador, bengala e veículos motorizados e não motorizados para transporte de pessoas em terra, água ou ar, inclusive os adequados e especialmente projetados, entre outros) - e120',
    '4. Produtos e tecnologia para comunicação utilizada pelas pessoas nas atividades de transmissão e recepção de informações (instrumentos disponíveis, como: prótese de voz, aparelhos auditivos e computador, internet, telefone, televisão, rádio, inclusive adequados e especialmente projetados, entre outros) - e125',
    '5. Produtos e tecnologia para educação (inclusive aquisição de conhecimento ou habilidade), cultura, lazer e trabalho, inclusive na condição de aprendiz (materiais e produtos, como: livros, brinquedos, materiais educativos, ferramentas, máquinas, equipamentos, mobiliário, hardwares, softwares, instrumentos musicais, materiais artísticos, recreativos e esportivos, entre outros) - e130 / e135 / e140',
    '6. Produtos e tecnologia usados em projetos, arquitetura e construção para acesso às instalações de uso público/privado, com segurança física (rampa de acesso, corrimão, piso tátil, elevador sonorizado, placas e sinalizações, inclusive em Braille e de emergência, semáforo sonoro, instalações sanitárias acessíveis, grades, armazenamento seguro de objetos e materiais perigosos, entre outros) - e150 / e155',
    '7. Produtos ou objetos de intercâmbio econômico (acesso a dinheiro, mercadorias, propriedades e outros valores que o indivíduo ou a família possui ou tem o direito de usar; considerar grau de comprometimento da renda familiar com gastos relacionados à dieta especial, medicação continuada não disponível na rede, tratamento especializado, gastos com cuidadores, entre outros, destinados ao indivíduo ou a outros componentes do grupo familiar) - e165',
    ' Qualificador do domínio e1',
  ].filter(i => parseDescriptionWithCondition(age, i).valid).map(i => parseDescriptionWithCondition(age, i).text).map((i) => ({ label: i, name: `${labelToName(i, 'produtos')}` }))

  const oCondicoesDeHabitabilidade = [
    '8. Nível de vulnerabilidade e risco das condições de habitabilidade (quaisquer aspectos climáticos ou evento natural ou de causa humana que configurem barreira para a pessoa com deficiência, tais como: morro, córrego, possível desabamento, inundações ou tempestades, poluição, violência, entre outros) - e210 / e225 / e230 / e235',
    '9. Situação e condição de habitabilidade (condição de moradia como barreira para a pessoa com deficiência. Considerar se a residência ou instituição é adequada ou de acesso universal, grau de privacidade, se própria, alugada, cedida, de favor, ocupada, acampamento, assentamento, pessoa em situação de rua, se é construção de alvenaria, madeira, taipa, entre outros) - e298 / e299',
    ' Qualificador do domínio e2',
  ].filter(i => parseDescriptionWithCondition(age, i).valid).map(i => parseDescriptionWithCondition(age, i).text).map((i) => ({ label: i, name: `${labelToName(i, 'habitabilidade')}` }))

  const oApoioERelacionamentos = [
    '10. Disponibilidade da família em oferecer apoio físico, emocional, afetivo, proteção (segurança) e cuidados - e310 / e315',
    '11. Disponibilidade de amigos, conhecidos, colegas, vizinhos e membros da comunidade em oferecer apoio físico, emocional, afetivo, proteção (segurança) e cuidados - e320 / e325',
    '12. Disponibilidade de apoio físico, emocional, afetivo, proteção (segurança) e cuidados de profissionais de saúde, cuidadores e outros profissionais - e340 / e355 / e360',
    '13. Disponibilidade de animais de estimação que proporcionem apoio físico, emocional, psíquico e terapêutico (cavalos, cachorros, gatos, pássaros, peixes, entre outros) ou animais que auxiliem a mobilidade e transporte pessoal (cão-guia, entre outros) - e350',
    '14. Condições familiares que interferem na disponibilidade de apoio e relacionamentos (existência de idosos, crianças, pessoas com deficiência, com doença crônica, com dependência química, desempregadas, sobrecarga de cuidadores na família, menor disponibilidade de familiares por residirem distante ou por razões diversas, incluindo compromissos de trabalho) - e398',
    ' Qualificador do domínio e3',
  ].filter(i => parseDescriptionWithCondition(age, i).valid).map(i => parseDescriptionWithCondition(age, i).text).map((i) => ({ label: i, name: `${labelToName(i, 'apoio')}` }))

  const oAtitudes = [
    '15. Situações de preconceito, estigma, estereótipo, discriminação, superproteção, negligência de membros da família - e410 / e415',
    '16. Situações de preconceito, estigma, estereótipo, discriminação, superproteção, negligência de amigos, conhecidos, colegas, vizinhos, membros ou grupos sociais da comunidade/sociedade - e420 / e425 / e430 / e435 / e440 / e460',
    '17. Situações de preconceito, estigma, estereótipo, discriminação, superproteção, negligência de cuidadores e assistentes pessoais, profissionais de saúde e de educação, pessoas em posição de autoridade ou subordinadas e outros, inclusive em relação à inserção e permanência no trabalho - e450 / e499',
    ' Qualificador do domínio e4',
  ].filter(i => parseDescriptionWithCondition(age, i).valid).map(i => parseDescriptionWithCondition(age, i).text).map((i) => ({ label: i, name: `${labelToName(i, 'atitudes')}` }))

  const oServicosSistemasPoliticas = [
    '18. Serviços, sistemas e políticas de habitação (existência e acesso a políticas habitacionais que contemplem moradias e entorno com acessibilidade e proximidade de equipamentos e serviços públicos) - e525',
    '19. Serviços, sistemas e políticas dos serviços públicos (acesso a serviços de abastecimento de água e esgoto, energia elétrica, coleta de lixo, correios, entre outros) - e530',
    '20. Serviços, sistemas e políticas de comunicação (acesso à transmissão de informações por meio de vários métodos que incluem telefone, fax, correio postal, correio eletrônico e outros) e comunicação em massa (rádio, televisão, serviços de circuito fechado, serviços de reportagens e imprensa, jornais, serviços em Braille, internet, entre outros) - e535 / e560',
    '21. Serviços, sistemas e políticas de transporte (acesso a transporte coletivo e/ou adaptado e/ou existência e inclusão em programa de livre acesso ao transporte coletivo, de forma a suprir as necessidades) - e540',
    '22. Serviços, sistemas e políticas de proteção civil (acesso a serviços de emergência e de ambulância e a serviços e programas voltados à segurança das pessoas e da propriedade, tais como bombeiros, polícia, defesa civil, entre outros) - e545',
    '23. Serviços, sistemas e políticas legais (acesso a serviços dos órgãos de proteção dos direitos sociais: Fóruns, Tribunais, Ministério Público, Defensoria Pública, Conselho Tutelar, Cartórios, entre outros) - e550',
    '24. Serviços, sistemas e políticas de associações e organizações (relacionados a grupos de pessoas que se organizam em busca de interesses comuns ou coletivos, sem fins lucrativos) - e555',
    '25. Serviços, sistemas e políticas de apoio social (fornecimento de suporte específico para aqueles que necessitam de apoio para compras, trabalho doméstico, transporte, cuidados com criança, cuidados temporários, cuidado pessoal, entre outros, para que participem plenamente na sociedade) - e575',
    '26. Serviços, sistemas e políticas de saúde (acesso a hospitais, postos de saúde, programa de saúde da família, exames simples e complexos, procedimentos cirúrgicos, serviços de habilitação e reabilitação, inclusive terapia reabilitatória e estimulação precoce, entre outros, de forma a suprir as necessidades) - e580',
    '27. Serviços, sistemas e políticas de educação e treinamento (acesso a escolas com educação inclusiva e/ou especializada na comunidade, equipadas com materiais pedagógicos adequados, equipe técnica especializada, acessibilidade, incluindo áreas de apoio que atendam às necessidades específicas da pessoa com deficiência, entre outros) - e585',
    '28. Serviços, sistemas e políticas relacionados ao trabalho e emprego (acesso ao trabalho, serviços de habilitação e reabilitação profissional, condições de trabalho adequadas, inclusive na condição de aprendiz, entre outras ações) - e590',
    '29. Serviços, sistemas e políticas de assistência social (o conjunto integrado de programas, serviços e benefícios de iniciativa pública estatal e da sociedade para garantir proteção social às pessoas em situação de vulnerabilidade e risco social, tais como: ações socioassistenciais promovidas pelo PAIF, CRAS, CREAS e outros, disponíveis para suprir as necessidades) - e598',
    ' Qualificador do domínio e5',
  ].filter(i => parseDescriptionWithCondition(age, i).valid).map(i => parseDescriptionWithCondition(age, i).text).map((i) => ({ label: i, name: `${labelToName(i, 'servicos')}` }))

  const oVidaDomestica = [
    '30. Dificuldade para obter um lugar para morar (comprar, alugar, tomar emprestado, mobiliar, arrumar, entre outras) - d610',
    '31. Dificuldade para obter bens e serviços (selecionar, adquirir e transportar bens e produtos para uso doméstico e/ou solicitar instalações e reparos, entre outros serviços) - d620',
    '32. Dificuldade para preparar e servir refeições simples e complexas para si próprio e para outros (planejar o que será consumido, selecionar ingredientes, preparar, cozinhar e servir o alimento ou bebida) - d630',
    '33. Dificuldade para planejar, administrar e realizar tarefas domésticas (organizar o trabalho doméstico, limpar e arrumar a casa, lavar e passar roupa, utilizar utensílios domésticos, armazenar alimentos, remover o lixo, entre outras atividades) - d640',
    '34. Dificuldade para cuidar de objetos da casa, de objetos pessoais, de plantas e animais (manter e consertar objetos da casa e objetos pessoais, cuidar das plantas, tratar e alimentar animais domésticos, entre outras atividades) - d650',
    '35. Dificuldade para ajudar os outros (auxiliar os membros da casa e outros no seu aprendizado, na comunicação, no cuidado pessoal e movimento, dentro ou fora da casa; preocupar-se com o bem estar dos membros da casa, entre outros) - d660',
    ' Qualificador do domínio d6',
  ].filter(i => parseDescriptionWithCondition(age, i).valid).map(i => parseDescriptionWithCondition(age, i).text).map((i) => ({ label: i, name: `${labelToName(i, 'domestica')}` }))

  const oRelacoesEInteracoesInterpessoais = [
    '36. Dificuldade para estabelecer interações pessoais básicas com os outros (com respeito, discernimento, afeto, tolerância, atitude crítica, reações adequadas, contato físico contextual e apropriado, entre outras) - d710',
    '37. Dificuldade para estabelecer interações pessoais complexas (iniciar, manter ou terminar relações com outras pessoas, como controlar emoções, impulsos, agressões verbais e/ou físicas e agir de forma independente nas interações sociais e conforme as regras sociais; considerar se a autorrepresentação da deficiência dificulta os relacionamentos) - d720',
    '38. Dificuldade para estabelecer contatos ou ligações temporárias com estranhos (solicitar algo, fazer um agradecimento, formular indagações, perguntar um caminho) - d730',
    '39. Dificuldade para criar e manter relações específicas em ambientes formais (com professores, funcionários, profissionais ou prestadores de serviços, entre outros) - d740',
    '40. Dificuldade para iniciar relações informais com outros, como relações casuais com pessoas que vivem na mesma comunidade ou residência, ou com colaboradores, estudantes, companheiros de lazer (amigos, vizinhos, conhecidos, colegas de moradia) - d750',
    '41. Dificuldade para criar e manter relações de parentesco com membros do núcleo familiar, família adotiva e de criação e parentes distantes, não consanguíneos ou tutores - d760',
    ' Qualificador do domínio d7',
  ].filter(i => parseDescriptionWithCondition(age, i).valid).map(i => parseDescriptionWithCondition(age, i).text).map((i) => ({ label: i, name: `${labelToName(i, 'interpessoais')}` }))

  const oAreasPrincipaisDaVida = [
    '42. Dificuldade para obter acesso, realizar ou participar de atividades, aprender o conteúdo e cumprir responsabilidades e exigências do ensino fundamental, médio ou educação de adultos, incluindo frequência regular, trabalho em equipe e interação adequada com demais alunos, professores e funcionários - d820',
    '43. Dificuldade para obter acesso, realizar ou participar de atividades, aprender o conteúdo e cumprir responsabilidades e exigências de curso técnico e/ou profissionalizante, incluindo frequência regular, trabalho em equipe e interação adequada com demais alunos, professores e funcionários - d825',
    '44. Dificuldade para obter acesso, realizar ou participar de atividades, aprender o conteúdo e cumprir responsabilidades e exigências do ensino superior ou pós-graduação, incluindo frequência regular, trabalho em equipe e interação adequada com demais alunos, professores e funcionários - d830',
    '45. Dificuldade para realizar transações econômicas básicas e complexas, como comprar, trocar e negociar mercadorias, manter conta bancária, economizar dinheiro, obter acesso a fontes de recursos financeiros, entre outras - d860 / d865',
    ' Qualificador do domínio d8',
  ].filter(i => parseDescriptionWithCondition(age, i).valid).map(i => parseDescriptionWithCondition(age, i).text).map((i) => ({ label: i, name: `${labelToName(i, 'areasPrincipais')}` }))

  const oVidaComunitaria = [
    '46. Dificuldade para participar de reuniões comunitárias, cerimônias sociais, associações e grupos sociais - d910',
    '47. Dificuldade para participar de atividades recreativas e de lazer (excursões, trabalhos artesanais, jogos, esportes, cinema, museus, tocar instrumentos musicais, demais atividades culturais, entre outras atividades de diversão) - d920',
    '48. Dificuldade para participar da vida social e política enquanto cidadão, considerando a garantia e ampliação do acesso aos direitos humanos (direitos políticos: liberdade de associação e posição legal de cidadão; direitos civis: liberdade de expressão, de autodeterminação ou autonomia; direitos sociais: satisfação digna de suas necessidades sociais) - d940 / d950',
    ' Qualificador do domínio d9',
  ].filter(i => parseDescriptionWithCondition(age, i).valid).map(i => parseDescriptionWithCondition(age, i).text).map((i) => ({ label: i, name: `${labelToName(i, 'comunitaria')}` }))

  const oQualificador = "0;1;2;3;4".split(';').map((i) => ({ id: `${i}`, name: i }))
  const oTotalParcial = "T;P".split(';').map((i) => ({ id: `${i}`, name: i }))

  const letterToDesc: Record<string, string> = {
    'N': 'Nenhuma', 'L': 'Leve', 'M': 'Moderada', 'G': 'Grave', 'C': 'Completa', '—': '—'
  }

  // Fatores Ambientais (barreira): e1–e5
  const faLetter = qualificadorFinalLetter([
    Frm.data.qualificadorDoDominioE1,
    Frm.data.qualificadorDoDominioE2,
    Frm.data.qualificadorDoDominioE3,
    Frm.data.qualificadorDoDominioE4,
    Frm.data.qualificadorDoDominioE5,
  ])

  // Atividades e Participação (dificuldade): d6–d9
  const apLetter = qualificadorFinalLetter([
    Frm.data.qualificadorDoDominioD6,
    Frm.data.qualificadorDoDominioD7,
    Frm.data.qualificadorDoDominioD8,
    Frm.data.qualificadorDoDominioD9,
  ])

  return <>
    <Frm.Input label="Nome do Avaliado(a)" name="nome" width={6} />
    <Frm.DatePicker label="Data de Nascimento" name="dataDeNascimento" addAge={true} width={2} />
    <Frm.CPFInput label="CPF" name="cpf" width={2} />
    <Frm.Select label="Sexo" name="sexo" options={oSexo} width={2} />
    <Frm.Select label="Escolaridade" name="escolaridade" options={oEscolaridade} width={4} />
    <Frm.Select label={labelAlfabetizacao} name="alfabetizacao" options={oAlfabetizacao} width={4} />
    <Frm.Select label="Estado Civil" name="estadoCivil" options={oEstadoCivil} width={4} />
    <Frm.Select label="Responsável" name="responsavel" options={oResponsavel} width={4} />
    {Frm.data.responsavel === 'Outro' && <>
      <Frm.Input label="Especifique o Responsável" name="outroResponsavel" width={4} />
    </>}
    <Frm.Select label="Onde o Avaliado Vive" name="ondeVive" options={oOndeVive} width={4} />
    <Frm.Select label="Deficiência Informada" name="deficiencia" options={oDeficiencia} width={4} />
    {Frm.data.deficiencia === 'Outra' && <>
      <Frm.Input label="Especifique o Deficiência" name="outraDeficiencia" width={4} />
    </>}
    <Frm.Select label="Responsável pelas Informações" name="responsavelPelasInformacoes" options={oResponsavelPelasInformacoes} width={4} />
    {(Frm.data.responsavelPelasInformacoes === 'Acompanhante' || Frm.data.responsavelPelasInformacoes === 'Representante Legal') && <>
      <Frm.Input label="Identifique o Responsável pelas Informações" name="identificacaoDoResponsavelPelasInformacoes" width={4} />
    </>}
    <Frm.Select label="Cobertura previdenciária e/ou assistencial" name="cobertura" options={oCobertura} width={4} />
    <Frm.TextArea label="História Social - Constitui-se na síntese do estudo social, com registro de elementos relevantes que possibilitem conhecer, analisar e interpretar situações vivenciadas pela pessoa em seu cotidiano, para avaliar a participação plena e efetiva da pessoa na sociedade, em igualdade de condições com as demais pessoas, conforme previsto na legislação. Deve conter informações relevantes, que respaldem os qualificadores atribuídos às unidades de classificação e respectivos domínios, subsidiem a avaliação médico-pericial e avaliações subsequentes em fase recursal e judicial." name="historiaSocial" width={12} />

    <div className="col col-12 mt-5">
      <h4>Fatores Ambientais</h4>
    </div>

    <div className="col col-12 mt-3">
      <p>Qualificadores a serem usados (níveis de barreiras e percentuais): </p>
      <ul>
        <li>0 - Nenhuma: barreira de 0% a 4%;</li>
        <li>1 - Leve: barreira de 5% a 24%;</li>
        <li>2 - Moderada: barreira de 25% a 49%;</li>
        <li>3 - Grave: barreira de 50% a 95%;</li>
        <li>4 - Completa: barreira de 96% a 100%.</li>
      </ul>
      <p>Os Fatores Ambientais são externos ao indivíduo e podem ter influência sobre seu desempenho na execução de Atividades e Participação Social, assim como nas Funções e Estruturas do Corpo.</p>
      <p>Considerar na avaliação dos Fatores Ambientais as barreiras do ambiente físico, social e de atitudes no qual as pessoas vivem e conduzem sua vida, assim como os Fatores Pessoais (gênero, etnia, idade, condição física, estilo de vida, hábitos, nível de instrução, profissão e outros).</p>
      <p><strong>Barreira</strong>: é um qualificador que descreve os obstáculos vivenciados pelo indivíduo (a qualificação deve considerar, inclusive, a frequência e extensão dessas barreiras).</p>
      <p><strong>Ambiente social</strong>: relações de convívio familiar, comunitário e social, considerando a acessibilidade às políticas públicas, a vulnerabilidade e o risco pessoal e social a que a pessoa com deficiência está submetida.</p>
      <p><strong>Ambiente físico</strong>: território onde vive e as condições de vida, considerando a acessibilidade, salubridade ou insalubridade.</p>
    </div>

    <div id="sec-e1" />
    <Frm.RadioButtonsTable label="I - PRODUTOS E TECNOLOGIA - e1: referem-se a qualquer produto, instrumento, equipamento ou tecnologia, inclusive os adequados ou especialmente projetados para melhorar a funcionalidade da pessoa, bem como bens materiais e não materiais e patrimônio financeiro que a pessoa possa usufruir. Analisar conforme a necessidade do avaliado. Indicadores = disponibilidade; condições de acesso (despesa, distância geográfica entre o domicílio e local de acesso, qualidade e periodicidade)." labelsAndNames={oProdutosETecnologia} options={oQualificador} width={12} />
    <div id="sec-e2" />
    <Frm.RadioButtonsTable label="II - CONDIÇÕES DE HABITABILIDADE E MUDANÇAS AMBIENTAIS - e2: Referem-se ao ambiente natural ou físico e aos componentes deste ambiente que foram modificados pelas pessoas, bem como às características das populações humanas desse ambiente (*). Indicadores = grau de vulnerabilidade e de risco social (acessibilidade, privacidade da moradia, condição de habitabilidade, insalubridade, periculosidade, precarização do ambiente, violência e outros não especificados)." labelsAndNames={oCondicoesDeHabitabilidade} options={oQualificador} width={12} />
    <div className="col col-12">
      <p className="small">(*) Domínio da CIF adaptado para atender aos objetivos do instrumento. (**) Unidade de Classificação da CIF adaptada para atender aos objetivos do instrumento.</p>
    </div>
    <div id="sec-e3" />
    <Frm.RadioButtonsTable label="III - APOIO E RELACIONAMENTOS - e3: referem-se à disponibilidade das pessoas ou animais domésticos em fornecer proteção, apoio físico ou emocional. Referem-se também aos relacionamentos com outras pessoas, na casa, na comunidade, escola ou apoio em outros aspectos das suas atividades diárias. Indicadores = Apoio e relacionamentos insatisfatórios ou inexistentes no âmbito das relações familiares, comunitárias, institucionais e sociais, ou em outros aspectos das suas atividades." labelsAndNames={oApoioERelacionamentos} options={oQualificador} width={12} />
    <div id="sec-e4" />
    <Frm.RadioButtonsTable label="IV - ATITUDES - e4: referem-se às consequências observáveis dos costumes, práticas, ideologias, valores e normas, oriundas de pessoas externas à pessoa cuja situação está sendo avaliada. As atitudes influenciam o comportamento individual e a vida social em todos os níveis, dos relacionamentos interpessoais e sociais, às estruturas políticas, econômicas e legais. Indicadores = atitudes estigmatizantes, estereotipadas, preconceituosas, discriminatórias, de superproteção e/ou negligentes, que contribuem para segregação da pessoa com deficiência e influenciam no comportamento e nas ações individuais." labelsAndNames={oAtitudes} options={oQualificador} width={12} />
    <div id="sec-e5" />
    <Frm.RadioButtonsTable label="V - SERVIÇOS, SISTEMAS E POLÍTICAS - e5: referem-se à rede de serviços, sistemas e políticas garantidoras de proteção social. Indicadores = Não tem acesso ou o acesso disponível não supre suas necessidades, inclusive pela distância e/ou inexistência do serviço na localidade em que vive." labelsAndNames={oServicosSistemasPoliticas} options={oQualificador} width={12} />

    <div className="col col-12 mt-5">
      <h4>Atividades e Participação</h4>
    </div>

    <div className="col col-12 mt-3">
      <p>Qualificadores a serem usados: 0 = Nenhuma dificuldade (0 a 4%)  1 = Dific. Leve (5 a 24%)  2 = Dific. Moderada (25 a 49%)  3 = Dificuldade Grave (50 a 95%)  4 = Dificuldade Completa (96 a 100%)</p>
      <p>Considerar na análise o impacto/influência dos Fatores Ambientais (barreiras) e Pessoais (gênero, etnia, idade, condição física, estilo de vida, hábitos, nível de instrução, profissão e outros) e na avaliação do desempenho para a execução de atividades e participação social, em igualdade de condições com as demais pessoas.</p>
      <p><strong>Desempenho</strong>: é um qualificador que descreve o que o indivíduo faz (grau de dificuldade) em seu ambiente de vida habitual, entendido como "envolvimento em uma situação vital" ou "a experiência vivida", no contexto real em que vive (a qualificação deve considerar, sobretudo, a frequência e extensão da dificuldade). </p>
      <p><strong>Atividade</strong>: é a execução de uma tarefa ou ação por um indivíduo. Representa a perspectiva individual da funcionalidade. </p>
      <p><strong>Participação</strong>: é o ato de se envolver em uma situação real de vida. Representa a perspectiva social da funcionalidade. </p>
      <p>As colunas T e P, à direita dos qualificadores de cada domínio, destinam-se à sinalização de dependência Total ou Parcial de cuidados de terceiros, sempre que o avaliador julgar pertinente, com vistas a fornecer subsídios para políticas públicas de cuidados.  Não representam o foco principal da avaliação, que deve estar centrado no desempenho para o exercício de atividades e participação social, conforme o grau de dificuldade estabelecido pelos cortes percentuais acima.</p>
    </div>

    <div id="sec-d6" />
    <Frm.RadioButtonsTable label="VI - VIDA DOMÉSTICA - d6: refere-se à realização de ações e tarefas domésticas e do dia a dia (limpeza e reparos domésticos, cuidar de objetos pessoais, da casa e ajudar os outros, além de obter um lugar para morar, alimento, vestuário e outras necessidades). Indicadores = limitação no desempenho para administrar e executar tarefas domésticas, com ou sem auxílio, em igualdade de condições com as demais pessoas." labelsAndNames={oVidaDomestica} options={oQualificador} options2={oTotalParcial} width={12} />
    <div id="sec-d7" />
    <Frm.RadioButtonsTable label="VII - RELAÇÕES E INTERAÇÕES INTERPESSOAIS - d7: referem-se à realização de ações e condutas necessárias para estabelecer interações pessoais, de maneira contextual e socialmente estabelecida com outras pessoas (estranhos, amigos, familiares e companheiros). Indicadores = limitação no desempenho para iniciar, manter e terminar relações interpessoais de maneira contextual e socialmente estabelecida, com ou sem auxílio, em igualdade de condições com as demais pessoas." labelsAndNames={oRelacoesEInteracoesInterpessoais} options={oQualificador} options2={oTotalParcial} width={12} />
    <div id="sec-d8" />
    <Frm.RadioButtonsTable label="VIII - ÁREAS PRINCIPAIS DA VIDA - d8: referem-se à realização das tarefas e ações necessárias para participar das atividades de educação e transações econômicas. Indicadores = limitação no desempenho em participar e realizar tarefas e ações acima mencionadas, com ou sem auxílio, em igualdade de condições com as demais pessoas." labelsAndNames={oAreasPrincipaisDaVida} options={oQualificador} options2={oTotalParcial} width={12} />
    <div id="sec-d9" />
    <Frm.RadioButtonsTable label="VIDA COMUNITÁRIA, SOCIAL E CÍVICA - d9: referem-se às ações e tarefas necessárias para participar da vida social organizada fora do âmbito familiar, em áreas da vida comunitária, social e cívica. Indicadores = limitação no desempenho em participar e realizar atividades relacionadas à vida comunitária social e cívica, com ou sem auxílio, em igualdade de condições com as demais pessoas." labelsAndNames={oVidaComunitaria} options={oQualificador} options2={oTotalParcial} width={12} />

    <div className="col col-12 mt-5">
      <h4>Avaliação Social</h4>
    </div>

    <div className="col col-12 mt-4">
      <h5>Resumo dos Qualificadores de Domínio — Fatores Ambientais</h5>
      <div className="table-responsive">
        <table className="table table-bordered table-sm text-center align-middle">
          <thead className="table-light">
            <tr>
              <th>e1</th>
              <th>e2</th>
              <th>e3</th>
              <th>e4</th>
              <th>e5</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><a className="text-decoration-none" href="#sec-e1">{Frm.data.qualificadorDoDominioE1 ?? '—'}</a></td>
              <td><a className="text-decoration-none" href="#sec-e2">{Frm.data.qualificadorDoDominioE2 ?? '—'}</a></td>
              <td><a className="text-decoration-none" href="#sec-e3">{Frm.data.qualificadorDoDominioE3 ?? '—'}</a></td>
              <td><a className="text-decoration-none" href="#sec-e4">{Frm.data.qualificadorDoDominioE4 ?? '—'}</a></td>
              <td><a className="text-decoration-none" href="#sec-e5">{Frm.data.qualificadorDoDominioE5 ?? '—'}</a></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div className="col col-12 mt-4">
      <h5>Resumo dos Qualificadores de Domínio — Atividades e Participação</h5>
      <div className="table-responsive">
        <table className="table table-bordered table-sm text-center align-middle">
          <thead className="table-light">
            <tr>
              <th>d6</th>
              <th>d7</th>
              <th>d8</th>
              <th>d9</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><a className="text-decoration-none" href="#sec-d6">{Frm.data.qualificadorDoDominioD6 ?? '—'}</a></td>
              <td><a className="text-decoration-none" href="#sec-d7">{Frm.data.qualificadorDoDominioD7 ?? '—'}</a></td>
              <td><a className="text-decoration-none" href="#sec-d8">{Frm.data.qualificadorDoDominioD8 ?? '—'}</a></td>
              <td><a className="text-decoration-none" href="#sec-d9">{Frm.data.qualificadorDoDominioD9 ?? '—'}</a></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div className="col col-12 mt-5">
      <h4>Risco e Proteção Social</h4>
    </div>

    <Frm.Select label="Caso sejam observados indícios de risco social que demandem acompanhamento prioritário (violência física e/ou psicológica; abandono familiar; abusos e/ou exploração sexual; crianças e/ou adolescentes fora da escola; exploração de trabalho infantil, entre outros), assinale" name="riscoSocial" options={oNaoSim} width={12} />
    {Frm.data.riscoSocial === 'Sim' && <>
      <Frm.TextArea label="Descreva abaixo, para posterior encaminhamento" name="descricaoRiscoSocial" width={12} />
    </>}

    <Frm.Select label="Na ausência de proteção social, familiar e/ou comunitária, entre outras, assinale" name="ausenciaDeProtecaoSocial" options={oNaoSim} width={12} />
    {Frm.data.ausenciaDeProtecaoSocial === 'Sim' && <>
      <Frm.TextArea label="Descreva abaixo, para posterior encaminhamento" name="descricaoAusenciaDeProtecaoSocial" width={12} />
    </>}

    <div className="col col-12 mt-5">
      <h4>Resultado</h4>
    </div>

    <div className="col col-12 mt-4">
      <div className="border rounded">
        <div className="bg-light text-center fw-bold py-2 border-bottom">Avaliação Social</div>
        <div className="p-3 d-flex flex-column align-items-center gap-2 bg-light">
          <div className="d-flex align-items-center justify-content-center gap-2">
            <strong>Qualificador Final de Fatores Ambientais:</strong>
            <span className="border border-dark px-2 py-1 fw-bold text-center">{faLetter}</span>
            <span>= Barreira</span>
            <span className="border border-dark px-3 py-1">{letterToDesc[faLetter] ?? '—'}</span>
          </div>
          <div className="d-flex align-items-center justify-content-center gap-2">
            <strong>Qualificador Parcial de Atividades e Participação:</strong>
            <span className="border border-dark px-2 py-1 fw-bold text-center">{apLetter}</span>
            <span>= Dificuldade</span>
            <span className="border border-dark px-3 py-1">{letterToDesc[apLetter] ?? '—'}</span>
          </div>
        </div>
      </div>
    </div>

    <div className="col col-12 mt-4">
      <h5>Quesito conclusivo</h5>
      <p>O avaliado tem impedimento de longo prazo de natureza física, mental, intelectual ou sensorial, o qual, em interação com uma ou mais barreiras, pode obstruir sua participação plena e efetiva na sociedade em igualdade de condições com as demais pessoas?</p>
    </div>
    <Frm.Select label="Resposta" name="respostaQuesitoConclusivo" options={oNaoSim} width={12} />
    <Frm.TextArea label="Observações do avaliador(a)" name="observacoesDoAvaliador" width={12} />
  </>
}

function document(data: any) {
  const Frm = new FormHelper()
  Frm.update(data)
  return <div className="row">
    <h1 className="text-center">Avaliação Social</h1>
    {interview(Frm)}
    <div className="assinatura text-center">__________________________________<br />Assinatura do(a) Assistente Social</div>
  </div>
}

export default function BpcLoasPcd16AnosOuMaisAssistenteSocial() {
  return Model(interview, document, { saveButton: false, pdfButton: true, pdfFileName: 'bpc-loas-pcd-16-anos-ou-mais-assistente-social', showPreview: false })
}
