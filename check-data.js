require('dotenv').config({ path: '.env.local' });
const { neon } = require('@neondatabase/serverless');

const sql = neon(process.env.DATABASE_URL);

async function checkData() {
  try {
    const categories = await sql`SELECT COUNT(*) FROM categories`;
    const farms = await sql`SELECT COUNT(*) FROM farms`;
    const products = await sql`SELECT COUNT(*) FROM products`;
    const users = await sql`SELECT COUNT(*) FROM users`;

    console.log('📊 Database Contents:');
    console.log('   Categories:', categories[0].count);
    console.log('   Farms:', farms[0].count);
    console.log('   Products:', products[0].count);
    console.log('   Users:', users[0].count);

    if (farms[0].count > 0) {
      console.log('\n🏡 Sample Farms:');
      const sampleFarms = await sql`SELECT id, name, city FROM farms LIMIT 5`;
      sampleFarms.forEach(f => console.log(`   - ${f.name} (${f.city})`));
    }

    if (products[0].count > 0) {
      console.log('\n📦 Sample Products:');
      const sampleProducts = await sql`
        SELECT p.name, p.price, p.unit, c.name as category 
        FROM products p 
        JOIN categories c ON p."categoryId" = c.id 
        LIMIT 5
      `;
      sampleProducts.forEach(p => console.log(`   - ${p.name} (€${p.price}/${p.unit}) - ${p.category}`));
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

checkData();
