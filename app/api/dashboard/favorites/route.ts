import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSessionOrError } from '@/lib/auth-helpers'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const { session, error } = await getSessionOrError()
    if (error) return error

    const favorites = await prisma.favorite.findMany({
      where: { userId: session!.user!.id },
      include: {
        product: {
          include: {
            category: { select: { name: true, icon: true } },
            farm: { select: { name: true, city: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({
      favorites: favorites.map((f) => ({
        id: f.id,
        productId: f.productId,
        createdAt: f.createdAt,
        product: {
          id: f.product.id,
          name: f.product.name,
          price: f.product.price,
          unit: f.product.unit,
          stock: f.product.stock,
          available: f.product.available,
          image: f.product.image,
          categoryIcon: f.product.category.icon || '',
          farmName: f.product.farm.name,
          farmCity: f.product.farm.city,
        },
      })),
    })
  } catch (err: any) {
    console.error('Dashboard favorites error:', err)
    return NextResponse.json({ error: err.message || 'Napaka' }, { status: 500 })
  }
}
