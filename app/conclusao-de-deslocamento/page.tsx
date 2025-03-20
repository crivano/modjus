'use client'

//import { useState } from 'react';
import { FormHelper } from "@/libs/form-support";
import { useState, useEffect } from "react"
import Model from "@/libs/model"
import Pessoa from "@/components/sei/Pessoa"
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
    const Frm = new FormHelper();
    const [fetchedData, setFetchedData] = useState(null);
    const [solicitacaoOptions, setSolicitacaoOptions] = useState<{ id: string; name: string; data?: any }[]>([{ id: '', name: '' }]);
    const [selectedSolicitacao, setSelectedSolicitacao] = useState(null);
    const [selectedCode, setSelectedCode] = useState(null);

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

        // if (selected) {

        //     const solicitacaoData = selected.data;
        //     Frm.set('proponente', {descricao: solicitacaoData.proponente?.descricao || '', sigla: solicitacaoData.proponente?.sigla || ''});
        //     Frm.set('funcaoProponente', solicitacaoData.funcaoProponente || '');
        //     Frm.set('cargoProponente', solicitacaoData.cargoProponente || '');
        //     Frm.set('pessoa', {
        //         descricao: solicitacaoData.pessoa?.descricao || '', sigla: solicitacaoData.pessoa?.sigla || '', cargo: solicitacaoData.pessoa?.cargo || ''
        //     });
        //     Frm.set('banco', solicitacaoData.banco || '');
        //     Frm.set('dataAtual', solicitacaoData.dataAtual || '');

        //     Frm.set('agencia', solicitacaoData.agencia || '');
        //     Frm.set('conta', solicitacaoData.conta || '');
        //     Frm.set('tipoBeneficiario', solicitacaoData.tipoBeneficiario || '');
        //     Frm.set('faixa', solicitacaoData.faixa || '');
        //     Frm.set('acrescimo', solicitacaoData.acrescimo || '');
        //     Frm.set('tipoDiaria', solicitacaoData.tipoDiaria || '');
        //     Frm.set('prorrogacao', solicitacaoData.prorrogacao || '');
        //     Frm.set('servicoAtividade', solicitacaoData.servicoAtividade || '');
        //     Frm.set('orgao', solicitacaoData.orgao || '');
        //     Frm.set('local', solicitacaoData.local || '');
        //     Frm.set('periodoDe', solicitacaoData.periodoDe || '');
        //     Frm.set('periodoAte', solicitacaoData.periodoAte || '');
        //     Frm.set('justificativa', solicitacaoData.justificativa || '');
        //     Frm.set('tipoDeslocamento', solicitacaoData.tipoDeslocamento || '');
        //     Frm.set('meioTransporte', solicitacaoData.meioTransporte || '');
        //     Frm.set('trajeto', solicitacaoData.trajeto || []);
        // }
    }

    function handleProponenteChange(proponente: any, Frm: FormHelper) {
        if (proponente) {
            Frm.set('funcaoProponente', proponente.funcao || '');
            Frm.set('cargoProponente', proponente.cargo || '');
        }
    }

    const [startDate, setStartDate] = useState<Date | null>(new Date());
    const handleDateChange = (date: Date | null) => {
        setStartDate(date);
    };

    // ÁREA DE ENTRADA DE DADOS
    function interview(Frm: FormHelper) {
        return <>
            <div className="scrollableContainer">

                <h2>Dados do Proponente</h2>
                {/* <Frm.Input label="Data da Solicitação" name="dataAtual" width={4} /> */}
                {/* <Pessoa Frm={Frm} name="proponente" label1="Matrícula" label2="Nome" onChange={(proponente) => handleProponenteChange(proponente, Frm)} />
                <div className="row">
                    <Frm.Input label="Função" name="funcaoProponente" width={6} />
                    <Frm.Input label="Cargo" name="cargoProponente" width={6} />
                </div> */}

                <Pessoa Frm={Frm} name="proponente" label1="Matrícula" label2="Nome" onChange={(proponente) => handleProponenteChange(proponente, Frm)} />

                <div className="row">
                    <Frm.Input label="Função" name="funcaoProponente" width={6} />
                    <Frm.Input label="Cargo" name="cargoProponente" width={6} />
                </div>

                <Frm.Input label="Finalidade" name="finalidade" width={4} />

                {/* <label>Valor Bruto das Diárias:</label> <span style={{ color: 'blue' }}>{formatCurrency(selectedSolicitacao?.valorBrutoDiarias) /> */}

                <Frm.Input label="Adicional de Deslocamento" name="adic_desloc" />
                <Frm.Input label="Desconto de Auxílio Alimentação" name="valorDescontoAlimentacao" />
                <Frm.Input label="Desconto de Auxílio Transporte" name="valorDescontoTransporte" />
                <Frm.Input label="Desconto de Teto" name="desconto_teto" />
                <Frm.Input label="Valor Líquido das Diárias" name="valorLiquidoDiarias" />
                <Frm.Input label="Valor Total das Passagens" name="resultadoCalculo" />

                <div className="margin-bottom: 0.3em; margin-top: 1em; font-weight: bold; font-size: 120%;">CONCLUSÃO DE DESLOCAMENTO</div>
                <p><strong>Dados para o relatório de deslocamentos</strong></p>
                <div className='"flex-grow-1 card p-3 m-2' style={{ backgroundColor: '#edf7fe' }}>
                    <h6>Dados da Solicitação de Deslocamento</h6>
                    <Frm.InputWithButton label="Número do Processo" name="numeroProcesso" buttonText="Buscar" onButtonClick={fetchProcessData} width={12} />

                    {fetchedData && (
                        <Frm.Select 
                            label="Selecione o código do cálculo de diária" 
                            name="solicitacaoDeslocamentoCalculoDiaria" 
                            options={solicitacaoOptions} 
                            onChange={handleSolicitacaoChange} width={12} 
                        />
                    )}
                </div>
            </div>
        </>
    }

    // ÁREA DE SAÍDA DOS DADOS
    function document(data: any) {
        const Frm = new FormHelper();
        Frm.update(data);
        // const {
        //     funcaoProponente,
        //     cargoProponente,
        //     finalidade,
        // } = Frm.data;

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

        function formatForm (name: string, field: any) {
            return <><label>{name}:</label> <span style={{ color: 'blue' }}>{field || "Não informado"}</span><br></br></>
        }

        return <>

            {!selectedSolicitacao && (
                <div className="scrollableContainer">
                    <h4>Dados do Proponente</h4>
                    {/* <p style={{display:"none"}}><strong>Data da Solicitação:</strong> { || 'Não informado'}</p> */}
                    <strong>Dados Para o Relatório de Deslocamentos</strong><br></br>

                    {formatForm("Data da Solicitação:", data.dataAtual = "dataAtual")}
                    {formatForm("Código da Solicitação de Deslocamento:", data.name)}

                    {/* DADOS DO PROPONENTE */}
                    {formatForm("Proponente:", data.proponente?.descricao)}
                    {formatForm("Cargo do Proponente:", data.cargoProponente)}

                    {/* DADOS DO BENEFICIÁRIO */}
                    {formatForm("Beneficiário:",getOptionName(tipoBeneficiarioOptions, data.pessoa?.descricao))}
                    {formatForm("Tipo de Beneficiário:",getOptionName(tipoBeneficiarioOptions, data.tipoBeneficiario))}
                    {formatForm("Cargo do Beneficiário:",getOptionName(tipoBeneficiarioOptions, data.pessoa?.cargo))}

                    {formatForm("Finalidade:",getOptionName(tipoBeneficiarioOptions, data.finalidade))}
                    {formatForm("Tipo de Viagem:",getOptionName(tipoDeslocamentoOptions, data.tipoDeslocamento))}
                    {formatForm("Itinerário:",getOptionName(tipoDeslocamentoOptions, data.origemDestino))}
                    {formatForm("Retorno à Origem:",getOptionName(tipoDeslocamentoOptions, data.retorno_a_origem))}

                    {/* VALORES DAS DIÁRIAS */}
                    {formatForm("Valor Bruto das Diárias:",getOptionName(tipoDeslocamentoOptions, data.valorBrutoDiarias))}
                    {formatForm("Adicional de Deslocamento:",getOptionName(tipoDeslocamentoOptions, data.adic_desloc))}
                    {formatForm("Desconto de Auxílio Alimentação:",getOptionName(tipoDeslocamentoOptions, data.valorDescontoAlimentacao))}
                    {formatForm("Desconto de Auxílio Transporte:",getOptionName(tipoDeslocamentoOptions, data.valorDescontoTransporte))}
                    {formatForm("Desconto de Teto:",getOptionName(tipoDeslocamentoOptions, data.descontoTeto))}
                    {formatForm("Valor Líquido das Diárias:",getOptionName(tipoDeslocamentoOptions, data.valorLiquidoDiarias))}
                    {formatForm("Valor Total das Passagens:",getOptionName(tipoDeslocamentoOptions, data.resultadoCalculo))}
                </div>
            )}

            {selectedSolicitacao && (
                <>
                    <strong>Dados Para o Relatório de Deslocamentos</strong><br></br>


                    {formatForm("Data da Solicitação:", data.dataAtual = "dataAtual")}
                    {formatForm("Código da Solicitação de Deslocamento:",selectedSolicitacao.dataAtual)}

                    {/* DADOS DO PROPONENTE */}
                    {formatForm("Proponente:", selectedSolicitacao.proponente?.descricao)}
                    {formatForm("Cargo do Proponente:", selectedSolicitacao.cargoProponente)}

                    {/* DADOS DO BENEFICIÁRIO */}
                    {formatForm("Beneficiário:", selectedCode.name)}
                    {formatForm("Tipo de Beneficiário:",getOptionName(tipoBeneficiarioOptions, selectedSolicitacao.tipoBeneficiario))}
                    {formatForm("Cargo do Beneficiário:",getOptionName(tipoBeneficiarioOptions, selectedSolicitacao.pessoa?.cargo))}

                    {formatForm("Finalidade:",getOptionName(tipoBeneficiarioOptions, selectedSolicitacao.finalidade))}
                    {formatForm("Tipo de Viagem:",getOptionName(tipoDeslocamentoOptions, selectedSolicitacao.tipoDeslocamento))}
                    {formatForm("Itinerário:",getOptionName(tipoDeslocamentoOptions, selectedSolicitacao.origemDestino))}
                    {formatForm("Retorno à Origem:",getOptionName(tipoDeslocamentoOptions, selectedSolicitacao.retorno_a_origem))}

                    {/* VALORES DAS DIÁRIAS */}
                    {formatForm("Valor Bruto das Diárias:", selectedSolicitacao.valorBrutoDiarias)}
                    {formatForm("Adicional de Deslocamento:", selectedSolicitacao.adic_desloc)}
                    {formatForm("Desconto de Auxílio Alimentação:", selectedSolicitacao.valorDescontoAlimentacao)}
                    {formatForm("Desconto de Auxílio Transporte:", selectedSolicitacao.valorDescontoTransporte)}
                    {formatForm("Desconto de Teto:", selectedSolicitacao.descontoTeto)}
                    {formatForm("Valor Líquido das Diárias:", selectedSolicitacao.valorLiquidoDiarias)}
                    {formatForm("Valor Total das Passagens:",selectedSolicitacao.resultadoCalculo)}
                </>
            )}
        </>
    }
    return Model(interview, document, { saveButton: true, pdfButton: true, pdfFileName: 'ConclusaoDeDeslocamento' })
}
