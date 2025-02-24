import axios from 'axios';
import { NextRequest, NextResponse } from 'next/server';
import { parseStringPromise } from 'xml2js';

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const matricula = searchParams.get('matricula');

    if (!matricula) {
        return NextResponse.json({ error: 'Matricula is required' }, { status: 400 });
    }

    const matriculaPrefix = matricula.substring(0, 2);
    let orgao;

    if (matriculaPrefix === 'T2') {
        orgao = 1;
    } else if (matriculaPrefix === 'RJ') {
        orgao = 2;
    } else {
        return NextResponse.json({ error: 'Não foi possível pegar os dados bancários' }, { status: 400 });
    }

    const soapEnvelope = `
        <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tem="http://tempuri.org/">
            <soapenv:Header/>
            <soapenv:Body>
                <tem:ConsultaDadosBancarios>
                    <tem:matricula>${matricula.substring(2)}</tem:matricula>
                    <tem:orgao>${orgao}</tem:orgao>
                </tem:ConsultaDadosBancarios>
            </soapenv:Body>
        </soapenv:Envelope>
    `;

    try {
        const response = await axios.post('http://vmwebjip2008.trf.net/wsconsultadadosbancarios/service1.asmx', soapEnvelope, {
            headers: {
                'Content-Type': 'text/xml',
                'SOAPAction': 'http://tempuri.org/ConsultaDadosBancarios'
            }
        });

        const result = await parseStringPromise(response.data, { explicitArray: false });
        const dadosBancarios = result['soap:Envelope']['soap:Body']['ConsultaDadosBancariosResponse']['ConsultaDadosBancariosResult'];

        if (!dadosBancarios) {
            return NextResponse.json({ data: { banco: '', agencia: '', contaCorrente: '' } });
        }

        const data = {
            banco: dadosBancarios.Banco,
            agencia: dadosBancarios.Agencia,
            contaCorrente: dadosBancarios.ContaCorrente
        };

        return NextResponse.json({ data });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
    }
}
