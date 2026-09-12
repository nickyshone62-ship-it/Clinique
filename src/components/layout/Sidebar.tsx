'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Receipt, 
  FileBarChart, 
  Database, 
  Lock, 
  CheckCircle2,
  FolderTree,
  PlusCircle
} from 'lucide-react';

interface SidebarProps {
  categoriesCount?: number;
  servicesCount?: number;
}

export function Sidebar({ categoriesCount = 3, servicesCount = 17 }: SidebarProps) {
  const pathname = usePathname();

  const menuSections = [
    {
      title: "Menu Principal",
      items: [
        { name: "Tableau de bord", icon: LayoutDashboard, href: "/", active: pathname === '/', badge: "En direct" },
        { name: "Nouvelle prestation", icon: PlusCircle, href: "/nouvelle-prestation", active: pathname === '/nouvelle-prestation', badge: "Saisie" },
        { name: "Recettes & Historique", icon: Receipt, href: "/recettes", active: pathname === '/recettes', badge: "FCFA" },
        { name: "Rapports Financiers", icon: FileBarChart, href: "/rapports", active: pathname === '/rapports', badge: "Imprimable" },
        { name: "Catalogue Services", icon: FolderTree, href: "/#services", active: false, badge: `${servicesCount} actes` },
      ]
    },
    {
      title: "Système",
      items: [
        { name: "PostgreSQL Neon DB", icon: Database, href: "#", active: false, badge: "Connecté" },
        { name: "Session HTTP-Only", icon: Lock, href: "#", active: false, badge: "Sécurisé" },
      ]
    }
  ];

  return (
    <aside className="w-64 bg-white text-slate-700 min-h-[calc(100vh-65px)] p-4 flex flex-col justify-between border-r border-slate-200/80 hidden md:flex">
      <div className="space-y-6">
        {menuSections.map((section, idx) => (
          <div key={idx} className="space-y-2">
            <h2 className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider px-3">
              {section.title}
            </h2>
            <nav className="space-y-1">
              {section.items.map((item, itemIdx) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={itemIdx}
                    href={item.href}
                    className={`flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs transition-all ${
                      item.active
                        ? "bg-slate-950 text-white font-bold shadow-sm"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 font-medium"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-4 h-4 ${item.active ? "text-lime-400" : "text-slate-400"}`} />
                      <span>{item.name}</span>
                    </div>
                    {item.badge && (
                      <span className={`text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1 font-bold ${
                        item.active 
                          ? "bg-lime-400 text-slate-950" 
                          : "bg-slate-100 text-slate-600 border border-slate-200/80"
                      }`}>
                        {item.active && <CheckCircle2 className="w-2.5 h-2.5 text-slate-950" />}
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>
        ))}
      </div>

      <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 text-xs space-y-1.5 text-slate-600">
        <div className="flex items-center gap-2 text-slate-900 font-bold">
          <span className="w-2 h-2 rounded-full bg-lime-400 animate-ping" />
          <span>Base Neon PostgreSQL</span>
        </div>
        <p className="text-[11px] leading-relaxed text-slate-500 font-medium">
          {categoriesCount} Catégories &bull; {servicesCount} Services configurés.
        </p>
      </div>
    </aside>
  );
}
