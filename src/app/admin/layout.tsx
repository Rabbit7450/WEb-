'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { AdminSidebar } from '@/components/admin/admin-sidebar';
import { AdminNavigationContext } from '@/components/admin/admin-navigation-context';
import { useAuth } from '@/lib/auth/auth-context';
import { Toaster } from 'sonner';
import { Loader2 } from 'lucide-react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { isLoggedIn, isLoading } = useAuth();
  
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const isLoginPage = pathname === '/admin/login' || pathname === '/login';

  useEffect(() => {
    if (!isLoading && !isLoggedIn && !isLoginPage) {
      router.push('/login');
    }
  }, [isLoading, isLoggedIn, isLoginPage, router]);

  if (isLoginPage) {
    return (
      <main className="min-h-screen bg-slate-950">
        {children}
        <Toaster position="top-right" richColors />
      </main>
    );
  }

  if (isLoading || (!isLoggedIn && !isLoginPage)) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-slate-950 text-white">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-xs text-slate-400 font-medium">Verificando sesión autorizada...</p>
        </div>
      </div>
    );
  }

  return (
    <AdminNavigationContext.Provider value={() => setIsMobileOpen(true)}>
      <div className="min-h-screen bg-background text-foreground flex relative overflow-x-hidden">
        <AdminSidebar
          isOpenMobile={isMobileOpen}
          onCloseMobile={() => setIsMobileOpen(false)}
        />

        <main className="w-full min-w-0 md:ml-64 min-h-screen flex flex-col bg-muted/20 overflow-x-hidden">
          {children}
        </main>

        <Toaster position="top-right" richColors />
      </div>
    </AdminNavigationContext.Provider>
  );
}
