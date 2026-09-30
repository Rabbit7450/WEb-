'use client';

import { ExternalLink, Sparkles } from 'lucide-react';

export function CpmAdBanner() {
  const directAdLink = 'https://www.profitableratecpmnetwork.com/tzjpt0kex6?key=d1978069cd20438418f83ea73dc569de';

  return (
    <div className="my-6 overflow-hidden rounded-2xl border border-amber-400/40 bg-gradient-to-r from-amber-500/10 via-red-500/10 to-amber-500/10 p-4 text-center shadow-md">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 text-left">
          <div className="h-10 w-10 shrink-0 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold shadow">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-700 dark:text-amber-400">
              Patrocinado / Oferta Especial
            </span>
            <p className="text-xs font-bold text-slate-900 dark:text-white">
              ¡Haz clic aquí para ver promociones de tiempo limitado y bonos exclusivos en Bs.!
            </p>
          </div>
        </div>

        <a
          href={directAdLink}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-red-600 px-5 py-2.5 text-xs font-black text-white shadow-md hover:from-amber-600 hover:to-red-700 transition-all shrink-0 hover:scale-105 active:scale-95"
        >
          <span>Ver Oferta Patrocinada</span>
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </div>

      {/* Network CPM Ad Banner Container */}
      <div className="mt-4 flex justify-center min-h-[50px]">
        <div id="container-9a28b1831f6bf8749e072041e3270242" className="w-full max-w-full overflow-x-auto"></div>
      </div>
    </div>
  );
}
