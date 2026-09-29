'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Sparkles, Lock, Mail, ArrowRight, ShieldCheck, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/lib/auth/auth-context';
import { UserRole } from '@/types/admin';
import { toast } from 'sonner';

export function UnifiedLoginPage() {
  const { login } = useAuth();
  const router = useRouter();

  const [activeRole, setActiveRole] = useState<UserRole>('admin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRoleChange = (role: UserRole) => {
    setActiveRole(role);
    setEmail('');
    setPassword('');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      toast.error('Ingresa tu correo electrónico y contraseña');
      return;
    }

    setLoading(true);
    const success = await login(email, password, activeRole);
    setLoading(false);

    if (success) {
      router.push('/admin');
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-slate-950 overflow-hidden font-sans p-4">
      {/* Background Lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] sm:w-[600px] sm:h-[600px] bg-gradient-to-tr from-primary/30 via-purple-600/20 to-pink-500/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[250px] h-[250px] bg-blue-500/10 rounded-full blur-[90px] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293712_1px,transparent_1px),linear-gradient(to_bottom,#1f293712_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

      {/* Main Glass Card */}
      <div className="relative z-10 w-full max-w-md p-6 sm:p-10 rounded-3xl bg-slate-900/90 border border-slate-800/80 shadow-2xl backdrop-blur-2xl">
        {/* Logo Header */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-primary via-purple-600 to-pink-500 shadow-xl shadow-primary/30 mb-3 ring-4 ring-primary/20">
            <span className="text-2xl sm:text-3xl font-black text-white">Y</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            Panel Único de Acceso <Sparkles className="h-5 w-5 text-primary" />
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-xs">
            Ingresa tus credenciales autorizadas para acceder al sistema
          </p>
        </div>

        {/* Role Selector Tabs */}
        <div className="grid grid-cols-2 gap-2 p-1.5 mb-6 rounded-2xl bg-slate-950/80 border border-slate-800">
          <button
            type="button"
            onClick={() => handleRoleChange('admin')}
            className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-semibold transition-all ${
              activeRole === 'admin'
                ? 'bg-gradient-to-r from-primary to-purple-600 text-white shadow-md shadow-primary/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ShieldCheck className="h-4 w-4" />
            <span>Administrador</span>
          </button>

          <button
            type="button"
            onClick={() => handleRoleChange('user')}
            className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-semibold transition-all ${
              activeRole === 'user'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Building2 className="h-4 w-4" />
            <span>Usuario / Negocio</span>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Mail className="h-3.5 w-3.5 text-primary" /> Correo Electrónico
            </Label>
            <Input
              id="email"
              type="email"
              placeholder={activeRole === 'admin' ? 'admin@yaps.bo' : 'contacto@burgercraft.bo'}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-11 rounded-xl bg-slate-950/70 border-slate-800 text-white placeholder:text-slate-500 focus-visible:ring-primary text-xs"
              required
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Lock className="h-3.5 w-3.5 text-primary" /> Contraseña
              </Label>
            </div>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-11 rounded-xl bg-slate-950/70 border-slate-800 text-white placeholder:text-slate-500 focus-visible:ring-primary text-xs"
              required
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className={`w-full h-11 rounded-xl font-semibold text-xs text-white shadow-lg mt-2 flex items-center justify-center gap-2 ${
              activeRole === 'admin'
                ? 'bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-700 shadow-primary/25'
                : 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 shadow-emerald-500/25'
            }`}
          >
            {loading ? 'Verificando credenciales...' : (
              <>
                <span>Iniciar Sesión como {activeRole === 'admin' ? 'Administrador' : 'Usuario'}</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </Button>
        </form>

        {/* Footer info */}
        <div className="mt-8 text-center border-t border-slate-800/60 pt-4">
          <Link href="/" className="text-xs text-slate-400 hover:text-white transition-colors flex items-center justify-center gap-1">
            Volver al portal público de promociones
          </Link>
        </div>
      </div>
    </div>
  );
}
