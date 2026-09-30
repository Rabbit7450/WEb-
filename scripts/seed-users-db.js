const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env.local') });

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!url || !key) {
  console.error('❌ Supabase credentials no disponibles.');
  process.exit(1);
}

const supabase = createClient(url, key);

const ADMIN_ACCOUNTS = [
  {
    email: 'admin@yaps.bo',
    password: '123456',
    name: 'Administrador Principal',
    role: 'admin'
  },
  {
    email: 'adalit.tic@gmail.com',
    password: 'Jhack0',
    name: 'Adalit TIC Admin',
    role: 'admin'
  }
];

async function seedUsers() {
  console.log('🔒 Sincronizando y securizando cuentas de administrador en Supabase DB...');

  for (const acc of ADMIN_ACCOUNTS) {
    // Check if auth user exists
    const { data: usersData } = await supabase.auth.admin.listUsers();
    let existingUser = usersData?.users?.find(u => u.email.toLowerCase() === acc.email.toLowerCase());

    let userId = null;

    if (existingUser) {
      console.log(`✅ Usuario auth existente encontrado: ${acc.email}`);
      userId = existingUser.id;
      // Update password to ensure it matches
      await supabase.auth.admin.updateUserById(userId, {
        password: acc.password,
        user_metadata: { full_name: acc.name, role: 'admin' }
      });
    } else {
      console.log(`🌱 Creando usuario auth oficial: ${acc.email}`);
      const { data: created, error: createErr } = await supabase.auth.admin.createUser({
        email: acc.email,
        password: acc.password,
        email_confirm: true,
        user_metadata: { full_name: acc.name, role: 'admin' }
      });

      if (created && created.user) {
        userId = created.user.id;
        console.log(`✅ Usuario auth creado: ${acc.email} (ID: ${userId})`);
      } else {
        console.error(`❌ Error creando usuario auth ${acc.email}:`, createErr?.message);
      }
    }

    if (userId) {
      // Upsert into profiles table
      const { error: profErr } = await supabase.from('profiles').upsert([{
        id: userId,
        full_name: acc.name,
        role: 'admin'
      }]);

      if (profErr) {
        console.log(`⚠️ Aviso al upsertar perfil ${acc.email}:`, profErr.message);
      } else {
        console.log(`✅ Perfil de administrador sincronizado: ${acc.email}`);
      }
    }
  }

  console.log('🎉 Cuentas de administrador aseguradas correctamente.');
}

seedUsers();
