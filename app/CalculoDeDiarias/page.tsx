'use client'

import Model from "@/libs/model"
import { FormHelper } from "@/libs/form-support"
import { useState } from "react"
import axios from 'axios'
import ErrorPopup from '@/components/ErrorPopup' // Adjust the import path as necessary

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
  const [formData, setFormData] = useState({});
  const [error, setError] = useState("");
  const [fetchedData, setFetchedData] = useState(null);
  const [solicitacaoOptions, setSolicitacaoOptions] = useState([]);
  const Frm = new FormHelper();

  async function fetchProcessData(numeroProcesso: string) {
    try {
      const response = await axios.get('/api/getmodjusdocsprocess', {
        params: { num_processo: numeroProcesso, nome_documento: 'TRF2 - Solicitacao Deslocamento (modjus) modelo teste' },
        headers: {
          'Authorization': 'Basic YWRtaW46c2VuaGExMjM=',
          'x-forwarded-for': '172.16.10.91'
        }
      });
      setFetchedData(response.data);
      setSolicitacaoOptions((response.data as any[]).map((item: { modjusData: any, numero_documento: string }) => ({
        id: item.modjusData.id,
        name: item.numero_documento
      })));
    } catch (error) {
      setError('Não foi possível encontrar os dados adicionais');
    }
  }

  function interview(Frm: FormHelper) {
    return <>
      <div className="scrollableContainer">
        <h2>Cálculo de Diárias</h2>
        <Frm.InputWithButton label="Número do Processo" name="numeroProcesso" buttonText="Buscar" onButtonClick={fetchProcessData} width={12} />
        {fetchedData && (
          <Frm.Select label="Selecione a solicitação de deslocamento para o cálculo" name="solicitacaoDeslocamento" options={solicitacaoOptions} width={12} />
        )}
        <Frm.Select label="Informar manualmente o resultado do cálculo" name="resultadoCalculo" options={resultadoCalculoOptions} width={12} />
        {Frm.get('resultadoCalculo') === '1' && (
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
        <Frm.Select label="Obter automaticamente auxílios alimentação e transporte" name="auxilios" options={auxiliosOptions} width={12} />
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
        {error && <ErrorPopup message={error} onClose={() => setError("")} />}
        {fetchedData && (
          <div>
            <h3>Dados do Processo</h3>
            <pre>{JSON.stringify(fetchedData, null, 2)}</pre>
          </div>
        )}
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

    return <>
      <div className="scrollableContainer">
        <h4 style={{ textAlign: 'center' }}>CÁLCULO DE DIÁRIAS</h4>
        <p><strong>Número do Processo:</strong> {data.numeroProcesso || 'Não informado'}</p>
        <p><strong>Informar manualmente o resultado do cálculo:</strong> {getOptionName(resultadoCalculoOptions, data.resultadoCalculo)}</p>
        {data.resultadoCalculo === '1' && (
          <>
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
        <p><strong>Obter automaticamente auxílios alimentação e transporte:</strong> {getOptionName(auxiliosOptions, data.auxilios)}</p>
        {data.auxilios === '2' && (
          <>
            <p><strong>Valor do auxílio alimentação:</strong> {formatCurrency(data.valorAuxilioAlimentacao || '0')}</p>
            <p><strong>Valor do auxílio transporte:</strong> {formatCurrency(data.valorAuxilioTransporte || '0')}</p>
          </>
        )}
        <p><strong>Quantidade de feriados durante o deslocamento:</strong> {data.quantidadeFeriados || 'Não informado'}</p>
        <p><strong>Quantidade de dias em que não será paga a diária durante o deslocamento:</strong> {data.quantidadeDiasSemDiaria || 'Não informado'}</p>
      </div>
    </>
  }

  return Model(interview, document, { saveButton: true, pdfButton: true, pdfFileName: 'CalculoDeDiarias' })
}
