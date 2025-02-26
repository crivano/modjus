'use client'

import { useState } from 'react';
import { FormHelper } from "@/libs/form-support";
import Model from "@/libs/model"
import Pessoa from "@/components/sei/Pessoa"
import { FormCheck } from 'react-bootstrap';

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

function ConclusaoDeslocamento(Frm: FormHelper) {
    const [startDate, setStartDate] = useState<Date | null>(new Date());
    const handleDateChange = (date: Date | null) => {
        setStartDate(date);
    };

    function handleProponenteChange(proponente: any, nameCargoProponente: any, Frm: FormHelper) {
        if (proponente) {
            Frm.set('funcaoProponente', proponente.funcao || '');
            Frm.set(nameCargoProponente, proponente.cargo || '');
        }
    }

    function handleBeneficiarioChange(beneficiario: any, nameCargoBeneficiario: any, Frm: FormHelper) {
        if (beneficiario && beneficiario.sigla) {
            Frm.set('funcaoBeneficiario', beneficiario.funcao || '');
            Frm.set(nameCargoBeneficiario, beneficiario.cargo || '');
        }
    }

    function handleRetornoAOrigemChange(event: React.ChangeEvent<HTMLInputElement>) {
        Frm.set('retorno_a_origem', event.target.value);
    }

    return (
        <div>
            <strong>CONCLUSÃO DE DESLOCAMENTO</strong>
            <p><strong>Dados para o relatório de deslocamentos</strong></p>
            <div className='row'>
                <Frm.Input label="Código da Solicitação de Deslocamento:" name="solicitacao_codigo" width={6} />
                <Frm.dateInput label="Data da Solicitação de Deslocamento:" name="solicitacao_data" width={6} />
            </div>

            <div style={{ marginTop: '20px' }}></div> {/* Add spacing */}

            <h2>Dados do Proponente</h2>
            <Pessoa Frm={Frm} name="proponente" label1="Matrícula" label2="Nome" onChange={(proponente) => handleProponenteChange(proponente, 'prop_cargo_funcao', Frm)} />
            <Frm.TextArea label="Cargo:" name="prop_cargo_funcao" width={12} />

            <div style={{ marginTop: '20px' }}></div> {/* Add spacing */}

            <h2>Dados do Beneficiário</h2>
            <Frm.Select label="Tipo de Beneficiário" name="benef_tipo" options={tipoBeneficiarioOptions} width={12} />
            <Pessoa Frm={Frm} name="beneficiario" label1="Matrícula" label2="Nome" onChange={(pessoa) => handleBeneficiarioChange(pessoa, 'benef_cargo_funcao', Frm)} />
            <Frm.TextArea label="Cargo:" name="benef_cargo_funcao" width={12} />
            <Frm.TextArea label="Finalidade:" name="finalidade" width={12} />
            <Frm.Select label='Tipo de Viagem' name='tipo_viagem' options={tipoDeslocamentoOptions} width={12} />
            <Frm.TextArea label="Itinerário:" name="itinerario" width={12} />
            <div style={{ marginTop: '20px' }}>
                <label>Retorno à Origem:</label>
                <FormCheck
                    type="radio"
                    label="Sim"
                    name="retorno_a_origem"
                    value="Sim"
                    onChange={handleRetornoAOrigemChange}
                />
                <FormCheck
                    type="radio"
                    label="Não"
                    name="retorno_a_origem"
                    value="Não"
                    onChange={handleRetornoAOrigemChange}
                />
            </div>

            <div style={{ marginTop: '20px' }}></div> {/* Add spacing */}

            <h2>Dados do Deslocamento</h2>

            <div className="row">
                <Frm.dateInput label="Período (De)" name="periodoDe" width={6} />
                <Frm.dateInput label="Período (Até)" name="periodoAte" width={6} />
            </div>

            <Frm.Select label="Meio de Transporte" name="meioTransporte" options={meioTransporteOptions} width={6} />

            <div style={{ marginTop: '20px' }}></div> {/* Add spacing */}

            <h2>Cálculo das Diárias</h2>

            <div className='row'>
                <Frm.MoneyInput label="Valor Bruto das Diárias:" name="diarias_bruto" width={4} />
                <Frm.MoneyInput label="Adicional de Deslocamento:" name="adic_desloc" width={4} />
                <Frm.MoneyInput label="Desconto de Auxílio Alimentação:" name="desc_a_alim" width={4} />
                <Frm.MoneyInput label="Desconto de Auxílio Transporte:" name="desc_a_transp" width={4} />
                <Frm.MoneyInput label="Desconto de Teto:" name="desc_teto" width={4} />
                <Frm.MoneyInput label="Valor Líquido das Diárias:" name="diarias_liquido" width={4} />
                <Frm.MoneyInput label="Valor Total das Passagens:" name="passagens_liquido" width={4} />
            </div>
        </div>
    );
}

function document(data: any) {
    const Frm = new FormHelper();
    Frm.update(data);
    const {
        solicitacao_codigo,
        solicitacao_data,
        prop_cargo_funcao,
        finalidade,
        itinerario,
        retorno_a_origem,
        diarias_bruto,
        adic_desloc,
        desc_a_alim,
        desc_a_transp,
        desc_teto,
        diarias_liquido,
        passagens_liquido,
    } = Frm.data;


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

    return (
        <div>
            <p><strong>CONCLUSÃO DE DESLOCAMENTO</strong></p>
            <strong>Dados para o relatório de deslocamentos</strong><br></br>

            <label>Código da Solicitação de Deslocamento: </label>{' '}{solicitacao_codigo || "Não informado"}<br></br>
            <label>Data da Solicitação de Deslocamento: </label>{' '}{formatDateToBrazilian(solicitacao_data) || "Não informado"}<br></br>

            {/* DADOS DO PROPONENTE */}
            <label>Proponente:</label>{' '}{data.proponente?.descricao || 'Não informado'}<br></br>
            <label>Cargo do Proponente:</label>{' '}{prop_cargo_funcao || "Não informado"}<br></br>

            {/* DADOS DO BENEFICIÁRIO */}
            <label>Tipo de Beneficiário:</label> {getOptionName(tipoBeneficiarioOptions, data.benef_tipo)} <br></br>
            <label>Beneficiário:</label> {data.beneficiario?.descricao || 'Não informado'}<br></br>
            <label>Cargo do Beneficiário:</label> {data.benef_cargo_funcao || 'Não informado'}<br></br>
            <label>Finalidade:</label>{' '}{finalidade || "Não informado"}<br></br>
            <label>Tipo de Viagem:</label> {getOptionName(tipoDeslocamentoOptions, data.tipo_viagem)} <br></br>
            <label>Itinerário:</label>{' '}{itinerario || "Não informado"}<br></br>
            <label>Retorno à Origem:</label>{' '}{retorno_a_origem || "Não informado"}<br></br>

            {/* DADOS DO DESLOCAMENTO */}
            <label>Período:</label> De {formatDateToBrazilian(data.periodoDe)} até {formatDateToBrazilian(data.periodoAte)}<br></br>
            <label>Meio de Transporte:</label>{' '}{getOptionName(meioTransporteOptions, data.meioTransporte)}<br></br>

            {/* CÁLCULO DAS DIÁRIAS */}
            <label>Valor Bruto das Diárias:</label>{' '}{formatCurrency(diarias_bruto) || "Não informado"}<br></br>
            <label>Adicional de Deslocamento:</label>{' '}{formatCurrency(adic_desloc) || "Não informado"}<br></br>
            <label>Desconto de Auxílio Alimentação:</label>{' '}{formatCurrency(desc_a_alim) || "Não informado"}<br></br>
            <label>Desconto de Auxílio Transporte:</label>{' '}{formatCurrency(desc_a_transp) || "Não informado"}<br></br>
            <label>Desconto de Teto:</label>{' '}{formatCurrency(desc_teto) || "Não informado"}<br></br>
            <label>Valor Líquido das Diárias:</label>{' '}{formatCurrency(diarias_liquido) || "Não informado"}<br></br>
            <label>Valor Total das Passagens:</label>{' '}{formatCurrency(passagens_liquido) || "Não informado"}<br></br>
        </div>
    );
}

export default function MeetingMemory() {
    return Model(ConclusaoDeslocamento, document, { saveButton: true, pdfButton: false, pdfFileName: 'conclusao-de-deslocamento' });
}
