import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const maxDuration = 10

export async function GET() {
  try {
    if (!process.env.DATABASE_URL) {
      return NextResponse.json(
        { error: 'Database not configured. Set DATABASE_URL environment variable.' },
        { status: 500 }
      )
    }

    const [farmCount, productCount, orderCount] = await Promise.all([
      prisma.farm.count(),
      prisma.product.count(),
      prisma.order.count(),
    ])

    return NextResponse.json({
      farmCount,
      productCount,
      orderCount,
    })
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 })
  }
}