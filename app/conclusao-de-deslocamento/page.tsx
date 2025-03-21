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

export default function ConclusaoDeslocamento() {
    const [formData, setFormData] = useState({});
    const [error, setError] = useState("");
    const [fetchedData, setFetchedData] = useState(null);
    const [fetchedData2, setFetchedData2] = useState(null);
    const [solicitacaoOptions, setSolicitacaoOptions] = useState<{ id: string; name: string; data?: any }[]>([{ id: '', name: '' }]);
    const [solicitacaoOptions2, setSolicitacaoOptions2] = useState<{ id: string; name: string; data?: any }[]>([{ id: '', name: '' }]);
    const [selectedSolicitacao, setSelectedSolicitacao] = useState(null);
    const [selectedSolicitacao2, setSelectedSolicitacao2] = useState(null);
    const [selectedCode, setSelectedCode] = useState(null);
    const [selectedCode2, setSelectedCode2] = useState(null);
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

            // const response2 = await axios.get<{ modjusData: any, numero_documento: string }[]>('/api/getmodjusdocsprocess', {
            //     params: { num_processo: numeroProcesso, nome_documento: 'Cálculo de Diárias de Deslocamento (modjus)' },
            //     headers: {
            //         'Authorization': 'Basic YWRtaW46c2VuaGExMjM=',
            //         'x-forwarded-for': '127.0.0.1'
            //     }
            // });

            // setFetchedData2(response2.data);
            // setSolicitacaoOptions2([{ id: '', name: '' }, ...response2.data.map((item: { modjusData: any, numero_documento: string }) => ({
            //     id: item.modjusData.id,
            //     name: item.numero_documento,
            //     data: item.modjusData // Store the entire data
            // }))]);
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

    function handleSolicitacaoChange2(event: React.ChangeEvent<HTMLSelectElement>) {
        const selectedId2 = event.target.value;
        const selected2 = solicitacaoOptions2.find(option => option.name === selectedId2);

        setSelectedCode2(selected2)
        setSelectedSolicitacao2(selected2 ? selected2.data : null);
        Frm.update({ ...formData, solicitacaoDeslocamentoCalculoDiaria: selectedId2 }, setFormData);
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
                <h2>Dados do Proponente</h2>
                <Frm.Input label="Data da Solicitação" name="dataAtual" width={4} />

                <Pessoa Frm={Frm} name="proponente" label1="Matrícula" label2="Nome" onChange={(proponente) => handleProponenteChange(proponente, Frm)} />

                <div className="row">
                    <Frm.Input label="Função" name="funcaoProponente" width={6} />
                    <Frm.Input label="Cargo" name="cargoProponente" width={6} />
                </div>

                <Pessoa Frm={Frm} name="pessoa" label1="Matrícula" label2="Nome" onChange={(pessoa) => handleProponenteChange(pessoa, Frm)} /> 

                <div className="row">
                    <Frm.Input label="Função" name="funcaoProponente" width={6} />
                    <Frm.Input label="Cargo" name="cargoProponente" width={6} />
                </div>

                <Frm.Input label="Finalidade" name="finalidade" width={4} />

                <Frm.Input label="Valor Bruto das Diárias" name="valorBrutoDiarias" />
                <Frm.Input label="Adicional de Deslocamento" name="valorAdicionalDeslocamento" />
                <Frm.Input label="Desconto de Auxílio Alimentação" name="valorDescontoAlimentacao" />
                <Frm.Input label="Desconto de Auxílio Transporte" name="valorDescontoTransporte" />
                <Frm.Input label="Desconto de Teto" name="descontoTeto" />
                <Frm.Input label="Valor Líquido das Diárias" name="valorLiquidoDiarias" />
                <Frm.Input label="Valor Total das Passagens" name="resultadoCalculo" />

                {/* <div className="margin-bottom: 0.3em; margin-top: 1em; font-weight: bold; font-size: 120%;">CONCLUSÃO DE DESLOCAMENTO</div>
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
                </div> */}
            </div>
            <div className='"flex-grow-1 card p-3 m-2' style={{ backgroundColor: '#edf7fe' }}>
                <h6>Dados da Solicitação de Deslocamento</h6>
                <Frm.InputWithButton label="Número do Processo" name="numeroProcesso" buttonText="Buscar" onButtonClick={fetchProcessData} width={12} />

                {fetchedData && (
                    <Frm.Select label="Selecione o código da solicitação de deslocamento" name="solicitacaoDeslocamento" options={solicitacaoOptions} onChange={handleSolicitacaoChange} width={12} />
                )}

                {fetchedData2 && selectedSolicitacao && (
                    <Frm.Select label="Selecione o código do cálculo de diária" name="solicitacaoDeslocamentoCalculoDiaria" options={solicitacaoOptions2} onChange={handleSolicitacaoChange2} width={12} />
                )}
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

        function formatForm(name: string, field: any) {
            return <><label>{name}:</label> <span style={{ color: 'blue' }}>{field || "Não informado"}</span><br></br></>
        }

        return <>

            {!selectedSolicitacao && (
                <div className="scrollableContainer">
                    <h4>Dados do Proponente</h4>
                    {/* <p style={{display:"none"}}><strong>Data da Solicitação:</strong> { || 'Não informado'}</p> */}
                    <strong>Dados Para o Relatório de Deslocamentos</strong><br></br>

                    {formatForm("Data da Solicitação:", data.dataAtual = "xx/xx/xxxx")}
                    {formatForm("Código da Solicitação de Deslocamento:", data.name)}

                    {/* DADOS DO PROPONENTE */}
                    {formatForm("Proponente:", data.proponente?.descricao)}
                    {formatForm("Cargo do Proponente:", data.cargoProponente)}

                    {/* DADOS DO BENEFICIÁRIO */}
                    {formatForm("Beneficiário:", data.pessoa?.descricao)}
                    {formatForm("Tipo de Beneficiário:", getOptionName(tipoBeneficiarioOptions, data.tipoBeneficiario))}
                    {formatForm("Cargo do Beneficiário:", data.pessoa?.cargo)}

                    {formatForm("Finalidade:", data.servicoAtividade)}
                    {formatForm("Tipo de Viagem:", getOptionName(tipoDeslocamentoOptions, data.tipoDeslocamento))}
                    {formatForm("Itinerário:", data.origemDestino)}
                    {formatForm("Retorno à Origem:", data.retorno_a_origem)}

                    {/* VALORES DAS DIÁRIAS */}
                    {formatForm("Valor Bruto das Diárias:", data.valorBrutoDiarias)}
                    {formatForm("Adicional de Deslocamento:", data.valorAdicionalDeslocamento)}
                    {formatForm("Desconto de Auxílio Alimentação:", data.valorDescontoAlimentacao)}
                    {formatForm("Desconto de Auxílio Transporte:", data.valorDescontoTransporte)}
                    {formatForm("Desconto de Teto:", data.descontoTeto)}
                    {formatForm("Valor Líquido das Diárias:", data.valorLiquidoDiarias)}
                    {formatForm("Valor Total das Passagens:", data.resultadoCalculo)}
                </div>
            )}

            {selectedSolicitacao && (
                <>
                    <strong>Dados Para o Relatório de Deslocamentos</strong><br></br>


                    {formatForm("Data da Solicitação:", data.dataAtual = "dataAtual")}
                    {formatForm("Código da Solicitação de Deslocamento:", selectedSolicitacao.dataAtual)}

                    {/* DADOS DO PROPONENTE */}
                    {formatForm("Proponente:", data.proponente = selectedSolicitacao.proponente?.descricao)}
                    {formatForm("Cargo do Proponente:", data.cargoProponente = selectedSolicitacao.cargoProponente)}

                    {/* DADOS DO BENEFICIÁRIO */}
                    {formatForm("Beneficiário:", data.beneficiario = selectedSolicitacao.name)}
                    {formatForm("Tipo de Beneficiário:", data.tipoBeneficiario = getOptionName(tipoBeneficiarioOptions, selectedSolicitacao.tipoBeneficiario))}
                    {formatForm("Cargo do Beneficiário:", data.cargoBeneficiario = getOptionName(tipoBeneficiarioOptions, selectedSolicitacao.pessoa?.cargo))}

                    {formatForm("Finalidade:", data.finalidade = selectedSolicitacao.servicoAtividade)}
                    {formatForm("Tipo de Viagem:", data.tipoViagem = getOptionName(tipoDeslocamentoOptions, selectedSolicitacao.tipoDeslocamento))}

                    {formatForm("Itinerário:", data.itinerario = selectedSolicitacao.origemDestino)}
                    {formatForm("Retorno à Origem:", data.retornoOrigem = getOptionName(tipoDeslocamentoOptions, selectedSolicitacao.retorno_a_origem))}

                    {/* VALORES DAS DIÁRIAS */}
                    {formatForm("Valor Bruto das Diárias:", data.valorBrutoDiarias = selectedSolicitacao.valorBrutoDiarias)}
                    {formatForm("Adicional de Deslocamento:", data.valorAdicionalDeslocamento = selectedSolicitacao.valorAdicionalDeslocamento)}
                    {formatForm("Desconto de Auxílio Alimentação:", data.valorDescontoAlimentacao = selectedSolicitacao.valorDescontoAlimentacao)}
                    {formatForm("Desconto de Auxílio Transporte:", data.valorDescontoTransporte = selectedSolicitacao.valorDescontoTransporte)}
                    {formatForm("Desconto de Teto:", data.descontoTeto = selectedSolicitacao.descontoTeto)}
                    {formatForm("Valor Líquido das Diárias:", data.valorLiquidoDiarias = selectedSolicitacao.valorLiquidoDiarias)}
                    {formatForm("Valor Total das Passagens:", data.resultadoCalculo = selectedSolicitacao.resultadoCalculo)}
                </>
            )}
        </>
    }

    return Model(interview, document, { saveButton: true, pdfButton: true, pdfFileName: 'ConclusaoDeDeslocamento' })
}
