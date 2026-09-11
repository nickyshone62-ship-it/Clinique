import React from 'react';
import { 
  LayoutDashboard, 
  Stethoscope, 
  Receipt, 
  FileBarChart, 
  Database, 
  Lock, 
  CheckCircle2, 
  Clock 
} from 'lucide-react';

export function Sidebar() {
  const menuSections = [
    {
      title: "Menu Principal",
      items: [
        { name: "Tableau de bord", icon: LayoutDashboard, href: "#", active: true, badge: "Prêt" },
        { name: "Prestations", icon: Stethoscope, href: "#", active: false, badge: "Étape future" },
        { name: "Recettes & Historique", icon: Receipt, href: "#", active: false, badge: "Étape future" },
        { name: "Rapports & Statistiques", icon: FileBarChart, href: "#", active: false, badge: "Étape future" },
      ]
    },
    {
      title: "Infrastructure & Sécurité",
      items: [
        { name: "Base de données (Neon)", icon: Database, href: "#", active: false, badge: "Attente Étape 2" },
        { name: "Authentification", icon: Lock, href: "#", active: false, badge: "Attente Étape 3" },
      ]
    }
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 min-h-[calc(100vh-73px)] p-4 flex flex-col justify-between border-r border-slate-800 hidden md:flex">
      <div className="space-y-6">
        {menuSections.map((section, idx) => (
          <div key={idx} className="space-y-2">
            <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-3">
              {section.title}
            </h2>
            <nav className="space-y-1">
              {section.items.map((item, itemIdx) => {
                const Icon = item.icon;
                return (
                  <div
                    key={itemIdx}
                    className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-colors ${
                      item.active
                        ? "bg-teal-600/20 text-teal-300 border border-teal-500/30"
                        : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-200"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-4 h-4 ${item.active ? "text-teal-400" : "text-slate-400"}`} />
                      <span>{item.name}</span>
                    </div>
                    {item.badge && (
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full flex items-center gap-1 ${
                        item.active 
                          ? "bg-teal-500/20 text-teal-300 border border-teal-500/30" 
                          : "bg-slate-800 text-slate-400"
                      }`}>
                        {item.active ? <CheckCircle2 className="w-2.5 h-2.5" /> : <Clock className="w-2.5 h-2.5" />}
                        {item.badge}
                      </span>
                    )}
                  </div>
                );
              })}
            </nav>
          </div>
        ))}
      </div>

      <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/50 text-xs space-y-1 text-slate-400">
        <p className="font-semibold text-slate-200">Étape 1 terminée</p>
        <p className="text-[11px] leading-tight text-slate-400">
          Architecture prête pour la suite du projet.
        </p>
      </div>
    </aside>
  );
}
