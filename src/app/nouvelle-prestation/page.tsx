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
    });
    setHeurePrestation(localTimeStr);
  };

  return (
    <div className="min-h-screen bg-[#f5f6f2] text-slate-900 font-sans selection:bg-lime-400 selection:text-slate-950">
      <Header />

      <div className="flex">
        <Sidebar categoriesCount={categories.length || 3} servicesCount={17} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-4xl">
          {/* Navigation & Retour */}
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs font-bold text-slate-700 hover:text-slate-950 transition-colors bg-white border border-slate-200/80 px-4 py-2 rounded-full shadow-xs"
            >
              <ArrowLeft className="w-4 h-4 text-slate-900" />
              <span>Retour au tableau de bord</span>
            </Link>

            <span className="inline-flex items-center gap-1.5 text-xs font-bold bg-white text-slate-800 border border-slate-200/80 px-4 py-1.5 rounded-full shadow-xs">
              <span className="w-2 h-2 rounded-full bg-lime-400" />
              Burkina Faso (UTC+0)
            </span>
          </div>

          {/* Conteneur principal - Carte Blanche Arrondie */}
          <div className="bg-white border border-slate-200/80 rounded-[32px] p-6 sm:p-10 space-y-6 shadow-sm">
            {/* En-tête de la page */}
            <div className="space-y-2 border-b border-slate-100 pb-5">
              <div className="inline-flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-wider">
                <PlusCircle className="w-4 h-4 text-slate-900" />
                <span>Saisie des Recettes</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
                Nouvelle prestation<span className="w-3 h-3 rounded-full bg-lime-400 inline-block ml-1" />
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 font-medium">
                Enregistrez le montant réellement payé par le patient pour la prestation réalisée.
              </p>
            </div>

            {/* Affichage des Erreurs */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-2xl p-4 flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-200">
                <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-600" />
                <span className="font-medium">{error}</span>
              </div>
            )}

            {/* Chargement initial des données */}
            {loadingData ? (
              <div className="py-12 flex flex-col items-center justify-center space-y-3 text-slate-500">
                <Loader2 className="w-8 h-8 text-slate-900 animate-spin" />
                <span className="text-xs font-semibold">Chargement des catégories et services depuis Neon...</span>
              </div>
            ) : successData ? (
              /* Carte de succès d'enregistrement */
              <div className="bg-slate-50 border border-slate-200/80 rounded-[28px] p-8 space-y-6 text-center animate-in fade-in zoom-in-95 duration-200">
                <div className="inline-flex p-4 bg-lime-400 text-slate-950 rounded-full shadow-sm">
                  <CheckCircle2 className="w-10 h-10" />
                </div>

                <div className="space-y-1">
                  <h3 className="text-xl font-black text-slate-900">Prestation enregistrée avec succès !</h3>
                  <p className="text-xs text-slate-500 font-medium">
                    La transaction a été sauvegardée dans la base de données Neon PostgreSQL.
                  </p>
                </div>

                {/* Récapitulatif de la prestation */}
                <div className="bg-white border border-slate-200/80 rounded-2xl p-5 text-left space-y-3 text-xs shadow-xs">
                  <div className="flex justify-between border-b border-slate-100 pb-2">
                    <span className="text-slate-500 font-medium">Catégorie :</span>
                    <span className="font-bold text-slate-900">{successData.service.categorie}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-100 pb-2">
                    <span className="text-slate-500 font-medium">Service :</span>
                    <span className="font-bold text-slate-900">{successData.service.nom}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-100 pb-2">
                    <span className="text-slate-500 font-medium">Montant réellement payé :</span>
                    <span className="font-black text-slate-950 text-base bg-lime-400 px-3 py-0.5 rounded-full">
                      {successData.montant.toLocaleString('fr-FR')} FCFA
                    </span>
                  </div>
                  <div className="flex justify-between pt-1 text-slate-500 text-[11px] font-medium">
                    <span>Date &amp; Heure (UTC+0) :</span>
                    <span className="font-bold text-slate-800">
                      {new Date(successData.datePrestation).toLocaleDateString('fr-FR')} à {new Date(successData.heurePrestation).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' })}
                    </span>
                  </div>
                </div>

                {/* Actions post-succès */}
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <button
                    onClick={handleResetForNew}
                    className="flex-1 bg-slate-950 hover:bg-slate-800 text-white font-bold py-3.5 px-6 rounded-full shadow-md text-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <PlusCircle className="w-4 h-4 text-lime-400" />
                    <span>Enregistrer une autre prestation</span>
                  </button>
                  <Link
                    href="/"
                    className="bg-white hover:bg-slate-100 border border-slate-200 text-slate-800 font-bold py-3.5 px-6 rounded-full text-xs transition-all flex items-center justify-center gap-2"
                  >
                    <span>Retour au tableau de bord</span>
                  </Link>
                </div>
              </div>
            ) : (
              /* Formulaire de création de prestation */
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* 1. Sélection de la Catégorie */}
                <div className="space-y-1.5">
                  <label htmlFor="category" className="block text-xs font-black uppercase tracking-wider text-slate-400">
                    1. Catégorie Médicale
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                      <FolderTree className="w-4 h-4 text-slate-700" />
                    </div>
                    <select
                      id="category"
                      value={selectedCategoryNom}
                      onChange={handleCategoryChange}
                      className="w-full bg-slate-50 border border-slate-200/80 rounded-2xl pl-11 pr-4 py-3.5 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-lime-400 focus:bg-white transition-all appearance-none cursor-pointer"
                    >
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.nom} className="bg-white text-slate-900 font-medium">
                          {cat.nom} ({cat.services.length} services)
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* 2. Sélection du Service */}
                <div className="space-y-1.5">
                  <label htmlFor="service" className="block text-xs font-black uppercase tracking-wider text-slate-400">
                    2. Service Médical
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                      <Stethoscope className="w-4 h-4 text-slate-700" />
                    </div>
                    <select
                      id="service"
                      value={selectedServiceId}
                      onChange={(e) => setSelectedServiceId(e.target.value)}
                      disabled={availableServices.length === 0}
                      className="w-full bg-slate-50 border border-slate-200/80 rounded-2xl pl-11 pr-4 py-3.5 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-lime-400 focus:bg-white transition-all appearance-none cursor-pointer disabled:opacity-50"
                    >
                      {availableServices.length === 0 ? (
                        <option value="">Aucun service actif dans cette catégorie</option>
                      ) : (
                        availableServices.map((s) => (
                          <option key={s.id} value={s.id} className="bg-white text-slate-900 font-medium">
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
                    <label htmlFor="montant" className="block text-xs font-black uppercase tracking-wider text-slate-400">
                      3. Montant réellement payé (FCFA)
                    </label>
                    <span className="text-[11px] text-slate-600 font-bold bg-slate-100 border border-slate-200 px-3 py-0.5 rounded-full flex items-center gap-1">
                      <Coins className="w-3.5 h-3.5 text-slate-700" />
                      Prix variable
                    </span>
                  </div>

                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                      <Coins className="w-4 h-4 text-slate-700" />
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
                      className="w-full bg-slate-50 border border-slate-200/80 rounded-2xl pl-11 pr-20 py-3.5 text-lg font-black text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-lime-400 focus:bg-white transition-all disabled:opacity-50"
                    />
                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-xs font-black text-slate-900 bg-lime-400 my-2 rounded-lg px-2">
                      FCFA
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-500 font-medium leading-relaxed pt-0.5">
                    Saisissez le montant réel payé par le patient pour cette prestation spécifique.
                  </p>
                </div>

                {/* 4. Champs Date et Heure (Burkina Faso UTC+0) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Champ Date */}
                  <div className="space-y-1.5">
                    <label htmlFor="datePrestation" className="block text-xs font-black uppercase tracking-wider text-slate-400">
                      4. Date de la prestation
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                        <Calendar className="w-4 h-4 text-slate-700" />
                      </div>
                      <input
                        id="datePrestation"
                        type="date"
                        required
                        value={datePrestation}
                        onChange={(e) => setDatePrestation(e.target.value)}
                        disabled={submitting}
                        className="w-full bg-slate-50 border border-slate-200/80 rounded-2xl pl-11 pr-4 py-3.5 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-lime-400 focus:bg-white transition-all disabled:opacity-50"
                      />
                    </div>
                  </div>

                  {/* Champ Heure */}
                  <div className="space-y-1.5">
                    <label htmlFor="heurePrestation" className="block text-xs font-black uppercase tracking-wider text-slate-400">
                      5. Heure de la prestation
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                        <Clock className="w-4 h-4 text-slate-700" />
                      </div>
                      <input
                        id="heurePrestation"
                        type="time"
                        required
                        value={heurePrestation}
                        onChange={(e) => setHeurePrestation(e.target.value)}
                        disabled={submitting}
                        className="w-full bg-slate-50 border border-slate-200/80 rounded-2xl pl-11 pr-4 py-3.5 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-lime-400 focus:bg-white transition-all disabled:opacity-50"
                      />
                    </div>
                  </div>
                </div>

                {/* Bouton de Validation - Style Pill Dark */}
                <button
                  type="submit"
                  disabled={submitting || !selectedServiceId || !montant || Number(montant) <= 0}
                  className="w-full bg-slate-950 hover:bg-slate-800 text-white font-bold py-4 px-6 rounded-full shadow-md transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer active:scale-[0.99] mt-6"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin text-lime-400" />
                      <span>Enregistrement en cours...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-5 h-5 text-lime-400" />
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
