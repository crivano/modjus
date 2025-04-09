import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {

    const token = req.headers.get('Authorization');

    if (!token || token !== `Bearer ${process.env.INTERNAL_API_TOKEN}`) {
        return NextResponse.json({ error: 'Token inválido ou ausente' }, { status: 401 });
    }



    return NextResponse.next();
}

// Aplica o middleware apenas para rotas da API
export const config = {
    matcher: '/api/getmodjus/:path*',
};