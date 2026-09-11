import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { 
  CheckCircle2, 
  Layers, 
  Code2, 
  Palette, 
  FileCheck2, 
  ArrowRight,
  Sparkles,
  ShieldCheck
} from 'lucide-react';

export default function Home() {
  const steps = [
    {
      step: "Étape 1",
      title: "Initialisation du Projet",
      description: "Architecture Next.js (App Router), TypeScript strict, Tailwind CSS v4 & ESLint.",
      status: "Terminée",
      current: true,
    },
    {
      step: "Étape 2",
      title: "Base de données Neon PostgreSQL",
      description: "Configuration du schéma relationnel et des tables de stockage des données.",
      status: "En attente de validation",
      current: false,
    },
    {
      step: "Étape 3",
      title: "Authentification & Sécurité",
      description: "Connexion sécurisée pour la gérante de la clinique.",
      status: "Planifiée",
      current: false,
    },
    {
      step: "Étape 4",
      title: "Gestion des Prestations & Recettes",
      description: "Saisie, historique et tableaux de synthèse pour le suivi financier.",
      status: "Planifiée",
      current: false,
    },
  ];

  const specs = [
    { label: "Framework", value: "Next.js (App Router)", icon: Layers },
    { label: "Langage", value: "TypeScript (Strict Mode)", icon: Code2 },
    { label: "Design & Style", value: "Tailwind CSS + Lucide Icons", icon: Palette },
    { label: "Qualité & Audit", value: "ESLint & Build Validé", icon: FileCheck2 },
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Hero Header Card */}
      <Card className="bg-gradient-to-br from-slate-900 via-slate-800 to-teal-950 text-white border-none shadow-xl overflow-hidden relative">
        <div className="absolute right-0 top-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl -z-0 pointer-events-none" />
        <CardContent className="p-8 relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-semibold border border-teal-500/30">
            <Sparkles className="w-3.5 h-3.5" />
            Étape 1 : Socle Technique Prêt
          </div>
          
          <div className="space-y-2">
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              Gestion Clinique
            </h1>
            <p className="text-lg text-slate-300 max-w-2xl font-normal">
              Gestion simple des prestations et des recettes.
            </p>
          </div>

          <div className="pt-2 flex flex-wrap gap-4 text-xs text-slate-300">
            <div className="flex items-center gap-1.5 bg-slate-800/80 px-3 py-1.5 rounded-md border border-slate-700">
              <ShieldCheck className="w-4 h-4 text-teal-400" />
              <span>Environnement : Développement</span>
            </div>
            <div className="flex items-center gap-1.5 bg-slate-800/80 px-3 py-1.5 rounded-md border border-slate-700">
              <CheckCircle2 className="w-4 h-4 text-teal-400" />
              <span>Prêt pour l&apos;étape 2 (Neon DB)</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Grid Specs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {specs.map((item, idx) => {
          const Icon = item.icon;
          return (
            <Card key={idx} className="bg-white hover:border-teal-500/50 transition-colors">
              <CardContent className="p-5 flex items-center gap-4">
                <div className="p-3 bg-teal-50 text-teal-700 rounded-lg">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-slate-500 font-medium">{item.label}</div>
                  <div className="text-sm font-bold text-slate-900 mt-0.5">{item.value}</div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Progression du Projet */}
      <Card>
        <CardHeader>
          <CardTitle>Feuille de Route du Projet</CardTitle>
          <CardDescription>
            Développement étape par étape conformément aux spécifications du projet.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {steps.map((s, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  s.current
                    ? "bg-teal-50/50 border-teal-200"
                    : "bg-slate-50/50 border-slate-200 opacity-80"
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <div className={`mt-0.5 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    s.current
                      ? "bg-teal-600 text-white"
                      : "bg-slate-300 text-slate-700"
                  }`}>
                    {idx + 1}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{s.step}</span>
                      <h4 className="text-sm font-bold text-slate-900">{s.title}</h4>
                    </div>
                    <p className="text-xs text-slate-600 mt-1">{s.description}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs font-medium self-end sm:self-center">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                    s.current
                      ? "bg-teal-100 text-teal-800 border border-teal-200"
                      : "bg-slate-200 text-slate-700"
                  }`}>
                    {s.status}
                  </span>
                  {s.current && <ArrowRight className="w-4 h-4 text-teal-600 animate-pulse" />}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
