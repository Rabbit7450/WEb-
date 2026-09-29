import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
      <div className="container-app flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <span className="text-lg font-bold text-white">Y</span>
          </div>
          <span className="text-xl font-bold tracking-tight text-foreground">
            Yap<span className="text-primary">s</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          <Link
            href="/promociones"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            Promociones
          </Link>
          <Link
            href="/categorias"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            Categorías
          </Link>
          <Link
            href="/mapa"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            Mapa
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <Link href="/admin">
            <Button variant="outline" size="sm" className="hidden sm:inline-flex rounded-xl border-primary/30 text-primary hover:bg-primary/10">
              Panel Admin
            </Button>
          </Link>
          <Link href="/admin/login">
            <Button className="bg-primary hover:bg-primary/90 rounded-xl">
              Publicar promo
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
