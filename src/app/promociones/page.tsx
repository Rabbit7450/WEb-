'use client';

import { useState, useEffect } from "react";
import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { getPromotions } from "@/lib/services/promotions";
import { Promotion } from "@/types/admin";
import { PromoDetailModal } from "@/components/promotions/promo-detail-modal";
import { GoogleAd } from "@/components/ads/google-ad";
import { Search, MapPin, Store, Eye, Flame, Tag } from "lucide-react";

export default function PromocionesPage() {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedPromo, setSelectedPromo] = useState<Promotion | null>(null);

  useEffect(() => {
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

      <main className="container-app py-10 space-y-8">
        {/* Ad Banner */}
        <GoogleAd slotType="hero" />

        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-red-500/20 pb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider mb-2">
              <Flame className="h-4 w-4 text-red-600 fill-red-600" /> Catálogo Oficial de Bolivia
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900">
              Todas las Promociones
            </h1>
            <p className="mt-1 text-sm text-slate-600 font-medium">
              Explora las ofertas verificadas de supermercados, cines y restaurantes.
            </p>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <Search className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-red-500" />
            <input
              type="text"
              placeholder="Buscar en el catálogo..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl bg-white border border-amber-300 py-2.5 pr-4 pl-10 text-xs font-semibold text-slate-900 shadow-sm outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2">
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
                  : "border-amber-300 bg-white text-slate-700 hover:border-red-500 hover:bg-amber-400 hover:text-slate-950"
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

        {/* Promotions Grid */}
        {filteredPromotions.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-white border border-amber-300 shadow-sm">
            <p className="text-sm font-bold text-slate-600">
              No hay promociones que coincidan con la búsqueda.
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
                    {/* Discount Badge */}
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
                      <span className="text-[10px] font-black px-2.5 py-1 rounded-lg bg-amber-400 text-slate-950 flex items-center gap-1">
                        <Eye className="h-3 w-3" /> Ver Oferta
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Promotion Detail View Modal */}
      <PromoDetailModal
        promo={selectedPromo}
        onClose={() => setSelectedPromo(null)}
      />
    </div>
  );
}
