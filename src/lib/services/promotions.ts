import { createClient } from '@/lib/supabase/client';
import { Promotion, Business, Category, UserAccount, GoogleAdsConfig, UserRole } from '@/types/admin';

// Datos iniciales de demostración para visualización inmediata en el admin panel
const INITIAL_PROMOTIONS: Promotion[] = [
  {
    id: 'p-1',
    title: '50% OFF en Burger Combos Gourmet',
    description: 'Disfruta de cualquier combo con hamburguesa doble carne de res, papas fritas crocantes y bebida grande a mitad de precio.',
    discount_percentage: 50,
    original_price: 60,
    offer_price: 30,
    image_url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80',
    status: 'published',
    business_id: 'b1',
    business_name: 'Burger Craft House',
    category_id: 'c1',
    category_name: 'Gastronomía',
    city_name: 'La Paz',
    start_date: '2026-09-01',
    end_date: '2026-10-15',
    coupon_code: 'BURGER50',
    views_count: 1420,
    created_at: new Date().toISOString(),
  },
  {
    id: 'p-2',
    title: '30% OFF en Audífonos Bluetooth Noise Cancelling',
    description: 'Audífonos inalámbricos de alta fidelidad con cancelación de ruido activa y batería de 30 horas.',
    discount_percentage: 30,
    original_price: 450,
    offer_price: 315,
    image_url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
    status: 'published',
    business_id: 'b2',
    business_name: 'TechStore Bolivia',
    category_id: 'c2',
    category_name: 'Tecnología',
    city_name: 'Santa Cruz',
    start_date: '2026-09-15',
    end_date: '2026-10-30',
    coupon_code: 'TECHNOISE30',
    views_count: 980,
    created_at: new Date().toISOString(),
  },
  {
    id: 'p-3',
    title: '2x1 en Pistas de Bowling los Jueves',
    description: 'Ven con tus amigos y paga 1 hora de bowling para recibir la segunda hora totalmente gratis.',
    discount_percentage: 50,
    original_price: 100,
    offer_price: 50,
    image_url: 'https://images.unsplash.com/photo-1538510114876-435785b30831?w=800&q=80',
    status: 'pending',
    business_id: 'b3',
    business_name: 'Mega Bowling Center',
    category_id: 'c3',
    category_name: 'Entretenimiento',
    city_name: 'Cochabamba',
    start_date: '2026-10-01',
    end_date: '2026-11-01',
    coupon_code: 'BOWLING2X1',
    views_count: 310,
    created_at: new Date().toISOString(),
  }
];

const INITIAL_BUSINESSES: Business[] = [
  { id: 'b1', name: 'Burger Craft House', slug: 'burger-craft', description: 'Las mejores hamburguesas artesanales de Bolivia.', address: 'Av. 6 de Agosto #2435, Sopocachi', phone: '76543210', city_name: 'La Paz', is_verified: true },
  { id: 'b2', name: 'TechStore Bolivia', slug: 'techstore-bo', description: 'Gadgets, laptops y accesorios tecnológicos importados.', address: 'Equipetrol Calle 7 Este', phone: '71234567', city_name: 'Santa Cruz', is_verified: true },
  { id: 'b3', name: 'Mega Bowling Center', slug: 'mega-bowling', description: 'Centro de entretenimiento y deportes con pistas de bowling profesionales.', address: 'Av. América #120', phone: '70011223', city_name: 'Cochabamba', is_verified: false },
];

const INITIAL_CATEGORIES: Category[] = [
  { id: 'c1', name: 'Gastronomía', slug: 'gastronomia', icon: 'Utensils', description: 'Restaurantes, hamburgueserías, cafeterías y comida rápida.' },
  { id: 'c2', name: 'Tecnología', slug: 'tecnologia', icon: 'Smartphone', description: 'Celulares, laptops, accesorios electrónicos y gadgets.' },
  { id: 'c3', name: 'Entretenimiento', slug: 'entretenimiento', icon: 'Film', description: 'Cines, bowling, parques y actividades recreativas.' },
  { id: 'c4', name: 'Moda y Calzado', slug: 'moda', icon: 'ShoppingBag', description: 'Ropa de temporada, calzado y accesorios de vestir.' },
  { id: 'c5', name: 'Salud y Belleza', slug: 'salud-belleza', icon: 'Heart', description: 'Spas, peluquerías, gimnasios y centros médicos.' },
];

const INITIAL_USERS: UserAccount[] = [
  { id: 'u1', name: 'Administrador Principal', email: 'admin@yaps.bo', role: 'admin', status: 'active', created_at: new Date().toISOString() },
  { id: 'u2', name: 'Gerente Burger Craft', email: 'contacto@burgercraft.bo', role: 'user', business_id: 'b1', business_name: 'Burger Craft House', status: 'active', created_at: new Date().toISOString() },
  { id: 'u3', name: 'Ventas TechStore', email: 'ventas@techstore.bo', role: 'user', business_id: 'b2', business_name: 'TechStore Bolivia', status: 'active', created_at: new Date().toISOString() },
];

const INITIAL_ADS_CONFIG: GoogleAdsConfig = {
  enabled: true,
  client_id: 'ca-pub-9876543210987654',
  hero_slot: '1234567890',
  sidebar_slot: '2345678901',
  infeed_slot: '3456789012',
  footer_slot: '4567890123',
  auto_ads: true,
  estimated_revenue: 1450.80,
  impressions: 48290,
  clicks: 1840,
};

// Helper for LocalStorage cache
function getStorageData<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
}

function setStorageData<T>(key: string, data: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error('Error saving to storage', e);
  }
}

// PROMOTIONS
export async function getPromotions(): Promise<Promotion[]> {
  return getStorageData<Promotion[]>('yaps_promotions', INITIAL_PROMOTIONS);
}

export async function createPromotion(promo: Omit<Promotion, 'id' | 'created_at'>): Promise<Promotion> {
  const list = await getPromotions();
  const newPromo: Promotion = {
    ...promo,
    id: `p-${Date.now()}`,
    created_at: new Date().toISOString(),
    views_count: 0
  };
  const updated = [newPromo, ...list];
  setStorageData('yaps_promotions', updated);
  return newPromo;
}

export async function updatePromotion(id: string, promo: Partial<Promotion>): Promise<Promotion> {
  const list = await getPromotions();
  let updatedItem: Promotion | null = null;
  const updated = list.map((p) => {
    if (p.id === id) {
      updatedItem = { ...p, ...promo };
      return updatedItem;
    }
    return p;
  });
  setStorageData('yaps_promotions', updated);
  return updatedItem || (promo as Promotion);
}

export async function deletePromotion(id: string): Promise<boolean> {
  const list = await getPromotions();
  const filtered = list.filter((p) => p.id !== id);
  setStorageData('yaps_promotions', filtered);
  return true;
}

// BUSINESSES
export async function getBusinesses(): Promise<Business[]> {
  return getStorageData<Business[]>('yaps_businesses', INITIAL_BUSINESSES);
}

export async function createBusiness(data: Omit<Business, 'id'>): Promise<Business> {
  const list = await getBusinesses();
  const newBiz: Business = {
    ...data,
    id: `b-${Date.now()}`,
    is_verified: data.is_verified ?? true,
  };
  const updated = [newBiz, ...list];
  setStorageData('yaps_businesses', updated);
  return newBiz;
}

export async function updateBusiness(id: string, data: Partial<Business>): Promise<Business> {
  const list = await getBusinesses();
  let updatedItem: Business | null = null;
  const updated = list.map((b) => {
    if (b.id === id) {
      updatedItem = { ...b, ...data };
      return updatedItem;
    }
    return b;
  });
  setStorageData('yaps_businesses', updated);
  return updatedItem || (data as Business);
}

export async function deleteBusiness(id: string): Promise<boolean> {
  const list = await getBusinesses();
  const filtered = list.filter((b) => b.id !== id);
  setStorageData('yaps_businesses', filtered);
  return true;
}

// CATEGORIES
export async function getCategories(): Promise<Category[]> {
  return getStorageData<Category[]>('yaps_categories', INITIAL_CATEGORIES);
}

export async function createCategory(data: Omit<Category, 'id'>): Promise<Category> {
  const list = await getCategories();
  const newCat: Category = {
    ...data,
    id: `c-${Date.now()}`,
  };
  const updated = [...list, newCat];
  setStorageData('yaps_categories', updated);
  return newCat;
}

export async function updateCategory(id: string, data: Partial<Category>): Promise<Category> {
  const list = await getCategories();
  let updatedItem: Category | null = null;
  const updated = list.map((c) => {
    if (c.id === id) {
      updatedItem = { ...c, ...data };
      return updatedItem;
    }
    return c;
  });
  setStorageData('yaps_categories', updated);
  return updatedItem || (data as Category);
}

export async function deleteCategory(id: string): Promise<boolean> {
  const list = await getCategories();
  const filtered = list.filter((c) => c.id !== id);
  setStorageData('yaps_categories', filtered);
  return true;
}

// USERS & ROLES
export async function getUsers(): Promise<UserAccount[]> {
  return getStorageData<UserAccount[]>('yaps_users', INITIAL_USERS);
}

export async function createUser(data: Omit<UserAccount, 'id' | 'created_at'>): Promise<UserAccount> {
  const list = await getUsers();
  const newUser: UserAccount = {
    ...data,
    id: `u-${Date.now()}`,
    created_at: new Date().toISOString(),
  };
  const updated = [newUser, ...list];
  setStorageData('yaps_users', updated);
  return newUser;
}

export async function updateUserRole(id: string, role: UserRole): Promise<UserAccount> {
  const list = await getUsers();
  let updatedItem: UserAccount | null = null;
  const updated = list.map((u) => {
    if (u.id === id) {
      updatedItem = { ...u, role };
      return updatedItem;
    }
    return u;
  });
  setStorageData('yaps_users', updated);
  return updatedItem!;
}

export async function deleteUser(id: string): Promise<boolean> {
  const list = await getUsers();
  const filtered = list.filter((u) => u.id !== id);
  setStorageData('yaps_users', filtered);
  return true;
}

// GOOGLE ADS MONETIZATION
export async function getAdsConfig(): Promise<GoogleAdsConfig> {
  return getStorageData<GoogleAdsConfig>('yaps_ads_config', INITIAL_ADS_CONFIG);
}

export async function updateAdsConfig(config: Partial<GoogleAdsConfig>): Promise<GoogleAdsConfig> {
  const current = await getAdsConfig();
  const updated = { ...current, ...config };
  setStorageData('yaps_ads_config', updated);
  return updated;
}
