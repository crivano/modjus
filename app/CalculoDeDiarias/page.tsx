'use client'

import Model from "@/libs/model"
import { FormHelper } from "@/libs/form-support"
import { useState, useEffect, ChangeEvent, useMemo } from "react"
import { Button } from 'react-bootstrap'
import axios from 'axios'
import Pessoa from "@/components/sei/Pessoa"
import DynamicListTrajetoV1 from "@/components/sei/DynamicListTrajetoV1"
import ErrorPopup from '@/components/ErrorPopup' // Adjust the import path as necessary
import { calcularDiarias, DeslocamentoConjuntoEnum, FaixaEnum, TipoDeDiariaEnum } from '@/components/utils/calculaDiarias' // Adjust the import path as necessary
import { upperCase } from "lodash"
import { stringify } from "querystring"



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

export default function CalculoDeDiarias() {

  interface FormData {
    valorUnitatioDaDiaria?: string;
    valorUnitarioDaDiariaParaCalculoDoDeslocamento?: string;
    faixa?: string;
    deslocamentoConjunto?: string;
    internacional?: string;
    cotacaoDoDolar?: string;
    tipoDiaria?: string;
    tipoDeslocamento?: string;
    prorrogacao?: string;
    valorJaRecebidoPreviamente?: string;
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
  const [fetchedDataAVD, setFetchedDataAVD] = useState(null);
  const [solicitacaoOptions, setSolicitacaoOptions] = useState<{ id: string; name: string; data?: any }[]>([{ id: '', name: '' }]);
  const [selectedSolicitacao, setSelectedSolicitacao] = useState(null);
  const [dataFetched, setDataFetched] = useState(false);

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

  const Frm = useMemo(() => new FormHelper(), []);

  useEffect(() => {
    if (Frm.data && Frm.data.solicitacaoDeslocamento) {
      fetchProcessData(Frm.data.processo);
    }
  }, [Frm.data]);

  async function fetchProcessDataAVD(numeroProcesso: string) {
    try {
      // 🔹 Faz a requisição para o backend Next.js
      const response = await axios.get<{ modjusData: any, numero_documento: string }[]>(
        '/api/getmodjus', {
        params: {
          num_processo: numeroProcesso,
          tipo_documento: "AVD" // Novo parâmetro
        },
        headers: {
          Authorization: `Bearer ${process.env.API_AUTH}`,
          "x-secret-key": '123456', // Certifique-se de que a variável está configurada
        },
      }
      );
      console.log(response.data);
      setFetchedDataAVD(response.data);
      // setSolicitacaoOptions([{ id: '', name: '' }, ...response.data.map((item: { modjusData: any, numero_documento: string }) => ({
      //   id: item.modjusData.id,
      //   name: item.numero_documento,
      //   data: item.modjusData // Store the entire data
      // }))]);
    } catch (error) {
      setError('Não foi possível encontrar os dados da Atualização dos Valores das Diárias (AVD). Verifique se o documento existe e se ele está assinado.');
    }
  }

  useEffect(() => {
    fetchProcessDataAVD("#");
  }, []);

  const avd = fetchedDataAVD ? fetchedDataAVD[0] : "";

  const processo = avd.modjusData?.processo || ""; // Obtém o número do processo

  const membro_exterior = avd.modjusData?.membro_diaria_exterior || 0;
  const membro_nacional = avd.modjusData?.membro_diaria_nacional || 0;
  const membro_meia = avd.modjusData?.membro_meia_diaria || 0;

  const desembargador_exterior = avd.modjusData?.desembargador_diaria_exterior || 0;
  const desembargador_nacional = avd.modjusData?.desembargador_diaria_nacional || 0;
  const desembargador_meia = avd.modjusData?.desembargador_meia_diaria || 0;

  const juiz_exterior = avd.modjusData?.juiz_diaria_exterior || 0;
  const juiz_nacional = avd.modjusData?.juiz_diaria_nacional || 0;
  const juiz_meia = avd.modjusData?.juiz_meia_diaria || 0;

  const analista_exterior = avd.modjusData?.analista_diaria_exterior || 0;
  const analista_nacional = avd.modjusData?.analista_diaria_nacional || 0;
  const analista_meia = avd.modjusData?.analista_meia_diaria || 0;

  const tecnico_exterior = avd.modjusData?.tecnico_diaria_exterior || 0;
  const tecnico_nacional = avd.modjusData?.tecnico_diaria_nacional || 0;
  const tecnico_meia = avd.modjusData?.tecnico_meia_diaria || 0;

  // Outros valores
  const valorTetoDiariaNacionalAuxilioAlimentacao = avd.modjusData?.valorTetoDiariaNacionalAuxilioAlimentacao || 0;
  const valorTetoMeiaDiariaNacionalAuxilioAlimentacao = avd.modjusData?.valorTetoMeiaDiariaNacionalAuxilioAlimentacao || 0;
  const valorUnitarioDoAuxilioAlimentacao = avd.modjusData?.valorUnitarioDoAuxilioAlimentacao || 0;

  const tabelaDeDiariasAuxilioAlimentacao = {
    "Membro do Conselho": { "exterior": membro_exterior, "nacional": membro_nacional, "meia": membro_meia },
    "Desembargador Federal": { "exterior": desembargador_exterior, "nacional": desembargador_nacional, "meia": desembargador_meia },
    "Juiz Federal de 1º Grau/Juiz Federal Substituto": { "exterior": juiz_exterior, "nacional": juiz_nacional, "meia": juiz_meia },
    "Analista Judiciário/Cargo em Comissão": { "exterior": analista_exterior, "nacional": analista_nacional, "meia": analista_meia },
    "Técnico Judiciário/Auxiliar Judiciário/Função Comissionada": { "exterior": tecnico_exterior, "nacional": tecnico_nacional, "meia": tecnico_meia }
  };

  async function fetchProcessData(numeroProcesso: string) {
    try {
      // 🔹 Faz a requisição para o backend Next.js
      const response = await axios.get<{ modjusData: any, numero_documento: string }[]>(
        '/api/getmodjus', {
        params: {
          num_processo: numeroProcesso,
          tipo_documento: "SOL" // Novo parâmetro
        },
        headers: {
          Authorization: `Bearer ${process.env.API_AUTH}`,
          "x-secret-key": '123456', // Certifique-se de que a variável está configurada
        },
      }
      );
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

  const calcularFaixa = (benefAcrescimo, calcCargoFuncao) => {
    if (benefAcrescimo !== "Nenhum") {
      if (benefAcrescimo === "Equipe de Trabalho") {
        return "Maior Faixa na Equipe de Trabalho";
      }
      if (benefAcrescimo === "Segurança de Magistrado") {
        return "Faixa do Magistrado";
      }
      return "Faixa da Autoridade";
    }
    return calcCargoFuncao || "";
  };

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
        Frm.set('dataAtual', solicitacaoData.dataAtual || '');
        Frm.set('proponente', {
          descricao: solicitacaoData.proponente?.descricao || '', sigla: solicitacaoData.proponente?.sigla || ''
        });
        Frm.set('funcaoProponente', solicitacaoData.funcaoProponente || '');
        Frm.set('cargoProponente', solicitacaoData.cargoProponente || '');
        // Se o beneficiário for Colaborador ou Colaborador Eventual, habilita os campos de valor diário
        if (solicitacaoData.tipoBeneficiario > '1') {
          Frm.set('valorDiarioAuxAlimentacao', solicitacaoData.valorDiarioAuxAlimentacao || '')
          Frm.set('valorDiarioAuxTransporte', solicitacaoData.valorDiarioAuxTransporte || '')
          Frm.set('nome', solicitacaoData.nomePessoa || '')
          Frm.set('CPF', solicitacaoData.cpfPessoa || '');
          Frm.set('banco', solicitacaoData.bancoColaborador || '');
          Frm.set('agencia', solicitacaoData.agenciaColaborador || '');
          Frm.set('conta', solicitacaoData.contaColaborador || '');
        } else {
          Frm.set('pessoa', {
            descricao: solicitacaoData.pessoa?.descricao || '', sigla: solicitacaoData.pessoa?.sigla || ''
          });
          Frm.set('funcaoPessoa', solicitacaoData.funcaoPessoa || '');
          Frm.set('cargoPessoa', solicitacaoData.cargoPessoa || '');
          Frm.set('banco', solicitacaoData.banco || '');
          Frm.set('agencia', solicitacaoData.agencia || '');
          Frm.set('conta', solicitacaoData.conta || '');
        }

        Frm.set('tipoBeneficiario', solicitacaoData.tipoBeneficiario || '')

        Frm.set('faixa', solicitacaoData.faixa || '');
        Frm.set('acrescimo', solicitacaoData.acrescimo || '');
        Frm.set('tipoDiaria', solicitacaoData.tipoDiaria || '');
        Frm.set('prorrogacao', solicitacaoData.prorrogacao || '');
        Frm.set('valorJaRecebidoPreviamente', solicitacaoData.valorJaRecebidoPreviamente || '');
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

  function handleAuxiliosChange(event: React.ChangeEvent<HTMLSelectElement>, Frm: FormHelper) {
    if (Frm.get('tipoBeneficiario') > 1) {
      Frm.set('valorAuxilioAlimentacao', 0)
      Frm.set('valorAuxilioTransporte', 0)
    } else {
      const selectedAuxilio = event.target.value;
      const valorAuxilioTransportealimentacao = valorUnitarioDoAuxilioAlimentacao;
      Frm.set('valorAuxilioAlimentacao', valorAuxilioTransportealimentacao);

      if (selectedAuxilio === '1') {
        fetchAuxilioTransporte(Frm.data.pessoa.sigla).then(auxilioTransporte => {
          Frm.set('valorAuxilioTransporte', auxilioTransporte);
        });
        Frm.data.valorAuxilioTransporte = parseFloat(Frm.data.valorAuxilioTransporte);
      }
    }
  }

  function obterValorDiaria(faixaId, isInternacional, tipoDiariaParam) {
    const faixa = faixaOptions.find(f => f.id === faixaId);
    console.log(faixa.name);
    if (!faixa || !faixa.name) return 0; // Retorna 0 se a faixa não for encontrada

    const tipoDiaria = isInternacional ? 'exterior' : tipoDiariaParam === '1' ? 'nacional' : tipoDiariaParam === '2' ? 'meia' : 'Sem Diária';

    return tabelaDeDiariasAuxilioAlimentacao[faixa.name]?.[tipoDiaria] || 0;
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

    const parseDate = (dateStr: string) => {
      if (!dateStr) return new Date();
      const [year, month, day] = dateStr.split('-').map(Number);
      return new Date(year, month - 1, day); // Garantindo fuso local sem ajustes inesperados
    };

    const result = calcularDiarias(
      // Pass the necessary parameters from formData
      parseFloat(Number(obterValorDiaria(Frm.data.faixaCalcDiaria ? Frm.data.faixaCalcDiaria : Frm.data.faixa, Frm.data.internacional === '1', Frm.data.tipoDiaria) || '0').toFixed(2)),
      parseFloat(Number(obterValorDiaria('4', Frm.data.internacional === '1', Frm.data.tipoDiaria) || '0').toFixed(2)),
      calcularFaixa(Frm.data.deslocamentoConjunto, Frm.data.faixaCalcDiaria ? Frm.data.faixaCalcDiaria : Frm.data.faixa),
      Frm.data.acrescimo,
      Frm.data.tipoDeslocamento === '2',
      parseFloat(Number(Frm.data.cotacaoDoDolar || '0').toFixed(2)),
      tipoDiariaMap[Frm.data.tipoDiaria],
      Frm.data.prorrogacao === '1',
      parseFloat(Number(Frm.data.valorJaRecebidoPreviamente || '0').toFixed(2)),
      parseFloat(Number(Frm.data.valorAuxilioAlimentacao || '0').toFixed(2)),
      parseFloat(Number(Frm.data.valorAuxilioTransporte || '0').toFixed(2)),
      parseFloat(Number(valorTetoDiariaNacionalAuxilioAlimentacao || '0').toFixed(2)),
      parseFloat(Number(valorTetoMeiaDiariaNacionalAuxilioAlimentacao || '0').toFixed(2)),
      trechos_para_calcular || [],
      Frm.data.feriados?.map(parseDate) || [],
      Frm.data.diasSemDiaria?.map(parseDate) || []
    );

    console.log('Resultado do cálculo:', result);

    Frm.set('resultadoCalculoDiarias', result || {});
    Frm.set('totalDiaria', result.totalDeDiariasBruto);
    Frm.set('totalAdicionalDeslocamento', result.totalDeAcrescimoDeDeslocamento);
    Frm.set('totalDescontoAlimentacao', result.totalDeDescontoDeAuxilioAlimentacao);
    Frm.set('totalDescontoTransporte', result.totalDeDescontoDeAuxilioTransporte);
    Frm.set('totalSubtotal', result.subtotalBruto);
    Frm.set('totalDescontoTeto', result.totalDeDescontoDeTeto);
    Frm.set('total', result.subtotalLiquido);
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
      Frm.set('totalDescontoTeto', parseFloat(Frm.data.resultadoCalculoDiarias?.totalDeDescontoDeTeto).toFixed(2));
      Frm.set('total', parseFloat(Frm.data.resultadoCalculoDiarias?.subtotalLiquido).toFixed(2));

      Frm.update({ ...formData, resultadoCalculo: selectedOption }, setFormData);
    }
  }

  function Interview(Frm: FormHelper) {

    useEffect(() => {
      if (Frm.data && Frm.data.processo && !dataFetched) {
        fetchProcessData(Frm.data.processo).then(() => {
          if (Frm.data.solicitacaoDeslocamento) {
            handleSolicitacaoChange({ target: { value: Frm.data.solicitacaoDeslocamento } } as React.ChangeEvent<HTMLSelectElement>, Frm);
          }
          if (Frm.data && Frm.data.auxilios === '1' && !dataFetched) {
            handleAuxiliosChange({ target: { value: Frm.data.auxilios } } as React.ChangeEvent<HTMLSelectElement>, Frm);
          }
          setDataFetched(true);
        });
      }

    });

    return <>
      <div className="scrollableContainer">
        {
          // div hidden para não aparecer na tela de entrevista mas criar a estrutura do data
        }
        <div style={{ display: 'none' }}>
          <Frm.dateInput label="Data da Solicitação" name="dataAtual" width={6} />
          <h2>Dados do Proponente</h2>
          <Pessoa Frm={Frm} name="proponente" label1="Matrícula" label2="Nome" />
          <div className="row">
            <Frm.Input label="Função" name="funcaoProponente" width={6} />
            <Frm.Input label="Cargo" name="cargoProponente" width={6} />
          </div>

          <div style={{ marginTop: '20px' }}></div> {/* Add spacing */}

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
            <Frm.RadioButtons label="É prorrogação?" name="prorrogacao" options={[{ id: '1', name: 'Sim' }, { id: '2', name: 'Não' }]} width={12} />
            {(Frm.get('prorrogacao') === '1') && <Frm.Input label="Valor já recebido previamente : " name="valorJaRecebidoPreviamente" width={12} />}

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

        {fetchedDataAVD && (
          <div style={{ margin: "16px 0" }}>
            <h4 style={{ fontSize: "1rem", color: "#888", fontWeight: 400, marginBottom: 8 }}>
              Tabela de Valores referente ao processo: {processo}
            </h4>
            <table style={{
              width: "100%",
              borderCollapse: "collapse",
              background: "#fafafa",
              fontSize: "0.85rem",
              color: "#666",
              border: "1px solid #eee"
            }}>
              <thead>
                <tr style={{ background: "#f5f5f5" }}>
                  <th style={{ border: "1px solid #eee", padding: "4px 6px", fontWeight: 500 }}>Cargo/Função</th>
                  <th style={{ border: "1px solid #eee", padding: "4px 6px", fontWeight: 500 }}>Diária Exterior</th>
                  <th style={{ border: "1px solid #eee", padding: "4px 6px", fontWeight: 500 }}>Diária Nacional</th>
                  <th style={{ border: "1px solid #eee", padding: "4px 6px", fontWeight: 500 }}>Meia Diária</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ border: "1px solid #eee", padding: "4px 6px" }}>Membro do Conselho</td>
                  <td style={{ border: "1px solid #eee", padding: "4px 6px", textAlign: "right" }}>{formatFloatValue(membro_exterior)}</td>
                  <td style={{ border: "1px solid #eee", padding: "4px 6px", textAlign: "right" }}>{formatFloatValue(membro_nacional)}</td>
                  <td style={{ border: "1px solid #eee", padding: "4px 6px", textAlign: "right" }}>{formatFloatValue(membro_meia)}</td>
                </tr>
                <tr>
                  <td style={{ border: "1px solid #eee", padding: "4px 6px" }}>Desembargador Federal</td>
                  <td style={{ border: "1px solid #eee", padding: "4px 6px", textAlign: "right" }}>{formatFloatValue(desembargador_exterior)}</td>
                  <td style={{ border: "1px solid #eee", padding: "4px 6px", textAlign: "right" }}>{formatFloatValue(desembargador_nacional)}</td>
                  <td style={{ border: "1px solid #eee", padding: "4px 6px", textAlign: "right" }}>{formatFloatValue(desembargador_meia)}</td>
                </tr>
                <tr>
                  <td style={{ border: "1px solid #eee", padding: "4px 6px" }}>Juiz Federal de 1º Grau/Juiz Federal Substituto</td>
                  <td style={{ border: "1px solid #eee", padding: "4px 6px", textAlign: "right" }}>{formatFloatValue(juiz_exterior)}</td>
                  <td style={{ border: "1px solid #eee", padding: "4px 6px", textAlign: "right" }}>{formatFloatValue(juiz_nacional)}</td>
                  <td style={{ border: "1px solid #eee", padding: "4px 6px", textAlign: "right" }}>{formatFloatValue(juiz_meia)}</td>
                </tr>
                <tr>
                  <td style={{ border: "1px solid #eee", padding: "4px 6px" }}>Analista Judiciário/Cargo em Comissão</td>
                  <td style={{ border: "1px solid #eee", padding: "4px 6px", textAlign: "right" }}>{formatFloatValue(analista_exterior)}</td>
                  <td style={{ border: "1px solid #eee", padding: "4px 6px", textAlign: "right" }}>{formatFloatValue(analista_nacional)}</td>
                  <td style={{ border: "1px solid #eee", padding: "4px 6px", textAlign: "right" }}>{formatFloatValue(analista_meia)}</td>
                </tr>
                <tr>
                  <td style={{ border: "1px solid #eee", padding: "4px 6px" }}>Técnico Judiciário/Auxiliar Judiciário/Função Comissionada</td>
                  <td style={{ border: "1px solid #eee", padding: "4px 6px", textAlign: "right" }}>{formatFloatValue(tecnico_exterior)}</td>
                  <td style={{ border: "1px solid #eee", padding: "4px 6px", textAlign: "right" }}>{formatFloatValue(tecnico_nacional)}</td>
                  <td style={{ border: "1px solid #eee", padding: "4px 6px", textAlign: "right" }}>{formatFloatValue(tecnico_meia)}</td>
                </tr>
              </tbody>
            </table>
            <h6 className="pt-2">Outros Valores:</h6>
            <div style={{ fontSize: "1rem", color: "#888", fontWeight: 400, marginBottom: 8 }}>
              Valor do Teto Diária Nacional: {formatFloatValue(valorTetoDiariaNacionalAuxilioAlimentacao)}
            </div>
            <div style={{ fontSize: "1rem", color: "#888", fontWeight: 400, marginBottom: 8 }}>
              Valor do Teto Meia Diária Nacional: {formatFloatValue(valorTetoMeiaDiariaNacionalAuxilioAlimentacao)}
            </div>
            <div style={{ fontSize: "1rem", color: "#888", fontWeight: 400, marginBottom: 8 }}>
              Valor Unitário para desconto do Auxilío ALimentação: {formatFloatValue(valorUnitarioDoAuxilioAlimentacao)}
            </div>

          </div>
        )}

        <h2>Cálculo de Diárias</h2>

        {fetchedData && (
          <Frm.Select label="Selecione a solicitação de deslocamento para o cálculo" name="solicitacaoDeslocamento" options={solicitacaoOptions} onChange={(event) => handleSolicitacaoChange(event, Frm)} width={12} />
        )}

        {Frm.data && Frm.data.solicitacaoDeslocamento && (
          <>
            <Frm.Select
              label="Obter automaticamente o resultado do cálculo de diária"
              name="resultadoCalculo"
              options={resultadoCalculoOptions}
              onChange={(event) => handleFormaDeCalculo(event, Frm)}
              width={12}
            />
            {Frm.get('acrescimo') !== '1' && Frm.get('acrescimo') === '2' && (
              <Frm.Select
                label="Maior Faixa na Equipe de Trabalho"
                name="faixaCalcDiaria"
                options={faixaOptions}
                width={12}
              />
            )}
            {Frm.get('acrescimo') !== '1' && Frm.get('acrescimo') === '5' && (
              <Frm.Select
                label="Faixa do Magistrado"
                name="faixaCalcDiaria"
                options={faixaOptions}
                width={12}
              />
            )}
            {Frm.get('acrescimo') !== '1' && Frm.get('acrescimo') !== '5' && Frm.get('acrescimo') !== '2' && (
              <Frm.Select
                label="Faixa da Autoridade"
                name="faixaCalcDiaria"
                options={faixaOptions}
                width={12}
              />
            )}

            {Frm.get('resultadoCalculo') != '2' && (
              <div style={{ display: 'none' }}>
                <Frm.TextArea label="Justificativa para informar manualmente o resultado do cálculo" name="justificativaManual" width={12} />
                <Frm.MoneyInputFloat label="Valor bruto das diárias" name="totalDiaria" width={12} />
                <Frm.MoneyInputFloat label="Valor adicional de deslocamento" name="totalAdicionalDeslocamento" width={12} />
                <Frm.MoneyInputFloat label="Valor do desconto de auxílio alimentação" name="totalDescontoAlimentacao" width={12} />
                <Frm.MoneyInputFloat label="Valor do desconto de auxílio transporte" name="totalDescontoTransporte" width={12} />
                <Frm.MoneyInputFloat label="Subtotal bruto das diárias" name="totalSubtotal" width={12} />
                <Frm.MoneyInputFloat label="Desconto de teto" name="totalDescontoTeto" width={12} />
                <Frm.MoneyInputFloat label="Valor líquido das diárias" name="total" width={12} />
              </div>
            )}

            {Frm.get('resultadoCalculo') === '2' && (
              <>
                <Frm.TextArea label="Justificativa para informar manualmente o resultado do cálculo" name="justificativaManual" width={12} />
                <Frm.MoneyInputFloat label="Valor bruto das diárias" name="totalDiaria" width={12} />
                <Frm.MoneyInputFloat label="Valor adicional de deslocamento" name="totalAdicionalDeslocamento" width={12} />
                <Frm.MoneyInputFloat label="Valor do desconto de auxílio alimentação" name="totalDescontoAlimentacao" width={12} />
                <Frm.MoneyInputFloat label="Valor do desconto de auxílio transporte" name="totalDescontoTransporte" width={12} />
                <Frm.MoneyInputFloat label="Subtotal bruto das diárias" name="totalSubtotal" width={12} />
                <Frm.MoneyInputFloat label="Desconto de teto" name="totalDescontoTeto" width={12} />
                <Frm.MoneyInputFloat label="Valor líquido das diárias" name="total" width={12} />
              </>
            )}

            {Frm.get('resultadoCalculo') === '1' && Frm.data.tipoBeneficiario === '1' && (
              <Frm.Select label="Obter automaticamente auxílios alimentação e transporte" name="auxilios" options={auxiliosOptions} onChange={(event) => handleAuxiliosChange(event, Frm)} width={12} />
            )}

            {Frm.get('auxilios') === '2' && Frm.get('tipoBeneficiario') === '1' && (
              <>
                <Frm.MoneyInputFloat label="Valor diário do auxílio alimentação" name="valorAuxilioAlimentacao" width={12} />
                <Frm.MoneyInputFloat label="Valor diário do auxílio transporte" name="valorAuxilioTransporte" width={12} />
              </>
            )}

            {Frm.get('resultadoCalculo') === '1' && (
              <>
                <Frm.FeriadosInput label="Quantidade de feriados durante o deslocamento" name="feriados" width={12} />
                <p style={{ marginTop: '1px', marginBottom: '0' }}>Nos feriados, assim como nos fins de semana, não serão descontados o auxílio alimentação e o auxílio transporte</p>
                <Frm.FeriadosInput label="Quantidade de dias em que não será paga a diária durante o deslocamento" name="diasSemDiaria" width={12} />
                <p style={{ marginTop: '1px', marginBottom: '0' }}>Nos dias em que não for paga a diária, assim como nos fins de semana, não serão descontados o auxílio alimentação e o auxílio transporte</p>
                {Frm.data.tipoDeslocamento === '2' && (
                  <Frm.MoneyInputFloat label="Cotação do Dólar" name="cotacaoDoDolar" width={12} />
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

    const transporteOptions = [
      { id: '1', name: 'Com adicional de deslocamento' },
      { id: '2', name: 'Sem adicional de deslocamento' },
      { id: '3', name: 'Veículo oficial' }
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
        valorBrutoDiarias: data.valorBrutoDiarias || '0',
        valorAdicionalDeslocamento: data.valorAdicionalDeslocamento || '0',
        valorDescontoAlimentacao: data.valorDescontoAlimentacao || '0',
        valorDescontoTransporte: data.valorDescontoTransporte || '0',
        subtotalBrutoDiarias: data.subtotalBrutoDiarias || '0',
        descontoTeto: data.descontoTeto || '0',
        valorLiquidoDiarias: data.valorLiquidoDiarias || '0'
      };
    });

    const formatFloatValue = (value: number): string => {
      return value?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    }

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

    const formatName = (value: string) => {
      return value?.toUpperCase();
    };

    return <>
      <div className="scrollableContainer">
        {data.solicitacaoDeslocamento && (
          <>
            <h4>Dados da Solicitação de Deslocamento</h4>
            <p><strong>Data da Solicitação:</strong> {data.dataAtual || 'Não informado'}</p>
            <p><strong>Proponente:</strong> {data.proponente?.descricao || 'Não informado'}</p>
            <p><strong>Matrícula:</strong> {data.proponente?.sigla || 'Não informado'}</p>
            <p><strong>Tipo de Beneficiário:</strong> {getOptionName(tipoBeneficiarioOptions, data.tipoBeneficiario)}</p>

            {data.tipoBeneficiario > '1' && <>
              <p><strong>Beneficiário:</strong> {formatName(data.nome) || 'Não informado'}</p>
              <p><strong>CPF:</strong> {formatCPF(data.CPF) || 'Não informado'}</p>
              {/* <p><strong>Valor Diário do Aux. Alimentação:</strong> {formatFloatValue(data.valorDiarioAuxAlimentacao) || 'Não informado'}</p>
              <p><strong>Valor Diário do Aux. Transporte:</strong> {formatFloatValue(data.valorDiarioAuxTransporte) || 'Não informado'}</p> */}
            </>
            }
            {console.log(data.pessoa?.descricao)}
            {data.tipoBeneficiario === '1' &&
              <>
                <p><strong>Beneficiário:</strong> {data.pessoa?.descricao || 'Não informado'}</p>
                <p><strong>Matrícula:</strong> {data.pessoa?.sigla || 'Não informado'}</p>
                <p><strong>Função:</strong> {data.funcaoPessoa || 'Não informado'}</p>
                <p><strong>Cargo:</strong> {data.cargoPessoa || 'Não informado'}</p>
              </>
            }
            <p>Banco: {data.banco || 'Não informado'}  Agência: {data.agencia || 'Não informado'}   Conta: {data.conta || 'Não informado'}</p>
            <p><strong>Faixa:</strong> {getOptionName(faixaOptions, data.faixa)}</p>
            <p><strong>Acréscimo (art. 10, V):</strong> {getOptionName(acrescimoOptions, data.acrescimo)}</p>
            <p><strong>Tipo de Diária:</strong> {getOptionName(tipoDiariaOptions, data.tipoDiaria)}</p>
            <p><strong>É prorrogação?:</strong> {data.prorrogacao === '1' ? 'Sim' : 'Não'}</p>
            {data.prorrogacao === '1' && <p><strong>Valor já recebido previamente:</strong> {formatFloatValue(data.valorJaRecebidoPreviamente || 0.00)}</p>}
            <p><strong>Serviço ou atividade a ser desenvolvida, Órgão e Local:</strong> {data.servicoAtividade || 'Não informado'}</p>
            <p><strong>Período:</strong> De {data.periodoDe} até {data.periodoAte}</p>
            <p><strong>Justificativa:</strong> {data.justificativa || 'Não informado'}</p>
            <p><strong>Tipo de Deslocamento:</strong> {getOptionName(tipoDeslocamentoOptions, data.tipoDeslocamento)}</p>
            <p><strong>Meio de Transporte:</strong> {getOptionName(meioTransporteOptions, data.meioTransporte)}</p>
            {data.trechos?.length > 0 && (
              <>
                <h4>Trechos</h4>
                <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "center", border: "1px solid #ddd" }}>
                  <thead>
                    <tr style={{ backgroundColor: "#f2f2f2" }}>
                      <th style={{ border: "1px solid #ddd", padding: "8px" }}>Data Inicial</th>
                      <th style={{ border: "1px solid #ddd", padding: "8px" }}>Data Final</th>
                      <th style={{ border: "1px solid #ddd", padding: "8px" }}>Trecho</th>
                      <th style={{ border: "1px solid #ddd", padding: "8px" }}>Transporte até o embarque</th>
                      <th style={{ border: "1px solid #ddd", padding: "8px" }}>Transporte até o destino</th>
                      <th style={{ border: "1px solid #ddd", padding: "8px" }}>Hospedagem fornecida</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.trechos.map((trajeto: any, i: number) => (
                      <tr key={i} style={{ backgroundColor: i % 2 === 0 ? "#ffffff" : "#f9f9f9" }}>
                        <td style={{ border: "1px solid #ddd", padding: "8px" }}>{formatDateToBrazilian(trajeto.dataTrechoInicial)}</td>
                        <td style={{ border: "1px solid #ddd", padding: "8px" }}>{formatDateToBrazilian(trajeto.dataTrechoFinal)}</td>
                        <td style={{ border: "1px solid #ddd", padding: "8px" }}>{trajeto.origem || 'Não informado'} / {trajeto.destino || 'Não informado'}</td>
                        <td style={{ border: "1px solid #ddd", padding: "8px" }}>{getOptionName(transporteOptions, trajeto.transporteAteEmbarque)}</td>
                        <td style={{ border: "1px solid #ddd", padding: "8px" }}>{getOptionName(transporteOptions, trajeto.transporteAposDesembarque)}</td>
                        <td style={{ border: "1px solid #ddd", padding: "8px" }}>{getOptionName(hospedagemOptions, trajeto.hospedagem)}</td>
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
            <h4><strong>Parâmetros de Cálculo</strong></h4>
            <p><strong>Obter automaticamente auxílios alimentação e transporte:</strong> {getOptionName(auxiliosOptions, data.auxilios)}</p>
            {data.resultadoCalculo === '1' && (
              <>
                <p><strong>Valor diário do auxílio alimentação:</strong> {formatFloatValue(data.valorAuxilioAlimentacao || 0.00)}</p>
                <p><strong>Valor diário do auxílio transporte:</strong> {formatFloatValue(parseFloat(data.valorAuxilioTransporte) || 0.00)}</p>
              </>
            )}
            {data.acrescimo !== '1' && data.acrescimo === '2' && (
              <p><strong>Maior Faixa na Equipe de Trabalho:</strong> {getOptionName(faixaOptions, data.faixaCalcDiaria ? data.faixaCalcDiaria : data.faixa)}</p>
            )}
            {data.acrescimo !== '1' && data.acrescimo === '5' && (
              <p><strong>Faixa do Magistrado:</strong> {getOptionName(faixaOptions, data.faixaCalcDiaria ? data.faixaCalcDiaria : data.faixa)}</p>
            )}
            {data.acrescimo !== '1' && data.acrescimo !== '5' && data.acrescimo !== '2' && (
              <p><strong>Faixa da Autoridade:</strong> {getOptionName(faixaOptions, data.faixaCalcDiaria ? data.faixaCalcDiaria : data.faixa)}</p>
            )}
          </>
        )}
        {data.resultadoCalculo === '2' && (
          <>
            <h4>Informação manual de cálculo</h4>

            <p style={{ whiteSpace: 'pre-wrap', marginLeft: 0, fontWeight: 'bold' }}>
              <strong>Justificativa para informar manualmente o resultado do cálculo:</strong> <br />{data.justificativaManual || 'Não informado'}
            </p>


            <p><strong>Valor bruto das diárias:</strong> {formatFloatValue(parseFloat(data.totalDiaria || 0.00))}</p>
            <p><strong>Valor adicional de deslocamento:</strong> {formatFloatValue(parseFloat(data.totalAdicionalDeslocamento || 0.00))}</p>
            <p><strong>Valor do desconto de auxílio alimentação:</strong> {formatFloatValue(parseFloat(data.totalDescontoAlimentacao || 0.00))}</p>
            <p><strong>Valor do desconto de auxílio transporte:</strong> {formatFloatValue(parseFloat(data.totalDescontoTransporte || 0.00))}</p>
            <p><strong>Subtotal bruto das diárias:</strong> {formatFloatValue(parseFloat(data.totalSubtotal || 0.00))}</p>
            <p><strong>Desconto de teto:</strong> {formatFloatValue(parseFloat(data.totalDescontoTeto || 0.00))}</p>
            <p><strong>Valor líquido das diárias:</strong> {formatFloatValue(parseFloat(data.total || 0.00))}</p>
          </>
        )}

        {data.resultadoCalculo === '1' && (
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "center", border: "1px solid #ddd" }}>
            <thead>
              <tr style={{ backgroundColor: "#f2f2f2" }}>
                <th style={{ border: "1px solid #ddd", padding: "8px" }}>Data</th>
                <th style={{ border: "1px solid #ddd", padding: "8px" }}>Trecho</th>
                <th style={{ border: "1px solid #ddd", padding: "8px", textAlign: "right" }}>Valor da Diária</th>
                <th style={{ border: "1px solid #ddd", padding: "8px", textAlign: "right" }}>Adicional de Deslocamento</th>
                <th style={{ border: "1px solid #ddd", padding: "8px", textAlign: "right" }}>Desconto Auxílio Alimentação</th>
                <th style={{ border: "1px solid #ddd", padding: "8px", textAlign: "right" }}>Desconto Auxílio Transporte</th>
                <th style={{ border: "1px solid #ddd", padding: "8px", textAlign: "right" }}>Subtotal</th>
                <th style={{ border: "1px solid #ddd", padding: "8px", textAlign: "right" }}>Desconto Teto</th>
                <th style={{ border: "1px solid #ddd", padding: "8px", textAlign: "right" }}>Total</th>
              </tr>
            </thead>
            <tbody>
              {data.resultadoCalculoDiarias?.dias?.map((dia, i) => (
                <tr key={i} style={{ backgroundColor: i % 2 === 0 ? "#ffffff" : "#f9f9f9" }}>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>{dia.data}</td>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>{dia.trecho}</td>
                  <td style={{ border: "1px solid #ddd", padding: "8px", textAlign: "right" }}>{formatFloatValue(dia.diaria)}</td>
                  <td style={{ border: "1px solid #ddd", padding: "8px", textAlign: "right" }}>{formatFloatValue(dia.acrescimoDeDeslocamento)}</td>
                  <td style={{ border: "1px solid #ddd", padding: "8px", textAlign: "right" }}>{formatFloatValue(dia.descontoDeAuxilioAlimentacao)}</td>
                  <td style={{ border: "1px solid #ddd", padding: "8px", textAlign: "right" }}>{formatFloatValue(dia.descontoDeAuxilioTransporte)}</td>
                  <td style={{ border: "1px solid #ddd", padding: "8px", textAlign: "right" }}>{formatFloatValue(dia.subtotalBruto)}</td>
                  <td style={{ border: "1px solid #ddd", padding: "8px", textAlign: "right" }}>{formatFloatValue(dia.descontoDeTeto)}</td>
                  <td style={{ border: "1px solid #ddd", padding: "8px", textAlign: "right" }}>{formatFloatValue(dia.subtotalLiquido)}</td>
                </tr>
              ))}
              <tr style={{ backgroundColor: "#e0e0e0", fontWeight: "bold" }}>
                <td colSpan={2} style={{ border: "1px solid #ddd", padding: "8px" }}>Total</td>
                <td style={{ border: "1px solid #ddd", padding: "8px", textAlign: "right" }}>{formatFloatValue(parseFloat(data.resultadoCalculoDiarias?.totalDeDiariasBruto || 0.00))}</td>
                <td style={{ border: "1px solid #ddd", padding: "8px", textAlign: "right" }}>{formatFloatValue(parseFloat(data.resultadoCalculoDiarias?.totalDeAcrescimoDeDeslocamento || 0.00))}</td>
                <td style={{ border: "1px solid #ddd", padding: "8px", textAlign: "right" }}>{formatFloatValue(parseFloat(data.resultadoCalculoDiarias?.totalDeDescontoDeAuxilioAlimentacao || 0.00))}</td>
                <td style={{ border: "1px solid #ddd", padding: "8px", textAlign: "right" }}>{formatFloatValue(parseFloat(data.resultadoCalculoDiarias?.totalDeDescontoDeAuxilioTransporte || 0.00))}</td>
                <td style={{ border: "1px solid #ddd", padding: "8px", textAlign: "right" }}>{formatFloatValue(parseFloat(data.resultadoCalculoDiarias?.subtotalBruto || 0.00))} </td>
                <td style={{ border: "1px solid #ddd", padding: "8px", textAlign: "right" }}>{formatFloatValue(parseFloat(data.resultadoCalculoDiarias?.totalDeDescontoDeTeto || 0.00))}</td>
                <td style={{ border: "1px solid #ddd", padding: "8px", textAlign: "right" }}>{formatFloatValue(parseFloat(data.resultadoCalculoDiarias?.subtotalLiquido || 0.00))}</td>
              </tr>

            </tbody>
          </table>

        )}
        {data.resultadoCalculo === '1' && (
          <> <br>
          </br>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "center", border: "1px solid #ddd" }}>
              <tbody>
                <tr style={{ backgroundColor: "#ffffff", fontWeight: "bold" }}>
                  <td colSpan={6} style={{ border: "1px solid #ddd", padding: "8px" }}>Valor Líquido</td>
                  <td style={{ border: "1px solid #ddd", padding: "8px", textAlign: "right" }}>{formatFloatValue(parseFloat(data.resultadoCalculoDiarias?.subtotalLiquido || 0.00))}</td>

                </tr>

                {(data.resultadoCalculo === '1' && data?.prorrogacao === '1' && data?.valorJaRecebidoPreviamente) && (
                  <>
                    <tr style={{ backgroundColor: "#f9f9f9", fontWeight: "bold" }}>
                      <td colSpan={6} style={{ border: "1px solid #ddd", padding: "8px" }}>Valor já recebido</td>
                      <td style={{ border: "1px solid #ddd", padding: "8px", textAlign: "right" }}>{formatFloatValue(parseFloat(data.resultadoCalculoDiarias?.valorJaRecebido || 0.00))}</td>

                    </tr>
                    <tr style={{ backgroundColor: "#ffffff", fontWeight: "bold" }}>
                      <td colSpan={6} style={{ border: "1px solid #ddd", padding: "8px" }}>Total</td>
                      <td style={{ border: "1px solid #ddd", padding: "8px", textAlign: "right" }}>{formatFloatValue(parseFloat(data.resultadoCalculoDiarias?.total || 0.00))}</td>

                    </tr>
                  </>

                )} </tbody>
            </table> </>)}
        {// JSON.stringify(data)
        }
      </div>
    </>
  }

  const formatFloatValue = (value: number): string => {
    return value?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }


  return Model(Interview, document, { saveButton: true, pdfButton: false, pdfFileName: 'CalculoDeDiarias' })
}
function getOptionName(options: { id: string, name: string }[], id: string) {
  return options.find(opt => opt.id === id)?.name || 'Não informado';
}

