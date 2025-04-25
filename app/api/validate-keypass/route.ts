import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    try {
        const url = new URL(request.url);
        const keypass = url.searchParams.get('keypass');

        if (!keypass) {
            return NextResponse.json({ error: 'Keypass is required' }, { status: 400 });
        }

        const validKeypass = process.env.PUBLIC_KEY_ALLOWED;

        if (keypass === validKeypass) {
            return NextResponse.json({ valid: true });
        } else {
            return NextResponse.json({ valid: false }, { status: 401 });
        }
    } catch (error) {
        return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }
}