import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth';

/**
 * Route GET /api/categories
 * Retourne la liste des catégories avec leurs services actifs (actif = true)
 * pour alimenter dynamiquement les formulaires de l'application.
 */
export async function GET() {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Accès non autorisé.' },
        { status: 401 }
      );
    }

    const categories = await prisma.category.findMany({
      include: {
        services: {
          where: { actif: true },
          orderBy: { nom: 'asc' },
        },
      },
      orderBy: { nom: 'asc' },
    });

    return NextResponse.json({
      success: true,
      categories: categories.map((c) => ({
        id: c.id,
        nom: c.nom,
        services: c.services.map((s) => ({
          id: s.id,
          nom: s.nom,
          actif: s.actif,
        })),
      })),
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Erreur lors du chargement des catégories.' },
      { status: 500 }
    );
  }
}
