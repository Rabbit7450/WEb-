'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserRole, UserAccount } from '@/types/admin';
import { createClient } from '@/lib/supabase/client';
import { SupabaseClient, User as SupabaseUser } from '@supabase/supabase-js';
import { toast } from 'sonner';

interface AuthContextType {
  user: UserAccount | null;
  role: UserRole;
  isLoggedIn: boolean;
  isLoading: boolean;
  login: (email: string, password?: string, role?: UserRole) => Promise<boolean>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

async function resolveAccount(supabase: SupabaseClient, authUser: SupabaseUser) {
  const [{ data: profile, error: profileError }, { data: adminMembership, error: adminError }] =
    await Promise.all([
      supabase
        .from('profiles')
        .select('full_name, avatar_url, status')
        .eq('id', authUser.id)
        .maybeSingle(),
      supabase
        .from('admin_users')
        .select('user_id')
        .eq('user_id', authUser.id)
        .maybeSingle(),
    ]);

  if (adminError) {
    throw new Error('No se pudieron validar los permisos. Aplica la migración de administradores en Supabase.');
  }
  if (profileError) throw new Error(profileError.message);
  if (!profile) throw new Error('Tu usuario no tiene un perfil activo en Supabase.');
  if (profile.status === 'inactive') throw new Error('Esta cuenta está inactiva. Contacta a un administrador.');

  const role: UserRole = adminMembership ? 'admin' : 'user';

  return {
    role,
    account: {
      id: authUser.id,
      name: profile.full_name || authUser.email || 'Usuario',
      email: authUser.email || '',
      avatar_url: profile.avatar_url || undefined,
      role,
      status: profile.status === 'inactive' ? 'inactive' as const : 'active' as const,
      created_at: authUser.created_at,
    } satisfies UserAccount,
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserAccount | null>(null);
  const [role, setRole] = useState<UserRole>('user');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const restoreSession = async () => {
      const supabase = createClient();
      try {
        const { data: { user: authUser }, error } = await supabase.auth.getUser();
        if (error) throw error;
        if (!authUser) {
          if (isMounted) {
            setUser(null);
            setRole('user');
          }
          return;
        }

        const resolved = await resolveAccount(supabase, authUser);
        if (isMounted) {
          setUser(resolved.account);
          setRole(resolved.role);
        }
      } catch {
        await supabase.auth.signOut();
        if (isMounted) {
          setUser(null);
          setRole('user');
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    void restoreSession();
    return () => {
      isMounted = false;
    };
  }, []);

  const login = async (email: string, password?: string, selectedRole: UserRole = 'admin'): Promise<boolean> => {
    setIsLoading(true);
    const supabase = createClient();
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password: password || '',
      });
      if (error || !data.user) {
        toast.error('Correo o contraseña incorrectos. Verifica que la cuenta exista en Supabase Auth.');
        return false;
      }

      const resolved = await resolveAccount(supabase, data.user);
      if (selectedRole === 'admin' && resolved.role !== 'admin') {
        await supabase.auth.signOut();
        toast.error('Esta cuenta no está autorizada como administradora en Supabase.');
        return false;
      }

      setUser(resolved.account);
      setRole(resolved.role);
      toast.success(`¡Bienvenido, ${resolved.account.name}! (${resolved.role === 'admin' ? 'Administrador' : 'Usuario Comercial'})`);
      return true;
    } catch (error) {
      await supabase.auth.signOut();
      toast.error(error instanceof Error ? error.message : 'Error al verificar las credenciales');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await createClient().auth.signOut();
    } finally {
      setUser(null);
      setRole('user');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        isLoggedIn: !!user,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
