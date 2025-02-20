import * as soap from 'soap'

const clientMap = new Map<string, soap.Client>()

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

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const client = await getClient()
  const args = { SiglaSistema: 'SEI-CORREICAO', IdentificacaoServico: 'FormularioCorreicao' }
  const res = await client.listarUnidadesAsync(args)
  const a = res[0].parametros.item.map((u: any) => ({ id: u.IdUnidade.$value, sigla: u.Sigla.$value, descricao: u.Descricao.$value}))
  console.log(a);
  return new Response(JSON.stringify(a), { status: 200, headers: { 'Content-Type': 'application/json' }, });
}
