import { Header } from "@/components/layout/header";

export default function PromocionesPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container-app py-16">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Promociones
        </h1>
        <p className="mt-2 text-muted-foreground">
          Pronto verás aquí todas las ofertas de Bolivia.
        </p>
      </main>
    </div>
  );
}
