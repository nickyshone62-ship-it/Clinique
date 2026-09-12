import { NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth';

/**
 * Route GET /api/transactions
 * Retourne la liste des transactions enregistrées par la gérante.
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

    const transactions = await prisma.transaction.findMany({
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
      take: 50,
    });

    return NextResponse.json({
      success: true,
      total: transactions.length,
      transactions: transactions.map((t) => ({
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
    return NextResponse.json(
      { success: false, error: error?.message || 'Erreur lors de la récupération des transactions.' },
      { status: 500 }
    );
  }
}

/**
 * Route POST /api/transactions
 * Enregistre une prestation réalisée dans Neon PostgreSQL.
 */
export async function POST(request: Request) {
  try {
    // 1. Vérification de la session gérante
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Accès non autorisé. Veuillez vous connecter.' },
        { status: 401 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const { serviceId, montant, datePrestation, heurePrestation } = body;

    // 2. Validations des champs obligatoires
    if (!serviceId || typeof serviceId !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Veuillez sélectionner un service médical valide.' },
        { status: 400 }
      );
    }

    const numericMontant = Number(montant);
    if (isNaN(numericMontant) || numericMontant <= 0) {
      return NextResponse.json(
        { success: false, error: 'Le montant payé doit être un nombre strictement supérieur à 0 FCFA.' },
        { status: 400 }
      );
    }

    // 3. Vérification de l'existence et du statut actif du service
    const service = await prisma.service.findFirst({
      where: {
        id: serviceId,
        actif: true,
      },
      include: {
        category: true,
      },
    });

    if (!service) {
      return NextResponse.json(
        { success: false, error: 'Le service sélectionné est introuvable ou a été désactivé.' },
        { status: 404 }
      );
    }

    // 4. Traitement des horodatages (Burkina Faso UTC+0)
    const targetDate = datePrestation ? new Date(datePrestation) : new Date();
    if (isNaN(targetDate.getTime())) {
      return NextResponse.json(
        { success: false, error: 'Format de date invalide.' },
        { status: 400 }
      );
    }

    let heureObj = new Date();
    if (heurePrestation && typeof heurePrestation === 'string') {
      const [hours, minutes] = heurePrestation.split(':').map(Number);
      if (!isNaN(hours) && !isNaN(minutes)) {
        heureObj.setUTCHours(hours, minutes, 0, 0);
      }
    }

    // 5. Enregistrement dans la table transactions de Neon PostgreSQL
    const transaction = await prisma.transaction.create({
      data: {
        serviceId: service.id,
        montant: new Prisma.Decimal(numericMontant),
        datePrestation: targetDate,
        heurePrestation: heureObj,
      },
      include: {
        service: {
          include: {
            category: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Prestation enregistrée avec succès !',
      transaction: {
        id: transaction.id,
        montant: Number(transaction.montant),
        datePrestation: transaction.datePrestation,
        heurePrestation: transaction.heurePrestation,
        createdAt: transaction.createdAt,
        service: {
          id: transaction.service.id,
          nom: transaction.service.nom,
          categorie: transaction.service.category.nom,
        },
      },
    });
  } catch (error: any) {
    console.error('Erreur lors de l\'enregistrement de la transaction :', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Erreur lors de l\'enregistrement de la prestation.' },
      { status: 500 }
    );
  }
}
