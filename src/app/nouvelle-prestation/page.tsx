'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Stethoscope, 
  FolderTree, 
  Coins, 
  Calendar, 
  Clock, 
  PlusCircle, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  ArrowLeft,
  Activity
} from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';

interface Service {
  id: string;
  nom: string;
  actif: boolean;
}

interface Category {
  id: string;
  nom: string;
  services: Service[];
}

export default function NouvellePrestationPage() {
  const router = useRouter();

  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryNom, setSelectedCategoryNom] = useState<string>('');
  const [selectedServiceId, setSelectedServiceId] = useState<string>('');
  const [montant, setMontant] = useState<string>('');

  // Initialisation automatique avec l'heure et la date locales du Burkina Faso (Africa/Ouagadougou UTC+0)
  const [datePrestation, setDatePrestation] = useState<string>('');
  const [heurePrestation, setHeurePrestation] = useState<string>('');

  const [loadingData, setLoadingData] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<any | null>(null);

  // Initialisation horodatage Burkina Faso (UTC+0)
  useEffect(() => {
    const now = new Date();
    // Format YYYY-MM-DD pour le champ type="date"
    const localDateStr = now.toLocaleDateString('en-CA', { timeZone: 'Africa/Ouagadougou' });
    // Format HH:mm pour le champ type="time"
    const localTimeStr = now.toLocaleTimeString('fr-FR', {
      timeZone: 'Africa/Ouagadougou',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });

    setDatePrestation(localDateStr);
    setHeurePrestation(localTimeStr);
  }, []);

  // Chargement dynamique des catégories et services depuis Neon PostgreSQL
  useEffect(() => {
    async function loadCategories() {
      try {
        const res = await fetch('/api/categories');
        const data = await res.json();

        if (res.ok && data.success) {
          setCategories(data.categories);
          if (data.categories.length > 0) {
            const firstCat = data.categories[0];
            setSelectedCategoryNom(firstCat.nom);
            if (firstCat.services.length > 0) {
              setSelectedServiceId(firstCat.services[0].id);
            }
          }
        } else {
          setError(data.error || 'Erreur lors du chargement des catégories.');
        }
      } catch (err) {
        setError('Impossible de se connecter au serveur.');
      } finally {
        setLoadingData(false);
      }
    }
    loadCategories();
  }, []);

  // Services de la catégorie sélectionnée
  const activeCategory = categories.find((c) => c.nom === selectedCategoryNom);
  const availableServices = activeCategory ? activeCategory.services : [];

  // Mettre à jour le service sélectionné par défaut lors du changement de catégorie
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCatNom = e.target.value;
    setSelectedCategoryNom(newCatNom);
    const newCat = categories.find((c) => c.nom === newCatNom);
    if (newCat && newCat.services.length > 0) {
      setSelectedServiceId(newCat.services[0].id);
    } else {
      setSelectedServiceId('');
    }
  };

  // Soumission du formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const numMontant = Number(montant.replace(/\s/g, ''));

    if (!selectedServiceId) {
      setError('Veuillez sélectionner un service médical.');
      return;
    }

    if (isNaN(numMontant) || numMontant <= 0) {
      setError('Le montant payé doit être un nombre strictement supérieur à 0 FCFA.');
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch('/api/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          serviceId: selectedServiceId,
          montant: numMontant,
          datePrestation,
          heurePrestation,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || 'Erreur lors de l\'enregistrement de la prestation.');
        setSubmitting(false);
        return;
      }

      setSuccessData(data.transaction);
      setSubmitting(false);
    } catch (err) {
      setError('Erreur lors de l\'enregistrement de la prestation.');
      setSubmitting(false);
    }
  };

  // Réinitialisation pour enchaîner une autre saisie
  const handleResetForNew = () => {
    setSuccessData(null);
    setMontant('');
    setError(null);
    
    // Mettre à jour l'heure actuelle du Burkina Faso
    const now = new Date();
    const localTimeStr = now.toLocaleTimeString('fr-FR', {
      timeZone: 'Africa/Ouagadougou',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
    setHeurePrestation(localTimeStr);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-teal-500 selection:text-white">
      <Header />

      <div className="flex">
        <Sidebar categoriesCount={categories.length || 3} servicesCount={17} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-4xl">
          {/* Navigation & Retour */}
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-lime-400 transition-colors bg-slate-900/80 border border-slate-800 px-3.5 py-2 rounded-xl"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Retour au tableau de bord</span>
            </Link>

            <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-lime-400/10 text-lime-400 border border-lime-400/30 px-3 py-1 rounded-full">
              <Activity className="w-3.5 h-3.5 text-lime-400" />
              Burkina Faso (UTC+0)
            </span>
          </div>

          {/* Conteneur principal */}
          <div className="bg-slate-900/90 border border-slate-800/80 backdrop-blur-xl rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
            {/* En-tête de la page */}
            <div className="space-y-2 border-b border-slate-800/80 pb-5">
              <div className="inline-flex items-center gap-2 text-xs font-bold text-lime-400 uppercase tracking-wider">
                <PlusCircle className="w-4 h-4 text-lime-400" />
                <span>Saisie des Recettes</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Nouvelle prestation
              </h1>
              <p className="text-xs sm:text-sm text-slate-400">
                Enregistrez le montant réellement payé par le patient pour la prestation réalisée.
              </p>
            </div>

            {/* Affichage des Erreurs */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-2xl p-4 flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-200">
                <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-400" />
                <span className="font-medium">{error}</span>
              </div>
            )}

            {/* Chargement initial des données */}
            {loadingData ? (
              <div className="py-12 flex flex-col items-center justify-center space-y-3 text-slate-400">
                <Loader2 className="w-8 h-8 text-lime-400 animate-spin" />
                <span className="text-xs font-medium">Chargement des catégories et services depuis Neon...</span>
              </div>
            ) : successData ? (
              /* Carte de succès d'enregistrement */
              <div className="bg-lime-400/10 border border-lime-400/30 rounded-2xl p-6 space-y-5 text-center animate-in fade-in zoom-in-95 duration-200">
                <div className="inline-flex p-3 bg-lime-400/20 text-lime-400 rounded-2xl">
                  <CheckCircle2 className="w-10 h-10" />
                </div>

                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-white">Prestation enregistrée avec succès !</h3>
                  <p className="text-xs text-slate-300">
                    La transaction a été sauvegardée dans la base de données Neon PostgreSQL.
                  </p>
                </div>

                {/* Récapitulatif de la prestation */}
                <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 text-left space-y-2 text-xs">
                  <div className="flex justify-between border-b border-slate-800/60 pb-2">
                    <span className="text-slate-400">Catégorie :</span>
                    <span className="font-semibold text-lime-300">{successData.service.categorie}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-800/60 pb-2">
                    <span className="text-slate-400">Service :</span>
                    <span className="font-semibold text-white">{successData.service.nom}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-800/60 pb-2">
                    <span className="text-slate-400">Montant réellement payé :</span>
                    <span className="font-bold text-lime-400 text-sm">
                      {successData.montant.toLocaleString('fr-FR')} FCFA
                    </span>
                  </div>
                  <div className="flex justify-between pt-1 text-slate-400 text-[11px]">
                    <span>Date &amp; Heure (UTC+0) :</span>
                    <span className="font-medium text-slate-300">
                      {new Date(successData.datePrestation).toLocaleDateString('fr-FR')} à {new Date(successData.heurePrestation).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' })}
                    </span>
                  </div>
                </div>

                {/* Actions post-succès */}
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <button
                    onClick={handleResetForNew}
                    className="flex-1 bg-gradient-to-r from-lime-400 to-emerald-500 hover:from-lime-300 hover:to-emerald-400 text-slate-950 font-bold py-3 px-4 rounded-xl shadow-lg shadow-lime-500/20 text-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <PlusCircle className="w-4 h-4 text-slate-950" />
                    <span>Enregistrer une autre prestation</span>
                  </button>
                  <Link
                    href="/"
                    className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-semibold py-3 px-4 rounded-xl text-xs transition-all flex items-center justify-center gap-2"
                  >
                    <span>Retour au tableau de bord</span>
                  </Link>
                </div>
              </div>
            ) : (
              /* Formulaire de création de prestation */
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* 1. Sélection de la Catégorie */}
                <div className="space-y-1.5">
                  <label htmlFor="category" className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                    1. Catégorie
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                      <FolderTree className="w-4 h-4" />
                    </div>
                    <select
                      id="category"
                      value={selectedCategoryNom}
                      onChange={handleCategoryChange}
                      className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-lime-400/50 focus:border-lime-400 transition-all appearance-none cursor-pointer"
                    >
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.nom} className="bg-slate-900 text-white">
                          {cat.nom} ({cat.services.length} services)
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* 2. Sélection du Service */}
                <div className="space-y-1.5">
                  <label htmlFor="service" className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                    2. Service
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                      <Stethoscope className="w-4 h-4" />
                    </div>
                    <select
                      id="service"
                      value={selectedServiceId}
                      onChange={(e) => setSelectedServiceId(e.target.value)}
                      disabled={availableServices.length === 0}
                      className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-lime-400/50 focus:border-lime-400 transition-all appearance-none cursor-pointer disabled:opacity-50"
                    >
                      {availableServices.length === 0 ? (
                        <option value="">Aucun service actif dans cette catégorie</option>
                      ) : (
                        availableServices.map((s) => (
                          <option key={s.id} value={s.id} className="bg-slate-900 text-white">
                            {s.nom}
                          </option>
                        ))
                      )}
                    </select>
                  </div>
                </div>

                {/* 3. Champ Montant payé (FCFA) */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label htmlFor="montant" className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                      3. Montant payé (FCFA)
                    </label>
                    <span className="text-[11px] text-lime-400 font-medium flex items-center gap-1">
                      <Coins className="w-3.5 h-3.5" />
                      Pas de prix prédéfini
                    </span>
                  </div>

                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                      <Coins className="w-4 h-4" />
                    </div>
                    <input
                      id="montant"
                      type="number"
                      min="1"
                      step="1"
                      required
                      value={montant}
                      onChange={(e) => setMontant(e.target.value)}
                      placeholder="10000"
                      disabled={submitting}
                      className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-10 pr-16 py-3 text-base font-bold text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-lime-400/50 focus:border-lime-400 transition-all disabled:opacity-50"
                    />
                    <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-xs font-extrabold text-lime-400">
                      FCFA
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-400 leading-relaxed pt-0.5">
                    Saisissez le montant réel payé par le patient pour cette prestation spécifique.
                  </p>
                </div>

                {/* 4. Champs Date et Heure (Burkina Faso UTC+0) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Champ Date */}
                  <div className="space-y-1.5">
                    <label htmlFor="datePrestation" className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                      4. Date de la prestation
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                        <Calendar className="w-4 h-4" />
                      </div>
                      <input
                        id="datePrestation"
                        type="date"
                        required
                        value={datePrestation}
                        onChange={(e) => setDatePrestation(e.target.value)}
                        disabled={submitting}
                        className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-lime-400/50 focus:border-lime-400 transition-all disabled:opacity-50"
                      />
                    </div>
                  </div>

                  {/* Champ Heure */}
                  <div className="space-y-1.5">
                    <label htmlFor="heurePrestation" className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                      5. Heure de la prestation
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                        <Clock className="w-4 h-4" />
                      </div>
                      <input
                        id="heurePrestation"
                        type="time"
                        required
                        value={heurePrestation}
                        onChange={(e) => setHeurePrestation(e.target.value)}
                        disabled={submitting}
                        className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-lime-400/50 focus:border-lime-400 transition-all disabled:opacity-50"
                      />
                    </div>
                  </div>
                </div>

                {/* Bouton de Validation */}
                <button
                  type="submit"
                  disabled={submitting || !selectedServiceId || !montant || Number(montant) <= 0}
                  className="w-full bg-gradient-to-r from-lime-400 to-emerald-500 hover:from-lime-300 hover:to-emerald-400 text-slate-950 font-bold py-3.5 px-4 rounded-xl shadow-lg shadow-lime-500/25 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer active:scale-[0.99] mt-4"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Enregistrement en cours...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-5 h-5" />
                      <span>Enregistrer la prestation</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
