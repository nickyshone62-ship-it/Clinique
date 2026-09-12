import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * Route de test lecture seule pour vérifier la connexion avec Neon PostgreSQL.
 * Ne crée, ne modifie et ne supprime AUCUNE donnée.
 */
export async function GET() {
  try {
    if (!process.env.DATABASE_URL) {
      return NextResponse.json(
        {
          success: false,
          error: "DATABASE_URL n'est pas configurée dans .env",
        },
        { status: 500 }
      );
    }

    // Lecture simple des catégories et du nombre de services associés dans Neon
    const categories = await prisma.category.findMany({
      include: {
        services: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Connexion à Neon PostgreSQL réussie avec succès !',
      totalCategories: categories.length,
      categories: categories.map((c) => ({
        id: c.id,
        nom: c.nom,
        nombreServices: c.services.length,
        services: c.services.map((s) => s.nom),
      })),
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error?.message || 'Erreur de connexion à Neon',
      },
      { status: 500 }
    );
  }
}
