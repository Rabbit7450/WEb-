'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { KeyRound, Loader2, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';

export default function ResetPasswordPage() {
  const router = useRouter();
  const [checkingSession, setCheckingSession] = useState(true);
  const [hasSession, setHasSession] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [saving, setSaving] = useState(false);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const verifyRecoverySession = async () => {
      const { data: { user }, error } = await createClient().auth.getUser();
      if (!isMounted) return;
      setHasSession(Boolean(user && !error));
      setCheckingSession(false);
    };

    void verifyRecoverySession();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (password.length < 8) {
      toast.error('La contraseña debe tener al menos 8 caracteres.');
      return;
    }
    if (password !== confirmPassword) {
      toast.error('Las contraseñas no coinciden.');
      return;
    }

    setSaving(true);
    try {
      const { error } = await createClient().auth.updateUser({ password });
      if (error) throw error;
      await createClient().auth.signOut();
      setCompleted(true);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'No se pudo actualizar la contraseña.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-950 p-4 text-white">
      <section className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl sm:p-8">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-400 text-slate-950">
            <KeyRound className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold">Restablecer contraseña</h1>
            <p className="text-xs text-slate-400">Yaps · Administración segura</p>
          </div>
        </div>

        {checkingSession ? (
          <div className="flex items-center gap-2 py-6 text-sm text-slate-300">
            <Loader2 className="h-4 w-4 animate-spin" /> Validando enlace...
          </div>
        ) : completed ? (
          <div className="space-y-4">
            <p className="flex items-center gap-2 text-sm text-emerald-300">
              <ShieldCheck className="h-4 w-4" /> Contraseña actualizada correctamente.
            </p>
            <Button type="button" className="w-full" onClick={() => router.push('/login')}>
              Ir al inicio de sesión
            </Button>
          </div>
        ) : !hasSession ? (
          <div className="space-y-4">
            <p className="text-sm leading-relaxed text-slate-300">
              El enlace no es válido o ya venció. Solicita uno nuevo desde la tabla de usuarios.
            </p>
            <Button type="button" variant="outline" className="w-full text-slate-900" onClick={() => router.push('/login')}>
              Volver al inicio de sesión
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <p className="text-sm text-slate-300">Elige una contraseña nueva para tu cuenta.</p>
            <div className="space-y-1.5">
              <Label htmlFor="new-password" className="text-xs text-slate-300">Nueva contraseña</Label>
              <Input
                id="new-password"
                type="password"
                autoComplete="new-password"
                minLength={8}
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="border-slate-700 bg-slate-950 text-white"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="confirm-password" className="text-xs text-slate-300">Confirmar contraseña</Label>
              <Input
                id="confirm-password"
                type="password"
                autoComplete="new-password"
                minLength={8}
                required
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                className="border-slate-700 bg-slate-950 text-white"
              />
            </div>
            <Button type="submit" disabled={saving} className="w-full">
              {saving ? 'Guardando...' : 'Guardar contraseña nueva'}
            </Button>
          </form>
        )}
      </section>
    </main>
  );
}
