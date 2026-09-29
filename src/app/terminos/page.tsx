import { Header } from "@/components/layout/header";

export default function TerminosPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container-app py-16">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Términos
        </h1>
        <p className="mt-2 text-muted-foreground">
          Los términos y condiciones de Yaps se publicarán en esta página.
        </p>
      </main>
    </div>
  );
}
