'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserRole, UserAccount } from '@/types/admin';
import { getUsers, createUser } from '@/lib/services/promotions';
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
          logout();
        }
      } else {
        setUser(null);
      }
    }
    setIsLoading(false);
  };

  const login = async (email: string, password?: string, selectedRole: UserRole = 'admin'): Promise<boolean> => {
    setIsLoading(true);
    try {
      const cleanEmail = email.trim().toLowerCase();
      const cleanPassword = (password || '').trim();

      const usersList = await getUsers();
      
      // Find matching user by email
      const matchedUser = usersList.find((u) => u.email.trim().toLowerCase() === cleanEmail);

      if (!matchedUser) {
        toast.error('Correo no registrado. La creación de nuevos administradores solo se permite desde el panel de control.');
        setIsLoading(false);
        return false;
      }

      // Validate account status
      if (matchedUser.status === 'inactive') {
        toast.error('Esta cuenta se encuentra inactiva o dada de baja por el Administrador.');
        setIsLoading(false);
        return false;
      }

      // Validate password
      if (matchedUser.password && cleanPassword !== matchedUser.password) {
        toast.error('Contraseña incorrecta. Revisa e ingresa nuevamente tu clave.');
        setIsLoading(false);
        return false;
      }

      toast.success(`¡Bienvenido, ${matchedUser.name}! (${matchedUser.role === 'admin' ? 'Administrador' : 'Usuario Comercial'})`);

      setUser(matchedUser);
      setRole(matchedUser.role);
      localStorage.setItem('admin_logged_in', 'true');
      localStorage.setItem('yaps_user_id', matchedUser.id);
      localStorage.setItem('yaps_user_role', matchedUser.role);

      setIsLoading(false);
      return true;
    } catch {
      toast.error('Error al verificar las credenciales');
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
