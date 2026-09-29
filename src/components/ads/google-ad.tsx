'use client';

import { useState, useEffect } from 'react';
import { Sparkles, ExternalLink, ShieldCheck, X } from 'lucide-react';
import { getAdsConfig } from '@/lib/services/promotions';
import { GoogleAdsConfig } from '@/types/admin';

interface GoogleAdProps {
  slotType?: 'hero' | 'sidebar' | 'infeed' | 'footer';
  className?: string;
}

export function GoogleAd({ slotType = 'infeed', className = '' }: GoogleAdProps) {
  const [config, setConfig] = useState<GoogleAdsConfig | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    getAdsConfig().then(setConfig);
  }, []);

  if (dismissed || !config || !config.enabled) {
    return null;
  }

  // Get slot ID based on type
  const slotId =
    slotType === 'hero'
      ? config.hero_slot
      : slotType === 'sidebar'
      ? config.sidebar_slot
      : slotType === 'footer'
      ? config.footer_slot
      : config.infeed_slot;

  // Real Google AdSense Script Injection helper if client_id is set
  const hasClientId = config.client_id && config.client_id.startsWith('ca-pub-');

  if (slotType === 'hero') {
    return (
      <div className={`relative w-full overflow-hidden rounded-2xl border border-amber-500/30 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-purple-500/10 p-4 shadow-sm ${className}`}>
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-amber-500 to-amber-600 text-white font-bold shadow-sm">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30">
                  Google Ads • Sponsor
                </span>
                <span className="text-[10px] text-muted-foreground font-mono">
                  Slot #{slotId}
                </span>
              </div>
              <p className="text-sm font-bold text-foreground mt-0.5">
                ¡Monetiza tus Compras y Ofertas en Bolivia!
              </p>
              <p className="text-xs text-muted-foreground hidden sm:block">
                Espacio publicitario optimizado con Google AdSense ({config.client_id || 'ca-pub-demo'})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="https://adsense.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs font-semibold text-amber-600 dark:text-amber-400 hover:underline px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20"
            >
              Ver Anuncio <ExternalLink className="h-3 w-3" />
            </a>
            <button
              onClick={() => setDismissed(true)}
              className="text-muted-foreground hover:text-foreground p-1"
              title="Cerrar publicidad"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Real AdSense Slot tag when client_id is valid */}
        {hasClientId && (
          <ins
            className="adsbygoogle"
            style={{ display: 'block' }}
            data-ad-client={config.client_id}
            data-ad-slot={slotId}
            data-ad-format="auto"
            data-full-width-responsive="true"
          />
        )}
      </div>
    );
  }

  if (slotType === 'sidebar') {
    return (
      <div className={`relative overflow-hidden rounded-2xl border border-purple-500/30 bg-gradient-to-b from-purple-500/10 to-card p-5 text-center shadow-sm ${className}`}>
        <div className="flex justify-between items-center mb-3">
          <span className="text-[10px] uppercase font-bold text-purple-600 dark:text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-full border border-purple-500/20">
            Publicidad Google Ads
          </span>
          <button onClick={() => setDismissed(true)} className="text-muted-foreground hover:text-foreground">
            <X className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="h-44 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 p-4 text-white flex flex-col items-center justify-center space-y-2 shadow-inner">
          <Sparkles className="h-8 w-8 animate-pulse text-amber-300" />
          <h4 className="font-bold text-sm">Banner Cuadrado 300x250</h4>
          <p className="text-[11px] text-white/80 line-clamp-2">
            Anuncio automático insertado mediante Google AdSense Bolivia.
          </p>
          <span className="text-[10px] font-mono bg-black/20 px-2 py-0.5 rounded">
            Slot: {slotId}
          </span>
        </div>

        {hasClientId && (
          <ins
            className="adsbygoogle"
            style={{ display: 'block' }}
            data-ad-client={config.client_id}
            data-ad-slot={slotId}
            data-ad-format="rectangle"
          />
        )}
      </div>
    );
  }

  if (slotType === 'footer') {
    return (
      <div className={`fixed bottom-0 left-0 right-0 z-50 border-t border-amber-500/30 bg-card/95 backdrop-blur-md px-4 py-2.5 shadow-2xl ${className}`}>
        <div className="container-app flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-500 text-slate-950 px-2 py-0.5 rounded-md">
              Google Ads
            </span>
            <p className="text-xs font-semibold text-foreground truncate">
              Publicidad Destacada • Descuentos Exclusivos patrocinados en Bolivia
            </p>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="https://adsense.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
            >
              Más info <ExternalLink className="h-3 w-3" />
            </a>
            <button
              onClick={() => setDismissed(true)}
              className="rounded-lg p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Default: In-feed Card Ad
  return (
    <div className={`relative overflow-hidden rounded-2xl border border-dashed border-amber-500/40 bg-amber-500/5 p-5 transition-all hover:border-amber-500/60 ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20 uppercase tracking-wide">
          Anuncio Patrocinado (Google Ads)
        </span>
        <button onClick={() => setDismissed(true)} className="text-muted-foreground hover:text-foreground">
          <X className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div className="h-20 w-full sm:w-28 shrink-0 rounded-xl bg-gradient-to-tr from-amber-500 to-purple-600 flex items-center justify-center text-white font-black text-xl shadow-md">
          ADS
        </div>
        <div className="space-y-1 text-center sm:text-left">
          <h4 className="font-bold text-sm text-foreground">
            Promociona tu Negocio con Google Adsense en Yaps
          </h4>
          <p className="text-xs text-muted-foreground line-clamp-2">
            Aumenta tus ventas alcanzando a miles de compradores activos en Bolivia. Anuncios optimizados para móvil y escritorio.
          </p>
        </div>
      </div>
    </div>
  );
}
