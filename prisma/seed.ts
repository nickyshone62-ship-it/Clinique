import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const INITIAL_DATA = [
  {
    category: 'CONSULTATIONS',
    services: [
      'Consultation infirmier',
      'Consultation généraliste',
      'Consultation cardiaque',
      'Consultation gynécologique',
    ],
  },
  {
    category: 'ÉCHOGRAPHIES',
    services: [
      'Écho abdominale',
      'Écho jumellaire',
      'Écho cardiaque',
    ],
  },
  {
    category: 'ACTES',
    services: [
      'Location bloc',
      'Hospitalisation',
      'Mise en observation',
      'Accouchement',
      'Pansement',
      'Consultation prénatale',
      'Jadelle',
      'Produits',
      'Prélèvement',
      'Lavage d’oreille',
    ],
  },
];

async function main() {
  console.log('--- Début du seeding initial de la clinique ---');

  for (const item of INITIAL_DATA) {
    // Upsert catégorie pour garantir l'idempotence
    const category = await prisma.category.upsert({
      where: { nom: item.category },
      update: {},
      create: { nom: item.category },
    });

    console.log(`[Catégorie] : ${category.nom} (ID: ${category.id})`);

    for (const serviceNom of item.services) {
      // Vérifier si le service existe sous cette catégorie
      const existingService = await prisma.service.findFirst({
        where: {
          categoryId: category.id,
          nom: serviceNom,
        },
      });

      if (!existingService) {
        const newService = await prisma.service.create({
          data: {
            categoryId: category.id,
            nom: serviceNom,
            actif: true,
          },
        });
        console.log(`   + Service créé : ${newService.nom} (actif: ${newService.actif})`);
      } else {
        console.log(`   = Service existant : ${existingService.nom}`);
      }
    }
  }

  console.log('--- Seeding terminé avec succès ---');
}

main()
  .catch((e) => {
    console.error('Erreur lors du seeding :', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
