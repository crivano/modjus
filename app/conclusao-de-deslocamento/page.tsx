'use client'

import { useState, useEffect } from "react"
import { FormHelper } from "@/libs/form-support";
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

const retornoAOrigem = [
    { id: '1', name: 'Sim' },
    { id: '2', name: 'Não' },
]

export default function ConclusaoDeslocamento() {
    const [formData, setFormData] = useState({});
    const [error, setError] = useState("");
    const [fetchedData, setFetchedData] = useState(null);
    const [solicitacaoOptions, setSolicitacaoOptions] = useState<{ id: string; name: string; data?: any }[]>([{ id: '', name: '' }]);
    const [selectedSolicitacao, setSelectedSolicitacao] = useState(null);
    const [selectedCode, setSelectedCode] = useState(null);
    const Frm = new FormHelper();

    const [startDate, setStartDate] = useState<Date | null>(new Date());
    const handleDateChange = (date: Date | null) => {
        setStartDate(date);
    };
    // TODO: Criar um componente com essa função para reutilizar
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
        Frm.update({ ...formData, solicitacaoDeslocamento: selectedId }, setFormData);
    }

    function handleProponenteChange(proponente: any, Frm: FormHelper) {
        if (proponente) {
            Frm.set('funcaoProponente', proponente.funcao || '');
            Frm.set('cargoProponente', proponente.cargo || '');
        }
    }

    function handleBeneficiarioChange(beneficiario: any, Frm: FormHelper) {
        if (beneficiario) {
            Frm.set('funcaoBeneficiario', beneficiario.funcao || '');
            Frm.set('cargoBeneficiario', beneficiario.cargo || '');
        }
    }

    // FUNÇÃO PARA FORMATAR OS CAMPOS DO FORMULÁRIO
    function formatForm(name: string, field: any) {
        return <>
            <label>{name}</label> 
                <span style={{ color: 'blue' }}>{' ' + field || "Não informado"}</span>
                <br></br>
        </>
    }

    // INTERVEIW - ÁREA DA ENTREVISTA
    function interview(Frm: FormHelper) {
        return <>
            <div className="scrollableContainer">
                <div>
                    <div className="margin-bottom: 0.3em; 
                                margin-top: 1em; 
                                font-weight: bold; 
                                font-size: 120%;">
                        CONCLUSÃO DE DESLOCAMENTO
                    </div>
                    <p><strong>Dados para o relatório de deslocamentos</strong></p>
                    <h2>Dados do Proponente</h2>
                    <div className="row">
                        <Frm.Input label="Código da Solicitação de Deslocamento:" name="solicitacaoDeslocamento" width={6} />
                        <Frm.dateInput label="Data da Solicitação de Deslocamento" name="data_solicitacao" width={6} />
                    </div>

                    <Pessoa
                        Frm={Frm} name="proponente"
                        label1="Matrícula"
                        label2="Nome"
                        onChange={(proponente) => handleProponenteChange(proponente, Frm)}
                    />

                    <div className="row">
                        <Frm.Input label="Função" name="funcaoProponente" width={6} />
                        <Frm.Input label="Cargo" name="cargoProponente" width={6} />
                    </div>

                    <p></p><h2>Dados do Beneficiário</h2>

                    <Frm.Select label="Tipo de Beneficiário" name="tipoBeneficiario" options={tipoBeneficiarioOptions} width={6} />
                    <Pessoa Frm={Frm} name="pessoa" label1="Matrícula" label2="Nome" onChange={(pessoa) => handleBeneficiarioChange(pessoa, Frm)} />

                    <div className="row">
                        <Frm.Input label="Função" name="funcaoBeneficiario" width={6} />
                        <Frm.Input label="Cargo" name="cargoBeneficiario" width={6} />
                    </div>

                    <Frm.Input label="Finalidade" name="finalidade" width={12} />
                    <Frm.Select label="Tipo de Viagem" name="tipoDeslocamento" width={4} options={tipoDeslocamentoOptions} />
                    <Frm.Input label="Itinerário" name="origemDestino" width={6} />
                    <Frm.RadioButtons label="Retorno a Origem?" name="retorno_a_origem" options={retornoAOrigem} width={12} />
                    <div className="row">
                        <Frm.dateInput label="Período (De)" name="periodoDe" width={6} />
                        <Frm.dateInput label="Período (Até)" name="periodoAte" width={6} />
                    </div>
                    <Frm.Select label="Meio de Transporte" name="meioTransporte" options={meioTransporteOptions} width={4} />


                    {/* Dados dos cálculos */}
                    <div className="row">
                        <Frm.Input label="Valor Bruto das Diárias" name="valorBrutoDiarias" width={6} />
                        <Frm.Input label="Adicional de Deslocamento" name="valorAdicionalDeslocamento" width={6} />
                        <Frm.Input label="Desconto de Auxílio Alimentação" name="valorDescontoAlimentacao" width={6} />
                        <Frm.Input label="Desconto de Auxílio Transporte" name="valorDescontoTransporte" width={6} />
                        <Frm.Input label="Desconto de Teto" name="totalDeDescontoDeTeto" width={6} />
                        <Frm.Input label="Valor Líquido das Diárias" name="valorLiquidoDiarias" width={6} />
                        <Frm.Input label="Valor Total das Passagens" name="resultadoCalculo" width={6} />
                    </div>
                </div>

                <div className='card my-2 p-2 ' style={{ backgroundColor: '#edf7fe' }}>
                    <h6>Dados da Solicitação de Deslocamento</h6>
                    <Frm.InputWithButton
                        label="Número do Processo"
                        name="numeroProcesso"
                        buttonText="Buscar"
                        onButtonClick={fetchProcessData}
                        width={6}
                    />

                    {fetchedData && (
                        <Frm.Select label="Selecione o código da solicitação de deslocamento"
                            name="solicitacaoDeslocamento"
                            options={solicitacaoOptions}
                            onChange={handleSolicitacaoChange}
                            width={8}
                        />
                    )}
                </div>
            </div>
        </>
    }

    function document(data: any) {

        const Frm = new FormHelper();
        Frm.update(data);
        const {
            data_Solicitacao,
            solicitacaoDeslocamento,
            proponente,
            cargoProponente,
            pessoa,
            tipoBeneficiario,
            cargoBeneficiario,
            finalidade,
            tipoDeslocamento,
            origemDestino,
            retorno_a_origem,
            periodoDe,
            periodoAte,
            meioTransporte,
            valorBrutoDiarias,
            valorAdicionalDeslocamento,
            valorDescontoTransporte,
            totalDeDescontoDeTeto,
            valorDescontoAlimentacao,
            valorLiquidoDiarias,
            resultadoCalculo,
        } = Frm.data;

        console.log(data)

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

        return <>

            {!selectedSolicitacao && (
                <div className="scrollableContainer">
                    <h4>Dados do Proponente</h4>
                    {/* <p style={{display:"none"}}><strong>Data da Solicitação:</strong> { || 'Não informado'}</p> */}
                    <strong>Dados Para o Relatório de Deslocamentos</strong><br></br>

                    {formatForm("Código da Solicitação de Deslocamento:", data.solicitacaoDeslocamento)}
                    {formatForm("Data da Solicitação de Deslocamento:", data.data_solicitacao)}

                    {/* DADOS DO PROPONENTE */}
                    {formatForm("Proponente:", data.proponente?.descricao)}
                    {formatForm("Cargo do Proponente:", cargoProponente)}

                    {/* DADOS DO BENEFICIÁRIO */}
                    {formatForm("Tipo de Beneficiário:", getOptionName(tipoBeneficiarioOptions, tipoBeneficiario))}
                    {formatForm("Beneficiário:", pessoa?.descricao)}
                    {formatForm("Cargo do Beneficiário:", cargoBeneficiario)}

                    {formatForm("Finalidade:", finalidade)}
                    {formatForm("Tipo de Viagem:", getOptionName(tipoDeslocamentoOptions, tipoDeslocamento))}
                    {formatForm("Itinerário:", origemDestino)}
                    {formatForm("Retorno à Origem:", getOptionName(retornoAOrigem, retorno_a_origem))}
                    {formatForm("Período:", (periodoDe + " a " + periodoAte))}
                    {formatForm("Meio de Transporte:", getOptionName(meioTransporteOptions, meioTransporte))}

                    {/* VALORES DAS DIÁRIAS */}
                    {formatForm("Valor Bruto das Diárias:", formatCurrency(valorBrutoDiarias))}
                    {formatForm("Adicional de Deslocamento:",formatCurrency( valorAdicionalDeslocamento))}
                    {formatForm("Desconto de Auxílio Alimentação:", formatCurrency(valorDescontoAlimentacao))}
                    {formatForm("Desconto de Auxílio Transporte:", formatCurrency(valorDescontoTransporte))}
                    {formatForm("Desconto de Teto:", formatCurrency(totalDeDescontoDeTeto))}
                    {formatForm("Valor Líquido das Diárias:", formatCurrency(valorLiquidoDiarias))}
                    {formatForm("Valor Total das Passagens:", formatCurrency(resultadoCalculo))}
                </div>
            )}

            {selectedSolicitacao && (
                <>
                    <strong>Dados Para o Relatório de Deslocamentos</strong><br></br>
                    {formatForm("Código da Solicitação de Deslocamento:", selectedSolicitacao.solicitacaoDeslocamento)}
                    {formatForm("Data da Solicitação de Deslocamento:", selectedSolicitacao.dataAtual)}

                    {/* DADOS DO PROPONENTE */}
                    {formatForm("Proponente:", selectedSolicitacao.proponente?.descricao)}
                    {formatForm("Cargo do Proponente:", selectedSolicitacao.cargoProponente)}

                    {/* DADOS DO BENEFICIÁRIO */}
                    {formatForm("Beneficiário:", selectedSolicitacao.pessoa?.descricao)}
                    {formatForm("Tipo de Beneficiário:", getOptionName(tipoBeneficiarioOptions, selectedSolicitacao.tipoBeneficiario))}
                    {formatForm("Cargo do Beneficiário:", selectedSolicitacao.cargoPessoa)}

                    {formatForm("Finalidade:", selectedSolicitacao.servicoAtividade)}
                    {formatForm("Tipo de Viagem:", getOptionName(tipoDeslocamentoOptions, selectedSolicitacao.tipoDeslocamento))}
                    {formatForm("Itinerário:", selectedSolicitacao.trajeto)}
                    {formatForm("Retorno à Origem:", selectedSolicitacao.return_to_origin === true ? 'Sim' : 'Não')}
                    {formatForm("Período:", selectedSolicitacao.periodoDe + " a " + selectedSolicitacao.periodoAte)}
                    {formatForm("Meio de Transporte:", getOptionName(meioTransporteOptions, selectedSolicitacao.meioTransporte))}

                    {/* VALORES DAS DIÁRIAS */}
                    {formatForm("Valor Bruto das Diárias:", formatCurrency(selectedSolicitacao.resultadoCalculoDiarias.totalDeDiariasBruto))}
                    {formatForm("Adicional de Deslocamento:", formatCurrency(selectedSolicitacao.resultadoCalculoDiarias.totalDeAcrescimoDeDeslocamento))}
                    {formatForm("Desconto de Auxílio Alimentação:", formatCurrency(selectedSolicitacao.resultadoCalculoDiarias.totalDeDescontoDeAuxilioAlimentacao))}
                    {formatForm("Desconto de Auxílio Transporte:", formatCurrency(selectedSolicitacao.resultadoCalculoDiarias.totalDeDescontoDeAuxilioTransporte))}
                    {formatForm("Desconto de Teto:", formatCurrency(selectedSolicitacao.resultadoCalculoDiarias.totalDeDescontoDeTeto))}
                    {formatForm("Valor Líquido das Diárias:", formatCurrency(selectedSolicitacao.resultadoCalculoDiarias.subtotalLiquido))}
                    {formatForm("Valor Total das Passagens:", formatCurrency(selectedSolicitacao.resultadoCalculoDiarias.total))}
                </>
            )}
        </>
    }

    return Model(interview, document, { saveButton: true, pdfButton: true, pdfFileName: 'ConclusaoDeDeslocamento' })
}
