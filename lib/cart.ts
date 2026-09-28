import { prisma } from '@/lib/prisma'

export interface HydratedCartItem {
  productId: string
  name: string
  price: number
  unit: string
  quantity: number
  farmId: string
  farmName: string
  categoryIcon: string
  maxStock: number
  available: boolean
}

// Cart items only store userId/productId/quantity — name/price/unit/stock are always read
// fresh from Product here, so a cart never goes stale on a price change the way the old
// localStorage-only cart could.
export async function getHydratedCart(userId: string): Promise<HydratedCartItem[]> {
  const items = await prisma.cartItem.findMany({
    where: { userId },
    include: {
      product: {
        select: {
          name: true,
          price: true,
          unit: true,
          stock: true,
          available: true,
          farmId: true,
          farm: { select: { name: true } },
          category: { select: { icon: true } },
        },
      },
    },
    orderBy: { createdAt: 'asc' },
  })

  return items.map((item) => ({
    productId: item.productId,
    name: item.product.name,
    price: item.product.price,
    unit: item.product.unit,
    quantity: item.quantity,
    farmId: item.product.farmId,
    farmName: item.product.farm.name,
    categoryIcon: item.product.category.icon || '🌾',
    maxStock: item.product.stock,
    available: item.product.available,
  }))
}
