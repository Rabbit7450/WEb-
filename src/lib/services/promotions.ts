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
  { id: 'u1', name: 'Administrador Principal', email: 'admin@yaps.bo', password: '123456', role: 'admin', status: 'active', created_at: new Date().toISOString() },
  { id: 'u2', name: 'Gerente Burger Craft', email: 'contacto@burgercraft.bo', password: '123456', role: 'user', business_id: 'b1', business_name: 'Burger Craft House', status: 'active', created_at: new Date().toISOString() },
  { id: 'u3', name: 'Ventas TechStore', email: 'ventas@techstore.bo', password: '123456', role: 'user', business_id: 'b2', business_name: 'TechStore Bolivia', status: 'active', created_at: new Date().toISOString() },
];

const INITIAL_ADS_CONFIG: GoogleAdsConfig = {
  enabled: true,
  client_id: 'ca-pub-6370743227565174',
  hero_slot: '1234567890',
  sidebar_slot: '2345678901',
  infeed_slot: '3456789012',
  footer_slot: '4567890123',
  auto_ads: true,
  estimated_revenue: 1450.80,
  impressions: 48290,
  clicks: 1840,
};

// LocalStorage Persistence Helper
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
    console.error('Error saving to local storage', e);
  }
}

// PROMOTIONS
export async function getPromotions(): Promise<Promotion[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('promotions')
      .select('*, businesses(name), categories(name)');

    if (!error && data && data.length > 0) {
      const formatted: Promotion[] = data.map((item: any) => ({
        id: String(item.id),
        title: item.title,
        description: item.description || '',
        discount_percentage: item.discount_percentage,
        original_price: item.original_price,
        offer_price: item.offer_price,
        image_url: item.image_url,
        status: item.status || 'published',
        business_id: String(item.business_id),
        business_name: item.businesses?.name || item.business_name || 'Negocio Afiliado',
        category_id: String(item.category_id),
        category_name: item.categories?.name || item.category_name || 'General',
        city_name: item.city_name || 'La Paz',
        start_date: item.start_date,
        end_date: item.end_date,
        coupon_code: item.coupon_code,
        views_count: item.views_count || 0,
        created_at: item.created_at || new Date().toISOString(),
      }));
      setStorageData('yaps_promotions', formatted);
      return formatted;
    }
  } catch (err) {
    console.log('Usando almacenamiento sincronizado de promociones:', err);
  }
  return getStorageData<Promotion[]>('yaps_promotions', INITIAL_PROMOTIONS);
}

export async function createPromotion(promo: Omit<Promotion, 'id' | 'created_at'>): Promise<Promotion> {
  const newPromo: Promotion = {
    ...promo,
    id: `p-${Date.now()}`,
    created_at: new Date().toISOString(),
    views_count: 0
  };

  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('promotions')
      .insert([{
        title: promo.title,
        description: promo.description,
        discount_percentage: promo.discount_percentage,
        original_price: promo.original_price,
        offer_price: promo.offer_price,
        image_url: promo.image_url,
        status: promo.status,
        business_id: promo.business_id,
        category_id: promo.category_id,
        start_date: promo.start_date,
        end_date: promo.end_date,
        coupon_code: promo.coupon_code
      }])
      .select()
      .single();

    if (!error && data) {
      newPromo.id = String(data.id);
    }
  } catch (err) {
    console.log('Almacenando promoción en base de datos local:', err);
  }

  const list = await getPromotions();
  const updated = [newPromo, ...list];
  setStorageData('yaps_promotions', updated);
  return newPromo;
}

export async function updatePromotion(id: string, promo: Partial<Promotion>): Promise<Promotion> {
  try {
    const supabase = createClient();
    await supabase.from('promotions').update(promo).eq('id', id);
  } catch (err) {
    console.log('Actualizando promoción en base de datos local:', err);
  }

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
  try {
    const supabase = createClient();
    await supabase.from('promotions').delete().eq('id', id);
  } catch (err) {
    console.log('Eliminando promoción de base de datos local:', err);
  }

  const list = await getPromotions();
  const filtered = list.filter((p) => p.id !== id);
  setStorageData('yaps_promotions', filtered);
  return true;
}

// BUSINESSES
export async function getBusinesses(): Promise<Business[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase.from('businesses').select('*');
    if (!error && data && data.length > 0) {
      setStorageData('yaps_businesses', data);
      return data;
    }
  } catch (err) {
    console.log('Usando almacenamiento de negocios:', err);
  }
  return getStorageData<Business[]>('yaps_businesses', INITIAL_BUSINESSES);
}

export async function createBusiness(data: Omit<Business, 'id'>): Promise<Business> {
  const newBiz: Business = {
    ...data,
    id: `b-${Date.now()}`,
    is_verified: data.is_verified ?? true,
  };

  try {
    const supabase = createClient();
    const { data: res, error } = await supabase.from('businesses').insert([data]).select().single();
    if (!error && res) {
      newBiz.id = String(res.id);
    }
  } catch (err) {
    console.log('Almacenando negocio localmente:', err);
  }

  const list = await getBusinesses();
  const updated = [newBiz, ...list];
  setStorageData('yaps_businesses', updated);
  return newBiz;
}

export async function updateBusiness(id: string, data: Partial<Business>): Promise<Business> {
  try {
    const supabase = createClient();
    await supabase.from('businesses').update(data).eq('id', id);
  } catch (err) {
    console.log('Actualizando negocio localmente:', err);
  }

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
  try {
    const supabase = createClient();
    await supabase.from('businesses').delete().eq('id', id);
  } catch (err) {
    console.log('Eliminando negocio localmente:', err);
  }

  const list = await getBusinesses();
  const filtered = list.filter((b) => b.id !== id);
  setStorageData('yaps_businesses', filtered);
  return true;
}

// CATEGORIES
export async function getCategories(): Promise<Category[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase.from('categories').select('*');
    if (!error && data && data.length > 0) {
      setStorageData('yaps_categories', data);
      return data;
    }
  } catch (err) {
    console.log('Usando almacenamiento de categorías:', err);
  }
  return getStorageData<Category[]>('yaps_categories', INITIAL_CATEGORIES);
}

export async function createCategory(data: Omit<Category, 'id'>): Promise<Category> {
  const newCat: Category = {
    ...data,
    id: `c-${Date.now()}`,
  };

  try {
    const supabase = createClient();
    const { data: res, error } = await supabase.from('categories').insert([data]).select().single();
    if (!error && res) {
      newCat.id = String(res.id);
    }
  } catch (err) {
    console.log('Guardando categoría localmente:', err);
  }

  const list = await getCategories();
  const updated = [...list, newCat];
  setStorageData('yaps_categories', updated);
  return newCat;
}

export async function updateCategory(id: string, data: Partial<Category>): Promise<Category> {
  try {
    const supabase = createClient();
    await supabase.from('categories').update(data).eq('id', id);
  } catch (err) {
    console.log('Actualizando categoría localmente:', err);
  }

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
  try {
    const supabase = createClient();
    await supabase.from('categories').delete().eq('id', id);
  } catch (err) {
    console.log('Eliminando categoría localmente:', err);
  }

  const list = await getCategories();
  const filtered = list.filter((c) => c.id !== id);
  setStorageData('yaps_categories', filtered);
  return true;
}

// USERS & ROLES Persistence
export async function getUsers(): Promise<UserAccount[]> {
  const localList = getStorageData<UserAccount[]>('yaps_users', INITIAL_USERS);
  try {
    const supabase = createClient();
    const { data, error } = await supabase.from('profiles').select('*');
    if (!error && data && data.length > 0) {
      const mergedMap = new Map<string, UserAccount>();
      localList.forEach((u) => mergedMap.set(u.email.toLowerCase(), u));

      data.forEach((item: any) => {
        const emailKey = (item.email || '').toLowerCase();
        if (emailKey) {
          const existing = mergedMap.get(emailKey);
          mergedMap.set(emailKey, {
            id: String(item.id || existing?.id || `u-${Date.now()}`),
            name: item.name || item.full_name || existing?.name || 'Usuario',
            email: item.email || existing?.email || '',
            password: item.password || existing?.password || '123456',
            avatar_url: item.avatar_url || existing?.avatar_url,
            role: item.role || existing?.role || 'user',
            business_id: item.business_id || existing?.business_id,
            business_name: item.business_name || existing?.business_name,
            status: item.status || existing?.status || 'active',
            created_at: item.created_at || existing?.created_at || new Date().toISOString(),
          });
        }
      });
      const combined = Array.from(mergedMap.values());
      setStorageData('yaps_users', combined);
      return combined;
    }
  } catch (err) {
    console.log('Usando almacenamiento sincronizado de usuarios:', err);
  }
  return localList;
}

export async function createUser(data: Omit<UserAccount, 'id' | 'created_at'>): Promise<UserAccount> {
  const localList = getStorageData<UserAccount[]>('yaps_users', INITIAL_USERS);
  const newUser: UserAccount = {
    ...data,
    id: `u-${Date.now()}`,
    password: data.password || '123456',
    status: data.status || 'active',
    created_at: new Date().toISOString(),
  };

  // 1. Instantly update LocalStorage so login works immediately!
  const filteredList = localList.filter((u) => u.email.toLowerCase() !== newUser.email.toLowerCase());
  const updatedList = [newUser, ...filteredList];
  setStorageData('yaps_users', updatedList);

  // 2. Safely attempt insert to Supabase DB profiles table
  try {
    const supabase = createClient();
    const payload: any = {
      email: data.email,
      role: data.role,
    };
    if (data.name) payload.name = data.name;
    if (data.status) payload.status = data.status;

    const { data: res, error } = await supabase.from('profiles').insert([payload]).select().single();
    if (!error && res) {
      newUser.id = String(res.id);
    }
  } catch {
    // Graceful fallback to local cache
  }

  return newUser;
}

export async function updateUser(id: string, data: Partial<UserAccount>): Promise<UserAccount> {
  try {
    const supabase = createClient();
    const updatePayload: any = {};
    if (data.name) updatePayload.name = data.name;
    if (data.email) updatePayload.email = data.email;
    if (data.role) updatePayload.role = data.role;
    if (data.status) updatePayload.status = data.status;

    if (Object.keys(updatePayload).length > 0) {
      await supabase.from('profiles').update(updatePayload).eq('id', id);
    }
  } catch {
    // Graceful fallback
  }

  const list = await getUsers();
  let updatedItem: UserAccount | null = null;
  const updated = list.map((u) => {
    if (u.id === id) {
      updatedItem = { ...u, ...data };
      return updatedItem;
    }
    return u;
  });
  setStorageData('yaps_users', updated);
  return updatedItem || (data as UserAccount);
}

export async function updateUserRole(id: string, role: UserRole): Promise<UserAccount> {
  return updateUser(id, { role });
}

export async function deleteUser(id: string): Promise<boolean> {
  try {
    const supabase = createClient();
    await supabase.from('profiles').delete().eq('id', id);
  } catch (err) {
    console.log('Eliminando usuario localmente:', err);
  }

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
