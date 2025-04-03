'use client'

import Model from "@/libs/model"
import { FormHelper } from "@/libs/form-support"
import { useState, useEffect, useMemo } from "react"
import Pessoa from "@/components/sei/Pessoa"
import DynamicListTrajetoV1 from "@/components/sei/DynamicListTrajetoV1"
import ErrorPopup from "@/components/ErrorPopup"
import axios from 'axios';

const tipoBeneficiarioOptions = [
  { id: '', name: '' },
  { id: '1', name: 'TRF2/SJRJ/SJES' },
  { id: '2', name: 'Colaborador' },
  { id: '3', name: 'Colaborador Eventual' }
]

const faixaOptions = [
  { id: '', name: '' },
  { id: '1', name: 'Membro do Conselho' },
  { id: '2', name: 'Desembargador Federal' },
  { id: '3', name: 'Juiz Federal de 1º Grau/Juiz Federal Substituto' },
  { id: '4', name: 'Analista Judiciário/Cargo em Comissão' },
  { id: '5', name: 'Técnico Judiciário/Auxiliar Judiciário/Função Comissionada' }
]

const retorno_a_origem = [
  { id: '', name: '' },
  { id: '1', name: 'Sim' },
  { id: '2', name: 'Não' },
]

const acrescimoOptions = [
  { id: '', name: '' },
  { id: '1', name: 'Nenhum' },
  { id: '2', name: 'Equipe de Trabalho' },
  { id: '3', name: 'Assessoramento de Autoridade' },
  { id: '4', name: 'Assistência Direta à Autoridade' },
  { id: '5', name: 'Segurança de Magistrado' }
]

const tipoDiariaOptions = [
  { id: '', name: '' },
  { id: '1', name: 'Padrão' },
  { id: '2', name: 'Meia Diária a Pedido' },
  { id: '3', name: 'Sem Diária' }
]

const tipoDeslocamentoOptions = [
  { id: '', name: '' },
  { id: '1', name: 'Nacional' },
  { id: '2', name: 'Internacional' }
]

const meioTransporteOptions = [
  { id: '', name: '' },
  { id: '1', name: 'Aéreo' },
  { id: '2', name: 'Rodoviário' },
  { id: '3', name: 'Hidroviário' },
  { id: '4', name: 'Veículo Próprio' },
  { id: '5', name: 'Sem Passagens' }
]

const colaboradores = ['2', '3']

export default function SolicitacaoDeslocamento() {
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({});
  const Frm = useMemo(() => new FormHelper(), []);

  const [dataAtual, setDataAtual] = useState('');
  // ...existing state variables...

  useEffect(() => {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = today.getFullYear();
    setDataAtual(`${day}/${month}/${year}`);
    Frm.set('dataAtual', `${day}/${month}/${year}`); // Garante que o FormHelper também tenha a data
  }, [Frm]);

  async function fetchDadosBancarios(matricula: string, Frm: FormHelper) {
    try {
      const response = await axios.get('/api/dados-bancarios', { params: { matricula } });
      const { banco, agencia, contaCorrente } = (response.data as { data: { banco: string, agencia: string, contaCorrente: string } }).data;
      Frm.set('banco', banco);
      Frm.set('agencia', agencia);
      Frm.set('conta', contaCorrente);
    } catch (error) {
      Frm.set('banco', '');
      Frm.set('agencia', '');
      Frm.set('conta', '');
      setError('Não foi possivel encontrar os dados bancários');
    }
  }

  function handlePessoaChange(pessoa: any, Frm: FormHelper) {
    if (pessoa && pessoa.sigla) {
      Frm.set('funcaoPessoa', pessoa.funcao || '');
      Frm.set('cargoPessoa', pessoa.cargo || '');
      // Frm.set('cpfPessoa', pessoa.cpf || '');
      fetchDadosBancarios(pessoa.sigla, Frm);
    }
  }

  function handleProponenteChange(proponente: any, Frm: FormHelper) {
    if (proponente) {
      Frm.set('funcaoProponente', proponente.funcao || '');
      Frm.set('cargoProponente', proponente.cargo || '');
    }
  }

  const handleReturnToOrigin = (checked: boolean) => {
    const items = this.get(name) || [];
    if (checked) {
      if (items.length > 0) {
        const newItem = {
          origem: items[items.length - 1].destino,
          destino: items[0].origem,
          transporteAteEmbarque: '1',
          transporteAposDesembarque: '1',
          hospedagem: '1',
          dataTrechoInicial: '',
          dataTrechoFinal: ''
        };
        const newData = [...items, newItem];
        this.set(name, newData);
      }
    } else {
      const newData = items.slice(0, -1);
      this.set(name, newData);
    }
  };

  function getCurrentDate(Frm: FormHelper) {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const day = String(today.getDate()).padStart(2, '0');

    return `${day}/${month}/${year}`
  }

  const formatName = (value: string) => {
    return value?.toUpperCase();
  };

  function interview(Frm: FormHelper) {
    return <>
      <div className="scrollableContainer">

        <h2>Dados do Proponente</h2>
        <Frm.dateInput label="Data da Solicitação" name="dataAtual" width={6} />
        <Pessoa Frm={Frm} name="proponente" label1="Matrícula" label2="Nome" onChange={(proponente) => handleProponenteChange(proponente, Frm)} />
        <div className="row">
          <Frm.Input label="Função" name="funcaoProponente" width={6} />
          <Frm.Input label="Cargo" name="cargoProponente" width={6} />
        </div>

        <div style={{ marginTop: '20px' }}></div> {/* Add spacing */}

        <h2>Dados do Beneficiário</h2>
        <Frm.Select label="Tipo de Beneficiário" name="tipoBeneficiario" options={tipoBeneficiarioOptions} width={12} />

        {colaboradores.includes(Frm.get('tipoBeneficiario')) &&
          <div>
            <div className="row">
              <Frm.NameInput label="Nome" name="nomePessoa" width={6} />
              <Frm.CPFInput label="CPF (somente algarismos)" name="cpfPessoa" width={6} />
              <Frm.MoneyInputFloat label="Valor Diário do Aux. Alimentação" name="valorDiarioAuxAlimentacao" width={6} />
              <Frm.MoneyInputFloat label="Valor Diário do Aux. Transporte" name="valorDiarioAuxTransporte" width={6} />
              <Frm.Input label="Banco" name="bancoColaborador" width={4} />
              <Frm.Input label="Agência" name="agenciaColaborador" width={4} />
              <Frm.Input label="Conta" name="contaColaborador" width={4} />
            </div>
          </div>}

        {Frm.get('tipoBeneficiario') === '1' &&
          <div>
            <Pessoa Frm={Frm} name="pessoa" label1="Matrícula" label2="Nome" onChange={(pessoa) => handlePessoaChange(pessoa, Frm)} />
            <div className="row">
              {/* <Frm.Input label="Função" name="funcaoPessoa" width={6} /> */}
              <Frm.Input label="Cargo" name="cargoPessoa" width={12} />
            </div>

            <div className="row">
              <Frm.Input label="Banco" name="banco" width={4} />
              <Frm.Input label="Agência" name="agencia" width={4} />
              <Frm.Input label="Conta" name="conta" width={4} />
            </div>
          </div>
        }
        <Frm.Select label="Faixa" name="faixa" options={faixaOptions} width={12} />

        <div style={{ marginTop: '20px' }}></div> {/* Add spacing */}

        <h2>Dados da Atividade</h2>
        <div className="row">
          <Frm.Select label="Acréscimo (art. 10 § 1, 3 ou 5 CJF-RES-2015/00340)" name="acrescimo" options={acrescimoOptions} width={12} />
          <p style={{ marginTop: '1px', marginBottom: '0' }}>O acréscimo deve ser previamente autorizado - incluído no mesmo processo que solicitou as diárias.</p>
        </div>
        <Frm.Select label="Tipo de Diária" name="tipoDiaria" options={tipoDiariaOptions} width={12} />
        <div className="row">
          <Frm.RadioButtons label="É prorrogação?" name="prorrogacao" options={[{ id: '1', name: 'Sim' }, { id: '2', name: 'Não' }]} width={12} />
          {(Frm.get('prorrogacao') === '1') && <Frm.MoneyInputFloat label="Valor já recebido previamente : " name="valorJaRecebidoPreviamente" width={12} />}
        </div>
        <Frm.TextArea label="Serviço ou atividade a ser desenvolvida, Órgão e Local" name="servicoAtividade" width={12} />


        <div style={{ marginTop: '20px' }}></div> {/* Add spacing */}

        <h2>Dados do Deslocamento</h2>
        <div className="row">
          <Frm.dateInput label="Período (De)" name="periodoDe" width={6} />
          <Frm.dateInput label="Período (Até)" name="periodoAte" width={6} onChange={e => {
            try {
              const dataInicial = Frm.get(`periodoDe`);
              const dataFinal = e.target.value;

              if (dataInicial && dataFinal < dataInicial) {
                throw new Error("Data Final do afastamento não pode ser menor que Data Inicial do afastamento");
              }


              setError(""); // Clear any previous error
            } catch (error: any) {
              setError(error.message);
            }

          }} />
        </div>
        <Frm.TextArea label="Justificativa" name="justificativa" width={12} />
        <div className="row">
          <Frm.Select label="Tipo de Deslocamento" name="tipoDeslocamento" options={tipoDeslocamentoOptions} width={6} />
          <Frm.Select label="Meio de Transporte" name="meioTransporte" options={meioTransporteOptions} width={6} />
          {/* <Frm.RadioButtons label="Retorno a Origem?" name="retorno_a_origem" options={[{ id: 'Sim', name: 'Sim' }, { id: 'Não', name: 'Não' }]} width={12} /> */}
        </div>
        <p><strong>A não devolução dos cartões de embarque no prazo de 05 dias úteis do retorno à sede ensejará a restituição do valor pago a título de diárias (arts. 22 e 23 da CJF-RES-2015/00340)</strong></p>
        <DynamicListTrajetoV1 Frm={Frm} label="Trajeto" name="trajeto" width={12} />
        {JSON.stringify(Frm.data)}

        {error && <ErrorPopup message={error} onClose={() => setError("")} />}
      </div >
    </>
  }

  function document(data: any) {

    const transporteOptions = [
      { id: '1', name: 'Com adicional de deslocamento' },
      { id: '2', name: 'Sem adicional de deslocamento' },
      { id: '3', name: 'Veículo oficial' }
    ];

    const hospedagemOptions = [
      { id: '1', name: 'Sim' },
      { id: '2', name: 'Não' }
    ];

    const formatDateToBrazilian = (date: string) => {
      if (!date) return 'Não informado';
      const [year, month, day] = date.split('-');
      return `${day}/${month}/${year}`;
    };

    const getOptionName = (options: { id: string, name: string }[], id: string) => {
      return options.find(opt => opt.id === id)?.name || 'Não informado';
    };

    const getOptionReturn = (options: { id: string, name: string }[], id: string) => {
      return options.find(opt => opt.id === id)?.name || 'Não informado';
    };

    const formatFloatValue = (value: number): string => {
      return value?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    };

    const formatCPF = (value: string) => {
      const numericValue = value?.replace(/\D/g, ''); // Remove caracteres não numéricos
      if (value) {
        return numericValue
        .replace(/^(\d{3})(\d)/, '$1.$2') // Adiciona o primeiro ponto
        .replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3') // Adiciona o segundo ponto
        .replace(/\.(\d{3})(\d)/, '.$1-$2') // Adiciona o hífen
        .slice(0, 14); // Limita o tamanho ao formato de CPF
      }
    };

    return <>
      <div className="scrollableContainer">
        <h4>Dados do Proponente</h4>
        <p style={{ display: 'none' }}><strong>Data da Solicitação:</strong> {data.dataAtual || 'Não informado'}</p>
        <p><strong>Proponente:</strong> {data.proponente?.descricao || 'Não informado'}</p>
        <p><strong>Matrícula:</strong> {data.proponente?.sigla || 'Não informado'}</p>
        <p><strong>Função:</strong> {data.funcaoProponente || 'Não informado'}</p>
        <p><strong>Cargo:</strong> {data.cargoProponente || 'Não informado'}</p>

        <h4>Dados do Beneficiário</h4>
        <p><strong>Tipo de Beneficiário:</strong> {getOptionName(tipoBeneficiarioOptions, data.tipoBeneficiario)}</p>
        {data.tipoBeneficiario === '1' && <>
          <p><strong>Beneficiário:</strong> {data.pessoa?.descricao || 'Não informado'}</p>
          <p><strong>Matrícula:</strong> {data.pessoa?.sigla || 'Não informado'}</p>
          {/* <p><strong>Matrícula:</strong> {data.pessoa?.sigla || 'Não informado'} - CPF: {data.cpfPessoa || 'Não informado'} </p> */}
          {data.funcaoPessoa && <p><strong>Função:</strong> {data.funcaoPessoa || 'Não informado'}</p>} 
          <p><strong>Cargo:</strong> {data.cargoPessoa || 'Não informado'}</p>
          <p>Banco: {data.banco || 'Não informado'}  Agência: {data.agencia || 'Não informado'}   Conta: {data.conta || 'Não informado'}</p>
        </>}
        {data.tipoBeneficiario > '1' && <p>
          <p><strong>Nome:</strong> {formatName(data.nomePessoa) || 'Não informado'}</p>
          <p><strong>CPF:</strong> {formatCPF(data.cpfPessoa) || 'Não informado'}</p>
          <p><strong>Valor Diário do Aux. Alimentação:</strong> {formatFloatValue(data.valorDiarioAuxAlimentacao || 0)}</p>
          <p><strong>Valor Diário do Aux. Transporte:</strong> {formatFloatValue(data.valorDiarioAuxTransporte || 0)}</p>
          <p><strong>Banco:</strong> {data.bancoColaborador || 'Não informado'}</p>
          <p><strong>Agência:</strong> {data.agenciaColaborador || 'Não informado'}</p>
          <p><strong>C/C nº:</strong> {data.contaColaborador || 'Não informado'}</p>
        </p>}

        <p><strong>Faixa:</strong> {getOptionName(faixaOptions, data.faixa)}</p>

        <h4>Dados da Atividade</h4>
        <p><strong>Acréscimo (art. 10 § 1, 3 ou 5 CJF-RES-2015/00340):</strong> {getOptionName(acrescimoOptions, data.acrescimo)}</p>
        <p><strong>Tipo de Diária:</strong> {getOptionName(tipoDiariaOptions, data.tipoDiaria)}</p>
        <p><strong>É prorrogação?:</strong> {data.prorrogacao === '1' ? 'Sim' : 'Não'}</p>
        {(data.prorrogacao === '1') && <p><strong>Valor já recebido previamente :</strong> {formatFloatValue(data.valorJaRecebidoPreviamente || 0)}</p>}

        <p><strong>Serviço ou atividade a ser desenvolvida, Órgão e Local:</strong> {data.servicoAtividade || 'Não informado'}</p>

        <h4>Dados do Deslocamento</h4>
        <p><strong>Período:</strong> De {data.periodoDe} até {data.periodoAte} - Retorno à Origem: {data.trajeto_returnToOrigin ? "Sim" : "Não"}</p>
        <p><strong>Justificativa:</strong> {data.justificativa || 'Não informado'}</p>
        <p><strong>Tipo de Deslocamento:</strong> {getOptionName(tipoDeslocamentoOptions, data.tipoDeslocamento)}</p>
        <p><strong>Meio de Transporte:</strong> {getOptionName(meioTransporteOptions, data.meioTransporte)}</p>
        <p><strong>A não devolução dos cartões de embarque no prazo de 05 dias úteis do retorno à sede ensejará a restituição do valor pago a título de diárias (arts. 22 e 23 da CJF-RES-2015/00340)</strong></p>

        {data.trajeto_trechos?.length > 0 && (
          <>
            <h4>Trechos</h4>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "center", border: "1px solid #ddd" }}>
              <thead>
                <tr style={{ backgroundColor: "#f2f2f2" }}>
                  <th style={{ border: "1px solid #ddd", padding: "8px" }}>Data inicial</th>
                  <th style={{ border: "1px solid #ddd", padding: "8px" }}>Data final</th>
                  <th style={{ border: "1px solid #ddd", padding: "8px" }}>Trecho</th>
                  <th style={{ border: "1px solid #ddd", padding: "8px" }}>Transporte até o embarque</th>
                  <th style={{ border: "1px solid #ddd", padding: "8px" }}>Transporte até o destino</th>
                  <th style={{ border: "1px solid #ddd", padding: "8px" }}>Hospedagem fornecida</th>
                </tr>
              </thead>
              <tbody>
                {data.trajeto_trechos?.map((trecho: any, i: number) => (
                  <tr key={i} style={{ backgroundColor: i % 2 === 0 ? "#ffffff" : "#f9f9f9" }}>
                    <td style={{ border: "1px solid #ddd", padding: "8px" }}>{formatDateToBrazilian(trecho.dataTrechoInicial)}</td>
                    <td style={{ border: "1px solid #ddd", padding: "8px" }}>{formatDateToBrazilian(trecho.dataTrechoFinal)}</td>
                    <td style={{ border: "1px solid #ddd", padding: "8px" }}>{trecho.origem || 'Não informado'} / {trecho.destino || 'Não informado'}</td>
                    <td style={{ border: "1px solid #ddd", padding: "8px" }}>{getOptionName(transporteOptions, trecho.transporteAteEmbarque)}</td>
                    <td style={{ border: "1px solid #ddd", padding: "8px" }}>{getOptionName(transporteOptions, trecho.transporteAposDesembarque)}</td>
                    <td style={{ border: "1px solid #ddd", padding: "8px" }}>{getOptionName(hospedagemOptions, trecho.hospedagem)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </div>
    </>
  }

  return Model(interview, document, { saveButton: true, pdfButton: false, pdfFileName: 'SolicitacaoDeslocamento' })
}
