import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { parse } from 'json2csv';

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const num_processo = searchParams.get('num_processo');

        if (!num_processo) {
            return NextResponse.json(
                { error: 'Parâmetros num_processo são obrigatórios' },
                { status: 400 }
            );
        }

        const nome_documento = process.env.FORM_CONCLUSAO_DESLOCAMENTO;
        const apiBaseUrl = process.env.EXTERNAL_API_BASE_URL;
        const apiAuth = process.env.API_AUTH;

        if (!nome_documento || !apiBaseUrl || !apiAuth) {
            return NextResponse.json({ error: 'Configuração inválida no ambiente' }, { status: 500 });
        }

        const response = await axios.get(`${apiBaseUrl}/getmodjusdocsprocess`, {
            params: { num_processo, nome_documento },
            headers: {
                'Authorization': `Basic ${apiAuth}`,
                'x-forwarded-for': '127.0.0.1'
            }
        });

        const tipoBeneficiarioOptions = [
            { id: '', name: '' },
            { id: '1', name: 'TRF2/SJRJ/SJES' },
            { id: '2', name: 'Colaborador' },
            { id: '3', name: 'Colaborador Eventual' }
        ];

        const data = (response.data as any[]).map((item: any) => ({
            numero_conclusao: item.numero_documento,
            data_assinatura_conclusao: "00/00/0000", // TODO ajustar com a data de assinatura do documento
            solicitacao_de_deslocamento: item.modjusData.solicitacaoDeslocamento,
            solicitacao_de_deslocamento_data: item.modjusData.data_solicitacao, // TODO data de assinatura do documento de deslocamento
            prop_cargo_funcao: item.modjusData.funcaoProponente,
            beneficiario: item.modjusData.pessoa.descricao,
            beneficiario_tipo: tipoBeneficiarioOptions.find(option => option.id === item.modjusData.tipoBeneficiario)?.name, // Adjust as needed
            benef_cargo_funcao: item.modjusData.cargoBeneficiario,
            periodo: `${item.modjusData.periodoDe} a ${item.modjusData.periodoAte}`,
            data_inicio: item.modjusData.periodoDe,
            data_fim: item.modjusData.periodoAte,
            itinerario: item.modjusData.origemDestino,
            tipo_viagem: item.modjusData.tipoDeslocamento === "2" ? "Internacional" : "Nacional",
            meio_de_transporte: item.modjusData.meioTransporte === "1" ? "Aéreo" : "Outro", // Adjust as needed
            diarias_bruto: item.modjusData.valorBrutoDiarias || "0.00",
            adic_desloc: item.modjusData.valorAdicionalDeslocamento || "0.00",
            desc_aux_alim: item.modjusData.valorDescontoAlimentacao || "0.00",
            desc_aux_transp: item.modjusData.valorDescontoTransporte || "0.00",
            subtotal_diarias_bruto: item.modjusData.totalDeDescontoDeTeto || "0.00",
            desc_teto: item.modjusData.totalDeDescontoDeTeto || "0.00",
            diarias_liquido: item.modjusData.valorLiquidoDiarias || "0.00",
            passagens_liquido: "1255.47", // Adjust as needed
            finalidade: item.modjusData.finalidade
        }));

        const csv = parse(data);

        return new NextResponse(csv, {
            headers: {
                'Content-Type': 'text/csv',
                'Content-Disposition': 'attachment; filename="conclusao_deslocamento.csv"'
            }
        });
    } catch (error) {
        console.error('Erro na API:', error);
        return NextResponse.json({ error: 'Erro ao buscar os dados' }, { status: 500 });
    }
}
