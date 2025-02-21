'use client'

import Model from "@/libs/model"
import { FormHelper, labelToName } from "@/libs/form-support"

function interview(Frm: FormHelper) {
  const oEscolaridade = ";Ensino Fundamental - 1º ano;Ensino Fundamental - 2º ano;Ensino Fundamental - 3º ano;Ensino Fundamental - 4º ano;Ensino Fundamental - 5º ano;Ensino Fundamental - 6º ano;Ensino Fundamental - 7º ano;Ensino Fundamental - 8º ano;Ensino Fundamental - 9º ano;Ensino Médio - 1ª série;Ensino Médio - 2ª série;Ensino Médio - 3ª série;Curso Técnico;Ensino Superior;Mestrado;Doutorado".split(';').map((i) => ({ id: `${i}`, name: i }))
  const oFuncoesDoCorpo = "Funções Mentais;Funções Sensoriais da Visão;Funções Sensoriais da Audição;Funções Sensoriais Adicionais e Dor;Funções da Voz e da Fala;Funções do Sistema Cardiovascular;Funções do Sistema Hematológico;Funções do Sistema Imunológico;Funções do Sistema Respiratório;Funções do Sistema Digestivo;Funções do Sistema Metabólico e Endócrino;Funções Geniturinárias e Reprodutivas;Funções Neuromusculoesqueléticas e Relacionadas ao Movimento;Funções da Pele e Estruturas Relacionadas".split(';').map((i) => ({ label: i, name: `${labelToName(i)}` }))
  const oNivel = "Grau A;Grau B;Grau C;Grau D".split(';').map((i) => ({ id: `${i.split(' ')[1]}`, name: i }))
  const oAtividadeFisica = "Fazer caminhadas;Permanecer em pé;Subir e descer escadas;Abaixar ou agachar;Erguer peso".split(';').map((i) => ({ label: i, name: `${labelToName('atividades ' + i)}` }))
  const oAutoCuidado = "Higiene pessoal;Alimentar-se e beber;Preparar as próprias refeições;Organizar atividades domésticas, cuidado da casa, compras e pagamento de contas;Ficar sozinho(a) sem produzir riscos para si;Cuidar de terceiros".split(';').map((i) => ({ label: i, name: `${labelToName('cuidados ' + i)}` }))
  const oRelacoes = "Ouvir;Falar;Orientar-se espacialmente e no tempo;Compreender e ser compreendido;Concentrar-se para a execução de tarefas;Juízo Crítico e capacidade de tomar decisões, inclusive sob estresse;Estabelecer interações interpessoais familiares, sociais e profissionais;Possibilidade de se colocar no mercado de trabalho;Utilizar transporte público".split(';').map((i) => ({ label: i, name: `${labelToName('relacoes ' + i)}` }))

  return <>
    <Frm.Input label="Nome" name="nome" width={9} />
    <Frm.Input label="Idade" name="idade" width={3} />
    <Frm.Input label="Peso" name="peso" width={3} />
    <Frm.Input label="Altura" name="altura" width={3} />
    <Frm.Select label="Escolaridade" name="escolaridade" options={oEscolaridade} width={6} />
    <Frm.TextArea label="Patologia(s) ou sequela(s) que acomete(m) a parte autora: Mencionar a(s) CID(s) indicando os documentos médicos que a comprovam" name="patologia" width={12} />
    <Frm.TextArea label="Resumo da História Clínica / Anamnese" name="anamnese" width={12} />
    <Frm.TextArea label="Informações de exames e laudos apresentados" name="sss" width={12} />
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
    <Frm.RadioButtonsTable label="Auto Cuidado e Âmbito Doméstico" labelsAndNames={oAutoCuidado} options={oNivel} width={12} />
    <Frm.RadioButtonsTable label="Relações Interpessoais e Sociais. Aprendizagem. Cognição. Inserção Profissional." labelsAndNames={oRelacoes} options={oNivel} width={12} />

    <div className="col col-12 mt-3">
      <h4>Quesitos Complementares</h4>
    </div>
    <Frm.TextArea label="Caso sejam constatadas limitações (graus B, C ou D) para atividades relacionadas no quadro acima, qual a data de início ou época aproximada em que a obstrução / impedimento / dificuldade passou a interferir na vida do(a) periciando(a)?" name="inicio" width={12} />
    <Frm.TextArea label="Caso sejam constatadas limitações (graus B, C ou D) para atividades relacionadas no quadro acima, é possível afirmar que a obstrução / impedimento / dificuldade irá perdurar por mais de 2 anos? Se menos de 2 anos, qual prognóstico de tempo para reversão?" name="prognosticoReversao" width={12} />
    <Frm.TextArea label="Há outras atividades individuais ou de participação social cotidianas (não elencadas no quadro acima) impactadas por limitações de natureza física, mental, intelectual ou sensorial da parte autora? Caso positivo, especifique e indique os graus (B, C ou D), bem como data de início ou época aproximada em que a obstrução / impedimento / dificuldade passou a interferir na vida do(a) periciando(a). É possível afirmar que irá perdurar por mais de 2 anos? Se menos de 2 anos, qual prognóstico de tempo para reversão?" name="outras" width={12} />
    <Frm.TextArea label="Sobre facilitadores - As alterações em funções e/ou estruturas do corpo podem ser solucionadas / compensadas, em tese, em menos de 2 anos? Como? A parte autora tem efetivo acesso a tecnologias / insumos de saúde facilitadores, que eliminam ou compensem as limitações de natureza física, mental, intelectual ou sensorial impostas pela patologia?" name="facilitadores" width={12} />
    <Frm.TextArea label="Caso seja possível à parte executar atividades (trabalhos formais ou informais) que lhe garantam sustento, há necessidade de afastamento periódico do trabalho para rotinas de tratamento ou internações? Em caso positivo, quantas vezes por dia (ou semana, ou mês) e respectiva duração." name="afastamentoPeriodico" width={12} />
    <Frm.TextArea label="Há necessidade de medicações de uso contínuo? Em caso positivo, tais medicações influenciam de forma significativa a interação com as demais pessoas e/ou ambiente? Há necessidade de uso de fraldas?" name="medicacoesDeUsoContinuo" width={12} />
    <Frm.TextArea label="O(A) periciando(a) depende de supervisão ou acompanhamento permanente de terceiros em sua vida diária?" name="supervisao" width={12} />
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