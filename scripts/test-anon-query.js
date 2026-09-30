const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.join(__dirname, '../.env.local') });

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(url, anonKey);

async function testAnon() {
  console.log('Testing public anon SELECT from promotions table...');
  const { data, error } = await supabase.from('promotions').select('*, businesses(name), categories(name)');
  console.log('Error:', error);
  console.log('Data count:', data ? data.length : 0);
  console.log('Data:', data);
}
testAnon();
