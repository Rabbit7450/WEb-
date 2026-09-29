'use client';

import { useState, useEffect } from 'react';
import { User, Mail, Lock, Camera, Save, ShieldCheck, KeyRound } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { AdminHeader } from '@/components/admin/admin-header';
import { useAuth } from '@/lib/auth/auth-context';
import { updateUser } from '@/lib/services/promotions';
import { toast } from 'sonner';

export default function AdminProfilePage() {
  const { user, role, login } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  
  // Password change state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setAvatarUrl(user.avatar_url || '');
    }
  }, [user]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!name.trim() || !email.trim()) {
      toast.error('El nombre y el correo electrónico no pueden estar vacíos');
      return;
    }

    setSavingProfile(true);
    try {
      const updated = await updateUser(user.id, {
        name,
        email,
        avatar_url: avatarUrl,
      });
      toast.success('¡Perfil actualizado con éxito!');
    } catch {
      toast.error('Error al actualizar el perfil');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (!newPassword || newPassword.length < 4) {
      toast.error('La nueva contraseña debe tener al menos 4 caracteres');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('Las contraseñas no coinciden');
      return;
    }

    setSavingPassword(true);
    try {
      await updateUser(user.id, {
        password: newPassword,
      });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      toast.success('¡Contraseña actualizada correctamente!');
    } catch {
      toast.error('Error al cambiar la contraseña');
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <div className="flex-1 space-y-6 pb-12">
      <AdminHeader
        title="Mi Perfil y Credenciales"
        subtitle="Modifica tus datos de usuario, contraseña de acceso y foto de perfil"
      />

      <div className="px-4 sm:px-6 space-y-6 max-w-4xl">
        {/* Profile Card */}
        <Card className="rounded-2xl border-border/60 bg-card shadow-sm overflow-hidden">
          <CardHeader className="p-6 border-b border-border/40 bg-muted/20">
            <CardTitle className="text-base font-bold text-foreground flex items-center gap-2">
              <User className="h-5 w-5 text-primary" /> Información Personal
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground mt-0.5">
              Actualiza tu nombre visible, avatar e identificador de cuenta
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleSaveProfile} className="p-6 space-y-6">
            {/* Avatar preview & input */}
            <div className="flex flex-col sm:flex-row items-center gap-6 pb-4 border-b border-border/40">
              <div className="relative group">
                <div className="h-20 w-20 rounded-2xl bg-gradient-to-tr from-primary to-purple-600 flex items-center justify-center text-white text-2xl font-bold overflow-hidden shadow-lg border-2 border-primary/20">
                  {avatarUrl ? (
                    <img src={avatarUrl} alt={name} className="h-full w-full object-cover" />
                  ) : (
                    <span>{name.charAt(0) || 'U'}</span>
                  )}
                </div>
              </div>

              <div className="flex-1 space-y-1.5 w-full">
                <Label htmlFor="usr-avatar" className="text-xs font-semibold flex items-center gap-1.5">
                  <Camera className="h-3.5 w-3.5 text-primary" /> URL Foto de Perfil / Avatar
                </Label>
                <Input
                  id="usr-avatar"
                  placeholder="https://images.unsplash.com/photo-..."
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  className="h-10 rounded-xl text-xs font-mono"
                />
                <p className="text-[11px] text-muted-foreground">
                  Ingresa un enlace directo a tu imagen o foto oficial
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="usr-prof-name" className="text-xs font-semibold">Nombre de Usuario *</Label>
                <Input
                  id="usr-prof-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-10 rounded-xl text-xs"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="usr-prof-email" className="text-xs font-semibold flex items-center gap-1">
                  <Mail className="h-3.5 w-3.5 text-primary" /> Correo Electrónico de Login *
                </Label>
                <Input
                  id="usr-prof-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-10 rounded-xl text-xs"
                  required
                />
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-border/40">
              <Button
                type="submit"
                disabled={savingProfile}
                className="rounded-xl h-10 text-xs bg-primary hover:bg-primary/90 text-white font-semibold px-6 flex items-center gap-1.5"
              >
                <Save className="h-4 w-4" />
                <span>{savingProfile ? 'Guardando...' : 'Guardar Perfil'}</span>
              </Button>
            </div>
          </form>
        </Card>

        {/* Change Password Card */}
        <Card className="rounded-2xl border-border/60 bg-card shadow-sm overflow-hidden">
          <CardHeader className="p-6 border-b border-border/40 bg-muted/20">
            <CardTitle className="text-base font-bold text-foreground flex items-center gap-2">
              <KeyRound className="h-5 w-5 text-primary" /> Cambiar Contraseña de Acceso
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground mt-0.5">
              Establece una nueva contraseña segura para iniciar sesión en tu cuenta
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleChangePassword} className="p-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="new-pass" className="text-xs font-semibold flex items-center gap-1">
                  <Lock className="h-3.5 w-3.5 text-primary" /> Nueva Contraseña *
                </Label>
                <Input
                  id="new-pass"
                  type="password"
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="h-10 rounded-xl text-xs"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="confirm-pass" className="text-xs font-semibold flex items-center gap-1">
                  <Lock className="h-3.5 w-3.5 text-primary" /> Confirmar Nueva Contraseña *
                </Label>
                <Input
                  id="confirm-pass"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="h-10 rounded-xl text-xs"
                  required
                />
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-border/40">
              <Button
                type="submit"
                disabled={savingPassword}
                className="rounded-xl h-10 text-xs bg-primary hover:bg-primary/90 text-white font-semibold px-6 flex items-center gap-1.5"
              >
                <KeyRound className="h-4 w-4" />
                <span>{savingPassword ? 'Cambiando...' : 'Cambiar Contraseña'}</span>
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
