'use client'

import Model from "@/libs/model"
import { FormHelper } from "@/libs/form-support"
import { useState } from "react"
import Pessoa from "@/components/sei/Pessoa"
import ErrorPopup from "@/components/ErrorPopup"

const tipoBeneficiarioOptions = [
  { id: '1', name: 'TRF2/SJRJ/SJES' },
  { id: '2', name: 'Colaborador' },
  { id: '3', name: 'Colaborador Eventual' }
]

const faixaOptions = [
  { id: '1', name: 'Membro do Conselho' },
  { id: '2', name: 'Desembargador Federal' },
  { id: '3', name: 'Juiz Federal de 1º Grau/Juiz Federal Substituto' },
  { id: '4', name: 'Analista Judiciário/Cargo em Comissão' },
  { id: '5', name: 'Técnico Judiciário/Auxiliar Judiciário/Função Comissionada' }
]

const acrescimoOptions = [
  { id: '1', name: 'Nenhum' },
  { id: '2', name: 'Equipe de Trabalho' },
  { id: '3', name: 'Assessoramento de Autoridade' },
  { id: '4', name: 'Assistência Direta à Autoridade' },
  { id: '5', name: 'Segurança de Magistrado' }
]

const tipoDiariaOptions = [
  { id: '1', name: 'Padrão' },
  { id: '2', name: 'Meia Diária a Pedido' },
  { id: '3', name: 'Sem Diária' }
]

const tipoDeslocamentoOptions = [
  { id: '1', name: 'Nacional' },
  { id: '2', name: 'Internacional' }
]

const meioTransporteOptions = [
  { id: '1', name: 'Aéreo' },
  { id: '2', name: 'Rodoviário' },
  { id: '3', name: 'Hidroviário' },
  { id: '4', name: 'Veículo Próprio' },
  { id: '5', name: 'Sem Passagens' }
]

export default function SolicitacaoDeslocamento() {
  const [error, setError] = useState("");
  const [calculoManual, setCalculoManual] = useState("2");
  const [obterAuxilios, setObterAuxilios] = useState("2");

  function interview(Frm: FormHelper) {
    return <>
      <div className="scrollableContainer">
        <h2>Dados do Beneficiário</h2>
        <Frm.Select label="Tipo de Beneficiário" name="tipoBeneficiario" options={tipoBeneficiarioOptions} width={12} />
        <Pessoa Frm={Frm} name="pessoa" label1="Matrícula" label2="Nome" />
        <div className="row">
          <Frm.Input label="Banco" name="banco" width={4} />
          <Frm.Input label="Agência" name="agencia" width={4} />
          <Frm.Input label="Conta" name="conta" width={4} />
        </div>
        <Frm.Select label="Faixa" name="faixa" options={faixaOptions} width={12} />

        <div style={{ marginTop: '20px' }}></div> {/* Add spacing */}

        <h2>Dados da Atividade</h2>
        <div className="row">
          <Frm.Select label="Acréscimo (art. 10, V)" name="acrescimo" options={acrescimoOptions} width={12} />
          <p style={{ marginTop: '1px', marginBottom: '0' }}>O acréscimo deve ser previamente autorizado - incluído no ofício ou memorando que solicitou diárias.</p>
        </div>
        <Frm.Select label="Tipo de Diária" name="tipoDiaria" options={tipoDiariaOptions} width={12} />
        <div className="row">
          <Frm.RadioButtons label="É prorrogação?" name="prorrogacao" options={[{ id: '1', name: 'Sim' }, { id: '2', name: 'Não' }]} width={12}  />
        </div>
        <Frm.TextArea label="Serviço ou atividade a ser desenvolvida" name="servicoAtividade" width={12} />
        <Frm.TextArea label="Órgão" name="orgao" width={12} />
        <Frm.TextArea label="Local" name="local" width={12} />

        <div style={{ marginTop: '20px' }}></div> {/* Add spacing */}

        <h2>Dados do Deslocamento</h2>
        <div className="row">
            <Frm.dateInput label="Período (De)" name="periodoDe" width={6} />
            <Frm.dateInput label="Período (Até)" name="periodoAte" width={6} />
        </div>
        <Frm.TextArea label="Justificativa" name="justificativa" width={12} />
        <div className="row">   
            <Frm.Select label="Tipo de Deslocamento" name="tipoDeslocamento" options={tipoDeslocamentoOptions} width={6} />
            <Frm.Select label="Meio de Transporte" name="meioTransporte" options={meioTransporteOptions} width={6} />
        </div>
        <Frm.Input label="Origem/Destino" name="origem_destino" width={12} />
        <p style={{ marginTop: '1px', marginBottom: '0' }}>Se houver mais de um destino, separe todos por barra, por exemplo: RIO DE JANEIRO/SÃO PAULO/BRASÍLIA.

</p>
        <Frm.RadioButtons label="Retorno à origem?" name="retornoOrigem" options={[{ id: '1', name: 'Sim' }, { id: '2', name: 'Não' }]} width={4} />
        
        {error && <ErrorPopup message={error} onClose={() => setError("")} />}
      </div>
    </>
  }

  function document(data: any) {
    return <>
      <div className="scrollableContainer">
        <h4 style={{ textAlign: 'center' }}>SOLICITAÇÃO DE DESLOCAMENTO</h4>
        <p><strong>Tipo de Beneficiário:</strong> {tipoBeneficiarioOptions.find(opt => opt.id === data.tipoBeneficiario)?.name}</p>
        <p><strong>Nome:</strong> {data.pessoa?.descricao}</p>
        <p><strong>Matrícula:</strong> {data.pessoa?.sigla}</p>
        <p><strong>Banco:</strong> {data.banco}</p>
        <p><strong>Agência:</strong> {data.agencia}</p>
        <p><strong>Conta:</strong> {data.conta}</p>
        <p><strong>Faixa:</strong> {faixaOptions.find(opt => opt.id === data.faixa)?.name}</p>

        <h4>Dados da Atividade</h4>
        <p><strong>Acréscimo (art. 10, V):</strong> {acrescimoOptions.find(opt => opt.id === data.acrescimo)?.name}</p>
        <p><strong>Tipo de Diária:</strong> {tipoDiariaOptions.find(opt => opt.id === data.tipoDiaria)?.name}</p>
        <p><strong>É prorrogação?:</strong> {data.prorrogacao === '1' ? 'Sim' : 'Não'}</p>
        <p><strong>Serviço ou atividade a ser desenvolvida:</strong> {data.servicoAtividade}</p>
        <p><strong>Órgão:</strong> {data.orgao}</p>
        <p><strong>Local:</strong> {data.local}</p>

        <h4>Dados do Deslocamento</h4>
        <p><strong>Período:</strong> De {data.periodoDe} até {data.periodoAte}</p>
        <p><strong>Justificativa:</strong> {data.justificativa}</p>
        <p><strong>Tipo de Deslocamento:</strong> {tipoDeslocamentoOptions.find(opt => opt.id === data.tipoDeslocamento)?.name}</p>
        <p><strong>Meio de Transporte:</strong> {meioTransporteOptions.find(opt => opt.id === data.meioTransporte)?.name}</p>
        <p><strong>Origem:</strong> {data.origem_destino}</p>
        <p><strong>Retorno à origem?:</strong> {data.retornoOrigem === '1' ? 'Sim' : 'Não'}</p>
      </div>
    </>
  }

  return Model(interview, document, { saveButton: true, pdfButton: true, pdfFileName: 'SolicitacaoDeslocamento' })
}
