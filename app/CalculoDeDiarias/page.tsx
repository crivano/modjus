'use client'

import Model from "@/libs/model"
import { FormHelper } from "@/libs/form-support"
import { useState } from "react"
import axios from 'axios'
import Pessoa from "@/components/sei/Pessoa"
import ErrorPopup from '@/components/ErrorPopup' // Adjust the import path as necessary

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

const resultadoCalculoOptions = [
  { id: '', name: '' },
  { id: '1', name: 'Sim' },
  { id: '2', name: 'Não' }
]

const auxiliosOptions = [
  { id: '', name: '' },
  { id: '1', name: 'Sim' },
  { id: '2', name: 'Não' }
]

const tabelaDeDiariasAuxilioAlimentacao = {
  "Membro do Conselho": {"exterior": 727.00, "nacional": 1388.36, "meia": 694.18},
  "Desembargador Federal": {"exterior": 691.00, "nacional": 1318.95, "meia": 659.48},
  "Juiz Federal de 1º Grau/Juiz Federal Substituto": {"exterior": 656.00, "nacional": 1253.00, "meia": 626.50},
  "Analista Judiciário/Cargo em Comissão": {"exterior": 400.00, "nacional": 763.60, "meia": 381.80},
  "Técnico Judiciário/Auxiliar Judiciário/Função Comissionada": {"exterior": 327.00, "nacional": 624.76, "meia": 312.38}
};

const valorTetoDiariaNacionalAuxilioAlimentacao = 1106.20;
const valorTetoMeiaDiariaNacionalAuxilioAlimentacao = 1106.20;

export default function CalculoDeDiarias() {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState("");
  const [fetchedData, setFetchedData] = useState(null);
  const [solicitacaoOptions, setSolicitacaoOptions] = useState<{ id: string; name: string; data?: any }[]>([{ id: '', name: '' }]);
  const [selectedSolicitacao, setSelectedSolicitacao] = useState(null);
  const tipoDiariaOptions = [
    { id: '', name: '' },
    { id: '1', name: 'Padrão' },
    { id: '2', name: 'Meia Diária a Pedido' },
    { id: '3', name: 'Sem Diária' }
  ];

  const faixaOptions = [
    { id: '', name: '' },
    { id: '1', name: 'Membro do Conselho' },
    { id: '2', name: 'Desembargador Federal' },
    { id: '3', name: 'Juiz Federal de 1º Grau/Juiz Federal Substituto' },
    { id: '4', name: 'Analista Judiciário/Cargo em Comissão' },
    { id: '5', name: 'Técnico Judiciário/Auxiliar Judiciário/Função Comissionada' }
  ];
  
  const Frm = new FormHelper();

  async function fetchProcessData(numeroProcesso: string) {
    try {
      const response = await axios.get<{ modjusData: any, numero_documento: string }[]>('/api/getmodjusdocsprocess', {
        params: { num_processo: numeroProcesso, nome_documento: 'Solicitação de Deslocamento (modjus)' },
        headers: {
          'Authorization': 'Basic YWRtaW46c2VuaGExMjM=',
          'x-forwarded-for': '127.0.0.1'
        }
      });
      setFetchedData(response.data);
      setSolicitacaoOptions([{ id: '', name: '' }, ...response.data.map((item: { modjusData: any, numero_documento: string }) => ({
        id: item.modjusData.id,
        name: item.numero_documento,
        data: item.modjusData // Store the entire data
      }))]);
    } catch (error) {
      setError('Não foi possível encontrar os dados adicionais');
    }
  }

  async function fetchAuxilioTransporte(matricula: string) {
    try {
      const response = await axios.get<{ valorAuxilioTransporte: number }>('/api/getValorAuxilioTransporte', {
        params: { matricula }
      });
      return response.data.valorAuxilioTransporte;
    } catch (error) {
      setError('Não foi possível obter o valor do auxílio transporte');
      return 0;
    }
  }

  function handleSolicitacaoChange(event: React.ChangeEvent<HTMLSelectElement>, Frm: FormHelper) {
    const selectedId = event.target.value;
    const selected = solicitacaoOptions.find(option => option.name === selectedId);
    setSelectedSolicitacao(selected ? selected.data : null);

    if (selected) {
      const solicitacaoData = selected.data;
      Frm.set('proponente', {
        descricao: solicitacaoData.proponente?.descricao || '', sigla: solicitacaoData.proponente?.sigla || ''
      });
      Frm.set('funcaoProponente', solicitacaoData.funcaoProponente || '');
      Frm.set('cargoProponente', solicitacaoData.cargoProponente || '');
      Frm.set('pessoa', {
        descricao: solicitacaoData.pessoa?.descricao || '', sigla: solicitacaoData.pessoa?.sigla || ''
      });
      Frm.set('banco', solicitacaoData.banco || '');
      Frm.set('agencia', solicitacaoData.agencia || '');
      Frm.set('conta', solicitacaoData.conta || '');
      Frm.set('tipoBeneficiario', solicitacaoData.tipoBeneficiario || '');
      Frm.set('faixa', solicitacaoData.faixa || '');
      Frm.set('acrescimo', solicitacaoData.acrescimo || '');
      Frm.set('tipoDiaria', solicitacaoData.tipoDiaria || '');
      Frm.set('prorrogacao', solicitacaoData.prorrogacao || '');
      Frm.set('servicoAtividade', solicitacaoData.servicoAtividade || '');
      Frm.set('orgao', solicitacaoData.orgao || '');
      Frm.set('local', solicitacaoData.local || '');
      Frm.set('periodoDe', solicitacaoData.periodoDe || '');
      Frm.set('periodoAte', solicitacaoData.periodoAte || '');
      Frm.set('justificativa', solicitacaoData.justificativa || '');
      Frm.set('tipoDeslocamento', solicitacaoData.tipoDeslocamento || '');
      Frm.set('meioTransporte', solicitacaoData.meioTransporte || '');
      Frm.set('trajeto', solicitacaoData.trajeto || []);
    }
  }

  function handleAuxiliosChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const selectedAuxilio = event.target.value;
    Frm.update({ ...formData, auxilios: selectedAuxilio }, setFormData);

    if (selectedAuxilio === '1' && selectedSolicitacao) {
      const faixa = getOptionName(faixaOptions, selectedSolicitacao.faixa);
      const tipoDiaria = getOptionName(tipoDiariaOptions, selectedSolicitacao.tipoDiaria);
      const auxilioAlimentacao = tabelaDeDiariasAuxilioAlimentacao[faixa]?.[tipoDiaria.toLowerCase()] || 0;

      fetchAuxilioTransporte(selectedSolicitacao.pessoa.sigla).then(auxilioTransporte => {
        const diasDeslocamento = (new Date(selectedSolicitacao.periodoAte).getTime() - new Date(selectedSolicitacao.periodoDe).getTime()) / (1000 * 3600 * 24) + 1;
        const valorTotalAuxilioTransporte = auxilioTransporte * diasDeslocamento;

        Frm.update({
          ...formData,
          valorAuxilioAlimentacao: auxilioAlimentacao,
          valorAuxilioTransporte: valorTotalAuxilioTransporte
        }, setFormData);
      });
    }
  }

  function interview(Frm: FormHelper) {
    return <>
      <div className="scrollableContainer">
        {
        // div hidden para não aparecer na tela de entrevista mas criar a estrutura do data
        }
       <div style={{ display: 'none' }}>
              <h2>Dados do Proponente</h2>
              <Pessoa Frm={Frm} name="proponente" label1="Matrícula" label2="Nome"  />
              <div className="row">
          <Frm.Input label="Função" name="funcaoProponente" width={6} />
          <Frm.Input label="Cargo" name="cargoProponente" width={6} />
              </div>

              <div style={{ marginTop: '20px' }}></div> {/* Add spacing */}

              <h2>Dados do Beneficiário</h2>
              <Frm.Select label="Tipo de Beneficiário" name="tipoBeneficiario" options={tipoBeneficiarioOptions} width={12} />
              <Pessoa Frm={Frm} name="pessoa" label1="Matrícula" label2="Nome"  />
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
          <Frm.RadioButtons label="É prorrogação?" name="prorrogacao" options={[{ id: '1', name: 'Sim' }, { id: '2', name: 'Não' }]} width={12} />
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
              <Frm.DynamicListTrajeto label="Trajeto" name="trajeto" width={12} />
      </div>
        {
        // div hidden para não aparecer na tela de entrevista mas criar a estrutura do data
        }

        <h2>Cálculo de Diárias</h2>
        <Frm.InputWithButton label="Número do Processo" name="numeroProcesso" buttonText="Buscar" onButtonClick={fetchProcessData} width={12} />
        {fetchedData && (
          <Frm.Select label="Selecione a solicitação de deslocamento para o cálculo" name="solicitacaoDeslocamento" options={solicitacaoOptions} onChange={(event) => handleSolicitacaoChange(event, Frm)} width={12} />
        )}
        {selectedSolicitacao && (
          <>
            <Frm.Select label="Obter automaticamente o resultado do cálculo de diária" name="resultadoCalculo" options={resultadoCalculoOptions} width={12} />
            {Frm.get('resultadoCalculo') === '2' && (
              <>
                <Frm.TextArea label="Justificativa para informar manualmente o resultado do cálculo" name="justificativaManual" width={12} />
                <Frm.MoneyInput label="Valor bruto das diárias" name="valorBrutoDiarias" width={12} />
                <Frm.MoneyInput label="Valor adicional de deslocamento" name="valorAdicionalDeslocamento" width={12} />
                <Frm.MoneyInput label="Valor do desconto de auxílio alimentação" name="valorDescontoAlimentacao" width={12} />
                <Frm.MoneyInput label="Valor do desconto de auxílio transporte" name="valorDescontoTransporte" width={12} />
                <Frm.MoneyInput label="Subtotal bruto das diárias" name="subtotalBrutoDiarias" width={12} />
                <Frm.MoneyInput label="Desconto de teto" name="descontoTeto" width={12} />
                <Frm.MoneyInput label="Valor líquido das diárias" name="valorLiquidoDiarias" width={12} />
              </>
            )}
            <Frm.Select label="Obter automaticamente auxílios alimentação e transporte" name="auxilios" options={auxiliosOptions} onChange={handleAuxiliosChange} width={12} />
            {Frm.get('auxilios') === '2' && (
              <>
                <Frm.MoneyInput label="Valor do auxílio alimentação" name="valorAuxilioAlimentacao" width={12} />
                <Frm.MoneyInput label="Valor do auxílio transporte" name="valorAuxilioTransporte" width={12} />
              </>
            )}
            <Frm.Input label="Quantidade de feriados durante o deslocamento" name="quantidadeFeriados" width={12} />
            <p style={{ marginTop: '1px', marginBottom: '0' }}>Nos feriados, assim como nos fins de semana, não serão descontados o auxílio alimentação e o auxílio transporte</p>
            <Frm.Input label="Quantidade de dias em que não será paga a diária durante o deslocamento" name="quantidadeDiasSemDiaria" width={12} />
            <p style={{ marginTop: '1px', marginBottom: '0' }}>Nos dias em que não for paga a diária, assim como nos fins de semana, não serão descontados o auxílio alimentação e o auxílio transporte</p>
          </>
        )}
        {error && <ErrorPopup message={error} onClose={() => setError("")} />}
      </div>
    </>
  }

  function document(data: any) {
    const getOptionName = (options: { id: string, name: string }[], id: string) => {
      return options.find(opt => opt.id === id)?.name || 'Não informado';
    };

    const formatCurrency = (value: string) => {
      const numericValue = value.replace(/\D/g, '');
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      }).format(parseFloat(numericValue) / 100);
    };

    const formatDateToBrazilian = (date: string) => {
      if (!date) return 'Não informado';
      const [year, month, day] = date.split('-');
      return `${day}/${month}/${year}`;
    };

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
      { id: '5', name: 'Sem Passagens' }]

      const hospedagemOptions = [
        { id: '1', name: 'Sim' },
        { id: '2', name: 'Não' }
      ];

    const calculateTotals = (data: any) => {
      let totalDiaria = 0;
      let totalAdicionalDeslocamento = 0;
      let totalDescontoAlimentacao = 0;
      let totalDescontoTransporte = 0;
      let totalSubtotal = 0;
      let totalDescontoTeto = 0;
      let total = 0;
  
      const diasDeslocamento = (new Date(data.periodoAte).getTime() - new Date(data.periodoDe).getTime()) / (1000 * 3600 * 24) + 1;
  
      for (let i = 0; i < diasDeslocamento; i++) {
        totalDiaria += parseFloat(data.valorBrutoDiarias || '0');
        totalAdicionalDeslocamento += parseFloat(data.valorAdicionalDeslocamento || '0');
        totalDescontoAlimentacao += parseFloat(data.valorDescontoAlimentacao || '0');
        totalDescontoTransporte += parseFloat(data.valorDescontoTransporte || '0');
        totalSubtotal += parseFloat(data.subtotalBrutoDiarias || '0');
        totalDescontoTeto += parseFloat(data.descontoTeto || '0');
        total += parseFloat(data.valorLiquidoDiarias || '0');
      }
  
      return {
        totalDiaria,
        totalAdicionalDeslocamento,
        totalDescontoAlimentacao,
        totalDescontoTransporte,
        totalSubtotal,
        totalDescontoTeto,
        total
      };
    };
  
    const totals = calculateTotals(data);
  
    const diasDeslocamento = (new Date(data.periodoAte).getTime() - new Date(data.periodoDe).getTime()) / (1000 * 3600 * 24) + 1;
  
    const dadosTabelaCalculoDiarias = Array.from({ length: diasDeslocamento }).map((_, i) => {
      const currentDate = new Date(new Date(data.periodoDe).getTime() + i * 1000 * 3600 * 24);
      const trajeto = data.trajeto?.find((t: any) => new Date(t.dataTrecho).getTime() === currentDate.getTime());
      return {
        data: formatDateToBrazilian(currentDate.toISOString().split('T')[0]),
        trecho: trajeto ? `${trajeto.origem || 'Não informado'} / ${trajeto.destino || 'Não informado'}` : '-',
        valorBrutoDiarias: formatCurrency(data.valorBrutoDiarias || '0'),
        valorAdicionalDeslocamento: formatCurrency(data.valorAdicionalDeslocamento || '0'),
        valorDescontoAlimentacao: formatCurrency(data.valorDescontoAlimentacao || '0'),
        valorDescontoTransporte: formatCurrency(data.valorDescontoTransporte || '0'),
        subtotalBrutoDiarias: formatCurrency(data.subtotalBrutoDiarias || '0'),
        descontoTeto: formatCurrency(data.descontoTeto || '0'),
        valorLiquidoDiarias: formatCurrency(data.valorLiquidoDiarias || '0')
      };
    });
  
    return <>
      <div className="scrollableContainer">
        {data.solicitacaoDeslocamento && (
          <>
            <h4>Dados da Solicitação de Deslocamento</h4>
            <p><strong>Proponente:</strong> {data.proponente?.descricao || 'Não informado'}</p>
            <p><strong>Matrícula:</strong> {data.proponente?.sigla || 'Não informado'}</p>
            <p><strong>Função:</strong> {data.funcaoProponente || 'Não informado'}</p>
            <p><strong>Cargo:</strong> {data.cargoProponente || 'Não informado'}</p>
            <p><strong>Tipo de Beneficiário:</strong> {getOptionName(tipoBeneficiarioOptions, data.tipoBeneficiario)}</p>
            <p><strong>Beneficiário:</strong> {data.pessoa?.descricao || 'Não informado'}</p>
            <p><strong>Matrícula:</strong> {data.pessoa?.sigla || 'Não informado'}</p>
            <p>Banco: {data.banco || 'Não informado'}  Agência: {data.agencia || 'Não informado'}   Conta: {data.conta || 'Não informado'}</p>
            <p><strong>Faixa:</strong> {getOptionName(faixaOptions, data.faixa)}</p>
            <p><strong>Acréscimo (art. 10, V):</strong> {getOptionName(acrescimoOptions, data.acrescimo)}</p>
            <p><strong>Tipo de Diária:</strong> {getOptionName(tipoDiariaOptions, data.tipoDiaria)}</p>
            <p><strong>É prorrogação?:</strong> {data.prorrogacao === '1' ? 'Sim' : 'Não'}</p>
            <p><strong>Serviço ou atividade a ser desenvolvida:</strong> {data.servicoAtividade || 'Não informado'}</p>
            <p><strong>Órgão:</strong> {data.orgao || 'Não informado'}</p>
            <p><strong>Local:</strong> {data.local || 'Não informado'}</p>
            <p><strong>Período:</strong> De {data.periodoDe} até {data.periodoAte}</p>
            <p><strong>Justificativa:</strong> {data.justificativa || 'Não informado'}</p>
            <p><strong>Tipo de Deslocamento:</strong> {getOptionName(tipoDeslocamentoOptions, data.tipoDeslocamento)}</p>
            <p><strong>Meio de Transporte:</strong> {getOptionName(meioTransporteOptions, data.meioTransporte)}</p>
            {data.trajeto?.length > 0 && (
              <>
                <h4>Trechos</h4>
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th>Data</th>
                      <th>Trecho</th>
                      <th>Transporte até o embarque</th>
                      <th>Transporte até o destino</th>
                      <th>Hospedagem fornecida</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.trajeto.map((trajeto: any, i: number) => (
                      <tr key={i}>
                        <td>{formatDateToBrazilian(trajeto.dataTrecho)}</td>
                        <td>{trajeto.origem || 'Não informado'} / {trajeto.destino || 'Não informado'}</td>
                        <td>{getOptionName(meioTransporteOptions, trajeto.transporteAteEmbarque)}</td>
                        <td>{getOptionName(meioTransporteOptions, trajeto.transporteAposDesembarque)}</td>
                        <td>{getOptionName(hospedagemOptions, trajeto.hospedagem)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            )}
          </>
        )}
        <h4 style={{ textAlign: 'center' }}>CÁLCULO DE DIÁRIAS</h4>
        <p><strong>Obter automaticamente o resultado do cálculo de diária:</strong> {getOptionName(resultadoCalculoOptions, data.resultadoCalculo)}</p>
        <p><strong>Obter automaticamente auxílios alimentação e transporte:</strong> {getOptionName(auxiliosOptions, data.auxilios)}</p>
        <p><strong>Quantidade de feriados durante o deslocamento:</strong> {data.quantidadeFeriados || 'Não informado'}</p>
        <p><strong>Quantidade de dias em que não será paga a diária durante o deslocamento:</strong> {data.quantidadeDiasSemDiaria || 'Não informado'}</p>
        {data.auxilios === '2' && (
          <>
            <p><strong>Valor do auxílio alimentação:</strong> {formatCurrency(data.valorAuxilioAlimentacao || '0')}</p>
            <p><strong>Valor do auxílio transporte:</strong> {formatCurrency(data.valorAuxilioTransporte || '0')}</p>
          </>
        )}
        {data.resultadoCalculo === '2' && (
          <>
            <h4>Informação manual de cálculo</h4>
            <p><strong>Justificativa para informar manualmente o resultado do cálculo:</strong> {data.justificativaManual || 'Não informado'}</p>
            <p><strong>Valor bruto das diárias:</strong> {formatCurrency(data.valorBrutoDiarias || '0')}</p>
            <p><strong>Valor adicional de deslocamento:</strong> {formatCurrency(data.valorAdicionalDeslocamento || '0')}</p>
            <p><strong>Valor do desconto de auxílio alimentação:</strong> {formatCurrency(data.valorDescontoAlimentacao || '0')}</p>
            <p><strong>Valor do desconto de auxílio transporte:</strong> {formatCurrency(data.valorDescontoTransporte || '0')}</p>
            <p><strong>Subtotal bruto das diárias:</strong> {formatCurrency(data.subtotalBrutoDiarias || '0')}</p>
            <p><strong>Desconto de teto:</strong> {formatCurrency(data.descontoTeto || '0')}</p>
            <p><strong>Valor líquido das diárias:</strong> {formatCurrency(data.valorLiquidoDiarias || '0')}</p>
          </>
        )}
        {data.auxilios === '2' && (
          <>
            <p><strong>Valor do auxílio alimentação:</strong> {formatCurrency(data.valorAuxilioAlimentacao || '0')}</p>
            <p><strong>Valor do auxílio transporte:</strong> {formatCurrency(data.valorAuxilioTransporte || '0')}</p>
          </>
        )}
        {data.resultadoCalculo === '1' && (
          <table className="table table-bordered">
            <thead>
              <tr>
          <th>Data</th>
          <th>Trecho</th>
          <th>Valor da Diária</th>
          <th>Adicional de Deslocamento</th>
          <th>Desconto Auxílio Alimentação</th>
          <th>Desconto Auxílio Transporte</th>
          <th>Subtotal</th>
          <th>Desconto Teto</th>
          <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {dadosTabelaCalculoDiarias.map((dia, i) => (
          <tr key={i}>
            <td>{dia.data}</td>
            <td>{dia.trecho}</td>
            <td>{dia.valorBrutoDiarias}</td>
            <td>{dia.valorAdicionalDeslocamento}</td>
            <td>{dia.valorDescontoAlimentacao}</td>
            <td>{dia.valorDescontoTransporte}</td>
            <td>{dia.subtotalBrutoDiarias}</td>
            <td>{dia.descontoTeto}</td>
            <td>{dia.valorLiquidoDiarias}</td>
          </tr>
              ))}
              <tr>
          <td colSpan={2}><strong>Total</strong></td>
          <td>{formatCurrency(totals.totalDiaria.toString())}</td>
          <td>{formatCurrency(totals.totalAdicionalDeslocamento.toString())}</td>
          <td>{formatCurrency(totals.totalDescontoAlimentacao.toString())}</td>
          <td>{formatCurrency(totals.totalDescontoTransporte.toString())}</td>
          <td>{formatCurrency(totals.totalSubtotal.toString())}</td>
          <td>{formatCurrency(totals.totalDescontoTeto.toString())}</td>
          <td>{formatCurrency(totals.total.toString())}</td>
              </tr>
            </tbody>
          </table>
        )}
      </div>
    </>
  }

  return Model(interview, document, { saveButton: true, pdfButton: true, pdfFileName: 'CalculoDeDiarias' })
}
function getOptionName(options: { id: string, name: string }[], id: string) {
  return options.find(opt => opt.id === id)?.name || 'Não informado';
}

