const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env.local') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function seedAll() {
  console.log('🔄 Sincronizando usuario auth, perfiles, negocios y categorías...');

  // 1. Clear existing promotions
  await supabase.from('promotions').delete().neq('title', '___NON_EXISTENT___');

  // 2. Create or fetch Auth user
  let ownerId = null;
  const { data: usersData } = await supabase.auth.admin.listUsers();
  if (usersData && usersData.users && usersData.users.length > 0) {
    ownerId = usersData.users[0].id;
  } else {
    const { data: createdAuth, error: authErr } = await supabase.auth.admin.createUser({
      email: 'admin@yaps.bo',
      password: 'AdminPassword123!',
      email_confirm: true,
      user_metadata: { full_name: 'Administrador Principal' }
    });

    if (createdAuth && createdAuth.user) {
      ownerId = createdAuth.user.id;
      // Also ensure profile exists
      await supabase.from('profiles').upsert([{
        id: ownerId,
        full_name: 'Administrador Principal',
        role: 'admin'
      }]);
    } else {
      console.error('Error creando usuario Auth:', authErr?.message);
    }
  }

  console.log('Owner Auth ID:', ownerId);

  // 3. Fetch or insert businesses
  const businesses = [
    { name: 'Makro Abasto - Gran Vía', slug: 'makro-abasto', description: 'Supermercado con los mejores precios en abarrotes y productos del hogar en La Paz y El Alto.', address: 'Av. Manco Kapac N.° 494, Mall Gran Vía', phone: '76543210', owner_id: ownerId },
    { name: 'Pollos Cochabamba', slug: 'pollos-cochabamba', description: 'El sabor tradicional de pollos, pipocas crocantes y salchipapas irresistibles.', address: 'Av. Heroínas #450', phone: '71234567', owner_id: ownerId },
    { name: 'Multicine Bolivia', slug: 'multicine-bolivia', description: 'El complejo de cine líder en Bolivia con la mejor tecnología.', address: 'Av. Arce #2631, Sopocachi', phone: '70011223', owner_id: ownerId }
  ];

  const businessIds = {};

  for (const b of businesses) {
    let { data } = await supabase.from('businesses').select('id').eq('slug', b.slug);
    if (data && data.length > 0) {
      businessIds[b.slug] = data[0].id;
    } else {
      const { data: inserted, error: insErr } = await supabase.from('businesses').insert([b]).select();
      if (inserted && inserted[0]) {
        businessIds[b.slug] = inserted[0].id;
      } else {
        console.error('Error creando negocio:', insErr?.message);
      }
    }
  }

  // 4. Fetch or insert categories
  const categories = [
    { name: 'Supermercado', slug: 'supermercado', icon: 'ShoppingBag' },
    { name: 'Gastronomía', slug: 'gastronomia', icon: 'Utensils' },
    { name: 'Entretenimiento', slug: 'entretenimiento', icon: 'Film' }
  ];

  const categoryIds = {};

  for (const c of categories) {
    let { data } = await supabase.from('categories').select('id').eq('slug', c.slug);
    if (data && data.length > 0) {
      categoryIds[c.slug] = data[0].id;
    } else {
      const { data: inserted, error: insErr } = await supabase.from('categories').insert([c]).select();
      if (inserted && inserted[0]) {
        categoryIds[c.slug] = inserted[0].id;
      } else {
        console.error('Error creando categoría:', insErr?.message);
      }
    }
  }

  console.log('Business IDs:', businessIds);
  console.log('Category IDs:', categoryIds);

  const PROMOTIONS = [
    {
      title: 'Arroz Caisy Grano de Oro 1 kg',
      description: '¡El sabor y la calidad que tu familia merece! Celebra con nosotros y aprovecha Arroz Caisy Grano de Oro de 1 kg a solo 18.50 Bs. Ideal para preparar tus mejores comidas. Visítanos en Centro (Mall Gran Vía), Achumani, UPEA El Alto, Faro Murillo y Obelisco. Atención de 08:00 a 22:00. Promoción válida hasta agotar existencias.',
      discount_percent: 16,
      original_price: 22,
      promo_price: 18.5,
      image_url: '/img/Promo/Arroz-MakroAbasto.jpeg',
      status: 'published',
      business_id: businessIds['makro-abasto'],
      category_id: categoryIds['supermercado'],
      starts_at: '2026-09-25T00:00:00.000Z',
      ends_at: '2026-10-31T23:59:59.000Z',
      is_featured: true
    },
    {
      title: 'Arroz Especial Caisy 1 kg (Promoción Aniversario)',
      description: '¡Calidad y ahorro para tu hogar! Aprovecha nuestra promoción de aniversario y lleva Arroz Especial Caisy de 1 kg a solo 16.50 Bs. ¡Ven por el tuyo! Visítanos en Centro (Mall Gran Vía), Achumani, UPEA El Alto, Faro Murillo y Obelisco. Atención de 08:00 a 22:00. Promoción válida hasta agotar existencias.',
      discount_percent: 18,
      original_price: 20,
      promo_price: 16.5,
      image_url: '/img/Promo/Fideo-MakroAbasto.jpeg',
      status: 'published',
      business_id: businessIds['makro-abasto'],
      category_id: categoryIds['supermercado'],
      starts_at: '2026-09-25T00:00:00.000Z',
      ends_at: '2026-10-31T23:59:59.000Z',
      is_featured: true
    },
    {
      title: 'Viernes de 2 Pipocas de Pollo',
      description: '¿Antojo de pollo? Acá no esperamos al finde. ¡Viernes de Pipocas de Pollo! 2 Pipocas de Pollo por 49 Bs. Dos platos cargados de pollo crocante, papitas y ese sabor que nunca olvidas.',
      discount_percent: 30,
      original_price: 70,
      promo_price: 49,
      image_url: '/img/Promo/Pipocas-Polloscochabamba.jpeg',
      status: 'published',
      business_id: businessIds['pollos-cochabamba'],
      category_id: categoryIds['gastronomia'],
      starts_at: '2026-09-25T00:00:00.000Z',
      ends_at: '2026-10-31T23:59:59.000Z',
      is_featured: true
    },
    {
      title: 'Jueves de 2 Salchipapas por 20 Bs',
      description: 'Jueves de: "solo iba a comer algo tranqui". Y terminaste con 2 salchipapas por solo 20 Bs. Pero se entiende... ¡con esa promo cualquiera cae!',
      discount_percent: 43,
      original_price: 35,
      promo_price: 20,
      image_url: '/img/Promo/Salchi-Polloscochabamba.jpeg',
      status: 'published',
      business_id: businessIds['pollos-cochabamba'],
      category_id: categoryIds['gastronomia'],
      starts_at: '2026-09-25T00:00:00.000Z',
      ends_at: '2026-10-31T23:59:59.000Z',
      is_featured: true
    },
    {
      title: 'Fiesta del Cine - Entradas a 20 Bs en 2D',
      description: '¡Este 5 y 6 de octubre vive la #FiestaDelCine en Multicine con entradas a 20 Bs en 2D para tooodas las películas! También tendremos precios superreducidos en nuestros formatos especiales. La preventa inicia este sábado 3 de octubre a las 10 AM en App Multicine, www.multicine.com.bo, kioscos de autoservicio y boleterías de todos nuestros complejos.',
      discount_percent: 56,
      original_price: 45,
      promo_price: 20,
      image_url: '/img/Promo/Multicine.jpeg',
      status: 'published',
      business_id: businessIds['multicine-bolivia'],
      category_id: categoryIds['entretenimiento'],
      starts_at: '2026-10-03T00:00:00.000Z',
      ends_at: '2026-10-06T23:59:59.000Z',
      is_featured: true
    }
  ];

  console.log('🌱 Insertando las 5 promociones oficiales en Supabase DB...');
  for (const promo of PROMOTIONS) {
    const { data, error } = await supabase.from('promotions').insert([promo]).select();
    if (error) {
      console.error(`❌ Error al insertar ${promo.title}:`, error.message);
    } else {
      console.log(`✅ Promoción insertada en Supabase DB: "${promo.title}" (ID: ${data[0]?.id})`);
    }
  }

  console.log('🎉 Sincronización completa en Supabase.');
}

seedAll();
