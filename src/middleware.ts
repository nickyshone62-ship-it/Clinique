import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const COOKIE_NAME = 'clinique_session';
const SECRET_KEY = new TextEncoder().encode(
  process.env.JWT_SECRET || 'clinique_default_secret_key_change_in_production'
);

/**
 * Middleware Next.js pour la protection centralisée des routes et redirections.
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Assets statiques Next.js et icônes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon') ||
    pathname.endsWith('.ico') ||
    pathname.endsWith('.svg') ||
    pathname.endsWith('.png') ||
    pathname.endsWith('.jpg')
  ) {
    return NextResponse.next();
  }

  // Routes API publiques d'authentification ou de test
  if (pathname.startsWith('/api/auth/') || pathname.startsWith('/api/test-db')) {
    return NextResponse.next();
  }

  // Vérification de la présence et validité du token de session dans les cookies
  const token = request.cookies.get(COOKIE_NAME)?.value;
  let isAuthenticated = false;

  if (token) {
    try {
      const { payload } = await jwtVerify(token, SECRET_KEY, {
        algorithms: ['HS256'],
      });
      if (payload && payload.id) {
        isAuthenticated = true;
      }
    } catch {
      isAuthenticated = false;
    }
  }

  // 1. Redirection gérante déjà connectée tentant de visiter /login ou /register -> Vers la page d'accueil (/)
  if (pathname === '/login' || pathname === '/register') {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL('/', request.url));
    }
    return NextResponse.next();
  }

  // 2. Redirection utilisateur non connecté tentant d'accéder à une page privée -> Vers /login
  if (!isAuthenticated && !pathname.startsWith('/api/')) {
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
