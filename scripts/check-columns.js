const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.join(__dirname, '../.env.local') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function getUsers() {
  const { data: usersData, error } = await supabase.auth.admin.listUsers();
  console.log('Auth Users:', usersData?.users?.map(u => ({ id: u.id, email: u.email })), 'Error:', error);
}
getUsers();
