export async function GET(req: Request, { params }: { params: { id: string } }) {
    const url = new URL(req.url)
    const texto = url.searchParams.get('texto')
    if (!texto) return new Response(JSON.stringify({ errormsg: 'Parâmetro "texto" não informado' }), { status: 400, headers: { 'Content-Type': 'application/json' }, })

    const retornoAuth = await fetch(`${process.env.SIGA_URL}/autenticar`, {
        method: 'POST',
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
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    const json = await retorno.json()

    console.log(json.list[0].nome + ' ' + json.list[0].sigla);
    return new Response(JSON.stringify(json), { status: 200, headers: { 'Content-Type': 'application/json' }, })
}