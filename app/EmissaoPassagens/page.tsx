'use client'

import { useState } from 'react';
import { FormHelper } from "@/libs/form-support"; 
import Model from "@/libs/model";
import styles from './emissao-de-passagens.module.css'; // Import the CSS module

function EmissaoPassagens(Frm: FormHelper) {
    const [startDate, setStartDate] = useState<Date | null>(new Date());
    const handleDateChange = (date: Date | null) => {
        setStartDate(date);
    };

    return (
        <div className={styles.scrollableContainer}>
            <h1>EMISSAO DE PASSAGENS</h1>
            <strong>Passagens</strong>
            <Frm.DynamicListDadosEmbarque label="Dados do Embarque" name="dadosEmbarque" width={12} />
        </div>
    );
}

function document(data: any) {
    const Frm = new FormHelper();
    Frm.update(data);
    const {
        dadosEmbarque,
    } = Frm.data;

    return (
        <div className='scrollableContainer'>
            <h1 style={{ textAlign: 'center' }}>EMISSAO DE PASSAGENS</h1>
            <div style={{ marginTop: '1rem', width: '100%' }}>
                <p><strong>Passagens</strong></p>
            </div>

            <div style={{ marginTop: '1rem', width: '100%' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid black', backgroundColor: 'white' }}>
                    <thead>
                        <tr style={{textAlign:'center'}}>
                            <th style={{ border:'1px solid black' }}>Data de Embarque</th>
                            <th style={{ border: '1px solid black' }}>Trecho</th>
                            <th style={{ border: '1px solid black' }}>Empresa</th>
                            <th style={{ border: '1px solid black' }}>Vôo/Linha</th>
                        </tr>
                    </thead>
                    <tbody>
                        {dadosEmbarque?.map((dadosEmbarque: any, index: number) => (
                            <tr key={index}>
                                <td style={{ border: '1px solid black' }}>{dadosEmbarque.dataEmbarque}</td>
                                <td style={{ border: '1px solid black' }}>{dadosEmbarque.trecho}</td>
                                <td style={{ border: '1px solid black' }}>{dadosEmbarque.empresa}</td>
                                <td style={{ border: '1px solid black' }}>{dadosEmbarque.vooLinha}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default function MeetingMemory() {
    return Model(EmissaoPassagens, document, { saveButton: true, pdfButton: false, pdfFileName: 'EmissaoPassagens' });
}