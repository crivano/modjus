'use client'

import Model from "@/libs/model"
import { FormHelper } from "@/libs/form-support"
import { Suspense, useState } from "react"
import PessoaMany from "@/components/sei/Pessoa"
import { verificaJuizDesembargador } from "@/components/utils/verificaJuizDesembargador"
import ErrorPopup from "@/components/ErrorPopup"

const options1 = "a) trabalho exclusivamente presencial.;b) atividade em que não há obrigação de comparecimento à unidade jurisdicional (convocação para atuar no CNJ, CJF, STF, STJ ou neste Tribunal Regional Federal da 2ª Região com prejuízo da jurisdição na unidade de origem, exercício da jurisdição em Núcleo de Justiça 4.0, gozo de licença-maternidade ou paternidade, licença para tratamento da própria saúde ou por motivo de doença em pessoa da família, licença para estudar no exterior ou afastamento em razão de ordem judicial ou proferida em processo administrativo disciplinar).;c) trabalho remoto integral, em razão do deferimento de regime especial de teletrabalho (por ser portador de deficiência, necessidades especiais ou doença grave, bem como por ter filhos(as) ou dependentes legais na mesma condição), nos termos da Resolução nº 343, do CNJ, de 9 de setembro de 2020, com redação dada pela Resolução nº 481 do CNJ, de 22 de novembro de 2022.;d) trabalho remoto parcial, em razão do deferimento de regime especial de teletrabalho (por ser portador de deficiência, necessidades especiais ou doença grave, bem como por ter filhos(as) ou dependentes legais na mesma condição), nos termos da Resolução nº 343, do CNJ, de 9 de setembro de 2020, com redação dada pela Resolução nº 481 do CNJ, de 22 de novembro de 2022.;e) trabalho remoto parcial, atendidas as condições estabelecidas na Resolução nº 481 do CNJ, de 22 de novembro de 2022, que trata de deliberação contida no julgamento do PCA nº 0002260-11.2022.2.00.0000, bem assim ao disposto no art. 2º do Provimento TRF2 nº PVC-2023/00002, de 2 de fevereiro de 2023, ainda que com a substituição de dias pontualmente.;f) comparecimento pontual para atos específicos em razão da indisponibilidade do prédio da Justiça Federal na localidade.".split(';').map((opt, idx) => ({ id: `${idx + 1}`, name: opt }))
const options2 = "g) foi garantido o pleno atendimento aos advogados e procuradores, seja por intermédio de ferramentas digitais, seja presencialmente.;h) não foi garantido o pleno atendimento aos advogados e procuradores.".split(';').map((opt, idx) => ({ id: `${idx + 1}`, name: opt }))

export default function Recomendacao14CJF() {
  const [error, setError] = useState("");

  function interview(Frm: FormHelper) {
    const handlePessoaChange = (pessoa: any) => {
      if (!verificaJuizDesembargador(pessoa.idCargo)) {
        throw new Error("A pessoa selecionada não é Desembargador ou Juiz");
      }
    };

    return <>
      <div className="scrollableContainer">
        <PessoaMany Frm={Frm} name="pessoa" label1="Sigla" label2="Nome" onChange={handlePessoaChange} />
        {error && <ErrorPopup message={error} onClose={() => setError("")} />}
        <h5 style={{ marginTop: '10px' }}>Favor marcar a opção pertinente ao trabalho realizado</h5>
        <Frm.RadioButtons label="01) Nos meses de Outubro a Dezembro de 2024, declaro a realização de:" name="opcao1" options={options1} />
        <Frm.RadioButtons label="02) Nos meses de Outubro a Dezembro de 2024, declaro que, nos termos do art. 3º do Provimento nº TRF2-PVC-2023/00002, de 02 de fevereiro de 2023:" name="opcao2" options={options2} />
        {JSON.stringify(Frm.data)}
      </div>
    </>
  }

  function document(data: any) {
    return <>
      <div className="scrollableContainer">
        <h4 style={{textAlign: 'center'}}>RECOMENDAÇÃO Nº 14 DO CONSELHO DA JUSTIÇA FEDERAL Nº TMP-4285588</h4>
        <p style={{ marginTop: '50px' }}><strong>Nome da Magistrada:</strong> {data.pessoa?.descricao}</p>
        <p><strong>Número da Matrícula:</strong> {data.pessoa?.sigla}</p>
        <h4 style={{ textAlign: 'center' }}>DECLARAÇÃO</h4>
        <p><strong>1) Nos meses de Outubro a Dezembro de 2024, <u>declaro</u></strong> {options1.find(opt => opt.id === data.opcao1)?.name.replace(/^[a-z]\)\s*/, '')}</p>
        <p><strong>2) Nos meses de Outubro a Dezembro de 2024, <u>declaro</u> que, nos termos do art. 3º do Provimento nº TRF2-PVC-2023/00002, de 02 de fevereiro de 2023,</strong> {options2.find(opt => opt.id === data.opcao2)?.name.replace(/^[a-z]\)\s*/, '')}</p>
      </div>
    </>
  }

  return Model(interview, document, { saveButton: true, pdfButton: true, pdfFileName: 'Recomendacao 14 CJF' })
}
