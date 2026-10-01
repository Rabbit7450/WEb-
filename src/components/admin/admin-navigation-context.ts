'use client';

import { createContext, useContext } from 'react';

export const AdminNavigationContext = createContext<(() => void) | null>(null);

export function useOpenAdminNavigation() {
  return useContext(AdminNavigationContext);
}
