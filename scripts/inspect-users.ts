import { prisma } from '../src/lib/prisma';

async function inspectUsers() {
  console.log('=== INSPECTION DES UTILISATEURS EXISTANTS DANS NEON ===');

  const users = await prisma.user.findMany({
    select: {
      id: true,
      nom: true,
      email: true,
      createdAt: true,
    },
  });

  console.log(`Nombre d'utilisateurs actuels dans la base Neon : ${users.length}`);

  if (users.length === 0) {
    console.log('Aucun utilisateur n\'existe actuellement dans la table "users".');
  } else {
    users.forEach((u, index) => {
      console.log(`[${index + 1}] ID: ${u.id} | Nom: "${u.nom}" | Email: "${u.email}" | Créé le: ${u.createdAt.toISOString()}`);
    });
  }
}

inspectUsers()
  .catch((err) => {
    console.error('Erreur lors de l\'inspection des utilisateurs :', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
