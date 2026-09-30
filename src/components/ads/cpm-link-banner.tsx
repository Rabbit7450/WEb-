'use client';

import { ExternalLink, Sparkles, Flame } from 'lucide-react';

export function CpmLinkBanner() {
  const directAdUrl = 'https://www.profitableratecpmnetwork.com/qnryicwzi?key=0c45c6b031cc05ff93acc94783fe6a1c';

  return (
    <div className="my-5 overflow-hidden rounded-2xl border-2 border-amber-400/50 bg-gradient-to-r from-red-600 via-amber-500 to-red-600 p-0.5 shadow-xl">
      <div className="rounded-[14px] bg-amber-50 dark:bg-slate-900 p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3.5 text-left">
          <div className="h-11 w-11 shrink-0 rounded-2xl bg-gradient-to-tr from-red-600 to-amber-500 text-white flex items-center justify-center font-black shadow-md animate-pulse">
            <Flame className="h-6 w-6 text-amber-300 fill-amber-300" />
          </div>
          <div>
            <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-red-600 dark:text-amber-400 bg-red-100 dark:bg-red-950/60 px-2 py-0.5 rounded-md">
              <Sparkles className="h-3 w-3 text-amber-500" /> Oferta Exclusiva Patrocinada
            </span>
            <p className="text-xs sm:text-sm font-black text-slate-900 dark:text-white mt-1">
              ¡Haz clic para acceder a promociones especiales y beneficios exclusivos en Bs.!
            </p>
          </div>
        </div>

        <a
          href={directAdUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-red-600 to-amber-500 hover:from-red-700 hover:to-amber-600 px-6 py-3 text-xs font-black text-white shadow-lg shadow-red-500/30 transition-all shrink-0 hover:scale-105 active:scale-95"
        >
          <span>Ver Promoción Especial</span>
          <ExternalLink className="h-4 w-4" />
        </a>
      </div>
    </div>
  );
}
