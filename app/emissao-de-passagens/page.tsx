'use client'

import { useState } from 'react';
import { FormHelper } from "@/libs/form-support";
import Model from "@/libs/model";
import styles from './emissao-de-passagens.module.css'; // Import the CSS module

export default function EmissaoPassagens() {
    const Frm = new FormHelper();

    function interview(Frm: FormHelper) {
        const [startDate, setStartDate] = useState<Date | null>(new Date());
        const handleDateChange = (date: Date | null) => {
            setStartDate(date);
        };

        return (
            <div className={styles.scrollableContainer}>
                <h3>EMISSÃO DE PASSAGENS</h3>
                <strong>Passagens</strong>
                <Frm.DynamicListDadosEmbarque label="Dados do Embarque" name="dadosEmbarque" />
                <p><strong>Reserva</strong></p>
                <Frm.Input label="Número do RPA:" name="rpa_passagens" />
                <Frm.Space px="20px" />
                <p><strong>Custos</strong></p>
                <Frm.MoneyInputFloat label="Valor Total das Passagens:" name="valor_passagens" width={6} />
            </div>
        );
    }

    function document(data: any) {
        Frm.update(data);
        const {
            dadosEmbarque,
        } = Frm.data;

        // alert("teste")

        // const formatDateToBrazilian = (date: string) => {
        //     if (!date) return 'Não informado';
        //     return date;
        // };

        const formatFloatValue = (value: number): string => {
            return value?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        }

        return (
            <div className='scrollableContainer'>
                <span style={{ fontWeight: 'bold' }}>Passagens</span>
                <div style={{ marginTop: '1rem', marginBottom: '1rem', width: '100%' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid black', backgroundColor: 'white' }}>
                        <thead>
                            <tr style={{ textAlign: 'center', backgroundColor: 'lightgray' }}>
                                <th style={{ border: '1px solid black' }}>Data de Embarque</th>
                                <th style={{ border: '1px solid black' }}>Trecho</th>
                                <th style={{ border: '1px solid black' }}>Empresa</th>
                                <th style={{ border: '1px solid black' }}>Vôo/Linha</th>
                            </tr>
                        </thead>
                        <tbody>
                            {dadosEmbarque?.map((dadosEmbarque: any, index: number) => (
                                <tr key={index} style={{ textAlign: 'center' }}>
                                    <td style={{ border: '1px solid black' }}>{dadosEmbarque.data_de_embarque}</td>
                                    <td style={{ border: '1px solid black' }}>{dadosEmbarque.trecho}</td>
                                    <td style={{ border: '1px solid black' }}>{dadosEmbarque.empresa}</td>
                                    <td style={{ border: '1px solid black' }}>{dadosEmbarque.vooLinha}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                
                <div>
                    <strong>Reserva</strong>
                    <p>Número do RPA: <span style={{ color: 'blue' }}>{data.rpa_passagens || 'Não informado'}</span></p>
                </div>
                <div>
                    <strong>Custos</strong>
                    <p>Valor Total das Passagens: <span style={{ color: 'blue' }}>{formatFloatValue(data.valor_passagens || '0')}</span></p>      
                </div>
            </div>
        );
    }

    return Model(interview, document, { saveButton: true, pdfButton: false, pdfFileName: 'EmissaoPassagens' });
}