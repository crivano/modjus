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
      <p>### calcular automaticamente o total de servidores</p>
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
      <Frm.TextArea label="A unidade cumpriu todas as metas estabelecidas na inspeção anterior?" name="t12CumprimentoDasMetasDaInspecaoAnterior" width={12} />
      <Frm.TextArea label="A unidade regularizou todas as pendências apontadas na última Correição ou Inspeção de Avaliação da Corregedoria?" name="t12RegularizacaoDasPendenciasDaUltimaCorreicao" width={12} />
      <Frm.TextArea label="Em sendo negativa a resposta de algum dos itens acima, justificar o eventual não cumprimento" name="t12JustificativaDoNaoCumprimento" width={12} />

      <h2>13. Boas práticas e dificuldades</h2>
      <Frm.TextArea label="Relacionar as boas práticas, eventuais dificuldades vivenciadas na unidade, bem como demandas e soluções propostas, inclusive quanto aos setores administrativos " name="t12JustificativaDoNaoCumprimento" width={12} />

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
    t12RegularizacaoDasPendenciasDaUltimaCorreicao,
    t12JustificativaDoNaoCumprimento,
  } = Frm.data;
  return <div className="scrollableContainer">
    <div style={{ display: 'flex', flexWrap: 'wrap' }}>
      <h1 style={{ textAlign: 'center', width: '100%' }}>Relatório de Pré-correição Judicial</h1>
      <div style={{ marginTop: '1rem', width: '100%', maxWidth: '33.3333%' }}>
        <label style={{ display: 'block', fontWeight: 'bold' }}>
          <div>Número do Processo</div>
        </label>
        <p style={{ fontWeight: 'bold' }}>{numproc || "Não informado"}</p>
      </div>
      <div style={{ marginTop: '1rem', width: '100%', maxWidth: '33.3333%' }}>
        <label style={{ display: 'block', fontWeight: 'bold' }}>
          <div>Data de Abertura</div>
        </label>
        <p style={{ fontWeight: 'bold' }}>{dataAbertura || "Não informado"}</p>
      </div>
      <div style={{ marginTop: '1rem', width: '100%', maxWidth: '33.3333%' }}>
        <label style={{ display: 'block', fontWeight: 'bold' }}>
          <div>Data de Encerramento</div>
        </label>
        <p style={{ fontWeight: 'bold' }}>{dataEncerramento || "Não informado"}</p>
      </div>

      Período de levantamento: 12 meses anteriores
      Prazo de entrega: 10 (dez) dias antes do início da correição.
      Nas perguntas que não se insiram na competência da unidade, deve responder "não se aplica".

      <h2 style={{ width: '100%' }}>1. Informações da Unidade</h2>

      <div style={{ marginTop: '1rem', width: '100%', maxWidth: '33.3333%' }}>
        <label style={{ display: 'block', fontWeight: 'bold' }}>
          <div>Unidade</div>
        </label>
        <p style={{ fontWeight: 'bold' }}>{t1Unidade?.descricao || "Não informado"}</p>
      </div>
      <div style={{ marginTop: '1rem', width: '100%', maxWidth: '33.3333%' }}>
        <label style={{ display: 'block', fontWeight: 'bold' }}>
          <div>Data da Instalação</div>
        </label>
        <p style={{ fontWeight: 'bold' }}>{t1DataDaInstalacao || "Não informado"}</p>
      </div>

      <div style={{ marginTop: '1rem', width: '100%' }}>
        <label style={{ display: 'block', fontWeight: 'bold' }}>
          Competências (referir eventual alteração de competência ocorrida nos últimos 12 meses e respectivo ato normativo)
        </label>
        <p style={{ fontWeight: 'bold' }}>{t1Competencias || "Não informado"}</p>
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

      <div style={{ marginTop: '1rem', width: '100%' }}>
        <label style={{ display: 'block', fontWeight: 'bold' }}>Houve redistribuição de processos?</label>
        <p style={{ fontWeight: 'bold' }}>{t1RedistribuicaoDeProcessos || "Não informado"}</p>
      </div>

      <h2 style={{ width: '100%' }}>2. Magistrados</h2>
      <div style={{ marginTop: '1rem', width: '100%' }}>
        <label style={{ display: 'block', fontWeight: 'bold' }}>
          <div>Titular</div>
        </label>
        <p style={{ fontWeight: 'bold' }}>{t2Titular?.descricao || "Não informado"}</p>
      </div>
      <div style={{ marginTop: '1rem', width: '100%' }}>
        <label style={{ display: 'block', fontWeight: 'bold' }}>
          <div>Tempo de atuação na unidade</div>
        </label>
        <p style={{ fontWeight: 'bold' }}>{t2TitularTempoDeAtuacaoNaUnidade || "Não informado"}</p>
      </div>
      <div style={{ marginTop: '1rem', width: '100%' }}>
        <label style={{ display: 'block', fontWeight: 'bold' }}>
          <div>Afastamentos superiores a 15 dias nos últimos 12 meses, especificando o período e o fundamento</div>
        </label>
        <p style={{ fontWeight: 'bold' }}>{t2TitularAfastamentos || "Não informado"}</p>
      </div>
      <div style={{ marginTop: '1rem', width: '100%' }}>
        <label style={{ display: 'block', fontWeight: 'bold' }}>
          <div>Períodos de substituição, em férias, de outro magistrado</div>
        </label>
        <p style={{ fontWeight: 'bold' }}>{t2TitularSubstituicoes || "Não informado"}</p>
      </div>
      <div style={{ marginTop: '1rem', width: '100%' }}>
        <label style={{ display: 'block', fontWeight: 'bold' }}>
          <div>Qual a modalidade de trabalho adotada pelo Magistrado no Juízo? (art. 2º, TRF2-PVC-2023/00002)</div>
        </label>
        <p style={{ fontWeight: 'bold' }}>{t2TitularModalidadeTrabalho || "Não informado"}</p>
      </div>
      <div style={{ marginTop: '1rem', width: '100%' }}>
        <label style={{ display: 'block', fontWeight: 'bold' }}>
          <div>Como é realizado o atendimento aos advogados/procuradores? (art. 3º, TRF2-PVC-2023/00002)</div>
        </label>
        <p style={{ fontWeight: 'bold' }}>{t2TitularAtendimento || "Não informado"}</p>
      </div>
      {(!turmaRecursal && (jef || criminal || execucaoFiscal)) && (
        <>
          <div style={{ marginTop: '1rem', width: '100%' }}>
            <label style={{ display: 'block', fontWeight: 'bold' }}>
              <div>Substituto</div>
            </label>
            <p style={{ fontWeight: 'bold' }}>{t2Substituto?.descricao || "Não informado"}</p>
          </div>
          <div style={{ marginTop: '1rem', width: '100%' }}>
            <label style={{ display: 'block', fontWeight: 'bold' }}>
              <div>Tempo de atuação na unidade</div>
            </label>
            <p style={{ fontWeight: 'bold' }}>{t2SubstitutoTempoDeAtuacaoNaUnidade || "Não informado"}</p>
          </div>
          <div style={{ marginTop: '1rem', width: '100%' }}>
            <label style={{ display: 'block', fontWeight: 'bold' }}>
              <div>Afastamentos superiores a 15 dias nos últimos 12 meses, especificando o período e o fundamento</div>
            </label>
            <p style={{ fontWeight: 'bold' }}>{t2SubstitutoAfastamentos || "Não informado"}</p>
          </div>
          <div style={{ marginTop: '1rem', width: '100%' }}>
            <label style={{ display: 'block', fontWeight: 'bold' }}>
              <div>Períodos de substituição, em férias, de outro magistrado</div>
            </label>
            <p style={{ fontWeight: 'bold' }}>{t2SubstitutoSubstituicoes || "Não informado"}</p>
          </div>
          <div style={{ marginTop: '1rem', width: '100%' }}>
            <label style={{ display: 'block', fontWeight: 'bold' }}>
              <div>Qual a modalidade de trabalho adotada pelo Magistrado no Juízo? (art. 2º, TRF2-PVC-2023/00002)</div>
            </label>
            <p style={{ fontWeight: 'bold' }}>{t2SubstitutoModalidadeTrabalho || "Não informado"}</p>
          </div>
          <div style={{ marginTop: '1rem', width: '100%' }}>
            <label style={{ display: 'block', fontWeight: 'bold' }}>
              <div>Como é realizado o atendimento aos advogados/procuradores? (art. 3º, TRF2-PVC-2023/00002)</div>
            </label>
            <p style={{ fontWeight: 'bold' }}>{t2SubstitutoAtendimento || "Não informado"}</p>
          </div>
        </>
      )}

      <h2 style={{ width: '100%' }}>3. Auxílios</h2>
      <div style={{ marginTop: '1rem', width: '100%' }}>
        <label style={{ display: 'block', fontWeight: 'bold' }}>
          <div>Auxílios prestados e recebidos nos últimos 12 meses</div>
        </label>
        <p style={{ fontWeight: 'bold' }}>{t3Auxilios || "Não informado"}</p>
      </div>

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
      <div style={{ marginTop: '1rem', width: '100%' }}>
        <label style={{ display: 'block', fontWeight: 'bold' }}>
          <div>
            {/* ### calcular automaticamente o total de servidores */}
          </div>
        </label>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', width: '100%' }}>
        <div style={{ marginTop: '1rem', width: '100%', maxWidth: '16.6667%', padding: '0 0.5rem' }}>
          <label style={{ display: 'block', fontWeight: 'bold' }}>
            <div>
              Analistas Judiciários
            </div>
            <p style={{ fontWeight: 'bold' }}>{t4UltimaCorreicaoAnalistasJudiciarios || "Não informado"}</p>
          </label>
        </div>
        <div style={{ marginTop: '1rem', width: '100%', maxWidth: '16.6667%', padding: '0 0.5rem' }}>
          <label style={{ display: 'block', fontWeight: 'bold' }}>
            <div>
              Técnicos Judiciários
            </div>
            <p style={{ fontWeight: 'bold' }}>{t4UltimaCorreicaoTecnicosJudiciarios || "Não informado"}</p>
          </label>
        </div>
        <div style={{ marginTop: '1rem', width: '100%', maxWidth: '16.6667%', padding: '0 0.5rem' }}>
          <label style={{ display: 'block', fontWeight: 'bold' }}>
            <div>
              Técnicos Jud. de Segurança
            </div>
            <p style={{ fontWeight: 'bold' }}>{t4UltimaCorreicaoAnalistasJudiciariosDeSeguranca || "Não informado"}</p>
          </label>
        </div>
        <div style={{ marginTop: '1rem', width: '100%', maxWidth: '16.6667%', padding: '0 0.5rem' }}>
          <label style={{ display: 'block', fontWeight: 'bold' }}>
            <div>
              Requisitados ou outros
            </div>
            <p style={{ fontWeight: 'bold' }}>{t4UltimaCorreicaoRequisitadosOuOutros || "Não informado"}</p>
          </label>
        </div>
        <div style={{ marginTop: '1rem', width: '100%', maxWidth: '16.6667%', padding: '0 0.5rem' }}>
          <label style={{ display: 'block', fontWeight: 'bold' }}>
            <div>
              Total de servidores
            </div>
            <p style={{ fontWeight: 'bold' }}>{t4UltimaCorreicaoTotalDeServidores || "Não informado"}</p>
          </label>
        </div>
        <div style={{ marginTop: '1rem', width: '100%', maxWidth: '16.6667%', padding: '0 0.5rem' }}>
          <label style={{ display: 'block', fontWeight: 'bold' }}>
            <div>
              Quadro Previsto
            </div>
            <p style={{ fontWeight: 'bold' }}>{t4UltimaCorreicaoQuadroPrevisto || "Não informado"}</p>
          </label>
        </div>
      </div>

      <h2 style={{ width: '100%' }}>Atualmente</h2>

      <div style={{ display: 'flex', flexWrap: 'wrap', width: '100%' }}>
        <div style={{ marginTop: '1rem', width: '100%', maxWidth: '16.6667%', padding: '0 0.5rem', padding: '0 0.5rem' }}>
          <label style={{ display: 'block', fontWeight: 'bold' }}>
            <div>
              Analistas Judiciários
            </div>
            <p style={{ fontWeight: 'bold' }}>{t4AtualmenteAnalistasJudiciarios || "Não informado"}</p>
          </label>
        </div>
        <div style={{ marginTop: '1rem', width: '100%', maxWidth: '16.6667%', padding: '0 0.5rem' }}>
          <label style={{ display: 'block', fontWeight: 'bold' }}>
            <div>
              Técnicos Judiciários
            </div>
            <p style={{ fontWeight: 'bold' }}>{t4AtualmenteTecnicosJudiciarios || "Não informado"}</p>
          </label>
        </div>
        <div style={{ marginTop: '1rem', width: '100%', maxWidth: '16.6667%', padding: '0 0.5rem' }}>
          <label style={{ display: 'block', fontWeight: 'bold' }}>
            <div>
              Técnicos Jud. de Segurança
            </div>
            <p style={{ fontWeight: 'bold' }}>{t4AtualmenteAnalistasJudiciariosDeSeguranca || "Não informado"}</p>
          </label>
        </div>
        <div style={{ marginTop: '1rem', width: '100%', maxWidth: '16.6667%', padding: '0 0.5rem' }}>
          <label style={{ display: 'block', fontWeight: 'bold' }}>
            <div>
              Requisitados ou outros
            </div>
            <p style={{ fontWeight: 'bold' }}>{t4AtualmenteRequisitadosOuOutros || "Não informado"}</p>
          </label>
        </div>
        <div style={{ marginTop: '1rem', width: '100%', maxWidth: '16.6667%', padding: '0 0.5rem' }}>
          <label style={{ display: 'block', fontWeight: 'bold' }}>
            <div>
              Total de servidores
            </div>
            <p style={{ fontWeight: 'bold' }}>{t4AtualmenteTotalDeServidores || "Não informado"}</p>
          </label>
        </div>
        <div style={{ marginTop: '1rem', width: '100%', maxWidth: '16.6667%', padding: '0 0.5rem' }}>
          <label style={{ display: 'block', fontWeight: 'bold' }}>
            <div>
              Quadro Previsto
            </div>
            <p style={{ fontWeight: 'bold' }}>{t4AtualmenteQuadroPrevisto || "Não informado"}</p>
          </label>
        </div>
      </div>


      <div style={{ marginTop: '1rem', width: '100%' }}>
        <label style={{ display: 'block', fontWeight: 'bold' }}>
          <div>
            Quantidade de servidores em teletrabalho em observância do limite máximo previsto no art. 5º da Resolução nº TRF2-RSP-2019/00046, alterada pela Resolução n.º TRF2-RSP-2023/00002 (30% do quadro permanente), bem como se é encaminhado o relatório semestral de avaliação, previsto no art. 13, III, da referida Resolução
          </div>
          <p style={{ fontWeight: 'bold' }}>{t4QuantidadeDeServidoresEmTeletrabalho || "Não informado"}</p>
        </label>
      </div>
      <div style={{ marginTop: '1rem', width: '100%' }}>
        {
          Frm.data.t4ServidoresEmTeletrabalho?.map((servidor: { nome: any; periodo: any; dataEnvio: any; numero: any }, i: number) => (
            <div key={i} style={{ display: 'flex', flexWrap: 'wrap' }}>
              <div style={{ marginTop: '1rem', width: '100%', maxWidth: '25%' }}>
                <label style={{ display: 'block', fontWeight: 'bold' }}>
                  <div>
                    Servidor {i + 1}
                  </div>
                  <p style={{ fontWeight: 'bold' }}>{servidor.nome || "Não informado"}</p>
                </label>
              </div>
              <div style={{ marginTop: '1rem', width: '100%', maxWidth: '25%' }}>
                <label style={{ display: 'block', fontWeight: 'bold' }}>
                  <div>
                    Período
                  </div>
                  <p style={{ fontWeight: 'bold' }}>{servidor.periodo || "Não informado"}</p>
                </label>
              </div>
              <div style={{ marginTop: '1rem', width: '100%', maxWidth: '25%' }}>
                <label style={{ display: 'block', fontWeight: 'bold' }}>
                  <div>
                    Data de Envio do Relatório
                  </div>
                  <p style={{ fontWeight: 'bold' }}>{servidor.dataEnvio || "Não informado"}</p>
                </label>
              </div>
              <div style={{ marginTop: '1rem', width: '100%', maxWidth: '25%' }}>
                <label style={{ display: 'block', fontWeight: 'bold' }}>
                  <div>
                    Número
                  </div>
                  <p style={{ fontWeight: 'bold' }}>{servidor.numero || "Não informado"}</p>
                </label>
              </div>
              <div style={{ marginTop: '1rem', width: '100%' }}>
                <label style={{ display: 'block', fontWeight: 'bold' }}>
                  <div>Nome dos servidores lotados na unidade e respectivos cargos efetivos (analistas, técnicos, etc.),
                    bem como se exercem cargo em comissão / função comissionada, exercício de chefia, direção ou assessoramento
                  </div>
                </label>
                <p style={{ fontWeight: 'bold' }}>{t4NomeDosServidoresLotadosCargosEChefias || "Não informado"}</p>
              </div>
              <div style={{ marginTop: '1rem', width: '100%' }}>
                <label style={{ display: 'block', fontWeight: 'bold' }}>
                  <div>Nome e número de servidores sem vínculo com o serviço público</div>
                </label>
                <p style={{ fontWeight: 'bold' }}>{t4NomeENumeroDeServidoresSemVinculo || "Não informado"}</p>
              </div>
              <div style={{ marginTop: '1rem', width: '100%' }}>
                <label style={{ display: 'block', fontWeight: 'bold' }}>
                  <div>Nome e número de servidores em auxílio (cedidos por outros setores) ou requisitados (com vínculo com o serviço público):</div>
                </label>
                <p style={{ fontWeight: 'bold' }}>{t4NomeENumeroDeServidoresEmAuxilioOuRequisitados || "Não informado"}</p>
              </div>

              {!Frm.data.turmaRecursal &&
                <div style={{ marginTop: '1rem', width: '100%' }}>
                  <label style={{ display: 'block', fontWeight: 'bold' }}>
                    <div>Quantos e quais servidores exercem função de assessoria ao Juiz Federal Substituto?
                      Quantos e quais servidores exercem função de assessoria ao Juiz Federal titular?
                    </div>
                  </label>
                  <p style={{ fontWeight: 'bold' }}>{t4QuantidadeDeServidoresAssessorandoJuizSubstitutoETitular || "Não informado"}</p>
                </div>
              }
            </div>
          ))}
      </div>

      {/* 5. Estagiários */}
      <h2 style={{ width: '100%' }}>5. Estagiários</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        <div style={{ marginTop: '1rem', width: '100%', maxWidth: '25%' }}>
          <label style={{ display: 'block', fontWeight: 'bold' }}>
            <div>Número de estagiários de nível superior previstos para unidade</div>
            <p style={{ fontWeight: 'bold' }}>{t5NumeroPrevistoDeEstagiariosDeNivelSuperior || "Não informado"}</p>
          </label>
        </div>
        <div style={{ marginTop: '1rem', width: '100%', maxWidth: '25%' }}>
          <label style={{ display: 'block', fontWeight: 'bold' }}>
            <div>Número de estagiários de nível médio previstos para unidade</div>
            <p style={{ fontWeight: 'bold' }}>{t5NumeroPrevistoDeEstagiariosDeNivelMedio || "Não informado"}</p>
          </label>
        </div>
        <div style={{ marginTop: '1rem', width: '100%', maxWidth: '25%' }}>
          <label style={{ display: 'block', fontWeight: 'bold' }}>
            <div>Número de estagiários de nível superior lotados na unidade</div>
            <p style={{ fontWeight: 'bold' }}>{t5NumeroEfetivoDeEstagiariosDeNivelSuperior || "Não informado"}</p>
          </label>
        </div>
        <div style={{ marginTop: '1rem', width: '100%', maxWidth: '25%' }}>
          <label style={{ display: 'block', fontWeight: 'bold' }}>
            <div>Número de estagiários de nível médio lotados na unidade</div>
            <p style={{ fontWeight: 'bold' }}>{t5NumeroEfetivoDeEstagiariosDeNivelMedio || "Não informado"}</p>
          </label>
        </div>
      </div>

      <h2 style={{ width: '100%' }}>6. Instalações Físicas e Infraestrutura</h2>
      <div style={{ marginTop: '1rem', width: '100%' }}>
        <label style={{ display: 'block', fontWeight: 'bold' }}>
          <div>
            Relatar a situação das instalações físicas do setor (mobiliário, ar condicionado, etc.) e dos equipamentos de informática, informando eventuais problemas, dificuldades, bem como destacando se há mobiliário e/ou equipamentos de informática danificados/defeituosos sem previsão de reparo ou substituição já requerida à DIRFO
          </div>
          <p style={{ fontWeight: 'bold' }}>{t6InstalacoesFisicasEInfraestrutura || "Não informado"}</p>
        </label>
      </div>

      <h2 style={{ width: '100%' }}>7. Livros e Pastas</h2>
      <div style={{ marginTop: '1rem', width: '100%' }}>
        <label style={{ display: 'block', fontWeight: 'bold' }}>
          <div>
            Quais os livros e pastas utilizados pela Vara Federal, Juizado Especial ou Turma Recursal?
          </div>
          <p style={{ fontWeight: 'bold' }}>{t7LivrosEPastasUtilizados || "Não informado"}</p>
        </label>
      </div>
      <div style={{ marginTop: '1rem', width: '100%' }}>
        <label style={{ display: 'block', fontWeight: 'bold' }}>
          <div>
            Algum livro ou pasta em papel foi substituído por registro informatizado (art. 132 da CNCR)? Quais?
          </div>
          <p style={{ fontWeight: 'bold' }}>{t7LivrosEPastasSubstituidos || "Não informado"}</p>
        </label>
      </div>
      <div style={{ marginTop: '1rem', width: '100%' }}>
        <label style={{ display: 'block', fontWeight: 'bold' }}>
          <div>
            Informar quais as Pastas/Livros Eletrônicos de controle obrigatório existentes no Siga, com a descrição dos expedientes que lhes corresponda
          </div>
          <p style={{ fontWeight: 'bold' }}>{t7LivrosEPastasExistentesNoSiga || "Não informado"}</p>
        </label>
      </div>

      <h2 style={{ width: '100%' }}>8. Organização da Unidade e Setorização (todas as unidades)</h2>
      <div style={{ marginTop: '1rem', width: '100%' }}>
        <label style={{ display: 'block', fontWeight: 'bold' }}>
          <div>
            Detalhar, sucintamente, a forma de organização da unidade, destacando as atribuições do Diretor (a) de Secretaria; Supervisores; e demais servidores
          </div>
          <p style={{ fontWeight: 'bold' }}>{t8FormaDeOrganizacao || "Não informado"}</p>
        </label>
      </div>
      <div style={{ marginTop: '1rem', width: '100%' }}>
        <label style={{ display: 'block', fontWeight: 'bold' }}>
          <div>
            Informar, sucintamente, sobre a sistemática de planejamento das atividades da unidade e a existência de metas internas, detalhando conforme o caso
          </div>
          <p style={{ fontWeight: 'bold' }}>{t8SistematicaDePlanejamento || "Não informado"}</p>
        </label>
      </div>
      <div style={{ marginTop: '1rem', width: '100%' }}>
        <label style={{ display: 'block', fontWeight: 'bold' }}>
          <div>
            Informar, sucintamente, sobre a sistemática de avaliação periódica dos resultados das atividades da unidade
          </div>
          <p style={{ fontWeight: 'bold' }}>{t8SistematicaDeAvaliacao || "Não informado"}</p>
        </label>
      </div>
      <div style={{ marginTop: '1rem', width: '100%' }}>
        <label style={{ display: 'block', fontWeight: 'bold' }}>
          <div>
            Detalhar o tratamento dado aos processos incluídos nas Metas do CNJ, feitos com prioridade legal e demais ações elencadas no art. 12, parágrafo único, da Resolução nº 496/2006 do CJF
          </div>
          <p style={{ fontWeight: 'bold' }}>{t8ProcessosIncluidosNasMetasDoCNJ || "Não informado"}</p>
        </label>
      </div>
      <div style={{ marginTop: '1rem', width: '100%' }}>
        <label style={{ display: 'block', fontWeight: 'bold' }}>
          <div>
            Critérios de julgamento para os demais feitos
          </div>
          <p style={{ fontWeight: 'bold' }}>{t8CriteriosDeJulgamentoParaOsDemaisFeitos || "Não informado"}</p>
        </label>
      </div>
      <div style={{ marginTop: '1rem', width: '100%' }}>
        <label style={{ display: 'block', fontWeight: 'bold' }}>
          <div>
            Informar, sucintamente, como ocorre o fluxo dos processos entre a secretaria e o gabinete, a abertura da conclusão e a forma de controle do prazo para prolação de sentenças
          </div>
          <p style={{ fontWeight: 'bold' }}>{t8FluxoDeInformacoes || "Não informado"}</p>
        </label>
      </div>
      {!turmaRecursal && (
        <div style={{ marginTop: '1rem', width: '100%' }}>
          <label style={{ display: 'block', fontWeight: 'bold' }}>
            <div>
              Número de processos com pedidos urgentes (liminares, antecipações de tutela) pendentes de análise
            </div>
            <p style={{ fontWeight: 'bold' }}>{t8NumeroDeProcessosComPedidosUrgentes || "Não informado"}</p>
          </label>
        </div>
      )}
      <div style={{ marginTop: '1rem', width: '100%' }}>
        <label style={{ display: 'block', fontWeight: 'bold' }}>
          <div>
            Há utilização de automação de localizadores (e-Proc) na unidade?
          </div>
          <p style={{ fontWeight: 'bold' }}>{t8UtilizacaoDeAutomacaoDosLocalizadores || "Não informado"}</p>
        </label>
      </div>
      <div style={{ marginTop: '1rem', width: '100%' }}>
        <label style={{ display: 'block', fontWeight: 'bold' }}>
          <div>
            Como é feito o controle dos prazos de suspensão dos processos? Há inserção em local (físico ou virtual) específico, com a anotação do motivo de suspensão e a data do término?
          </div>
          <p style={{ fontWeight: 'bold' }}>{t8PrazosDeSuspensao || "Não informado"}</p>
        </label>
      </div>
      <div style={{ marginTop: '1rem', width: '100%' }}>
        <label style={{ display: 'block', fontWeight: 'bold' }}>
          <div>
            A unidade verifica a pertinência do assunto cadastrado no processo quando recebe novos processos, garantindo que todos os processos do acervo possuam assunto folha (último nível) ou de nível 3 ou mais, respeitando a padronização da terminologia de assuntos processuais imposta pelo CNJ?
          </div>
          <p style={{ fontWeight: 'bold' }}>{t8RespeitoAPadronizacaoDoCNJ || "Não informado"}</p>
        </label>
      </div>
      <div style={{ marginTop: '1rem', width: '100%' }}>
        <label style={{ display: 'block', fontWeight: 'bold' }}>
          <div>
            A unidade possui algum processo em que não há assunto correspondente disponível na Tabela Unificada? A situação foi informada à SAJ ou CORETAB?
          </div>
          <p style={{ fontWeight: 'bold' }}>{t8ProcessoSemAssuntoCorrespondente || "Não informado"}</p>
        </label>
      </div>
      {jef && (
        <div style={{ marginTop: '1rem', width: '100%' }}>
          <label style={{ display: 'block', fontWeight: 'bold' }}>
            <div>
              O JEF se utiliza do WhatsApp ou de outro aplicativo de mensagens para intimação das partes, nos termos dos artigos 158 e seguintes da CNCR?
            </div>
            <p style={{ fontWeight: 'bold' }}>{t8AplicativoDeMensagens || "Não informado"}</p>
          </label>
        </div>
      )}
      {criminal && (
        <>
          <h5>Criminal</h5>
          <div style={{ marginTop: '1rem', width: '100%' }}>
            <label style={{ display: 'block', fontWeight: 'bold' }}>
              <div>
                Há quantos processos com réus presos? Apresente a listagem
              </div>
              <p style={{ fontWeight: 'bold' }}>{t8NumeroDeProcessosComReusPresos || "Não informado"}</p>
            </label>
          </div>
          <div style={{ marginTop: '1rem', width: '100%' }}>
            <label style={{ display: 'block', fontWeight: 'bold' }}>
              <div>
                Há anotação na autuação de réus presos?
              </div>
              <p style={{ fontWeight: 'bold' }}>{t8AnotacaoNaAutuacaoDeReusPresos || "Não informado"}</p>
            </label>
          </div>
          <div style={{ marginTop: '1rem', width: '100%' }}>
            <label style={{ display: 'block', fontWeight: 'bold' }}>
              <div>
                É dada prioridade de tramitação nos processos com réus presos?
              </div>
              <p style={{ fontWeight: 'bold' }}>{t8PrioridadeDeTramitacaoNosProcessosDeReusPrezos || "Não informado"}</p>
            </label>
          </div>
          <div style={{ marginTop: '1rem', width: '100%' }}>
            <label style={{ display: 'block', fontWeight: 'bold' }}>
              <div>
                Há atualização imediata da situação da parte no e-Proc (solto, preso, PRD não convertida, condenado, sursis não revogado, condenado preso, etc.)?
              </div>
              <p style={{ fontWeight: 'bold' }}>{t8AtualizacaoImediataSituacaoDaParte || "Não informado"}</p>
            </label>
          </div>
          <div style={{ marginTop: '1rem', width: '100%' }}>
            <label style={{ display: 'block', fontWeight: 'bold' }}>
              <div>
                Detalhar a forma de controle da incidência da prescrição penal, inclusive nas execuções penais, se for o caso (arts. 236 e seguintes da CNCR e Resolução 112 de abril/2010 do CNJ)
              </div>
              <p style={{ fontWeight: 'bold' }}>{t8ControleDaIncidenciaDaPrescricaoPenal || "Não informado"}</p>
            </label>
          </div>
          <div style={{ marginTop: '1rem', width: '100%' }}>
            <label style={{ display: 'block', fontWeight: 'bold' }}>
              <div>
                São registrados no e-Proc os anexos físicos não suportados pelo referido sistema?
              </div>
              <p style={{ fontWeight: 'bold' }}>{t8AnexosFisicosNoEproc || "Não informado"}</p>
            </label>
          </div>
          <div style={{ marginTop: '1rem', width: '100%' }}>
            <label style={{ display: 'block', fontWeight: 'bold' }}>
              <div>
                O resultado das audiências de custódia é/era cadastrado no Sistema de Audiência de Custódia (SISTAC) enquanto se aguarda/aguardava a possibilidade de cadastro no BNMP 3.0?
              </div>
              <p style={{ fontWeight: 'bold' }}>{t8SistemaDeAudienciaDeCustodia || "Não informado"}</p>
            </label>
          </div>
          <div style={{ marginTop: '1rem', width: '100%' }}>
            <label style={{ display: 'block', fontWeight: 'bold' }}>
              <div>
                O BNMP 2.0 está devidamente saneado na unidade, para futura utilização do BNMP 3.0, a partir de maio de 2024?
              </div>
              <p style={{ fontWeight: 'bold' }}>{t8SaneamentoBNMP2 || "Não informado"}</p>
            </label>
          </div>
          <div style={{ marginTop: '1rem', width: '100%' }}>
            <label style={{ display: 'block', fontWeight: 'bold' }}>
              <div>
                Em caso de resposta negativa, quais estão sendo as medidas implementadas para que isso ocorra até 02 de maio de 2024, prazo estabelecido pelo CNJ no Ofício Circular n. 44/DMF?
              </div>
              <p style={{ fontWeight: 'bold' }}>{t8MedidasSaneamentoBNMP2 || "Não informado"}</p>
            </label>
          </div>
          <div style={{ marginTop: '1rem', width: '100%' }}>
            <label style={{ display: 'block', fontWeight: 'bold' }}>
              <div>
                Quais foram os processos em que foram expedidos alvarás de soltura nos 12 meses anteriores à correição e quais são os números desses alvarás? Ressalta-se que é obrigatório e de suma importância que o BNMP, atualmente em sua versão 2.0, e futuramente em sua versão 3.0, seja utilizado para emissão e gestão de todas as peças de que trata a Resolução n. 417/2021 do CNJ
              </div>
              <p style={{ fontWeight: 'bold' }}>{t8ProcessosComAlvarasDeSoltura || "Não informado"}</p>
            </label>
          </div>
          <div style={{ marginTop: '1rem', width: '100%' }}>
            <label style={{ display: 'block', fontWeight: 'bold' }}>
              <div>
                Qual é o procedimento que a unidade adota relativamente às armas e munições apreendidas e o respectivo envio ao Exército?
              </div>
              <p style={{ fontWeight: 'bold' }}>{t8ProcedimentoParaArmasEMunicoes || "Não informado"}</p>
            </label>
          </div>
          <div style={{ marginTop: '1rem', width: '100%' }}>
            <label style={{ display: 'block', fontWeight: 'bold' }}>
              <div>
                Apresentar a listagem de entidades cadastradas para prestação de serviços/prestação pecuniária e informar o método de seleção dessas entidades
              </div>
              <p style={{ fontWeight: 'bold' }}>{t8EntidadesParaServicosOuPrestacaoPecuniaria || "Não informado"}</p>
            </label>
          </div>
          <div style={{ marginTop: '1rem', width: '100%' }}>
            <label style={{ display: 'block', fontWeight: 'bold' }}>
              <div>
                Existe algum local virtual para processos aguardando expedição de carta de execução de sentença penal?
              </div>
              <p style={{ fontWeight: 'bold' }}>{t8LocalVirtualCESP || "Não informado"}</p>
            </label>
          </div>
        </>
      )}
      {execucaoFiscal && (
        <>
          <h5>Execução Fiscal</h5>
          <div style={{ marginTop: '1rem', width: '100%' }}>
            <label style={{ display: 'block', fontWeight: 'bold' }}>
              <div>
                Quais as execuções fiscais consideradas como sendo de grandes devedores pela unidade (critério utilizado pela Vara)?
              </div>
              <p style={{ fontWeight: 'bold' }}>{t8ProcessosComGrandesDevedores || "Não informado"}</p>
            </label>
          </div>
          <div style={{ marginTop: '1rem', width: '100%' }}>
            <label style={{ display: 'block', fontWeight: 'bold' }}>
              <div>
                Informar, sucintamente, o tratamento dado às execuções fiscais de valores expressivos em juízo, bem como se são observados os procedimentos previstos no art. 258 da CNCR.
              </div>
              <p style={{ fontWeight: 'bold' }}>{t8TratamentoDadoAosValoresExpressivos || "Não informado"}</p>
            </label>
          </div>
          <div style={{ marginTop: '1rem', width: '100%' }}>
            <label style={{ display: 'block', fontWeight: 'bold' }}>
              <div>
                Detalhar a forma de controle da incidência da prescrição intercorrente
              </div>
              <p style={{ fontWeight: 'bold' }}>{t8ControleDaPrescricaoIntercorrente || "Não informado"}</p>
            </label>
          </div>
          <div style={{ marginTop: '1rem', width: '100%' }}>
            <label style={{ display: 'block', fontWeight: 'bold' }}>
              <div>
                Qual o critério de seleção de leiloeiros e realização de leilões unificados (art. 256 da CNCR)?
              </div>
              <p style={{ fontWeight: 'bold' }}>{t8CriterioDeSelecaoDosLeiloeiros || "Não informado"}</p>
            </label>
          </div>
          <div style={{ marginTop: '1rem', width: '100%' }}>
            <label style={{ display: 'block', fontWeight: 'bold' }}>
              <div>
                Quantos leilões ocorreram nos últimos 12 meses?
              </div>
              <p style={{ fontWeight: 'bold' }}>{t8QuantidadeDeLeiloes || "Não informado"}</p>
            </label>
          </div>
          <div style={{ marginTop: '1rem', width: '100%' }}>
            <label style={{ display: 'block', fontWeight: 'bold' }}>
              <div>
                Há leilões designados?
              </div>
              <p style={{ fontWeight: 'bold' }}>{t8LeiloesDesignados || "Não informado"}</p>
            </label>
          </div>
        </>
      )}
      <h2 style={{ width: '100%' }}>9. Materiais Acautelados na Unidade</h2>
      <div style={{ marginTop: '1rem', width: '100%' }}>
        <label style={{ display: 'block', fontWeight: 'bold' }}>
          <div>
            Indicar a quantidade de materiais (bens e documentos) acautelados e apreendidos na unidade (separadamente)
          </div>
          <p style={{ fontWeight: 'bold' }}>{t9QuantidadeDeMateriaisAcautelados || "Não informado"}</p>
        </label>
      </div>
      <div style={{ marginTop: '1rem', width: '100%' }}>
        <label style={{ display: 'block', fontWeight: 'bold' }}>
          <div>
            Indicar a quantidade de processos com bens acautelados/apreendidos na unidade
          </div>
          <p style={{ fontWeight: 'bold' }}>{t9QuantidadeDeProcessosComBensAcautelados || "Não informado"}</p>
        </label>
      </div>
      <div style={{ marginTop: '1rem', width: '100%' }}>
        <label style={{ display: 'block', fontWeight: 'bold' }}>
          <div>
            Todos os bens acautelados apresentam exata correspondência com os termos de acautelamento mantidos pela Secretaria?
          </div>
          <p style={{ fontWeight: 'bold' }}>{t9BensAcauteladosCorrespondemComTermos || "Não informado"}</p>
        </label>
      </div>
      <div style={{ marginTop: '1rem', width: '100%' }}>
        <label style={{ display: 'block', fontWeight: 'bold' }}>
          <div>
            Dentre os bens acautelados/apreendidos na unidade, informar (i) quais possuem conteúdo econômico passível de perdimento ou expropriação; (ii) se há dinheiro em espécie, títulos de crédito, joias acauteladas ou moeda falsa; (iii) se a moeda falsa está devidamente identificada; e (iv) qual a localização desses bens e a situação atual dos respectivos processos
          </div>
          <p style={{ fontWeight: 'bold' }}>{t9DinheiroEmEspecieTitulosOuJoias || "Não informado"}</p>
        </label>
      </div>
      <div style={{ marginTop: '1rem', width: '100%' }}>
        <label style={{ display: 'block', fontWeight: 'bold' }}>
          <div>
            Dentre os bens acautelados/apreendidos na unidade, informar quais estão cadastrados no SNGB, por se tratarem de bens alcançados pelo cumprimento de decisões judiciais (art. 1º da Resolução nº 483/2022 do CNJ)
          </div>
          <p style={{ fontWeight: 'bold' }}>{t9BensCadastradosNoSNGB || "Não informado"}</p>
        </label>
      </div>

      <div style={{ marginTop: '1rem', width: '100%' }}>
        <label style={{ display: 'block', fontWeight: 'bold' }}>
          <div>
            A unidade tem tido alguma dificuldade na utilização do SNGB?
          </div>
          <p style={{ fontWeight: 'bold' }}>{t9DificuldadeNoUsoDoSNGB || "Não informado"}</p>
        </label>
      </div>
      <div style={{ marginTop: '1rem', width: '100%' }}>
        <label style={{ display: 'block', fontWeight: 'bold' }}>
          <div>
            A unidade possuía registros ativos no SNBA na data da implementação do SNGB (Resolução nº 483/2022 do CNJ)?
          </div>
          <p style={{ fontWeight: 'bold' }}>{t9RegistrosAtivosNoSNBA || "Não informado"}</p>
        </label>
      </div>
      <div style={{ marginTop: '1rem', width: '100%' }}>
        <label style={{ display: 'block', fontWeight: 'bold' }}>
          <div>
            Em caso positivo, a migração manual dos registros do SNBA para o SNGB foi finalizada? Se não, quais são as medidas que estão sendo implementadas para que isso ocorra e qual é o cronograma (detalhado) para regularização total dos cadastros?
          </div>
          <p style={{ fontWeight: 'bold' }}>{t9MigracaoDoSNBAParaSNGB || "Não informado"}</p>
        </label>
      </div>
      <div style={{ marginTop: '1rem', width: '100%' }}>
        <label style={{ display: 'block', fontWeight: 'bold' }}>
          <div>
            A unidade possui cofre ou sala de acautelados e é examinada a regularidade dos bens ali guardados?
          </div>
          <p style={{ fontWeight: 'bold' }}>{t9CofreOuSalaDeAcautelados || "Não informado"}</p>
        </label>
      </div>
      <div style={{ marginTop: '1rem', width: '100%' }}>
        <label style={{ display: 'block', fontWeight: 'bold' }}>
          <div>
            Detalhar as providências adotadas para o acautelamento/apreensão de bens em geral
          </div>
          <p style={{ fontWeight: 'bold' }}>{t9ProvidenciasAdotadasParaAcautelamento || "Não informado"}</p>
        </label>
      </div>
      <div style={{ marginTop: '1rem', width: '100%' }}>
        <label style={{ display: 'block', fontWeight: 'bold' }}>
          <div>
            Detalhar as providências adotadas para alienação antecipada de bens, quando necessário
          </div>
          <p style={{ fontWeight: 'bold' }}>{t9ProvidenciasDeAlienacaoAntecipada || "Não informado"}</p>
        </label>
      </div>
      <h2 style={{ width: '100%' }}>10. Processos Físicos em carga ou retirados</h2>
      <div style={{ marginTop: '1rem', width: '100%' }}>
        <label style={{ display: 'block', fontWeight: 'bold' }}>
          <div>
            Há processos físicos com carga às partes ou retirados por auxiliares do juízo além do prazo legal?
          </div>
          <p style={{ fontWeight: 'bold' }}>{t10ProcessosFisicosComCarga === '1' ? 'Sim' : t10ProcessosFisicosComCarga === '2' ? 'Não' : 'Não informado'} </p>
        </label>
      </div>
      <div style={{ marginTop: '1rem', width: '100%' }}>
        <label style={{ display: 'block', fontWeight: 'bold' }}>
          <div>
            Identificar os processos extraviados, as datas da ocorrência e as providências
          </div>
          <p style={{ fontWeight: 'bold' }}>{t10ProcessosExtraviados || "Não informado"}</p>
        </label>
      </div>
      <div style={{ marginTop: '1rem', width: '100%' }}>
        <label style={{ display: 'block', fontWeight: 'bold' }}>
          <div>
            Identificar as ações de restauração de autos, no período do levantamento
          </div>
          <p style={{ fontWeight: 'bold' }}>{t10AcoesDeRestauracao || "Não informado"}</p>
        </label>
      </div>
      {!turmaRecursal && (
        <>
          <h2 style={{ width: '100%' }}>11. Audiências</h2>
          <div style={{ marginTop: '1rem', width: '100%' }}>
            <label style={{ display: 'block', fontWeight: 'bold' }}>
              <div>
                Número de audiências agendadas e realizadas (indicar separadamente para o juiz titular e para o juiz substituto)
              </div>
              <p style={{ fontWeight: 'bold' }}>{t11NumeroDeAudienciasAgendadasERealizadas || "Não informado"}</p>
            </label>
          </div>
          <div style={{ marginTop: '1rem', width: '100%' }}>
            <label style={{ display: 'block', fontWeight: 'bold' }}>
              <div>
                Como é feito o controle das audiências canceladas/remarcadas?
              </div>
              <p style={{ fontWeight: 'bold' }}>{t11ControleDeAudienciasCanceladas || "Não informado"}</p>
            </label>
          </div>
          <div style={{ marginTop: '1rem', width: '100%' }}>
            <label style={{ display: 'block', fontWeight: 'bold' }}>
              <div>
                É realizada audiência de conciliação em todos os casos possíveis de autocomposição (art. 334 do CPC)?
              </div>
              <p style={{ fontWeight: 'bold' }}>{t11AudienciaDeConciliacao || "Não informado"}</p>
            </label>
          </div>
          <div style={{ marginTop: '1rem', width: '100%' }}>
            <label style={{ display: 'block', fontWeight: 'bold' }}>
              <div>
                É realizado o acompanhamento do cumprimento da Meta 3 do CNJ pela unidade?
              </div>
              <p style={{ fontWeight: 'bold' }}>{t11AcompanhamentoDaMeta3DoCNJ || "Não informado"}</p>
            </label>
          </div>
          <div style={{ marginTop: '1rem', width: '100%' }}>
            <label style={{ display: 'block', fontWeight: 'bold' }}>
              <div>
                Qual o intervalo de tempo médio entre o despacho de designação da audiência e a realização do ato?
              </div>
              <p style={{ fontWeight: 'bold' }}>{t11TempoMedioEntreDespachoDeDesignacaoEAudiencia || "Não informado"}</p>
            </label>
          </div>
          <div style={{ marginTop: '1rem', width: '100%' }}>
            <label style={{ display: 'block', fontWeight: 'bold' }}>
              <div>
                A unidade utiliza o registro audiovisual de audiências nos termos dos artigos 136 e seguintes da CNCR?
              </div>
              <p style={{ fontWeight: 'bold' }}>{t11RegistroVisualDeAudiencias || "Não informado"}</p>
            </label>
          </div>
          <div style={{ marginTop: '1rem', width: '100%' }}>
            <label style={{ display: 'block', fontWeight: 'bold' }}>
              <div>
                Foi detectada alguma falha no registro audiovisual de audiências nos últimos 12 meses comprometendo seu conteúdo? Quais as falhas e quais as soluções adotadas para saná-las?
              </div>
              <p style={{ fontWeight: 'bold' }}>{t11FalhasNoRegistroAudiovisualDeAudiencias || "Não informado"}</p>
            </label>
          </div>
          <div style={{ marginTop: '1rem', width: '100%' }}>
            <label style={{ display: 'block', fontWeight: 'bold' }}>
              <div>
                Houve alguma audiência de custódia nos últimos 12 meses? Quantas? Em caso negativo, justifique. Em caso positivo, especifique eventuais problemas ou dificuldades
              </div>
              <p style={{ fontWeight: 'bold' }}>{t11AudienciaDeCustodia || "Não informado"}</p>
            </label>
          </div>
          <div style={{ marginTop: '1rem', width: '100%' }}>
            <label style={{ display: 'block', fontWeight: 'bold' }}>
              <div>
                Foi realizada alguma audiência de forma remota nos últimos dois anos? Em quais processos? (art. 4º, TRF2-PVC-2023/00002)
              </div>
              <p style={{ fontWeight: 'bold' }}>{t11AudienciaRemota || "Não informado"}</p>
            </label>
          </div>
        </>
      )}
      {turmaRecursal && (
        <>
          <h2 style={{ width: '100%' }}>11. Sessão de Julgamento/Audiências</h2>
          <div style={{ marginTop: '1rem', width: '100%' }}>
            <label style={{ display: 'block', fontWeight: 'bold' }}>
              <div>
                Número de sessões de julgamento agendadas e realizadas
              </div>
              <p style={{ fontWeight: 'bold' }}>{t11NumeroDeSessoesDeJulgamentoAgendadasERealizadas || "Não informado"}</p>
            </label>
          </div>
          <div style={{ marginTop: '1rem', width: '100%' }}>
            <label style={{ display: 'block', fontWeight: 'bold' }}>
              <div>
                Como é feito o controle da inclusão, adiamento e retirada de pauta de processos?
              </div>
              <p style={{ fontWeight: 'bold' }}>{t11ControleDePauta || "Não informado"}</p>
            </label>
          </div>
          <div style={{ marginTop: '1rem', width: '100%' }}>
            <label style={{ display: 'block', fontWeight: 'bold' }}>
              <div>
                Qual o intervalo de tempo médio entre o pedido de dia/inclusão em pauta e a realização da sessão de julgamento?
              </div>
              <p style={{ fontWeight: 'bold' }}>{t11IntervaloDeTempo || "Não informado"}</p>
            </label>
          </div>
          <div style={{ marginTop: '1rem', width: '100%' }}>
            <label style={{ display: 'block', fontWeight: 'bold' }}>
              <div>
                A unidade utiliza o registro audiovisual de sessões de julgamento?
              </div>
              <p style={{ fontWeight: 'bold' }}>{t11RegistroVisualDeSessoesDeJulgamento || "Não informado"}</p>
            </label>
          </div>
          <div style={{ marginTop: '1rem', width: '100%' }}>
            <label style={{ display: 'block', fontWeight: 'bold' }}>
              <div>
                Foi detectada alguma falha no registro audiovisual de sessões de julgamento nos últimos 12 meses comprometendo seu conteúdo? Quais as falhas e quais as soluções adotadas para saná-las?
              </div>
              <p style={{ fontWeight: 'bold' }}>{t11FalhasNoRegistroAudiovisualDeSessoesDeJulgamento || "Não informado"}</p>
            </label>
          </div>
          <div style={{ marginTop: '1rem', width: '100%' }}>
            <label style={{ display: 'block', fontWeight: 'bold' }}>
              <div>
                Foi realizada alguma audiência de forma remota nos últimos dois anos? Em quais processos? (art. 4º, TRF2-PVC-2023/00002)
              </div>
              <p style={{ fontWeight: 'bold' }}>{t11AudienciaRemota || "Não informado"}</p>
            </label>
          </div>
        </>
      )}
      <h2 style={{ width: '100%' }}>12. Cumprimento de determinações de inspeções e Correições Anteriores</h2>
      <div style={{ marginTop: '1rem', width: '100%' }}>
        <label style={{ display: 'block', fontWeight: 'bold' }}>
          <div>
            A unidade cumpriu todas as metas estabelecidas na inspeção anterior?
          </div>
          <p style={{ fontWeight: 'bold' }}>{t12RegularizacaoDasPendenciasDaUltimaCorreicao || "Não informado"}</p>
        </label>
      </div>
      <div style={{ marginTop: '1rem', width: '100%' }}>
        <label style={{ display: 'block', fontWeight: 'bold' }}>
          <div>
            A unidade regularizou todas as pendências apontadas na última Correição ou Inspeção de Avaliação da Corregedoria?
          </div>
          <p style={{ fontWeight: 'bold' }}>{t12RegularizacaoDasPendenciasDaUltimaCorreicao || "Não informado"}</p>
        </label>
      </div>
      <div style={{ marginTop: '1rem', width: '100%' }}>
        <label style={{ display: 'block', fontWeight: 'bold' }}>
          <div>
            Em sendo negativa a resposta de algum dos itens acima, justificar o eventual não cumprimento
          </div>
          <p style={{ fontWeight: 'bold' }}>{t12JustificativaDoNaoCumprimento || "Não informado"}</p>
        </label>
      </div>
      <h2 style={{ width: '100%' }}>13. Boas práticas e dificuldades</h2>
      <div style={{ marginTop: '1rem', width: '100%' }}>
        <label style={{ display: 'block', fontWeight: 'bold' }}>
          <div>
            Relacionar as boas práticas, eventuais dificuldades vivenciadas na unidade, bem como demandas e soluções propostas, inclusive quanto aos setores administrativos
          </div>
          <p style={{ fontWeight: 'bold' }}>{t12JustificativaDoNaoCumprimento || "Não informado"}</p>
        </label>
      </div>

    </div>
  </div>
}

export default function FormPreCorreicao() {
  return Model(Interview, document, { saveButton: true, pdfButton: false, pdfFileName: 'bpc-loas-pcd-mais-17' })
}