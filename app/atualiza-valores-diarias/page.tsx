'use client'

import Model from "@/libs/model"
import { FormHelper } from "@/libs/form-support"

export default function AtualizaValoresDiarias() {

  const faixaOptions = [
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

  function colapse(Frm: FormHelper, faixa: string) {
    // Extrair a primeira palavra (antes do espaço)
    const prefixo = faixa
      .split(" ")[0]
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, ""); // Remove os acentos

    return (
      <div className="container mt-3">
        <div className="accordion" id={`${prefixo}_accordionExample`}>
          <div className="card">
            <div className="card-header" id={`${prefixo}_headingOne`}>
              <h5 className="mb-0 text-center">
                <button
                  className="btn btn-link"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target={`#collapseOne_${prefixo}`}
                  aria-expanded="true"
                  aria-controls="collapseOne"
                >
                  {faixa}
                </button>
              </h5>
            </div>
            <div
              id={`collapseOne_${prefixo}`}
              className="collapse show"
              aria-labelledby={`${prefixo}_headingOne`}
              data-bs-parent={`#${prefixo}accordionExample`}
            >
              <div className="card-body">
                <div className="row">
                  <div className="col">
                    <Frm.MoneyInputFloat
                      label="Diária Exterior:"
                      name={`${prefixo}_diaria_exterior`}
                      width={6}
                    />
                  </div>
                  <div className="col">
                    <Frm.MoneyInputFloat
                      label="Diária Nacional:"
                      name={`${prefixo}_diaria_nacional`}
                      width={6}
                    />
                  </div>

                  <div className="col">
                    <Frm.MoneyInputFloat
                      label="Meia Diária:"
                      name={`${prefixo}_meia_diaria`}
                      width={6}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }


  function Interview(Frm: FormHelper) {

    return (
      <div className="scrollableContainer">
        <div>
          <Frm.Input label="Informe abaixo o número dos documentos que alteram valores e regras para o cálculo de diárias: " name="numero_documentos_diarias" width={12} />
          <div className="row">
            <Frm.Input label="Número da Portaria do CJF: " name="numero_portaria_cjf" width={6} />
            <Frm.Input label="Número da Portaria do TRF2: " name="numero_portaria_trf2" width={6} />
          </div>
          <p></p>
          <h4>Tabela de Valores: </h4>
          {
            faixaOptions.map((option) => (
              colapse(Frm, option.name)
            ))
          }
          <p></p>
          <h4>Outros valores: </h4>

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
        <p><strong>Número da Portaria do CJF:</strong> {data.numero_portaria_cjf || 'Não informado'}</p>
        <p><strong>Número da Portaria do TRF2:</strong> {data.numero_portaria_trf2 || 'Não informado'}</p>

        <h3>Tabela de Valores: </h3>

        <table style={{width: '100%', borderCollapse: 'collapse', border: '1px solid black', backgroundColor: 'white' }}>
          <thead>
            <tr style={{ textAlign: 'center', backgroundColor: 'lightgray' }}>
              <th style={{ border: '1px solid black' }}>Cargo/Função</th>
              <th style={{ border: '1px solid black' }}>Diária Exterior</th>
              <th style={{ border: '1px solid black' }}>Diária Nacional</th>
              <th style={{ border: '1px solid black' }}>Meia Diária</th>
            </tr>
          </thead>
          <tbody>
            <tr >
              <td style={{ border: '1px solid black', padding: '0 10px' }}>{getOptionName(faixaOptions, '1')}</td>
              <td style={{ border: '1px solid black', padding: '0 10px' }}>{formatFloatValue(data.membro_diaria_exterior) || 'Não Informado'}</td>
              <td style={{ border: '1px solid black', padding: '0 10px' }}>{formatFloatValue(data.membro_diaria_nacional) || 'Não Informado'}</td>
              <td style={{ border: '1px solid black', padding: '0 10px' }}>{formatFloatValue(data.membro_meia_diaria) || 'Não Informado'}</td>
            </tr>
          </tbody>
          <tbody>
            <tr>
              <td style={{ border: '1px solid black', padding: '0 10px' }}>{getOptionName(faixaOptions, '2')}</td>
              <td style={{ border: '1px solid black', padding: '0 10px' }}>{formatFloatValue(data.desembargador_diaria_exterior) || 'Não Informado'}</td>
              <td style={{ border: '1px solid black', padding: '0 10px' }}>{formatFloatValue(data.desembargador_diaria_nacional) || 'Não Informado'}</td>
              <td style={{ border: '1px solid black', padding: '0 10px' }}>{formatFloatValue(data.desembargador_meia_diaria) || 'Não Informado'}</td>
            </tr>
          </tbody>
          <tbody>
            <tr>
              <td style={{ border: '1px solid black', padding: '0 10px' }}>{getOptionName(faixaOptions, '3')}</td>
              <td style={{ border: '1px solid black', padding: '0 10px' }}>{formatFloatValue(data.juiz_diaria_exterior) || 'Não Informado'}</td>
              <td style={{ border: '1px solid black', padding: '0 10px' }}>{formatFloatValue(data.juiz_diaria_nacional) || 'Não Informado'}</td>
              <td style={{ border: '1px solid black', padding: '0 10px' }}>{formatFloatValue(data.juiz_meia_diaria) || 'Não Informado'}</td>
            </tr>
          </tbody>
          <tbody>
            <tr>
              <td style={{ border: '1px solid black', padding: '0 10px' }}>{getOptionName(faixaOptions, '4')}</td>
              <td style={{ border: '1px solid black', padding: '0 10px' }}>{formatFloatValue(data.analista_diaria_exterior) || 'Não Informado'}</td>
              <td style={{ border: '1px solid black', padding: '0 10px' }}>{formatFloatValue(data.analista_diaria_nacional) || 'Não Informado'}</td>
              <td style={{ border: '1px solid black', padding: '0 10px' }}>{formatFloatValue(data.analista_meia_diaria) || 'Não Informado'}</td>
            </tr>
          </tbody>
          <tbody>
            <tr>
              <td style={{ border: '1px solid black', padding: '0 10px' }}>{getOptionName(faixaOptions, '5')}</td>
              <td style={{ border: '1px solid black', padding: '0 10px' }}>{formatFloatValue(data.tecnico_diaria_exterior) || 'Não Informado'}</td>
              <td style={{ border: '1px solid black', padding: '0 10px' }}>{formatFloatValue(data.tecnico_diaria_nacional) || 'Não Informado'}</td>
              <td style={{ border: '1px solid black', padding: '0 10px' }}>{formatFloatValue(data.tecnico_meia_diaria) || 'Não Informado'}</td>
            </tr>
          </tbody>
        </table>

        <p></p>

        <h3>Outros valores: </h3>
        <p><strong>Valor do Teto Diária Nacional:</strong> {formatFloatValue(data.valor_teto_diaria_nacional) || 'Não informado'}</p>
        <p><strong>Valor do Teto Meia Diária Nacional:</strong> {formatFloatValue(data.valor_teto_meia_diaria_nacional) || 'Não informado'}</p>
        <p><strong>Valor Unitário para desconto do Auxilío ALimentação:</strong> {formatFloatValue(data.valor_desconto_auxilio_alimentacao) || 'Não informado'}</p>

      </div>
    )
  }

  return Model(Interview, document, { saveButton: true, pdfButton: false, pdfFileName: 'AtualizaValoresDiarias' })
}
