'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserRole, UserAccount } from '@/types/admin';
import { getUsers } from '@/lib/services/promotions';
import { toast } from 'sonner';

interface AuthContextType {
  user: UserAccount | null;
  role: UserRole;
  isLoggedIn: boolean;
  isLoading: boolean;
  login: (email: string, password?: string, role?: UserRole) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserAccount | null>(null);
  const [role, setRole] = useState<UserRole>('user');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkInitialAuth();
  }, []);

  const checkInitialAuth = async () => {
    setIsLoading(true);
    if (typeof window !== 'undefined') {
      const storedLoggedIn = localStorage.getItem('admin_logged_in');
      const storedUserId = localStorage.getItem('yaps_user_id');

      if (storedLoggedIn === 'true' && storedUserId) {
        const usersList = await getUsers();
        const found = usersList.find((u) => u.id === storedUserId);

        if (found && found.status === 'active') {
          setUser(found);
          setRole(found.role);
        } else if (found && found.status === 'inactive') {
          toast.error('Tu cuenta ha sido dada de baja por el administrador.');
          logout();
        } else {
          // Fallback if not found
          logout();
        }
      } else {
        setUser(null);
      }
    }
    setIsLoading(false);
  };

  const login = async (email: string, password?: string, selectedRole?: UserRole): Promise<boolean> => {
    setIsLoading(true);
    try {
      const cleanEmail = email.trim().toLowerCase();
      const cleanPassword = (password || '').trim();

      const usersList = await getUsers();
      
      // Find matching user by email
      let matchedUser = usersList.find((u) => u.email.trim().toLowerCase() === cleanEmail);

      // If user not found in store, check root admin fallback
      if (!matchedUser && cleanEmail === 'admin@yaps.bo') {
        matchedUser = {
          id: 'u-admin-root',
          name: 'Administrador Principal',
          email: 'admin@yaps.bo',
          password: '123456',
          role: 'admin',
          status: 'active',
          created_at: new Date().toISOString(),
        };
      }

      if (!matchedUser) {
        toast.error('Correo no registrado. Revisa el email e inténtalo de nuevo.');
        setIsLoading(false);
        return false;
      }

      if (matchedUser.status === 'inactive') {
        toast.error('Esta cuenta se encuentra inactiva o dada de baja.');
        setIsLoading(false);
        return false;
      }

      // Password verification logic
      if (matchedUser.password && cleanPassword && matchedUser.password !== cleanPassword) {
        toast.error('Contraseña incorrecta. Revisa e ingresa nuevamente tu clave.');
        setIsLoading(false);
        return false;
      }

      setUser(matchedUser);
      setRole(matchedUser.role);
      localStorage.setItem('admin_logged_in', 'true');
      localStorage.setItem('yaps_user_id', matchedUser.id);
      localStorage.setItem('yaps_user_role', matchedUser.role);

      toast.success(`¡Bienvenido, ${matchedUser.name}! (${matchedUser.role === 'admin' ? 'Administrador' : 'Usuario Comercial'})`);
      setIsLoading(false);
      return true;
    } catch {
      toast.error('Error al iniciar sesión');
      setIsLoading(false);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('admin_logged_in');
    localStorage.removeItem('yaps_user_id');
    localStorage.removeItem('yaps_user_role');
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
