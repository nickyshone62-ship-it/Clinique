import { NextResponse } from 'next/server';
import { COOKIE_NAME } from '@/lib/auth';

/**
 * Route POST /api/auth/logout
 * Déconnecte la gérante en invalidant et supprimant le cookie de session HTTP-Only.
 */
export async function POST() {
  const response = NextResponse.json({
    success: true,
    message: 'Déconnexion réussie.',
  });

  // Suppression immédiate du cookie de session
  response.cookies.set({
    name: COOKIE_NAME,
    value: '',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });

  return response;
}
