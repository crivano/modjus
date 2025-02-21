'use client'

import Model from "@/libs/model"
import { FormHelper } from "@/libs/form-support"
import { useState } from "react"

const resultadoCalculoOptions = [
  { id: '1', name: 'Sim' },
  { id: '2', name: 'Não' }
]

const auxiliosOptions = [
  { id: '1', name: 'Sim' },
  { id: '2', name: 'Não' }
]

export default function CalculoDeDiarias() {
  const [formData, setFormData] = useState({});
  const Frm = new FormHelper();

  function interview(Frm: FormHelper) {
    return <>
      <div className="scrollableContainer">
        <h2>Cálculo de Diárias</h2>
        <Frm.Select label="Informar manualmente o resultado do cálculo" name="resultadoCalculo" options={resultadoCalculoOptions} width={12} />
        <Frm.Select label="Obter automaticamente auxílios alimentação e transporte" name="auxilios" options={auxiliosOptions} width={12} />
        <Frm.Input label="Quantidade de feriados durante o deslocamento" name="quantidadeFeriados" width={12} />
        <Frm.Input label="Quantidade de dias em que não será paga a diária durante o deslocamento" name="quantidadeDiasSemDiaria" width={12} />
      </div>
    </>
  }

  function document(data: any) {
    const getOptionName = (options: { id: string, name: string }[], id: string) => {
      return options.find(opt => opt.id === id)?.name || 'Não informado';
    };

    return <>
      <div className="scrollableContainer">
        <h4 style={{ textAlign: 'center' }}>CÁLCULO DE DIÁRIAS</h4>
        <p><strong>Informar manualmente o resultado do cálculo:</strong> {getOptionName(resultadoCalculoOptions, data.resultadoCalculo)}</p>
        <p><strong>Obter automaticamente auxílios alimentação e transporte:</strong> {getOptionName(auxiliosOptions, data.auxilios)}</p>
        <p><strong>Quantidade de feriados durante o deslocamento:</strong> {data.quantidadeFeriados || 'Não informado'}</p>
        <p><strong>Quantidade de dias em que não será paga a diária durante o deslocamento:</strong> {data.quantidadeDiasSemDiaria || 'Não informado'}</p>
      </div>
    </>
  }

  return Model(interview, document, { saveButton: true, pdfButton: true, pdfFileName: 'CalculoDeDiarias' })
}
