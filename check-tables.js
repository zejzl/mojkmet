require('dotenv').config();
const { neon } = require('@neondatabase/serverless');

if (!process.env.DATABASE_URL) {
  console.error('❌ DATABASE_URL is not set. Add it to .env or .env.local');
  process.exit(1);
}

const sql = neon(process.env.DATABASE_URL);

sql`SELECT tablename FROM pg_tables WHERE schemaname = 'public' ORDER BY tablename`
  .then(r => console.log('Tables:', r.map(t => t.tablename).join(', ')));
