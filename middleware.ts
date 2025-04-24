import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const internalKey = process.env.INTERNAL_SECRET;
  const requestKey = req.headers.get("x-secret-key");

  if (requestKey !== internalKey) {
    
    return new NextResponse(JSON.stringify({ error: "Acesso negado" }), {
      status: 403,
      headers: { "Content-Type": "application/json" },
    });
  }

  return NextResponse.next();
}

// Aplica o middleware para todas as rotas que começam com /api/getmodjus
export const config = {
  matcher: "/api/getmodjus/:path*",
};
