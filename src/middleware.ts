import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Controlla se la richiesta è per /studio
  if (request.nextUrl.pathname.startsWith('/studio')) {
    // Verifica se l'utente è autenticato
    const authHeader = request.headers.get('authorization')
    
    if (!authHeader) {
      // Se non c'è header di autorizzazione, richiedi autenticazione
      return new NextResponse(null, {
        status: 401,
        headers: {
          'WWW-Authenticate': 'Basic realm="Secure Area"',
        },
      })
    }

    // Decodifica le credenziali base64
    const encoded = authHeader.split(' ')[1]
    const decoded = Buffer.from(encoded, 'base64').toString()
    const [username, password] = decoded.split(':')

    // Verifica le credenziali (sostituisci con le tue)
    const validUsername = process.env.STUDIO_USERNAME
    const validPassword = process.env.STUDIO_PASSWORD

    if (username !== validUsername || password !== validPassword) {
      return new NextResponse(null, {
        status: 401,
        headers: {
          'WWW-Authenticate': 'Basic realm="Secure Area"',
        },
      })
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/studio/:path*',
} 