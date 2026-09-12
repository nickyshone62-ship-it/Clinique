import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { createSessionToken, COOKIE_NAME } from '@/lib/auth';

/**
 * Route POST /api/auth/login
 * Authentifie l'unique gérante de la clinique et établit la session sécurisée.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { email, password } = body;

    // 1. Validation de la présence des champs
    if (!email || typeof email !== 'string' || !password || typeof password !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Identifiants incorrects.' },
        { status: 401 }
      );
    }

    const trimmedEmail = email.trim().toLowerCase();

    // 2. Recherche de l'utilisateur dans Neon PostgreSQL
    const user = await prisma.user.findUnique({
      where: { email: trimmedEmail },
    });

    if (!user) {
      // Message générique anti-énumération d'email
      return NextResponse.json(
        { success: false, error: 'Identifiants incorrects.' },
        { status: 401 }
      );
    }

    // 3. Vérification du mot de passe hashé avec Bcrypt
    const passwordMatch = bcrypt.compareSync(password, user.motDePasse);

    if (!passwordMatch) {
      // Message générique anti-énumération d'email
      return NextResponse.json(
        { success: false, error: 'Identifiants incorrects.' },
        { status: 401 }
      );
    }

    // 4. Génération du token de session sécurisé
    const token = await createSessionToken({
      id: user.id,
      email: user.email,
      nom: user.nom,
    });

    // 5. Envoi du cookie HTTP-Only sécurisé dans la réponse
    const response = NextResponse.json({
      success: true,
      message: 'Connexion réussie.',
      user: {
        id: user.id,
        nom: user.nom,
        email: user.email,
      },
    });

    const isProduction = process.env.NODE_ENV === 'production';

    response.cookies.set({
      name: COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24, // Expiration 24h
    });

    return response;
  } catch (error) {
    console.error('Erreur lors de la connexion :', error);
    return NextResponse.json(
      { success: false, error: 'Identifiants incorrects.' },
      { status: 401 }
    );
  }
}
