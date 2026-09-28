import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const maxDuration = 10

export async function GET() {
  try {
    const [farms, ratings] = await Promise.all([
      prisma.farm.findMany({
        select: {
          id: true,
          name: true,
          description: true,
          city: true,
          latitude: true,
          longitude: true,
          verified: true,
          createdAt: true,
          _count: { select: { reviews: true } },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.review.groupBy({
        by: ['farmId'],
        _avg: { rating: true },
      }),
    ])

    const ratingMap = new Map<string, number>(
      ratings.map((r) => [
        r.farmId,
        r._avg.rating == null ? 0 : Math.round(r._avg.rating * 10) / 10,
      ])
    )

    return NextResponse.json({
      farms: farms.map((f) => ({
        id: f.id,
        name: f.name,
        description: f.description,
        city: f.city,
        latitude: f.latitude,
        longitude: f.longitude,
        is_verified: f.verified,
        createdAt: f.createdAt,
        rating: ratingMap.get(f.id) ?? 0,
        total_reviews: f._count.reviews,
      })),
    })
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json({ error: 'Failed to fetch farms' }, { status: 500 })
  }
}