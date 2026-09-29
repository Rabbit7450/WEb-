const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env.local') });
const { Client } = require('pg');

const connectionString = process.env.DATABASE_URL;

if (!connectionString || connectionString.includes('[TU_CONTRASEÑA]') || connectionString.includes('[YOUR-PASSWORD]')) {
  console.error('⚠️  Por favor configura tu contraseña real en DATABASE_URL en el archivo .env.local');
  process.exit(1);
}

const client = new Client({
  connectionString,
  ssl: { rejectUnauthorized: false }
});

async function testConnection() {
  try {
    console.log('🔄 Intentando conectar a Supabase PostgreSQL...');
    await client.connect();
    console.log('✅ ¡Conexión exitosa a Supabase PostgreSQL!');
    const res = await client.query('SELECT NOW() as current_time, current_database();');
    console.log('📊 Información del servidor:', res.rows[0]);
    await client.end();
  } catch (err) {
    console.error('❌ Error al conectar a la base de datos:', err.message);
    process.exit(1);
  }
}

testConnection();
