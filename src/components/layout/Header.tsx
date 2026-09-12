'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
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
    <header className="sticky top-0 z-30 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 text-slate-100 px-4 sm:px-8 py-3.5 shadow-lg">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Marque Clinique */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-3 group">
            <img 
              src="/logo.jpg" 
              alt="Logo Clinique" 
              className="w-10 h-10 rounded-xl object-cover shadow-lg shadow-lime-500/20 border border-lime-500/30 group-hover:scale-105 transition-transform"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-bold text-white tracking-tight">Gestion Clinique</h1>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-lime-400/10 text-lime-400 border border-lime-400/30 px-2 py-0.5 rounded-full">
                  <ShieldCheck className="w-3 h-3 text-lime-400" />
                  Neon DB
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">Application exclusive de la gérante</p>
            </div>
          </Link>
        </div>

        {/* Action Rapides & Profil & Bouton Déconnexion */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Raccourci Recettes */}
          <Link
            href="/recettes"
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold px-3 py-2 rounded-xl border border-slate-700 transition-all flex items-center gap-1.5"
          >
            <Coins className="w-4 h-4 text-lime-400" />
            <span className="hidden md:inline">Recettes &amp; Historique</span>
          </Link>

          {/* Raccourci Nouvelle Prestation */}
          <Link
            href="/nouvelle-prestation"
            className="bg-gradient-to-r from-lime-400 to-emerald-500 hover:from-lime-300 hover:to-emerald-400 text-slate-950 font-bold text-xs px-3 py-2 rounded-xl shadow-md shadow-lime-500/20 transition-all flex items-center gap-1.5 active:scale-95"
          >
            <PlusCircle className="w-4 h-4 text-slate-950" />
            <span className="hidden sm:inline">Prestation</span>
          </Link>

          <div className="flex items-center gap-2 sm:gap-3 bg-slate-800/80 border border-slate-700/60 px-3 py-1.5 rounded-xl">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-lime-400 to-emerald-500 flex items-center justify-center text-slate-950 font-bold text-xs shadow-md">
              {user?.nom ? user.nom.substring(0, 2).toUpperCase() : 'GC'}
            </div>
            <div className="text-left text-xs hidden lg:block">
              <div className="font-semibold text-slate-200 flex items-center gap-1">
                <UserCheck className="w-3 h-3 text-lime-400" />
                <span>{user?.nom || 'Gérante'}</span>
              </div>
              <div className="text-slate-400 text-[11px] truncate max-w-[130px]">
                {user?.email || 'Administration'}
              </div>
            </div>
          </div>

          {/* Bouton de déconnexion */}
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            title="Se déconnecter"
            className="p-2 sm:px-3 sm:py-2 rounded-xl bg-slate-800 hover:bg-red-500/10 border border-slate-700 hover:border-red-500/30 text-slate-300 hover:text-red-400 transition-all text-xs font-semibold flex items-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            {loggingOut ? (
              <Loader2 className="w-4 h-4 animate-spin text-red-400" />
            ) : (
              <LogOut className="w-4 h-4" />
            )}
            <span className="hidden sm:inline">Déconnexion</span>
          </button>
        </div>
      </div>
    </header>
  );
}
