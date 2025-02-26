'use client'

import { useState } from 'react';
import { FormHelper } from "@/libs/form-support";
import Model from "@/libs/model"
import Pessoa from "@/components/sei/Pessoa"

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

function handleBeneficiarioChange(beneficiario: any, Frm: FormHelper) {
    if (beneficiario && beneficiario.sigla) {
        Frm.set('funcaoBeneficiario', beneficiario.funcao || '');
        Frm.set('cargoBeneficiario', beneficiario.cargo || '');
    }
}

function handleProponenteChange(proponente: any, Frm: FormHelper) {
    if (proponente) {
        Frm.set('funcaoProponente', proponente.funcao || '');
        Frm.set('cargoProponente', proponente.cargo || '');
    }
}

function handleRetornoAOrigemChange(event: React.ChangeEvent<HTMLInputElement>) {
    Frm.set('RetornoAOrigem', event.target.checked ? 'Sim' : 'Não');
}

return (
    <div>
        <strong>CONCLUSÃO DE DESLOCAMENTO</strong>
        <p><strong>Dados para o relatório de deslocamentos</strong></p>
        <Frm.TextArea label="Código da Solicitação de Deslocamento:" name="codigo" width={12} />
        <Frm.TextArea label="Data da Solicitação de Deslocamento:" name="dataDeslocamento" width={12} />

        <div style={{ marginTop: '20px' }}></div> {/* Add spacing */}

        <h2>Dados do Proponente</h2>
        <Pessoa Frm={Frm} name="proponente" label1="Matrícula" label2="Nome" onChange={(proponente) => handleProponenteChange(proponente, Frm)} />
        <Frm.TextArea label="Cargo:" name="cargoProponente" width={12} />

        <div style={{ marginTop: '20px' }}></div> {/* Add spacing */}

        <h2>Dados do Beneficiário</h2>
        <Frm.Select label="Tipo de Beneficiário" name="tipoBeneficiario" options={tipoBeneficiarioOptions} width={12} />
        <Pessoa Frm={Frm} name="beneficiario" label1="Matrícula" label2="Nome" onChange={(pessoa) => handleBeneficiarioChange(pessoa, Frm)} />
        <Frm.TextArea label="Cargo:" name="cargoBeneficiario" width={12} />
        <Frm.TextArea label="Finalidade:" name="Finalidade" width={12} />
        <Frm.Select label='Tipo de Viagem' name='tipoViagem' options={tipoDeslocamentoOptions} width={12} />
        <Frm.TextArea label="Itinerário:" name="Itinerario" width={12} />
        <label style={{ marginTop: '20px' }}>
            <input type="checkbox" onChange={handleRetornoAOrigemChange} />
            {' '} Retorno à Origem
        </label>

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
            <Frm.MoneyInput label="Valor Bruto das Diárias:" name="ValorBrutoDasDiarias" width={4} />
            <Frm.MoneyInput label="Adicional de Deslocamento:" name="AdicionalDeDeslocamento" width={4} />
            <Frm.MoneyInput label="Desconto de Auxílio Alimentação:" name="DescontoDeAuxilioAlimentacao" width={4} />
            <Frm.MoneyInput label="Desconto de Auxílio Transporte:" name="DescontoDeAuxilioTransporte" width={4} />
            <Frm.MoneyInput label="Desconto de Teto:" name="DescontoDeTeto" width={4} />
            <Frm.MoneyInput label="Valor Líquido das Diárias:" name="ValorLiquidoDasDiarias" width={4} />
            <Frm.MoneyInput label="Valor Total das Passagens:" name="ValorTotalDasPassagens" width={4} />
        </div>
    </div>
);
}

function document(data: any) {
    const Frm = new FormHelper();
    Frm.update(data);
    const {
        codigo,
        dataDeslocamento,
        cargoProponente,
        Finalidade,
        Itinerario,
        RetornoAOrigem,
        ValorBrutoDasDiarias,
        AdicionalDeDeslocamento,
        DescontoDeAuxilioAlimentacao,
        DescontoDeAuxilioTransporte,
        DescontoDeTeto,
        ValorLiquidoDasDiarias,
        ValorTotalDasPassagens,
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

        <label>Código da Solicitação de Deslocamento: </label>{' '}{codigo || "Não informado"}<br></br>
        <label>Data da Solicitação de Deslocamento: </label>{' '}{dataDeslocamento || "Não informado"}<br></br>

        {/* DADOS DO PROPONENTE */}
        <label>Proponente:</label>{' '}{data.proponente?.descricao || 'Não informado'}<br></br>
        <label>Cargo do Proponente:</label>{' '}{cargoProponente || "Não informado"}<br></br>

        {/* DADOS DO BENEFICIÁRIO */}
        <label>Tipo de Beneficiário:</label> {getOptionName(tipoBeneficiarioOptions, data.tipoBeneficiario)} <br></br>
        <label>Beneficiário:</label> {data.beneficiario?.descricao || 'Não informado'}<br></br>
        <label>Cargo do Beneficiário:</label> {data.cargoBeneficiario || 'Não informado'}<br></br>
        <label>Finalidade:</label>{' '}{Finalidade || "Não informado"}<br></br>
        <label>Tipo de Viagem:</label> {getOptionName(tipoDeslocamentoOptions, data.tipoViagem)} <br></br>
        <label>Itinerário:</label>{' '}{Itinerario || "Não informado"}<br></br>
        <label>Retorno à Origem:</label>{' '}{RetornoAOrigem || "Não informado"}<br></br>

        {/* DADOS DO DESLOCAMENTO */}
        <label>Período:</label> De {formatDateToBrazilian(data.periodoDe)} até {formatDateToBrazilian(data.periodoAte)}<br></br>
        <label>Meio de Transporte:</label>{' '}{getOptionName(meioTransporteOptions, data.meioTransporte)}<br></br>

        {/* CÁLCULO DAS DIÁRIAS */}
        <label>Valor Bruto das Diárias:</label>{' '}{formatCurrency(ValorBrutoDasDiarias) || "Não informado"}<br></br>
        <label>Adicional de Deslocamento:</label>{' '}{formatCurrency(AdicionalDeDeslocamento) || "Não informado"}<br></br>
        <label>Desconto de Auxílio Alimentação:</label>{' '}{formatCurrency(DescontoDeAuxilioAlimentacao) || "Não informado"}<br></br>
        <label>Desconto de Auxílio Transporte:</label>{' '}{formatCurrency(DescontoDeAuxilioTransporte) || "Não informado"}<br></br>
        <label>Desconto de Teto:</label>{' '}{formatCurrency(DescontoDeTeto) || "Não informado"}<br></br>
        <label>Valor Líquido das Diárias:</label>{' '}{formatCurrency(ValorLiquidoDasDiarias) || "Não informado"}<br></br>
        <label>Valor Total das Passagens:</label>{' '}{formatCurrency(ValorTotalDasPassagens) || "Não informado"}<br></br>
    </div>
);
}

export default function MeetingMemory() {
    return Model(ConclusaoDeslocamento, document, { saveButton: true, pdfButton: false, pdfFileName: 'conclusao-de-deslocamento' });
}
