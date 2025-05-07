'use client'

import Model from "@/libs/model"
import { FormHelper } from "@/libs/form-support"

export default function AtualizaValoresDiarias() {

  const faixaOptions = [
    { id: '', name: '' },
    { id: '1', name: 'Membro do Conselho' },
    { id: '2', name: 'Desembargador Federal' },
    { id: '3', name: 'Juiz Federal de 1º Grau/Juiz Federal Substituto' },
    { id: '4', name: 'Analista Judiciário/Cargo em Comissão' },
    { id: '5', name: 'Técnico Judiciário/Auxiliar Judiciário/Função Comissionada' }
  ]

  const getOptionName = (options: { id: string, name: string }[], id: string) => {
    return options.find(opt => opt.id === id)?.name || 'Não informado';
  };

  const formatFloatValue = (value: number): string => {
    return value?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  function Interview(Frm: FormHelper) {

    return (
      <div className="scrollableContainer">
        <div>
          <Frm.Input label="Informe abaixo o número dos documentos que alteram valores e regras para o cálculo de diárias: " name="numero_documentos_diarias" width={6} />
          <Frm.Input label="Número da Portaria do CJF: " name="numero_portaria_cjf" width={6} />
          <Frm.Input label="Número da Portaria do TRF2: " name="numero_portaria_trf2" width={6} />

          <h3>Tabela de Valores: </h3>
          {/* <Frm.Input label="Cargo/Função:" name="cargo_funcao" width={6} /> */}
          <Frm.Select label="Cargo/Função:" name="cargo_funcao" options={faixaOptions} width={6} />
          <Frm.MoneyInputFloat label="Diária Exterior:" name="diaria_exterior" width={6} />
          <Frm.MoneyInputFloat label="Diária Nacional:" name="diaria_nacional" width={6} />
          <Frm.MoneyInputFloat label="Meia Diária:" name="meia_diaria" width={6} />

          <h3>Outros valores: </h3>

          <Frm.MoneyInputFloat label="Valor do Teto Diária Nacional: " name="valor_teto_diaria_nacional" width={6} />
          <Frm.MoneyInputFloat label="Valor do Teto Meia Diária Nacional: " name="valor_teto_meia_diaria_nacional" width={6} />
          <Frm.MoneyInputFloat label="Valor Unitário para desconto do Auxilío ALimentação:" name="valor_desconto_auxilio_alimentacao" width={6} />
        </div>
      </div>
    )
  }

  function document(data: any) {

    return (
      <div className="scrollableContainer">
        <p><strong>Número dos documentos que alteram valores e regras para o cálculo de diárias:</strong> {data.numero_documentos_diarias || 'Não informado'}</p>
        <p><strong>Número da Portaria do CJF:</strong> {data.numero_portaria_cjf ||'Não informado'}</p>
        <p><strong>Número da Portaria do TRF2:</strong> {data.numero_portaria_trf2 ||'Não informado'}</p>

        <h3>Tabela de Valores: </h3>

        <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid black', backgroundColor: 'white' }}>
          <thead>
            <tr style={{ textAlign: 'center', backgroundColor: 'lightgray' }}>
              <th style={{ border: '1px solid black' }}>Cargo/Função</th>
              <th style={{ border: '1px solid black' }}>Diária Exterior</th>
              <th style={{ border: '1px solid black' }}>Diária Nacional</th>
              <th style={{ border: '1px solid black' }}>Meia Diária</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ textAlign: 'center' }}>
              <td style={{ border: '1px solid black' }}>{getOptionName(faixaOptions, data.cargo_funcao) || 'Não Informado'}</td>
              <td style={{ border: '1px solid black' }}>{formatFloatValue(data.diaria_exterior) || 'Não Informado'}</td>
              <td style={{ border: '1px solid black' }}>{formatFloatValue(data.diaria_nacional) || 'Não Informado'}</td>
              <td style={{ border: '1px solid black' }}>{formatFloatValue(data.meia_diaria) || 'Não Informado'}</td>
            </tr>
          </tbody>
        </table>

        <h3>Outros valores: </h3>
        <p><strong>Valor do Teto Diária Nacional:</strong> {formatFloatValue(data.valor_teto_diaria_nacional) || 'Não informado'}</p>
        <p><strong>Valor do Teto Meia Diária Nacional:</strong> {formatFloatValue(data.valor_teto_meia_diaria_nacional) || 'Não informado'}</p>
        <p><strong>Valor Unitário para desconto do Auxilío ALimentação:</strong> {formatFloatValue(data.valor_desconto_auxilio_alimentacao) || 'Não informado'}</p>

      </div>
    )
  }

  return Model(Interview, document, { saveButton: true, pdfButton: false, pdfFileName: 'AtualizaValoresDiarias' })
}
