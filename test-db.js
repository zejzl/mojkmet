const { neon } = require('@neondatabase/serverless');
const sql = neon('postgresql://neondb_owner:npg_9mH6KzYMkcQN@ep-divine-butterfly-ag8zjgu3-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require');

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
