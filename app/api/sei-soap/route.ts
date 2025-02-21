import * as soap from 'soap'

const clientMap = new Map<string, soap.Client>()
// Função para obter o cliente
const getClient = async () => {
  let client = clientMap.get('sei')
  if (client !== undefined)
    return client
  const systemData = { wsdl: 'https://sei-apresentacao.trf2.jus.br/sei/controlador_ws.php?servico=sei', endpoint: 'https://sei-apresentacao.trf2.jus.br/sei/ws/SeiWS.php' }
  client = await soap.createClientAsync(
    systemData?.wsdl as string,
    { parseReponseAttachments: true },
    systemData?.endpoint as string)
  clientMap.set('sei', client)
  return client
}

// Função para filtrar a lista de unidades
const filterUnidades = (unidades: any[], searchTerm: string) => {
  return unidades.filter((unidade: any) =>
    unidade.sigla.toLowerCase().includes(searchTerm.toLowerCase()) ||
    unidade.descricao.toLowerCase().includes(searchTerm.toLowerCase())
  );
}

// Função para lidar com a requisição GET
export async function GET(req: Request, { params }: { params: { id: string } }) {
  const client = await getClient();
  const args = { SiglaSistema: 'SEI-CORREICAO', IdentificacaoServico: 'FormularioCorreicao' };

  // Obtém os dados das unidades
  const res = await client.listarUnidadesAsync(args);
  const unidades = res[0].parametros.item.map((u: any) => ({
    sigla: u.Sigla.$value,
    descricao: u.Descricao.$value
  }));

 // console.log("Antes do filtro :",unidades)

  // Obtém o parâmetro de busca da query string, caso exista
  const url = new URL(req.url);
  const searchTerm = url.searchParams.get('sigla') || ''; // Parâmetro de busca pode ser 'search'

  // Filtra as unidades com base no termo de busca, se ele existir
  const unidadesFiltradas = searchTerm ? filterUnidades(unidades, searchTerm) : unidades;
 // const unidadesFiltradas = unidades;
  //console.log("sigla:" , searchTerm)
 // console.log("Depois do filtro :",unidadesFiltradas)

  // Retorna as unidades filtradas ou todas as unidades se não houver filtro
  return new Response(JSON.stringify(unidadesFiltradas), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}
