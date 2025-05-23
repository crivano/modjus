import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);

        const nome_documento = process.env.FORM_CONCLUSAO_DESLOCAMENTO;
        const apiBaseUrl = process.env.EXTERNAL_API_BASE_URL;
        const apiAuth = process.env.API_AUTH;

        if (!nome_documento || !apiBaseUrl || !apiAuth) {
            return NextResponse.json({ error: 'Configuração inválida no ambiente' }, { status: 500 });
        }

        const response = await axios.get(`${apiBaseUrl}/getmodjusdocs`, {
            params: { nome_documento },
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

        const meioTransporteOptions = [
            { id: '', name: '' },
            { id: '1', name: 'Aéreo' },
            { id: '2', name: 'Rodoviário' },
            { id: '3', name: 'Hidroviário' },
            { id: '4', name: 'Veículo Próprio' },
            { id: '5', name: 'Sem Passagens' }
        ];

        const data = (response.data as any[]).map((item: any) => ({
            numero_conclusao: item.numero_documento,
            data_assinatura_conclusao: item.data_assinatura,
            solicitacao_de_deslocamento: item.modjusData.solicitacaoDeslocamento,
            solicitacao_de_deslocamento_data: item.modjusData.data_solicitacao,
            proponente: item.modjusData.proponente.descricao,
            prop_cargo_funcao: item.modjusData.funcaoProponente,
            beneficiario: item.modjusData.pessoa.descricao,
            beneficiario_tipo: tipoBeneficiarioOptions.find(option => option.id === item.modjusData.tipoBeneficiario)?.name || "Outro",
            benef_cargo_funcao: item.modjusData.cargoBeneficiario,
            periodo: `${item.modjusData.periodoDe} a ${item.modjusData.periodoAte}`,
            data_inicio: item.modjusData.periodoDe,
            data_fim: item.modjusData.periodoAte,
            itinerario: item.modjusData.origemDestino,
            tipo_viagem: item.modjusData.tipoDeslocamento === "2" ? "Internacional" : "Nacional",
            meio_de_transporte: meioTransporteOptions.find(option => option.id === item.modjusData.meioTransporte)?.name || "Outro",
            diarias_bruto: item.modjusData.valorBrutoDiarias || "0.00",
            adic_desloc: item.modjusData.valorAdicionalDeslocamento || "0.00",
            desc_aux_alim: item.modjusData.valorDescontoAlimentacao || "0.00",
            desc_aux_transp: item.modjusData.valorDescontoTransporte || "0.00",
            subtotal_diarias_bruto: item.modjusData.totalDeDescontoDeTeto || "0.00",
            desc_teto: item.modjusData.totalDeDescontoDeTeto || "0.00",
            diarias_liquido: item.modjusData.valorLiquidoDiarias || "0.00",
            passagens_liquido: item.modjusData.valor_passagem || "0.00",
            finalidade: item.modjusData.finalidade
        }));

        // Geração manual do CSV sem aspas
        const headers = Object.keys(data[0]).join('^');

        const rows = data.map(row =>
            Object.values(row).map(value => {
                if (typeof value === 'string') {
                    return value.replace(/['"]/g, '').replace(/\s+/g, ' ').trim();
                }
                return value;
            }).join('^')
        );

        const csv = [headers, ...rows].join('\n');

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
