'use client';

import { Bell, Search, Plus, ShieldCheck, User, RefreshCw, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/lib/auth/auth-context';
import { Badge } from '@/components/ui/badge';

interface AdminHeaderProps {
  title: string;
  subtitle?: string;
  onNewPromotion?: () => void;
}

export function AdminHeader({ title, subtitle, onNewPromotion }: AdminHeaderProps) {
  const { user, role, switchRole, logout } = useAuth();

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-border/50 bg-background/85 px-6 backdrop-blur-md">
      {/* Title & Breadcrumb */}
      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          <h1 className="text-lg font-bold tracking-tight text-foreground">
            {title}
          </h1>

          <Badge
            variant="outline"
            className={`text-[10px] font-semibold gap-1 cursor-pointer transition-all ${
              role === 'admin'
                ? 'bg-primary/10 text-primary border-primary/30 hover:bg-primary/20'
                : 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30 hover:bg-emerald-500/20'
            }`}
            onClick={() => switchRole(role === 'admin' ? 'user' : 'admin')}
            title="Haz clic para alternar de rol (Modo Demo)"
          >
            {role === 'admin' ? (
              <>
                <ShieldCheck className="h-3 w-3 text-primary" /> Rol: Administrador
              </>
            ) : (
              <>
                <User className="h-3 w-3 text-emerald-600" /> Rol: Usuario / Negocio
              </>
            )}
          </Badge>
        </div>

        {subtitle && (
          <p className="text-xs text-muted-foreground font-medium truncate">
            {subtitle}
          </p>
        )}
      </div>

      {/* Actions & Role Switcher */}
      <div className="flex items-center gap-3">
        {/* Role Quick Toggle */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => switchRole(role === 'admin' ? 'user' : 'admin')}
          className="h-9 text-xs gap-1.5 rounded-xl border-border/60 hover:bg-accent"
          title="Alternar entre visión Administrador y Usuario"
        >
          <RefreshCw className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="hidden sm:inline">Cambiar a {role === 'admin' ? 'Usuario' : 'Admin'}</span>
        </Button>

        {/* Notifications */}
        <Button variant="outline" size="icon" className="h-9 w-9 rounded-xl relative border-border/50">
          <Bell className="h-4 w-4 text-muted-foreground" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-primary animate-pulse" />
        </Button>

        {/* Create Promotion Quick Action */}
        {onNewPromotion && (
          <Button
            onClick={onNewPromotion}
            className="h-9 px-4 rounded-xl bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-700 text-white font-semibold text-xs shadow-md shadow-primary/20 flex items-center gap-1.5"
          >
            <Plus className="h-4 w-4" />
            <span>Nueva Oferta</span>
          </Button>
        )}
      </div>
    </header>
  );
}
