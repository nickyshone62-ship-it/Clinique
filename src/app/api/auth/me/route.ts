import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';

/**
 * Route GET /api/auth/me
 * Retourne le profil public et non-sensible de la gérante actuellement connectée.
 * Ne retourne JAMAIS le mot de passe ni son hash.
 */
export async function GET() {
  try {
    const user = await getSessionUser();

    if (!user) {
      return NextResponse.json(
        { authenticated: false, user: null },
        { status: 401 }
      );
    }

    return NextResponse.json({
      authenticated: true,
      user: {
        id: user.id,
        nom: user.nom,
        email: user.email,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { authenticated: false, user: null },
      { status: 401 }
    );
  }
}
