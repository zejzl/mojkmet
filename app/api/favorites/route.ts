import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSessionOrError } from '@/lib/auth-helpers'

export const dynamic = 'force-dynamic'

// GET /api/favorites - vrne seznam productId-jev za prijavljenega uporabnika
export async function GET() {
  try {
    const { session, error } = await getSessionOrError()
    if (error) return NextResponse.json({ favorites: [] })

    const favorites = await prisma.favorite.findMany({
      where: { userId: session!.user!.id },
      select: { productId: true, id: true },
    })

    return NextResponse.json({ favorites: favorites.map((f) => f.productId) })
  } catch (err: any) {
    console.error('Favorites GET error:', err)
    return NextResponse.json({ favorites: [] })
  }
}

// POST /api/favorites - preklopi priljubljenost za produkt
export async function POST(request: Request) {
  try {
    const { session, error } = await getSessionOrError()
    if (error) return error

    const body = await request.json()
    const { productId } = body

    if (!productId) {
      return NextResponse.json({ error: 'productId je obvezen' }, { status: 400 })
    }

    const existing = await prisma.favorite.findUnique({
      where: { userId_productId: { userId: session!.user!.id, productId } },
    })

    if (existing) {
      await prisma.favorite.delete({
        where: { userId_productId: { userId: session!.user!.id, productId } },
      })
      return NextResponse.json({ favorited: false })
    } else {
      await prisma.favorite.create({
        data: { userId: session!.user!.id, productId },
      })
      return NextResponse.json({ favorited: true })
    }
  } catch (err: any) {
    console.error('Favorites POST error:', err)
    return NextResponse.json({ error: err.message || 'Napaka' }, { status: 500 })
  }
}
