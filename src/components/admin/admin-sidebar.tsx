'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  Tag, 
  Building2, 
  FolderKanban, 
  Users,
  Settings, 
  LogOut, 
  ExternalLink,
  Sparkles,
  ShieldCheck,
  User,
  DollarSign,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useAuth } from '@/lib/auth/auth-context';
import { toast } from 'sonner';

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  badge?: string;
  adminOnly?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { label: 'Promociones', href: '/admin/promociones', icon: Tag, badge: 'Nuevas' },
  { label: 'Negocios', href: '/admin/negocios', icon: Building2 },
  { label: 'Categorías', href: '/admin/categorias', icon: FolderKanban, adminOnly: true },
  { label: 'Usuarios y Roles', href: '/admin/usuarios', icon: Users, adminOnly: true, badge: 'Roles' },
  { label: 'Publicidad & Ajustes', href: '/admin/configuracion', icon: DollarSign, badge: 'Google Ads' },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, role, logout, switchRole } = useAuth();

  const filteredItems = NAV_ITEMS.filter((item) => !item.adminOnly || role === 'admin');

  const handleLogoutClick = () => {
    logout();
    router.push('/login');
  };

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col border-r border-border/60 bg-card/95 backdrop-blur-xl transition-transform dark:bg-card/80">
      {/* Brand Header */}
      <div className="flex h-16 items-center justify-between px-6 border-b border-border/40">
        <Link href="/admin" className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-primary to-purple-600 shadow-md shadow-primary/20">
            <span className="text-xl font-black text-white">Y</span>
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold tracking-tight text-foreground flex items-center gap-1.5">
              Yaps <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold border ${
                role === 'admin'
                  ? 'bg-primary/10 text-primary border-primary/20'
                  : 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
              }`}>
                {role === 'admin' ? 'Admin' : 'Usuario'}
              </span>
            </span>
            <span className="text-[10px] text-muted-foreground font-medium">
              {role === 'admin' ? 'Gestión Global' : 'Portal Negocio'}
            </span>
          </div>
        </Link>
      </div>

      {/* Navigation Items */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-1.5">
        <div className="px-3 mb-2 flex items-center justify-between">
          <span className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
            {role === 'admin' ? 'Menú Administrador' : 'Menú de Usuario'}
          </span>
        </div>

        {filteredItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`group flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25 font-semibold'
                  : 'text-muted-foreground hover:bg-accent/60 hover:text-foreground'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`h-4 w-4 transition-transform duration-200 group-hover:scale-110 ${isActive ? 'text-primary-foreground' : 'text-muted-foreground group-hover:text-primary'}`} />
                <span>{item.label}</span>
              </div>
              
              <div className="flex items-center gap-1">
                {item.badge && (
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                    isActive ? 'bg-white/20 text-white' : 'bg-primary/10 text-primary'
                  }`}>
                    {item.badge}
                  </span>
                )}
                {!isActive && (
                  <ChevronRight className="h-3.5 w-3.5 opacity-0 transition-opacity group-hover:opacity-100 text-muted-foreground" />
                )}
              </div>
            </Link>
          );
        })}
      </div>

      {/* Public Site Link Card */}
      <div className="p-4 mx-4 mb-3 rounded-2xl bg-gradient-to-br from-primary/10 via-purple-500/5 to-transparent border border-primary/20">
        <div className="flex items-center gap-2 text-xs font-semibold text-primary mb-1">
          <Sparkles className="h-3.5 w-3.5" /> Sitio Público & Anuncios
        </div>
        <p className="text-[11px] text-muted-foreground mb-3 leading-relaxed">
          Ver sitio web con ofertas y banners de Google Ads.
        </p>
        <Link href="/" target="_blank">
          <Button variant="outline" size="sm" className="w-full h-8 text-xs justify-center gap-1.5 border-primary/30 hover:bg-primary/10 hover:text-primary">
            Ver Sitio Público <ExternalLink className="h-3 w-3" />
          </Button>
        </Link>
      </div>

      {/* User Profile Footer */}
      <div className="border-t border-border/40 p-4 bg-muted/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <Avatar className="h-9 w-9 border border-primary/30 shadow-sm shrink-0">
              <AvatarFallback className="bg-primary text-primary-foreground font-bold text-xs">
                {role === 'admin' ? 'AD' : 'US'}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col truncate">
              <span className="text-xs font-semibold text-foreground truncate flex items-center gap-1">
                {user?.name || (role === 'admin' ? 'Admin Yaps' : 'Usuario Yaps')}
                {role === 'admin' ? (
                  <ShieldCheck className="h-3.5 w-3.5 text-primary shrink-0 inline" />
                ) : (
                  <User className="h-3.5 w-3.5 text-emerald-500 shrink-0 inline" />
                )}
              </span>
              <span className="text-[10px] text-muted-foreground truncate">{user?.email || 'admin@yaps.bo'}</span>
            </div>
          </div>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={handleLogoutClick}
            className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg shrink-0"
            title="Cerrar sesión"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </aside>
  );
}
