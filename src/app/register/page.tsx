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
      <div className="min-h-screen bg-slate-950 flex justify-center items-center p-4 text-slate-100 font-sans">
        <div className="flex items-center gap-3 text-teal-400">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span className="text-sm font-medium">Chargement du système...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4 sm:p-6 lg:p-8 text-slate-100 font-sans selection:bg-teal-500 selection:text-white relative overflow-hidden">
      {/* Effets lumineux d'arrière-plan */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-slate-900/90 border border-slate-800/80 backdrop-blur-xl rounded-2xl shadow-2xl p-6 sm:p-8 space-y-6 relative z-10">
        {/* En-tête */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-600 text-white shadow-lg shadow-teal-500/20 mb-1">
            <Activity className="w-8 h-8" />
          </div>
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-teal-400">
              Gestion Clinique
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mt-1">
              Créer le compte Gérante
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xs mx-auto">
            Configuration initiale du compte administrateur unique de la clinique.
          </p>
        </div>

        {/* Si un compte gérante existe déjà */}
        {!canRegister ? (
          <div className="space-y-5 py-4">
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-5 text-center space-y-3">
              <div className="inline-flex p-3 bg-amber-500/20 text-amber-400 rounded-xl">
                <ShieldAlert className="w-8 h-8" />
              </div>
              <h3 className="text-base font-semibold text-white">
                Compte gérante déjà configuré
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Un compte administrateur existe déjà dans la base de données. L&apos;inscription publique est verrouillée par sécurité.
              </p>
            </div>

            <Link
              href="/login"
              className="w-full bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-400 hover:to-cyan-500 text-white font-semibold py-3 px-4 rounded-xl shadow-lg shadow-teal-500/25 transition-all duration-200 flex items-center justify-center gap-2"
            >
              Accéder à la page de connexion
            </Link>
          </div>
        ) : success ? (
          /* En cas de succès */
          <div className="bg-teal-500/10 border border-teal-500/30 text-teal-300 text-sm rounded-2xl p-6 text-center space-y-3 animate-in fade-in zoom-in-95 duration-200">
            <CheckCircle2 className="w-12 h-12 text-teal-400 mx-auto" />
            <h3 className="text-lg font-bold text-white">Compte créé avec succès !</h3>
            <p className="text-xs text-slate-300">
              Connexion en cours et redirection vers votre espace clinique...
            </p>
          </div>
        ) : (
          /* Formulaire d'inscription */
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-xl p-3.5 flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-200">
                <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-400" />
                <span className="font-medium">{error}</span>
              </div>
            )}

            {/* Champ Nom */}
            <div className="space-y-1.5">
              <label htmlFor="nom" className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                Nom complet
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
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
                  className="w-full bg-slate-950/70 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 transition-all disabled:opacity-50"
                />
              </div>
            </div>

            {/* Champ Email */}
            <div className="space-y-1.5">
              <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                Adresse e-mail
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
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
                  className="w-full bg-slate-950/70 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 transition-all disabled:opacity-50"
                />
              </div>
            </div>

            {/* Champ Mot de passe */}
            <div className="space-y-1.5">
              <label htmlFor="password" className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                Mot de passe
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
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
                  className="w-full bg-slate-950/70 border border-slate-800 rounded-xl pl-10 pr-11 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 transition-all disabled:opacity-50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Champ Confirmation du mot de passe */}
            <div className="space-y-1.5">
              <label htmlFor="confirmPassword" className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                Confirmation du mot de passe
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
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
                  className="w-full bg-slate-950/70 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 transition-all disabled:opacity-50"
                />
              </div>
            </div>

            {/* Bouton de soumission */}
            <button
              type="submit"
              disabled={loading || !nom || !email || !password || !confirmPassword}
              className="w-full bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-400 hover:to-cyan-500 text-white font-semibold py-3 px-4 rounded-xl shadow-lg shadow-teal-500/25 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer active:scale-[0.99] mt-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Création du compte...</span>
                </>
              ) : (
                <span>Créer le compte gérante</span>
              )}
            </button>
          </form>
        )}

        {/* Lien vers connexion */}
        <div className="pt-2 text-center border-t border-slate-800/60 flex justify-between items-center text-xs text-slate-400">
          <span>Déjà un compte ?</span>
          <Link href="/login" className="text-teal-400 hover:text-teal-300 font-medium transition-colors">
            Se connecter
          </Link>
        </div>
      </div>
    </div>
  );
}
