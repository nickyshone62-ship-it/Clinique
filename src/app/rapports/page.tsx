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
  FileText,
  Palette,
  Sparkles,
  CheckCircle2
} from 'lucide-react';

export default function RapportsPage() {
  const [period, setPeriod] = useState<string>('month'); // today, week, month, custom
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [categoryId, setCategoryId] = useState<string>('');
  const [reportStyle, setReportStyle] = useState<'classic' | 'emerald' | 'compact' | 'prestige' | 'administrative'>('classic');

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

  const STYLES = [
    { id: 'classic', label: '1. Officiel Clinique', desc: 'Design médical standard & épuré', badge: 'Standard' },
    { id: 'emerald', label: '2. Émeraude Moderne', desc: 'En-tête vert émeraude & touches modernes', badge: 'Moderne' },
    { id: 'compact', label: '3. Executive Compact', desc: 'Synthétique & sobre pour la direction', badge: 'Executive' },
    { id: 'prestige', label: '4. Prestige Royal', desc: 'Cadre d’exception & finitions d’élite', badge: 'Prestige' },
    { id: 'administrative', label: '5. Administratif Formel', desc: 'Style officiel avec articles & cachet', badge: 'Officiel' },
  ];

  return (
    <div className="min-h-screen bg-[#f5f6f2] text-slate-900 font-sans selection:bg-lime-400 selection:text-slate-950 p-4 sm:p-8 print:p-0 print:bg-white print:text-black">
      {/* Styles d'impression optimisés PLEINE PAGE A4 */}
      <style jsx global>{`
        @media print {
          @page {
            size: portrait;
            margin: 8mm 10mm;
          }
          html, body {
            width: 100% !important;
            height: 100% !important;
            background-color: white !important;
            color: black !important;
            font-size: 12px !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
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
          table {
            width: 100% !important;
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }
          tr {
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }
        }
      `}</style>

      {/* Barre d'outils et de contrôle (Masquée à l'impression) */}
      <div className="max-w-5xl mx-auto space-y-6 no-print">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-200/80 p-4 sm:p-6 rounded-[32px] shadow-sm">
          <Link
            href="/recettes"
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-700 hover:text-slate-950 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-slate-900" />
            <span>Retour aux Recettes &amp; Historique</span>
          </Link>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handlePrint}
              className="bg-slate-950 hover:bg-slate-800 text-white font-bold py-2.5 px-5 rounded-full text-xs transition-all flex items-center gap-2 shadow-md cursor-pointer"
            >
              <Printer className="w-4 h-4 text-lime-400" />
              <span>Imprimer le Rapport ({STYLES.find(s => s.id === reportStyle)?.label})</span>
            </button>
          </div>
        </div>

        {/* Panneau de sélection des 5 Styles de Rapport */}
        <div className="bg-white border border-slate-200/80 p-6 sm:p-8 rounded-[32px] shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-900 uppercase tracking-wider">
              <Palette className="w-4 h-4 text-emerald-600" />
              <span>Choisissez le Style Visuel du Rapport (5 modèles au choix)</span>
            </div>
            <span className="text-xs font-semibold text-slate-500">Style actif : <strong className="text-slate-900 uppercase">{reportStyle}</strong></span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
            {STYLES.map((st) => (
              <button
                key={st.id}
                onClick={() => setReportStyle(st.id as any)}
                className={`p-3.5 rounded-2xl text-left border transition-all cursor-pointer flex flex-col justify-between space-y-2 ${
                  reportStyle === st.id
                    ? 'border-slate-950 bg-slate-950 text-white shadow-md ring-2 ring-slate-950'
                    : 'border-slate-200 bg-slate-50 hover:bg-white hover:border-slate-400 text-slate-900'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                    reportStyle === st.id ? 'bg-lime-400 text-slate-950' : 'bg-slate-200 text-slate-700'
                  }`}>
                    {st.badge}
                  </span>
                  {reportStyle === st.id && <CheckCircle2 className="w-4 h-4 text-lime-400" />}
                </div>
                <div>
                  <h4 className="text-xs font-extrabold leading-tight">{st.label}</h4>
                  <p className={`text-[11px] mt-0.5 line-clamp-2 ${reportStyle === st.id ? 'text-slate-300' : 'text-slate-700'}`}>
                    {st.desc}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Sélection des filtres du rapport */}
        <div className="bg-white border border-slate-200/80 p-6 sm:p-8 rounded-[32px] shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-800 uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-lime-400" />
            <span>Filtres de Données du Rapport</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Période du Rapport</label>
              <select
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200/80 rounded-2xl px-3 py-2.5 text-xs text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-slate-950"
              >
                <option value="today">Aujourd&apos;hui</option>
                <option value="week">Cette semaine</option>
                <option value="month">Ce mois-ci</option>
                <option value="custom">Période personnalisée</option>
              </select>
            </div>

            {period === 'custom' && (
              <>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Date Début</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200/80 rounded-2xl px-3 py-2.5 text-xs text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-slate-950"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Date Fin</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200/80 rounded-2xl px-3 py-2.5 text-xs text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-slate-950"
                  />
                </div>
              </>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Catégorie Médicale</label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200/80 rounded-2xl px-3 py-2.5 text-xs text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-slate-950"
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

      {/* ========================================================================= */}
      {/* RENDU DU RAPPORT DYNAMIQUE SELON LE STYLE SÉLECTIONNÉ (1 à 5)             */}
      {/* ========================================================================= */}

      {/* ------------------------------------------------------------------------- */}
      {/* STYLE 1 : OFFICIEL CLINIQUE (Style Standard Épuré)                       */}
      {/* ------------------------------------------------------------------------- */}
      {reportStyle === 'classic' && (
        <div className="w-full max-w-5xl mx-auto bg-white text-slate-900 rounded-3xl p-6 sm:p-10 shadow-2xl mt-6 print:mt-0 print:p-0 print:shadow-none print:rounded-none border border-slate-200 print:border-none print:w-full print:max-w-none print:min-h-[272mm] print:flex print:flex-col print:justify-between">
          <div className="space-y-6 print:space-y-5 print:flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b-2 border-slate-900 pb-5 print:pb-4 gap-4">
              <div className="flex items-center gap-4">
                <img src="/logo.jpg" alt="Logo BK Clinique" className="w-20 h-20 sm:w-24 sm:h-24 print:w-20 print:h-20 rounded-2xl object-contain bg-white p-1 border border-slate-300 print:border-black shadow-xs" />
                <div>
                  <h1 className="text-3xl sm:text-4xl print:text-3xl font-black tracking-tight text-slate-950 uppercase">BK CLINIQUE</h1>
                  <p className="text-xs print:text-sm text-slate-700 uppercase font-extrabold tracking-widest mt-1">
                    Rapport d&apos;Activité et de Recettes Financières
                  </p>
                </div>
              </div>

              <div className="text-left sm:text-right text-xs print:text-sm space-y-1 text-slate-700 font-medium">
                <div>Gérante : <strong className="text-slate-900 font-bold">{userProfile?.nom || 'Gérante BK Clinique'}</strong></div>
                <div>E-mail : {userProfile?.email || 'contact@bkclinique.com'}</div>
                <div>Édité le : <strong>{new Date().toLocaleDateString('fr-FR')}</strong> à {new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', timeZone: 'Africa/Ouagadougou' })} (UTC+0)</div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 print:gap-4">
              <div className="sm:col-span-1 bg-slate-50 border border-slate-200 rounded-2xl p-4 print:p-4 text-xs print:text-sm print-bg-gray flex flex-col justify-center space-y-1.5">
                <div>
                  <span className="text-slate-600 font-semibold">Période du Rapport : </span>
                  <strong className="text-slate-900 font-black">{getPeriodLabel()}</strong>
                </div>
                <div>
                  <span className="text-slate-600 font-semibold">Nombre d&apos;actes réalisés : </span>
                  <strong className="text-emerald-800 font-black print-text-black">{data?.summary?.countFiltered || 0} prestations</strong>
                </div>
              </div>

              <div className="sm:col-span-2 bg-slate-900 text-white rounded-2xl p-4 print:p-4 px-6 print:px-6 flex items-center justify-between print:bg-slate-100 print:text-black print-border">
                <div>
                  <span className="text-xs print:text-xs uppercase tracking-wider text-slate-300 print:text-slate-800 font-black">Total Général des Recettes</span>
                  <h2 className="text-3xl print:text-3xl font-black text-lime-400 print-text-black mt-0.5">
                    {data?.summary?.totalFiltered?.toLocaleString('fr-FR') || 0} FCFA
                  </h2>
                </div>
                <Coins className="w-10 h-10 print:w-9 print:h-9 text-lime-400 print-text-black opacity-90" />
              </div>
            </div>

            <div className="space-y-3 print:space-y-3">
              <h3 className="text-sm print:text-sm font-black uppercase tracking-wider text-slate-900 border-b-2 border-slate-300 pb-1.5">
                1. Synthèse des Recettes par Catégorie
              </h3>
              <table className="w-full text-xs print:text-sm text-left text-slate-800 border border-slate-300 rounded-xl overflow-hidden">
                <thead className="bg-slate-100 uppercase text-slate-700 text-xs print:text-xs font-extrabold border-b border-slate-300">
                  <tr>
                    <th className="p-3 print:py-3 print:px-4">Catégorie Médicale</th>
                    <th className="p-3 print:py-3 print:px-4 text-center">Nombre d&apos;actes</th>
                    <th className="p-3 print:py-3 print:px-4 text-right">Recette Totale (FCFA)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {data?.byCategory?.map((c: any) => (
                    <tr key={c.id} className="hover:bg-slate-50">
                      <td className="p-3 print:py-3 print:px-4 font-extrabold text-slate-900 uppercase">{c.nom}</td>
                      <td className="p-3 print:py-3 print:px-4 text-center font-bold text-slate-700">{c.count}</td>
                      <td className="p-3 print:py-3 print:px-4 text-right font-black text-emerald-800 print-text-black text-sm print:text-sm">{c.total.toLocaleString('fr-FR')} FCFA</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="space-y-3 print:space-y-3">
              <h3 className="text-sm print:text-sm font-black uppercase tracking-wider text-slate-900 border-b-2 border-slate-300 pb-1.5">
                2. Détails des Recettes par Service Médical
              </h3>
              <table className="w-full text-xs print:text-sm text-left text-slate-800 border border-slate-300 rounded-xl overflow-hidden">
                <thead className="bg-slate-100 uppercase text-slate-700 text-xs print:text-xs font-extrabold border-b border-slate-300">
                  <tr>
                    <th className="p-3 print:py-3 print:px-4">Service</th>
                    <th className="p-3 print:py-3 print:px-4">Catégorie</th>
                    <th className="p-3 print:py-3 print:px-4 text-center">Actes</th>
                    <th className="p-3 print:py-3 print:px-4 text-right">Total FCFA</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {data?.byService?.map((s: any) => (
                    <tr key={s.id} className="hover:bg-slate-50">
                      <td className="p-3 print:py-3 print:px-4 font-extrabold text-slate-900">{s.nom}</td>
                      <td className="p-3 print:py-3 print:px-4 font-bold text-slate-600 uppercase">{s.categorieNom}</td>
                      <td className="p-3 print:py-3 print:px-4 text-center font-bold text-slate-700">{s.count}</td>
                      <td className="p-3 print:py-3 print:px-4 text-right font-black text-slate-950 text-sm print:text-sm">{s.total.toLocaleString('fr-FR')} FCFA</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {data?.transactions?.length > 0 && (
              <div className="space-y-3 print:space-y-3">
                <h3 className="text-sm print:text-sm font-black uppercase tracking-wider text-slate-900 border-b-2 border-slate-300 pb-1.5">
                  3. Registre des Prestations Enregistrées
                </h3>
                <table className="w-full text-xs print:text-sm text-left text-slate-800 border border-slate-300 rounded-xl overflow-hidden">
                  <thead className="bg-slate-100 uppercase text-slate-700 text-xs print:text-xs font-extrabold border-b border-slate-300">
                    <tr>
                      <th className="p-2.5 print:py-2.5 print:px-4">Date &amp; Heure (UTC+0)</th>
                      <th className="p-2.5 print:py-2.5 print:px-4">Catégorie</th>
                      <th className="p-2.5 print:py-2.5 print:px-4">Service Réalisé</th>
                      <th className="p-2.5 print:py-2.5 print:px-4 text-right">Montant FCFA</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {data?.transactions?.slice(0, 10).map((t: any) => (
                      <tr key={t.id} className="hover:bg-slate-50">
                        <td className="p-2.5 print:py-2.5 print:px-4 text-slate-700 font-bold">
                          {new Date(t.datePrestation).toLocaleDateString('fr-FR')} {new Date(t.heurePrestation).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' })}
                        </td>
                        <td className="p-2.5 print:py-2.5 print:px-4 font-bold text-slate-700 uppercase">{t.service.categorie}</td>
                        <td className="p-2.5 print:py-2.5 print:px-4 font-extrabold text-slate-900">{t.service.nom}</td>
                        <td className="p-2.5 print:py-2.5 print:px-4 text-right font-black text-slate-950 text-sm print:text-sm">{t.montant.toLocaleString('fr-FR')} FCFA</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="pt-6 print:pt-6 print:mt-auto flex justify-end items-end text-xs print:text-sm text-slate-700 border-t-2 border-slate-300">
            <div className="text-center space-y-8 print:space-y-6 pr-6">
              <p className="font-black uppercase text-slate-950">Visa de la Gérante</p>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------------- */}
      {/* STYLE 2 : ÉMERAUDE MODERNE (Design vert émeraude clinique)               */}
      {/* ------------------------------------------------------------------------- */}
      {reportStyle === 'emerald' && (
        <div className="w-full max-w-5xl mx-auto bg-white text-slate-900 rounded-3xl overflow-hidden shadow-2xl mt-6 print:mt-0 print:p-0 print:shadow-none print:rounded-none border border-emerald-200 print:border-none print:w-full print:max-w-none print:min-h-[272mm] print:flex print:flex-col print:justify-between">
          <div className="space-y-6 print:space-y-5 print:flex-1">
            {/* Bannière émeraude */}
            <div className="bg-emerald-950 text-white p-6 sm:p-8 print:p-6 flex flex-col sm:flex-row items-center justify-between gap-6 print:bg-emerald-900">
              <div className="flex items-center gap-5">
                <img src="/logo.jpg" alt="Logo BK Clinique" className="w-20 h-20 print:w-20 print:h-20 rounded-2xl object-contain bg-white p-1 border-2 border-emerald-400 shadow-md" />
                <div>
                  <span className="text-[11px] font-black uppercase tracking-widest text-emerald-400 bg-emerald-900/80 print:bg-emerald-800 px-3 py-1 rounded-full">Centre Médical Spécialisé</span>
                  <h1 className="text-3xl sm:text-4xl print:text-3xl font-black tracking-tight text-white uppercase mt-1">BK CLINIQUE</h1>
                  <p className="text-xs print:text-sm text-emerald-200 font-medium">Bilan de Performance et des Encaissements Médicaux</p>
                </div>
              </div>
              <div className="text-right text-xs print:text-sm text-emerald-100 font-medium space-y-1 bg-emerald-900/60 p-4 rounded-2xl border border-emerald-800">
                <div>Gérante : <strong className="text-white font-bold">{userProfile?.nom || 'Gérante BK Clinique'}</strong></div>
                <div>Date : <strong>{new Date().toLocaleDateString('fr-FR')}</strong></div>
                <div>Période : <strong className="text-lime-400">{getPeriodLabel()}</strong></div>
              </div>
            </div>

            <div className="p-6 sm:p-8 print:p-0 space-y-6 print:space-y-5">
              {/* Carte total émeraude */}
              <div className="bg-gradient-to-r from-emerald-900 to-teal-900 text-white rounded-2xl p-6 print:p-5 flex items-center justify-between border-2 border-emerald-500 shadow-lg print:bg-emerald-950">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">Recette Totale Validée</span>
                  <h2 className="text-3xl sm:text-4xl print:text-3xl font-black text-lime-400 mt-1">
                    {data?.summary?.totalFiltered?.toLocaleString('fr-FR') || 0} FCFA
                  </h2>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-emerald-200">Volume d&apos;actes</span>
                  <p className="text-2xl font-black text-white">{data?.summary?.countFiltered || 0} prestations</p>
                </div>
              </div>

              {/* Synthèse Catégorie */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 border-b-2 border-emerald-600 pb-2">
                  <span className="w-3 h-3 rounded-full bg-emerald-600" />
                  <h3 className="text-sm font-black uppercase text-emerald-950">1. Synthèse par Catégorie Médicale</h3>
                </div>
                <table className="w-full text-xs print:text-sm text-left border border-emerald-200 rounded-xl overflow-hidden">
                  <thead className="bg-emerald-900 text-white uppercase text-xs font-extrabold">
                    <tr>
                      <th className="p-3 print:py-3 print:px-4">Catégorie</th>
                      <th className="p-3 print:py-3 print:px-4 text-center">Actes</th>
                      <th className="p-3 print:py-3 print:px-4 text-right">Recette Totale</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-emerald-100 bg-emerald-50/30">
                    {data?.byCategory?.map((c: any) => (
                      <tr key={c.id} className="hover:bg-emerald-100/50">
                        <td className="p-3 print:py-3 print:px-4 font-black text-slate-900 uppercase">{c.nom}</td>
                        <td className="p-3 print:py-3 print:px-4 text-center font-bold text-slate-700">{c.count}</td>
                        <td className="p-3 print:py-3 print:px-4 text-right font-black text-emerald-900 text-sm">{c.total.toLocaleString('fr-FR')} FCFA</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Synthèse Services */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 border-b-2 border-emerald-600 pb-2">
                  <span className="w-3 h-3 rounded-full bg-emerald-600" />
                  <h3 className="text-sm font-black uppercase text-emerald-950">2. Prestations Réalisées par Service</h3>
                </div>
                <table className="w-full text-xs print:text-sm text-left border border-emerald-200 rounded-xl overflow-hidden">
                  <thead className="bg-emerald-800 text-white uppercase text-xs font-extrabold">
                    <tr>
                      <th className="p-3 print:py-3 print:px-4">Service</th>
                      <th className="p-3 print:py-3 print:px-4">Catégorie</th>
                      <th className="p-3 print:py-3 print:px-4 text-center">Actes</th>
                      <th className="p-3 print:py-3 print:px-4 text-right">Montant</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-emerald-100 bg-white">
                    {data?.byService?.map((s: any) => (
                      <tr key={s.id} className="hover:bg-emerald-50">
                        <td className="p-3 print:py-3 print:px-4 font-bold text-slate-900">{s.nom}</td>
                        <td className="p-3 print:py-3 print:px-4 font-semibold text-emerald-800 uppercase">{s.categorieNom}</td>
                        <td className="p-3 print:py-3 print:px-4 text-center font-bold text-slate-700">{s.count}</td>
                        <td className="p-3 print:py-3 print:px-4 text-right font-black text-emerald-950 text-sm">{s.total.toLocaleString('fr-FR')} FCFA</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-8 print:p-0 print:mt-auto pt-6 flex justify-between items-center text-xs print:text-sm border-t-2 border-emerald-500 bg-emerald-50/50 print:bg-white">
            <div className="text-emerald-900 font-bold">BK CLINIQUE • Rapport de Gestion Médicale</div>
            <div className="text-center space-y-6 pr-6">
              <p className="font-black uppercase text-emerald-950 border-b border-emerald-300 pb-1">Visa de la Gérante</p>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------------- */}
      {/* STYLE 3 : EXECUTIVE COMPACT (Design Minimaliste Sobremment Épuré)        */}
      {/* ------------------------------------------------------------------------- */}
      {reportStyle === 'compact' && (
        <div className="w-full max-w-5xl mx-auto bg-white text-slate-950 rounded-3xl p-6 sm:p-10 shadow-2xl mt-6 print:mt-0 print:p-0 print:shadow-none print:rounded-none border-2 border-slate-950 print:border-none print:w-full print:max-w-none print:min-h-[272mm] print:flex print:flex-col print:justify-between">
          <div className="space-y-5 print:space-y-4 print:flex-1">
            {/* Header compact monochrome */}
            <div className="flex justify-between items-start border-b-4 border-slate-950 pb-4">
              <div>
                <h1 className="text-3xl font-black uppercase tracking-tighter text-slate-950">BK CLINIQUE</h1>
                <p className="text-xs font-bold uppercase tracking-widest text-slate-700 mt-0.5">SYNTHÈSE FINANCIÈRE EXECUTIVE</p>
              </div>
              <div className="text-right text-xs font-bold space-y-0.5 text-slate-800">
                <div>PÉRIODE : <span className="bg-slate-950 text-white px-2 py-0.5 rounded text-[11px] uppercase">{getPeriodLabel()}</span></div>
                <div>GÉRANTE : <strong>{userProfile?.nom || 'Gérante BK Clinique'}</strong></div>
                <div>DATE : {new Date().toLocaleDateString('fr-FR')}</div>
              </div>
            </div>

            {/* Grille KPI compacte */}
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="border-2 border-slate-950 p-3 rounded-xl bg-slate-100">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-700">Total Général</span>
                <p className="text-2xl font-black text-slate-950 mt-0.5">{data?.summary?.totalFiltered?.toLocaleString('fr-FR') || 0} FCFA</p>
              </div>
              <div className="border-2 border-slate-950 p-3 rounded-xl bg-slate-50">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-700">Prestations Réalisées</span>
                <p className="text-2xl font-black text-slate-950 mt-0.5">{data?.summary?.countFiltered || 0}</p>
              </div>
              <div className="border-2 border-slate-950 p-3 rounded-xl bg-slate-950 text-white">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-300">Catégories Actives</span>
                <p className="text-2xl font-black text-lime-400 mt-0.5">{data?.byCategory?.length || 0}</p>
              </div>
            </div>

            {/* Tableau Synthétique */}
            <div className="space-y-2">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-950 border-b border-slate-950 pb-1">Ventilation des Recettes</h3>
              <table className="w-full text-xs print:text-sm border-2 border-slate-950">
                <thead className="bg-slate-950 text-white uppercase text-xs font-black">
                  <tr>
                    <th className="p-2.5 text-left border-r border-slate-800">Catégorie Médicale</th>
                    <th className="p-2.5 text-center border-r border-slate-800">Nombre d&apos;Actes</th>
                    <th className="p-2.5 text-right">Recette FCFA</th>
                  </tr>
                </thead>
                <tbody className="divide-y-2 divide-slate-950 font-bold">
                  {data?.byCategory?.map((c: any) => (
                    <tr key={c.id}>
                      <td className="p-2.5 uppercase border-r border-slate-950">{c.nom}</td>
                      <td className="p-2.5 text-center border-r border-slate-950">{c.count}</td>
                      <td className="p-2.5 text-right font-black text-slate-950">{c.total.toLocaleString('fr-FR')} FCFA</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Tableau Détails */}
            <div className="space-y-2">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-950 border-b border-slate-950 pb-1">Détails des Services</h3>
              <table className="w-full text-xs print:text-sm border-2 border-slate-950">
                <thead className="bg-slate-200 text-slate-950 uppercase text-xs font-black border-b-2 border-slate-950">
                  <tr>
                    <th className="p-2 text-left border-r border-slate-950">Service</th>
                    <th className="p-2 text-left border-r border-slate-950">Catégorie</th>
                    <th className="p-2 text-center border-r border-slate-950">Actes</th>
                    <th className="p-2 text-right">Total FCFA</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-950 font-semibold">
                  {data?.byService?.map((s: any) => (
                    <tr key={s.id}>
                      <td className="p-2 border-r border-slate-950 font-bold">{s.nom}</td>
                      <td className="p-2 border-r border-slate-950 uppercase text-slate-700">{s.categorieNom}</td>
                      <td className="p-2 text-center border-r border-slate-950">{s.count}</td>
                      <td className="p-2 text-right font-black">{s.total.toLocaleString('fr-FR')} FCFA</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="pt-6 print:pt-6 print:mt-auto flex justify-between items-end border-t-2 border-slate-950">
            <div className="text-[11px] font-bold text-slate-700">DOCUMENT CONFIDENTIEL EXECUTIVE • BK CLINIQUE</div>
            <div className="text-center pr-4">
              <p className="font-black uppercase text-slate-950 text-xs">Visa &amp; Signature</p>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------------- */}
      {/* STYLE 4 : PRESTIGE ROYAL (Design Haut de Gamme Doré & Sombre)             */}
      {/* ------------------------------------------------------------------------- */}
      {reportStyle === 'prestige' && (
        <div className="w-full max-w-5xl mx-auto bg-white text-slate-900 rounded-3xl p-8 sm:p-12 shadow-2xl mt-6 print:mt-0 print:p-0 print:shadow-none print:rounded-none border-4 border-double border-amber-600/60 print:border-none print:w-full print:max-w-none print:min-h-[272mm] print:flex print:flex-col print:justify-between">
          <div className="space-y-6 print:space-y-5 print:flex-1">
            {/* Header prestige */}
            <div className="text-center border-b-2 border-amber-500 pb-6 space-y-2">
              <div className="inline-flex p-2 rounded-2xl bg-slate-950 border-2 border-amber-400 mb-1">
                <img src="/logo.jpg" alt="Logo BK Clinique" className="w-16 h-16 rounded-xl object-contain bg-white" />
              </div>
              <h1 className="text-4xl font-black tracking-widest text-slate-950 uppercase">BK CLINIQUE</h1>
              <p className="text-xs font-black uppercase tracking-widest text-amber-700">Rapport de Gestion Financière de Haute Précision</p>
              <div className="flex justify-center items-center gap-4 text-xs font-bold text-slate-600 mt-2">
                <span>Période : <strong className="text-slate-950 uppercase">{getPeriodLabel()}</strong></span>
                <span>•</span>
                <span>Gérante : <strong className="text-slate-950">{userProfile?.nom || 'Gérante BK Clinique'}</strong></span>
                <span>•</span>
                <span>Édition : <strong>{new Date().toLocaleDateString('fr-FR')}</strong></span>
              </div>
            </div>

            {/* Card Total Prestige */}
            <div className="bg-slate-950 text-white rounded-2xl p-6 print:p-5 border-2 border-amber-400 flex items-center justify-between shadow-xl">
              <div>
                <span className="text-xs font-extrabold uppercase tracking-widest text-amber-400">Total Général Encaissements</span>
                <h2 className="text-4xl font-black text-amber-300 mt-1">{data?.summary?.totalFiltered?.toLocaleString('fr-FR') || 0} FCFA</h2>
              </div>
              <div className="text-right border-l border-slate-800 pl-6">
                <span className="text-xs font-bold text-slate-400 uppercase">Total Prestations</span>
                <p className="text-3xl font-black text-white">{data?.summary?.countFiltered || 0}</p>
              </div>
            </div>

            {/* Table Synthèse Prestige */}
            <div className="space-y-3">
              <h3 className="text-xs font-black uppercase tracking-widest text-amber-900 border-b-2 border-amber-400 pb-1">
                I. Ventilation par Pôle Médical
              </h3>
              <table className="w-full text-xs print:text-sm text-left border-2 border-slate-900 rounded-xl overflow-hidden">
                <thead className="bg-slate-950 text-amber-300 uppercase text-xs font-black">
                  <tr>
                    <th className="p-3 print:py-3 print:px-4">Pôle / Catégorie</th>
                    <th className="p-3 print:py-3 print:px-4 text-center">Volume Prestations</th>
                    <th className="p-3 print:py-3 print:px-4 text-right">Recette Générée</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-amber-50/20">
                  {data?.byCategory?.map((c: any) => (
                    <tr key={c.id}>
                      <td className="p-3 print:py-3 print:px-4 font-extrabold text-slate-950 uppercase">{c.nom}</td>
                      <td className="p-3 print:py-3 print:px-4 text-center font-bold text-slate-800">{c.count}</td>
                      <td className="p-3 print:py-3 print:px-4 text-right font-black text-amber-950 text-sm">{c.total.toLocaleString('fr-FR')} FCFA</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Table Services Prestige */}
            <div className="space-y-3">
              <h3 className="text-xs font-black uppercase tracking-widest text-amber-900 border-b-2 border-amber-400 pb-1">
                II. Détail des Services Médicaux
              </h3>
              <table className="w-full text-xs print:text-sm text-left border-2 border-slate-900 rounded-xl overflow-hidden">
                <thead className="bg-slate-900 text-white uppercase text-xs font-black">
                  <tr>
                    <th className="p-3 print:py-3 print:px-4">Service</th>
                    <th className="p-3 print:py-3 print:px-4">Catégorie</th>
                    <th className="p-3 print:py-3 print:px-4 text-center">Actes</th>
                    <th className="p-3 print:py-3 print:px-4 text-right">Total FCFA</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  {data?.byService?.map((s: any) => (
                    <tr key={s.id}>
                      <td className="p-3 print:py-3 print:px-4 font-bold text-slate-900">{s.nom}</td>
                      <td className="p-3 print:py-3 print:px-4 font-bold text-amber-800 uppercase">{s.categorieNom}</td>
                      <td className="p-3 print:py-3 print:px-4 text-center font-bold text-slate-800">{s.count}</td>
                      <td className="p-3 print:py-3 print:px-4 text-right font-black text-slate-950 text-sm">{s.total.toLocaleString('fr-FR')} FCFA</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="pt-6 print:pt-6 print:mt-auto flex justify-between items-center text-xs border-t-2 border-amber-500">
            <div className="font-bold text-slate-700">BK CLINIQUE • Rapport de Prestige</div>
            <div className="text-center pr-6">
              <p className="font-black uppercase text-slate-950">Visa de la Gérante</p>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------------- */}
      {/* STYLE 5 : ADMINISTRATIF FORMEL (Style Officiel de Lettre & Articles)    */}
      {/* ------------------------------------------------------------------------- */}
      {reportStyle === 'administrative' && (
        <div className="w-full max-w-5xl mx-auto bg-white text-slate-950 rounded-3xl p-8 sm:p-12 shadow-2xl mt-6 print:mt-0 print:p-0 print:shadow-none print:rounded-none border-2 border-slate-900 print:border-none print:w-full print:max-w-none print:min-h-[272mm] print:flex print:flex-col print:justify-between font-serif">
          <div className="space-y-6 print:space-y-5 print:flex-1">
            {/* En-tête officiel centré */}
            <div className="text-center space-y-2 border-b-4 border-double border-slate-950 pb-5">
              <div className="flex justify-center mb-2">
                <img src="/logo.jpg" alt="Logo BK Clinique" className="w-20 h-20 rounded-2xl object-contain bg-white border-2 border-slate-900" />
              </div>
              <h2 className="text-xs font-black uppercase tracking-widest text-slate-800">RÉPUBLIQUE DE HAUTE-VOLTA • CLINIQUE BK</h2>
              <h1 className="text-3xl font-black uppercase tracking-wider text-slate-950">RAPPORT ADMINISTRATIF ET FINANCIER</h1>
              <p className="text-xs font-bold italic text-slate-700">Arrêté de caisse pour la période : {getPeriodLabel()}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs font-sans border-2 border-slate-950 p-4 rounded-xl bg-slate-50">
              <div>
                <div><strong>ÉTABLISSEMENT :</strong> BK CLINIQUE</div>
                <div><strong>GÉRANTE RESPONSABLE :</strong> {userProfile?.nom || 'Gérante BK Clinique'}</div>
              </div>
              <div className="text-right">
                <div><strong>DATE DE L&apos;ARRÊTÉ :</strong> {new Date().toLocaleDateString('fr-FR')}</div>
                <div><strong>NOMBRE D&apos;ACTES :</strong> {data?.summary?.countFiltered || 0} prestations</div>
              </div>
            </div>

            {/* Article 1 */}
            <div className="space-y-3 font-sans">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-950 bg-slate-200 p-2 border border-slate-950">
                ARTICLE 1 : SYNTHÈSE DES RECETTES PAR CATEGORIE
              </h3>
              <table className="w-full text-xs print:text-sm text-left border-2 border-slate-950">
                <thead className="bg-slate-950 text-white uppercase font-black text-xs">
                  <tr>
                    <th className="p-2.5 border-r border-slate-800">Désignation Catégorie</th>
                    <th className="p-2.5 text-center border-r border-slate-800">Nombre d&apos;Actes</th>
                    <th className="p-2.5 text-right">Recette Totale (FCFA)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-950 font-bold">
                  {data?.byCategory?.map((c: any) => (
                    <tr key={c.id}>
                      <td className="p-2.5 uppercase border-r border-slate-950">{c.nom}</td>
                      <td className="p-2.5 text-center border-r border-slate-950">{c.count}</td>
                      <td className="p-2.5 text-right font-black text-slate-950">{c.total.toLocaleString('fr-FR')} FCFA</td>
                    </tr>
                  ))}
                  <tr className="bg-slate-200 font-black text-slate-950 border-t-2 border-slate-950">
                    <td className="p-3 uppercase" colSpan={2}>TOTAL GÉNÉRAL CONSTATÉ</td>
                    <td className="p-3 text-right text-base">{data?.summary?.totalFiltered?.toLocaleString('fr-FR') || 0} FCFA</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Article 2 */}
            <div className="space-y-3 font-sans">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-950 bg-slate-200 p-2 border border-slate-950">
                ARTICLE 2 : DÉTAILS DES PRESTATIONS PAR SERVICE
              </h3>
              <table className="w-full text-xs print:text-sm text-left border-2 border-slate-950">
                <thead className="bg-slate-100 uppercase font-black text-xs border-b-2 border-slate-950">
                  <tr>
                    <th className="p-2.5 border-r border-slate-950">Nom du Service</th>
                    <th className="p-2.5 border-r border-slate-950">Catégorie</th>
                    <th className="p-2.5 text-center border-r border-slate-950">Actes</th>
                    <th className="p-2.5 text-right">Total FCFA</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-950 font-medium">
                  {data?.byService?.map((s: any) => (
                    <tr key={s.id}>
                      <td className="p-2.5 font-bold border-r border-slate-950">{s.nom}</td>
                      <td className="p-2.5 uppercase text-slate-700 border-r border-slate-950">{s.categorieNom}</td>
                      <td className="p-2.5 text-center border-r border-slate-950 font-bold">{s.count}</td>
                      <td className="p-2.5 text-right font-black">{s.total.toLocaleString('fr-FR')} FCFA</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="pt-8 print:pt-8 print:mt-auto border-t-2 border-slate-950 flex justify-between items-end font-sans">
            <div className="text-xs space-y-1">
              <div>Fait à Ouagadougou, le {new Date().toLocaleDateString('fr-FR')}</div>
              <div className="font-bold">BK CLINIQUE - Direction Financière</div>
            </div>
            <div className="border-2 border-slate-950 p-4 w-64 text-center space-y-8">
              <p className="font-black uppercase text-xs">Pour la Gérance &amp; Cachet</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
