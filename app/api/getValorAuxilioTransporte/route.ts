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
        return NextResponse.json({ error: 'Não foi possível pegar os valores de diaria de transporte' }, { status: 400 });
    }

    const soapEnvelope = `
        <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:web="http://webservice.webwork.web.sigabeneficios.jfrj.gov.br/">
            <soapenv:Header/>
            <soapenv:Body>
                <web:obtemValorAT>
                    <web:matricula>${matricula.substring(2)}</web:matricula>
                    <web:idOrgao>${orgao}</web:idOrgao>
                    <web:dataIni>2099-01-01</web:dataIni>
                    <web:dataFim>2099-01-01</web:dataFim>
                </web:obtemValorAT>
            </soapenv:Body>
        </soapenv:Envelope>
    `;

    try {
        const response = await axios.post('https://siga.jfrj.jus.br/siga-beneficios/servicos/BeneficiosWebService', soapEnvelope, {
            headers: {
                'Content-Type': 'text/xml',
                'SOAPAction': ''
            }
        });

        const result = await parseStringPromise(response.data, { explicitArray: false });
        const valorAuxilioTransporte = result['soap:Envelope']['soap:Body']['ns1:obtemValorATResponse']['return']['_'];

        return NextResponse.json({ valorAuxilioTransporte });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
    }
}
