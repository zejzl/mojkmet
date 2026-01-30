const { neon } = require('@neondatabase/serverless');
const fs = require('fs');
const path = require('path');

const sql = neon('postgresql://neondb_owner:npg_SVqfBoIn9sv8@ep-little-dust-ag4wbjxz-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require');

async function populate() {
  try {
    console.log('🔌 Connecting to database...\n');
    
    // Read SQL files
    const schemaPath = path.join('C:', 'Users', 'Administrator', 'clawd', 'mojkmet', 'database', 'schema.sql');
    const seedPath = path.join('C:', 'Users', 'Administrator', 'clawd', 'mojkmet', 'database', 'seed_fixed.sql');
    
    console.log('📋 Running schema.sql...');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    // Split by semicolons and filter empty
    const schemaStatements = schema.split(';').filter(s => s.trim().length > 0);
    
    for (const statement of schemaStatements) {
      if (statement.trim()) {
        await sql.unsafe(statement);
      }
    }
    console.log('✅ Schema created\n');
    
    console.log('🌱 Running seed_fixed.sql...');
    const seedData = fs.readFileSync(seedPath, 'utf8');
    const seedStatements = seedData.split(';').filter(s => s.trim().length > 0);
    
    for (const statement of seedStatements) {
      if (statement.trim()) {
        await sql.unsafe(statement);
      }
    }
    console.log('✅ Seed data inserted\n');
    
    // Verify
    const users = await sql`SELECT COUNT(*) as count FROM users`;
    const farms = await sql`SELECT COUNT(*) as count FROM farms`;
    const products = await sql`SELECT COUNT(*) as count FROM products`;
    
    console.log('📊 Database populated:');
    console.log(`   Users: ${users[0].count}`);
    console.log(`   Farms: ${farms[0].count}`);
    console.log(`   Products: ${products[0].count}`);
    
    // Sample farm
    const sampleFarm = await sql`SELECT name, city FROM farms LIMIT 1`;
    if (sampleFarm.length > 0) {
      console.log(`\n🏡 Sample farm: ${sampleFarm[0].name} (${sampleFarm[0].city})`);
    }
    
    console.log('\n✅ Database ready for deployment! 🚀');
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error);
    process.exit(1);
  }
}

populate();
