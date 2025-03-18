'use client'

import { useState } from 'react';
import { FormHelper } from "@/libs/form-support";
import Model from "@/libs/model"
import axios from 'axios'

const tipoBeneficiarioOptions = [
    { id: '', name: '' },
    { id: '1', name: 'TRF2/SJRJ/SJES' },
    { id: '2', name: 'Colaborador' },
    { id: '3', name: 'Colaborador Eventual' }
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

export default function ConclusaoDeslocamento() {
    const [formData, setFormData] = useState({});
    const [error, setError] = useState("");
    const [fetchedData, setFetchedData] = useState(null);
    const [solicitacaoOptions, setSolicitacaoOptions] = useState<{ id: string; name: string; data?: any }[]>([{ id: '', name: '' }]);
    const [selectedSolicitacao, setSelectedSolicitacao] = useState(null);
    const [selectedCode, setSelectedCode] = useState(null);
    const Frm = new FormHelper();

    async function fetchProcessData(numeroProcesso: string) {
        try {
            
            const response = await axios.get<{ modjusData: any, numero_documento: string }[]>('/api/getmodjusdocsprocess', {
                
                params: { num_processo: numeroProcesso, nome_documento: process.env.NEXT_PUBLIC_FORM_DAILY_CALCULATION },
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
            alert('Não foi possível encontrar os dados adicionais');
        }
    }

    function handleSolicitacaoChange(event: React.ChangeEvent<HTMLSelectElement>) {
        const selectedId = event.target.value;
        const selected = solicitacaoOptions.find(option => option.name === selectedId);
        setSelectedCode(selected)
        setSelectedSolicitacao(selected ? selected.data : null);
        Frm.update({ ...formData, solicitacaoDeslocamentoCalculoDiaria: selectedId }, setFormData);
    }

    const [startDate, setStartDate] = useState<Date | null>(new Date());
    const handleDateChange = (date: Date | null) => {
        setStartDate(date);
    };

    // function handleProponenteChange(proponente: any, nameCargoProponente: any, Frm: FormHelper) {
    //     if (proponente) {
    //         Frm.set('funcaoProponente', proponente.funcao || '');
    //         Frm.set(nameCargoProponente, proponente.cargo || '');
    //     }
    // }

    // function handleBeneficiarioChange(beneficiario: any, nameCargoBeneficiario: any, Frm: FormHelper) {
    //     if (beneficiario && beneficiario.sigla) {
    //         Frm.set('funcaoBeneficiario', beneficiario.funcao || '');
    //         Frm.set(nameCargoBeneficiario, beneficiario.cargo || '');
    //     }
    // }

    // function handleRetornoAOrigemChange(event: React.ChangeEvent<HTMLInputElement>) {
    //     Frm.set('retorno_a_origem', event.target.value);
    // }
    const bool = false;

    function interview(Frm: FormHelper) {
        return <>
            <div className="scrollableContainer">
                <div className="margin-bottom: 0.3em; margin-top: 1em; font-weight: bold; font-size: 120%;">CONCLUSÃO DE DESLOCAMENTO</div>
                <p><strong>Dados para o relatório de deslocamentos</strong></p>
                <div className='"flex-grow-1 card p-3 m-2' style={{ backgroundColor: '#edf7fe' }}>
                    <h6>Dados da Solicitação de Deslocamento</h6>
                    <Frm.InputWithButton label="Número do Processo" name="numeroProcesso" buttonText="Buscar" onButtonClick={fetchProcessData} width={12} />

                    {fetchedData && (
                        <Frm.Select label="Selecione o código do cálculo de diária" name="solicitacaoDeslocamentoCalculoDiaria" options={solicitacaoOptions} onChange={handleSolicitacaoChange} width={12} />
                    )}
                </div>
            </div>
        </>
    }

    function document(data: any) {

        const formatDateToBrazilian = (date: string) => {
            if (!date) return 'Não informado';
            return date;
        };

        const getOptionName = (options: { id: string, name: string }[], id: string) => {
            return options.find(opt => opt.id === id)?.name || 'Não informado';
        };

        const formatCurrency = (value: number | string | undefined) => {
            if (value === undefined) return 'Não informado';
            if (typeof value === 'string') {
                value = parseFloat(value);
                value /= 100;
            }
            return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        };

        function fetchFieldFromJsonObject(jsonObject, fieldName) {
            try {
                // Validar se a entrada é um objeto JSON válido
                if (typeof jsonObject !== 'object' || jsonObject === null || Array.isArray(jsonObject)) {
                    throw new Error("Entrada inválida. Deve ser um objeto JSON válido.");
                }

                // Verificar se o campo existe no objeto
                if (!(fieldName in jsonObject)) {
                    throw new Error(`Campo "${fieldName}" não encontrado no JSON.`);
                }

                return jsonObject[fieldName][0];
            } catch (error) {
                console.error("Erro ao buscar o campo:", error);
                return null;
            }
        }

        let origemDestino = null
        const trajeto = fetchFieldFromJsonObject(selectedSolicitacao, "trajeto");
        origemDestino = trajeto ? (trajeto.origem + " / " + trajeto.destino) : "Não informado";

        return <>
            <div className="scrollableContainer">
                {selectedSolicitacao && (
                    <>
                        {/* <p><strong>CONCLUSÃO DE DESLOCAMENTO</strong></p> */}
                        <strong>Dados Para o Relatório de Deslocamentos</strong><br></br>

                        <label>Código da Solicitação de Deslocamento: </label> <span style={{ color: 'blue' }}>{selectedCode.name}</span><br></br>
                        <label>Data da Solicitação de Deslocamento: </label> <span style={{ color: 'blue' }}>{selectedSolicitacao.dataAtual || "Não informado"}</span><br></br>

                        {/* DADOS DO PROPONENTE */}
                        <label>Proponente:</label> <span style={{ color: 'blue' }}>{selectedSolicitacao.proponente?.descricao || 'Não informado'}</span><br></br>
                        <label>Cargo do Proponente:</label> <span style={{ color: 'blue' }}>{selectedSolicitacao.cargoProponente || "Não informado"}</span><br></br>

                        {/* DADOS DO BENEFICIÁRIO */}
                        <label>Tipo de Beneficiário:</label> <span style={{ color: 'blue' }}>{getOptionName(tipoBeneficiarioOptions, selectedSolicitacao.tipoBeneficiario)} </span><br></br>
                        <label>Beneficiário:</label> <span style={{ color: 'blue' }}>{selectedSolicitacao.pessoa?.descricao || 'Não informado'}</span><br></br>
                        <label>Cargo do Beneficiário:</label> <span style={{ color: 'blue' }}>{selectedSolicitacao.cargoBeneficiario || 'Não informado'}</span><br></br>
                        <label>Finalidade:</label> <span style={{ color: 'blue' }}>{selectedSolicitacao.servicoAtividade || "Não informado"}</span><br></br>
                        <label>Tipo de Viagem:</label> <span style={{ color: 'blue' }}>{getOptionName(tipoDeslocamentoOptions, selectedSolicitacao.tipoDeslocamento)} </span><br></br>
                        <label>Itinerário:</label> <span style={{ color: 'blue' }}>{origemDestino}</span><br></br>
                        <label>Retorno à Origem:</label> <span style={{ color: 'blue' }}>{selectedSolicitacao.retorno_a_origem || "Não informado"}</span><br></br>

                        {/* DADOS DO DESLOCAMENTO */}
                        <label>Período:</label> <span style={{ color: 'blue' }}> {selectedSolicitacao.periodoDe} a {selectedSolicitacao.periodoAte}</span><br></br>
                        <label>Meio de Transporte:</label> <span style={{ color: 'blue' }}>{getOptionName(meioTransporteOptions, selectedSolicitacao.meioTransporte)}</span><br></br>

                        {/* VALORES DAS DIÁRIAS */}
                        <label>Valor Bruto das Diárias:</label> <span style={{ color: 'blue' }}>{formatCurrency(selectedSolicitacao?.valorBrutoDiarias) || "Não informado"}</span><br></br>
                        <label>Adicional de Deslocamento:</label> <span style={{ color: 'blue' }}>{formatCurrency(selectedSolicitacao?.valorAdicionalDeslocamento) || "Não informado"}</span><br></br>
                        <label>Desconto de Auxílio Alimentação:</label> <span style={{ color: 'blue' }}>{formatCurrency(selectedSolicitacao?.valorDescontoAlimentacao) || "Não informado"}</span><br></br>
                        <label>Desconto de Auxílio Transporte:</label> <span style={{ color: 'blue' }}>{formatCurrency(selectedSolicitacao?.valorDescontoTransporte) || "Não informado"}</span><br></br>
                        <label>Desconto de Teto:</label> <span style={{ color: 'blue' }}>{formatCurrency(selectedSolicitacao?.descontoTeto) || "Não informado"}</span><br></br>
                        <label>Valor Líquido das Diárias:</label> <span style={{ color: 'blue' }}>{formatCurrency(selectedSolicitacao?.valorLiquidoDiarias) || "Não informado"}</span><br></br>
                        <label>Valor Total das Passagens:</label> <span style={{ color: 'blue' }}>{formatCurrency(selectedSolicitacao?.resultadoCalculo) || "Não informado"}</span><br></br>
                    </>
                )}
            </div>
        </>
    }

    return Model(interview, document, { saveButton: true, pdfButton: true, pdfFileName: 'ConclusaoDeDeslocamento' })
}
