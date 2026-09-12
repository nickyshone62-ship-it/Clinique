import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

/**
 * Route GET /api/test-db
 * Permet de vérifier la connexion Neon et de purger les comptes si ?purge=true est fourni.
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const shouldPurge = searchParams.get('purge') === 'true';

    if (!process.env.DATABASE_URL) {
      return NextResponse.json(
        {
          success: false,
          error: "DATABASE_URL n'est pas configurée dans les variables d'environnement",
        },
        { status: 500 }
      );
    }

    let purgedCount = 0;
    if (shouldPurge) {
      const res = await prisma.user.deleteMany({});
      purgedCount = res.count;
    }

    const usersCount = await prisma.user.count();
    const categoriesCount = await prisma.category.count();

    return NextResponse.json({
      success: true,
      message: shouldPurge 
        ? `Purge effectuée : ${purgedCount} compte(s) supprimé(s).` 
        : 'Vérification de la base de données réussie.',
      purgedCount,
      usersCount,
      categoriesCount,
      dbHost: process.env.DATABASE_URL ? process.env.DATABASE_URL.split('@')[1]?.split('/')[0] : 'Inconnu',
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error?.message || 'Erreur de connexion à la base de données',
      },
      { status: 500 }
    );
  }
}
