'use client'

import Model from "@/libs/model"
import { FormHelper } from "@/libs/form-support"
import SelectUnidade from "@/components/sei/SelectUnidade"
import Pessoa from "@/components/sei/Pessoa"
import Head from 'next/head';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useState } from "react";
import QuantidadeServidoresTeletrabalho from "@/components/QuantidadeServidoresTeletrabalho";
import Unidade from "@/components/sei/Unidade"

// FUNÇÃO PARA FORMATAR OS CAMPOS DO FORMULÁRIO
function formatForm(name: string, field: any, maxWidth?: string, padding?: string)  {
  return (
    <div style={{ marginTop: '1rem', width: '100%', maxWidth: maxWidth || '100%', padding: padding || '0' }}>
      <label style={{ display: 'block', fontWeight: 'bold' }}>
        <div>
          {name}
        </div>
        <p style={{ fontWeight: 'bold' }}>{field || "Não se aplica"}</p>
      </label>
    </div>
  )
}

function Interview(Frm: FormHelper) {
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

  const oDe1a20 = Array.from({ length: 21 }, (_, i) => ({ id: `${i}`, name: `${i}` }))

  return (
    <div className="scrollableContainer">
      <Head>
        <meta charSet="ISO-8859-1" />
      </Head>
      <div className="row mb-3">
        <Frm.Input label="Número do Processo" name="numproc" width={4} />
        <Frm.dateInput label="Data de Abertura" name="dataAbertura" width={4} />
        <Frm.dateInput label="Data de Encerramento" name="dataEncerramento" width={4} />
      </div>

      <h2>1. Informações da Unidade</h2>
      <Unidade Frm={Frm} name="t1Unidade" />
      <Frm.dateInput label="Data da Instalação" name="t1DataDaInstalacao" width={4} />
      <Frm.TextArea label="Competências (referir eventual alteração de competência ocorrida nos últimos 12 meses e respectivo ato normativo)" name="t1Competencias" width={12} />
      <Frm.CheckBoxes label="Assinale as Características da Unidade" labelsAndNames={oCaracteristicas} width={12} />
      <Frm.TextArea label="Houve redistribuição de processos?" name="t1RedistribuicaoDeProcessos" width={12} />

      <h2>2. Magistrados</h2>
      <h5>Titular</h5>
      {/* Trocar abaixo para algum componente pessoa */}
      <Pessoa Frm={Frm} name="t2Titular" label1="Matrícula do Titular" label2="Nome do Titular" />
      <Frm.Input label="Tempo de atuação na unidade" name="t2TitularTempoDeAtuacaoNaUnidade" width={12} />
      <Frm.TextArea label="Afastamentos superiores a 15 dias nos últimos 12 meses, especificando o período e o fundamento" name="t2TitularAfastamentos" width={12} />
      <Frm.TextArea label="Períodos de substituição, em férias, de outro magistrado" name="t2TitularSubstituicoes" width={12} />
      <Frm.TextArea label="Qual a modalidade de trabalho adotada pelo Magistrado no Juízo? (art. 2º, TRF2-PVC-2023/00002)" name="t2TitularModalidadeTrabalho" width={12} />
      <Frm.TextArea label="Como é realizado o atendimento aos advogados/procuradores? (art. 3º, TRF2-PVC-2023/00002)" name="t2TitularAtendimento" width={12} />
      {!Frm.data.turmaRecursal && (Frm.data.jef || Frm.data.criminal || Frm.data.execucaoFiscal) && (

        <div>
          <h5>Substituto</h5>
          <Pessoa Frm={Frm} name="t2Substituto" label1="Matrícula do Substituto" label2="Nome do Substituto" />
          <Frm.Input label="Tempo de atuação na unidade" name="t2SubstitutoTempoDeAtuacaoNaUnidade" width={12} />
          <Frm.TextArea label="Afastamentos superiores a 15 dias nos últimos 12 meses, especificando o período e o fundamento" name="t2SubstitutoAfastamentos" width={12} />
          <Frm.TextArea label="Períodos de substituição, em férias, de outro magistrado" name="t2SubstitutoSubstituicoes" width={12} />
          <Frm.TextArea label="Qual a modalidade de trabalho adotada pelo Magistrado no Juízo? (art. 2º, TRF2-PVC-2023/00002)" name="t2SubstitutoModalidadeTrabalho" width={12} />
          <Frm.TextArea label="Como é realizado o atendimento aos advogados/procuradores? (art. 3º, TRF2-PVC-2023/00002)" name="t2SubstitutoAtendimento" width={12} />
        </div>

      )}
      <h2>3. Auxílios</h2>
      <Frm.TextArea label="Auxílios prestados e recebidos nos últimos 12 meses" name="t3Auxilios" width={12} />

      <h2>4. Servidores</h2>
      <p>Discriminar a quantidade de cargos prevista na lotação e a quantidade efetivamente existente no tocante aos analistas judiciários, técnicos judiciários (área administrativa e segurança e transportes), requisitados ou outros:</p>
      <h4>Última Correição</h4>
      {/* <p>### calcular automaticamente o total de servidores</p> */}
      <div className="row">
        <Frm.Select label="Analistas Judiciários" name="t4UltimaCorreicaoAnalistasJudiciarios" options={oDe1a20} width={2} />
        <Frm.Select label="Técnicos Judiciários" name="t4UltimaCorreicaoTecnicosJudiciarios" options={oDe1a20} width={2} />
        <Frm.Select label="Técnicos Jud. de Segurança" name="t4UltimaCorreicaoAnalistasJudiciariosDeSeguranca" options={oDe1a20} width={2} />
        <Frm.Select label="Requisitados ou outros" name="t4UltimaCorreicaoRequisitadosOuOutros" options={oDe1a20} width={2} />
        <Frm.Select label="Total de servidores" name="t4UltimaCorreicaoTotalDeServidores" options={oDe1a20} width={2} />
        <Frm.Select label="Quadro Previsto de servidores" name="t4UltimaCorreicaoQuadroPrevisto" options={oDe1a20} width={2} />
      </div>
      <h4>Atualmente</h4>
      <div className="row">
        <Frm.Select label="Analistas Judiciários" name="t4AtualmenteAnalistasJudiciarios" options={oDe1a20} width={2} />
        <Frm.Select label="Técnicos Judiciários" name="t4AtualmenteTecnicosJudiciarios" options={oDe1a20} width={2} />
        <Frm.Select label="Técnicos Jud. de Segurança" name="t4AtualmenteAnalistasJudiciariosDeSeguranca" options={oDe1a20} width={2} />
        <Frm.Select label="Requisitados ou outros" name="t4AtualmenteRequisitadosOuOutros" options={oDe1a20} width={2} />
        <Frm.Select label="Total de servidores" name="t4AtualmenteTotalDeServidores" options={oDe1a20} width={2} />
        <Frm.Select label="Quadro Previsto de servidores" name="t4AtualmenteQuadroPrevisto" options={oDe1a20} width={2} />
      </div>

      <Frm.Select label="Quantidade de servidores em teletrabalho em observância do limite máximo previsto no art. 5º da Resolução nº TRF2-RSP-2019/00046, alterada pela Resolução n.º TRF2-RSP-2023/00002 (30% do quadro permanente), bem como se é encaminhado o relatório semestral de avaliação, previsto no art. 13, III, da referida Resolução" name="t4QuantidadeDeServidoresEmTeletrabalho" options={oDe1a20} width={12} />
      <QuantidadeServidoresTeletrabalho Frm={Frm} name="t4ServidoresEmTeletrabalho" />

      <Frm.TextArea label="Nome dos servidores lotados na unidade e respectivos cargos efetivos (analistas, técnicos, etc.), bem como se exercem cargo em comissão / função comissionada, exercício de chefia, direção ou assessoramento" name="t4NomeDosServidoresLotadosCargosEChefias" width={12} />
      <Frm.TextArea label="Nome e número de servidores sem vínculo com o serviço público" name="t4NomeENumeroDeServidoresSemVinculo" width={12} />
      <Frm.TextArea label="Nome e número de servidores em auxílio (cedidos por outros setores) ou requisitados (com vínculo com o serviço público):" name="t4NomeENumeroDeServidoresEmAuxilioOuRequisitados" width={12} />

      {!Frm.data.turmaRecursal && (
        <Frm.TextArea label="Quantos e quais servidores exercem função de assessoria ao Juiz Federal Substituto? Quantos e quais servidores exercem função de assessoria ao Juiz Federal titular?" name="t4QuantidadeDeServidoresAssessorandoJuizSubstitutoETitular" width={12} />
      )}

      <h2>5. Estagiários</h2>
      <div className="row">
        <Frm.Select label="Número de estagiários de nível superior previstos para unidade" name="t5NumeroPrevistoDeEstagiariosDeNivelSuperior" options={oDe1a20} width={3} />
        <Frm.Select label="Número de estagiários de nível médio previstos para unidade" name="t5NumeroPrevistoDeEstagiariosDeNivelMedio" options={oDe1a20} width={3} />
        <Frm.Select label="Número de estagiários de nível superior lotados na unidade" name="t5NumeroEfetivoDeEstagiariosDeNivelSuperior" options={oDe1a20} width={3} />
        <Frm.Select label="Número de estagiários de nível médio lotados na unidade" name="t5NumeroEfetivoDeEstagiariosDeNivelMedio" options={oDe1a20} width={3} />
      </div>

      <h2>6. Instalações Físicas e Infraestrutura</h2>
      <Frm.TextArea label="Relatar a situação das instalações físicas do setor (mobiliário, ar condicionado, etc.) e dos equipamentos de informática, informando eventuais problemas, dificuldades, bem como destacando se há mobiliário e/ou equipamentos de informática danificados/defeituosos sem previsão de reparo ou substituição já requerida à DIRFO" name="t6InstalacoesFisicasEInfraestrutura" width={12} />

      <h2>7. Livros e Pastas</h2>
      <Frm.TextArea label="Quais os livros e pastas utilizados pela Vara Federal, Juizado Especial ou Turma Recursal?" name="t7LivrosEPastasUtilizados" width={12} />
      <Frm.TextArea label="Algum livro ou pasta em papel foi substituído por registro informatizado (art. 132 da CNCR)? Quais?" name="t7LivrosEPastasSubstituidos" width={12} />
      <Frm.TextArea label="Informar quais as Pastas/Livros Eletrônicos de controle obrigatório existentes no Siga, com a descrição dos expedientes que lhes corresponda" name="t7LivrosEPastasExistentesNoSiga" width={12} />

      <h2>8. Organização da Unidade e Setorização (todas as unidades)</h2>
      <Frm.TextArea label="Detalhar, sucintamente, a forma de organização da unidade, destacando as atribuições do Diretor (a) de Secretaria; Supervisores; e demais servidores" name="t8FormaDeOrganizacao" width={12} />
      <Frm.TextArea label="Informar, sucintamente, sobre a sistemática de planejamento das atividades da unidade e a existência de metas internas, detalhando conforme o caso" name="t8SistematicaDePlanejamento" width={12} />
      <Frm.TextArea label="Informar, sucintamente, sobre a sistemática de avaliação periódica dos resultados das atividades da unidade" name="t8SistematicaDeAvaliacao" width={12} />
      <Frm.TextArea label="Detalhar o tratamento dado aos processos incluídos nas Metas do CNJ, feitos com prioridade legal e demais ações elencadas no art. 12, parágrafo único, da Resolução nº 496/2006 do CJF" name="t8ProcessosIncluidosNasMetasDoCNJ" width={12} />
      <Frm.TextArea label="Critérios de julgamento para os demais feitos" name="t8CriteriosDeJulgamentoParaOsDemaisFeitos" width={12} />
      <Frm.TextArea label="Informar, sucintamente, como ocorre o fluxo dos processos entre a secretaria e o gabinete, a abertura da conclusão e a forma de controle do prazo para prolação de sentenças" name="t8FluxoDeInformacoes" width={12} />

      {!Frm.data.turmaRecursal && (
        <Frm.Input label="Número de processos com pedidos urgentes (liminares, antecipações de tutela) pendentes de análise" name="t8NumeroDeProcessosComPedidosUrgentes" width={12} />
      )}

      <Frm.TextArea label="Há utilização de automação de localizadores (e-Proc) na unidade?" name="t8UtilizacaoDeAutomacaoDosLocalizadores" width={12} />
      <Frm.TextArea label="Como é feito o controle dos prazos de suspensão dos processos? Há inserção em local (físico ou virtual) específico, com a anotação do motivo de suspensão e a data do término?" name="t8PrazosDeSuspensao" width={12} />
      <Frm.TextArea label="A unidade verifica a pertinência do assunto cadastrado no processo quando recebe novos processos, garantindo que todos os processos do acervo possuam assunto folha (último nível) ou de nível 3 ou mais, respeitando a padronização da terminologia de assuntos processuais imposta pelo CNJ?" name="t8RespeitoAPadronizacaoDoCNJ" width={12} />
      <Frm.TextArea label="A unidade possui algum processo em que não há assunto correspondente disponível na Tabela Unificada? A situação foi informada à SAJ ou CORETAB?" name="t8ProcessoSemAssuntoCorrespondente" width={12} />

      {Frm.data.jef && (
        <div>
          <h5>Juizado Especial Federal</h5>
          <Frm.TextArea label="O JEF se utiliza do WhatsApp ou de outro aplicativo de mensagens para intimação das partes, nos termos dos artigos 158 e seguintes da CNCR?" name="t8AplicativoDeMensagens" width={12} />
        </div>
      )}

      {Frm.data.criminal && (
        <div>
          <h5>Criminal</h5>
          <Frm.Input label="Há quantos processos com réus presos? Apresente a listagem" name="t8NumeroDeProcessosComReusPresos" width={12} />
          <Frm.TextArea label="Há anotação na autuação de réus presos?" name="t8AnotacaoNaAutuacaoDeReusPresos" width={12} />
          <Frm.TextArea label="É dada prioridade de tramitação nos processos com réus presos?" name="t8PrioridadeDeTramitacaoNosProcessosDeReusPrezos" width={12} />
          <Frm.TextArea label="Há atualização imediata da situação da parte no e-Proc (solto, preso, PRD não convertida, condenado, sursis não revogado, condenado preso, etc.)?" name="t8AtualizacaoImediataSituacaoDaParte" width={12} />
          <Frm.TextArea label="Detalhar a forma de controle da incidência da prescrição penal, inclusive nas execuções penais, se for o caso (arts. 236 e seguintes da CNCR e Resolução 112 de abril/2010 do CNJ)" name="t8ControleDaIncidenciaDaPrescricaoPenal" width={12} />
          <Frm.TextArea label="São registrados no e-Proc os anexos físicos não suportados pelo referido sistema?" name="t8AnexosFisicosNoEproc" width={12} />
          <Frm.TextArea label="O resultado das audiências de custódia é/era cadastrado no Sistema de Audiência de Custódia (SISTAC) enquanto se aguarda/aguardava a possibilidade de cadastro no BNMP 3.0?" name="t8SistemaDeAudienciaDeCustodia" width={12} />
          <Frm.TextArea label="O BNMP 2.0 está devidamente saneado na unidade, para futura utilização do BNMP 3.0, a partir de maio de 2024?" name="t8SaneamentoBNMP2" width={12} />
          <Frm.TextArea label="Em caso de resposta negativa, quais estão sendo as medidas implementadas para que isso ocorra até 02 de maio de 2024, prazo estabelecido pelo CNJ no Ofício Circular n. 44/DMF?" name="t8MedidasSaneamentoBNMP2" width={12} />
          <Frm.TextArea label="Quais foram os processos em que foram expedidos alvarás de soltura nos 12 meses anteriores à correição e quais são os números desses alvarás? Ressalta-se que é obrigatório e de suma importância que o BNMP, atualmente em sua versão 2.0, e futuramente em sua versão 3.0, seja utilizado para emissão e gestão de todas as peças de que trata a Resolução n. 417/2021 do CNJ" name="t8ProcessosComAlvarasDeSoltura" width={12} />
          <Frm.TextArea label="Qual é o procedimento que a unidade adota relativamente às armas e munições apreendidas e o respectivo envio ao Exército?" name="t8ProcedimentoParaArmasEMunicoes" width={12} />
          <Frm.TextArea label="Apresentar a listagem de entidades cadastradas para prestação de serviços/prestação pecuniária e informar o método de seleção dessas entidades" name="t8EntidadesParaServicosOuPrestacaoPecuniaria" width={12} />
          <Frm.TextArea label="Existe algum local virtual para processos aguardando expedição de carta de execução de sentença penal?" name="t8LocalVirtualCESP" width={12} />


        </div>
      )}


      {Frm.data.execucaoFiscal && (
        <div>
          <h5>Execução Fiscal</h5>
          <Frm.TextArea label="Quais as execuções fiscais consideradas como sendo de grandes devedores pela unidade (critério utilizado pela Vara)?" name="t8ProcessosComGrandesDevedores" width={12} />
          <Frm.TextArea label="Informar, sucintamente, o tratamento dado às execuções fiscais de valores expressivos em juízo, bem como se são observados os procedimentos previstos no art. 258 da CNCR." name="t8TratamentoDadoAosValoresExpressivos" width={12} />
          <Frm.TextArea label="Detalhar a forma de controle da incidência da prescrição intercorrente" name="t8ControleDaPrescricaoIntercorrente" width={12} />
          <Frm.TextArea label="Qual o critério de seleção de leiloeiros e realização de leilões unificados (art. 256 da CNCR)?" name="t8CriterioDeSelecaoDosLeiloeiros" width={12} />
          <Frm.Input label="Quantos leilões ocorreram nos últimos 12 meses?" name="t8QuantidadeDeLeiloes" width={12} />
          <Frm.TextArea label="Há leilões designados?" name="t8LeiloesDesignados" width={12} />
        </div>
      )}

      <h2>9. Materiais Acautelados na Unidade</h2>
      <Frm.TextArea label="Indicar a quantidade de materiais (bens e documentos) acautelados e apreendidos na unidade (separadamente)" name="t9QuantidadeDeMateriaisAcautelados" width={12} />
      <Frm.TextArea label="Indicar a quantidade de processos com bens acautelados/apreendidos na unidade" name="t9QuantidadeDeProcessosComBensAcautelados" width={12} />
      <Frm.TextArea label="Todos os bens acautelados apresentam exata correspondência com os termos de acautelamento mantidos pela Secretaria?" name="t9BensAcauteladosCorrespondemComTermos" width={12} />
      <Frm.TextArea label="Dentre os bens acautelados/apreendidos na unidade, informar (i) quais possuem conteúdo econômico passível de perdimento ou expropriação; (ii) se há dinheiro em espécie, títulos de crédito, joias acauteladas ou moeda falsa; (iii) se a moeda falsa está devidamente identificada; e (iv) qual a localização desses bens e a situação atual dos respectivos processos" name="t9DinheiroEmEspecieTitulosOuJoias" width={12} />
      <Frm.TextArea label="Dentre os bens acautelados/apreendidos na unidade, informar quais estão cadastrados no SNGB, por se tratarem de bens alcançados pelo cumprimento de decisões judiciais (art. 1º da Resolução nº 483/2022 do CNJ)" name="t9BensCadastradosNoSNGB" width={12} />
      <Frm.TextArea label="A unidade tem tido alguma dificuldade na utilização do SNGB?" name="t9DificuldadeNoUsoDoSNGB" width={12} />
      <Frm.TextArea label="A unidade possuía registros ativos no SNBA na data da implementação do SNGB (Resolução nº 483/2022 do CNJ)?" name="t9RegistrosAtivosNoSNBA" width={12} />
      <Frm.TextArea label="Em caso positivo, a migração manual dos registros do SNBA para o SNGB foi finalizada? Se não, quais são as medidas que estão sendo implementadas para que isso ocorra e qual é o cronograma (detalhado) para regularização total dos cadastros?" name="t9MigracaoDoSNBAParaSNGB" width={12} />
      <Frm.TextArea label="A unidade possui cofre ou sala de acautelados e é examinada a regularidade dos bens ali guardados?" name="t9CofreOuSalaDeAcautelados" width={12} />
      <Frm.TextArea label="Detalhar as providências adotadas para o acautelamento/apreensão de bens em geral" name="t9ProvidenciasAdotadasParaAcautelamento" width={12} />
      <Frm.TextArea label="Detalhar as providências adotadas para alienação antecipada de bens, quando necessário" name="t9ProvidenciasDeAlienacaoAntecipada" width={12} />
      <ul>
        <li>
          <p>Juntar aos autos do processo de correção ordinária, no E-proc, as fotos dos bens acautelados, salvas em PDF, observando-se o seguinte:</p>
          <ul>
            <li>1 (uma) foto por bem acautelado, onde se visualize, apenas externamente, o termo de acautelamento que nele se encontre afixado;</li>
            <li>No termo de acautelamento deve constar a descrição do bem acautelado e a identificação precisa do local em que se encontra;</li>
            <li>Caso o bem se encontre em local diverso da Secretaria por designação do Juízo, indicar o expediente no Siga criado para tal registro, na forma do art. 2º, §3º, da Portaria TRF2-PTC-2022/00071.</li>
          </ul>
        </li>
        <li>
          <p>Os bens acautelados devem estar registrados como “Anexo Físico” no E-Proc, em "Informações adicionais", de forma a possibilitar o seu controle por meio da extração de Relatório Geral no Sistema Processual.</p>
          <p>No conteúdo da informação do “Anexo Físico”, deve constar a descrição do bem acautelado, a localização precisa em que se encontra e a indicação da existência de termo de acautelamento e do evento/folha correspondente no processo eletrônico (art. 2º, § 1º, da Portaria TRF2-PTC-2022/00071);</p>
          <p>Devem ser excluídos/desativados os “Anexos Físicos” nas “Informações Adicionais” dos processos eletrônicos que não possuam bens acautelados (art. 2º, § 2º, da Portaria TRF2-PTC-2022/00071).</p>
        </li>
      </ul>

      <h2>10. Processos Físicos em carga ou retirados</h2>
      <Frm.RadioButtons
        label="Há processos físicos com carga às partes ou retirados por auxiliares do juízo além do prazo legal?"
        name="t10ProcessosFisicosComCarga"
        options={[{ id: '1', name: 'Sim' }, { id: '2', name: 'Não' }]}
        width={12}
      />
      <Frm.TextArea label="Identificar os processos extraviados, as datas da ocorrência e as providências" name="t10ProcessosExtraviados" width={12} />
      <Frm.TextArea label="Identificar as ações de restauração de autos, no período do levantamento" name="t10AcoesDeRestauracao" width={12} />

      {!Frm.data.turmaRecursal && (
        <div>
          <h2>11. Audiências</h2>
          <Frm.TextArea label="Número de audiências agendadas e realizadas (indicar separadamente para o juiz titular e para o juiz substituto)" name="t11NumeroDeAudienciasAgendadasERealizadas" width={12} />
          <Frm.TextArea label="Como é feito o controle das audiências canceladas/remarcadas?" name="t11ControleDeAudienciasCanceladas" width={12} />
          <Frm.TextArea label="É realizada audiência de conciliação em todos os casos possíveis de autocomposição (art. 334 do CPC)?" name="t11AudienciaDeConciliacao" width={12} />
          <Frm.TextArea label="É realizado o acompanhamento do cumprimento da Meta 3 do CNJ pela unidade?" name="t11AcompanhamentoDaMeta3DoCNJ" width={12} />
          <Frm.TextArea label="Qual o intervalo de tempo médio entre o despacho de designação da audiência e a realização do ato?" name="t11TempoMedioEntreDespachoDeDesignacaoEAudiencia" width={12} />
          <Frm.TextArea label="A unidade utiliza o registro audiovisual de audiências nos termos dos artigos 136 e seguintes da CNCR?" name="t11RegistroVisualDeAudiencias" width={12} />
          <Frm.TextArea label="Foi detectada alguma falha no registro audiovisual de audiências nos últimos 12 meses comprometendo seu conteúdo? Quais as falhas e quais as soluções adotadas para saná-las?" name="t11FalhasNoRegistroAudiovisualDeAudiencias" width={12} />
          <Frm.TextArea label="Houve alguma audiência de custódia nos últimos 12 meses? Quantas? Em caso negativo, justifique. Em caso positivo, especifique eventuais problemas ou dificuldades" name="t11AudienciaDeCustodia" width={12} />
          <Frm.TextArea label="Foi realizada alguma audiência de forma remota nos últimos dois anos? Em quais processos? (art. 4º, TRF2-PVC-2023/00002)" name="t11AudienciaRemota" width={12} />
        </div>
      )}

      {Frm.data.turmaRecursal && (
        <div>
          <h2>11. Sessão de Julgamento/Audiências</h2>
          <Frm.TextArea label="Número de sessões de julgamento agendadas e realizadas" name="t11NumeroDeSessoesDeJulgamentoAgendadasERealizadas" width={12} />
          <Frm.TextArea label="Como é feito o controle da inclusão, adiamento e retirada de pauta de processos?" name="t11ControleDePauta" width={12} />
          <Frm.TextArea label="Qual o intervalo de tempo médio entre o pedido de dia/inclusão em pauta e a realização da sessão de julgamento?" name="t11IntervaloDeTempo" width={12} />
          <Frm.TextArea label="A unidade utiliza o registro audiovisual de sessões de julgamento?" name="t11RegistroVisualDeSessoesDeJulgamento" width={12} />
          <Frm.TextArea label="Foi detectada alguma falha no registro audiovisual de sessões de julgamento nos últimos 12 meses comprometendo seu conteúdo?  Quais as falhas e quais as soluções adotadas para saná-las?" name="t11FalhasNoRegistroAudiovisualDeSessoesDeJulgamento" width={12} />
          <Frm.TextArea label="Foi realizada alguma audiência de forma remota nos últimos dois anos? Em quais processos? (art. 4º, TRF2-PVC-2023/00002)" name="t11AudienciaRemota" width={12} />
        </div>
      )}
      <h2>12. Cumprimento de determinações de inspeções e Correições Anteriores</h2>
      <Frm.TextArea
        label="A unidade cumpriu todas as metas estabelecidas na inspeção anterior?"
        name="t12CumprimentoDasMetasDaInspecaoAnterior"
        width={12}
      />
      <Frm.TextArea
        label="A unidade regularizou todas as pendências apontadas na última Correição ou Inspeção de Avaliação da Corregedoria?"
        name="t12RegularizacaoDasPendenciasDaUltimaCorreicao"
        width={12}
      />
      <Frm.TextArea
        label="Em sendo negativa a resposta de algum dos itens acima, justificar o eventual não cumprimento"
        name="t12JustificativaDoNaoCumprimento"
        width={12}
      />

      <h2>13. Boas práticas e dificuldades</h2>
      <Frm.TextArea
        label="Relacionar as boas práticas, eventuais dificuldades vivenciadas na unidade, bem como demandas e soluções propostas, inclusive quanto aos setores administrativos "
        name="t13JustificativaDoNaoCumprimento"
        width={12}
      />
    </div>
  )
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
    t4ServidoresEmTeletrabalho,
    t4NomeDosServidoresLotadosCargosEChefias,
    t4NomeENumeroDeServidoresSemVinculo,
    t4NomeENumeroDeServidoresEmAuxilioOuRequisitados,
    t4QuantidadeDeServidoresAssessorandoJuizSubstitutoETitular,
    t5NumeroPrevistoDeEstagiariosDeNivelSuperior,
    t5NumeroPrevistoDeEstagiariosDeNivelMedio,
    t5NumeroEfetivoDeEstagiariosDeNivelSuperior,
    t5NumeroEfetivoDeEstagiariosDeNivelMedio,
    t6InstalacoesFisicasEInfraestrutura,
    t7LivrosEPastasUtilizados,
    t7LivrosEPastasSubstituidos,
    t7LivrosEPastasExistentesNoSiga,
    t8FormaDeOrganizacao,
    t8SistematicaDePlanejamento,
    t8SistematicaDeAvaliacao,
    t8ProcessosIncluidosNasMetasDoCNJ,
    t8CriteriosDeJulgamentoParaOsDemaisFeitos,
    t8FluxoDeInformacoes,
    t8NumeroDeProcessosComPedidosUrgentes,
    t8UtilizacaoDeAutomacaoDosLocalizadores,
    t8PrazosDeSuspensao,
    t8RespeitoAPadronizacaoDoCNJ,
    t8ProcessoSemAssuntoCorrespondente,
    t8AplicativoDeMensagens,
    t8NumeroDeProcessosComReusPresos,
    t8AnotacaoNaAutuacaoDeReusPresos,
    t8PrioridadeDeTramitacaoNosProcessosDeReusPrezos,
    t8AtualizacaoImediataSituacaoDaParte,
    t8ControleDaIncidenciaDaPrescricaoPenal,
    t8AnexosFisicosNoEproc,
    t8SistemaDeAudienciaDeCustodia,
    t8SaneamentoBNMP2,
    t8MedidasSaneamentoBNMP2,
    t8ProcessosComAlvarasDeSoltura,
    t8ProcedimentoParaArmasEMunicoes,
    t8EntidadesParaServicosOuPrestacaoPecuniaria,
    t8LocalVirtualCESP,
    t8ProcessosComGrandesDevedores,
    t8TratamentoDadoAosValoresExpressivos,
    t8ControleDaPrescricaoIntercorrente,
    t8CriterioDeSelecaoDosLeiloeiros,
    t8QuantidadeDeLeiloes,
    t8LeiloesDesignados,
    t9QuantidadeDeMateriaisAcautelados,
    t9QuantidadeDeProcessosComBensAcautelados,
    t9BensAcauteladosCorrespondemComTermos,
    t9DinheiroEmEspecieTitulosOuJoias,
    t9BensCadastradosNoSNGB,
    t9DificuldadeNoUsoDoSNGB,
    t9RegistrosAtivosNoSNBA,
    t9MigracaoDoSNBAParaSNGB,
    t9CofreOuSalaDeAcautelados,
    t9ProvidenciasAdotadasParaAcautelamento,
    t9ProvidenciasDeAlienacaoAntecipada,
    t10ProcessosFisicosComCarga,
    t10ProcessosExtraviados,
    t10AcoesDeRestauracao,
    t11NumeroDeAudienciasAgendadasERealizadas,
    t11ControleDeAudienciasCanceladas,
    t11AudienciaDeConciliacao,
    t11AcompanhamentoDaMeta3DoCNJ,
    t11TempoMedioEntreDespachoDeDesignacaoEAudiencia,
    t11RegistroVisualDeAudiencias,
    t11FalhasNoRegistroAudiovisualDeAudiencias,
    t11AudienciaDeCustodia,
    t11AudienciaRemota,
    t11NumeroDeSessoesDeJulgamentoAgendadasERealizadas,
    t11ControleDePauta,
    t11IntervaloDeTempo,
    t11RegistroVisualDeSessoesDeJulgamento,
    t11FalhasNoRegistroAudiovisualDeSessoesDeJulgamento,
    t12CumprimentoDasMetasDaInspecaoAnterior,
    t12RegularizacaoDasPendenciasDaUltimaCorreicao,
    t12JustificativaDoNaoCumprimento,
    t13JustificativaDoNaoCumprimento,
  } = Frm.data;
  return <div className="scrollableContainer">
    <div style={{ display: 'flex', flexWrap: 'wrap' }}>
      <h1 style={{ textAlign: 'center', width: '100%' }}>Relatório de Pré-correição Judicial</h1>
      {formatForm("Número do Processo", numproc, "33.3333%")}
      {formatForm("Data de Abertura", dataAbertura, "33.3333%")}
      {formatForm("Data de Encerramento", dataEncerramento, "33.3333%")}

      {/* Texto fixo */}
      <label style={{ display: 'block', fontWeight: 'bold' }}>
        <p>Período de levantamento: 12 meses anteriores.</p>
        <p>Prazo de entrega: 10 (dez) dias antes do início da correição.</p>
        <p>Nas perguntas que não se insiram na competência da unidade, deve responder "não se aplica".</p>
      </label>

      <h2 style={{ width: '100%' }}>1. Informações da Unidade</h2>

      {formatForm("Unidade", t1Unidade?.descricao, "33.3333%")}
      {formatForm("Data da Instalação", t1DataDaInstalacao, "33.3333%")}

      <div style={{ marginTop: '1rem', width: '100%' }}>
        <label style={{ display: 'block', fontWeight: 'bold' }}>
          Competências (referir eventual alteração de competência ocorrida nos últimos 12 meses e respectivo ato normativo)
        </label>
        <p style={{ fontWeight: 'bold' }}>{t1Competencias || "Não se aplica"}</p>
      </div>

      <div style={{ marginTop: '1rem', width: '100%' }}>
        <label style={{ display: 'block', fontWeight: 'bold' }}>
          Assinale as Características da Unidade
        </label>
        <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid black', backgroundColor: 'white' }}>
          <tbody>
            <tr>
              <td style={{ border: '1px solid black', padding: '0.5rem' }}>Turma Recursal</td>
              <td style={{ border: '1px solid black', padding: '0.5rem', fontWeight: 'bold' }}>{turmaRecursal ? 'Sim' : 'Não'}</td>
            </tr>
            <tr>
              <td style={{ border: '1px solid black', padding: '0.5rem' }}>Juizado Especial Federal</td>
              <td style={{ border: '1px solid black', padding: '0.5rem', fontWeight: 'bold' }}>{jef ? 'Sim' : 'Não'}</td>
            </tr>
            <tr>
              <td style={{ border: '1px solid black', padding: '0.5rem' }}>Criminal</td>
              <td style={{ border: '1px solid black', padding: '0.5rem', fontWeight: 'bold' }}>{criminal ? 'Sim' : 'Não'}</td>
            </tr>
            <tr>
              <td style={{ border: '1px solid black', padding: '0.5rem' }}>Execução Fiscal</td>
              <td style={{ border: '1px solid black', padding: '0.5rem', fontWeight: 'bold' }}>{execucaoFiscal ? 'Sim' : 'Não'}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {formatForm("Houve redistribuição de processos?", t1RedistribuicaoDeProcessos)}

      <h2 style={{ width: '100%' }}>2. Magistrados</h2>
      {formatForm("Titular", t2Titular?.descricao)}
      {formatForm("Tempo de atuação na unidade", t2TitularTempoDeAtuacaoNaUnidade)}
      {formatForm("Afastamentos superiores a 15 dias nos últimos 12 meses, especificando o período e o fundamento", t2TitularAfastamentos)}
      {formatForm("Períodos de substituição, em férias, de outro magistrado", t2TitularSubstituicoes)}
      {formatForm("Qual a modalidade de trabalho adotada pelo Magistrado no Juízo? (art. 2º, TRF2-PVC-2023/00002)", t2TitularModalidadeTrabalho)}
      {formatForm("Como é realizado o atendimento aos advogados/procuradores? (art. 3º, TRF2-PVC-2023/00002)", t2TitularAtendimento)}

      {(!turmaRecursal && (jef || criminal || execucaoFiscal)) && (
        <>
          {formatForm("Substituto", t2Substituto?.descricao)}
          {formatForm("Tempo de atuação na unidade", t2SubstitutoTempoDeAtuacaoNaUnidade)}
          {formatForm("Afastamentos superiores a 15 dias nos últimos 12 meses, especificando o período e o fundamento", t2SubstitutoAfastamentos)}
          {formatForm("Períodos de substituição, em férias, de outro magistrado", t2SubstitutoSubstituicoes)}
          {formatForm("Qual a modalidade de trabalho adotada pelo Magistrado no Juízo? (art. 2º, TRF2-PVC-2023/00002)", t2SubstitutoModalidadeTrabalho)}
          {formatForm("Como é realizado o atendimento aos advogados/procuradores? (art. 3º, TRF2-PVC-2023/00002)", t2SubstitutoAtendimento)}
        </>
      )}

      <h2 style={{ width: '100%' }}>3. Auxílios</h2>
      {formatForm("Auxílios prestados e recebidos nos últimos 12 meses", t3Auxilios)}

      {/* 4. Servidores */}
      <h2 style={{ width: '100%' }}>4. Servidores</h2>
      <div style={{ marginTop: '1rem', width: '100%' }}>
        <label style={{ display: 'block', fontWeight: 'bold' }}>
          <div>
            Discriminar a quantidade de cargos prevista na lotação e a quantidade efetivamente existente no tocante aos analistas judiciários, técnicos judiciários (área administrativa e segurança e transportes), requisitados ou outros:
          </div>
        </label>
      </div>
      <h4 style={{ width: '100%' }}>Última Correição</h4>
      {/* <div style={{ marginTop: '1rem', width: '100%' }}>
        <label style={{ display: 'block', fontWeight: 'bold' }}>
          <div>
            ### calcular automaticamente o total de servidores 
          </div>
        </label>
      </div> */}
      <div style={{ display: 'flex', flexWrap: 'wrap', width: '100%' }}>
        {formatForm("Analistas Judiciários", t4UltimaCorreicaoAnalistasJudiciarios, "16.6667%", '0 0.5rem')}
        {formatForm("Técnicos Judiciários", t4UltimaCorreicaoTecnicosJudiciarios, "16.6667%", '0 0.5rem')}
        {formatForm("Técnicos Jud. de Segurança", t4UltimaCorreicaoAnalistasJudiciariosDeSeguranca, "16.6667%", '0 0.5rem')}
        {formatForm("Requisitados ou outros", t4UltimaCorreicaoRequisitadosOuOutros, "16.6667%", '0 0.5rem')}
        {formatForm("Total de servidores", t4UltimaCorreicaoTotalDeServidores, "16.6667%", '0 0.5rem')}
        {formatForm("Quadro Previsto", t4UltimaCorreicaoQuadroPrevisto, "16.6667%", '0 0.5rem')}
      </div>

      <h2 style={{ width: '100%' }}>Atualmente</h2>

      <div style={{ display: 'flex', flexWrap: 'wrap', width: '100%' }}>
        {formatForm("Analistas Judiciários", t4AtualmenteAnalistasJudiciarios, "16.6667%", '0 0.5rem')}
        {formatForm("Técnicos Judiciários", t4AtualmenteTecnicosJudiciarios, "16.6667%", '0 0.5rem')}
        {formatForm("Técnicos Jud. de Segurança", t4AtualmenteAnalistasJudiciariosDeSeguranca, "16.6667%", '0 0.5rem')}
        {formatForm("Requisitados ou outros", t4AtualmenteRequisitadosOuOutros, "16.6667%", '0 0.5rem')}
        {formatForm("Total de servidores", t4AtualmenteTotalDeServidores, "16.6667%", '0 0.5rem')}
        {formatForm("Quadro Previsto", t4AtualmenteQuadroPrevisto, "16.6667%", '0 0.5rem')}
      </div>

      {formatForm(
        "Quantidade de servidores em teletrabalho em observância do limite máximo previsto no art. 5º da Resolução nº TRF2-RSP-2019/00046, alterada pela Resolução n.º TRF2-RSP-2023/00002 (30% do quadro permanente), bem como se é encaminhado o relatório semestral de avaliação, previsto no art. 13, III, da referida Resolução",
        t4QuantidadeDeServidoresEmTeletrabalho
      )}
      <div style={{ marginTop: '1rem', width: '100%' }}>
        {
          Frm.data.t4ServidoresEmTeletrabalho?.map((servidor: { nome: any; periodo: any; dataEnvio: any; numero: any }, i: number) => (
            <div key={i} style={{ display: 'flex', flexWrap: 'wrap' }}>
              {formatForm(`Servidor ${i + 1}`, servidor.nome, "25%")}
              {formatForm("Período", servidor.periodo, "25%")}
              {formatForm("Data de Envio do Relatório", servidor.dataEnvio, "25%")}
              {formatForm("Número", servidor.numero, "25%")}
            </div>
          ))}

        {formatForm("Nome dos servidores lotados na unidade e respectivos cargos efetivos (analistas, técnicos, etc.), bem como se exercem cargo em comissão / função comissionada, exercício de chefia, direção ou assessoramento", t4NomeDosServidoresLotadosCargosEChefias)}
        {formatForm("Nome e número de servidores sem vínculo com o serviço público", t4NomeENumeroDeServidoresSemVinculo)}
        {formatForm("Nome e número de servidores em auxílio (cedidos por outros setores) ou requisitados (com vínculo com o serviço público):", t4NomeENumeroDeServidoresEmAuxilioOuRequisitados)}

        {!Frm.data.turmaRecursal &&
          <div style={{ marginTop: '1rem', width: '100%' }}>
            <label style={{ display: 'block', fontWeight: 'bold' }}>
              <div>Quantos e quais servidores exercem função de assessoria ao Juiz Federal Substituto?
                Quantos e quais servidores exercem função de assessoria ao Juiz Federal titular?
              </div>
            </label>
            <p style={{ fontWeight: 'bold' }}>{t4QuantidadeDeServidoresAssessorandoJuizSubstitutoETitular || "Não se aplica"}</p>
          </div>
        }
      </div>

      {/* 5. Estagiários */}
      <h2 style={{ width: '100%' }}>5. Estagiários</h2>
      {formatForm("Número de estagiários de nível superior previstos para unidade", t5NumeroPrevistoDeEstagiariosDeNivelSuperior)}
      {formatForm("Número de estagiários de nível médio previstos para unidade", t5NumeroPrevistoDeEstagiariosDeNivelMedio)}
      {formatForm("Número de estagiários de nível superior lotados na unidade", t5NumeroEfetivoDeEstagiariosDeNivelSuperior)}
      {formatForm("Número de estagiários de nível médio lotados na unidade", t5NumeroEfetivoDeEstagiariosDeNivelMedio)}

      <h2 style={{ width: '100%' }}>6. Instalações Físicas e Infraestrutura</h2>
      {formatForm("Relatar a situação das instalações físicas do setor (mobiliário, ar condicionado, etc.) e dos equipamentos de informática, informando eventuais problemas, dificuldades, bem como destacando se há mobiliário e/ou equipamentos de informática danificados/defeituosos sem previsão de reparo ou substituição já requerida à DIRFO", t6InstalacoesFisicasEInfraestrutura)}

      <h2 style={{ width: '100%' }}>7. Livros e Pastas</h2>
      {formatForm("Quais os livros e pastas utilizados pela Vara Federal, Juizado Especial ou Turma Recursal?", t7LivrosEPastasUtilizados)}
      {formatForm("Algum livro ou pasta em papel foi substituído por registro informatizado (art. 132 da CNCR)? Quais?", t7LivrosEPastasSubstituidos)}
      {formatForm("Informar quais as Pastas/Livros Eletrônicos de controle obrigatório existentes no Siga, com a descrição dos expedientes que lhes corresponda", t7LivrosEPastasExistentesNoSiga)}

      <h2 style={{ width: '100%' }}>8. Organização da Unidade e Setorização (todas as unidades)</h2>
      {formatForm("Detalhar, sucintamente, a forma de organização da unidade, destacando as atribuições do Diretor (a) de Secretaria; Supervisores; e demais servidores", t8FormaDeOrganizacao)}
      {formatForm("Informar, sucintamente, sobre a sistemática de planejamento das atividades da unidade e a existência de metas internas, detalhando conforme o caso", t8SistematicaDePlanejamento)}
      {formatForm("Informar, sucintamente, sobre a sistemática de avaliação periódica dos resultados das atividades da unidade", t8SistematicaDeAvaliacao)}
      {formatForm("Detalhar o tratamento dado aos processos incluídos nas Metas do CNJ, feitos com prioridade legal e demais ações elencadas no art. 12, parágrafo único, da Resolução nº 496/2006 do CJF", t8ProcessosIncluidosNasMetasDoCNJ)}
      {formatForm("Critérios de julgamento para os demais feitos", t8CriteriosDeJulgamentoParaOsDemaisFeitos)}
      {formatForm("Informar, sucintamente, como ocorre o fluxo dos processos entre a secretaria e o gabinete, a abertura da conclusão e a forma de controle do prazo para prolação de sentenças", t8FluxoDeInformacoes)}

      {!turmaRecursal &&
        <>
          {formatForm("Número de processos com pedidos urgentes (liminares, antecipações de tutela) pendentes de análise", t8NumeroDeProcessosComPedidosUrgentes)}
          {formatForm("Há utilização de automação de localizadores (e-Proc) na unidade?", t8UtilizacaoDeAutomacaoDosLocalizadores)}
          {formatForm("Como é feito o controle dos prazos de suspensão dos processos? Há inserção em local (físico ou virtual) específico, com a anotação do motivo de suspensão e a data do término?", t8PrazosDeSuspensao)}
          {formatForm("A unidade verifica a pertinência do assunto cadastrado no processo quando recebe novos processos, garantindo que todos os processos do acervo possuam assunto folha (último nível) ou de nível 3 ou mais, respeitando a padronização da terminologia de assuntos processuais imposta pelo CNJ?", t8RespeitoAPadronizacaoDoCNJ)}
          {formatForm("A unidade possui algum processo em que não há assunto correspondente disponível na Tabela Unificada? A situação foi informada à SAJ ou CORETAB?", t8ProcessoSemAssuntoCorrespondente)}
        </>
      }

      {jef && (formatForm("O JEF se utiliza do WhatsApp ou de outro aplicativo de mensagens para intimação das partes, nos termos dos artigos 158 e seguintes da CNCR?", t8AplicativoDeMensagens))}

      {criminal && (
        <>
          <h5>Criminal</h5>
          {formatForm("Há quantos processos com réus presos? Apresente a listagem", t8NumeroDeProcessosComReusPresos)}
          {formatForm("Há anotação na autuação de réus presos?", t8AnotacaoNaAutuacaoDeReusPresos)}
          {formatForm("É dada prioridade de tramitação nos processos com réus presos?", t8PrioridadeDeTramitacaoNosProcessosDeReusPrezos)}
          {formatForm("Há atualização imediata da situação da parte no e-Proc (solto, preso, PRD não convertida, condenado, sursis não revogado, condenado preso, etc.)?", t8AtualizacaoImediataSituacaoDaParte)}
          {formatForm("Detalhar a forma de controle da incidência da prescrição penal, inclusive nas execuções penais, se for o caso (arts. 236 e seguintes da CNCR e Resolução 112 de abril/2010 do CNJ)", t8ControleDaIncidenciaDaPrescricaoPenal)}
          {formatForm("São registrados no e-Proc os anexos físicos não suportados pelo referido sistema?", t8AnexosFisicosNoEproc)}
          {formatForm("O resultado das audiências de custódia é/era cadastrado no Sistema de Audiência de Custódia (SISTAC) enquanto se aguarda/aguardava a possibilidade de cadastro no BNMP 3.0?", t8SistemaDeAudienciaDeCustodia)}
          {formatForm("O BNMP 2.0 está devidamente saneado na unidade, para futura utilização do BNMP 3.0, a partir de maio de 2024?", t8SaneamentoBNMP2)}
          {formatForm("Em caso de resposta negativa, quais estão sendo as medidas implementadas para que isso ocorra até 02 de maio de 2024, prazo estabelecido pelo CNJ no Ofício Circular n. 44/DMF?", t8MedidasSaneamentoBNMP2)}
          {formatForm("Quais foram os processos em que foram expedidos alvarás de soltura nos 12 meses anteriores à correição e quais são os números desses alvarás? Ressalta-se que é obrigatório e de suma importância que o BNMP, atualmente em sua versão 2.0, e futuramente em sua versão 3.0, seja utilizado para emissão e gestão de todas as peças de que trata a Resolução n. 417/2021 do CNJ", t8ProcessosComAlvarasDeSoltura)}
          {formatForm("Qual é o procedimento que a unidade adota relativamente às armas e munições apreendidas e o respectivo envio ao Exército?", t8ProcedimentoParaArmasEMunicoes)}
          {formatForm("Apresentar a listagem de entidades cadastradas para prestação de serviços/prestação pecuniária e informar o método de seleção dessas entidades", t8EntidadesParaServicosOuPrestacaoPecuniaria)}
          {formatForm("Existe algum local virtual para processos aguardando expedição de carta de execução de sentença penal?", t8LocalVirtualCESP)}
        </>
      )}
      {execucaoFiscal && (
        <>
          <h5>Execução Fiscal</h5>
          {formatForm("Quais as execuções fiscais consideradas como sendo de grandes devedores pela unidade (critério utilizado pela Vara)?", t8ProcessosComGrandesDevedores)}
          {formatForm("Informar, sucintamente, o tratamento dado às execuções fiscais de valores expressivos em juízo, bem como se são observados os procedimentos previstos no art. 258 da CNCR.", t8TratamentoDadoAosValoresExpressivos)}
          {formatForm("Detalhar a forma de controle da incidência da prescrição intercorrente", t8ControleDaPrescricaoIntercorrente)}
          {formatForm("Qual o critério de seleção de leiloeiros e realização de leilões unificados (art. 256 da CNCR)?", t8CriterioDeSelecaoDosLeiloeiros)}
          {formatForm("Quantos leilões ocorreram nos últimos 12 meses?", t8QuantidadeDeLeiloes)}
          {formatForm("Há leilões designados?", t8LeiloesDesignados)}
        </>
      )}
      <h2 style={{ width: '100%' }}>9. Materiais Acautelados na Unidade</h2>
      {formatForm("Indicar a quantidade de materiais (bens e documentos) acautelados e apreendidos na unidade (separadamente)", t9QuantidadeDeMateriaisAcautelados)}
      {formatForm("Indicar a quantidade de processos com bens acautelados/apreendidos na unidade", t9QuantidadeDeProcessosComBensAcautelados)}
      {formatForm("Todos os bens acautelados apresentam exata correspondência com os termos de acautelamento mantidos pela Secretaria?", t9BensAcauteladosCorrespondemComTermos)}
      {formatForm("Dentre os bens acautelados/apreendidos na unidade, informar (i) quais possuem conteúdo econômico passível de perdimento ou expropriação; (ii) se há dinheiro em espécie, títulos de crédito, joias acauteladas ou moeda falsa; (iii) se a moeda falsa está devidamente identificada; e (iv) qual a localização desses bens e a situação atual dos respectivos processos", t9DinheiroEmEspecieTitulosOuJoias)}
      {formatForm("Dentre os bens acautelados/apreendidos na unidade, informar quais estão cadastrados no SNGB, por se tratarem de bens alcançados pelo cumprimento de decisões judiciais (art. 1º da Resolução nº 483/2022 do CNJ)", t9BensCadastradosNoSNGB)}
      {formatForm("A unidade tem tido alguma dificuldade na utilização do SNGB?", t9DificuldadeNoUsoDoSNGB)}
      {formatForm("A unidade possuía registros ativos no SNBA na data da implementação do SNGB (Resolução nº 483/2022 do CNJ)?", t9RegistrosAtivosNoSNBA)}
      {formatForm("Em caso positivo, a migração manual dos registros do SNBA para o SNGB foi finalizada? Se não, quais são as medidas que estão sendo implementadas para que isso ocorra e qual é o cronograma (detalhado) para regularização total dos cadastros?", t9MigracaoDoSNBAParaSNGB)}
      {formatForm("A unidade possui cofre ou sala de acautelados e é examinada a regularidade dos bens ali guardados?", t9CofreOuSalaDeAcautelados)}
      {formatForm("Detalhar as providências adotadas para o acautelamento/apreensão de bens em geral", t9ProvidenciasAdotadasParaAcautelamento)}
      {formatForm("Detalhar as providências adotadas para alienação antecipada de bens, quando necessário", t9ProvidenciasDeAlienacaoAntecipada)}
      <h2 style={{ width: '100%' }}>10. Processos Físicos em carga ou retirados</h2>
      <div style={{ marginTop: '1rem', width: '100%' }}>
        <label style={{ display: 'block', fontWeight: 'bold' }}>
          <div>
            Há processos físicos com carga às partes ou retirados por auxiliares do juízo além do prazo legal?
          </div>
          <p style={{ fontWeight: 'bold' }}>{t10ProcessosFisicosComCarga === '1' ? 'Sim' : t10ProcessosFisicosComCarga === '2' ? 'Não' : 'Não se aplica'} </p>
        </label>
      </div>
      {formatForm("Identificar os processos extraviados, as datas da ocorrência e as providências", t10ProcessosExtraviados)}
      {formatForm("Identificar as ações de restauração de autos, no período do levantamento", t10AcoesDeRestauracao)}
      {!turmaRecursal && (
        <>
          <h2 style={{ width: '100%' }}>11. Audiências</h2>
          {formatForm("Número de audiências agendadas e realizadas (indicar separadamente para o juiz titular e para o juiz substituto)", t11NumeroDeAudienciasAgendadasERealizadas)}
          {formatForm("Como é feito o controle das audiências canceladas/remarcadas?", t11ControleDeAudienciasCanceladas)}
          {formatForm("É realizada audiência de conciliação em todos os casos possíveis de autocomposição (art. 334 do CPC)?", t11AudienciaDeConciliacao)}
          {formatForm("É realizado o acompanhamento do cumprimento da Meta 3 do CNJ pela unidade?", t11AcompanhamentoDaMeta3DoCNJ)}
          {formatForm("Qual o intervalo de tempo médio entre o despacho de designação da audiência e a realização do ato?", t11TempoMedioEntreDespachoDeDesignacaoEAudiencia)}
          {formatForm("A unidade utiliza o registro audiovisual de audiências nos termos dos artigos 136 e seguintes da CNCR?", t11RegistroVisualDeAudiencias)}
          {formatForm("Foi detectada alguma falha no registro audiovisual de audiências nos últimos 12 meses comprometendo seu conteúdo? Quais as falhas e quais as soluções adotadas para saná-las?", t11FalhasNoRegistroAudiovisualDeAudiencias)}
          {formatForm("Houve alguma audiência de custódia nos últimos 12 meses? Quantas? Em caso negativo, justifique. Em caso positivo, especifique eventuais problemas ou dificuldades", t11AudienciaDeCustodia)}
          {formatForm("Foi realizada alguma audiência de forma remota nos últimos dois anos? Em quais processos? (art. 4º, TRF2-PVC-2023/00002)", t11AudienciaRemota)}
        </>
      )}
      {turmaRecursal && (
        <>
          <h2 style={{ width: '100%' }}>11. Sessão de Julgamento/Audiências</h2>
          {formatForm("Número de sessões de julgamento agendadas e realizadas", t11NumeroDeSessoesDeJulgamentoAgendadasERealizadas)}
          {formatForm("Como é feito o controle da inclusão, adiamento e retirada de pauta de processos?", t11ControleDePauta)}
          {formatForm("Qual o intervalo de tempo médio entre o pedido de dia/inclusão em pauta e a realização da sessão de julgamento?", t11IntervaloDeTempo)}
          {formatForm("A unidade utiliza o registro audiovisual de sessões de julgamento?", t11RegistroVisualDeSessoesDeJulgamento)}
          {formatForm("Foi detectada alguma falha no registro audiovisual de sessões de julgamento nos últimos 12 meses comprometendo seu conteúdo? Quais as falhas e quais as soluções adotadas para saná-las?", t11FalhasNoRegistroAudiovisualDeSessoesDeJulgamento)}
          {formatForm("Foi realizada alguma audiência de forma remota nos últimos dois anos? Em quais processos? (art. 4º, TRF2-PVC-2023/00002)", t11AudienciaRemota)}
        </>
      )}
      <h2 style={{ width: '100%' }}>12. Cumprimento de determinações de inspeções e Correições Anteriores</h2>
      {formatForm("A unidade cumpriu todas as metas estabelecidas na inspeção anterior?", t12CumprimentoDasMetasDaInspecaoAnterior)}
      {formatForm("A unidade regularizou todas as pendências apontadas na última Correição ou Inspeção de Avaliação da Corregedoria?", t12RegularizacaoDasPendenciasDaUltimaCorreicao)}
      {formatForm("Em sendo negativa a resposta de algum dos itens acima, justificar o eventual não cumprimento", t12JustificativaDoNaoCumprimento)}
      <h2 style={{ width: '100%' }}>13. Boas práticas e dificuldades</h2>
      {formatForm(
        "Relacionar as boas práticas, eventuais dificuldades vivenciadas na unidade, bem como demandas e soluções propostas, inclusive quanto aos setores administrativos",
        t13JustificativaDoNaoCumprimento
      )}
    </div>
  </div>
}

export default function FormPreCorreicao() {
  return Model(Interview, document, { saveButton: true, pdfButton: false, pdfFileName: 'bpc-loas-pcd-mais-17' })
}