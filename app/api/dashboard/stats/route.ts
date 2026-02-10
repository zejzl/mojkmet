import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSessionOrError } from '@/lib/auth-helpers'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const { session, error } = await getSessionOrError()
    if (error) return error

    const userId = session!.user!.id
    const role = session!.user!.role

    if (role === 'FARMER') {
      const farm = await prisma.farm.findUnique({
        where: { userId },
        select: { id: true },
      })

      if (!farm) {
        return NextResponse.json({
          role: 'FARMER',
          hasFarm: false,
          products: 0,
          ordersReceived: 0,
          avgRating: 0,
          totalRevenue: 0,
        })
      }

      const [productCount, reviews, orderItems] = await Promise.all([
        prisma.product.count({ where: { farmId: farm.id } }),
        prisma.review.findMany({
          where: { farmId: farm.id },
          select: { rating: true },
        }),
        prisma.orderItem.findMany({
          where: { product: { farmId: farm.id } },
          select: { price: true, quantity: true },
        }),
      ])

      const avgRating = reviews.length > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        : 0

      const totalRevenue = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0)

      return NextResponse.json({
        role: 'FARMER',
        hasFarm: true,
        products: productCount,
        ordersReceived: orderItems.length,
        avgRating: Math.round(avgRating * 10) / 10,
        totalRevenue: Math.round(totalRevenue * 100) / 100,
        reviewCount: reviews.length,
      })
    }

    // Consumer stats
    const [orderCount, activeOrders, favoriteCount] = await Promise.all([
      prisma.order.count({ where: { userId } }),
      prisma.order.count({
        where: {
          userId,
          status: { in: ['PENDING', 'CONFIRMED', 'PREPARING', 'READY'] },
        },
      }),
      prisma.favorite.count({ where: { userId } }),
    ])

    return NextResponse.json({
      role: 'CONSUMER',
      totalOrders: orderCount,
      activeOrders,
      favorites: favoriteCount,
    })
  } catch (error: any) {
    console.error('Stats error:', error)
    return NextResponse.json({ error: error.message || 'Napaka pri pridobivanju statistike' }, { status: 500 })
  }
}
