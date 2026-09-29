'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserRole, UserAccount } from '@/types/admin';
import { toast } from 'sonner';

interface AuthContextType {
  user: UserAccount | null;
  role: UserRole;
  isLoggedIn: boolean;
  login: (email: string, role: UserRole, name?: string) => void;
  logout: () => void;
  switchRole: (role: UserRole) => void;
}

const DEFAULT_ADMIN: UserAccount = {
  id: 'admin-1',
  name: 'Administrador Yaps',
  email: 'admin@yaps.bo',
  role: 'admin',
  status: 'active',
  created_at: new Date().toISOString(),
};

const DEFAULT_USER: UserAccount = {
  id: 'user-1',
  name: 'Negocio Burger Craft',
  email: 'comercio@yaps.bo',
  role: 'user',
  business_id: 'b1',
  business_name: 'Burger Craft House',
  status: 'active',
  created_at: new Date().toISOString(),
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserAccount | null>(null);
  const [role, setRole] = useState<UserRole>('admin');

  useEffect(() => {
    // Read stored role or login status
    if (typeof window !== 'undefined') {
      const storedRole = localStorage.getItem('yaps_user_role') as UserRole;
      const storedLoggedIn = localStorage.getItem('admin_logged_in');

      if (storedLoggedIn === 'true' || storedRole) {
        const activeRole = storedRole || 'admin';
        setRole(activeRole);
        setUser(activeRole === 'admin' ? DEFAULT_ADMIN : DEFAULT_USER);
      } else {
        // Default to admin for initial visit demo
        setRole('admin');
        setUser(DEFAULT_ADMIN);
      }
    }
  }, []);

  const login = (email: string, selectedRole: UserRole, name?: string) => {
    const newUser: UserAccount = {
      id: `u-${Date.now()}`,
      name: name || (selectedRole === 'admin' ? 'Administrador Yaps' : 'Usuario Comercial'),
      email: email || (selectedRole === 'admin' ? 'admin@yaps.bo' : 'usuario@yaps.bo'),
      role: selectedRole,
      status: 'active',
      created_at: new Date().toISOString(),
    };

    setUser(newUser);
    setRole(selectedRole);
    localStorage.setItem('admin_logged_in', 'true');
    localStorage.setItem('yaps_user_role', selectedRole);
    toast.success(`Sesión iniciada como ${selectedRole === 'admin' ? 'Administrador' : 'Usuario / Negocio'}`);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('admin_logged_in');
    localStorage.removeItem('yaps_user_role');
    toast.success('Sesión cerrada correctamente');
  };

  const switchRole = (newRole: UserRole) => {
    setRole(newRole);
    const updatedUser = newRole === 'admin' ? DEFAULT_ADMIN : DEFAULT_USER;
    setUser(updatedUser);
    localStorage.setItem('yaps_user_role', newRole);
    toast.info(`Rol cambiado a: ${newRole === 'admin' ? 'Administrador' : 'Usuario / Negocio'}`);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        isLoggedIn: !!user,
        login,
        logout,
        switchRole,
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
