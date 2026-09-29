import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GoogleAd } from "@/components/ads/google-ad";
import {
  Search,
  MapPin,
  Tag,
  TrendingUp,
  ArrowRight,
  Percent,
  Sparkles,
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background pb-12">
      <Header />

      <main>
        {/* Top Google Ad Hero Banner */}
        <div className="container-app pt-6">
          <GoogleAd slotType="hero" />
        </div>

        {/* Hero Banner */}
        <section className="relative overflow-hidden border-b bg-white mt-4">
          <div className="container-app py-16 md:py-24">
            <div className="mx-auto max-w-3xl text-center">
              <Badge
                variant="secondary"
                className="mb-6 bg-accent text-accent-foreground hover:bg-accent"
              >
                <Percent className="mr-1 h-3.5 w-3.5" />
                Las mejores ofertas de Bolivia
              </Badge>

              <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl">
                Todas las promociones
                <span className="block text-primary">en un solo lugar</span>
              </h1>

              <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
                Descubre descuentos reales de negocios de La Paz, Santa Cruz,
                Cochabamba y todo el país. Actualizado todos los días.
              </p>

              <div className="mx-auto mt-10 flex max-w-xl flex-col gap-3 sm:flex-row">
                <div className="relative flex-1">
                  <Search className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Buscar promociones, negocios o categorías..."
                    className="w-full rounded-xl border border-input bg-white py-3.5 pr-4 pl-11 text-sm shadow-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <Button
                  size="lg"
                  className="rounded-xl bg-primary px-8 hover:bg-primary/90"
                >
                  Buscar
                </Button>
              </div>

              <div className="mt-8 flex flex-wrap justify-center gap-2">
                {[
                  "Restaurantes",
                  "Moda",
                  "Tecnología",
                  "Salud",
                  "Turismo",
                  "Hogar",
                ].map((cat) => (
                  <Link
                    key={cat}
                    href={`/promociones?categoria=${cat.toLowerCase()}`}
                    className="rounded-full border bg-white px-4 py-1.5 text-sm text-muted-foreground transition-colors hover:border-primary hover:bg-accent hover:text-primary"
                  >
                    {cat}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Featured Promotions Section */}
        <section className="py-16 md:py-20">
          <div className="container-app">
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                  Promociones destacadas
                </h2>
                <p className="mt-1 text-muted-foreground">
                  Las ofertas más populares de esta semana
                </p>
              </div>
              <Link href="/promociones" className="hidden sm:flex">
                <Button variant="outline">
                  Ver todas
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {[1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className="group overflow-hidden rounded-2xl border bg-white shadow-sm transition-all hover:border-primary/30 hover:shadow-md"
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                    <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                      <Tag className="h-10 w-10 opacity-20" />
                    </div>
                    <div className="absolute top-3 left-3">
                      <Badge className="bg-primary text-white hover:bg-primary">
                        -{20 + item * 5}%
                      </Badge>
                    </div>
                  </div>

                  <div className="p-4">
                    <div className="mb-2 flex items-center gap-2 text-xs text-muted-foreground">
                      <MapPin className="h-3.5 w-3.5" />
                      <span>La Paz</span>
                      <span>•</span>
                      <span>Restaurantes</span>
                    </div>

                    <h3 className="line-clamp-2 font-semibold text-foreground transition-colors group-hover:text-primary">
                      2x1 en almuerzos ejecutivos + postre gratis
                    </h3>

                    <div className="mt-3 flex items-end justify-between">
                      <div>
                        <span className="text-sm text-muted-foreground line-through">
                          Bs. 80
                        </span>
                        <span className="ml-2 text-lg font-bold text-primary">
                          Bs. 40
                        </span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        Hasta 28 Sep
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* In-Feed Google Ads Banner */}
            <div className="my-10">
              <GoogleAd slotType="infeed" />
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {[5, 6, 7, 8].map((item) => (
                <div
                  key={item}
                  className="group overflow-hidden rounded-2xl border bg-white shadow-sm transition-all hover:border-primary/30 hover:shadow-md"
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                    <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                      <Tag className="h-10 w-10 opacity-20" />
                    </div>
                    <div className="absolute top-3 left-3">
                      <Badge className="bg-primary text-white hover:bg-primary">
                        -{20 + item * 5}%
                      </Badge>
                    </div>
                  </div>

                  <div className="p-4">
                    <div className="mb-2 flex items-center gap-2 text-xs text-muted-foreground">
                      <MapPin className="h-3.5 w-3.5" />
                      <span>Santa Cruz</span>
                      <span>•</span>
                      <span>Tecnología</span>
                    </div>

                    <h3 className="line-clamp-2 font-semibold text-foreground transition-colors group-hover:text-primary">
                      30% OFF en Laptops y Audífonos Inalámbricos
                    </h3>

                    <div className="mt-3 flex items-end justify-between">
                      <div>
                        <span className="text-sm text-muted-foreground line-through">
                          Bs. 450
                        </span>
                        <span className="ml-2 text-lg font-bold text-primary">
                          Bs. 315
                        </span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        Hasta 30 Oct
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="border-y bg-white py-16">
          <div className="container-app">
            <div className="mb-10 text-center">
              <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                Explora por categoría
              </h2>
              <p className="mt-2 text-muted-foreground">
                Encuentra exactamente lo que buscas
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
                  className="flex flex-col items-center gap-3 rounded-2xl border bg-background p-6 transition-all hover:border-primary hover:bg-accent hover:shadow-sm"
                >
                  <span className="text-3xl">{cat.icon}</span>
                  <span className="text-sm font-medium text-foreground">
                    {cat.name}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Business CTA */}
        <section className="py-20">
          <div className="container-app">
            <div className="relative overflow-hidden rounded-3xl bg-primary px-8 py-16 text-center text-white md:px-16">
              <div className="relative z-10 mx-auto max-w-2xl">
                <TrendingUp className="mx-auto mb-6 h-12 w-12 opacity-90" />
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                  ¿Tienes un negocio?
                </h2>
                <p className="mt-4 text-lg text-white/90">
                  Publica tus promociones gratis y llega a miles de personas en
                  Bolivia. Simple, rápido y efectivo.
                </p>
                <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
                  <Link href="/login">
                    <Button
                      size="lg"
                      variant="secondary"
                      className="rounded-xl bg-white text-primary hover:bg-white/90 font-bold"
                    >
                      Publicar promoción
                    </Button>
                  </Link>
                  <Link href="/admin">
                    <Button
                      size="lg"
                      variant="outline"
                      className="rounded-xl border-white/40 text-white hover:bg-white/10"
                    >
                      Ir al Panel de Acceso
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t bg-white py-12">
        <div className="container-app">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <span className="text-sm font-bold text-white">Y</span>
              </div>
              <span className="font-bold text-foreground">
                Yap<span className="text-primary">s</span>
              </span>
            </div>

            <p className="text-center text-sm text-muted-foreground">
              © 2026 Yaps — Todas las promociones de Bolivia en un solo lugar
            </p>

            <div className="flex gap-6 text-sm text-muted-foreground">
              <Link href="/login" className="transition-colors hover:text-primary font-medium">
                Panel de Acceso (Admin / Usuario)
              </Link>
            </div>
          </div>
        </div>
      </footer>

      {/* Footer Sticky Google Ad */}
      <GoogleAd slotType="footer" />
    </div>
  );
}
