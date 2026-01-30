const { neon } = require('@neondatabase/serverless');
const sql = neon('postgresql://neondb_owner:npg_SVqfBoIn9sv8@ep-little-dust-ag4wbjxz-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require');

sql`SELECT tablename FROM pg_tables WHERE schemaname = 'public' ORDER BY tablename`
  .then(r => console.log('Tables:', r.map(t => t.tablename).join(', ')));
