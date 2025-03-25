'use client'

import Model from "@/libs/model"
import { FormHelper } from "@/libs/form-support"
import { useState, useEffect, ChangeEvent } from "react"
import { Button } from 'react-bootstrap'
import axios from 'axios'
import Pessoa from "@/components/sei/Pessoa"
import DynamicListTrajetoV1 from "@/components/sei/DynamicListTrajetoV1"
import ErrorPopup from '@/components/ErrorPopup' // Adjust the import path as necessary
import { calcularDiarias, DeslocamentoConjuntoEnum, FaixaEnum, TipoDeDiariaEnum } from '@/components/utils/calculaDiarias' // Adjust the import path as necessary

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
const valorUnitarioDoAuxilioAlimentacao = 63.32;

export default function CalculoDeDiarias() {
  interface FormData {
    valorUnitatioDaDiaria?: string;
    valorUnitarioDaDiariaParaCalculoDoDeslocamento?: string;
    faixa?: string;
    deslocamentoConjunto?: boolean;
    internacional?: string;
    cotacaoDoDolar?: string;
    tipoDiaria?: string;
    tipoDeslocamento?: string;
    prorrogacao?: string;
    valorJaRecebido?: string;
    valorUnitarioDoAuxilioAlimentacao?: string;
    valorUnitarioDoAuxilioTransporte?: string;
    tetoDiaria?: string;
    tetoMeiaDiaria?: string;
    trajeto?: any[];
    feriados?: any[];
    diasSemDiaria?: any[];
  }

  interface DiariasDaJusticaFederalParametroTrecho {
      dataTrechoInicial: Date;
      dataTrechoFinal: Date;
      trecho: string;
      transporteEmbarque: TipoDeTransporteParaEmbarqueEDestinoEnum;
      transporteDesembarque: TipoDeTransporteParaEmbarqueEDestinoEnum;
      semDespesasDeHospedagem: boolean;
  }

  enum TipoDeTransporteParaEmbarqueEDestinoEnum {
    COM_ADICIONAL_DE_DESLOCAMENTO = "Com Adicional de Deslocamento",
    SEM_ADICIONAL_DE_DESLOCAMENTO = "Sem Adicional de Deslocamento",
    VEICULO_OFICIAL = "Veículo Oficial"
}

enum TipoDeDiariaEnum {
  PADRAO = "Padrão",
  MEIA_DIARIA_A_PEDIDO = "Meia Diária a Pedido",
  SEM_DIARIA = "Sem Diária"
}

  const [formData, setFormData] = useState<FormData>({});
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

  // Criando um mapeamento de ID para Enum
const tipoDiariaMap = tipoDiariaOptions.reduce((acc, { id, name }) => {
  if (name) {
      const enumKey = Object.keys(TipoDeDiariaEnum).find(
          key => TipoDeDiariaEnum[key as keyof typeof TipoDeDiariaEnum] === name
      );

      if (enumKey) {
          acc[id] = TipoDeDiariaEnum[enumKey as keyof typeof TipoDeDiariaEnum];
      }
  }
  return acc;
}, {} as Record<string, TipoDeDiariaEnum>);
  
  const Frm = new FormHelper();

  useEffect(() => {
    if (Frm.data && Frm.data.solicitacaoDeslocamento) {
      fetchProcessData(Frm.data.processo);
    }
  }, []);

  async function fetchProcessData(numeroProcesso: string) {
    try {
      const response = await axios.get<{ modjusData: any, numero_documento: string }[]>('/api/getmodjusdocsprocess', {
        params: { num_processo: numeroProcesso, nome_documento: 'Solicitação de Deslocamento (modjus)'},
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
    try {
    if ((!event.target.value || event.target.value == '') && Frm.data && Frm.data.solicitacaoDeslocamento) {
      setSelectedSolicitacao(Frm.data.solicitacaoDeslocamento);
    } else if (!event.target.value || event.target.value == '') {
      setSelectedSolicitacao(null);
      new Error('Solicitação de deslocamento não encontrada');
    } 
      
      setError('');
    } catch (error) {
      setError(error.message);
      return
    }
    try {
    const selectedId = event.target.value;
    const selected = solicitacaoOptions.find(option => option.name === selectedId);
    setSelectedSolicitacao(selected ? selected.data : null);

    if (selected) {
      const solicitacaoData = selected.data;
      Frm.set('dataAtual',solicitacaoData.dataAtual || '');
      Frm.set('proponente', {
        descricao: solicitacaoData.proponente?.descricao || '', sigla: solicitacaoData.proponente?.sigla || ''
      });
      Frm.set('funcaoProponente', solicitacaoData.funcaoProponente || '');
      Frm.set('cargoProponente', solicitacaoData.cargoProponente || '');
      Frm.set('pessoa', {
        descricao: solicitacaoData.pessoa?.descricao || '', sigla: solicitacaoData.pessoa?.sigla || ''
      });
      Frm.set('funcaoPessoa', solicitacaoData.funcaoPessoa || '');
      Frm.set('cargoPessoa', solicitacaoData.cargoPessoa || '');
      Frm.set('banco', solicitacaoData.banco || '');
      Frm.set('agencia', solicitacaoData.agencia || '');
      Frm.set('conta', solicitacaoData.conta || '');
      Frm.set('tipoBeneficiario', solicitacaoData.tipoBeneficiario || '');
      Frm.set('faixa', solicitacaoData.faixa || '');
      Frm.set('acrescimo', solicitacaoData.acrescimo || '');
      Frm.set('tipoDiaria', solicitacaoData.tipoDiaria || '');
      Frm.set('prorrogacao', solicitacaoData.prorrogacao || '');
      Frm.set('servicoAtividade', solicitacaoData.servicoAtividade || '');
      Frm.set('periodoDe', solicitacaoData.periodoDe || '');
      Frm.set('periodoAte', solicitacaoData.periodoAte || '');
      Frm.set('justificativa', solicitacaoData.justificativa || '');
      Frm.set('tipoDeslocamento', solicitacaoData.tipoDeslocamento || '');
      Frm.set('meioTransporte', solicitacaoData.meioTransporte || '');
      Frm.set('trajeto', solicitacaoData.trajeto || '');
      Frm.set('trechos', solicitacaoData.trajeto_trechos || []);
      Frm.set('return_to_origin', solicitacaoData.trajeto_returnToOrigin || false);
    }
      setError('');
    } catch (error) {
      setError(error.message);
    }
  }

  function handleAuxiliosChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const selectedAuxilio = event.target.value;
    Frm.update({ ...formData, auxilios: selectedAuxilio }, setFormData);

    if (selectedAuxilio === '1' && selectedSolicitacao) {
      const faixa = getOptionName(faixaOptions, selectedSolicitacao.faixa);
      const tipoDiaria = getOptionName(tipoDiariaOptions, selectedSolicitacao.tipoDiaria);

      fetchAuxilioTransporte(selectedSolicitacao.pessoa.sigla).then(auxilioTransporte => {
        const diasDeslocamento = (new Date(selectedSolicitacao.periodoAte).getTime() - new Date(selectedSolicitacao.periodoDe).getTime()) / (1000 * 3600 * 24) + 1;
        const valorTotalAuxilioTransporte = auxilioTransporte * diasDeslocamento;

        Frm.update({
          ...formData,
          valorAuxilioAlimentacao: valorUnitarioDoAuxilioAlimentacao,
          valorAuxilioTransporte: valorTotalAuxilioTransporte
        }, setFormData);
      });
    }
  }

  const handleCalcularDiarias = (Frm: FormHelper) => {
    // Ler trajeto_trechos e cooverter ele para o seguinte formato

    const trechos_para_calcular: DiariasDaJusticaFederalParametroTrecho[] = Frm.data.trechos.map(trecho => {
      const parseDate = (dateStr: string) => {
          if (!dateStr) return new Date();
          const [year, month, day] = dateStr.split('-').map(Number);
          return new Date(year, month - 1, day); // Garantindo fuso local sem ajustes inesperados
      };
  
      return {
          dataTrechoInicial: parseDate(trecho.dataTrechoInicial),
          dataTrechoFinal: parseDate(trecho.dataTrechoFinal),
          trecho: `${trecho.origem || 'Origem Desconhecida'} / ${trecho.destino || 'Destino Desconhecido'}`,
          transporteEmbarque: trecho.transporteAteEmbarque === '1' 
    ? TipoDeTransporteParaEmbarqueEDestinoEnum.COM_ADICIONAL_DE_DESLOCAMENTO 
    : (trecho.transporteAteEmbarque as TipoDeTransporteParaEmbarqueEDestinoEnum) || TipoDeTransporteParaEmbarqueEDestinoEnum.SEM_ADICIONAL_DE_DESLOCAMENTO,
    transporteDesembarque: trecho.transporteAposDesembarque === '1' 
    ? TipoDeTransporteParaEmbarqueEDestinoEnum.COM_ADICIONAL_DE_DESLOCAMENTO 
    : (trecho.transporteAposDesembarque as TipoDeTransporteParaEmbarqueEDestinoEnum) || TipoDeTransporteParaEmbarqueEDestinoEnum.SEM_ADICIONAL_DE_DESLOCAMENTO,
         semDespesasDeHospedagem: trecho.hospedagem ? false : true
      };
  });

    console.log(Frm.data);
  //   const result = calcularDiarias(
  //     // Pass the necessary parameters from formData
     
  //    parseFloat('763.6'),
  //    parseFloat('763.6'),
  //    null,
  //    null,
  //    false,
  //    parseFloat('0.00'),
  //    TipoDeDiariaEnum.PADRAO,
  //    false,
  //    parseFloat('0.00'),
  //    parseFloat('63.32'),
  //    parseFloat('0.00'),
  //    parseFloat('1106.2'),
  //    parseFloat('1106.2'),
  //    trechos_para_calcular || [],
  //    Frm.data.feriados || [],
  //    Frm.data.diasSemDiaria || []
  //  );

  function obterValorDiaria(faixaId, isInternacional, tipoDiariaParam) {
    const faixa = faixaOptions.find(f => f.id === faixaId);
    if (!faixa || !faixa.name) return 0; // Retorna 0 se a faixa não for encontrada
  
    const tipoDiaria = isInternacional ? 'exterior' : tipoDiariaParam === '1' ? 'nacional' : tipoDiariaParam === '2' ? 'meia' : 'Sem Diária';
    
    return tabelaDeDiariasAuxilioAlimentacao[faixa.name]?.[tipoDiaria] || 0;
  }


  const result = calcularDiarias(
     // Pass the necessary parameters from formData
    parseFloat(Number(obterValorDiaria(Frm.data.faixa, Frm.data.internacional === '1',Frm.data.tipoDiaria)  || '0').toFixed(2)),
    parseFloat(Number(obterValorDiaria(Frm.data.faixa, Frm.data.internacional === '1',Frm.data.tipoDiaria)  || '0').toFixed(2)),
    Frm.data.faixa as unknown as FaixaEnum,
    Frm.data.deslocamentoConjunto ? DeslocamentoConjuntoEnum.EQUIPE_DE_TRABALHO : DeslocamentoConjuntoEnum.EQUIPE_DE_TRABALHO,
    Frm.data.internacional === '1',
    parseFloat(Number(Frm.data.cotacaoDoDolar || '0').toFixed(2)),
    tipoDiariaMap[Frm.data.tipoDiaria],
    Frm.data.prorrogacao === '1',
    parseFloat(Number(Frm.data.valorJaRecebido || '0').toFixed(2)),
    valorUnitarioDoAuxilioAlimentacao,
    parseFloat(Number(Frm.data.valorUnitarioDoAuxilioTransporte || '0').toFixed(2)),
    valorTetoDiariaNacionalAuxilioAlimentacao,
    valorTetoMeiaDiariaNacionalAuxilioAlimentacao,
    trechos_para_calcular || [],
    Frm.data.feriados || [],
    Frm.data.diasSemDiaria || []
  );

    Frm.set('resultadoCalculoDiarias', result || {});
    console.log(result);
  };

  function handleFormaDeCalculo(event: ChangeEvent<HTMLSelectElement>, Frm: FormHelper): void {
    const selectedOption = event.target.value;
    if (selectedOption == '2') {
      Frm.set('totalDiaria', parseFloat(Frm.data.resultadoCalculoDiarias?.totalDeDiariasBruto).toFixed(2));
      Frm.set('totalAdicionalDeslocamento', parseFloat(Frm.data.resultadoCalculoDiarias?.totalDeAcrescimoDeDeslocamento).toFixed(2));
      Frm.set('totalDescontoAlimentacao', parseFloat(Frm.data.resultadoCalculoDiarias?.totalDeDescontoDeAuxilioAlimentacao).toFixed(2));
      Frm.set('totalDescontoTransporte', parseFloat(Frm.data.resultadoCalculoDiarias?.totalDeDescontoDeAuxilioTransporte).toFixed(2));
      Frm.set('totalSubtotal', parseFloat(Frm.data.resultadoCalculoDiarias?.subtotalBruto).toFixed(2));
      Frm.set('totalDescontoTeto', parseFloat(Frm.data.resultadoCalculoDiarias?.totalDeDescontoDeTeto).toFixed(2));;
      Frm.set('total', parseFloat(Frm.data.resultadoCalculoDiarias?.subtotalLiquido).toFixed(2));;

     Frm.update({ ...formData, resultadoCalculo: selectedOption }, setFormData);
    }
  }

  function interview(Frm: FormHelper) {
 

    return <>
      <div className="scrollableContainer">
        {
        // div hidden para não aparecer na tela de entrevista mas criar a estrutura do data
        }
          <div style={{ display: 'none' }}>
              <Frm.dateInput label="Data da Solicitação" name="dataAtual" width={6} />
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
                  <Frm.TextArea label="Serviço ou atividade a ser desenvolvida, Órgão e Local:" name="servicoAtividade" width={12} />

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
                  <DynamicListTrajetoV1 Frm={Frm} label="Trajeto" name="trajeto" width={12} />
          </div>
        {
        // div hidden para não aparecer na tela de entrevista mas criar a estrutura do data
        }

        <h2>Cálculo de Diárias</h2>
        <Frm.InputWithButton label="Número do Processo" name="numeroProcesso" buttonText="Buscar" onButtonClick={fetchProcessData} width={12} />
        {fetchedData && (
          <Frm.Select label="Selecione a solicitação de deslocamento para o cálculo" name="solicitacaoDeslocamento" options={solicitacaoOptions} onChange={(event) => handleSolicitacaoChange(event, Frm)} width={12} />
        )}
        {Frm.data && Frm.data.solicitacaoDeslocamento && (
            <>
            <Frm.Select label="Obter automaticamente o resultado do cálculo de diária" name="resultadoCalculo" options={resultadoCalculoOptions}  onChange={(event) =>  handleFormaDeCalculo(event, Frm)} width={12}/>
            {Frm.get('resultadoCalculo') != '2' && ( 
            <div style={{ display: 'none' }}>
              <Frm.TextArea label="Justificativa para informar manualmente o resultado do cálculo" name="justificativaManual" width={12} />
              <Frm.Input label="Valor bruto das diárias" name="totalDiaria" width={12} />
              <Frm.Input label="Valor adicional de deslocamento" name="totalAdicionalDeslocamento" width={12} />
              <Frm.Input label="Valor do desconto de auxílio alimentação" name="totalDescontoAlimentacao" width={12} />
              <Frm.Input label="Valor do desconto de auxílio transporte" name="totalDescontoTransporte" width={12} />
              <Frm.Input label="Subtotal bruto das diárias" name="totalSubtotal" width={12} />
              <Frm.Input label="Desconto de teto" name="totalDescontoTeto" width={12} />
              <Frm.Input label="Valor líquido das diárias" name="total" width={12} />
              </div>
            )} 

            {Frm.get('resultadoCalculo') === '2' && ( 
              <>
              <Frm.TextArea label="Justificativa para informar manualmente o resultado do cálculo" name="justificativaManual" width={12} />
              <Frm.Input label="Valor bruto das diárias" name="totalDiaria" width={12} />
              <Frm.Input label="Valor adicional de deslocamento" name="totalAdicionalDeslocamento" width={12} />
              <Frm.Input label="Valor do desconto de auxílio alimentação" name="totalDescontoAlimentacao" width={12} />
              <Frm.Input label="Valor do desconto de auxílio transporte" name="totalDescontoTransporte" width={12} />
              <Frm.Input label="Subtotal bruto das diárias" name="totalSubtotal" width={12} />
              <Frm.Input label="Desconto de teto" name="totalDescontoTeto" width={12} />
              <Frm.Input label="Valor líquido das diárias" name="total" width={12} />
              </>
            )} 

            {Frm.get('resultadoCalculo') === '1' && (
              <Frm.Select label="Obter automaticamente auxílios alimentação e transporte" name="auxilios" options={auxiliosOptions} onChange={handleAuxiliosChange} width={12} />
            )}

            {Frm.get('auxilios') === '2' && (
              <>
              <Frm.MoneyInput label="Valor do auxílio alimentação" name="valorAuxilioAlimentacao" width={12} />
              <Frm.MoneyInput label="Valor do auxílio transporte" name="valorAuxilioTransporte" width={12} />
              </>
            )}
            
            {Frm.get('resultadoCalculo') === '1' && (
              <>
              <Frm.FeriadosInput label="Quantidade de feriados durante o deslocamento" name="feriados" width={12} />
              <p style={{ marginTop: '1px', marginBottom: '0' }}>Nos feriados, assim como nos fins de semana, não serão descontados o auxílio alimentação e o auxílio transporte</p>
              <Frm.FeriadosInput label="Quantidade de dias em que não será paga a diária durante o deslocamento" name="DiasSemDiaria" width={12} />
              <p style={{ marginTop: '1px', marginBottom: '0' }}>Nos dias em que não for paga a diária, assim como nos fins de semana, não serão descontados o auxílio alimentação e o auxílio transporte</p>
              {Frm.data.tipoDeslocamento === '2' && (
                <Frm.MoneyInput label="Cotação do Dólar" name="cotacaoDoDolar" width={12} />
              )}
              <div>
                <Button variant="primary" onClick={() => handleCalcularDiarias(Frm)} className="ms-2">Gerar Memória de cálculo</Button>
              </div>
              </>
            )}
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
      const numericValue = value?.replace(/\D/g, '');
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

      Frm.set('totalDiaria', Number(totalDiaria.toFixed(2)).toString());
      Frm.set('totalAdicionalDeslocamento', Number(totalAdicionalDeslocamento.toFixed(2)).toString());
      Frm.set('totalDescontoAlimentacao', Number(totalDescontoAlimentacao.toFixed(2)).toString());
      Frm.set('totalDescontoTransporte', Number(totalDescontoTransporte).toFixed(2));
      Frm.set('totalSubtotal', Number(totalSubtotal).toFixed(2));
      Frm.set('totalDescontoTeto', Number(totalDescontoTeto).toFixed(2));
      Frm.set('total', Number(total).toFixed(2));
      

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
      const trajeto = data.trechos?.find((t: any) => new Date(t.dataTrecho).getTime() === currentDate.getTime());
      console.log(trajeto);
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
  
    function formatFloatValue(value: number): string {
      return value?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    }

    return <>
      <div className="scrollableContainer">
        {data.solicitacaoDeslocamento && (
          <>
            <h4>Dados da Solicitação de Deslocamento</h4>
            <p><strong>Data da Solicitação:</strong> {data.dataAtual || 'Não informado'}</p>
            <p><strong>Proponente:</strong> {data.proponente?.descricao || 'Não informado'}</p>
            <p><strong>Matrícula:</strong> {data.proponente?.sigla || 'Não informado'}</p>
            <p><strong>Tipo de Beneficiário:</strong> {getOptionName(tipoBeneficiarioOptions, data.tipoBeneficiario)}</p>
            <p><strong>Beneficiário:</strong> {data.pessoa?.descricao || 'Não informado'}</p>
            <p><strong>Matrícula:</strong> {data.pessoa?.sigla || 'Não informado'}</p>
            <p><strong>Função:</strong> {data.funcaoPessoa || 'Não informado'}</p>
            <p><strong>Cargo:</strong> {data.cargoPessoa || 'Não informado'}</p>
            <p>Banco: {data.banco || 'Não informado'}  Agência: {data.agencia || 'Não informado'}   Conta: {data.conta || 'Não informado'}</p>
            <p><strong>Faixa:</strong> {getOptionName(faixaOptions, data.faixa)}</p>
            <p><strong>Acréscimo (art. 10, V):</strong> {getOptionName(acrescimoOptions, data.acrescimo)}</p>
            <p><strong>Tipo de Diária:</strong> {getOptionName(tipoDiariaOptions, data.tipoDiaria)}</p>
            <p><strong>É prorrogação?:</strong> {data.prorrogacao === '1' ? 'Sim' : 'Não'}</p>
            <p><strong>Serviço ou atividade a ser desenvolvida, Órgão e Local:</strong> {data.servicoAtividade || 'Não informado'}</p>
            <p><strong>Período:</strong> De {data.periodoDe} até {data.periodoAte}</p>
            <p><strong>Justificativa:</strong> {data.justificativa || 'Não informado'}</p>
            <p><strong>Tipo de Deslocamento:</strong> {getOptionName(tipoDeslocamentoOptions, data.tipoDeslocamento)}</p>
            <p><strong>Meio de Transporte:</strong> {getOptionName(meioTransporteOptions, data.meioTransporte)}</p>
            {data.trechos?.length > 0 && (
              <>
                <h4>Trechos</h4>
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th>Data Inicial</th>
                      <th>Data Final</th>
                      <th>Trecho</th>
                      <th>Transporte até o embarque</th>
                      <th>Transporte até o destino</th>
                      <th>Hospedagem fornecida</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.trechos.map((trajeto: any, i: number) => (
                      <tr key={i}>
                        <td>{formatDateToBrazilian(trajeto.dataTrechoInicial)}</td>
                        <td>{formatDateToBrazilian(trajeto.dataTrechoFinal)}</td>
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
        {data.resultadoCalculo === '1' && (
          <>
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
          </>
        )}
        {data.resultadoCalculo === '2' && (
          <>
            <h4>Informação manual de cálculo</h4>
            <p><strong>Justificativa para informar manualmente o resultado do cálculo:</strong> {data.justificativaManual || 'Não informado'}</p>
            <p><strong>Valor bruto das diárias:</strong> {formatFloatValue(data.resultadoCalculoDiarias?.totalDeDiariasBruto || '0' || '0')}</p>
            <p><strong>Valor adicional de deslocamento:</strong> {formatFloatValue(data.resultadoCalculoDiarias?.totalDeAcrescimoDeDeslocamento || '0')}</p>
            <p><strong>Valor do desconto de auxílio alimentação:</strong> {formatFloatValue(data.resultadoCalculoDiarias?.totalDeDescontoDeAuxilioAlimentacao || '0')}</p>
            <p><strong>Valor do desconto de auxílio transporte:</strong> {formatFloatValue(data.resultadoCalculoDiarias?.totalDeDescontoDeAuxilioTransporte || '0')}</p>
            <p><strong>Subtotal bruto das diárias:</strong> {formatFloatValue(data.resultadoCalculoDiarias?.subtotalBruto || '0')}</p>
            <p><strong>Desconto de teto:</strong> {formatFloatValue(data.resultadoCalculoDiarias?.totalDeDescontoDeTeto  || '0')}</p>
            <p><strong>Valor líquido das diárias:</strong> {formatFloatValue(data.resultadoCalculoDiarias?.subtotalLiquido || '0')}</p>
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
              {data.resultadoCalculoDiarias?.dias?.map((dia, i) => (
          <tr key={i}>
            <td>{dia.data}</td>
            <td>{dia.trecho}</td>
            <td>{formatFloatValue(dia.diaria)}</td>
            <td>{formatFloatValue(dia.acrescimoDeDeslocamento)}</td>
            <td>{formatFloatValue(dia.descontoDeAuxilioAlimentacao)}</td>
            <td>{formatFloatValue(dia.descontoDeAuxilioTransporte)}</td>
            <td>{formatFloatValue(dia.subtotalBruto)}</td>
            <td>{formatFloatValue(dia.descontoDeTeto)}</td>
            <td>{formatFloatValue(dia.subtotalLiquido)}</td>
          </tr>
              ))}
              <tr>
          <td colSpan={2}><strong>Total</strong></td>
            <td>{formatFloatValue(data.resultadoCalculoDiarias?.totalDeDiariasBruto || '0')}</td>
            <td>{formatFloatValue(data.resultadoCalculoDiarias?.totalDeAcrescimoDeDeslocamento || '0')}</td>
            <td>{formatFloatValue(data.resultadoCalculoDiarias?.totalDeDescontoDeAuxilioAlimentacao) || '0'}</td>
            <td>{formatFloatValue(data.resultadoCalculoDiarias?.totalDeDescontoDeAuxilioTransporte) || '0'}</td>
            <td>{formatFloatValue(data.resultadoCalculoDiarias?.subtotalBruto) || '0'} </td>
            <td>{formatFloatValue(data.resultadoCalculoDiarias?.totalDeDescontoDeTeto || '0')}</td>
            <td>{formatFloatValue(data.resultadoCalculoDiarias?.subtotalLiquido) || '0'}</td>
              </tr>
            </tbody>
          </table>
        )}
        {// JSON.stringify(data)
        }
      </div>
    </>
  }

  return Model(interview, document, { saveButton: true, pdfButton: false, pdfFileName: 'CalculoDeDiarias' })
}
function getOptionName(options: { id: string, name: string }[], id: string) {
  return options.find(opt => opt.id === id)?.name || 'Não informado';
}

