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
    <div className="min-h-screen bg-[#f5f6f2] text-slate-900 font-sans selection:bg-lime-400 selection:text-slate-950 p-4 sm:p-8 print:p-0 print:bg-white print:text-black">
      {/* Styles d'impression optimisés PLEINE PAGE A4 avec écritures bien visibes */}
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
              <span>Imprimer le Rapport (Pleine Page A4)</span>
            </button>
          </div>
        </div>

        {/* Sélection des filtres du rapport */}
        <div className="bg-white border border-slate-200/80 p-6 sm:p-8 rounded-[32px] shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-800 uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-lime-400" />
            <span>Options d&apos;Édition du Rapport</span>
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

      {/* RAPPORT OFFICIEL (Visible à l'écran et optimisé pour l'impression PLEINE PAGE A4) */}
      <div className="w-full max-w-5xl mx-auto bg-white text-slate-900 rounded-3xl p-6 sm:p-10 shadow-2xl mt-6 print:mt-0 print:p-0 print:shadow-none print:rounded-none space-y-6 print:space-y-5 border border-slate-200 print:border-none print:w-full print:max-w-none">
        {/* En-tête officiel de la clinique */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b-2 border-slate-900 pb-5 print:pb-4 gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-4">
              <img src="/logo.jpg" alt="Logo BK Clinique" className="w-20 h-20 sm:w-24 sm:h-24 print:w-20 print:h-20 rounded-2xl object-contain bg-white p-1 border border-slate-300 print:border-black shadow-xs" />
              <div>
                <h1 className="text-3xl sm:text-4xl print:text-3xl font-black tracking-tight text-slate-950 uppercase">BK CLINIQUE</h1>
                <p className="text-xs print:text-sm text-slate-700 uppercase font-extrabold tracking-widest mt-1">
                  Rapport d&apos;Activité et de Recettes Financières
                </p>
              </div>
            </div>
          </div>

          <div className="text-left sm:text-right text-xs print:text-sm space-y-1 text-slate-700 font-medium">
            <div>Gérante : <strong className="text-slate-900 font-bold">{userProfile?.nom || 'Sougue Epiphane'}</strong></div>
            <div>E-mail : {userProfile?.email || 'nickyshone62@gmail.com'}</div>
            <div>Édité le : <strong>{new Date().toLocaleDateString('fr-FR')}</strong> à {new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', timeZone: 'Africa/Ouagadougou' })} (UTC+0)</div>
          </div>
        </div>

        {/* Détails de la période & Total Général */}
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

        {/* Ventilation par Catégorie */}
        <div className="space-y-3 print:space-y-3">
          <h3 className="text-sm print:text-sm font-black uppercase tracking-wider text-slate-900 border-b-2 border-slate-300 pb-1.5">
            1. Synthèse des Recettes par Catégorie
          </h3>

          <table className="w-full text-xs print:text-sm text-left text-slate-800 border border-slate-300 rounded-xl overflow-hidden">
            <thead className="bg-slate-100 uppercase text-slate-700 text-xs print:text-xs font-extrabold border-b border-slate-300">
              <tr>
                <th className="p-3 print:py-2.5 print:px-4">Catégorie Médicale</th>
                <th className="p-3 print:py-2.5 print:px-4 text-center">Nombre d&apos;actes</th>
                <th className="p-3 print:py-2.5 print:px-4 text-right">Recette Totale (FCFA)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {data?.byCategory?.map((c: any) => (
                <tr key={c.id} className="hover:bg-slate-50">
                  <td className="p-3 print:py-2.5 print:px-4 font-extrabold text-slate-900 uppercase">{c.nom}</td>
                  <td className="p-3 print:py-2.5 print:px-4 text-center font-bold text-slate-700">{c.count}</td>
                  <td className="p-3 print:py-2.5 print:px-4 text-right font-black text-emerald-800 print-text-black text-sm print:text-sm">{c.total.toLocaleString('fr-FR')} FCFA</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Ventilation par Service */}
        <div className="space-y-3 print:space-y-3">
          <h3 className="text-sm print:text-sm font-black uppercase tracking-wider text-slate-900 border-b-2 border-slate-300 pb-1.5">
            2. Détails des Recettes par Service Médical
          </h3>

          <table className="w-full text-xs print:text-sm text-left text-slate-800 border border-slate-300 rounded-xl overflow-hidden">
            <thead className="bg-slate-100 uppercase text-slate-700 text-xs print:text-xs font-extrabold border-b border-slate-300">
              <tr>
                <th className="p-3 print:py-2.5 print:px-4">Service</th>
                <th className="p-3 print:py-2.5 print:px-4">Catégorie</th>
                <th className="p-3 print:py-2.5 print:px-4 text-center">Actes</th>
                <th className="p-3 print:py-2.5 print:px-4 text-right">Total FCFA</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {data?.byService?.map((s: any) => (
                <tr key={s.id} className="hover:bg-slate-50">
                  <td className="p-3 print:py-2.5 print:px-4 font-extrabold text-slate-900">{s.nom}</td>
                  <td className="p-3 print:py-2.5 print:px-4 font-bold text-slate-600 uppercase">{s.categorieNom}</td>
                  <td className="p-3 print:py-2.5 print:px-4 text-center font-bold text-slate-700">{s.count}</td>
                  <td className="p-3 print:py-2.5 print:px-4 text-right font-black text-slate-950 text-sm print:text-sm">{s.total.toLocaleString('fr-FR')} FCFA</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Liste chronologique des Prestations */}
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

        {/* Signature et validation gérante */}
        <div className="pt-6 print:pt-6 flex justify-end items-end text-xs print:text-sm text-slate-700 border-t-2 border-slate-300">
          <div className="text-center space-y-8 print:space-y-6 pr-6">
            <p className="font-black uppercase text-slate-950">Visa de la Gérante</p>
          </div>
        </div>
      </div>
    </div>
  );
}
