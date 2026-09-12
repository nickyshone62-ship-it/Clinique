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
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200/80 text-slate-900 px-4 sm:px-8 py-3.5 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Marque Clinique */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-3 group">
            <img 
              src="/logo.jpg" 
              alt="Logo BK Clinique" 
              className="h-12 sm:h-16 w-auto max-w-[220px] sm:max-w-[280px] rounded-2xl object-contain bg-white p-1.5 shadow-sm border border-slate-200 group-hover:scale-105 transition-transform"
            />
            <div className="hidden md:block">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-lime-400 inline-block" />
                <span className="text-xs font-bold text-slate-500">&bull; Espace Gérante</span>
              </div>
            </div>
          </Link>
        </div>

        {/* Action Rapides & Profil & Bouton Déconnexion */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Raccourci Recettes */}
          <Link
            href="/recettes"
            className="bg-slate-100 hover:bg-slate-200/80 text-slate-800 text-xs font-bold px-4 py-2 rounded-full border border-slate-200/80 transition-all flex items-center gap-1.5"
          >
            <Coins className="w-4 h-4 text-slate-700" />
            <span className="hidden md:inline">Recettes &amp; Historique</span>
          </Link>

          {/* Raccourci Nouvelle Prestation */}
          <Link
            href="/nouvelle-prestation"
            className="bg-slate-950 hover:bg-slate-800 text-white text-xs font-bold px-4 py-2 rounded-full shadow-md transition-all flex items-center gap-1.5 active:scale-95"
          >
            <PlusCircle className="w-4 h-4 text-lime-400" />
            <span className="hidden sm:inline">Prestation</span>
          </Link>

          <div className="flex items-center gap-2 sm:gap-2.5 bg-slate-100 border border-slate-200/80 px-3 py-1 rounded-full">
            <div className="w-7 h-7 sm:w-7 sm:h-7 rounded-full bg-slate-950 text-white flex items-center justify-center font-bold text-xs shadow-sm">
              {user?.nom ? user.nom.substring(0, 2).toUpperCase() : 'GC'}
            </div>
            <div className="text-left text-xs hidden lg:block">
              <div className="font-bold text-slate-900 flex items-center gap-1">
                <UserCheck className="w-3 h-3 text-slate-700" />
                <span>{user?.nom || 'Gérante'}</span>
              </div>
            </div>
          </div>

          {/* Bouton de déconnexion */}
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            title="Se déconnecter"
            className="p-2 sm:px-3 sm:py-2 rounded-full bg-slate-100 hover:bg-red-50 text-slate-700 hover:text-red-600 border border-slate-200/80 transition-all text-xs font-bold flex items-center gap-1.5 cursor-pointer"
          >
            {loggingOut ? (
              <Loader2 className="w-4 h-4 animate-spin text-red-500" />
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
