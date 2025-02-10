import { v4 as uuidv4 } from 'uuid';


const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
}

export async function OPTIONS(req: Request) {
    return new Response('', {
        status: 200,
        headers: {
            'Content-Type': 'text/plain', ...corsHeaders
        },
    })
}

export async function POST(req: Request) {
    const body = await req.json()

    const inMemoryDatabase = global.inMemoryDatabase || new Map()
    global.inMemoryDatabase = inMemoryDatabase

    const key = uuidv4()
    inMemoryDatabase.set(key, body)

    setTimeout(() => {
        inMemoryDatabase.delete(key);
    }, 5 * 60 * 1000)

    return new Response(JSON.stringify({ key }), {
        status: 200,
        headers: {
            'Content-Type': 'application/json', ...corsHeaders
        },
    })
}

export async function GET(req: Request) {
    const url = new URL(req.url)
    const key = url.searchParams.get('key')
    const inMemoryDatabase = global.inMemoryDatabase || new Map()
    global.inMemoryDatabase = inMemoryDatabase

    const data = inMemoryDatabase.get(key)

    return new Response(JSON.stringify(data), {
        status: 200,
        headers: {
            'Content-Type': 'application/json', ...corsHeaders
        },
    })
}