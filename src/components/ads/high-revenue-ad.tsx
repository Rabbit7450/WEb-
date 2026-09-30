'use client';

import { useEffect, useRef } from 'react';

export function HighRevenueAdBanner() {
  const bannerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!bannerRef.current) return;

    // Evita duplicar el iframe en renderizados de React
    bannerRef.current.innerHTML = '';

    const scriptOptions = document.createElement('script');
    scriptOptions.type = 'text/javascript';
    scriptOptions.text = `
      atOptions = {
        'key' : '2b6aa95e82792fe4f25ad19968559165',
        'format' : 'iframe',
        'height' : 60,
        'width' : 468,
        'params' : {}
      };
    `;

    const scriptInvoke = document.createElement('script');
    scriptInvoke.type = 'text/javascript';
    scriptInvoke.src = 'https://www.highrevenueformat.com/2b6aa95e82792fe4f25ad19968559165/invoke.js';

    bannerRef.current.appendChild(scriptOptions);
    bannerRef.current.appendChild(scriptInvoke);
  }, []);

  return (
    <div className="my-4 flex flex-col items-center justify-center min-h-[70px] overflow-hidden rounded-xl border border-amber-500/20 bg-white dark:bg-slate-900 p-2 shadow-sm">
      <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-1">
        Publicidad Patrocinada
      </span>
      <div ref={bannerRef} className="w-[468px] max-w-full flex justify-center overflow-x-auto" />
    </div>
  );
}
