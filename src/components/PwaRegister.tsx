'use client';

import { useEffect, useState } from 'react';
import { Download, Share, PlusSquare } from 'lucide-react';

export function PwaRegister() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState<boolean>(false);
  const [showBanner, setShowBanner] = useState<boolean>(false);
  const [isIos, setIsIos] = useState<boolean>(false);

  useEffect(() => {
    // Enregistrement du Service Worker
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').catch(() => {
          // Ignorer en mode développement
        });
      });
    }

    // Détection si l'application est déjà installée en mode standalone
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (navigator as any).standalone;
    if (isStandalone) {
      setIsInstalled(true);
      return;
    }

    // Détection iOS Safari
    const userAgent = window.navigator.userAgent;
    const isIosDevice = /iPhone|iPad|iPod/.test(userAgent) && !/CriOS|FxiOS|EdgiOS/.test(userAgent);
    if (isIosDevice) {
      setIsIos(true);
      setShowBanner(true);
    }

    // Capture de l'événement d'installation PWA (Android / Chrome)
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowBanner(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsInstalled(true);
      setShowBanner(false);
    }
    setDeferredPrompt(null);
  };

  if (!showBanner || isInstalled) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-sm z-50 bg-slate-950 text-white border-2 border-lime-400 p-4 rounded-3xl shadow-2xl space-y-3 no-print animate-in fade-in slide-in-from-bottom-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <img src="/apple-touch-icon.png" alt="Logo BK Clinique" className="w-10 h-10 rounded-xl object-contain bg-white p-0.5 shadow" />
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-lime-400">Application BK CLINIQUE</h4>
            <p className="text-[11px] text-slate-300 font-medium">Ajouter à l&apos;écran d&apos;accueil</p>
          </div>
        </div>
        <button
          onClick={() => setShowBanner(false)}
          className="text-slate-400 hover:text-white text-xs font-bold p-1"
        >
          ✕
        </button>
      </div>

      {isIos ? (
        <div className="bg-slate-900/90 rounded-2xl p-3 border border-slate-800 text-[11px] text-slate-200 space-y-2">
          <p className="font-semibold text-lime-400 flex items-center gap-1.5">
            <span>Pour afficher le logo au lieu de Safari :</span>
          </p>
          <ol className="list-decimal list-inside space-y-1 text-slate-300">
            <li>Appuyez sur le bouton <span className="font-bold text-white">Partager <Share className="inline w-3.5 h-3.5 mb-0.5 text-lime-400" /></span> en bas de Safari</li>
            <li>Sélectionnez <span className="font-bold text-white">Sur l&apos;écran d&apos;accueil <PlusSquare className="inline w-3.5 h-3.5 mb-0.5 text-lime-400" /></span></li>
          </ol>
        </div>
      ) : (
        <button
          onClick={handleInstallClick}
          className="w-full bg-lime-400 hover:bg-lime-500 text-slate-950 font-black py-2.5 px-4 rounded-2xl text-xs flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer active:scale-95"
        >
          <Download className="w-4 h-4" />
          <span>Installer l&apos;application</span>
        </button>
      )}
    </div>
  );
}
