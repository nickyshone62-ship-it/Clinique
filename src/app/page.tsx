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

  const steps = [
    {
      step: "Étape 1",
      title: "Initialisation & Socle Next.js",
      description: "Architecture Next.js (App Router), TypeScript strict, Tailwind CSS v4 & ESLint.",
      status: "Terminée",
      completed: true,
    },
    {
      step: "Étape 2",
      title: "Base Neon PostgreSQL & ORM Prisma",
      description: "Modélisation relationnelle des tables (users, categories, services, transactions).",
      status: "Terminée",
      completed: true,
    },
    {
      step: "Étape 3",
      title: "Authentification Gérante & Sessions",
      description: "Compte unique, hash Bcrypt, sessions JWT sécurisées et cookies HTTP-Only.",
      status: "Terminée",
      completed: true,
    },
    {
      step: "Étape 4",
      title: "Saisie des Prestations & Suivi des Recettes",
      description: "Enregistrement des montants réels en FCFA, dates/heures UTC+0 et historique.",
      status: "Prochaine Étape",
      completed: false,
      current: true,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-teal-500 selection:text-white">
      {/* En-tête principal avec profil gérante et déconnexion */}
      <Header user={user} />

      <div className="flex">
        {/* Barre latérale de navigation */}
        <Sidebar categoriesCount={categories.length} servicesCount={totalServices} />

        {/* Contenu principal du Tableau de bord */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl">
          {/* Banner de bienvenue */}
          <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-teal-950 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="relative z-10 space-y-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-500/10 text-teal-300 text-xs font-semibold border border-teal-500/30">
                <Sparkles className="w-4 h-4 text-teal-400" />
                <span>Session Sécurisée Active</span>
              </div>

              <div className="space-y-1">
                <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
                  Bienvenue, {user.nom} 👋
                </h1>
                <p className="text-sm sm:text-base text-slate-300 max-w-2xl">
                  Votre espace d&apos;administration est configuré et connecté à votre base de données Neon PostgreSQL.
                </p>
              </div>

              <div className="pt-2 flex flex-wrap items-center gap-3 text-xs text-slate-300">
                <div className="flex items-center gap-2 bg-slate-950/80 px-3.5 py-2 rounded-xl border border-slate-800">
                  <UserCheck className="w-4 h-4 text-teal-400" />
                  <span>Compte Gérante : <strong className="text-white">{user.email}</strong></span>
                </div>
                <div className="flex items-center gap-2 bg-slate-950/80 px-3.5 py-2 rounded-xl border border-slate-800">
                  <Database className="w-4 h-4 text-teal-400" />
                  <span>PostgreSQL Neon : <strong className="text-teal-400">Connecté (SSL)</strong></span>
                </div>
              </div>
            </div>
          </div>

          {/* Grille de métriques réelles */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-2 hover:border-teal-500/40 transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Catégories</span>
                <div className="p-2.5 bg-teal-500/10 text-teal-400 rounded-xl">
                  <FolderTree className="w-5 h-5" />
                </div>
              </div>
              <div className="text-3xl font-extrabold text-white">{categories.length}</div>
              <p className="text-xs text-slate-400">Consultations, Échographies, Actes</p>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-2 hover:border-teal-500/40 transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Services Médicaux</span>
                <div className="p-2.5 bg-cyan-500/10 text-cyan-400 rounded-xl">
                  <Stethoscope className="w-5 h-5" />
                </div>
              </div>
              <div className="text-3xl font-extrabold text-white">{totalServices}</div>
              <p className="text-xs text-slate-400">Actes configurés &amp; actifs</p>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-2 hover:border-teal-500/40 transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Fixation des Prix</span>
                <div className="p-2.5 bg-amber-500/10 text-amber-400 rounded-xl">
                  <Coins className="w-5 h-5" />
                </div>
              </div>
              <div className="text-xl font-bold text-amber-300">Variables (FCFA)</div>
              <p className="text-xs text-slate-400">Montant saisi lors de chaque prestation</p>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-2 hover:border-teal-500/40 transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Sécurité Session</span>
                <div className="p-2.5 bg-emerald-500/10 text-emerald-400 rounded-xl">
                  <ShieldCheck className="w-5 h-5" />
                </div>
              </div>
              <div className="text-xl font-bold text-emerald-400">Cookie HTTP-Only</div>
              <p className="text-xs text-slate-400">Cryptographie JWT + Bcrypt</p>
            </div>
          </div>

          {/* Explorer du Catalogue de Catégories et Services */}
          <div id="services" className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
              <div>
                <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                  <FolderTree className="w-5 h-5 text-teal-400" />
                  <span>Catalogue des Catégories &amp; Services</span>
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Structure stockée et synchronisée dans votre base PostgreSQL Neon.
                </p>
              </div>

              <div className="bg-slate-950 border border-slate-800 px-3.5 py-1.5 rounded-xl text-xs text-slate-300 font-medium self-start sm:self-auto">
                Devise : <span className="text-teal-400 font-bold">FCFA</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {categories.map((cat) => (
                <div 
                  key={cat.id} 
                  className="bg-slate-950/70 border border-slate-800/90 rounded-2xl p-5 space-y-4 hover:border-teal-500/30 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold text-white tracking-wide uppercase flex items-center gap-2">
                        <Tag className="w-4 h-4 text-teal-400" />
                        <span>{cat.nom}</span>
                      </h3>
                      <span className="text-[11px] font-semibold bg-teal-500/10 text-teal-300 border border-teal-500/20 px-2.5 py-0.5 rounded-full">
                        {cat.services.length} services
                      </span>
                    </div>

                    <ul className="space-y-2 pt-1">
                      {cat.services.map((s) => (
                        <li 
                          key={s.id}
                          className="flex items-center justify-between text-xs bg-slate-900/80 border border-slate-800/60 rounded-xl px-3 py-2 text-slate-200"
                        >
                          <span className="font-medium">{s.nom}</span>
                          <span className="text-[10px] text-teal-400 font-semibold bg-teal-500/10 px-2 py-0.5 rounded-md">
                            Actif
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-3 text-[11px] text-slate-500 border-t border-slate-800/60 flex items-center gap-1.5">
                    <Coins className="w-3.5 h-3.5 text-amber-400" />
                    <span>Saisie du montant lors de la prestation</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Progression des étapes du Projet */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">Feuille de Route de la Clinique</h2>
              <p className="text-xs text-slate-400 mt-1">Avancement des étapes de développement du projet.</p>
            </div>

            <div className="space-y-4">
              {steps.map((s, idx) => (
                <div
                  key={idx}
                  className={`p-4 sm:p-5 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                    s.completed
                      ? "bg-slate-950/80 border-slate-800"
                      : s.current
                      ? "bg-teal-500/10 border-teal-500/30"
                      : "bg-slate-950/40 border-slate-900 opacity-60"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`mt-0.5 w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold ${
                      s.completed
                        ? "bg-teal-500 text-slate-950"
                        : s.current
                        ? "bg-teal-400 text-slate-950 animate-pulse"
                        : "bg-slate-800 text-slate-400"
                    }`}>
                      {idx + 1}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-teal-400 uppercase tracking-wider">{s.step}</span>
                        <h4 className="text-sm font-bold text-white">{s.title}</h4>
                      </div>
                      <p className="text-xs text-slate-400 mt-1">{s.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs font-medium self-end sm:self-center">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 ${
                      s.completed
                        ? "bg-teal-500/10 text-teal-300 border border-teal-500/20"
                        : s.current
                        ? "bg-amber-500/10 text-amber-300 border border-amber-500/20"
                        : "bg-slate-800 text-slate-500"
                    }`}>
                      {s.completed && <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" />}
                      {s.status}
                    </span>
                    {s.current && <ArrowRight className="w-4 h-4 text-teal-400 animate-pulse" />}
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
