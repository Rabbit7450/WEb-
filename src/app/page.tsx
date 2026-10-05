'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { GoogleAd } from "@/components/ads/google-ad";
import { PublishPromoModal } from "@/components/promotions/publish-promo-modal";
import { PromoDetailModal } from "@/components/promotions/promo-detail-modal";
import { getPromotions } from "@/lib/services/promotions";
import { Promotion } from "@/types/admin";
import {
  Search,
  MapPin,
  TrendingUp,
  ArrowRight,
  Flame,
  Sparkles,
  Eye,
  Store,
  ExternalLink
} from "lucide-react";

export default function HomePage() {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [selectedPromo, setSelectedPromo] = useState<Promotion | null>(null);

  useEffect(() => {
    // Clear legacy localStorage cache if old demo items exist
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('yaps_promotions');
        if (stored && (stored.includes('p-1') || stored.includes('Burger Craft'))) {
          localStorage.removeItem('yaps_promotions');
        }
      } catch {
        // ignore
      }
    }

    getPromotions().then(setPromotions);
  }, []);

  const filteredPromotions = promotions.filter((promo) => {
    const matchesSearch = searchQuery === '' || 
      promo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (promo.business_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (promo.description || '').toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = !selectedCategory || 
      (promo.category_name || '').toLowerCase().includes(selectedCategory.toLowerCase());

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-amber-50/70 text-slate-900 pb-12 font-sans">
      <Header />

      <main>
        {/* Top Ad Banners */}
        <div className="container-app pt-6 space-y-4">
          <GoogleAd slotType="hero" />
        </div>

        {/* Hero Section in Rojo, Amarillo y Blanco */}
        <section className="relative overflow-hidden border-b border-red-500/20 bg-gradient-to-b from-amber-100/60 via-red-500/10 to-amber-500/20 mt-4 py-16 md:py-24">
          <div className="container-app">
            <div className="mx-auto max-w-3xl text-center">
              {/* Floating Badge in Yellow & Red */}
              <div className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-md shadow-amber-500/20 animate-bounce">
                <Flame className="h-4 w-4 text-red-600 fill-red-600" />
                <span>Las Mejores Ofertas de Bolivia</span>
              </div>

              <h1 className="text-balance text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-slate-900">
                Todas las promociones de Bolivia
                <span className="block text-red-600 mt-2 bg-gradient-to-r from-red-600 to-amber-500 bg-clip-text text-transparent">
                  en un solo lugar
                </span>
              </h1>

              <p className="mx-auto mt-6 max-w-2xl text-base sm:text-lg text-slate-600 font-medium">
                Descubre descuentos reales de supermercados, cines, restaurantes y tiendas en La Paz, El Alto y Cochabamba.
              </p>

              {/* Search Box in White & Red */}
              <div className="mx-auto mt-10 flex max-w-xl flex-col gap-3 sm:flex-row p-2 rounded-2xl bg-white border border-red-500/30 shadow-xl shadow-red-500/10">
                <div className="relative flex-1">
                  <Search className="absolute top-1/2 left-3.5 h-5 w-5 -translate-y-1/2 text-red-500" />
                  <input
                    type="text"
                    placeholder="Buscar promociones, comercios o categorías..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full rounded-xl bg-transparent py-3 pr-4 pl-11 text-sm font-medium text-slate-900 outline-none placeholder:text-slate-400"
                  />
                </div>
                <Button
                  size="lg"
                  className="rounded-xl bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white font-bold px-8 shadow-md shadow-red-500/30"
                >
                  Buscar Ofertas
                </Button>
              </div>

              {/* Quick Category Pills in White & Red/Yellow */}
              <div className="mt-8 flex flex-wrap justify-center gap-2">
                {[
                  { name: "Supermercado", icon: "🛒" },
                  { name: "Gastronomía", icon: "🍽️" },
                  { name: "Entretenimiento", icon: "🎬" },
                ].map((cat) => (
                  <button
                    key={cat.name}
                    onClick={() => setSelectedCategory(selectedCategory === cat.name ? null : cat.name)}
                    className={`rounded-full border px-4 py-1.5 text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 ${
                      selectedCategory === cat.name
                        ? "border-red-600 bg-red-600 text-white"
                        : "border-red-500/20 bg-white text-slate-700 hover:border-red-500 hover:bg-amber-400 hover:text-slate-950"
                    }`}
                  >
                    <span>{cat.icon}</span>
                    <span>{cat.name}</span>
                  </button>
                ))}
                {selectedCategory && (
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className="rounded-full bg-slate-200 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-300"
                  >
                    ✕ Ver Todas
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Featured Promotions Section */}
        <section className="py-16">
          <div className="container-app">
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl flex items-center gap-2">
                  <Flame className="h-7 w-7 text-red-600 fill-red-600" /> Promociones Oficiales
                </h2>
                <p className="mt-1 text-sm text-slate-500 font-medium">
                  Ofertas verificadas de Makro Abasto, Pollos Cochabamba y Multicine
                </p>
              </div>
              <Link href="/promociones" className="hidden sm:flex">
                <Button variant="outline" className="rounded-xl border-red-500/30 text-red-600 hover:bg-red-50 font-bold text-xs bg-white">
                  Ver todas las ofertas
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>

            {/* Grid of Promotions in Red, Yellow, White with Animations */}
            {filteredPromotions.length === 0 ? (
              <div className="p-12 text-center rounded-3xl bg-white border border-amber-300 shadow-sm">
                <p className="text-sm font-bold text-slate-600">
                  No se encontraron promociones que coincidan con tu búsqueda.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredPromotions.map((promo) => (
                  <div
                    key={promo.id}
                    onClick={() => setSelectedPromo(promo)}
                    className="promo-card-hover group overflow-hidden rounded-2xl border border-red-500/20 bg-white shadow-md transition-all flex flex-col justify-between cursor-pointer"
                  >
                    <div>
                      {/* Image Banner */}
                      <div className="relative aspect-[4/3] overflow-hidden bg-slate-950">
                        <img
                          src={promo.image_url}
                          alt={promo.title}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        {/* Red & Gold Discount Badge */}
                        <div className="absolute top-3 left-3 bg-gradient-to-r from-red-600 to-amber-500 text-white px-3 py-1 rounded-full font-black text-xs shadow-lg flex items-center gap-1 animate-pulse">
                          -{promo.discount_percentage}% OFF
                        </div>
                      </div>

                      <div className="p-5">
                        <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-slate-500">
                          <MapPin className="h-3.5 w-3.5 text-red-600" />
                          <span>{promo.city_name}</span>
                          <span>•</span>
                          <span className="text-red-600">{promo.category_name}</span>
                        </div>

                        <h3 className="line-clamp-2 font-bold text-slate-900 group-hover:text-red-600 transition-colors text-base leading-snug">
                          {promo.title}
                        </h3>

                        <p className="text-xs text-slate-500 mt-1 font-medium flex items-center gap-1">
                          <Store className="h-3.5 w-3.5 text-amber-600" />
                          <span>{promo.business_name}</span>
                        </p>

                        <p className="text-xs text-slate-600 mt-2 line-clamp-2">
                          {promo.description}
                        </p>

                        {/* Prices formatted in Bolivianos (Bs.) */}
                        <div className="mt-4 flex items-baseline justify-between pt-3 border-t border-slate-100">
                          <div>
                            <span className="text-xs text-slate-400 line-through mr-2 font-semibold">
                              Bs. {promo.original_price}
                            </span>
                            <span className="text-xl font-black text-red-600">
                              Bs. {promo.offer_price}
                            </span>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (promo.link_url && promo.link_url.trim()) {
                                const target = promo.link_url.startsWith('http') ? promo.link_url : `https://${promo.link_url}`;
                                window.open(target, '_blank');
                              } else {
                                setSelectedPromo(promo);
                              }
                            }}
                            className="text-[10px] font-black px-2.5 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 flex items-center gap-1 transition-all shadow-sm"
                          >
                            {promo.link_url ? (
                              <>
                                <ExternalLink className="h-3 w-3 text-red-600" /> Ver Oferta
                              </>
                            ) : (
                              <>
                                <Eye className="h-3 w-3" /> Ver Oferta
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Business Banner CTA in Red & Yellow */}
        <section className="py-20">
          <div className="container-app">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-red-600 via-red-500 to-amber-500 px-8 py-16 text-center text-white shadow-2xl md:px-16">
              <div className="relative z-10 mx-auto max-w-2xl">
                <TrendingUp className="mx-auto mb-6 h-12 w-12 text-amber-300 animate-bounce" />
                <h2 className="text-3xl font-black tracking-tight sm:text-4xl text-white">
                  ¿Tienes un negocio en Bolivia?
                </h2>
                <p className="mt-4 text-base sm:text-lg text-white/95 font-medium leading-relaxed">
                  Publica tus promociones gratis y llega a miles de compradores activos en La Paz, El Alto, Santa Cruz y Cochabamba.
                </p>
                <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
                  <Button
                    size="lg"
                    onClick={() => setIsPublishModalOpen(true)}
                    className="rounded-xl bg-amber-400 text-slate-950 hover:bg-amber-300 font-black text-sm px-8 shadow-xl shadow-amber-400/30 flex items-center justify-center gap-2"
                  >
                    <Sparkles className="h-4 w-4 text-red-600 fill-red-600" />
                    <span>Publicar mi Promoción</span>
                  </Button>
                  <Link href="/login">
                    <Button
                      size="lg"
                      variant="outline"
                      className="rounded-xl border-white/50 text-white hover:bg-white/20 font-bold text-sm"
                    >
                      Panel de Acceso
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer in Red & Yellow */}
      <footer className="border-t border-amber-200/60 bg-amber-100/40 py-12">
        <div className="container-app">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <div className="flex items-center gap-2.5">
              <div className="h-9 w-9 overflow-hidden rounded-xl border border-red-500/20 bg-white p-0.5 shadow-sm">
                <img src="/img/Logo.webp" alt="Yaps Logo" className="h-full w-full object-contain" />
              </div>
              <span className="font-black text-slate-900 text-lg">
                Yap<span className="text-red-600">s</span> <span className="text-xs font-bold text-amber-500">Bolivia</span>
              </span>
            </div>

            <p className="text-center text-xs text-slate-500 font-semibold">
              © 2026 Yaps — Todas las promociones de Bolivia
            </p>

            <div className="flex gap-6 text-xs font-bold text-slate-600">
              <Link href="/login" className="transition-colors hover:text-red-600">
                Panel de Acceso
              </Link>
            </div>
          </div>
        </div>
      </footer>

      {/* Footer Sticky Google Ad */}
      <GoogleAd slotType="footer" />

      {/* Publish Promotion Form Modal */}
      <PublishPromoModal
        isOpen={isPublishModalOpen}
        onClose={() => setIsPublishModalOpen(false)}
      />

      {/* Promotion Detail View Modal */}
      <PromoDetailModal
        promo={selectedPromo}
        onClose={() => setSelectedPromo(null)}
      />
    </div>
  );
}
