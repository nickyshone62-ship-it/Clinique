import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { createSessionToken, COOKIE_NAME } from '@/lib/auth';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

/**
 * Route POST /api/auth/register
 * Permet la création sécurisée du premier compte gérante depuis l'interface web.
 * Bloque automatiquement toute création ultérieure si un compte gérante existe déjà.
 */
export async function POST(request: Request) {
  try {
    // 1. Vérifier si un compte existe déjà dans la table users
    const existingCount = await prisma.user.count();
    if (existingCount > 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Un compte gérante existe déjà. L\'inscription de nouveaux comptes est désactivée.',
        },
        { status: 403 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const { nom, email, password, confirmPassword } = body;

    // 2. Validation des champs
    if (!nom || typeof nom !== 'string' || nom.trim().length < 2) {
      return NextResponse.json(
        { success: false, error: 'Le nom doit contenir au moins 2 caractères.' },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || typeof email !== 'string' || !emailRegex.test(email.trim())) {
      return NextResponse.json(
        { success: false, error: 'Adresse e-mail invalide.' },
        { status: 400 }
      );
    }

    if (!password || typeof password !== 'string' || password.length < 6) {
      return NextResponse.json(
        { success: false, error: 'Le mot de passe doit contenir au moins 6 caractères.' },
        { status: 400 }
      );
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        { success: false, error: 'Le mot de passe et la confirmation ne correspondent pas.' },
        { status: 400 }
      );
    }

    const trimmedEmail = email.trim().toLowerCase();

    // 3. Hashage sécurisé du mot de passe avec Bcrypt (Cost 10)
    const hashedPassword = bcrypt.hashSync(password, 10);

    // 4. Création du compte gérante dans Neon PostgreSQL
    const newUser = await prisma.user.create({
      data: {
        nom: nom.trim(),
        email: trimmedEmail,
        motDePasse: hashedPassword,
      },
    });

    // 5. Génération du token de session sécurisé
    const token = await createSessionToken({
      id: newUser.id,
      email: newUser.email,
      nom: newUser.nom,
    });

    // 6. Envoi du cookie HTTP-Only et réponse
    const response = NextResponse.json({
      success: true,
      message: 'Compte gérante créé avec succès !',
      user: {
        id: newUser.id,
        nom: newUser.nom,
        email: newUser.email,
      },
    });

    response.cookies.set({
      name: COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24, // 24h
    });

    return response;
  } catch (error: any) {
    console.error('Erreur lors de l\'inscription :', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Erreur lors de la création du compte.' },
      { status: 500 }
    );
  }
}

/**
 * Route GET /api/auth/register
 * Permet à l'application web de vérifier si le premier compte peut être créé ou non.
 */
export async function GET() {
  try {
    const count = await prisma.user.count();
    return NextResponse.json(
      {
        canRegister: count === 0,
        hasManagerAccount: count > 0,
        count,
      },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        },
      }
    );
  } catch (error: any) {
    console.error('Erreur lors de la vérification de l\'inscription :', error);
    return NextResponse.json(
      { canRegister: false, hasManagerAccount: true, error: error?.message || 'DB_ERROR' },
      { status: 500 }
    );
  }
}
