const { neon } = require('@neondatabase/serverless');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: '.env.local' });

const sql = neon(process.env.DATABASE_URL);

async function seed() {
  try {
    console.log('🌱 Seeding database...\n');

    const hashedPassword = await bcrypt.hash('password123', 10);

    // Create test user
    await sql`
      INSERT INTO users (id, email, password, name, role, "createdAt", "updatedAt")
      VALUES (
        gen_random_uuid(),
        'marko.novak@gmail.com',
        ${hashedPassword},
        'Marko Novak',
        'CONSUMER',
        NOW(),
        NOW()
      )
      ON CONFLICT (email) DO NOTHING
    `;
    console.log('✅ Created consumer');

    // Create farmer
    const farmerResult = await sql`
      INSERT INTO users (id, email, password, name, role, "createdAt", "updatedAt")
      VALUES (
        gen_random_uuid(),
        'france.vidmar@kmetija-vidmar.si',
        ${hashedPassword},
        'France Vidmar',
        'FARMER',
        NOW(),
        NOW()
      )
      ON CONFLICT (email) DO UPDATE SET id = users.id
      RETURNING id
    `;
    const farmerId = farmerResult[0].id;
    console.log('✅ Created farmer');

    // Create farm
    await sql`
      INSERT INTO farms (id, "userId", name, description, address, city, "postalCode", latitude, longitude, phone, verified, "createdAt", "updatedAt")
      VALUES (
        gen_random_uuid(),
        ${farmerId},
        'Kmetija Vidmar',
        'Tradicionalna kmetija z mlekom in sirarno',
        'Poljčane 15',
        'Slovenska Bistrica',
        '2310',
        46.3897,
        15.5756,
        '+386 41 234 567',
        true,
        NOW(),
        NOW()
      )
      ON CONFLICT ("userId") DO NOTHING
    `;
    console.log('✅ Created farm');

    // Create categories
    await sql`
      INSERT INTO categories (id, name, slug, icon)
      VALUES 
        (gen_random_uuid(), 'Mlečni izdelki', 'mlecni-izdelki', '🥛'),
        (gen_random_uuid(), 'Zelenjava', 'zelenjava', '🥕'),
        (gen_random_uuid(), 'Sadje', 'sadje', '🍎'),
        (gen_random_uuid(), 'Med', 'med', '🍯')
      ON CONFLICT (slug) DO NOTHING
    `;
    console.log('✅ Created categories');

    // Get farm and category IDs for products
    const farm = await sql`SELECT id FROM farms WHERE "userId" = ${farmerId} LIMIT 1`;
    const farmId = farm[0].id;
    
    const mlecni = await sql`SELECT id FROM categories WHERE slug = 'mlecni-izdelki' LIMIT 1`;
    const mlecniId = mlecni[0].id;

    // Create products
    await sql`
      INSERT INTO products (id, "farmId", "categoryId", name, description, price, unit, stock, available, "createdAt", "updatedAt")
      VALUES 
        (gen_random_uuid(), ${farmId}, ${mlecniId}, 'Polnomastno kravje mleko', 'Sveže kravje mleko z lastne kmetije', 1.80, 'L', 50, true, NOW(), NOW()),
        (gen_random_uuid(), ${farmId}, ${mlecniId}, 'Domači sir', 'Tradicionalni slovenski sir', 7.50, '200g', 30, true, NOW(), NOW())
      ON CONFLICT DO NOTHING
    `;
    console.log('✅ Created products');

    // Verify counts
    const counts = await sql`
      SELECT 
        (SELECT COUNT(*) FROM users) as users,
        (SELECT COUNT(*) FROM farms) as farms,
        (SELECT COUNT(*) FROM categories) as categories,
        (SELECT COUNT(*) FROM products) as products
    `;

    console.log('\n📊 Database stats:');
    console.log(`   Users: ${counts[0].users}`);
    console.log(`   Farms: ${counts[0].farms}`);
    console.log(`   Categories: ${counts[0].categories}`);
    console.log(`   Products: ${counts[0].products}`);
    console.log('\n✅ Seed complete! 🚀');

  } catch (error) {
    console.error('❌ Seed failed:', error.message);
    console.error(error);
    process.exit(1);
  }
}

seed();
