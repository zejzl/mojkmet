require('dotenv').config();
const { neon } = require('@neondatabase/serverless');

if (!process.env.DATABASE_URL) {
  console.error('❌ DATABASE_URL is not set. Add it to .env or .env.local');
  process.exit(1);
}

const sql = neon(process.env.DATABASE_URL);

async function verify() {
  try {
    console.log('🔌 Connecting to ep-little-dust database...\n');
    
    // Check tables
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `;
    
    console.log('📋 Tables:', tables.map(t => t.table_name).join(', '));
    
    // Check users table structure
    const userCols = await sql`
      SELECT column_name 
      FROM information_schema.columns
      WHERE table_name = 'users'
      ORDER BY ordinal_position
    `;
    console.log('\n👤 users columns:', userCols.map(c => c.column_name).join(', '));
    
    // Count records
    const users = await sql`SELECT COUNT(*) as count FROM users`;
    const farms = await sql`SELECT COUNT(*) as count FROM farms`;
    const products = await sql`SELECT COUNT(*) as count FROM products`;
    
    console.log('\n📊 Data:');
    console.log(`   Users: ${users[0].count}`);
    console.log(`   Farms: ${farms[0].count}`);
    console.log(`   Products: ${products[0].count}`);
    
    // Sample farm
    const sampleFarm = await sql`SELECT name, city FROM farms LIMIT 1`;
    if (sampleFarm.length > 0) {
      console.log(`\n🏡 Sample farm: ${sampleFarm[0].name} (${sampleFarm[0].city})`);
    }
    
    console.log('\n✅ Database is ready!');
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

verify();
