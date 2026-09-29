'use client';

import { usePathname } from 'next/navigation';
import { AdminSidebar } from '@/components/admin/admin-sidebar';
import { Toaster } from 'sonner';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/admin/login';

  if (isLoginPage) {
    return (
      <main className="min-h-screen bg-slate-950">
        {children}
        <Toaster position="top-right" richColors />
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content Area */}
      <main className="flex-1 ml-64 min-h-screen flex flex-col bg-muted/20">
        {children}
      </main>

      <Toaster position="top-right" richColors />
    </div>
  );
}
