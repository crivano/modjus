'use client'

import Model from "@/libs/model"
import { FormHelper } from "@/libs/form-support"
import { useState, useEffect, ChangeEvent, useMemo } from "react"
import Pessoa from "@/components/sei/Pessoa"
import axios from 'axios'
import emissaoPassagens from "../emissao-de-passagens/page";

const options = {
    tipoBeneficiarioOptions: [
        { id: '1', name: 'TRF2/SJRJ/SJES' },
        { id: '2', name: 'Colaborador' },
        { id: '3', name: 'Colaborador Eventual' }
    ],
    tipoDeslocamentoOptions: [
        { id: '1', name: 'Nacional' },
        { id: '2', name: 'Internacional' }
    ],
    meioTransporteOptions: [
        { id: '1', name: 'Aéreo' },
        { id: '2', name: 'Rodoviário' },
        { id: '3', name: 'Hidroviário' },
        { id: '4', name: 'Veículo Próprio' },
        { id: '5', name: 'Sem Passagens' }
    ],
    retornoAOrigem: [
        { id: '1', name: 'Sim' },
        { id: '2', name: 'Não' },
    ]
};

const getOptionName = (options: { id: string, name: string }[], id: string) => {
    return options.find(opt => opt.id === id)?.name || 'Não informado';
};

export default function ConclusaoDeslocamento() {
    //const Frm = new FormHelper();
    const [error, setError] = useState("");
    const Frm = useMemo(() => new FormHelper(), []);

    const [fetchedData, setFetchedData] = useState(null);
    const [solicitacaoOptions, setSolicitacaoOptions] = useState<{ id: string; name: string; data?: any }[]>([{ id: '', name: '' }]);
    const [selectedSolicitacao, setSelectedSolicitacao] = useState(null);
    const [dataFetched, setDataFetched] = useState(false);

    const [fetchedDataPassagens, setFetchedDataPassagens] = useState(null);
    const [solicitacaoOptionsPassagens, setSolicitacaoOptionsPassagens] = useState<{ id: string; name: string; data?: any }[]>([{ id: '', name: '' }]);
    const [selectedSolicitacaoPassagens, setSelectedSolicitacaoPassagens] = useState(null);
    const [dataFetchedPassagens, setDataFetchedPassagens] = useState(false);

    const [radioSelected, setRadioSelected] = useState("não"); // "Não" como padrão

    useEffect(() => {
        if (Frm.data && Frm.data.calculoDiarias) {
            fetchProcessData(Frm.data.processo, process.env.NEXT_PUBLIC_INTERNAL_SECRET, "CAL", setFetchedData, setSolicitacaoOptions)
        }
    }, [Frm.data]);

    // useEffect(() => {
    //     if (Frm.data && Frm.data.emissaoPassagens) {
    //         fetchProcessDataPassagens(Frm.data.processo);
    //     }
    // }, [Frm.data]);

    async function fetchProcessData(numeroProcesso: string, internalSecret: string, typeDocument: string, setFetchedDatas: any, setSolicitacaoOptionss: any) {
        try {
            const response = await axios.get<{ modjusData: any, numero_documento: string }[]>(
                '/api/getmodjus', {
                params: {
                    num_processo: numeroProcesso,
                    tipo_documento: typeDocument,
                },
                headers: {
                    Authorization: `Bearer ${process.env.API_AUTH}`,
                    "x-secret-key": internalSecret || '', // Certifique-se de que a variável está configurada
                },
            });
    
            setFetchedDatas(response.data);
            setSolicitacaoOptionss([
                { id: '', name: '' },
                ...response.data.map((item) => ({
                    id: item.modjusData.id,
                    name: item.numero_documento,
                    data: item.modjusData,
                })),
            ]);
        } catch (error) {
            console.error("Erro ao buscar os dados:", error);
            alert('Não foi possível encontrar os dados adicionais');
        }
    }

    const formatCurrency = (value: number | string | undefined) => {

        if (value === undefined || value === '') return '0,00';
        if (typeof value === 'string') {
            value = limparNumeros(value);
            value = parseFloat(value);
            value /= 100;
        }
        return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    };

    function handleSolicitacaoChange(event: React.ChangeEvent<HTMLSelectElement>, Frm: FormHelper) {
        try {
            if ((!event.target.value || event.target.value == '') && Frm.data && Frm.data.calculoDiarias) {
                setSelectedSolicitacao(Frm.data.calculoDiarias);
            } else if (!event.target.value || event.target.value == '') {
                setSelectedSolicitacao(null);
                new Error('Documento "Cálculo de Diárias" não encontrado');
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


            if (selected && selected.id !== '') {
                const solicitacaoData = selected.data;
                Frm.set('solicitacaoDeslocamento', solicitacaoData.solicitacaoDeslocamento || '');
                Frm.set('data_solicitacao', solicitacaoData.dataAtual || '');

                // PROPONENTE
                Frm.set('proponente', {
                    descricao: solicitacaoData.proponente?.descricao || '', sigla: solicitacaoData.proponente?.sigla || ''
                });
                Frm.set('funcaoProponente', solicitacaoData.funcaoProponente || '');
                Frm.set('cargoProponente', solicitacaoData.cargoProponente || '');

                // BENEFICIARIO
                Frm.set('tipoBeneficiario', solicitacaoData.tipoBeneficiario || '');
                Frm.set('pessoa', {
                    descricao: solicitacaoData.pessoa?.descricao || '', sigla: solicitacaoData.pessoa?.sigla || ''
                });
                Frm.set('funcaoBeneficiario', solicitacaoData.tipoBeneficiario || '');
                Frm.set('cargoBeneficiario', solicitacaoData.cargoPessoa || '');

                // COLABORADOR
                Frm.set('nomePessoa', solicitacaoData.nome || '');
                Frm.set('cpf', solicitacaoData.CPF || '');

                Frm.set('finalidade', solicitacaoData.servicoAtividade || '');
                Frm.set('tipoDeslocamento', solicitacaoData.tipoDeslocamento || '');
                Frm.set('origemDestino', solicitacaoData.trajeto || '');
                Frm.set('return_to_origin', solicitacaoData.return_to_origin === true ? '1' : '2');
                Frm.set('periodoDe', solicitacaoData.periodoDe || '');
                Frm.set('periodoAte', solicitacaoData.periodoAte || '');
                Frm.set('meioTransporte', solicitacaoData.meioTransporte || '');

                // CÁLCULO DE DIÁRIAS
                Frm.set('valorBrutoDiarias', solicitacaoData?.totalDiaria || '');
                Frm.set('valorAdicionalDeslocamento', solicitacaoData?.totalAdicionalDeslocamento || '');
                Frm.set('valorDescontoAlimentacao', solicitacaoData?.totalDescontoAlimentacao || '');
                Frm.set('valorDescontoTransporte', solicitacaoData?.totalDescontoTransporte || '');
                Frm.set('totalDeDescontoDeTeto', solicitacaoData?.totalDescontoTeto || '');
                Frm.set('valorLiquidoDiarias', solicitacaoData?.totalSubtotal || '');
            }
            setError('');
        } catch (error) {
            setError(error.message);
        }
    }

    function handleSolicitacaoChangePassagens(eventPassagens: React.ChangeEvent<HTMLSelectElement>, Frm: FormHelper) {
        const selectedIdPassagens = eventPassagens.target.value;
        const selectedPassagens = solicitacaoOptionsPassagens.find(option => option.name === selectedIdPassagens);
        setSelectedSolicitacaoPassagens(selectedPassagens ? selectedPassagens.data : null);

        if (selectedPassagens && selectedPassagens.id !== '') {
            const solicitacaoDataPassagens = selectedPassagens.data;
            Frm.set('valor_passagens', solicitacaoDataPassagens?.valor_passagens || '');
        }
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
            <span style={{ color: 'blue' }}>{' ' + field || "0,00"}</span>
            <br></br>
        </>
    }

    // FUNÇÃO PARA FORMATAR O CAMPO DE DINHEIRO
    function limparNumeros(valor: string): string {
        return valor.replace(/\D/g, ''); // Remove todos os caracteres que não são números
    }

    // FUNÇÃO UTILIZADA PARA PERMITIR QUE O USUARIO EDITE O FORMULÁRIO MANUALMENTE
    function radioButtonEditForm(resposta: string) {
        return (
            <label style={{
                display: 'inline-block',
                marginRight: '1em',
                borderRadius: '5px',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
            }}>
                <input
                    type="radio"
                    name="opcao"
                    value={resposta.toLowerCase()}
                    checked={radioSelected === resposta.toLowerCase()}
                    onChange={(e) => setRadioSelected(e.target.value)}
                />
                {' '} {/* Adiciona um espaço */}
                {resposta}
            </label>
        )
    }

    // INTERVEIW - ÁREA DA ENTREVISTA
    function Interview(Frm: FormHelper) {
        useEffect(() => {
            if (Frm.data && Frm.data.processo && !dataFetched) {
                fetchProcessData(Frm.data.processo, process.env.NEXT_PUBLIC_INTERNAL_SECRET, "CAL", setFetchedData, setSolicitacaoOptions).then(() => {
                    if (Frm.data.calculoDiarias) {
                        handleSolicitacaoChange({ target: { value: Frm.data.calculoDiarias } } as React.ChangeEvent<HTMLSelectElement>, Frm);
                    }
                    setDataFetched(true);
                });
            }
            if (Frm.data && Frm.data.processo && !dataFetchedPassagens) {
                fetchProcessData(Frm.data.processo, process.env.NEXT_PUBLIC_INTERNAL_SECRET, "REQ", setFetchedDataPassagens, setSolicitacaoOptionsPassagens).then(() => {
                    if (Frm.data) {
                        handleSolicitacaoChangePassagens({ target: { value: Frm.data.emissaoPassagens } } as React.ChangeEvent<HTMLSelectElement>, Frm);
                    }
                    setDataFetchedPassagens(true);
                });
            }
        });
        return <>
            <div className="scrollableContainer">
                <div className="margin-bottom: 0.3em;
                                margin-top: 1em;
                                font-weight: bold;
                                font-size: 120%;">
                    CONCLUSÃO DE DESLOCAMENTO
                </div>
                <p><strong>Dados para o relatório de deslocamentos</strong></p>
                <div className='card my-2 p-2 ' style={{ backgroundColor: '#edf7fe' }}>
                    <h6>Dados da Solicitação de Deslocamento</h6>
                    {fetchedData && (
                        <Frm.Select
                            label="Selecione o código do cálculo de diárias"
                            name="calculoDiarias"
                            options={solicitacaoOptions}
                            onChange={(event) => handleSolicitacaoChange(event, Frm)}
                            width={8}
                        />
                    )}

                    {/* BUSCAR DADOS DA EMISSÃO DE PASSAGENS */}
                    {fetchedDataPassagens && (
                        <Frm.Select label="Selecione o código da emissão de passagens"
                            name="emissaoPassagens"
                            options={solicitacaoOptionsPassagens}
                            onChange={(eventPassagens) => handleSolicitacaoChangePassagens(eventPassagens, Frm)}
                            width={8}
                        />
                    )}
                </div>
                <div>
                    {/* {(selectedSolicitacao) ?
                        <>
                            Deseja editar os dados da conclusão de deslocamento manualmente?<br />
                            {radioButtonEditForm("Sim")}
                            < br />
                            {radioButtonEditForm("Não")}
                        </>
                        :
                        <></>
                    } */}
                </div>

                <div hidden={radioSelected == "não"}>
                    {/* <Frm.TextArea label="Justifique:" name="justificativa" width={12} /> */}
                    <h3>Dados do Proponente</h3>
                    <div className="row">
                        <Frm.Input
                            label="Código do Cálculo de Diárias:"
                            name="calculoDiarias"
                            width={6}
                        />
                        {/* <Frm.Input
                            label="Código da Emissão de Passagens:"
                            name="emissaoPassagens"
                            width={6}
                        /> */}
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

                    <p></p><h3>Dados do Beneficiário</h3>


                    <Frm.Select label="Tipo de Beneficiário" name="tipoBeneficiario" options={options.tipoBeneficiarioOptions} width={6} />

                    {Frm.get('tipoBeneficiario') == '1' && (
                        <>
                            <Pessoa Frm={Frm} name="pessoa" label1="Matrícula" label2="Nome" onChange={(pessoa) => handleBeneficiarioChange(pessoa, Frm)} />

                            <div className="row">
                                {/* <Frm.Input label="Função" name="funcaoBeneficiario" width={6} /> */}
                                <Frm.Input label="Cargo" name="cargoBeneficiario" width={6} />
                            </div>
                        </>
                    )}
                    {Frm.get('tipoBeneficiario') > '1' && (
                        <>
                            <Frm.NameInput label="Beneficiário" name="nomePessoa" width={6} />
                            <Frm.CPFInput label="CPF" name="cpf" width={6} />
                        </>
                    )}

                    <p></p><h3>Dados do Deslocamento</h3>

                    <Frm.Input label="Finalidade" name="finalidade" width={12} />
                    <Frm.Select label="Tipo de Viagem" name="tipoDeslocamento" width={4} options={options.tipoDeslocamentoOptions} />
                    <Frm.Input label="Itinerário" name="origemDestino" width={6} />
                    <Frm.RadioButtons label="Retorno a Origem?" name="retorno_a_origem" options={options.retornoAOrigem} width={12} />
                    <div className="row">
                        <Frm.dateInput label="Período (De)" name="periodoDe" width={6} />
                        <Frm.dateInput label="Período (Até)" name="periodoAte" width={6} />
                    </div>
                    <Frm.Select label="Meio de Transporte" name="meioTransporte" options={options.meioTransporteOptions} width={4} />

                    {/* Dados dos cálculos */}
                    <div className="row">
                        <Frm.MoneyInputFloat label="Valor Bruto das Diárias" name="valorBrutoDiarias" width={6} />
                        <Frm.MoneyInputFloat label="Adicional de Deslocamento" name="valorAdicionalDeslocamento" width={6} />
                        <Frm.MoneyInputFloat label="Desconto de Auxílio Alimentação" name="valorDescontoAlimentacao" width={6} />
                        <Frm.MoneyInputFloat label="Desconto de Auxílio Transporte" name="valorDescontoTransporte" width={6} />
                        <Frm.MoneyInputFloat label="Desconto de Teto" name="totalDeDescontoDeTeto" width={6} />
                        <Frm.MoneyInputFloat label="Valor Líquido das Diárias" name="valorLiquidoDiarias" width={6} />
                    </div>
                    {/* Valor das passagens */}
                    <Frm.MoneyInputFloat label="Valor Total das Passagens" name="valor_passagens" width={6} />
                </div>
            </div>
        </>
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

    function document(data: any) {

        const Frm = new FormHelper();
        Frm.update(data);
        const {
            data_solicitacao,
            calculoDiarias,
            emissaoPassagens,
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
            valor_passagens,
            justificativa,
            nomePessoa,
            cpf
        } = Frm.data;

        return <>

            {!selectedSolicitacao && (
                <div className="scrollableContainer">
                    <strong>Dados Para o Relatório de Deslocamentos</strong><br></br>

                    {formatForm("Código da Solicitação de Deslocamento:", solicitacaoDeslocamento)}
                    {/* {formatForm("Código da Emissão de Passagens:", emissaoPassagens)} */}
                    {formatForm("Data da Solicitação de Deslocamento:", data_solicitacao)}

                    {/* DADOS DO PROPONENTE */}
                    {formatForm("Proponente:", proponente?.descricao)}
                    {formatForm("Cargo do Proponente:", cargoProponente)}

                    {formatForm("Tipo de Beneficiário:", getOptionName(options.tipoBeneficiarioOptions, tipoBeneficiario))}

                    {/* DADOS DO BENEFICIÁRIO */}
                    {tipoBeneficiario == '1' && (
                        <>
                            {formatForm("Beneficiário:", pessoa?.descricao)}
                            {formatForm("Cargo do Beneficiário:", cargoBeneficiario)}
                        </>
                    )}
                    {tipoBeneficiario > '1' && (
                        <>
                            {formatForm("Beneficiário:", nomePessoa.toUpperCase())}
                            {formatForm("CPF:", formatCPF(cpf))}
                            {/* Incluir os dados de banco ? */}
                        </>
                    )}

                    {formatForm("Finalidade:", finalidade)}
                    {formatForm("Tipo de Viagem:", getOptionName(options.tipoDeslocamentoOptions, tipoDeslocamento))}
                    {formatForm("Itinerário:", origemDestino)}
                    {formatForm("Retorno à Origem:", retorno_a_origem == true ? 'Sim' : 'Não')}
                    {formatForm("Período:", (periodoDe + " a " + periodoAte))}
                    {formatForm("Meio de Transporte:", getOptionName(options.meioTransporteOptions, meioTransporte))}

                    {/* VALORES DAS DIÁRIAS */}
                    {formatForm("Valor Bruto das Diárias:", formatCurrency(valorBrutoDiarias) || '0,00')}
                    {formatForm("Adicional de Deslocamento:", formatCurrency(valorAdicionalDeslocamento) || '0,00')}
                    {formatForm("Desconto de Auxílio Alimentação:", formatCurrency(valorDescontoAlimentacao || '0,00'))}
                    {formatForm("Desconto de Auxílio Transporte:", formatCurrency(valorDescontoTransporte || '0,00'))}
                    {formatForm("Desconto de Teto:", formatCurrency(totalDeDescontoDeTeto || '0,00'))}
                    {formatForm("Valor Líquido das Diárias:", formatCurrency(valorLiquidoDiarias || '0,00'))}

                    {/* VALOR DAS PASSAGENS */}
                    {formatForm("Valor Total das Passagens:", formatCurrency(valor_passagens || '0,00'))}

                    {/* JUSTIFICATIVA */}
                    {/* {radioSelected == "sim" ? formatForm("Justificativa:", justificativa || "Não informado") : ''} */}
                </div>
            )}

            {selectedSolicitacao && (
                <>
                    <strong>Dados Para o Relatório de Deslocamentos</strong><br></br>
                    {formatForm("Código da Solicitação de Deslocamento:", selectedSolicitacao.solicitacaoDeslocamento = calculoDiarias)}
                    {formatForm("Data da Solicitação de Deslocamento:", selectedSolicitacao.dataAtual = data_solicitacao)}

                    {/* DADOS DO PROPONENTE */}
                    {formatForm("Proponente:", selectedSolicitacao.proponente.descricao = proponente?.descricao)}
                    {formatForm("Cargo do Proponente:", selectedSolicitacao.cargoProponente = cargoProponente)}

                    {/* DADOS DO BENEFICIÁRIO */}
                    {formatForm("Tipo de Beneficiário:", getOptionName(options.tipoBeneficiarioOptions, selectedSolicitacao.tipoBeneficiario = tipoBeneficiario))}

                    {tipoBeneficiario == '1' && (
                        <>
                            {formatForm("Beneficiário:", selectedSolicitacao.pessoa.descricao = pessoa?.descricao)}
                            {formatForm("Cargo do Beneficiário:", selectedSolicitacao.cargoPessoa = cargoBeneficiario)}
                        </>
                    )}
                    {tipoBeneficiario > '1' && (
                        <>
                            {formatForm("Beneficiário:", (selectedSolicitacao.nome = nomePessoa).toUpperCase())}
                            {formatForm("CPF:", formatCPF(selectedSolicitacao.CPF = cpf))}
                            {/* Incluir os dados de banco */}
                        </>
                    )}

                    {formatForm("Finalidade:", selectedSolicitacao.servicoAtividade = finalidade)}
                    {formatForm("Tipo de Viagem:", getOptionName(options.tipoDeslocamentoOptions, selectedSolicitacao.tipoDeslocamento = tipoDeslocamento))}
                    {formatForm("Itinerário:", selectedSolicitacao.trajeto = origemDestino)}
                    {formatForm("Retorno à Origem:", selectedSolicitacao.return_to_origin ? 'Sim' : 'Não')}
                    {formatForm("Período:", (selectedSolicitacao.periodoDe = periodoDe) + " a " + (selectedSolicitacao.periodoAte = periodoAte))}
                    {formatForm("Meio de Transporte:", getOptionName(options.meioTransporteOptions, selectedSolicitacao.meioTransporte = meioTransporte))}

                    {/* VALORES DAS DIÁRIAS */}
                    {formatForm("Valor Bruto das Diárias:", formatCurrency(selectedSolicitacao.totalDiaria = valorBrutoDiarias))}
                    {formatForm("Adicional de Deslocamento:", formatCurrency(selectedSolicitacao.totalAdicionalDeslocamento = valorAdicionalDeslocamento))}
                    {formatForm("Desconto de Auxílio Alimentação:", formatCurrency(selectedSolicitacao.totalDescontoAlimentacao = valorDescontoAlimentacao))}
                    {formatForm("Desconto de Auxílio Transporte:", formatCurrency(selectedSolicitacao.totalDescontoTransporte = valorDescontoTransporte))}
                    {formatForm("Desconto de Teto:", formatCurrency(selectedSolicitacao.totalDescontoTeto = totalDeDescontoDeTeto))}
                    {formatForm("Valor Líquido das Diárias:", formatCurrency(selectedSolicitacao.totalSubtotal = valorLiquidoDiarias))}

                    {/* VALOR TOTAL DAS PASSAGENS */}
                    {selectedSolicitacaoPassagens && (
                        formatForm("Valor Total das Passagens:", formatCurrency(selectedSolicitacaoPassagens.valor_passagens = valor_passagens) || 'Não informado')
                    )}

                    {/* JUSTIFICATIVA */}
                    {/* {radioSelected == "sim" ? formatForm("Justificativa:", justificativa || "Não informado") : ''} */}
                </>
            )}
        </>
    }

    return Model(Interview, document, { saveButton: true, pdfButton: false, pdfFileName: 'ConclusaoDeDeslocamento' })
}