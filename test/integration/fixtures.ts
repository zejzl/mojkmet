import './setup'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

// Test data is namespaced under this prefix so cleanup can target exactly what a test run
// created without needing to track individual IDs, and so it's obviously not real data if
// anyone ever looks at the test database directly.
export const TEST_PREFIX = 'vitest-'

export function uniqueEmail(label: string): string {
  return `${TEST_PREFIX}${label}-${Date.now()}-${Math.random().toString(36).slice(2)}@example.test`
}

export async function createUser(opts: { role?: 'CONSUMER' | 'FARMER'; email?: string } = {}) {
  const password = await bcrypt.hash('password123', 4) // low cost factor: tests don't need production-grade hashing cost
  return prisma.user.create({
    data: {
      email: opts.email || uniqueEmail('user'),
      password,
      name: `${TEST_PREFIX}Test User`,
      role: opts.role || 'CONSUMER',
    },
  })
}

export async function createFarm(userId: string, overrides: Partial<{ minOrder: number }> = {}) {
  return prisma.farm.create({
    data: {
      userId,
      name: `${TEST_PREFIX}Farm`,
      address: 'Testna cesta 1',
      city: 'Ljubljana',
      postalCode: '1000',
      minOrder: overrides.minOrder,
    },
  })
}

export async function createCategory() {
  const slug = `${TEST_PREFIX}cat-${Date.now()}-${Math.random().toString(36).slice(2)}`
  return prisma.category.create({
    data: { name: slug, slug },
  })
}

export async function createProduct(
  farmId: string,
  categoryId: string,
  overrides: Partial<{ price: number; stock: number; available: boolean }> = {}
) {
  return prisma.product.create({
    data: {
      farmId,
      categoryId,
      name: `${TEST_PREFIX}Product`,
      price: overrides.price ?? 5,
      stock: overrides.stock ?? 10,
      available: overrides.available ?? true,
    },
  })
}

// Deletes everything under the test prefix, in FK-safe (children-first) order. Call from
// afterEach so each test starts clean and runs are independent/repeatable.
export async function cleanupTestData() {
  const users = await prisma.user.findMany({
    where: { email: { startsWith: TEST_PREFIX } },
    select: { id: true },
  })
  const userIds = users.map((u) => u.id)
  if (userIds.length === 0) return

  const farms = await prisma.farm.findMany({
    where: { userId: { in: userIds } },
    select: { id: true },
  })
  const farmIds = farms.map((f) => f.id)

  await prisma.review.deleteMany({ where: { OR: [{ userId: { in: userIds } }, { farmId: { in: farmIds } }] } })
  await prisma.cartItem.deleteMany({ where: { userId: { in: userIds } } })
  await prisma.orderItem.deleteMany({ where: { order: { userId: { in: userIds } } } })
  await prisma.order.deleteMany({ where: { userId: { in: userIds } } })
  await prisma.favorite.deleteMany({ where: { userId: { in: userIds } } })
  await prisma.product.deleteMany({ where: { farmId: { in: farmIds } } })
  await prisma.pickupWindow.deleteMany({ where: { farmId: { in: farmIds } } })
  await prisma.farm.deleteMany({ where: { userId: { in: userIds } } })
  await prisma.category.deleteMany({ where: { slug: { startsWith: TEST_PREFIX } } })
  await prisma.user.deleteMany({ where: { id: { in: userIds } } })
}
