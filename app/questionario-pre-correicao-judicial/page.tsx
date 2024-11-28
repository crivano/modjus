'use client'

import Model from "@/libs/model"
import { FormHelper } from "@/libs/form-support"
import SelectUnidade from "@/components/sei/SelectUnidade"
import Pessoa from "@/components/sei/Pessoa"
import Head from 'next/head';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useState } from "react";

function interview(Frm: FormHelper) {
  const oCaracteristicas = [
    { label: 'Turma Recursal', name: 'turmaRecursal' },
    { label: 'Juizado Especial Federal', name: 'jef' },
    { label: 'Criminal', name: 'criminal' },
    { label: 'Execução Fiscal', name: 'execucaoFiscal' }
  ]
  const oDe1a20 = Array.from({ length: 21 }, (_, i) => ({ id: `${i}`, name: `${i}` }))

  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const handleDateChange = (date: Date | null) => {
    setStartDate(date);
  };
  
  const oDe1a20  = Array.from({ length: 21 }, (_, i) => ({ id: `${i}`, name: `${i}` }))
   
  return <>
    <Head>
        <meta charSet="ISO-8859-1" />
      </Head>
    <Frm.Input label="Número do Processo" name="numproc" width={4} />
    <Frm.dateInput label="Data de Abertura" name="dataAbertura" width={4} />
    <Frm.dateInput label="Data de Encerramento" name="dataEncerramento" width={4} />

    <h2>1. Informações da Unidade</h2>
    <SelectUnidade Frm={Frm} name="t1Unidade" width={4} />
    {/* <Frm.Input label="Unidade" name="t1Unidade" width={4} /> */}
    <Frm.dateInput label="Data da Instalação" name="t1DataDaInstalacao" width={4} />
    <Frm.TextArea label="Competências (referir eventual alteração de competência ocorrida nos últimos 12 meses e respectivo ato normativo)" name="t1Competencias" width={12} />
    <Frm.CheckBoxes label="Assinale as Características da Unidade" labelsAndNames={oCaracteristicas} width={12} />
    <Frm.TextArea label="Houve redistribuição de processos?" name="t1RedistribuicaoDeProcessos" width={12} />

    <h2>2. Magistrados</h2>
     {/* Trocar abaixo para algum componente pessoa */}
     <Pessoa Frm={Frm}  name="t2Titular" />
    <Frm.Input label="Tempo de atuação na unidade" name="t2TitularTempoDeAtuacaoNaUnidade" width={12} />
    <Frm.TextArea label="Afastamentos superiores a 15 dias nos últimos 12 meses, especificando o período e o fundamento" name="t2TitularAfastamentos" width={12} />
    <Frm.TextArea label="Períodos de substituição, em férias, de outro magistrado" name="t2TitularSubstituicoes" width={12} />
    <Frm.TextArea label="Qual a modalidade de trabalho adotada pelo Magistrado no Juízo? (art. 2º, TRF2-PVC-2023/00002)" name="t2TitularModalidadeTrabalho" width={12} />
    <Frm.TextArea label="Como é realizado o atendimento aos advogados/procuradores? (art. 3º, TRF2-PVC-2023/00002)" name="t2TitularAtendimento" width={12} />

          <Frm.Input label="Substituto" name="t2Substituto" width={4} />
          <Frm.Input label="Tempo de atuação na unidade" name="t2SubstitutoTempoDeAtuacaoNaUnidade" width={12} />
          <Frm.TextArea label="Afastamentos superiores a 15 dias nos últimos 12 meses, especificando o período e o fundamento" name="t2SubstitutoAfastamentos" width={12} />
          <Frm.TextArea label="Períodos de substituição, em férias, de outro magistrado" name="t2SubstitutoSubstituicoes" width={12} />
          <Frm.TextArea label="Qual a modalidade de trabalho adotada pelo Magistrado no Juízo? (art. 2º, TRF2-PVC-2023/00002)" name="t2SubstitutoModalidadeTrabalho" width={12} />
          <Frm.TextArea label="Como é realizado o atendimento aos advogados/procuradores? (art. 3º, TRF2-PVC-2023/00002)" name="t2SubstitutoAtendimento" width={12} />

    <h2>3. Auxílios</h2>
    <Frm.TextArea label="Auxílios prestados e recebidos nos últimos 12 meses" name="t3Auxilios" width={12} />
  
    <h2>4. Servidores</h2>
    <p>Discriminar a quantidade de cargos prevista na lotação e a quantidade efetivamente existente no tocante aos analistas judiciários, técnicos judiciários (área administrativa e segurança e transportes), requisitados ou outros:</p>
    <h4>Última Correição</h4>
    <p>### calcular automaticamente o total de servidores</p>
    <Frm.Select label="Analistas Judiciários" name="t4UltimaCorreicaoAnalistasJudiciarios" options={oDe1a20} width={2} />
    <Frm.Select label="Técnicos Judiciários" name="t4UltimaCorreicaoTecnicosJudiciarios" options={oDe1a20} width={2} />
    <Frm.Select label="Técnicos Jud. de Segurança" name="t4UltimaCorreicaoAnalistasJudiciariosDeSeguranca" options={oDe1a20} width={2} />
    <Frm.Select label="Requisitados ou outros" name="t4UltimaCorreicaoRequisitadosOuOutros" options={oDe1a20} width={2} />
    <Frm.Select label="Total de servidores" name="t4UltimaCorreicaoTotalDeServidores" options={oDe1a20} width={2} />
    <Frm.Select label="Quadro Previsto de servidores" name="t4UltimaCorreicaoQuadroPrevisto" options={oDe1a20} width={2} />
    <h4>Atualmente</h4>
    <Frm.Select label="Analistas Judiciários" name="t4AtualmenteAnalistasJudiciarios" options={oDe1a20} width={2} />
    <Frm.Select label="Técnicos Judiciários" name="t4AtualmenteTecnicosJudiciarios" options={oDe1a20} width={2} />
    <Frm.Select label="Técnicos Jud. de Segurança" name="t4AtualmenteAnalistasJudiciariosDeSeguranca" options={oDe1a20} width={2} />
    <Frm.Select label="Requisitados ou outros" name="t4AtualmenteRequisitadosOuOutros" options={oDe1a20} width={2} />
    <Frm.Select label="Total de servidores" name="t4AtualmenteTotalDeServidores" options={oDe1a20} width={2} />
    <Frm.Select label="Quadro Previsto de servidores" name="t4AtualmenteQuadroPrevisto" options={oDe1a20} width={2} />

    <Frm.Select label="Quantidade de servidores em teletrabalho em observância do limite máximo previsto no art. 5º da Resolução nº TRF2-RSP-2019/00046, alterada pela Resolução n.º TRF2-RSP-2023/00002 (30% do quadro permanente), bem como se é encaminhado o relatório semestral de avaliação, previsto no art. 13, III, da referida Resolução" name="t4QuantidadeDeServidoresEmTeletrabalho" options={oDe1a20} width={12} />
    {Array.from({ length: Frm.data.t4QuantidadeDeServidoresEmTeletrabalho }).map((_, i) => (
      <div className="row" key={i}>
        <Frm.Input label={i == 0 ? 'Servidor em teletrabalho' : ''} name={`t4NomeDoServidorEmTeletrabalho${i}`} width={3} />
        <Frm.Input label={i == 0 ? 'Período' : ''} name={`t4PeriodoDoServidorEmTeletrabalho${i}`} width={3} />
        <Frm.Input label={i == 0 ? 'Data de envio' : ''} name={`t4DataDeEnvioDoUltimoRelatorioDoServidorEmTeletrabalho${i}`} width={3} />
        <Frm.Input label={i == 0 ? 'Número' : ''} name={`t4CodigoDoUltimoRelatorioDoServidorEmTeletrabalho${i}`} width={3} />
      </div>
    ))}

    <h2>5. Estagiários</h2>
    <Frm.Select label="Número de estagiários de nível superior previstos para unidade" name="t5NumeroPrevistoDeEstagiariosDeNivelSuperior" options={oDe1a20} width={3} />
    <Frm.Select label="Número de estagiários de nível médio previstos para unidade" name="t5NumeroPrevistoDeEstagiariosDeNivelMédio" options={oDe1a20} width={3} />
    <Frm.Select label="Número de estagiários de nível superior lotados na unidade" name="t5NumeroEfetivoDeEstagiariosDeNivelSuperior" options={oDe1a20} width={3} />
    <Frm.Select label="Número de estagiários de nível médio lotados na unidade" name="t5NumeroEfetivoDeEstagiariosDeNivelMédio" options={oDe1a20} width={3} />   

    <h2>6. Instalações Físicas e Infraestrutura</h2>
    <Frm.TextArea label="Relatar a situação das instalações físicas do setor (mobiliário, ar condicionado, etc.) e dos equipamentos de informática, informando eventuais problemas, dificuldades, bem como destacando se há mobiliário e/ou equipamentos de informática danificados/defeituosos sem previsão de reparo ou substituição já requerida à DIRFO"  name="t6InstalacoesFisicasEInfraestrutura" width={12} />

    <h2>7. Livros e Pastas</h2>
    <Frm.TextArea label="Quais os livros e pastas utilizados pela Vara Federal, Juizado Especial ou Turma Recursal?"  name="t7LivrosEPastasUtilizados" width={12} />
    <Frm.TextArea label="Algum livro ou pasta em papel foi substituído por registro informatizado (art. 132 da CNCR)? Quais?"  name="t7LivrosEPastasSubstituidos" width={12} />
    <Frm.TextArea label="Informar quais as Pastas/Livros Eletrônicos de controle obrigatório existentes no Siga, com a descrição dos expedientes que lhes corresponda"  name="t7LivrosEPastasExistentesNoSiga" width={12} />
 
    <h2>8. Organização da Unidade e Setorização (todas as unidades)</h2>
    <Frm.TextArea label="Detalhar, sucintamente, a forma de organização da unidade, destacando as atribuições do Diretor (a) de Secretaria; Supervisores; e demais servidores"  name="t8FormaDeOrganizacao" width={12} />
    <Frm.TextArea label="Informar, sucintamente, sobre a sistemática de planejamento das atividades da unidade e a existência de metas internas, detalhando conforme o caso"  name="t8SistematicaDePlanejamento" width={12} />
    <Frm.TextArea label="Informar, sucintamente, sobre a sistemática de avaliação periódica dos resultados das atividades da unidade"  name="t8SistematicaDeAvaliacao" width={12} />
    <Frm.TextArea label="Detalhar o tratamento dado aos processos incluídos nas Metas do CNJ, feitos com prioridade legal e demais ações elencadas no art. 12, parágrafo único, da Resolução nº 496/2006 do CJF"  name="t8ProcessosIncluidosNasMetasDoCNJ" width={12} />
    <Frm.TextArea label="Critérios de julgamento para os demais feitos"  name="t8CriteriosDeJulgamentoParaOsDemaisFeitos" width={12} />
    <Frm.TextArea label="Informar, sucintamente, como ocorre o fluxo dos processos entre a secretaria e o gabinete, a abertura da conclusão e a forma de controle do prazo para prolação de sentenças"  name="t8FluxoDeInformacoes" width={12} />
   
    {oCaracteristicas[0].name === 'turmaRecursal' ? (
         <Frm.Input label="Número de processos com pedidos urgentes (liminares, antecipações de tutela) pendentes de análise" name="t8NumeroDeProcessosComPedidosUrgentes" width={12} />
    ) : ('')}
 
    <Frm.TextArea label="Há utilização de automação de localizadores (e-Proc) na unidade?"  name="t8UtilizacaoDeAutomacaoDosLocalizadores" width={12} />
    <Frm.TextArea label="Como é feito o controle dos prazos de suspensão dos processos? Há inserção em local (físico ou virtual) específico, com a anotação do motivo de suspensão e a data do término?"  name="t8PrazosDeSuspensao" width={12} />
    <Frm.TextArea label="A unidade verifica a pertinência do assunto cadastrado no processo quando recebe novos processos, garantindo que todos os processos do acervo possuam assunto folha (último nível) ou de nível 3 ou mais, respeitando a padronização da terminologia de assuntos processuais imposta pelo CNJ?"  name="t8RespeitoAPadronizacaoDoCNJ" width={12} />
    <Frm.TextArea label="A unidade possui algum processo em que não há assunto correspondente disponível na Tabela Unificada? A situação foi informada à SAJ ou CORETAB?"  name="t8ProcessoSemAssuntoCorrespondente" width={12} />
</>
}

function document(data: any) {
  const Frm = new FormHelper()
  Frm.update(data)
  return <div className="row">
    <h1 className="text-center">Relatório de Pré-correição Judicial</h1>
    {
      
    }
    {interview(Frm)}
    <div className="assinatura text-center">__________________________________<br />Assinatura do Perito(a)</div>
  </div>
}

export default function BpcLoasPdcMais17() {
  return Model(interview, document, { saveButton: true, pdfButton: false, pdfFileName: 'bpc-loas-pcd-mais-17' })
}