import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const maxDuration = 10

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: farmId } = await params

    const farm = await prisma.farm.findUnique({
      where: { id: farmId },
      select: {
        id: true,
        name: true,
        description: true,
        city: true,
        verified: true,
        createdAt: true,
      },
    })

    if (!farm) {
      return NextResponse.json({ error: 'Farm not found' }, { status: 404 })
    }

    const [ratingAgg, reviewCount, products] = await Promise.all([
      prisma.review.aggregate({ where: { farmId }, _avg: { rating: true } }),
      prisma.review.count({ where: { farmId } }),
      prisma.product.findMany({
        where: { farmId },
        select: {
          id: true,
          name: true,
          description: true,
          price: true,
          unit: true,
          available: true,
          category: { select: { name: true, icon: true } },
        },
        orderBy: [{ available: 'desc' }, { name: 'asc' }],
      }),
    ])

    return NextResponse.json({
      farm: {
        id: farm.id,
        name: farm.name,
        description: farm.description,
        city: farm.city,
        is_verified: farm.verified,
        createdAt: farm.createdAt,
        rating: ratingAgg._avg.rating == null ? 0 : Math.round(ratingAgg._avg.rating * 10) / 10,
        total_reviews: reviewCount,
      },
      products: products.map((p) => ({
        id: p.id,
        name: p.name,
        description: p.description,
        price: p.price,
        unit: p.unit,
        category: p.category.name,
        category_icon: p.category.icon || '',
        available: p.available,
      })),
    })
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json({ error: 'Failed to fetch farm details' }, { status: 500 })
  }
}