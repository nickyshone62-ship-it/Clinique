'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Activity, ShieldCheck, UserCheck, LogOut, Loader2, PlusCircle } from 'lucide-react';

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
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center text-white shadow-lg shadow-teal-500/20 group-hover:scale-105 transition-transform">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-bold text-white tracking-tight">Gestion Clinique</h1>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-teal-500/10 text-teal-400 border border-teal-500/30 px-2 py-0.5 rounded-full">
                  <ShieldCheck className="w-3 h-3" />
                  Neon DB
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">Application exclusive de la gérante</p>
            </div>
          </Link>
        </div>

        {/* Action Rapide & Profil & Bouton Déconnexion */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Bouton Raccourci Nouvelle Prestation */}
          <Link
            href="/nouvelle-prestation"
            className="bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-400 hover:to-cyan-500 text-white text-xs font-semibold px-3.5 py-2 rounded-xl shadow-md shadow-teal-500/20 transition-all flex items-center gap-2 active:scale-95"
          >
            <PlusCircle className="w-4 h-4" />
            <span className="hidden sm:inline">Nouvelle prestation</span>
          </Link>

          <div className="flex items-center gap-3 bg-slate-800/80 border border-slate-700/60 px-3 py-1.5 rounded-xl">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center text-white font-bold text-xs shadow-md">
              {user?.nom ? user.nom.substring(0, 2).toUpperCase() : 'GC'}
            </div>
            <div className="text-left text-xs hidden md:block">
              <div className="font-semibold text-slate-200 flex items-center gap-1">
                <UserCheck className="w-3 h-3 text-teal-400" />
                <span>{user?.nom || 'Gérante'}</span>
              </div>
              <div className="text-slate-400 text-[11px] truncate max-w-[140px]">
                {user?.email || 'Administration'}
              </div>
            </div>
          </div>

          {/* Bouton de déconnexion */}
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            title="Se déconnecter"
            className="p-2.5 sm:px-3.5 sm:py-2 rounded-xl bg-slate-800 hover:bg-red-500/10 border border-slate-700 hover:border-red-500/30 text-slate-300 hover:text-red-400 transition-all text-xs font-semibold flex items-center gap-2 disabled:opacity-50 cursor-pointer"
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
