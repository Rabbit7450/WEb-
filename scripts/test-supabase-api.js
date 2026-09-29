const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env.local') });
const { createClient } = require('@supabase/supabase-js');

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!url || !key) {
  console.error('❌ Falta URL o Key de Supabase');
  process.exit(1);
}

const supabase = createClient(url, key);

async function testApi() {
  console.log('🔄 Probando conexión a la API de Supabase...');
  try {
    // Intentar consultar la lista de tablas o un endpoint público
    const { data, error } = await supabase.from('cities').select('count', { count: 'exact', head: true });
    
    if (error) {
      if (error.code === '42P01') {
        console.log('✅ ¡Conexión con Supabase REST API establecida exitosamente!');
        console.log('ℹ️  Nota: La tabla "cities" aún no existe en el esquema. Se recomienda aplicar schema.sql.');
      } else {
        console.log('✅ Conexión a la API respondida con mensaje:', error.message);
      }
    } else {
      console.log('✅ ¡Conexión exitosa a la API de Supabase REST!');
      console.log('📊 Datos recibidos:', data);
    }
  } catch (err) {
    console.error('❌ Error de red/conexión:', err.message);
  }
}

testApi();
