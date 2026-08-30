import dotenv from 'dotenv'
import path from 'path'
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'Set ✅' : 'Missing ❌')

import { prisma } from '../lib/prisma'
import bcrypt from 'bcryptjs'

async function main() {
  console.log('🌱 Seeding database...\n')

  // Create test user (consumer)
  const hashedPassword = await bcrypt.hash('password123', 10)

  const user = await prisma.user.upsert({
    where: { email: 'marko.novak@gmail.com' },
    update: {},
    create: {
      email: 'marko.novak@gmail.com',
      password: hashedPassword,
      name: 'Marko Novak',
      role: 'CONSUMER',
    },
  })

  console.log('✅ Created user:', user.email)

  // Create test farmer
  const farmer = await prisma.user.upsert({
    where: { email: 'france.vidmar@kmetija-vidmar.si' },
    update: {},
    create: {
      email: 'france.vidmar@kmetija-vidmar.si',
      password: hashedPassword,
      name: 'France Vidmar',
      role: 'FARMER',
    },
  })

  // Create farm
  const farm = await prisma.farm.upsert({
    where: { userId: farmer.id },
    update: {},
    create: {
      userId: farmer.id,
      name: 'Kmetija Vidmar',
      description: 'Tradicionalna kmetija z mlekom in sirarno',
      address: 'Poljčane 15',
      city: 'Slovenska Bistrica',
      postalCode: '2310',
      latitude: 46.3897,
      longitude: 15.5756,
      phone: '+386 41 234 567',
      verified: true,
    },
  })

  console.log('✅ Created farm:', farm.name)

  // Create categories
  const mlecniIzdelki = await prisma.category.upsert({
    where: { slug: 'mlecni-izdelki' },
    update: {},
    create: {
      name: 'Mlečni izdelki',
      slug: 'mlecni-izdelki',
      icon: '🥛',
    },
  })

  await prisma.category.upsert({
    where: { slug: 'zelenjava' },
    update: {},
    create: {
      name: 'Zelenjava',
      slug: 'zelenjava',
      icon: '🥕',
    },
  })

  console.log('✅ Created categories')

  // Create products
  await prisma.product.upsert({
    where: { id: 'prod-milk-1' },
    update: {},
    create: {
      id: 'prod-milk-1',
      farmId: farm.id,
      categoryId: mlecniIzdelki.id,
      name: 'Polnomastno kravje mleko',
      description: 'Sveže kravje mleko z lastne kmetije',
      price: 1.8,
      unit: 'L',
      stock: 50,
      available: true,
    },
  })

  await prisma.product.upsert({
    where: { id: 'prod-cheese-1' },
    update: {},
    create: {
      id: 'prod-cheese-1',
      farmId: farm.id,
      categoryId: mlecniIzdelki.id,
      name: 'Domači sir',
      description: 'Tradicionalni slovenski sir',
      price: 7.5,
      unit: '200g',
      stock: 30,
      available: true,
    },
  })

  console.log('✅ Created products')

  const counts = {
    users: await prisma.user.count(),
    farms: await prisma.farm.count(),
    categories: await prisma.category.count(),
    products: await prisma.product.count(),
  }

  console.log('\n📊 Database stats:')
  console.log(`   Users: ${counts.users}`)
  console.log(`   Farms: ${counts.farms}`)
  console.log(`   Categories: ${counts.categories}`)
  console.log(`   Products: ${counts.products}`)
  console.log('\n✅ Seed complete!')
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
