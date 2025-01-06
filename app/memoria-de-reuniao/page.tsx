'use client'

import { useState } from 'react';
import { FormHelper } from "@/libs/form-support"; 
import Model from "@/libs/model"
import styles from './memoria-de-reuniao.module.css'; // Import the CSS module

function meetingForm(Frm: FormHelper) {
    const [startDate, setStartDate] = useState<Date | null>(new Date());
    const handleDateChange = (date: Date | null) => {
        setStartDate(date);
    };

    return (
        <div className={styles.scrollableContainer}>
            <h1>Memória de Reunião</h1>
            <Frm.TextArea label="Objetivo da Reunião" name="objetivo" width={12} />
            <Frm.timeInput label="Horário" name="horario" width={4} />
            <Frm.Input label="Local" name="local" width={4} />
            <Frm.DynamicListPessoa label="Participantes" name="participantes" width={12} />
            <Frm.DynamicListParticipantesExtras label="Participantes Extras" name="participantesExtras" width={12} />
            <Frm.DynamicListItensDePauta label="Itens de Pauta" name="itensDePauta" width={12} />
        </div>
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
        itensDePauta,
    } = Frm.data;

    return (
        <div className={styles.scrollableContainer}>
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
                <table className="table table-bordered">
                    <thead>
                        <tr>
                            <th>Participantes</th>
                            <th>Função/Cargo</th>
                            <th>Unidade</th>
                        </tr>
                    </thead>
                    <tbody>
                        {participantes?.map((p: any, index: number) => (
                            <tr key={index}>
                                <td>{p.descricao}</td>
                                <td>{p.cargo}</td>
                                <td>{p.siglaUnidade}</td>
                            </tr>
                        ))}
                        {participantesExtras?.map((extra: any, index: number) => (
                            <tr key={index}>
                                <td>{extra.nome} ({extra.email})</td>
                                <td>{extra.funcao}</td>
                                <td>{extra.unidade}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="mt-3 col col-12 col-md-12">
                <label className="report-label form-label">Itens de Pauta</label>
                <table className="table table-bordered">
                    <thead>
                        <tr>
                            <th>Pauta</th>
                        </tr>
                    </thead>
                    <tbody>
                        {itensDePauta?.map((item: any, index: number) => (
                            <tr key={index}>
                                <td>
                                    <strong>{index + 1}: {item.item || "Não informado"}</strong>
                                    <p>{item.comentarios || "Não informado"}</p>
                                    {item.acoes && item.acoes.length > 0 && (
                                        <table className="table table-bordered">
                                            <thead>
                                                <tr>
                                                    <th>Ref.</th>
                                                    <th>Próximas Ações</th>
                                                    <th>Responsável</th>
                                                    <th>Data Prevista</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {item.acoes.map((acao: any, acaoIndex: number) => (
                                                    <tr key={acaoIndex}>
                                                        <td>{index + 1}.{acaoIndex + 1}</td>
                                                        <td>{acao.acao || "Não informado"}</td>
                                                        <td>{acao.responsavel || "Não informado"}</td>
                                                        <td>{acao.dataPrevista ? new Date(acao.dataPrevista).toLocaleDateString('pt-BR') : "Não informado"}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default function MeetingMemory() {
    return Model(meetingForm, document, { saveButton: true, pdfButton: true, pdfFileName: 'memoria-de-reuniao' });
}