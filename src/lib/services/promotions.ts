import { createClient } from '@/lib/supabase/client';
import { Promotion, Business, Category, UserAccount, GoogleAdsConfig, UserRole } from '@/types/admin';

// Datos iniciales de demostración para visualización inmediata en el admin panel
// Datos iniciales oficiales sincronizados con la carpeta src/img/Promo
const INITIAL_PROMOTIONS: Promotion[] = [
  {
    id: 'p-promo-1',
    title: 'Arroz Caisy Grano de Oro 1 kg',
    description: '¡El sabor y la calidad que tu familia merece! Celebra con nosotros y aprovecha Arroz Caisy Grano de Oro de 1 kg a solo 18.50 Bs. Ideal para preparar tus mejores comidas. Visítanos en Centro (Mall Gran Vía), Achumani, UPEA El Alto, Faro Murillo y Obelisco. Atención de 08:00 a 22:00. Promoción válida hasta agotar existencias.',
    discount_percentage: 16,
    original_price: 22,
    offer_price: 18.5,
    image_url: '/img/Promo/Arroz-MakroAbasto.jpeg',
    status: 'published',
    business_id: 'b-makro',
    business_name: 'Makro Abasto - Gran Vía',
    category_id: 'c-supermercado',
    category_name: 'Supermercado',
    city_name: 'La Paz / El Alto',
    start_date: '2026-09-25',
    end_date: '2026-10-31',
    coupon_code: 'GRAVY185',
    views_count: 540,
    created_at: new Date().toISOString(),
  },
  {
    id: 'p-promo-2',
    title: 'Arroz Especial Caisy 1 kg (Promoción Aniversario)',
    description: '¡Calidad y ahorro para tu hogar! Aprovecha nuestra promoción de aniversario y lleva Arroz Especial Caisy de 1 kg a solo 16.50 Bs. ¡Ven por el tuyo! Visítanos en Centro (Mall Gran Vía), Achumani, UPEA El Alto, Faro Murillo y Obelisco. Atención de 08:00 a 22:00. Promoción válida hasta agotar existencias.',
    discount_percentage: 18,
    original_price: 20,
    offer_price: 16.5,
    image_url: '/img/Promo/Fideo-MakroAbasto.jpeg',
    status: 'published',
    business_id: 'b-makro',
    business_name: 'Makro Abasto - Gran Vía',
    category_id: 'c-supermercado',
    category_name: 'Supermercado',
    city_name: 'La Paz / El Alto',
    start_date: '2026-09-25',
    end_date: '2026-10-31',
    coupon_code: 'ANIV165',
    views_count: 620,
    created_at: new Date().toISOString(),
  },
  {
    id: 'p-promo-3',
    title: 'Viernes de 2 Pipocas de Pollo',
    description: '¿Antojo de pollo? Acá no esperamos al finde. ¡Viernes de Pipocas de Pollo! 2 Pipocas de Pollo por 49 Bs. Dos platos cargados de pollo crocante, papitas y ese sabor que nunca olvidas.',
    discount_percentage: 30,
    original_price: 70,
    offer_price: 49,
    image_url: '/img/Promo/Pipocas-Polloscochabamba.jpeg',
    status: 'published',
    business_id: 'b-polloscocha',
    business_name: 'Pollos Cochabamba',
    category_id: 'c1',
    category_name: 'Gastronomía',
    city_name: 'Cochabamba',
    start_date: '2026-09-25',
    end_date: '2026-10-31',
    coupon_code: 'PIPOCAS49',
    views_count: 890,
    created_at: new Date().toISOString(),
  },
  {
    id: 'p-promo-4',
    title: 'Jueves de 2 Salchipapas por 20 Bs',
    description: 'Jueves de: "solo iba a comer algo tranqui". Y terminaste con 2 salchipapas por solo 20 Bs. Pero se entiende... ¡con esa promo cualquiera cae!',
    discount_percentage: 43,
    original_price: 35,
    offer_price: 20,
    image_url: '/img/Promo/Salchi-Polloscochabamba.jpeg',
    status: 'published',
    business_id: 'b-polloscocha',
    business_name: 'Pollos Cochabamba',
    category_id: 'c1',
    category_name: 'Gastronomía',
    city_name: 'Cochabamba',
    start_date: '2026-09-25',
    end_date: '2026-10-31',
    coupon_code: 'SALCHI20',
    views_count: 730,
    created_at: new Date().toISOString(),
  },
  {
    id: 'p-promo-5',
    title: 'Fiesta del Cine - Entradas a 20 Bs en 2D',
    description: '¡Este 5 y 6 de octubre vive la #FiestaDelCine en Multicine con entradas a 20 Bs en 2D para tooodas las películas! También tendremos precios superreducidos en nuestros formatos especiales. La preventa inicia este sábado 3 de octubre a las 10 AM en App Multicine, www.multicine.com.bo, kioscos de autoservicio y boleterías de todos nuestros complejos.',
    discount_percentage: 56,
    original_price: 45,
    offer_price: 20,
    image_url: '/img/Promo/Multicine.jpeg',
    status: 'published',
    business_id: 'b-multicine',
    business_name: 'Multicine Bolivia',
    category_id: 'c3',
    category_name: 'Entretenimiento',
    city_name: 'La Paz',
    start_date: '2026-10-03',
    end_date: '2026-10-06',
    coupon_code: 'FIESTACINE20',
    views_count: 1250,
    created_at: new Date().toISOString(),
  },
];

const INITIAL_BUSINESSES: Business[] = [
  { id: 'b-makro', name: 'Makro Abasto - Gran Vía', slug: 'makro-abasto', description: 'Supermercado con los mejores precios en abarrotes y productos del hogar en La Paz y El Alto.', address: 'Av. Manco Kapac N.° 494, Mall Gran Vía', phone: '76543210', city_name: 'La Paz / El Alto', is_verified: true },
  { id: 'b-polloscocha', name: 'Pollos Cochabamba', slug: 'pollos-cochabamba', description: 'El sabor tradicional de pollos, pipocas crocantes y salchipapas irresistibles.', address: 'Av. Heroínas #450', phone: '71234567', city_name: 'Cochabamba', is_verified: true },
  { id: 'b-multicine', name: 'Multicine Bolivia', slug: 'multicine-bolivia', description: 'El complejo de cine líder en Bolivia con la mejor tecnología.', address: 'Av. Arce #2631, Sopocachi', phone: '70011223', city_name: 'La Paz', is_verified: true },
];

const INITIAL_CATEGORIES: Category[] = [
  { id: 'c-supermercado', name: 'Supermercado', slug: 'supermercado', icon: 'ShoppingBag', description: 'Abarrotes, alimentos y productos para el hogar.' },
  { id: 'c1', name: 'Gastronomía', slug: 'gastronomia', icon: 'Utensils', description: 'Restaurantes, hamburgueserías, cafeterías y comida rápida.' },
  { id: 'c3', name: 'Entretenimiento', slug: 'entretenimiento', icon: 'Film', description: 'Cines, bowling, parques y actividades recreativas.' },
];

const INITIAL_USERS: UserAccount[] = [
  { id: 'u1', name: 'Administrador Principal', email: 'admin@yaps.bo', role: 'admin', status: 'active', created_at: new Date().toISOString() },
  { id: 'u2', name: 'Adalit TIC Admin', email: 'adalit.tic@gmail.com', role: 'admin', status: 'active', created_at: new Date().toISOString() },
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
        discount_percentage: item.discount_percentage ?? item.discount_percent ?? 0,
        original_price: Number(item.original_price || 0),
        offer_price: Number(item.offer_price ?? item.promo_price ?? 0),
        image_url: item.image_url,
        status: item.status || 'published',
        business_id: String(item.business_id || ''),
        business_name: item.businesses?.name || item.business_name || 'Negocio Afiliado',
        category_id: String(item.category_id || ''),
        category_name: item.categories?.name || item.category_name || 'General',
        city_name: item.city_name || 'La Paz',
        start_date: item.start_date || item.starts_at || '2026-09-25',
        end_date: item.end_date || item.ends_at || '2026-10-31',
        coupon_code: item.coupon_code || 'PROMO2026',
        link_url: item.link_url || item.target_url || '',
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

  const hasDatabaseBusiness = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(promo.business_id);
  if (hasDatabaseBusiness) {
    const supabase = createClient();
    const dbPayload: any = {
      title: promo.title,
      description: promo.description,
      discount_percent: promo.discount_percentage,
      original_price: promo.original_price,
      promo_price: promo.offer_price,
      image_url: promo.image_url,
      link_url: promo.link_url,
      status: promo.status || 'published',
    };
    if (promo.business_id && hasDatabaseBusiness) {
      dbPayload.business_id = promo.business_id;
    }
    if (promo.category_id && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(promo.category_id)) {
      dbPayload.category_id = promo.category_id;
    }

    const { data, error } = await supabase
      .from('promotions')
      .insert([dbPayload])
      .select()
      .single();

    if (error) throw new Error(`Supabase rechazó la creación: ${error.message}`);
    if (!data) throw new Error('Supabase no confirmó la creación de la promoción.');
    newPromo.id = String(data.id);
  }

  const list = await getPromotions();
  const updated = [newPromo, ...list.filter(p => p.id !== newPromo.id)];
  setStorageData('yaps_promotions', updated);
  return newPromo;
}

export async function updatePromotion(id: string, promo: Partial<Promotion>): Promise<Promotion> {
  const isDatabaseId = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

  if (isDatabaseId) {
    const supabase = createClient();
    const dbPayload: any = {};
    if (promo.title !== undefined) dbPayload.title = promo.title;
    if (promo.description !== undefined) dbPayload.description = promo.description;
    if (promo.discount_percentage !== undefined) dbPayload.discount_percent = promo.discount_percentage;
    if (promo.original_price !== undefined) dbPayload.original_price = promo.original_price;
    if (promo.offer_price !== undefined) dbPayload.promo_price = promo.offer_price;
    if (promo.image_url !== undefined) dbPayload.image_url = promo.image_url;
    if (promo.link_url !== undefined) dbPayload.link_url = promo.link_url;
    if (promo.status !== undefined) dbPayload.status = promo.status;
    if (promo.business_id && promo.business_id.length > 10) dbPayload.business_id = promo.business_id;
    if (promo.category_id && promo.category_id.length > 10) dbPayload.category_id = promo.category_id;

    const { data, error } = await supabase
      .from('promotions')
      .update(dbPayload)
      .eq('id', id)
      .select('id')
      .maybeSingle();

    if (error) {
      throw new Error(`Supabase rechazó la actualización: ${error.message}`);
    }
    if (!data) {
      throw new Error('No se guardó la promoción. Verifica que tu cuenta tenga permisos para editarla.');
    }
  }

  const currentList = getStorageData<Promotion[]>('yaps_promotions', []);
  const existing = currentList.find((item) => item.id === id);
  const updatedItem = { ...existing, ...promo, id } as Promotion;
  setStorageData(
    'yaps_promotions',
    currentList.map((item) => item.id === id ? updatedItem : item)
  );

  if (!isDatabaseId) return updatedItem;

  const list = await getPromotions();
  return { ...updatedItem, ...list.find((item) => item.id === id) };
}

export async function deletePromotion(id: string): Promise<boolean> {
  try {
    const supabase = createClient();
    await supabase.from('promotions').delete().eq('id', id);
  } catch (err) {
    console.log('Eliminando promoción:', err);
  }

  const list = getStorageData<Promotion[]>('yaps_promotions', []);
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
  let localList = getStorageData<UserAccount[]>('yaps_users', INITIAL_USERS);
  localList = localList.map((user) => {
    const account = { ...user };
    delete account.password;
    return account;
  });
  
  // Ensure the 2 official accounts are always present
  INITIAL_USERS.forEach((initUser) => {
    const exists = localList.some((u) => u.email.toLowerCase() === initUser.email.toLowerCase());
    if (!exists) {
      localList.push(initUser);
    } else {
      // Update passwords to ensure exact match
      localList = localList.map((user) =>
        user.email.toLowerCase() === initUser.email.toLowerCase()
          ? { ...user, role: initUser.role, status: 'active' }
          : user
      );
    }
  });

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
            avatar_url: item.avatar_url || existing?.avatar_url,
            role: item.role || existing?.role || 'admin',
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
  setStorageData('yaps_users', localList);
  return localList;
}

export async function createUser(data: Omit<UserAccount, 'id' | 'created_at'>): Promise<UserAccount> {
  const localList = getStorageData<UserAccount[]>('yaps_users', INITIAL_USERS).map((user) => {
    const account = { ...user };
    delete account.password;
    return account;
  });
  const newUser: UserAccount = {
    ...data,
    id: `u-${Date.now()}`,
    password: undefined,
    status: data.status || 'active',
    created_at: new Date().toISOString(),
  };

  try {
    const supabase = createClient();
    const { data: authRes, error: authErr } = await supabase.auth.signUp({
      email: data.email,
      password: data.password || '123456',
      options: {
        data: {
          full_name: data.name,
          role: data.role,
        }
      }
    });

    if (!authErr && authRes?.user) {
      newUser.id = authRes.user.id;
      await supabase.from('profiles').upsert([{
        id: authRes.user.id,
        full_name: data.name,
        role: data.role,
      }]);
    }
  } catch (err) {
    console.log('Registrando usuario en almacenamiento sincronizado:', err);
  }

  const filteredList = localList.filter((u) => u.email.toLowerCase() !== newUser.email.toLowerCase());
  const updatedList = [newUser, ...filteredList];
  setStorageData('yaps_users', updatedList);
  return newUser;
}

export async function updateUser(id: string, data: Partial<UserAccount>): Promise<UserAccount> {
  try {
    const supabase = createClient();
    const payload: any = {};
    if (data.name) payload.full_name = data.name;
    if (data.role) payload.role = data.role;

    if (Object.keys(payload).length > 0 && id.length > 10) {
      await supabase.from('profiles').update(payload).eq('id', id);
    }
  } catch (err) {
    console.log('Actualizando perfil en Supabase:', err);
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

export async function deleteUser(id: string): Promise<boolean> {
  try {
    const supabase = createClient();
    if (id.length > 10) {
      await supabase.from('profiles').delete().eq('id', id);
    }
  } catch (err) {
    console.log('Eliminando perfil en Supabase:', err);
  }

  const list = await getUsers();
  const filtered = list.filter((u) => u.id !== id);
  setStorageData('yaps_users', filtered);
  return true;
}

export async function updateUserRole(id: string, role: UserRole): Promise<UserAccount> {
  return updateUser(id, { role });
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
