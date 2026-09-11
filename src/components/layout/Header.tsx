import React from 'react';
import { Activity, ShieldCheck, UserCheck } from 'lucide-react';

export function Header() {
  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200 px-6 py-4 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-600 flex items-center justify-center text-white shadow-md shadow-teal-600/20">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">Gestion Clinique</h1>
              <span className="inline-flex items-center gap-1 text-xs font-medium bg-teal-50 text-teal-700 border border-teal-200 px-2 py-0.5 rounded-full">
                <ShieldCheck className="w-3 h-3" />
                V1.0 Initialisé
              </span>
            </div>
            <p className="text-xs text-slate-500">Espace de gestion pour la gérante de clinique</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-3 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg">
            <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-semibold text-xs">
              GC
            </div>
            <div className="text-left text-xs">
              <div className="font-semibold text-slate-800 flex items-center gap-1">
                <UserCheck className="w-3 h-3 text-teal-600" />
                Gérante
              </div>
              <div className="text-slate-500">Administration</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
