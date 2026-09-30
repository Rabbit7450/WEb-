const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.join(__dirname, '../.env.local') });

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(url, key);

async function testCreateUser() {
  const testEmail = `testadmin_${Date.now()}@yaps.bo`;
  const testPassword = 'Password123!';
  const testName = 'Admin de Prueba';

  console.log(`🌱 Probando creación de usuario en Supabase Auth & Profiles: ${testEmail}...`);

  const { data: createdAuth, error: authErr } = await supabase.auth.admin.createUser({
    email: testEmail,
    password: testPassword,
    email_confirm: true,
    user_metadata: { full_name: testName, role: 'admin' }
  });

  if (authErr) {
    console.error('❌ Error creando en Auth:', authErr.message);
    return;
  }

  const userId = createdAuth.user.id;
  console.log(`✅ Creado en Auth con ID: ${userId}`);

  const { error: profErr } = await supabase.from('profiles').upsert([{
    id: userId,
    full_name: testName,
    role: 'admin'
  }]);

  if (profErr) {
    console.error('❌ Error guardando en profiles:', profErr.message);
  } else {
    console.log('✅ Guardado exitosamente en tabla profiles de PostgreSQL');
  }

  // Cleanup test user
  await supabase.auth.admin.deleteUser(userId);
  console.log('🧹 Usuario de prueba limpiado.');
}

testCreateUser();
