'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Coins, 
  Calendar, 
  Filter, 
  Printer, 
  Search, 
  FolderTree, 
  Stethoscope, 
  Loader2, 
  TrendingUp, 
  CalendarDays,
  FileSpreadsheet,
  ArrowRight,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';

export default function RecettesPage() {
  const [period, setPeriod] = useState<string>('month'); // today, week, month, all, custom
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');
  const [selectedServiceId, setSelectedServiceId] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [data, setData] = useState<any | null>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Initialisation des catégories pour les filtres
  useEffect(() => {
    async function loadCategories() {
      try {
        const res = await fetch('/api/categories');
        const json = await res.json();
        if (res.ok && json.success) {
          setCategories(json.categories);
        }
      } catch {
        // Ignorer silencieusement
      }
    }
    loadCategories();
  }, []);

  // Chargement des données financières depuis l'API
  useEffect(() => {
    async function fetchSummary() {
      setLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams();
        params.set('period', period);
        if (startDate) params.set('startDate', startDate);
        if (endDate) params.set('endDate', endDate);
        if (selectedCategoryId) params.set('categoryId', selectedCategoryId);
        if (selectedServiceId) params.set('serviceId', selectedServiceId);

        const res = await fetch(`/api/recettes/summary?${params.toString()}`);
        const json = await res.json();

        if (res.ok && json.success) {
          setData(json);
        } else {
          setError(json.error || 'Erreur lors du chargement des recettes.');
        }
      } catch (err) {
        setError('Impossible de se connecter au serveur.');
      } finally {
        setLoading(false);
      }
    }
    fetchSummary();
  }, [period, startDate, endDate, selectedCategoryId, selectedServiceId]);

  // Filtrage local de l'historique par recherche textuelle
  const filteredTransactions = data?.transactions?.filter((t: any) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      t.service.nom.toLowerCase().includes(q) ||
      t.service.categorie.toLowerCase().includes(q) ||
      t.montant.toString().includes(q)
    );
  }) || [];

  // Active category services for filter
  const activeCat = categories.find((c) => c.id === selectedCategoryId);
  const availableServices = activeCat ? activeCat.services : [];

  return (
    <div className="min-h-screen bg-[#f5f6f2] text-slate-900 font-sans selection:bg-lime-400 selection:text-slate-950">
      <Header />

      <div className="flex">
        <Sidebar categoriesCount={3} servicesCount={17} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl">
          {/* En-tête de page & actions - Style Carte Blanche Modèle */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-200/80 p-6 sm:p-8 rounded-[32px] shadow-sm relative overflow-hidden">
            <div className="relative z-10 space-y-2">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-100 text-slate-800 text-xs font-bold border border-slate-200/80">
                <Coins className="w-4 h-4 text-slate-900" />
                <span>Suivi Financier Gérante</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
                Recettes &amp; Historique des Prestations<span className="w-3 h-3 rounded-full bg-lime-400 inline-block ml-1" />
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 font-medium max-w-xl">
                Consultez vos recettes en FCFA par période, par catégorie et par service.
              </p>
            </div>

            <div className="relative z-10 flex flex-wrap gap-3">
              <Link
                href="/nouvelle-prestation"
                className="bg-slate-950 hover:bg-slate-800 text-white font-bold py-3 px-5 rounded-full shadow-md text-xs transition-all flex items-center gap-2"
              >
                <span className="text-lime-400 font-black text-sm">+</span>
                <span>Nouvelle prestation</span>
              </Link>
              <Link
                href="/rapports"
                className="bg-slate-100 hover:bg-slate-200/80 border border-slate-200/80 text-slate-800 font-bold py-3 px-5 rounded-full text-xs transition-all flex items-center gap-2"
              >
                <Printer className="w-4 h-4 text-slate-700" />
                <span>Imprimer le Rapport</span>
              </Link>
            </div>
          </div>

          {/* Grille de synthèse des métriques financières - Cartes Blanches */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {/* Recette Aujourd'hui */}
            <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Aujourd&apos;hui</span>
                <div className="p-2.5 bg-slate-100 text-slate-900 rounded-2xl border border-slate-200/60">
                  <Coins className="w-5 h-5 text-slate-800" />
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-black text-slate-900">
                {data?.summary ? data.summary.totalToday.toLocaleString('fr-FR') : '0'} <span className="text-xs font-bold text-slate-500">FCFA</span>
              </div>
              <p className="text-xs font-medium text-slate-500">Recette totale du jour</p>
            </div>

            {/* Recette Cette Semaine */}
            <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Cette Semaine</span>
                <div className="p-2.5 bg-slate-100 text-slate-900 rounded-2xl border border-slate-200/60">
                  <TrendingUp className="w-5 h-5 text-slate-800" />
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-black text-slate-900">
                {data?.summary ? data.summary.totalWeek.toLocaleString('fr-FR') : '0'} <span className="text-xs font-bold text-slate-500">FCFA</span>
              </div>
              <p className="text-xs font-medium text-slate-500">Recette des 7 derniers jours</p>
            </div>

            {/* Recette Ce Mois-ci */}
            <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Ce Mois-ci</span>
                <div className="p-2.5 bg-slate-100 text-slate-900 rounded-2xl border border-slate-200/60">
                  <CalendarDays className="w-5 h-5 text-slate-800" />
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-black text-slate-900">
                {data?.summary ? data.summary.totalMonth.toLocaleString('fr-FR') : '0'} <span className="text-xs font-bold text-slate-500">FCFA</span>
              </div>
              <p className="text-xs font-medium text-slate-500">Recette du mois en cours</p>
            </div>

            {/* Total Filtré Sélectionné */}
            <div className="bg-white border-2 border-slate-950 rounded-3xl p-6 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-slate-950">Total Sélectionné</span>
                <div className="p-2.5 bg-lime-400 text-slate-950 rounded-2xl font-bold shadow-xs">
                  <FileSpreadsheet className="w-5 h-5" />
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-black text-slate-950">
                {data?.summary ? data.summary.totalFiltered.toLocaleString('fr-FR') : '0'} <span className="text-xs text-slate-600 font-bold">FCFA</span>
              </div>
              <p className="text-xs font-bold text-slate-600">
                {data?.summary ? data.summary.countFiltered : 0} prestations enregistrées
              </p>
            </div>
          </div>

          {/* Barre de Filtres par Période, Catégorie et Service */}
          <div className="bg-white border border-slate-200/80 rounded-[32px] p-6 space-y-5 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-slate-800" />
                <h2 className="text-base font-black text-slate-900">Filtres de Recherche &amp; Période</h2>
              </div>

              {/* Presets de période en style pilules */}
              <div className="flex flex-wrap gap-2 text-xs">
                {[
                  { key: 'today', label: "Aujourd'hui" },
                  { key: 'week', label: 'Cette semaine' },
                  { key: 'month', label: 'Ce mois-ci' },
                  { key: 'all', label: 'Toutes les recettes' },
                  { key: 'custom', label: 'Période personnalisée' },
                ].map((p) => (
                  <button
                    key={p.key}
                    onClick={() => setPeriod(p.key)}
                    className={`px-4 py-2 rounded-full font-bold transition-all cursor-pointer ${
                      period === p.key
                        ? 'bg-slate-950 text-white shadow-md'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200/80 border border-slate-200/60'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Inputs de filtres personnalisés et catégories/services */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Filtre Catégorie */}
              <div className="space-y-1">
                <label className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Catégorie</label>
                <select
                  value={selectedCategoryId}
                  onChange={(e) => {
                    setSelectedCategoryId(e.target.value);
                    setSelectedServiceId('');
                  }}
                  className="w-full bg-slate-50 border border-slate-200/80 rounded-2xl px-3.5 py-3 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-lime-400 focus:bg-white"
                >
                  <option value="">Toutes les catégories</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.nom}
                    </option>
                  ))}
                </select>
              </div>

              {/* Filtre Service */}
              <div className="space-y-1">
                <label className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Service</label>
                <select
                  value={selectedServiceId}
                  onChange={(e) => setSelectedServiceId(e.target.value)}
                  disabled={!selectedCategoryId}
                  className="w-full bg-slate-50 border border-slate-200/80 rounded-2xl px-3.5 py-3 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-lime-400 focus:bg-white disabled:opacity-50"
                >
                  <option value="">Tous les services</option>
                  {availableServices.map((s: any) => (
                    <option key={s.id} value={s.id}>
                      {s.nom}
                    </option>
                  ))}
                </select>
              </div>

              {/* Champs Date Personnalisée */}
              {period === 'custom' ? (
                <>
                  <div className="space-y-1">
                    <label className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Du (Date Début)</label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200/80 rounded-2xl px-3.5 py-3 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-lime-400"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Au (Date Fin)</label>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200/80 rounded-2xl px-3.5 py-3 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-lime-400"
                    />
                  </div>
                </>
              ) : (
                <div className="sm:col-span-2 space-y-1">
                  <label className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Recherche Rapide</label>
                  <div className="relative">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      placeholder="Rechercher un service, une catégorie ou un montant..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200/80 rounded-2xl pl-10 pr-4 py-3 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-lime-400 focus:bg-white"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Section 1 : Ventilation par Catégorie */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 bg-white border border-slate-200/80 rounded-[32px] p-6 space-y-5 shadow-sm">
              <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
                <FolderTree className="w-5 h-5 text-slate-800" />
                <span>Recettes par Catégorie</span>
              </h2>

              {loading ? (
                <div className="py-8 flex justify-center text-slate-900">
                  <Loader2 className="w-6 h-6 animate-spin" />
                </div>
              ) : data?.byCategory?.length === 0 ? (
                <p className="text-xs font-medium text-slate-500 text-center py-6">Aucune recette sur cette période.</p>
              ) : (
                <div className="space-y-4">
                  {data?.byCategory?.map((cat: any) => {
                    const percentage = data.summary.totalFiltered > 0 
                      ? Math.round((cat.total / data.summary.totalFiltered) * 100) 
                      : 0;

                    return (
                      <div key={cat.id} className="bg-slate-50/70 border border-slate-200/70 rounded-2xl p-4 space-y-2">
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-extrabold text-slate-900 uppercase">{cat.nom}</span>
                          <span className="font-black text-slate-950 bg-lime-400 px-2.5 py-0.5 rounded-full">{cat.total.toLocaleString('fr-FR')} FCFA</span>
                        </div>
                        <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                          <div
                            className="bg-gradient-to-r from-lime-400 to-yellow-300 h-full rounded-full transition-all duration-500"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-[10px] text-slate-500 font-semibold pt-0.5">
                          <span>{cat.count} prestation(s)</span>
                          <span>{percentage}% du total</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Section 2 : Ventilation par Service */}
            <div className="lg:col-span-2 bg-white border border-slate-200/80 rounded-[32px] p-6 space-y-5 shadow-sm">
              <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Stethoscope className="w-5 h-5 text-slate-800" />
                <span>Recettes par Service Médical</span>
              </h2>

              {loading ? (
                <div className="py-8 flex justify-center text-slate-900">
                  <Loader2 className="w-6 h-6 animate-spin" />
                </div>
              ) : data?.byService?.length === 0 ? (
                <p className="text-xs font-medium text-slate-500 text-center py-6">Aucun service enregistré sur cette période.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left text-slate-800">
                    <thead className="text-[11px] font-bold uppercase bg-slate-50 text-slate-500 border-b border-slate-200/80">
                      <tr>
                        <th className="px-4 py-3">Service</th>
                        <th className="px-4 py-3">Catégorie</th>
                        <th className="px-4 py-3 text-center">Actes</th>
                        <th className="px-4 py-3 text-right">Recette Totale</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {data?.byService?.map((srv: any) => (
                        <tr key={srv.id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-4 py-3 font-bold text-slate-900">{srv.nom}</td>
                          <td className="px-4 py-3 text-slate-600 font-medium">{srv.categorieNom}</td>
                          <td className="px-4 py-3 text-center font-bold text-slate-900">{srv.count}</td>
                          <td className="px-4 py-3 text-right font-black text-slate-950">
                            {srv.total.toLocaleString('fr-FR')} FCFA
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* Section 3 : Historique Détaillé des Prestations */}
          <div className="bg-white border border-slate-200/80 rounded-[32px] p-6 sm:p-8 space-y-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-xl font-black text-slate-900 tracking-tight">Historique Détaillé des Prestations</h2>
                <p className="text-xs font-medium text-slate-500 mt-1">
                  {filteredTransactions.length} prestation(s) affichée(s) pour la période sélectionnée.
                </p>
              </div>

              <Link
                href="/rapports"
                className="bg-slate-100 hover:bg-slate-200/80 border border-slate-200 text-slate-800 font-bold py-2.5 px-4 rounded-full text-xs transition-all flex items-center gap-2 self-start sm:self-auto"
              >
                <Printer className="w-4 h-4 text-slate-700" />
                <span>Format Imprimable</span>
              </Link>
            </div>

            {loading ? (
              <div className="py-12 flex justify-center text-slate-900">
                <Loader2 className="w-8 h-8 animate-spin" />
              </div>
            ) : filteredTransactions.length === 0 ? (
              <div className="py-12 text-center space-y-3">
                <Coins className="w-10 h-10 text-slate-400 mx-auto" />
                <p className="text-sm font-bold text-slate-800">Aucune prestation trouvée</p>
                <p className="text-xs font-medium text-slate-500">Essayez de modifier les filtres ou enregistrez une nouvelle prestation.</p>
                <Link
                  href="/nouvelle-prestation"
                  className="inline-flex items-center gap-2 text-xs font-bold text-slate-900 hover:text-slate-700 pt-2"
                >
                  <span>Saisir une nouvelle prestation</span>
                  <ChevronRight className="w-4 h-4 text-lime-400" />
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left text-slate-800">
                  <thead className="text-[11px] font-bold uppercase bg-slate-50 text-slate-500 border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-3.5">Date &amp; Heure (UTC+0)</th>
                      <th className="px-4 py-3.5">Catégorie</th>
                      <th className="px-4 py-3.5">Service Réalisé</th>
                      <th className="px-4 py-3.5 text-right">Montant Payé (FCFA)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredTransactions.map((t: any) => {
                      const dateStr = new Date(t.datePrestation).toLocaleDateString('fr-FR');
                      const timeStr = new Date(t.heurePrestation).toLocaleTimeString('fr-FR', {
                        hour: '2-digit',
                        minute: '2-digit',
                        timeZone: 'UTC',
                      });

                      return (
                        <tr key={t.id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-4 py-3.5 font-bold text-slate-900">
                            {dateStr} à <span className="text-slate-500 font-medium">{timeStr}</span>
                          </td>
                          <td className="px-4 py-3.5 font-bold text-slate-700 uppercase">
                            {t.service.categorie}
                          </td>
                          <td className="px-4 py-3.5 font-bold text-slate-900">
                            {t.service.nom}
                          </td>
                          <td className="px-4 py-3.5 text-right font-black text-slate-950 text-sm">
                            {t.montant.toLocaleString('fr-FR')} FCFA
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}


