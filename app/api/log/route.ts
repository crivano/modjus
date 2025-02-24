// app/api/log/route.js
export async function GET() {
    console.log('Mensagem registrada no servidor!');
    return new Response('Log realizado no servidor!', { status: 200 });
  }