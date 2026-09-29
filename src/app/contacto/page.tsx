import { Header } from "@/components/layout/header";

export default function ContactoPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container-app py-16">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Contacto
        </h1>
        <p className="mt-2 text-muted-foreground">
          Pronto podrás escribirnos desde esta página.
        </p>
      </main>
    </div>
  );
}
