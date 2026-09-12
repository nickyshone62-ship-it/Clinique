import React from 'react';
import { requireUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { 
  FolderTree, 
  Stethoscope, 
  Database, 
  ShieldCheck, 
  CheckCircle2, 
  Sparkles,
  ArrowRight,
  UserCheck,
  Tag,
  Coins
} from 'lucide-react';

export default async function Home() {
  // 1. Récupération sécurisée de la gérante connectée (Redirige vers /login si non authentifiée)
  const user = await requireUser();

  // 2. Lecture en direct des catégories et services depuis Neon PostgreSQL
  const categories = await prisma.category.findMany({
    include: {
      services: {
        orderBy: { nom: 'asc' },
      },
    },
    orderBy: { nom: 'asc' },
  });

  const totalServices = categories.reduce((acc, cat) => acc + cat.services.length, 0);

  return (
    <div className="min-h-screen bg-[#f5f6f2] text-slate-900 font-sans selection:bg-lime-400 selection:text-slate-950">
      {/* En-tête principal avec profil gérante et déconnexion */}
      <Header user={user} />

      <div className="flex">
        {/* Barre latérale de navigation */}
        <Sidebar categoriesCount={categories.length} servicesCount={totalServices} />

        {/* Contenu principal du Tableau de bord */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl">
          {/* Banner Hero Style Modèle Image */}
          <div className="bg-white border border-slate-200/80 rounded-[32px] p-6 sm:p-10 shadow-sm relative overflow-hidden">
            <div className="relative z-10 space-y-6">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold bg-slate-100 text-slate-800 border border-slate-200/80 px-3.5 py-1.5 rounded-full">
                  <span className="w-2 h-2 rounded-full bg-lime-400" />
                  BK Clinique &bull; Espace Gérante Active
                </span>
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                  &bull; Neon PostgreSQL SSL
                </span>
              </div>

              <div className="space-y-3 max-w-3xl">
                <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                  BK Clinique &bull; Suivi des Recettes &amp; Prestations<span className="w-3 h-3 rounded-full bg-lime-400 inline-block ml-1" />
                </h1>
                <p className="text-sm sm:text-base text-slate-500 font-medium leading-relaxed">
                  Bienvenue <strong>{user.nom}</strong>. Enregistrez et consultez toutes les prestations médicales réalisées à la clinique BK Clinique avec horodatage UTC+0.
                </p>
              </div>

              {/* Tags Pilules Soft Style Image Modèle */}
              <div className="pt-2 flex flex-wrap items-center gap-2">
                <span className="bg-slate-100 border border-slate-200/80 text-slate-700 text-xs font-semibold px-4 py-2 rounded-full">
                  🩺 Consultations
                </span>
                <span className="bg-slate-100 border border-slate-200/80 text-slate-700 text-xs font-semibold px-4 py-2 rounded-full">
                  📡 Échographies
                </span>
                <span className="bg-slate-100 border border-slate-200/80 text-slate-700 text-xs font-semibold px-4 py-2 rounded-full">
                  🔬 Actes Médicaux
                </span>
                <span className="bg-slate-100 border border-slate-200/80 text-slate-700 text-xs font-semibold px-4 py-2 rounded-full">
                  💰 Montants réels en FCFA
                </span>
              </div>
            </div>
          </div>

          {/* Grille de métriques réelles - Cartes Blanches Modèle */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Catégories</span>
                <div className="p-2.5 bg-slate-100 text-slate-900 rounded-2xl border border-slate-200/60">
                  <FolderTree className="w-5 h-5 text-slate-800" />
                </div>
              </div>
              <div className="text-4xl font-black text-slate-900">{categories.length}</div>
              <p className="text-xs font-medium text-slate-500">Consultations, Échographies, Actes</p>
            </div>

            <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Services Médicaux</span>
                <div className="p-2.5 bg-lime-400/20 text-slate-900 rounded-2xl border border-lime-400/30">
                  <Stethoscope className="w-5 h-5 text-slate-950" />
                </div>
              </div>
              <div className="text-4xl font-black text-slate-900">{totalServices}</div>
              <p className="text-xs font-medium text-slate-500">Actes configurés &amp; actifs</p>
            </div>

            <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Fixation des Prix</span>
                <div className="p-2.5 bg-slate-100 text-slate-900 rounded-2xl border border-slate-200/60">
                  <Coins className="w-5 h-5 text-slate-800" />
                </div>
              </div>
              <div className="text-xl font-extrabold text-slate-900">Variables (FCFA)</div>
              <p className="text-xs font-medium text-slate-500">Montant saisi lors de chaque prestation</p>
            </div>

            <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Sécurité Session</span>
                <div className="p-2.5 bg-slate-100 text-slate-900 rounded-2xl border border-slate-200/60">
                  <ShieldCheck className="w-5 h-5 text-slate-800" />
                </div>
              </div>
              <div className="text-xl font-extrabold text-slate-900">Cookie HTTP-Only</div>
              <p className="text-xs font-medium text-slate-500">Cryptographie JWT + Bcrypt</p>
            </div>
          </div>

          {/* Explorer du Catalogue de Catégories et Services - Carte Blanche */}
          <div id="services" className="bg-white border border-slate-200/80 rounded-[32px] p-6 sm:p-8 space-y-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
              <div>
                <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                  <FolderTree className="w-5 h-5 text-slate-800" />
                  <span>Catalogue des Catégories &amp; Services</span>
                </h2>
                <p className="text-xs font-medium text-slate-500 mt-1">
                  Structure stockée et synchronisée dans votre base PostgreSQL Neon.
                </p>
              </div>

              <div className="bg-slate-100 border border-slate-200/80 px-4 py-1.5 rounded-full text-xs text-slate-800 font-bold self-start sm:self-auto">
                Devise : <span className="text-slate-950 font-black">FCFA</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {categories.map((cat) => (
                <div 
                  key={cat.id} 
                  className="bg-slate-50/70 border border-slate-200/80 rounded-2xl p-5 space-y-4 hover:border-slate-300 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-black text-slate-900 tracking-wider uppercase flex items-center gap-2">
                        <Tag className="w-4 h-4 text-slate-700" />
                        <span>{cat.nom}</span>
                      </h3>
                      <span className="text-[11px] font-bold bg-white text-slate-900 border border-slate-200 px-3 py-1 rounded-full shadow-xs">
                        {cat.services.length} services
                      </span>
                    </div>

                    <ul className="space-y-2 pt-1">
                      {cat.services.map((s) => (
                        <li 
                          key={s.id}
                          className="flex items-center justify-between text-xs bg-white border border-slate-200/70 rounded-xl px-3.5 py-2.5 text-slate-800 font-semibold shadow-xs"
                        >
                          <span>{s.nom}</span>
                          <span className="text-[10px] text-slate-950 font-bold bg-lime-400 px-2.5 py-0.5 rounded-full">
                            Actif
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-3 text-[11px] text-slate-500 font-medium border-t border-slate-200/60 flex items-center gap-1.5">
                    <Coins className="w-3.5 h-3.5 text-slate-700" />
                    <span>Saisie du montant lors de la prestation</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
