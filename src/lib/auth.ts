import { redirect } from 'next/navigation';
import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { prisma } from './prisma';

export const COOKIE_NAME = 'clinique_session';
const SECRET_KEY = new TextEncoder().encode(
  process.env.JWT_SECRET || 'clinique_default_secret_key_change_in_production'
);

export interface UserSession {
  id: string;
  email: string;
  nom: string;
}

/**
 * Crée un token JWT de session chiffré et signé d'une durée de 24h.
 */
export async function createSessionToken(user: UserSession): Promise<string> {
  return new SignJWT({
    id: user.id,
    email: user.email,
    nom: user.nom,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(SECRET_KEY);
}

/**
 * Vérifie la validité d'un token JWT de session et retourne le payload décodé.
 */
export async function verifySessionToken(token: string): Promise<UserSession | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET_KEY, {
      algorithms: ['HS256'],
    });

    if (!payload.id || !payload.email) {
      return null;
    }

    return {
      id: payload.id as string,
      email: payload.email as string,
      nom: (payload.nom as string) || '',
    };
  } catch (error) {
    return null;
  }
}

/**
 * Récupère les données de la session gérante depuis les cookies HTTP-Only de la requête,
 * et valide que le compte existe toujours physiquement dans la base de données.
 */
export async function getSessionUser(): Promise<UserSession | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;

  if (!token) {
    return null;
  }

  const sessionUser = await verifySessionToken(token);
  if (!sessionUser) {
    return null;
  }

  // Double vérification serveur contre la base de données
  try {
    const userInDb = await prisma.user.findUnique({
      where: { id: sessionUser.id },
      select: { id: true, nom: true, email: true },
    });

    if (!userInDb) {
      return null;
    }

    return {
      id: userInDb.id,
      nom: userInDb.nom,
      email: userInDb.email,
    };
  } catch (error) {
    return null;
  }
}

/**
 * Fonction de garde serveur pour sécuriser les actions et composants serveurs.
 * Redirige automatiquement vers /login si l'utilisateur n'est pas authentifié.
 */
export async function requireUser(): Promise<UserSession> {
  const sessionUser = await getSessionUser();

  if (!sessionUser) {
    redirect('/login');
  }

  return sessionUser;
}
