'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Printer, 
  ArrowLeft, 
  Coins, 
  Calendar, 
  Loader2, 
  Activity, 
  ShieldCheck,
  FileText
} from 'lucide-react';

export default function RapportsPage() {
  const [period, setPeriod] = useState<string>('month'); // today, week, month, custom
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [categoryId, setCategoryId] = useState<string>('');

  const [data, setData] = useState<any | null>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [userProfile, setUserProfile] = useState<any | null>(null);

  // Initialisation profil et catégories
  useEffect(() => {
    async function init() {
      try {
        const [catRes, meRes] = await Promise.all([
          fetch('/api/categories'),
          fetch('/api/auth/me'),
        ]);

        const catData = await catRes.json();
        const meData = await meRes.json();

        if (catRes.ok && catData.success) setCategories(catData.categories);
        if (meRes.ok && meData.authenticated) setUserProfile(meData.user);
      } catch {
        // Ignorer
      }
    }
    init();
  }, []);

  // Chargement des données de rapport
  useEffect(() => {
    async function fetchReportData() {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        params.set('period', period);
        if (startDate) params.set('startDate', startDate);
        if (endDate) params.set('endDate', endDate);
        if (categoryId) params.set('categoryId', categoryId);

        const res = await fetch(`/api/recettes/summary?${params.toString()}`);
        const json = await res.json();
        if (res.ok && json.success) {
          setData(json);
        }
      } catch {
        // Ignorer
      } finally {
        setLoading(false);
      }
    }
    fetchReportData();
  }, [period, startDate, endDate, categoryId]);

  const handlePrint = () => {
    window.print();
  };

  const getPeriodLabel = () => {
    if (period === 'today') return "Aujourd'hui";
    if (period === 'week') return 'Cette semaine';
    if (period === 'month') return 'Ce mois-ci';
    if (period === 'custom' && startDate && endDate) return `Du ${startDate} au ${endDate}`;
    return 'Période globale';
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-teal-500 selection:text-white p-4 sm:p-8 print:p-0 print:bg-white print:text-black">
      {/* Styles d'impression dédiés */}
      <style jsx global>{`
        @media print {
          body {
            background-color: white !important;
            color: black !important;
          }
          .no-print {
            display: none !important;
          }
          .print-border {
            border: 1px solid #cbd5e1 !important;
          }
          .print-bg-gray {
            background-color: #f8fafc !important;
          }
          .print-text-black {
            color: black !important;
          }
        }
      `}</style>

      {/* Barre d'outils et de contrôle (Masquée à l'impression) */}
      <div className="max-w-4xl mx-auto space-y-6 no-print">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-4 rounded-2xl">
          <Link
            href="/recettes"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-300 hover:text-teal-400 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Retour aux Recettes &amp; Historique</span>
          </Link>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handlePrint}
              className="bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-400 hover:to-cyan-500 text-white font-semibold py-2 px-4 rounded-xl text-xs transition-all flex items-center gap-2 shadow-lg shadow-teal-500/20 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimer le Rapport (PDF)</span>
            </button>
          </div>
        </div>

        {/* Sélection des filtres du rapport */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold text-teal-400 uppercase tracking-wider">
            <FileText className="w-4 h-4" />
            <span>Options d&apos;Édition du Rapport</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-400">Période du Rapport</label>
              <select
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
              >
                <option value="today">Aujourd&apos;hui</option>
                <option value="week">Cette semaine</option>
                <option value="month">Ce mois-ci</option>
                <option value="custom">Période personnalisée</option>
              </select>
            </div>

            {period === 'custom' && (
              <>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-400">Date Début</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-400">Date Fin</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
              </>
            )}

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-400">Catégorie Médicale</label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
              >
                <option value="">Toutes les catégories</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nom}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* RAPPORT OFFICIEL (Visible à l'écran et optimisé pour l'impression) */}
      <div className="max-w-4xl mx-auto bg-white text-slate-900 rounded-3xl p-8 sm:p-12 shadow-2xl mt-6 print:mt-0 print:shadow-none print:rounded-none space-y-8 border border-slate-200 print-border">
        {/* En-tête officiel de la clinique */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b-2 border-slate-900 pb-6 gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <img src="/logo.jpg" alt="Logo Clinique" className="w-12 h-12 rounded-xl object-cover border border-slate-300 print:border-black" />
              <div>
                <h1 className="text-2xl font-black tracking-tight text-slate-900">CLINIQUE MÉDICALE</h1>
              </div>
            </div>
            <p className="text-xs text-slate-600 uppercase font-semibold tracking-widest">
              Rapport d&apos;Activité et de Recettes Financières
            </p>
          </div>

          <div className="text-left sm:text-right text-xs space-y-1 text-slate-700">
            <div>Gérante : <strong className="text-slate-900">{userProfile?.nom || 'Sougue Epiphane'}</strong></div>
            <div>E-mail : {userProfile?.email || 'nickyshone62@gmail.com'}</div>
            <div>Édité le : <strong>{new Date().toLocaleDateString('fr-FR')}</strong> à {new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', timeZone: 'Africa/Ouagadougou' })} (UTC+0)</div>
          </div>
        </div>

        {/* Détails de la période */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs print-bg-gray">
          <div>
            <span className="text-slate-500 font-medium">Période du Rapport : </span>
            <strong className="text-slate-900 font-bold">{getPeriodLabel()}</strong>
          </div>
          <div>
            <span className="text-slate-500 font-medium">Nombre de Prestations : </span>
            <strong className="text-teal-800 font-bold print-text-black">{data?.summary?.countFiltered || 0} actes</strong>
          </div>
        </div>

        {/* Total Général des Recettes */}
        <div className="bg-slate-900 text-white rounded-2xl p-6 flex items-center justify-between print:bg-slate-100 print:text-black print-border">
          <div>
            <span className="text-xs uppercase tracking-wider text-slate-300 print:text-slate-700 font-semibold">Total Général des Recettes</span>
            <h2 className="text-3xl font-black text-amber-400 print-text-black mt-1">
              {data?.summary?.totalFiltered?.toLocaleString('fr-FR') || 0} FCFA
            </h2>
          </div>
          <Coins className="w-10 h-10 text-teal-400 print-text-black opacity-80" />
        </div>

        {/* Ventilation par Catégorie */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-2">
            1. Synthèse par Catégorie
          </h3>

          <table className="w-full text-xs text-left text-slate-800 border border-slate-200 rounded-xl overflow-hidden">
            <thead className="bg-slate-100 uppercase text-slate-700 text-[11px] font-bold border-b border-slate-200">
              <tr>
                <th className="p-3">Catégorie</th>
                <th className="p-3 text-center">Nombre d&apos;actes</th>
                <th className="p-3 text-right">Recette (FCFA)</th>
                <th className="p-3 text-right">% du Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {data?.byCategory?.map((c: any) => {
                const pct = data.summary.totalFiltered > 0 
                  ? Math.round((c.total / data.summary.totalFiltered) * 100) 
                  : 0;
                return (
                  <tr key={c.id} className="hover:bg-slate-50">
                    <td className="p-3 font-bold text-slate-900">{c.nom}</td>
                    <td className="p-3 text-center font-semibold">{c.count}</td>
                    <td className="p-3 text-right font-bold text-teal-800 print-text-black">{c.total.toLocaleString('fr-FR')} FCFA</td>
                    <td className="p-3 text-right font-medium">{pct}%</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Ventilation par Service */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-2">
            2. Détails des Recettes par Service
          </h3>

          <table className="w-full text-xs text-left text-slate-800 border border-slate-200 rounded-xl overflow-hidden">
            <thead className="bg-slate-100 uppercase text-slate-700 text-[11px] font-bold border-b border-slate-200">
              <tr>
                <th className="p-3">Service</th>
                <th className="p-3">Catégorie</th>
                <th className="p-3 text-center">Actes</th>
                <th className="p-3 text-right">Total FCFA</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {data?.byService?.map((s: any) => (
                <tr key={s.id} className="hover:bg-slate-50">
                  <td className="p-3 font-bold text-slate-900">{s.nom}</td>
                  <td className="p-3 font-medium text-slate-600">{s.categorieNom}</td>
                  <td className="p-3 text-center font-semibold">{s.count}</td>
                  <td className="p-3 text-right font-bold text-slate-900">{s.total.toLocaleString('fr-FR')} FCFA</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Liste chronologique des Prestations */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-2">
            3. Registre des Prestations Enregistrées
          </h3>

          <table className="w-full text-xs text-left text-slate-800 border border-slate-200 rounded-xl overflow-hidden">
            <thead className="bg-slate-100 uppercase text-slate-700 text-[11px] font-bold border-b border-slate-200">
              <tr>
                <th className="p-2.5">Date &amp; Heure</th>
                <th className="p-2.5">Catégorie</th>
                <th className="p-2.5">Service</th>
                <th className="p-2.5 text-right">Montant FCFA</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {data?.transactions?.map((t: any) => (
                <tr key={t.id} className="hover:bg-slate-50">
                  <td className="p-2.5 text-slate-600 font-medium">
                    {new Date(t.datePrestation).toLocaleDateString('fr-FR')} {new Date(t.heurePrestation).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' })}
                  </td>
                  <td className="p-2.5 font-semibold text-slate-700">{t.service.categorie}</td>
                  <td className="p-2.5 font-bold text-slate-900">{t.service.nom}</td>
                  <td className="p-2.5 text-right font-bold text-slate-900">{t.montant.toLocaleString('fr-FR')} FCFA</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Signature et validation gérante */}
        <div className="pt-8 flex justify-between items-end text-xs text-slate-700 border-t border-slate-200">
          <div className="space-y-1">
            <p>Document généré automatiquement par l&apos;application Gestion Clinique.</p>
            <p className="text-[10px] text-slate-500">Intégrité certifiée par session administrateur gérante.</p>
          </div>

          <div className="text-center space-y-8 pr-4">
            <p className="font-bold uppercase text-slate-900">Visa de la Gérante</p>
            <p className="text-slate-400 font-serif italic text-sm">{userProfile?.nom || 'Sougue Epiphane'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
