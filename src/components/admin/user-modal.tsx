'use client';

import { useState, useEffect } from 'react';
import { X, User, ShieldCheck, Mail, Building2, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UserAccount, UserRole, Business } from '@/types/admin';
import { toast } from 'sonner';

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<UserAccount>) => Promise<void>;
  userAccount?: UserAccount | null;
  businesses?: Business[];
}

export function UserModal({ isOpen, onClose, onSave, userAccount, businesses = [] }: UserModalProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('user');
  const [businessId, setBusinessId] = useState('');
  const [status, setStatus] = useState<'active' | 'inactive'>('active');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (userAccount) {
      setName(userAccount.name || '');
      setEmail(userAccount.email || '');
      setPassword(userAccount.password || '');
      setRole(userAccount.role || 'user');
      setBusinessId(userAccount.business_id || '');
      setStatus(userAccount.status || 'active');
    } else {
      setName('');
      setEmail('');
      setPassword('');
      setRole('user');
      setBusinessId(businesses[0]?.id || '');
      setStatus('active');
    }
  }, [userAccount, isOpen, businesses]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      toast.error('El nombre y el correo son obligatorios');
      return;
    }

    if (!userAccount && !password.trim()) {
      toast.error('Debes asignar una contraseña para la nueva cuenta');
      return;
    }

    setLoading(true);
    try {
      const selectedBiz = businesses.find((b) => b.id === businessId);
      await onSave({
        name,
        email,
        password: password.trim() || '123456',
        role,
        business_id: role === 'user' ? businessId : undefined,
        business_name: role === 'user' ? selectedBiz?.name : undefined,
        status,
      });
      toast.success(userAccount ? '¡Usuario actualizado!' : '¡Usuario creado exitosamente con sus credenciales!');
      onClose();
    } catch {
      toast.error('Ocurrió un error al guardar el usuario');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl bg-card border border-border/60 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border/40 bg-muted/30 px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <User className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-bold text-base text-foreground">
                {userAccount ? 'Editar Usuario y Credenciales' : 'Crear Nuevo Usuario y Credenciales'}
              </h2>
              <p className="text-xs text-muted-foreground">
                Define el nombre, correo, clave y rol de acceso
              </p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full h-8 w-8">
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="usr-name" className="text-xs font-semibold">Nombre Completo *</Label>
            <Input
              id="usr-name"
              placeholder="Ej. Carlos Rodríguez"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-10 rounded-xl text-xs"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="usr-email" className="text-xs font-semibold flex items-center gap-1">
                <Mail className="h-3.5 w-3.5 text-primary" /> Correo Electrónico *
              </Label>
              <Input
                id="usr-email"
                type="email"
                placeholder="usuario@yaps.bo"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-10 rounded-xl text-xs"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="usr-pass" className="text-xs font-semibold flex items-center gap-1">
                <Lock className="h-3.5 w-3.5 text-primary" /> Contraseña *
              </Label>
              <Input
                id="usr-pass"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-10 rounded-xl text-xs"
                required={!userAccount}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="usr-role" className="text-xs font-semibold flex items-center gap-1">
                <ShieldCheck className="h-3.5 w-3.5 text-primary" /> Rol del Sistema
              </Label>
              <select
                id="usr-role"
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
                className="w-full h-10 rounded-xl border border-input bg-background px-3 text-xs font-semibold focus:ring-2 focus:ring-primary outline-none"
              >
                <option value="admin">Administrador</option>
                <option value="user">Usuario / Negocio</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="usr-status" className="text-xs font-semibold">Estado</Label>
              <select
                id="usr-status"
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full h-10 rounded-xl border border-input bg-background px-3 text-xs focus:ring-2 focus:ring-primary outline-none"
              >
                <option value="active">Activo</option>
                <option value="inactive">Inactivo</option>
              </select>
            </div>
          </div>

          {role === 'user' && businesses.length > 0 && (
            <div className="space-y-1.5 animate-in fade-in">
              <Label htmlFor="usr-biz" className="text-xs font-semibold flex items-center gap-1">
                <Building2 className="h-3.5 w-3.5 text-primary" /> Negocio Vinculado
              </Label>
              <select
                id="usr-biz"
                value={businessId}
                onChange={(e) => setBusinessId(e.target.value)}
                className="w-full h-10 rounded-xl border border-input bg-background px-3 text-xs focus:ring-2 focus:ring-primary outline-none"
              >
                <option value="">Sin negocio específico</option>
                {businesses.map((b) => (
                  <option key={b.id} value={b.id}>{b.name}</option>
                ))}
              </select>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-4 border-t border-border/40">
            <Button type="button" variant="outline" onClick={onClose} className="rounded-xl h-10 text-xs">
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="rounded-xl h-10 text-xs bg-primary hover:bg-primary/90 text-white font-semibold px-6"
            >
              {loading ? 'Guardando...' : (userAccount ? 'Actualizar Usuario' : 'Crear Usuario')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
