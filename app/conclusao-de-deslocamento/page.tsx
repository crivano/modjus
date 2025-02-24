'use client'

import { useState } from 'react';
import { FormHelper } from "@/libs/form-support";
import Model from "@/libs/model"

function MeetingForm(Frm: FormHelper) {
    const [startDate, setStartDate] = useState<Date | null>(new Date());
    const handleDateChange = (date: Date | null) => {
        setStartDate(date);
    };

    return (
        <div>
            <strong>CONCLUSÃO DE DESLOCAMENTO</strong>
            <p><strong>Dados para o relatório de deslocamentos</strong></p>
            <Frm.TextArea label="Código da Solicitação de Deslocamento:" name="codigo" width={12} />
            <Frm.TextArea label="Data da Solicitação de Deslocamento:" name="dataDeslocamento" width={12} />
            <Frm.TextArea label="Proponente:" name="proponete" width={12} />
            <Frm.TextArea label="Cargo do Proponente:" name="cargoProponente" width={12} />
            <Frm.TextArea label="Tipo de Beneficiário:" name="tipoDeBeneficiario" width={12} />
            <Frm.TextArea label="Beneficiário" name="Beneficiario" width={12} />
            <Frm.TextArea label="Cargo do Beneficiário:" name="CargoDoBeneficiario" width={12} />
            <Frm.TextArea label="Finalidade:" name="Finalidade" width={12} />
            <Frm.TextArea label="Tipo de Viagem:" name="TipoDeViagem" width={12} />
            <Frm.TextArea label="Itinerário:" name="Itinerario" width={12} />
            <Frm.TextArea label="Retorno à Origem:" name="RetornoAOrigem" width={12} />
            <Frm.TextArea label="Período:" name="Periodo" width={12} />
            <Frm.TextArea label="Meio de Transporte:" name="MeioDeTransporte" width={12} />
            <Frm.TextArea label="Valor Bruto das Diárias:" name="ValorBrutoDasDiarias" width={12} />
            <Frm.TextArea label="Adicional de Deslocamento:" name="AdicionalDeDeslocamento" width={12} />
            <Frm.TextArea label="Desconto de Auxílio Alimentação:" name="DescontoDeAuxilioAlimentacao" width={12} />
            <Frm.TextArea label="Desconto de Auxílio Transporte:" name="DescontoDeAuxilioTransporte" width={12} />
            <Frm.TextArea label="Desconto de Teto:" name="DescontoDeTeto" width={12} />
            <Frm.TextArea label="Valor Líquido das Diárias:" name="ValorLiquidoDasDiarias" width={12} />
            <Frm.TextArea label="Valor Total das Passagens:" name="ValorTotalDasPassagens" width={12} />
        </div>
    );
}

function document(data: any) {
    const Frm = new FormHelper();
    Frm.update(data);
    const {
        codigo,
        dataDeslocamento,
        proponente,
        cargoProponente,
        tipoDeBeneficiario,
        Beneficiario,
        CargoDoBeneficiario,
        Finalidade,
        TipoDeViagem,
        Itinerario,
        RetornoAOrigem,
        Periodo,
        MeioDeTransporte,
        ValorBrutoDasDiarias,
        AdicionalDeDeslocamento,
        DescontoDeAuxilioAlimentacao,
        DescontoDeAuxilioTransporte,
        DescontoDeTeto,
        ValorLiquidoDasDiarias,
        ValorTotalDasPassagens
    } = Frm.data;

    return (
        <div>
            <p><strong>CONCLUSÃO DE DESLOCAMENTO</strong></p>
            <strong>Dados para o relatório de deslocamentos</strong><br></br>

            <label>Código da Solicitação de Deslocamento: </label>{' '}{codigo || "Não informado"}<br></br>
            <label>Data da Solicitação de Deslocamento: </label>{' '}{dataDeslocamento || "Não informado"}<br></br>
            <label>Proponente:</label>{' '}{proponente || "Não informado"}<br></br>
            <label>Cargo do Proponente:</label>{' '}{cargoProponente || "Não informado"}<br></br>
            <label>Tipo de Beneficiário:</label>{' '}{tipoDeBeneficiario || "Não informado"}<br></br>
            <label>Beneficiário:</label>{' '}{Beneficiario || "Não informado"}<br></br>
            <label>Cargo do Beneficiário:</label>{' '}{CargoDoBeneficiario || "Não informado"}<br></br>
            <label>Finalidade:</label>{' '}{Finalidade || "Não informado"}<br></br>
            <label>Tipo de Viagem:</label>{' '}{TipoDeViagem || "Não informado"}<br></br>
            <label>Itinerário:</label>{' '}{Itinerario || "Não informado"}<br></br>
            <label>Retorno à Origem:</label>{' '}{RetornoAOrigem || "Não informado"}<br></br>
            <label>Período:</label>{' '}{Periodo || "Não informado"}<br></br>
            <label>Meio de Transporte:</label>{' '}{MeioDeTransporte || "Não informado"}<br></br>
            <label>Valor Bruto das Diárias:</label>{' '}{ValorBrutoDasDiarias || "Não informado"}<br></br>
            <label>Adicional de Deslocamento:</label>{' '}{AdicionalDeDeslocamento || "Não informado"}<br></br>
            <label>Desconto de Auxílio Alimentação:</label>{' '}{DescontoDeAuxilioAlimentacao || "Não informado"}<br></br>
            <label>Desconto de Auxílio Transporte:</label>{' '}{DescontoDeAuxilioTransporte || "Não informado"}<br></br>
            <label>Desconto de Teto:</label>{' '}{DescontoDeTeto || "Não informado"}<br></br>
            <label>Valor Líquido das Diárias:</label>{' '}{ValorLiquidoDasDiarias || "Não informado"}<br></br>
            <label>Valor Total das Passagens:</label>{' '}{ValorTotalDasPassagens || "Não informado"}<br></br>
        </div>
    );
}

export default function MeetingMemory() {
    return Model(MeetingForm, document, { saveButton: true, pdfButton: false, pdfFileName: 'conclusao-de-deslocamento' });
}
