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
            <div className="row">
                <Frm.timeInput label="Horário" name="horario" width={6} />
                <Frm.Input label="Local" name="local" width={6} />
            </div>
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
        <div className='scrollableContainer'>
            <h1 style={{ textAlign: 'center' }}>Memória de Reunião</h1>
            <div style={{ marginTop: '1rem', width: '100%' }}>
                <label style={{ fontWeight: 'bold' }}>Objetivo da Reunião</label>
                <p style={{ fontWeight: 'bold' }}>{objetivo || "Não informado"}</p>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                <div style={{ marginTop: '1rem', width: '50%' }}>
                    <label style={{ fontWeight: 'bold' }}>Horário</label>
                    <p style={{ fontWeight: 'bold' }}>{horario || "Não informado"}</p>
                </div>
                <div style={{ marginTop: '1rem', width: '50%' }}>
                    <label style={{ fontWeight: 'bold' }}>Local</label>
                    <p style={{ fontWeight: 'bold' }}>{local || "Não informado"}</p>
                </div>
            </div>
            <div style={{ marginTop: '1rem', width: '100%' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid black', backgroundColor: 'white' }}>
                    <thead>
                        <tr>
                            <th style={{ border: '1px solid black' }}>Participantes</th>
                            <th style={{ border: '1px solid black' }}>Função/Cargo</th>
                            <th style={{ border: '1px solid black' }}>Unidade</th>
                        </tr>
                    </thead>
                    <tbody>
                        {participantes?.map((p: any, index: number) => (
                            <tr key={index}>
                                <td style={{ border: '1px solid black' }}>{p.descricao}</td>
                                <td style={{ border: '1px solid black' }}>{p.cargo}</td>
                                <td style={{ border: '1px solid black' }}>{p.siglaUnidade}</td>
                            </tr>
                        ))}
                        {participantesExtras?.map((extra: any, index: number) => (
                            <tr key={index}>
                                <td style={{ border: '1px solid black' }}>{extra.nome} ({extra.email})</td>
                                <td style={{ border: '1px solid black' }}>{extra.funcao}</td>
                                <td style={{ border: '1px solid black' }}>{extra.unidade}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div style={{ marginTop: '1rem', width: '100%' }}>
                <label style={{ fontWeight: 'bold' }}>Itens de Pauta</label>
                <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid black', backgroundColor: 'white' }}>
                    <thead>
                        <tr>
                            <th style={{ border: '1px solid black' }}>Pauta</th>
                        </tr>
                    </thead>
                    <tbody>
                        {itensDePauta?.map((item: any, index: number) => (
                            <tr key={index}>
                                <td style={{ border: '1px solid black' }}>
                                    <strong>{index + 1}: {item.item || "Não informado"}</strong>
                                    <p dangerouslySetInnerHTML={{ __html: item.comentarios || "Não informado" }}></p>
                                    {item.acoes && item.acoes.length > 0 && (
                                        <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid black', backgroundColor: 'white' }}>
                                            <thead>
                                                <tr>
                                                    <th style={{ border: '1px solid black' }}>Ref.</th>
                                                    <th style={{ border: '1px solid black' }}>Próximas Ações</th>
                                                    <th style={{ border: '1px solid black' }}>Responsável</th>
                                                    <th style={{ border: '1px solid black' }}>Data Prevista</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {item.acoes.map((acao: any, acaoIndex: number) => (
                                                    <tr key={acaoIndex}>
                                                        <td style={{ border: '1px solid black' }}>{index + 1}.{acaoIndex + 1}</td>
                                                        <td style={{ border: '1px solid black' }}>{acao.acao || "Não informado"}</td>
                                                        <td style={{ border: '1px solid black' }}>{acao.responsavel || "Não informado"}</td>
                                                        <td style={{ border: '1px solid black' }}>{acao.dataPrevista || "Não informado"}</td>
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