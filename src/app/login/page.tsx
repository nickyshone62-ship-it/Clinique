'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, Eye, EyeOff, Activity, AlertCircle, Loader2 } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || 'Identifiants incorrects.');
        setLoading(false);
        return;
      }

      // Redirection après connexion réussie
      router.push('/');
      router.refresh();
    } catch (err) {
      setError('Identifiants incorrects.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f6f2] flex flex-col justify-center items-center p-4 sm:p-6 lg:p-8 text-slate-900 font-sans selection:bg-lime-400 selection:text-slate-950 relative overflow-hidden">
      {/* Conteneur principal Carte Blanche Ultra Clean */}
      <div className="w-full max-w-md bg-white border border-slate-200/80 rounded-[32px] shadow-sm p-6 sm:p-8 space-y-6 relative z-10">
        {/* En-tête de la clinique */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-32 h-32 sm:w-40 sm:h-40 rounded-3xl p-2 border-2 border-slate-200 shadow-md mb-2 overflow-hidden bg-white">
            <img src="/logo.jpg" alt="Logo BK Clinique" className="w-full h-full object-contain rounded-2xl" />
          </div>
          <div>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight uppercase">
              BK CLINIQUE
            </h1>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-800 text-xs font-bold border border-slate-200/80 uppercase tracking-wider mt-2">
              <span className="w-2 h-2 rounded-full bg-lime-400" />
              Plateforme Médicale Gérante
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 font-semibold max-w-xs mx-auto">
            Espace d&apos;administration réservé à la gérante de la clinique.
          </p>
        </div>

        {/* Message d'erreur s'il y a lieu */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-2xl p-3.5 flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-200">
            <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-600" />
            <span className="font-semibold text-xs">{error}</span>
          </div>
        )}

        {/* Formulaire de connexion */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Champ Adresse e-mail */}
          <div className="space-y-1.5">
            <label
              htmlFor="email"
              className="block text-xs font-bold uppercase tracking-wider text-slate-700"
            >
              Adresse e-mail
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="gerante@clinique.local"
                disabled={loading}
                className="w-full bg-slate-50 border border-slate-200/80 rounded-2xl pl-10 pr-4 py-3 text-sm text-slate-900 font-medium placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-950 focus:border-slate-950 transition-all disabled:opacity-50"
              />
            </div>
          </div>

          {/* Champ Mot de passe */}
          <div className="space-y-1.5">
            <label
              htmlFor="password"
              className="block text-xs font-bold uppercase tracking-wider text-slate-700"
            >
              Mot de passe
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                disabled={loading}
                className="w-full bg-slate-50 border border-slate-200/80 rounded-2xl pl-10 pr-11 py-3 text-sm text-slate-900 font-medium placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-950 focus:border-slate-950 transition-all disabled:opacity-50"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-700 transition-colors"
                aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* Bouton de soumission Pilule Noire */}
          <button
            type="submit"
            disabled={loading || !email || !password}
            className="w-full bg-slate-950 hover:bg-slate-800 text-white font-bold py-3.5 px-4 rounded-full shadow-md transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer active:scale-[0.99]"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Connexion en cours...</span>
              </>
            ) : (
              <>
                <span>Se connecter</span>
                <span className="w-2 h-2 rounded-full bg-lime-400" />
              </>
            )}
          </button>
        </form>

        {/* Pied de page du formulaire avec lien vers /register */}
        <div className="pt-3 text-center border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-slate-500 font-medium">
          <span>Plateforme sécurisée &bull; Accès gérante</span>
          <Link href="/register" className="text-slate-900 hover:text-slate-700 font-bold underline transition-colors">
            Créer le compte gérante
          </Link>
        </div>
      </div>
    </div>
  );
}
