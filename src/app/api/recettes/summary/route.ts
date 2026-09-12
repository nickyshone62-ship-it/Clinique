import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth';

/**
 * Route GET /api/recettes/summary
 * Calcule les recettes et statistiques financières pour la gérante.
 */
export async function GET(request: Request) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Accès non autorisé.' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || 'month'; // today, week, month, all, custom
    const startDateParam = searchParams.get('startDate');
    const endDateParam = searchParams.get('endDate');
    const categoryId = searchParams.get('categoryId');
    const serviceId = searchParams.get('serviceId');

    // 1. Calcul des dates limites pour les filtres temporels au Burkina Faso (UTC+0)
    const now = new Date();
    
    // Début de la journée actuelle
    const startOfToday = new Date(now);
    startOfToday.setUTCHours(0, 0, 0, 0);

    // Début de la semaine (Lundi)
    const startOfWeek = new Date(now);
    const dayOfWeek = startOfWeek.getUTCDay() || 7;
    startOfWeek.setUTCDate(startOfWeek.getUTCDate() - dayOfWeek + 1);
    startOfWeek.setUTCHours(0, 0, 0, 0);

    // Début du mois
    const startOfMonth = new Date(now.getUTCFullYear(), now.getUTCMonth(), 1);

    // 2. Détermination de la plage de dates pour le filtre sélectionné
    let filterStartDate: Date | undefined;
    let filterEndDate: Date | undefined;

    if (period === 'today') {
      filterStartDate = startOfToday;
    } else if (period === 'week') {
      filterStartDate = startOfWeek;
    } else if (period === 'month') {
      filterStartDate = startOfMonth;
    } else if (period === 'custom' && startDateParam && endDateParam) {
      filterStartDate = new Date(startDateParam);
      filterStartDate.setUTCHours(0, 0, 0, 0);
      filterEndDate = new Date(endDateParam);
      filterEndDate.setUTCHours(23, 59, 59, 999);
    }

    // 3. Construction du filtre Prisma where
    const whereCondition: any = {};

    if (filterStartDate || filterEndDate) {
      whereCondition.datePrestation = {};
      if (filterStartDate) whereCondition.datePrestation.gte = filterStartDate;
      if (filterEndDate) whereCondition.datePrestation.lte = filterEndDate;
    }

    if (serviceId) {
      whereCondition.serviceId = serviceId;
    } else if (categoryId) {
      whereCondition.service = {
        categoryId: categoryId,
      };
    }

    // 4. Exécution des requêtes d'agrégation dans Neon PostgreSQL
    const allTransactions = await prisma.transaction.findMany({
      where: whereCondition,
      include: {
        service: {
          include: {
            category: true,
          },
        },
      },
      orderBy: [
        { datePrestation: 'desc' },
        { createdAt: 'desc' },
      ],
    });

    // 5. Calcul des indicateurs clés (Aujourd'hui, Semaine, Mois, Global)
    const todayTransactions = await prisma.transaction.findMany({
      where: { datePrestation: { gte: startOfToday } },
      select: { montant: true },
    });
    const totalToday = todayTransactions.reduce((acc, t) => acc + Number(t.montant), 0);

    const weekTransactions = await prisma.transaction.findMany({
      where: { datePrestation: { gte: startOfWeek } },
      select: { montant: true },
    });
    const totalWeek = weekTransactions.reduce((acc, t) => acc + Number(t.montant), 0);

    const monthTransactions = await prisma.transaction.findMany({
      where: { datePrestation: { gte: startOfMonth } },
      select: { montant: true },
    });
    const totalMonth = monthTransactions.reduce((acc, t) => acc + Number(t.montant), 0);

    const totalFiltered = allTransactions.reduce((acc, t) => acc + Number(t.montant), 0);

    // 6. Agrégation par Catégorie
    const categoryMap: { [key: string]: { id: string; nom: string; total: number; count: number } } = {};
    const serviceMap: { [key: string]: { id: string; nom: string; categorieNom: string; total: number; count: number } } = {};

    allTransactions.forEach((t) => {
      const cat = t.service.category;
      const srv = t.service;
      const amount = Number(t.montant);

      // Catégorie
      if (!categoryMap[cat.id]) {
        categoryMap[cat.id] = { id: cat.id, nom: cat.nom, total: 0, count: 0 };
      }
      categoryMap[cat.id].total += amount;
      categoryMap[cat.id].count += 1;

      // Service
      if (!serviceMap[srv.id]) {
        serviceMap[srv.id] = { id: srv.id, nom: srv.nom, categorieNom: cat.nom, total: 0, count: 0 };
      }
      serviceMap[srv.id].total += amount;
      serviceMap[srv.id].count += 1;
    });

    return NextResponse.json({
      success: true,
      period,
      summary: {
        totalToday,
        totalWeek,
        totalMonth,
        totalFiltered,
        countFiltered: allTransactions.length,
      },
      byCategory: Object.values(categoryMap).sort((a, b) => b.total - a.total),
      byService: Object.values(serviceMap).sort((a, b) => b.total - a.total),
      transactions: allTransactions.map((t) => ({
        id: t.id,
        montant: Number(t.montant),
        datePrestation: t.datePrestation,
        heurePrestation: t.heurePrestation,
        createdAt: t.createdAt,
        service: {
          id: t.service.id,
          nom: t.service.nom,
          categorie: t.service.category.nom,
        },
      })),
    });
  } catch (error: any) {
    console.error('Erreur lors du calcul des recettes :', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Erreur lors du calcul des recettes.' },
      { status: 500 }
    );
  }
}
