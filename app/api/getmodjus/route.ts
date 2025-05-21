import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
    try {
        // Obtém parâmetros da query
        const { searchParams } = new URL(req.url);
        const num_processo = searchParams.get('num_processo');
        const tipo_documento = searchParams.get('tipo_documento'); // Novo parâmetro

        // 🔥 Variáveis de ambiente sempre lidas no runtime!
       
        const nome_documento = (
              tipo_documento == 'SOL'? process.env.FORM_DAILY_SOLICITATION 
            : tipo_documento == 'CAL'? process.env.FORM_DAILY_CALCULATION
            : tipo_documento == 'REQ'? process.env.FORM_TICKET_ISSUANCE
            : tipo_documento == 'AVD'? process.env.FORM_UPDATE_OF_DAILY_RATES
            : ''
        );

        if (tipo_documento == 'AVD') {

        } else if (!num_processo || !tipo_documento) {
            return NextResponse.json(
                { error: 'Parâmetros num_processo e tipo_documento são obrigatórios' },
                { status: 400 }
            );
        }
        
        const apiBaseUrl = process.env.EXTERNAL_API_BASE_URL;
        const apiAuth = process.env.API_AUTH;

        if (!nome_documento || !apiBaseUrl || !apiAuth) {
            return NextResponse.json({ error: 'Configuração inválida no ambiente' }, { status: 500 });
        }

        // 🔹 Faz a requisição para a API externa usando os parâmetros
        const response = await axios.get(`${apiBaseUrl}/getmodjusdocsprocess`, {
            params: { num_processo, nome_documento },
            headers: {
                'Authorization': `Basic ${apiAuth}`,
                'x-forwarded-for': '127.0.0.1'
            }
        });

        return NextResponse.json(response.data, { status: 200 });
    } catch (error) {
        console.error('Erro na API:', error);
        return NextResponse.json({ error: 'Erro ao buscar os dados' }, { status: 500 });
    }
}
