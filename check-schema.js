require('dotenv').config();
const { neon } = require('@neondatabase/serverless');

if (!process.env.DATABASE_URL) {
  console.error('❌ DATABASE_URL is not set. Add it to .env or .env.local');
  process.exit(1);
}

const sql = neon(process.env.DATABASE_URL);

async function checkSchema() {
  try {
    // Check if users table exists
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `;
    
    console.log('📋 Tables in database:', tables.map(t => t.table_name).join(', '));
    
    if (tables.some(t => t.table_name === 'users')) {
      // Check users table structure
      const columns = await sql`
        SELECT column_name, data_type, is_nullable
        FROM information_schema.columns
        WHERE table_name = 'users'
        ORDER BY ordinal_position
      `;
      
      console.log('\n👤 users table columns:');
      columns.forEach(col => {
        console.log(`   - ${col.column_name}: ${col.data_type} ${col.is_nullable === 'NO' ? '(required)' : '(optional)'}`);
      });
      
      // Count users
      const count = await sql`SELECT COUNT(*) as count FROM users`;
      console.log(`\n📊 Total users: ${count[0].count}`);
    } else {
      console.log('\n❌ users table does not exist! Run migration first.');
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

checkSchema();
