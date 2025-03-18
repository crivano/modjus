'use client'

import Model from "@/libs/model"
import { FormHelper, labelToName } from "@/libs/form-support"
import { calculateAge, formatTextBasedOnAge, parseDescriptionWithCondition } from "@/libs/age"

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
  const oFuncoesDoCorpo = "Funções Mentais;Funções Sensoriais da Visão;Funções Sensoriais da Audição;Funções Sensoriais Adicionais e Dor;Funções da Voz e da Fala;Funções do Sistema Cardiovascular;Funções do Sistema Hematológico;Funções do Sistema Imunológico;Funções do Sistema Respiratório;Funções do Sistema Digestivo;Funções do Sistema Metabólico e Endócrino;Funções Geniturinárias e Reprodutivas;Funções Neuromusculoesqueléticas e Relacionadas ao Movimento;Funções da Pele e Estruturas Relacionadas".split(';').map((i) => ({ label: i, name: `${labelToName(i)}` }))
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
  ].filter(i => parseDescriptionWithCondition(age, i).valid).map(i => parseDescriptionWithCondition(age, i).text).map((i) => ({ label: i, name: `${labelToName('atividades ' + i)}` }))
  console.log('oAtividadeFisica', oAtividadeFisica)

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
  ].filter(i => parseDescriptionWithCondition(age, i).valid).map(i => parseDescriptionWithCondition(age, i).text).map((i) => ({ label: i, name: `${labelToName('cuidados ' + i)}` }))

  const oRelacoes = [
    'Expectativa de aprendizagem futura (< 3 anos)',
    'Possibilidade de frequentar creche sem AEE – atendimento educacional especializado (< 3 anos)',
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
  ].filter(i => parseDescriptionWithCondition(age, i).valid).map(i => parseDescriptionWithCondition(age, i).text).map((i) => ({ label: i, name: `${labelToName('relacoes ' + i)}` }))

  return <>
    <Frm.Input label="Nome" name="nome" width={8} />
    {/* <Frm.Input label="Idade" name="idade" width={3} /> */}
    <Frm.DatePicker label="Data de Nascimento" name="dataDeNascimento" addAge={true} width={4} />
    <Frm.Input label="Peso" name="peso" width={3} />
    <Frm.Input label="Altura" name="altura" width={3} />
    <Frm.Select label="Escolaridade" name="escolaridade" options={oEscolaridade} width={3} />
    <Frm.Select label={parseDescriptionWithCondition(age, 'Alfabetização (> 6 anos)').textOrNull} name="alfabetizacao" options={oAlfabetizacao} width={3} />
    <Frm.Input label={parseDescriptionWithCondition(age, 'Outras informações sobre Escolaridade que o perito(a) considerar relevantes (> 7 anos)').textOrNull} name="outrasInformacoesSobreEscolaridade" width={12} />
    <Frm.TextArea label="Patologia(s) ou sequela(s) que acomete(m) a parte autora: Mencionar a(s) CID(s) indicando os documentos médicos que a comprovam" name="patologia" width={12} />
    <Frm.TextArea label="Resumo da História Clínica / Anamnese" name="anamnese" width={12} />
    <Frm.TextArea label="Informações de exames e laudos apresentados" name="examesELaudos" width={12} />

    <Frm.CheckBoxes label="Assinale as alterações nas Funções do Corpo constatadas" labelsAndNames={oFuncoesDoCorpo} width={12} />

    <Frm.TextArea label="Exame Clínico (com descrição das alterações de funções do corpo assinaladas acima e de estruturas do corpo, se houver)" name="exameClinico" width={12} />
    <Frm.TextArea label="Há sinais exteriores da patologia ou sequelas duradouros (mais de 2 anos)? " name="sinaisExteriores" width={12} />

    <div className="col col-12 mt-3">
      <p>Levando-se em conta as patologias, dificuldades encontradas, idade e grau de instrução da parte autora, deverá o(a) Perito(a) preencher o quadro abaixo, assinalando, para cada atividade, o nível de obstrução ou impedimento enfrentado, tomando-se como referência: </p>
      <ul>
        <li>A - Executa a atividade nos mesmos moldes que outras pessoas com mesma idade e grau de instrução.</li>
        <li>B - Executa a atividade com pouca dificuldade adicional (até 25% a mais de esforço) em relação às pessoas com mesma idade e grau de instrução.</li>
        <li>C - Executa a atividade com significativa dificuldade adicional (superior a 25% de esforço) em relação às pessoas com mesma idade e grau de instrução.</li>
        <li>D - Não executa a atividade em razão de suas limitações pessoais / deficiência.</li>
      </ul>
    </div>

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
    <Frm.TextArea label="A pessoa periciada apresenta impedimento de longo prazo de natureza física, mental, intelectual ou sensorial que, em interação com barreiras, obstrua sua participação plena e efetiva na sociedade em igualdade de condições com as demais pessoas da mesma faixa etária, que produza efeitos pelo prazo mínimo de 2 (dois) anos?" name="impedimentoMinimoDoisAnos" width={12} />
    <Frm.TextArea label="Informações Adicionais que o(a) perito(a) entenda que possam ajudar no julgamento da lide." name="informacoesAdicionais" width={12} />

    {/* <div className="col col-12">
      <h4 className="mt-5">JSON</h4>
      {JSON.stringify(Frm.data)}
    </div> */}
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

export default function BpcLoasPdcMais17() {
  return Model(interview, document, { saveButton: false, pdfButton: true, pdfFileName: 'bpc-loas-pcd-mais-17' })
}