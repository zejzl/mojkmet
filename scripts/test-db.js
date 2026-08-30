require('dotenv').config({ path: '.env.local' });
const { neon } = require('@neondatabase/serverless');

if (!process.env.DATABASE_URL) {
  console.error('❌ DATABASE_URL not found in .env.local');
  process.exit(1);
}

const sql = neon(process.env.DATABASE_URL);

sql`SELECT NOW() as now, current_database() as db`
  .then(r => {
    console.log('✅ Database connection OK');
    console.log('   Time:', r[0].now);
    console.log('   Database:', r[0].db);
  })
  .catch(e => {
    console.error('❌ Connection failed:', e.message);
    process.exit(1);
  });
