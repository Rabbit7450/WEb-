'use client';

import { Bell, Plus, ShieldCheck, User, LogOut, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth/auth-context';
import { Badge } from '@/components/ui/badge';
import { useRouter } from 'next/navigation';

interface AdminHeaderProps {
  title: string;
  subtitle?: string;
  onNewPromotion?: () => void;
  onToggleMobileMenu?: () => void;
}

export function AdminHeader({ title, subtitle, onNewPromotion, onToggleMobileMenu }: AdminHeaderProps) {
  const { role, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-border/50 bg-background/90 px-4 sm:px-6 backdrop-blur-md">
      {/* Mobile Hamburger & Title */}
      <div className="flex items-center gap-3 min-w-0">
        <Button
          variant="outline"
          size="icon"
          onClick={onToggleMobileMenu}
          className="md:hidden h-9 w-9 rounded-xl border-border/60 shrink-0"
          title="Abrir menú móvil"
        >
          <Menu className="h-5 w-5 text-foreground" />
        </Button>

        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-2 truncate">
            <h1 className="text-base sm:text-lg font-bold tracking-tight text-foreground truncate">
              {title}
            </h1>

            <Badge
              variant="outline"
              className={`hidden sm:inline-flex text-[10px] font-semibold gap-1 shrink-0 ${
                role === 'admin'
                  ? 'bg-primary/10 text-primary border-primary/30'
                  : 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30'
              }`}
            >
              {role === 'admin' ? (
                <>
                  <ShieldCheck className="h-3 w-3 text-primary" /> Admin
                </>
              ) : (
                <>
                  <User className="h-3 w-3 text-emerald-600" /> Usuario
                </>
              )}
            </Badge>
          </div>

          {subtitle && (
            <p className="text-[11px] sm:text-xs text-muted-foreground font-medium truncate hidden sm:block">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Notifications */}
        <Button variant="outline" size="icon" className="h-9 w-9 rounded-xl relative border-border/50 hidden sm:flex">
          <Bell className="h-4 w-4 text-muted-foreground" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-primary animate-pulse" />
        </Button>

        {/* Create Promotion Quick Action */}
        {onNewPromotion && (
          <Button
            onClick={onNewPromotion}
            className="h-9 px-3 sm:px-4 rounded-xl bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-700 text-white font-semibold text-xs shadow-md shadow-primary/20 flex items-center gap-1.5"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Nueva Oferta</span>
            <span className="sm:hidden">Oferta</span>
          </Button>
        )}

        {/* Logout */}
        <Button
          variant="outline"
          size="icon"
          onClick={handleLogout}
          className="h-9 w-9 rounded-xl border-border/50 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
          title="Cerrar sesión"
        >
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    </header>
  );
}
