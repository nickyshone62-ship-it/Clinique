'use client';

import React, { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { Activity, ShieldCheck, UserCheck, LogOut, Loader2, PlusCircle, Coins, FileText } from 'lucide-react';

interface HeaderProps {
  user?: {
    id: string;
    nom: string;
    email: string;
  };
}

export function Header({ user }: HeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/login');
      router.refresh();
    } catch {
      setLoggingOut(false);
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 text-slate-900 shadow-sm">
      <div className="max-w-7xl mx-auto px-3 sm:px-8 py-2.5 sm:py-3.5 space-y-2">
        {/* Ligne 1 : Marque Clinique & Profil + Bouton Déconnexion (100% visible sur Mobile & PC) */}
        <div className="flex items-center justify-between gap-2">
          {/* Logo et Nom Clinique */}
          <Link href="/" className="flex items-center gap-2.5 group shrink-0">
            <img 
              src="/logo.jpg" 
              alt="Logo BK Clinique" 
              className="w-10 h-10 sm:w-14 sm:h-14 rounded-2xl object-contain bg-white shadow-sm border border-slate-200 group-hover:scale-105 transition-transform"
            />
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-lg sm:text-2xl font-black text-slate-950 tracking-tight uppercase leading-none">BK CLINIQUE</h1>
                <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-lime-400 inline-block" />
              </div>
              <p className="text-[10px] sm:text-xs text-slate-500 font-bold block mt-0.5">
                Espace Gérante Administrateur
              </p>
            </div>
          </Link>

          {/* User Profil & Bouton Déconnexion (Inconditionnellement visibles) */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="flex items-center gap-1.5 bg-slate-100 border border-slate-200/80 px-2.5 py-1 rounded-full">
              <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-slate-950 text-white flex items-center justify-center font-bold text-[10px] sm:text-xs shadow-sm">
                {user?.nom ? user.nom.substring(0, 2).toUpperCase() : 'GC'}
              </div>
              <span className="text-xs font-bold text-slate-900 hidden sm:inline">{user?.nom || 'Gérante'}</span>
            </div>

            <button
              onClick={handleLogout}
              disabled={loggingOut}
              title="Se déconnecter"
              className="px-3 py-1.5 rounded-full bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 transition-all text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95 shrink-0"
            >
              {loggingOut ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin text-red-600" />
              ) : (
                <LogOut className="w-3.5 h-3.5 text-red-600" />
              )}
              <span className="text-xs font-bold">Déconnexion</span>
            </button>
          </div>
        </div>

        {/* Ligne 2 : Navigation d'onglets claire (Ne chevauche jamais la marque ou le bouton de déconnexion) */}
        <div className="flex items-center justify-start sm:justify-end overflow-x-auto no-scrollbar pt-1.5 border-t border-slate-100">
          <nav className="flex items-center gap-1 sm:gap-1.5 bg-slate-100/90 p-1 rounded-full border border-slate-200/60 text-xs w-full sm:w-auto justify-between sm:justify-start">
            <Link
              href="/"
              className={`px-3 py-1.5 rounded-full font-bold transition-all flex items-center gap-1.5 text-xs ${
                pathname === '/' ? 'bg-slate-950 text-white shadow-xs' : 'text-slate-700 hover:text-slate-950 hover:bg-white'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Accueil</span>
            </Link>

            <Link
              href="/nouvelle-prestation"
              className={`px-3 py-1.5 rounded-full font-bold transition-all flex items-center gap-1.5 text-xs ${
                pathname === '/nouvelle-prestation' ? 'bg-slate-950 text-white shadow-xs' : 'text-slate-700 hover:text-slate-950 hover:bg-white'
              }`}
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Prestation</span>
            </Link>

            <Link
              href="/recettes"
              className={`px-3 py-1.5 rounded-full font-bold transition-all flex items-center gap-1.5 text-xs ${
                pathname === '/recettes' ? 'bg-slate-950 text-white shadow-xs' : 'text-slate-700 hover:text-slate-950 hover:bg-white'
              }`}
            >
              <Coins className="w-3.5 h-3.5" />
              <span>Recettes</span>
            </Link>

            <Link
              href="/rapports"
              className={`px-3 py-1.5 rounded-full font-bold transition-all flex items-center gap-1.5 text-xs ${
                pathname === '/rapports' ? 'bg-slate-950 text-white shadow-xs' : 'text-slate-700 hover:text-slate-950 hover:bg-white'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Rapports</span>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
