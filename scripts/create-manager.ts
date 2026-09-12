import readline from 'readline';
import bcrypt from 'bcryptjs';
import { prisma } from '../src/lib/prisma';

function askQuestion(query: string, hideInput = false): Promise<string> {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    if (hideInput) {
      // Masquer la saisie du mot de passe avec des astérisques
      const stdin = process.stdin as any;
      const onDataHandler = (char: Buffer) => {
        const charStr = char.toString('utf8');
        switch (charStr) {
          case '\n':
          case '\r':
          case '\u0004':
            stdin.removeListener('data', onDataHandler);
            break;
          default:
            process.stdout.write('\x1B[2K\x1B[0G' + query + '*'.repeat((rl as any).line.length));
            break;
        }
      };
      stdin.on('data', onDataHandler);
    }

    rl.question(query, (answer) => {
      rl.close();
      if (hideInput) {
        process.stdout.write('\n');
      }
      resolve(answer.trim());
    });
  });
}

async function createManagerAccount() {
  console.log('====================================================');
  console.log('   CRÉATION DU COMPTE GÉRANTE (CLINIQUE)           ');
  console.log('====================================================\n');

  // 1. Saisie ou récupération des variables
  let nom = process.env.GERANTE_NOM || '';
  let email = process.env.GERANTE_EMAIL || '';
  let password = process.env.GERANTE_PASSWORD || '';
  let confirmPassword = process.env.GERANTE_PASSWORD || '';

  if (!nom) {
    nom = await askQuestion('1. Nom complet de la gérante : ');
  }

  if (!email) {
    email = await askQuestion('2. Adresse e-mail de la gérante : ');
  }

  if (!password) {
    password = await askQuestion('3. Mot de passe : ', true);
    confirmPassword = await askQuestion('4. Confirmation du mot de passe : ', true);
  }

  // 2. Validations
  if (!nom || nom.length < 2) {
    console.error('❌ Erreur : Le nom de la gérante doit contenir au moins 2 caractères.');
    process.exit(1);
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    console.error('❌ Erreur : Adresse email invalide.');
    process.exit(1);
  }

  if (!password || password.length < 6) {
    console.error('❌ Erreur : Le mot de passe doit contenir au moins 6 caractères.');
    process.exit(1);
  }

  if (password !== confirmPassword) {
    console.error('❌ Erreur : Le mot de passe et la confirmation ne correspondent pas.');
    process.exit(1);
  }

  const trimmedEmail = email.toLowerCase();

  // 3. Vérification des doublons dans Neon
  const existingUser = await prisma.user.findUnique({
    where: { email: trimmedEmail },
  });

  if (existingUser) {
    console.error(`❌ Erreur : Un utilisateur avec l'email "${trimmedEmail}" existe déjà.`);
    process.exit(1);
  }

  // 4. Hashage sécurisé du mot de passe avec Bcrypt (cost factor 10)
  console.log('🔒 Hashage sécurisé du mot de passe avec Bcrypt...');
  const saltRounds = 10;
  const hashedPassword = bcrypt.hashSync(password, saltRounds);

  // 5. Création de l'utilisateur dans Neon PostgreSQL
  console.log('💾 Insertion du compte gérante dans Neon PostgreSQL...');
  const newManager = await prisma.user.create({
    data: {
      nom,
      email: trimmedEmail,
      motDePasse: hashedPassword,
    },
  });

  console.log('\n====================================================');
  console.log('✅ Compte de la gérante créé avec succès !');
  console.log(`   - ID : ${newManager.id}`);
  console.log(`   - Nom : ${newManager.nom}`);
  console.log(`   - Email : ${newManager.email}`);
  console.log(`   - Hash Bcrypt : ${newManager.motDePasse.substring(0, 10)}... [SÉCURISÉ]`);
  console.log('====================================================\n');
}

createManagerAccount()
  .catch((err) => {
    console.error('❌ Erreur lors de la création du compte :', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
