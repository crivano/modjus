'use client'

import { useState } from 'react';
import { FormHelper } from "@/libs/form-support"; 
import Model from "@/libs/model"

function meetingForm(Frm: FormHelper) {
    const [startDate, setStartDate] = useState<Date | null>(new Date());
    const handleDateChange = (date: Date | null) => {
        setStartDate(date);
    };

    const oDe1a20 = Array.from({ length: 21 }, (_, i) => ({ id: `${i}`, name: `${i}` }));

    return (
        <>
            <h1>Memória de Reunião</h1>
            <Frm.TextArea label="Objetivo da Reunião" name="objetivo" width={12} />
            <Frm.timeInput label="Horário" name="horario" width={4} />
            <Frm.Input label="Local" name="local" width={4} />
            <Frm.DynamicListPessoa label="Participantes" name="participantes" width={12} />
            <Frm.DynamicListPessoa label="Participantes Extras" name="participantesExtras" width={12} />
            <Frm.Select label="Quantidade de Itens da Pauta" name="quantidadeItensPauta" options={oDe1a20} width={4} />
            <Frm.TextArea label="Comentários" name="comentarios" width={12} />
            <Frm.Select label="Quantidade de Ações" name="quantidadeAcoes" options={oDe1a20} width={4} />
        </>
    );
}

function document(data: any) {
    const Frm = new FormHelper();
    Frm.update(data);
    const {
        objetivo,
        horario,
        local,
        participantes,
        participantesExtras,
        quantidadeItensPauta,
        comentarios,
        quantidadeAcoes,
    } = Frm.data;

    return (
        <div className="row">
            <h1 className="text-center">Memória de Reunião</h1>
            <div className="mt-3 col col-12 col-md-12">
                <label className="report-label form-label">Objetivo da Reunião</label>
                <p className="report-field">{objetivo}</p>
            </div>
            <div className="mt-3 col col-12 col-md-4">
                <label className="report-label form-label">Horário</label>
                <p className="report-field">{horario}</p>
            </div>
            <div className="mt-3 col col-12 col-md-4">
                <label className="report-label form-label">Local</label>
                <p className="report-field">{local}</p>
            </div>
            <div className="mt-3 col col-12 col-md-12">
                <label className="report-label form-label">Participantes</label>
                <p className="report-field">{Array.isArray(participantes) ? participantes.join(', ') : participantes}</p>
            </div>
            <div className="mt-3 col col-12 col-md-12">
                <label className="report-label form-label">Participantes Extras</label>
                <p className="report-field">{Array.isArray(participantesExtras) ? participantesExtras.join(', ') : participantesExtras}</p>
            </div>
            <div className="mt-3 col col-12 col-md-4">
                <label className="report-label form-label">Quantidade de Itens da Pauta</label>
                <p className="report-field">{quantidadeItensPauta}</p>
            </div>
            <div className="mt-3 col col-12 col-md-12">
                <label className="report-label form-label">Comentários</label>
                <p className="report-field">{comentarios}</p>
            </div>
            <div className="mt-3 col col-12 col-md-4">
                <label className="report-label form-label">Quantidade de Ações</label>
                <p className="report-field">{quantidadeAcoes}</p>
            </div>
        </div>
    );
}

export default function MeetingMemory() {
    return Model(meetingForm, document, { saveButton: true, pdfButton: true, pdfFileName: 'memoria-de-reuniao' });
}