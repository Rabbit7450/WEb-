'use client';

import { useState } from "react";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GoogleAd } from "@/components/ads/google-ad";
import { CpmLinkBanner } from "@/components/ads/cpm-link-banner";
import { PublishPromoModal } from "@/components/promotions/publish-promo-modal";
import {
  Search,
  MapPin,
  Tag,
  TrendingUp,
  ArrowRight,
  Percent,
  Sparkles,
  Flame,
  CheckCircle2
} from "lucide-react";

export default function HomePage() {
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-amber-50/70 text-slate-900 pb-12 font-sans">
      <Header />

      <main>
        {/* Top Ad Banners */}
        <div className="container-app pt-6 space-y-4">
          <GoogleAd slotType="hero" />
          <CpmLinkBanner />
        </div>

        {/* Hero Section in Rojo, Amarillo y Blanco */}
        <section className="relative overflow-hidden border-b border-red-500/20 bg-gradient-to-b from-amber-100/60 via-red-500/10 to-amber-500/20 mt-4 py-16 md:py-24">
          <div className="container-app">
            <div className="mx-auto max-w-3xl text-center">
              {/* Floating Badge in Yellow & Red */}
              <div className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-md shadow-amber-500/20 animate-bounce">
                <Flame className="h-4 w-4 text-red-600 fill-red-600" />
                <span>Las Mejores Ofertas de Bolivia en Bolivianos (Bs.)</span>
              </div>

              <h1 className="text-balance text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-slate-900">
                Todas las promociones de Bolivia
                <span className="block text-red-600 mt-2 bg-gradient-to-r from-red-600 to-amber-500 bg-clip-text text-transparent">
                  en un solo lugar
                </span>
              </h1>

              <p className="mx-auto mt-6 max-w-2xl text-base sm:text-lg text-slate-600 font-medium">
                Descubre descuentos reales en <strong className="text-slate-900">Bolivianos (Bs.)</strong> de restaurantes, tecnología y tiendas en La Paz, Santa Cruz, Cochabamba y todo el país.
              </p>

              {/* Search Box in White & Red */}
              <div className="mx-auto mt-10 flex max-w-xl flex-col gap-3 sm:flex-row p-2 rounded-2xl bg-white border border-red-500/30 shadow-xl shadow-red-500/10">
                <div className="relative flex-1">
                  <Search className="absolute top-1/2 left-3.5 h-5 w-5 -translate-y-1/2 text-red-500" />
                  <input
                    type="text"
                    placeholder="Buscar promociones, comercios o categorías en Bs..."
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
                  { name: "Gastronomía", icon: "🍽️" },
                  { name: "Moda", icon: "👕" },
                  { name: "Tecnología", icon: "📱" },
                  { name: "Salud", icon: "💊" },
                  { name: "Turismo", icon: "✈️" },
                  { name: "Hogar", icon: "🏠" },
                ].map((cat) => (
                  <Link
                    key={cat.name}
                    href={`/promociones?categoria=${cat.name.toLowerCase()}`}
                    className="rounded-full border border-red-500/20 bg-white px-4 py-1.5 text-xs font-bold text-slate-700 transition-all hover:border-red-500 hover:bg-amber-400 hover:text-slate-950 shadow-sm flex items-center gap-1.5"
                  >
                    <span>{cat.icon}</span>
                    <span>{cat.name}</span>
                  </Link>
                ))}
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
                  <Flame className="h-7 w-7 text-red-600 fill-red-600" /> Promociones Destacadas en Bolivianos (Bs.)
                </h2>
                <p className="mt-1 text-sm text-slate-500 font-medium">
                  Descuentos verificados y actualizados diariamente
                </p>
              </div>
              <Link href="/promociones" className="hidden sm:flex">
                <Button variant="outline" className="rounded-xl border-red-500/30 text-red-600 hover:bg-red-50 font-bold text-xs">
                  Ver todas las ofertas
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>

            {/* Grid of Promotions in Red, Yellow, White with Animations */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  id: 1,
                  title: "Combo Hamburguesa Doble Queso + Papas + Bebida",
                  business: "Burger Craft House",
                  city: "La Paz",
                  category: "Gastronomía",
                  discount: 50,
                  priceOrig: 80,
                  priceOffer: 40,
                  image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80",
                },
                {
                  id: 2,
                  title: "Audífonos Inalámbricos Noise Cancelling 30h",
                  business: "TechStore Bolivia",
                  city: "Santa Cruz",
                  category: "Tecnología",
                  discount: 30,
                  priceOrig: 450,
                  priceOffer: 315,
                  image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80",
                },
                {
                  id: 3,
                  title: "2x1 en Pistas de Bowling y Bebidas los Jueves",
                  business: "Mega Bowling Center",
                  city: "Cochabamba",
                  category: "Entretenimiento",
                  discount: 50,
                  priceOrig: 100,
                  priceOffer: 50,
                  image: "https://images.unsplash.com/photo-1538510114876-435785b30831?w=800&q=80",
                },
                {
                  id: 4,
                  title: "Zapatillas Deportivas Importadas de Temporada",
                  business: "Sport Style Bolivia",
                  city: "La Paz",
                  category: "Moda",
                  discount: 40,
                  priceOrig: 350,
                  priceOffer: 210,
                  image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80",
                },
              ].map((promo) => (
                <div
                  key={promo.id}
                  className="promo-card-hover group overflow-hidden rounded-2xl border border-red-500/20 bg-white shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    {/* Image Banner */}
                    <div className="relative aspect-[4/3] overflow-hidden bg-slate-950">
                      <img
                        src={promo.image}
                        alt={promo.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      {/* Red & Gold Discount Badge */}
                      <div className="absolute top-3 left-3 bg-gradient-to-r from-red-600 to-amber-500 text-white px-3 py-1 rounded-full font-black text-xs shadow-lg flex items-center gap-1 animate-pulse">
                        -{promo.discount}% OFF
                      </div>
                    </div>

                    <div className="p-5">
                      <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-slate-500">
                        <MapPin className="h-3.5 w-3.5 text-red-600" />
                        <span>{promo.city}</span>
                        <span>•</span>
                        <span className="text-red-600">{promo.category}</span>
                      </div>

                      <h3 className="line-clamp-2 font-bold text-slate-900 group-hover:text-red-600 transition-colors text-sm leading-snug">
                        {promo.title}
                      </h3>

                      <p className="text-xs text-slate-500 mt-1 font-medium">
                        {promo.business}
                      </p>

                      {/* Prices formatted in Bolivianos (Bs.) */}
                      <div className="mt-4 flex items-baseline justify-between pt-3 border-t border-slate-100">
                        <div>
                          <span className="text-xs text-slate-400 line-through mr-2 font-semibold">
                            Bs. {promo.priceOrig}
                          </span>
                          <span className="text-xl font-black text-red-600">
                            Bs. {promo.priceOffer}
                          </span>
                        </div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-400 text-slate-950">
                          Bs. OFERTA
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* In-Feed Google Ads Banner */}
            <div className="my-10">
              <GoogleAd slotType="infeed" />
            </div>

            {/* Second row of promotions */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  id: 5,
                  title: "Limpieza Dental Ultrasónica + Diagnóstico",
                  business: "Clínica OdontoDental",
                  city: "Santa Cruz",
                  category: "Salud",
                  discount: 35,
                  priceOrig: 200,
                  priceOffer: 130,
                  image: "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=800&q=80",
                },
                {
                  id: 6,
                  title: "Paquete Turístico Salar de Uyuni 2D/1N",
                  business: "Bolivia Travel Tours",
                  city: "Tarija",
                  category: "Turismo",
                  discount: 25,
                  priceOrig: 800,
                  priceOffer: 600,
                  image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&q=80",
                },
                {
                  id: 7,
                  title: "Smart TV 55 Pulgadas 4K Ultra HD",
                  business: "Electro Hogar Bolivia",
                  city: "La Paz",
                  category: "Tecnología",
                  discount: 20,
                  priceOrig: 3200,
                  priceOffer: 2560,
                  image: "https://images.unsplash.com/photo-1593784991095-a205069470b6?w=800&q=80",
                },
                {
                  id: 8,
                  title: "Corte de Cabello + Tratamiento Capilar + Barbería",
                  business: "Barber & Beauty Club",
                  city: "Cochabamba",
                  category: "Belleza",
                  discount: 40,
                  priceOrig: 120,
                  priceOffer: 72,
                  image: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=800&q=80",
                },
              ].map((promo) => (
                <div
                  key={promo.id}
                  className="promo-card-hover group overflow-hidden rounded-2xl border border-red-500/20 bg-white shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="relative aspect-[4/3] overflow-hidden bg-slate-950">
                      <img
                        src={promo.image}
                        alt={promo.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute top-3 left-3 bg-gradient-to-r from-red-600 to-amber-500 text-white px-3 py-1 rounded-full font-black text-xs shadow-lg flex items-center gap-1 animate-pulse">
                        -{promo.discount}% OFF
                      </div>
                    </div>

                    <div className="p-5">
                      <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-slate-500">
                        <MapPin className="h-3.5 w-3.5 text-red-600" />
                        <span>{promo.city}</span>
                        <span>•</span>
                        <span className="text-red-600">{promo.category}</span>
                      </div>

                      <h3 className="line-clamp-2 font-bold text-slate-900 group-hover:text-red-600 transition-colors text-sm leading-snug">
                        {promo.title}
                      </h3>

                      <p className="text-xs text-slate-500 mt-1 font-medium">
                        {promo.business}
                      </p>

                      <div className="mt-4 flex items-baseline justify-between pt-3 border-t border-slate-100">
                        <div>
                          <span className="text-xs text-slate-400 line-through mr-2 font-semibold">
                            Bs. {promo.priceOrig}
                          </span>
                          <span className="text-xl font-black text-red-600">
                            Bs. {promo.priceOffer}
                          </span>
                        </div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-400 text-slate-950">
                          Bs. OFERTA
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="border-y border-red-500/20 bg-white py-16">
          <div className="container-app">
            <div className="mb-10 text-center">
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Explora por Categoría en Bolivia
              </h2>
              <p className="mt-2 text-slate-600 font-medium text-sm">
                Encuentra descuentos en Bolivianos (Bs.) organizados según tu necesidad
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
              {[
                { name: "Restaurantes", icon: "🍽️" },
                { name: "Moda", icon: "👕" },
                { name: "Tecnología", icon: "📱" },
                { name: "Salud", icon: "💊" },
                { name: "Turismo", icon: "✈️" },
                { name: "Hogar", icon: "🏠" },
                { name: "Belleza", icon: "💄" },
                { name: "Deportes", icon: "⚽" },
                { name: "Educación", icon: "📚" },
                { name: "Automotriz", icon: "🚗" },
                { name: "Mascotas", icon: "🐶" },
                { name: "Otros", icon: "🏷️" },
              ].map((cat) => (
                <Link
                  key={cat.name}
                  href={`/promociones?categoria=${cat.name.toLowerCase()}`}
                  className="flex flex-col items-center gap-3 rounded-2xl border border-slate-200 bg-white p-6 transition-all hover:border-red-500 hover:bg-amber-400/20 hover:shadow-lg hover:-translate-y-1 group"
                >
                  <span className="text-3xl group-hover:scale-125 transition-transform">{cat.icon}</span>
                  <span className="text-xs font-bold text-slate-900 group-hover:text-red-600">
                    {cat.name}
                  </span>
                </Link>
              ))}
            </div>
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
                  Publica tus promociones en Bolivianos (Bs.) gratis y llega a miles de compradores activos en La Paz, Santa Cruz, Cochabamba y todo el país.
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
                Yap<span className="text-red-600">s</span> <span className="text-xs font-bold text-amber-500">Bolivia (Bs.)</span>
              </span>
            </div>

            <p className="text-center text-xs text-slate-500 font-semibold">
              © 2026 Yaps — Todas las promociones de Bolivia en Bolivianos (Bs.)
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
    </div>
  );
}
