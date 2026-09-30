import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-red-500/20 bg-white/95 backdrop-blur-md shadow-sm">
      <div className="container-app flex h-16 items-center justify-between">
        {/* Logo Brand using /img/Logo.webp */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="relative h-10 w-10 overflow-hidden rounded-xl bg-gradient-to-tr from-red-600 via-red-500 to-amber-500 p-0.5 shadow-md shadow-red-500/20 group-hover:scale-105 transition-transform duration-300">
            <div className="h-full w-full rounded-[10px] bg-white flex items-center justify-center p-0.5">
              <img
                src="/img/Logo.webp"
                alt="Yaps Bolivia Logo"
                className="h-full w-full object-contain"
              />
            </div>
          </div>

          <div className="flex flex-col">
            <span className="text-xl font-black tracking-tight text-slate-900 flex items-center gap-1">
              Yap<span className="text-red-600">s</span>
              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-md bg-amber-400 text-slate-950 uppercase tracking-wider">
                BO
              </span>
            </span>
            <span className="text-[9px] font-bold text-red-600 uppercase tracking-widest -mt-1">
              Promociones Bolivia
            </span>
          </div>
        </Link>

        {/* Navigation */}
        <nav className="hidden items-center gap-6 md:flex">
          <Link
            href="/promociones"
            className="text-sm font-semibold text-slate-700 transition-colors hover:text-red-600"
          >
            Promociones
          </Link>
          <Link
            href="/categorias"
            className="text-sm font-semibold text-slate-700 transition-colors hover:text-red-600"
          >
            Categorías
          </Link>
          <Link
            href="/mapa"
            className="text-sm font-semibold text-slate-700 transition-colors hover:text-red-600"
          >
            Mapa de Ofertas
          </Link>
        </nav>

        {/* Buttons */}
        <div className="flex items-center gap-3">
          <Link href="/login">
            <Button variant="outline" size="sm" className="hidden sm:inline-flex rounded-xl border-red-500/30 text-red-600 hover:bg-red-50 font-bold text-xs">
              Panel Acceso
            </Button>
          </Link>
          <Link href="/login">
            <Button className="bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white font-bold rounded-xl text-xs shadow-md shadow-red-500/25 animate-pulse">
              Publicar Promo
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
