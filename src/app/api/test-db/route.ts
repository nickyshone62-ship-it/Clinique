import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * Route de test lecture seule pour vérifier la connexion avec Neon PostgreSQL.
 * Ne crée, ne modifie et ne supprime AUCUNE donnée.
 */
export async function GET() {
  try {
    // Vérification de la présence de la variable d'environnement
    if (!process.env.DATABASE_URL) {
      return NextResponse.json(
        {
          success: false,
          error: 'DATABASE_URL n\'est pas configurée dans .env',
        },
        { status: 500 }
      );
    }

    // Lecture simple des catégories existantes
    // @ts-ignore - Prisma Client sera entièrement typé après npx prisma db pull
    const categories = await prisma.category.findMany();

    return NextResponse.json({
      success: true,
      message: 'Connexion à Neon PostgreSQL réussie',
      totalCategories: categories.length,
      categories: categories.map((c: any) => c.nom),
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error?.message || 'Erreur lors de la connexion à la base de données Neon',
      },
      { status: 500 }
    );
  }
}
