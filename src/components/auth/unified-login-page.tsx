'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Sparkles, Lock, Mail, ArrowRight, ShieldCheck, UserCheck, CheckCircle2, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/lib/auth/auth-context';
import { UserRole } from '@/types/admin';

export function UnifiedLoginPage() {
  const { login } = useAuth();
  const router = useRouter();

  const [activeRole, setActiveRole] = useState<UserRole>('admin');
  const [email, setEmail] = useState('admin@yaps.bo');
  const [password, setPassword] = useState('123456');
  const [loading, setLoading] = useState(false);

  const handleRoleChange = (role: UserRole) => {
    setActiveRole(role);
    setEmail(role === 'admin' ? 'admin@yaps.bo' : 'comercio@yaps.bo');
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      login(email, activeRole);
      setLoading(false);
      router.push('/admin');
    }, 400);
  };

  const handleQuickDemo = (role: UserRole) => {
    setLoading(true);
    setTimeout(() => {
      login(role === 'admin' ? 'admin@yaps.bo' : 'comercio@yaps.bo', role);
      setLoading(false);
      router.push('/admin');
    }, 300);
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-slate-950 overflow-hidden font-sans">
      {/* Background Lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-primary/30 via-purple-600/20 to-pink-500/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[300px] h-[300px] bg-blue-500/10 rounded-full blur-[90px] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293712_1px,transparent_1px),linear-gradient(to_bottom,#1f293712_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

      {/* Main Glass Card */}
      <div className="relative z-10 w-full max-w-md p-8 sm:p-10 mx-4 rounded-3xl bg-slate-900/85 border border-slate-800/80 shadow-2xl backdrop-blur-2xl">
        {/* Logo */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-primary via-purple-600 to-pink-500 shadow-xl shadow-primary/30 mb-3 ring-4 ring-primary/20">
            <span className="text-3xl font-black text-white">Y</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            Panel Único de Acceso <Sparkles className="h-5 w-5 text-primary animate-bounce" />
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-xs">
            Inicia sesión según tu rol asignado (Administrador o Usuario)
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
              placeholder={activeRole === 'admin' ? 'admin@yaps.bo' : 'comercio@yaps.bo'}
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
              <a href="#" className="text-[11px] text-primary hover:underline font-medium">
                ¿Olvidaste tu clave?
              </a>
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
            {loading ? 'Ingresando...' : (
              <>
                <span>Ingresar como {activeRole === 'admin' ? 'Administrador' : 'Usuario'}</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </Button>
        </form>

        {/* Quick Demo Access Options */}
        <div className="relative my-6 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-800" />
          </div>
          <span className="relative z-10 bg-slate-900 px-3 text-[11px] text-slate-500 uppercase font-semibold">
            Acceso Rápido Demo
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => handleQuickDemo('admin')}
            disabled={loading}
            className="h-10 rounded-xl border-slate-800 bg-slate-950/50 hover:bg-slate-800/80 text-slate-300 font-medium text-[11px] flex items-center justify-center gap-1.5"
          >
            <ShieldCheck className="h-3.5 w-3.5 text-primary" />
            <span>Demo Admin</span>
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={() => handleQuickDemo('user')}
            disabled={loading}
            className="h-10 rounded-xl border-slate-800 bg-slate-950/50 hover:bg-slate-800/80 text-slate-300 font-medium text-[11px] flex items-center justify-center gap-1.5"
          >
            <UserCheck className="h-3.5 w-3.5 text-emerald-400" />
            <span>Demo Usuario</span>
          </Button>
        </div>

        {/* Footer info */}
        <div className="mt-6 text-center border-t border-slate-800/60 pt-4">
          <Link href="/" className="text-xs text-slate-400 hover:text-white transition-colors flex items-center justify-center gap-1">
            Volver al portal público de promociones
          </Link>
        </div>
      </div>
    </div>
  );
}
