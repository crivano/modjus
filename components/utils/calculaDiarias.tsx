import { format, addDays, isBefore, differenceInDays } from 'date-fns';

enum FaixaEnum {
    MINISTRO_DO_STF = 1,
    MEMBRO_DO_CJF = 1,
    MEMBRO_DO_TRF = 0.95,
    JUIZ = 0.95 * 0.95,
    ANALISTA_JUDICIARIO_E_CARGOS_EM_COMISSAO = 0.55,
    TECNICO_JUDICIARIO_OU_FUNCAO_COMISSIONADA = 0.45
}

enum DeslocamentoConjuntoEnum {
    EQUIPE_DE_TRABALHO = "Equipe de Trabalho",
    ASSESSORAMENTO_DE_AUTORIDADE = "Assessoramento de Autoridade",
    ASSISTENCIA_DIRETA_A_AUTORIDADE = "Assistência Direta à Autoridade",
    SEGURANCA_DE_MAGISTRADO = "Segurança de Magistrado"
}

enum TipoDeDiariaEnum {
    PADRAO = "Padrão",
    MEIA_DIARIA_A_PEDIDO = "Meia Diária a Pedido",
    SEM_DIARIA = "Sem Diária"
}

enum TipoDeTransporteParaEmbarqueEDestinoEnum {
    COM_ADICIONAL_DE_DESLOCAMENTO = "Com Adicional de Deslocamento",
    SEM_ADICIONAL_DE_DESLOCAMENTO = "Sem Adicional de Deslocamento",
    VEICULO_OFICIAL = "Veículo Oficial"
}

interface DiariasDaJusticaFederalParametroTrecho {
    dataTrechoInicial: Date;
    dataTrechoFinal: Date;
    trecho: string;
    transporteEmbarque: TipoDeTransporteParaEmbarqueEDestinoEnum;
    transporteDesembarque: TipoDeTransporteParaEmbarqueEDestinoEnum;
    semDespesasDeHospedagem: boolean;
}

interface DiariasDaJusticaFederalResultadoDiario {
    data: string;
    trecho: string;
    diaria: number;
    acrescimoDeDeslocamento: number;
    descontoDeAuxilioAlimentacao: number;
    descontoDeAuxilioTransporte: number;
    subtotalBruto: number;
    descontoDeTeto: number;
    subtotalLiquido: number;
}

interface DiariasDaJusticaFederalResultado {
    dias: DiariasDaJusticaFederalResultadoDiario[];
    prorrogacao: boolean;
    totalDeDiariasBruto: number;
    totalDeAcrescimoDeDeslocamento: number;
    totalDeDescontoDeAuxilioAlimentacao: number;
    totalDeDescontoDeAuxilioTransporte: number;
    subtotalBruto: number;
    totalDeDescontoDeTeto: number;
    subtotalLiquido: number;
    valorJaRecebido: number;
    total: number;
    mensagemDeErro?: string;
}

function floor(value: number): number {
    return Math.floor(value * 100) / 100;
}

function listaDeDatas(startDate: Date, endDate: Date): Date[] {
    const dates: Date[] = [];
    let currentDate = startDate;
    while (!isBefore(endDate, currentDate)) {
        dates.push(currentDate);
        currentDate = addDays(currentDate, 1);
    }
    return dates;
}

function calcularDiarias(
    valorUnitatioDaDiaria: number,
    valorUnitarioDaDiariaParaCalculoDoDeslocamento: number,
    faixa: FaixaEnum,
    deslocamentoConjunto: DeslocamentoConjuntoEnum,
    internacional: boolean,
    cotacaoDoDolar: number,
    tipoDeDiaria: TipoDeDiariaEnum,
    prorrogacao: boolean,
    valorJaRecebido: number,
    valorUnitarioDoAuxilioAlimentacao: number,
    valorUnitarioDoAuxilioTransporte: number,
    tetoDiaria: number,
    tetoMeiaDiaria: number,
    trechos: DiariasDaJusticaFederalParametroTrecho[],
    feriados: Date[],
    diasSemDiaria: Date[]
): DiariasDaJusticaFederalResultado {
    const r: DiariasDaJusticaFederalResultado = {
        dias: [],
        prorrogacao: false,
        totalDeDiariasBruto: 0,
        totalDeAcrescimoDeDeslocamento: 0,
        totalDeDescontoDeAuxilioAlimentacao: 0,
        totalDeDescontoDeAuxilioTransporte: 0,
        subtotalBruto: 0,
        totalDeDescontoDeTeto: 0,
        subtotalLiquido: 0,
        valorJaRecebido: 0,
        total: 0
    };

    try {
        if (!trechos) throw new Error("Trechos não pode ser nulo");
        if (trechos.length === 0) throw new Error("Trechos não pode ser uma lista vazia");

        let ultimaData: Date | null = null;
        for (const trecho of trechos) {
            if (!trecho.dataTrechoInicial) throw new Error("Trecho não pode ter data nula");
            if (ultimaData && isBefore(trecho.dataTrechoInicial, ultimaData)) {
                throw new Error("Trecho não pode ter data menor do que a última data do trecho anterior");
            }
            ultimaData = trecho.dataTrechoInicial;
        }

        let diaria = valorUnitatioDaDiaria;
        const diariaParaCalculoDoDeslocamento = valorUnitarioDaDiariaParaCalculoDoDeslocamento;
        if (internacional) {
            diaria = floor(valorUnitatioDaDiaria * cotacaoDoDolar);
        }

        if (deslocamentoConjunto === DeslocamentoConjuntoEnum.EQUIPE_DE_TRABALHO) {
            diaria *= 1;
        }

        if (deslocamentoConjunto === DeslocamentoConjuntoEnum.ASSESSORAMENTO_DE_AUTORIDADE ||
            deslocamentoConjunto === DeslocamentoConjuntoEnum.ASSISTENCIA_DIRETA_A_AUTORIDADE) {
            diaria = floor(diaria * 0.8);
        }

        if (deslocamentoConjunto === DeslocamentoConjuntoEnum.SEGURANCA_DE_MAGISTRADO) {
            diaria = floor(diaria * 0.8);
        }

        if (differenceInDays(trechos[trechos.length - 1].dataTrechoFinal, trechos[0].dataTrechoInicial) + 1 > 45) {
            diaria = floor(diaria * 0.6);
        }

        for (let i = 0; i < trechos.length; i++) {
            const fUltimoTrecho = i === trechos.length - 1;
            const trecho = trechos[i];
            const proximoTrecho = fUltimoTrecho ? null : trechos[i + 1];

            for (const d of listaDeDatas(trecho.dataTrechoInicial, trecho.dataTrechoFinal)) {
                const dia: DiariasDaJusticaFederalResultadoDiario = {
                    data: format(d, 'dd/MM/yyyy'),
                    trecho: trecho.trecho,
                    diaria: 0,
                    acrescimoDeDeslocamento: 0,
                    descontoDeAuxilioAlimentacao: 0,
                    descontoDeAuxilioTransporte: 0,
                    subtotalBruto: 0,
                    descontoDeTeto: 0,
                    subtotalLiquido: 0
                };

                const primeiroDiaDoTrecho = d.getTime() === trecho.dataTrechoInicial.getTime();
                const proximoTrechoComecaNoMesmoDia = proximoTrecho ? trecho.dataTrechoInicial.getTime() === proximoTrecho.dataTrechoInicial.getTime() : false;

                if (primeiroDiaDoTrecho) {
                    if (trecho.transporteEmbarque === TipoDeTransporteParaEmbarqueEDestinoEnum.COM_ADICIONAL_DE_DESLOCAMENTO) {
                        dia.acrescimoDeDeslocamento += diariaParaCalculoDoDeslocamento * 0.20;
                    }
                    if (trecho.transporteDesembarque === TipoDeTransporteParaEmbarqueEDestinoEnum.COM_ADICIONAL_DE_DESLOCAMENTO) {
                        dia.acrescimoDeDeslocamento += diariaParaCalculoDoDeslocamento * 0.20;
                    }
                    dia.acrescimoDeDeslocamento = floor(dia.acrescimoDeDeslocamento);
                }

                const semDespesasDeHospedagem = trecho.semDespesasDeHospedagem;
                const ultimoDia = d.getTime() === trechos[trechos.length - 1].dataTrechoFinal.getTime();
                const meiaDiaria = semDespesasDeHospedagem || (!internacional && ultimoDia) || tipoDeDiaria === TipoDeDiariaEnum.MEIA_DIARIA_A_PEDIDO;
                dia.diaria = meiaDiaria ? floor(diaria / 2) : diaria;

                if (d.getDay() !== 0 && d.getDay() !== 6 && !feriados.some(feriado => feriado.getTime() === d.getTime())) {
                    dia.descontoDeAuxilioAlimentacao = valorUnitarioDoAuxilioAlimentacao;
                    dia.descontoDeAuxilioTransporte = valorUnitarioDoAuxilioTransporte;
                }

                if (diasSemDiaria.some(diaSem => diaSem.getTime() === d.getTime()) || proximoTrechoComecaNoMesmoDia) {
                    dia.diaria = 0;
                    dia.descontoDeAuxilioAlimentacao = 0;
                    dia.descontoDeAuxilioTransporte = 0;
                }

                dia.subtotalBruto = dia.diaria + dia.acrescimoDeDeslocamento - dia.descontoDeAuxilioAlimentacao - dia.descontoDeAuxilioTransporte;

                if (!internacional) {
                    let limiteDeGlosa = tetoDiaria;
                    if (meiaDiaria) {
                        limiteDeGlosa = tetoMeiaDiaria;
                    }

                    const jaPagoEmOutrosTrechoParaOMesmoDia = r.dias
                        .filter(diaAnterior => diaAnterior.data === dia.data)
                        .reduce((acc, diaAnterior) => acc + diaAnterior.subtotalLiquido, 0);

                    limiteDeGlosa -= jaPagoEmOutrosTrechoParaOMesmoDia;

                    if (limiteDeGlosa < dia.subtotalBruto) {
                        dia.descontoDeTeto = dia.subtotalBruto - limiteDeGlosa;
                    }
                }

                dia.subtotalLiquido = dia.subtotalBruto - dia.descontoDeTeto;

                r.dias.push(dia);

                r.totalDeDiariasBruto += dia.diaria;
                r.totalDeAcrescimoDeDeslocamento += dia.acrescimoDeDeslocamento;
                r.totalDeDescontoDeAuxilioAlimentacao += dia.descontoDeAuxilioAlimentacao;
                r.totalDeDescontoDeAuxilioTransporte += dia.descontoDeAuxilioTransporte;
                r.subtotalBruto += dia.subtotalBruto;
                r.subtotalLiquido += dia.subtotalLiquido;
                r.totalDeDescontoDeTeto += dia.descontoDeTeto;
                r.total += dia.subtotalLiquido;
            }
        }
    } catch (error) {
        r.mensagemDeErro = (error as Error).message;
    }

    if (prorrogacao && valorJaRecebido > 0.001) {
        r.total -= valorJaRecebido;
        r.valorJaRecebido = valorJaRecebido;
        r.prorrogacao = true;
    }

    return r;
}

export {
    calcularDiarias,
    FaixaEnum,
    DeslocamentoConjuntoEnum,
    TipoDeDiariaEnum,
    TipoDeTransporteParaEmbarqueEDestinoEnum,
    };