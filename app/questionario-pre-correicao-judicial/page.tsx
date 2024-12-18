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

          <Pessoa Frm={Frm}  name="t2Substituto" />
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
     
    {!Frm.data.turmaRecursal && (
      <Frm.Input label="Número de processos com pedidos urgentes (liminares, antecipações de tutela) pendentes de análise" name="t8NumeroDeProcessosComPedidosUrgentes" width={12} />
    )}
   
    <Frm.TextArea label="Há utilização de automação de localizadores (e-Proc) na unidade?"  name="t8UtilizacaoDeAutomacaoDosLocalizadores" width={12} />
    <Frm.TextArea label="Como é feito o controle dos prazos de suspensão dos processos? Há inserção em local (físico ou virtual) específico, com a anotação do motivo de suspensão e a data do término?"  name="t8PrazosDeSuspensao" width={12} />
    <Frm.TextArea label="A unidade verifica a pertinência do assunto cadastrado no processo quando recebe novos processos, garantindo que todos os processos do acervo possuam assunto folha (último nível) ou de nível 3 ou mais, respeitando a padronização da terminologia de assuntos processuais imposta pelo CNJ?"  name="t8RespeitoAPadronizacaoDoCNJ" width={12} />
    <Frm.TextArea label="A unidade possui algum processo em que não há assunto correspondente disponível na Tabela Unificada? A situação foi informada à SAJ ou CORETAB?"  name="t8ProcessoSemAssuntoCorrespondente" width={12} />

    <h2>9. Materiais Acautelados na Unidade</h2>
    <Frm.TextArea label="Indicar a quantidade de materiais (bens e documentos) acautelados e apreendidos na unidade (separadamente)"  name="t9QuantidadeDeMateriaisAcautelados" width={12} />
    <Frm.TextArea label="Indicar a quantidade de processos com bens acautelados/apreendidos na unidade"  name="t9QuantidadeDeProcessosComBensAcautelados" width={12} />
    <Frm.TextArea label="Todos os bens acautelados apresentam exata correspondência com os termos de acautelamento mantidos pela Secretaria?"  name="t9BensAcauteladosCorrespondemComTermos" width={12} />
    <Frm.TextArea label="Dentre os bens acautelados/apreendidos na unidade, informar (i) quais possuem conteúdo econômico passível de perdimento ou expropriação; (ii) se há dinheiro em espécie, títulos de crédito, joias acauteladas ou moeda falsa; (iii) se a moeda falsa está devidamente identificada; e (iv) qual a localização desses bens e a situação atual dos respectivos processos"  name="t9DinheiroEmEspecieTitulosOuJoias" width={12} />
    <Frm.TextArea label="Todos os bens acautelados apresentam exata correspondência com os termos de acautelamento mantidos pela Secretaria?"  name="t9BensAcauteladosCorrespondemComTermos" width={12} />
    <Frm.TextArea label="A unidade tem tido alguma dificuldade na utilização do SNGB?"  name="t9DificuldadeNoUsoDoSNGB" width={12} />
    <Frm.TextArea label="A unidade possuía registros ativos no SNBA na data da implementação do SNGB (Resolução nº 483/2022 do CNJ)?"  name="t9RegistrosAtivosNoSNBA" width={12} />
    <Frm.TextArea label="Em caso positivo, a migração manual dos registros do SNBA para o SNGB foi finalizada? Se não, quais são as medidas que estão sendo implementadas para que isso ocorra e qual é o cronograma (detalhado) para regularização total dos cadastros?"  name="t9MigracaoDoSNBAParaSNGB" width={12} />
    <Frm.TextArea label="A unidade possui cofre ou sala de acautelados e é examinada a regularidade dos bens ali guardados?"  name="t9CofreOuSalaDeAcautelados" width={12} />
    <Frm.TextArea label="Em caso positivo, a migração manual dos registros do SNBA para o SNGB foi finalizada? Se não, quais são as medidas que estão sendo implementadas para que isso ocorra e qual é o cronograma (detalhado) para regularização total dos cadastros?"  name="t9MigracaoDoSNBAParaSNGB" width={12} />
    <Frm.TextArea label="Detalhar as providências adotadas para o acautelamento/apreensão de bens em geral"  name="t9ProvidenciasAdotadasParaAcautelamento" width={12} />
    <Frm.TextArea label="Detalhar as providências adotadas para alienação antecipada de bens, quando necessário"  name="t9ProvidenciasDeAlienacaoAntecipada" width={12} />
    <ul>
      <li>
        <p>
          Juntar aos autos do processo de correção ordinária, no E-proc, as fotos dos bens acautelados, salvas em PDF, observando-se o seguinte:
        </p>
        <ul>
          <li>
            1 (uma) foto por bem acautelado, onde se visualize, apenas externamente, o termo de acautelamento que nele se encontre afixado; 
          </li>
          <li>
            No termo de acautelamento deve constar a descrição do bem acautelado e a identificação precisa do local em que se encontra;
          </li>
          <li>
            Caso o bem se encontre em local diverso da Secretaria por designação do Juízo, indicar o expediente no Siga criado para tal registro, na forma do art. 2º, §3º, da Portaria TRF2-PTC-2022/00071.
          </li>
        </ul>
      </li>
      <li>
        <p>
          Os bens acautelados devem estar registrados como “Anexo Físico” no E-Proc, em "Informações adicionais", de forma a possibilitar o seu controle por meio da extração de Relatório Geral no Sistema Processual.
        </p>
        <p>
          No conteúdo da informação do “Anexo Físico”, deve constar a descrição do bem acautelado, a localização precisa em que se encontra e a indicação da existência de termo de acautelamento e do evento/folha correspondente no processo eletrônico (art. 2º, § 1º, da Portaria TRF2-PTC-2022/00071);
        </p>
        <p>
          Devem ser excluídos/desativados os “Anexos Físicos” nas “Informações Adicionais” dos processos eletrônicos que não possuam bens acautelados (art. 2º, § 2º, da Portaria TRF2-PTC-2022/00071).
        </p>
      </li>
    </ul>

    <h2>10. Processos Físicos em carga ou retirados</h2>
    <Frm.Select label="Há processos físicos com carga às partes ou retirados por auxiliares do juízo além do prazo legal?" name="t10ProcessosFisicosComCarga" options={oDe1a20} width={3} />
    <Frm.TextArea label="Identificar os processos extraviados, as datas da ocorrência e as providências"  name="t10ProcessosExtraviados" width={12} />
    <Frm.TextArea label="Identificar as ações de restauração de autos, no período do levantamento"  name="t10AcoesDeRestauracao" width={12} />
 
    
    <h2>11. Audiências</h2>
    <Frm.TextArea label="Número de audiências agendadas e realizadas (indicar separadamente para o juiz titular e para o juiz substituto)"  name="t11NumeroDeAudienciasAgendadasERealizadas" width={12} />
    <Frm.TextArea label="Como é feito o controle das audiências canceladas/remarcadas?"  name="t11ControleDeAudienciasCanceladas" width={12} />
    <Frm.TextArea label="É realizada audiência de conciliação em todos os casos possíveis de autocomposição (art. 334 do CPC)?"  name="t11AudienciaDeConciliacao" width={12} />
    <Frm.TextArea label="É realizado o acompanhamento do cumprimento da Meta 3 do CNJ pela unidade?"  name="t11AcompanhamentoDaMeta3DoCNJ" width={12} />
    <Frm.TextArea label="Qual o intervalo de tempo médio entre o despacho de designação da audiência e a realização do ato?"  name="t11TempoMedioEntreDespachoDeDesignacaoEAudiencia" width={12} />
    <Frm.TextArea label="A unidade utiliza o registro audiovisual de audiências nos termos dos artigos 136 e seguintes da CNCR?"  name="t11RegistroVisualDeAudiencias" width={12} />
    <Frm.TextArea label="Foi detectada alguma falha no registro audiovisual de audiências nos últimos 12 meses comprometendo seu conteúdo? Quais as falhas e quais as soluções adotadas para saná-las?"  name="t11FalhasNoRegistroAudiovisualDeAudiencias" width={12} />
    <Frm.TextArea label="Houve alguma audiência de custódia nos últimos 12 meses? Quantas? Em caso negativo, justifique. Em caso positivo, especifique eventuais problemas ou dificuldades"  name="t11AudienciaDeCustodia" width={12} />
    <Frm.TextArea label="Foi realizada alguma audiência de forma remota nos últimos dois anos? Em quais processos? (art. 4º, TRF2-PVC-2023/00002)"  name="t11AudienciaRemota" width={12} />
 
    <h2>11. Sessão de Julgamento/Audiências</h2>
    <Frm.TextArea label="Número de sessões de julgamento agendadas e realizadas" name="t11NumeroDeSessoesDeJulgamentoAgendadasERealizadas" width={12} />
    <Frm.TextArea label="Como é feito o controle da inclusão, adiamento e retirada de pauta de processos?"  name="t11ControleDePauta" width={12} />
    <Frm.TextArea label="Qual o intervalo de tempo médio entre o pedido de dia/inclusão em pauta e a realização da sessão de julgamento?"  name="t11IntervaloDeTempo" width={12} />
    <Frm.TextArea label="A unidade utiliza o registro audiovisual de sessões de julgamento?"  name="t11RegistroVisualDeSessoesDeJulgamento" width={12} />
    <Frm.TextArea label="Foi detectada alguma falha no registro audiovisual de sessões de julgamento nos últimos 12 meses comprometendo seu conteúdo?  Quais as falhas e quais as soluções adotadas para saná-las?"  name="t11FalhasNoRegistroAudiovisualDeSessoesDeJulgamento" width={12} />
    <Frm.TextArea label="Foi realizada alguma audiência de forma remota nos últimos dois anos? Em quais processos? (art. 4º, TRF2-PVC-2023/00002)"  name="t11AudienciaRemota" width={12} />
     
    <h2>12. Cumprimento de determinações de inspeções e Correições Anteriores</h2>
    <Frm.TextArea label="A unidade cumpriu todas as metas estabelecidas na inspeção anterior?" name="t11NumeroDeSessoesDeJulgamentoAgendadasERealizadas" width={12} />
    <Frm.TextArea label="A unidade regularizou todas as pendências apontadas na última Correição ou Inspeção de Avaliação da Corregedoria?"  name="t12RegularizacaoDasPendenciasDaUltimaCorreicao" width={12} />
    <Frm.TextArea label="Em sendo negativa a resposta de algum dos itens acima, justificar o eventual não cumprimento"  name="t12JustificativaDoNaoCumprimento" width={12} />

    <h2>13. Boas práticas e dificuldades</h2>
    <Frm.TextArea label="Relacionar as boas práticas, eventuais dificuldades vivenciadas na unidade, bem como demandas e soluções propostas, inclusive quanto aos setores administrativos "  name="t12JustificativaDoNaoCumprimento" width={12} />

</>
}

function document(data: any) {
  const Frm = new FormHelper()
  Frm.update(data)
  const {
    numproc,
    dataAbertura,
    dataEncerramento,
    turmaRecursal,
    jef,
    criminal,
    execucaoFiscal,
    t1Unidade,
    t1DataDaInstalacao,
    t1Competencias,
    t1RedistribuicaoDeProcessos,
    t2Titular,
    t2TitularTempoDeAtuacaoNaUnidade,
    t2TitularAfastamentos,
    t2TitularSubstituicoes,
    t2TitularModalidadeTrabalho,
    t2TitularAtendimento,
    t2Substituto,
    t2SubstitutoTempoDeAtuacaoNaUnidade,
    t2SubstitutoAfastamentos,
    t2SubstitutoSubstituicoes,
    t2SubstitutoModalidadeTrabalho,
    t2SubstitutoAtendimento,
    t3Auxilios,
    t4UltimaCorreicaoAnalistasJudiciarios,
    t4UltimaCorreicaoTecnicosJudiciarios,
    t4UltimaCorreicaoAnalistasJudiciariosDeSeguranca,
    t4UltimaCorreicaoRequisitadosOuOutros,
    t4UltimaCorreicaoTotalDeServidores,
    t4UltimaCorreicaoQuadroPrevisto,
    t4AtualmenteAnalistasJudiciarios,
    t4AtualmenteTecnicosJudiciarios,
    t4AtualmenteAnalistasJudiciariosDeSeguranca,
    t4AtualmenteRequisitadosOuOutros,
    t4AtualmenteTotalDeServidores,
    t4AtualmenteQuadroPrevisto,
    t4QuantidadeDeServidoresEmTeletrabalho,
    t4NomeDoServidorEmTeletrabalho,
    t4PeriodoDoServidorEmTeletrabalho,
    t4DataDeEnvioDoUltimoRelatorioDoServidorEmTeletrabalho,
    t4CodigoDoUltimoRelatorioDoServidorEmTeletrabalho
  } = Frm.data;
  return <div className="row">
    <h1 className="text-center">Relatório de Pré-correição Judicial</h1>
    <div className="mt-3 col col-12 col-md-4">
      <label className="report-label form-label">
        <div>Número do Processo</div>
      </label>
      <p className="report-field bold">{numproc || "Não informado"}</p>
    </div>
    <div className="mt-3 col col-12 col-md-4">
      <label className="report-label form-label">
        <div>Data de Abertura</div>
      </label>
      <p className="report-field bold">{dataAbertura || "Não informado"}</p>
    </div>
    <div className="mt-3 col col-12 col-md-4">
      <label className="report-label form-label">
        <div>Data de Encerramento</div>
      </label>
      <p className="report-field bold">{dataEncerramento || "Não informado"}</p>
    </div>

    <h2>1. Informações da Unidade</h2>

    <div className="mt-3 col col-12 col-md-4">
      <label className="report-label form-label">
        <div>Unidade</div>
      </label>
      <p className="report-field bold">{t1Unidade || "Não informado"}</p>
    </div>
    <div className="mt-3 col col-12 col-md-4">
      <label className="report-label form-label">
        <div>Data da Instalação</div>
      </label>
      <p className="report-field bold">{t1DataDaInstalacao || "Não informado"}</p>
    </div>

    <div className="mt-3 col col-12 col-md-12">
      <label className="form-label">
        Competências (referir eventual alteração de competência ocorrida nos últimos 12 meses e respectivo ato normativo)
      </label>
      <p><strong>{t1Competencias || "Não informado"}</strong></p>
    </div>

    <div className="mt-3 col col-12 col-md-12">
      <label className="form-label">
        Assinale as Características da Unidade
      </label>
      <table className="table table-bordered">
        <tbody>
          <tr >
            <td>Turma Recursal</td>
            <td><strong>{turmaRecursal ? 'Sim' : 'Não'}</strong></td>
          </tr>
          <tr >
            <td>Juizado Especial Federal</td>
            <td><strong>{jef ? 'Sim' : 'Não'}</strong></td>
          </tr>
          <tr >
            <td>Criminal</td>
            <td><strong>{criminal ? 'Sim' : 'Não'}</strong></td>
          </tr>
          <tr >
            <td>Execução Fiscal</td>
            <td><strong>{execucaoFiscal ? 'Sim' : 'Não'}</strong></td>
          </tr>
        </tbody>
      </table>
    </div>

    <div className="mt-3 col col-12 col-md-12">
      <label className="form-label">Houve redistribuição de processos?</label>
      <p><strong>{t1RedistribuicaoDeProcessos || "Não informado"}</strong></p>
    </div>


    <h2>3. Magistrados</h2>
    <div className="mt-3 col col-12 col-md-12">
      <label className="report-label form-label">
        <div>Titular</div>
      </label>
      <p className="report-field"><strong>{t2Titular || "Não informado"}</strong></p>
    </div>
    <div className="mt-3 col col-12 col-md-12">
      <label className="report-label form-label">
        <div>Tempo de atuação na unidade</div>
      </label>
      <p className="report-field"><strong>{t2TitularTempoDeAtuacaoNaUnidade || "Não informado"}</strong></p>
    </div>
    <div className="mt-3 col col-12 col-md-12">
      <label className="report-label form-label">
        <div>Afastamentos superiores a 15 dias nos últimos 12 meses, especificando o período e o fundamento</div>
      </label>
      <p className="report-field"><strong>{t2TitularAfastamentos || "Não informado"}</strong></p>
    </div>
    <div className="mt-3 col col-12 col-md-12">
      <label className="report-label form-label">
        <div>Períodos de substituição, em férias, de outro magistrado</div>
      </label>
      <p className="report-field"><strong>{t2TitularSubstituicoes || "Não informado"}</strong></p>
    </div>
    <div className="mt-3 col col-12 col-md-12">
      <label className="report-label form-label">
        <div>Qual a modalidade de trabalho adotada pelo Magistrado no Juízo? (art. 2º, TRF2-PVC-2023/00002)
        </div>
      </label>
      <p className="report-field"><strong>{t2TitularModalidadeTrabalho || "Não informado"}</strong></p>
    </div>
    <div className="mt-3 col col-12 col-md-12">
      <label className="report-label form-label">
        <div>Como é realizado o atendimento aos advogados/procuradores? (art. 3º, TRF2-PVC-2023/00002)</div>
      </label>
      <p className="report-field"><strong>{t2TitularAtendimento || "Não informado"}</strong></p>
    </div>
    <div className="mt-3 col col-12 col-md-12">
      <label className="report-label form-label">
        <div>Substituto</div>
      </label>
      <p className="report-field"><strong>{t2Substituto || "Não informado"}</strong></p>
    </div>
    <div className="mt-3 col col-12 col-md-12">
      <label className="report-label form-label">
        <div>Tempo de atuação na unidade</div>
      </label>
      <p className="report-field"><strong>{t2SubstitutoTempoDeAtuacaoNaUnidade || "Não informado"}</strong></p>
    </div>
    <div className="mt-3 col col-12 col-md-12">
      <label className="report-label form-label">
        <div>Afastamentos superiores a 15 dias nos últimos 12 meses, especificando o período e o fundamento</div>
      </label>
      <p className="report-field"><strong>{t2SubstitutoAfastamentos || "Não informado"}</strong></p>
    </div>
    <div className="mt-3 col col-12 col-md-12">
      <label className="report-label form-label">
        <div>Períodos de substituição, em férias, de outro magistrado</div>
      </label>
      <p className="report-field"><strong>{t2SubstitutoSubstituicoes || "Não informado"}</strong></p>
    </div>
    <div className="mt-3 col col-12 col-md-12">
      <label className="report-label form-label">
        <div>Qual a modalidade de trabalho adotada pelo Magistrado no Juízo? (art. 2º, TRF2-PVC-2023/00002)</div>
      </label>
      <p className="report-field"><strong>{t2SubstitutoModalidadeTrabalho || "Não informado"}</strong></p>
    </div>
    <div className="mt-3 col col-12 col-md-12">
      <label className="report-label form-label">
        <div>Como é realizado o atendimento aos advogados/procuradores? (art. 3º, TRF2-PVC-2023/00002)</div>
      </label>
      <p className="report-field"><strong>{t2SubstitutoAtendimento || "Não informado"}</strong></p>
    </div>

    <h2>4. Auxílios</h2>
    <div className="mt-3 col col-12 col-md-12">
      <label className="report-label form-label">
        <div>Auxílios prestados e recebidos nos últimos 12 meses</div>
      </label>
      <p className="report-field"><strong>{t3Auxilios || "Não informado"}</strong></p>
    </div>

    <h2>5. Servidores</h2>
    <div className="mt-3 col col-12 col-md-12">
      <label className="report-label form-label">
        <div>
          Discriminar a quantidade de cargos prevista na lotação e a quantidade efetivamente existente no tocante aos analistas judiciários, técnicos judiciários (área administrativa e segurança e transportes), requisitados ou outros:
        </div>
      </label>
    </div>
    <h4>Última Correição</h4>
    <div className="mt-3 col col-12 col-md-12">
      <label className="report-label form-label">
        <div>
          ### calcular automaticamente o total de servidores
        </div>
      </label>
    </div>
    <div className="mt-3 col col-12 col-md-2">
      <label className="report-label form-label">
        <div>
          Analistas Judiciários
        </div>
        <p className="report-field"><strong>{t4UltimaCorreicaoAnalistasJudiciarios || "Não informado"}</strong></p>
      </label>
    </div>
    <div className="mt-3 col col-12 col-md-2">
      <label className="report-label form-label">
        <div>
          Técnicos Judiciários
        </div>
        <p className="report-field"><strong>{t4UltimaCorreicaoTecnicosJudiciarios || "Não informado"}</strong></p>
      </label>
    </div>
    <div className="mt-3 col col-12 col-md-2">
      <label className="report-label form-label">
        <div>
          Técnicos Jud. de Segurança
        </div>
        <p className="report-field"><strong>{t4UltimaCorreicaoAnalistasJudiciariosDeSeguranca || "Não informado"}</strong></p>
      </label>
    </div>
    <div className="mt-3 col col-12 col-md-2">
      <label className="report-label form-label">
        <div>
          Requisitados ou outros
        </div>
        <p className="report-field"><strong>{t4UltimaCorreicaoRequisitadosOuOutros || "Não informado"}</strong></p>
      </label>
    </div>
    <div className="mt-3 col col-12 col-md-2">
      <label className="report-label form-label">
        <div>
          Total de servidores
        </div>
        <p className="report-field"><strong>{t4UltimaCorreicaoTotalDeServidores || "Não informado"}</strong></p>
      </label>
    </div>
    <div className="mt-3 col col-12 col-md-2">
      <label className="report-label form-label">
        <div>
          Quadro Previsto
        </div>
        <p className="report-field"><strong>{t4UltimaCorreicaoQuadroPrevisto || "Não informado"}</strong></p>
      </label>
    </div>

    <h2>Atualmente</h2>

    <div className="mt-3 col col-12 col-md-2">
      <label className="report-label form-label">
        <div>
          Analistas Judiciários
        </div>
        <p className="report-field"><strong>{t4AtualmenteAnalistasJudiciarios || "Não informado"}</strong></p>
      </label>
    </div>
    <div className="mt-3 col col-12 col-md-2">
      <label className="report-label form-label">
        <div>
          Técnicos Judiciários
        </div>
        <p className="report-field"><strong>{t4AtualmenteTecnicosJudiciarios || "Não informado"}</strong></p>
      </label>
    </div>
    <div className="mt-3 col col-12 col-md-2">
      <label className="report-label form-label">
        <div>
          Técnicos Jud. de Segurança
        </div>
        <p className="report-field"><strong>{t4AtualmenteAnalistasJudiciariosDeSeguranca || "Não informado"}</strong></p>
      </label>
    </div>
    <div className="mt-3 col col-12 col-md-2">
      <label className="report-label form-label">
        <div>
          Requisitados ou outros
        </div>
        <p className="report-field"><strong>{t4AtualmenteRequisitadosOuOutros || "Não informado"}</strong></p>
      </label>
    </div>
    <div className="mt-3 col col-12 col-md-2">
      <label className="report-label form-label">
        <div>
          Total de servidores
        </div>
        <p className="report-field"><strong>{t4AtualmenteTotalDeServidores || "Não informado"}</strong></p>
      </label>
    </div>
    <div className="mt-3 col col-12 col-md-2">
      <label className="report-label form-label">
        <div>
          Quadro Previsto
        </div>
        <p className="report-field"><strong>{t4AtualmenteQuadroPrevisto || "Não informado"}</strong></p>
      </label>
    </div>


    <div className="mt-3 col col-12 col-md-12">
      <label className="report-label form-label">
        <div>
          Quantidade de servidores em teletrabalho em observância do limite máximo previsto no art. 5º da Resolução nº TRF2-RSP-2019/00046, alterada pela Resolução n.º TRF2-RSP-2023/00002 (30% do quadro permanente), bem como se é encaminhado o relatório semestral de avaliação, previsto no art. 13, III, da referida Resolução
        </div>
        <p className="report-field"><strong>{t4QuantidadeDeServidoresEmTeletrabalho || "Não informado"}</strong></p>
      </label>
    </div>
    {
    Frm.data.t4ServidoresEmTeletrabalho?.map((servidor: { nome: any; periodo: any; dataEnvio: any; codigo: any }, i: number) => (
      <div key={i} className="d-flex flex-wrap">
        <div className="mt-3 col col-12 col-md-3">
          <label className="report-label form-label">
            <div>
              Servidor {i + 1}
            </div>
            <p className="report-field"><strong>{servidor.nome || "Não informado"}</strong></p>
          </label>
        </div>
        <div className="mt-3 col col-12 col-md-3">
          <label className="report-label form-label">
            <div>
              Período
            </div>
            <p className="report-field"><strong>{servidor.periodo || "Não informado"}</strong></p>
          </label>
        </div>
        <div className="mt-3 col col-12 col-md-3">
          <label className="report-label form-label">
            <div>
              Data de Envio do Relatório
            </div>
            <p className="report-field"><strong>{servidor.dataEnvio || "Não informado"}</strong></p>
          </label>
        </div>
        <div className="mt-3 col col-12 col-md-3">
          <label className="report-label form-label">
            <div>
              Código do Relatório
            </div>
            <p className="report-field"><strong>{servidor.codigo || "Não informado"}</strong></p>
          </label>
        </div>
      </div>
    ))}
    {interview(Frm)}
  </div>
}

export default function BpcLoasPdcMais17() {
  return Model(interview, document, { saveButton: true, pdfButton: true, pdfFileName: 'bpc-loas-pcd-mais-17' })
}