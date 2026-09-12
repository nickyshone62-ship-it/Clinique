'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { User, Mail, Lock, Eye, EyeOff, Activity, AlertCircle, CheckCircle2, Loader2, ShieldAlert } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();

  const [nom, setNom] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [checking, setChecking] = useState(true);
  const [canRegister, setCanRegister] = useState(true);

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Vérification de la disponibilité du compte gérante au chargement
  useEffect(() => {
    async function checkAccountStatus() {
      try {
        const res = await fetch('/api/auth/register');
        const data = await res.json();
        setCanRegister(data.canRegister);
      } catch {
        setCanRegister(true);
      } finally {
        setChecking(false);
      }
    }
    checkAccountStatus();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('Le mot de passe et la confirmation ne correspondent pas.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nom,
          email,
          password,
          confirmPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || 'Erreur lors de la création du compte.');
        setLoading(false);
        return;
      }

      setSuccess(true);
      setLoading(false);

      // Redirection automatique après 1.5s
      setTimeout(() => {
        router.push('/');
        router.refresh();
      }, 1500);
    } catch (err) {
      setError('Erreur lors de la création du compte.');
      setLoading(false);
    }
  };

  if (checking) {
    return (
      <div className="min-h-screen bg-[#f5f6f2] flex justify-center items-center p-4 text-slate-900 font-sans">
        <div className="flex items-center gap-3 text-slate-900 font-bold">
          <Loader2 className="w-6 h-6 animate-spin text-slate-950" />
          <span className="text-sm">Chargement du système...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f6f2] flex flex-col justify-center items-center p-4 sm:p-6 lg:p-8 text-slate-900 font-sans selection:bg-lime-400 selection:text-slate-950 relative overflow-hidden">
      <div className="w-full max-w-md bg-white border border-slate-200/80 rounded-[32px] shadow-sm p-6 sm:p-8 space-y-6 relative z-10">
        {/* En-tête */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl p-0.5 border border-slate-200 shadow-sm mb-1 overflow-hidden bg-slate-50">
            <img src="/logo.jpg" alt="Logo Clinique" className="w-full h-full object-cover rounded-[14px]" />
          </div>
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-800 text-[11px] font-bold border border-slate-200/80 uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-lime-400" />
              BK Clinique
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-2">
              Créer le compte Gérante
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 font-medium max-w-xs mx-auto">
            Configuration initiale du compte administrateur unique de la clinique.
          </p>
        </div>

        {/* Si un compte gérante existe déjà */}
        {!canRegister ? (
          <div className="space-y-5 py-4">
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 text-center space-y-3">
              <div className="inline-flex p-3 bg-amber-100 text-amber-800 rounded-2xl">
                <ShieldAlert className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                Compte gérante déjà configuré
              </h3>
              <p className="text-xs text-slate-600 font-medium leading-relaxed">
                Un compte administrateur existe déjà dans la base de données. L&apos;inscription publique est verrouillée par sécurité.
              </p>
            </div>

            <Link
              href="/login"
              className="w-full bg-slate-950 hover:bg-slate-800 text-white font-bold py-3.5 px-4 rounded-full shadow-md transition-all duration-200 flex items-center justify-center gap-2"
            >
              <span>Accéder à la page de connexion</span>
              <span className="w-2 h-2 rounded-full bg-lime-400" />
            </Link>
          </div>
        ) : success ? (
          /* En cas de succès */
          <div className="bg-lime-50 border border-lime-200 text-slate-900 text-sm rounded-2xl p-6 text-center space-y-3 animate-in fade-in zoom-in-95 duration-200">
            <CheckCircle2 className="w-12 h-12 text-slate-900 mx-auto" />
            <h3 className="text-lg font-black text-slate-900">Compte créé avec succès !</h3>
            <p className="text-xs text-slate-600 font-medium">
              Connexion en cours et redirection vers votre espace clinique...
            </p>
          </div>
        ) : (
          /* Formulaire d'inscription */
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-2xl p-3.5 flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-200">
                <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-600" />
                <span className="font-semibold text-xs">{error}</span>
              </div>
            )}

            {/* Champ Nom */}
            <div className="space-y-1.5">
              <label htmlFor="nom" className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Nom complet
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  id="nom"
                  type="text"
                  required
                  autoFocus
                  value={nom}
                  onChange={(e) => setNom(e.target.value)}
                  placeholder="Gérante Clinique"
                  disabled={loading}
                  className="w-full bg-slate-50 border border-slate-200/80 rounded-2xl pl-10 pr-4 py-3 text-sm text-slate-900 font-medium placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-950 focus:border-slate-950 transition-all disabled:opacity-50"
                />
              </div>
            </div>

            {/* Champ Email */}
            <div className="space-y-1.5">
              <label htmlFor="email" className="block text-xs font-bold uppercase tracking-wider text-slate-700">
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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="gerante@clinique.com"
                  disabled={loading}
                  className="w-full bg-slate-50 border border-slate-200/80 rounded-2xl pl-10 pr-4 py-3 text-sm text-slate-900 font-medium placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-950 focus:border-slate-950 transition-all disabled:opacity-50"
                />
              </div>
            </div>

            {/* Champ Mot de passe */}
            <div className="space-y-1.5">
              <label htmlFor="password" className="block text-xs font-bold uppercase tracking-wider text-slate-700">
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
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Champ Confirmation du mot de passe */}
            <div className="space-y-1.5">
              <label htmlFor="confirmPassword" className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Confirmation du mot de passe
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••••••"
                  disabled={loading}
                  className="w-full bg-slate-50 border border-slate-200/80 rounded-2xl pl-10 pr-4 py-3 text-sm text-slate-900 font-medium placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-950 focus:border-slate-950 transition-all disabled:opacity-50"
                />
              </div>
            </div>

            {/* Bouton de soumission */}
            <button
              type="submit"
              disabled={loading || !nom || !email || !password || !confirmPassword}
              className="w-full bg-slate-950 hover:bg-slate-800 text-white font-bold py-3.5 px-4 rounded-full shadow-md transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer active:scale-[0.99] mt-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Création du compte...</span>
                </>
              ) : (
                <>
                  <span>Créer le compte gérante</span>
                  <span className="w-2 h-2 rounded-full bg-lime-400" />
                </>
              )}
            </button>
          </form>
        )}

        {/* Lien vers connexion */}
        <div className="pt-2 text-center border-t border-slate-100 flex justify-between items-center text-xs text-slate-500 font-medium">
          <span>Déjà un compte ?</span>
          <Link href="/login" className="text-slate-900 hover:text-slate-700 font-bold underline transition-colors">
            Se connecter
          </Link>
        </div>
      </div>
    </div>
  );
}
