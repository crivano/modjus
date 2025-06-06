export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

export async function GET(req: Request, { params }: { params: { id: string } }) {
    const url = new URL(req.url)
    const texto = url.searchParams.get('texto')
    if (!texto) return new Response(JSON.stringify({ errormsg: 'Parâmetro "texto" não informado' }), { status: 400, headers: { 'Content-Type': 'application/json' }, })

    const retornoAuth = await fetch(`${process.env.SIGA_URL}/autenticar`, {
        method: 'POST',
        cache: 'no-store',

        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Basic ${btoa(`${process.env.SIGA_USERNAME}:${process.env.SIGA_PASSWORD}`)}`
        }
    })
    const jsonAuth = await retornoAuth.json()

    const token = jsonAuth.token

    console.log('token', token)

    const retorno = await fetch(`${process.env.SIGA_URL}/pessoas?texto=${encodeURI(texto)}`, {
        method: 'GET',
        cache: 'no-store',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    const json = await retorno.json()
    if (json.error) {
        console.log('Erro ao buscar pessoas:', json.error)
        return new Response(JSON.stringify({ errormsg: json.error }), { status: 500, headers: {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0',
    'Surrogate-Control': 'no-store'
  }, })
    }
    if (!json.list || json.list.length === 0) {
        console.log('Nenhum resultado encontrado para o texto:', texto)
            return new Response(JSON.stringify({ errormsg: 'Nenhuma pessoa encontrada com o texto informado' }), {
        status: 404,
        headers: {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0',
    'Surrogate-Control': 'no-store'
  },
    });
    } 
    console.log(json.list[0].nome + ' ' + json.list[0].sigla + ' ' + json.list[0].cpf + ' ' + json.list[0].lotacao.sigla + ' ' + json.list[0].cargo.nome);
    return new Response(JSON.stringify(json), { status: 200, headers: {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0',
    'Surrogate-Control': 'no-store'
  }, })
}