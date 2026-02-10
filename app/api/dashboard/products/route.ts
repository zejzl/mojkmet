import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSessionOrError } from '@/lib/auth-helpers'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const { session, error } = await getSessionOrError()
    if (error) return error

    const farm = await prisma.farm.findUnique({
      where: { userId: session!.user!.id },
      select: { id: true },
    })

    if (!farm) {
      return NextResponse.json({ products: [], categories: [] })
    }

    const [products, categories] = await Promise.all([
      prisma.product.findMany({
        where: { farmId: farm.id },
        include: { category: { select: { name: true, slug: true } } },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.category.findMany({ orderBy: { name: 'asc' } }),
    ])

    return NextResponse.json({ products, categories })
  } catch (error: any) {
    console.error('Products GET error:', error)
    return NextResponse.json({ error: error.message || 'Napaka' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { session, error } = await getSessionOrError()
    if (error) return error

    if (session!.user!.role !== 'FARMER') {
      return NextResponse.json({ error: 'Samo kmetje lahko dodajajo izdelke' }, { status: 403 })
    }

    const farm = await prisma.farm.findUnique({
      where: { userId: session!.user!.id },
      select: { id: true },
    })

    if (!farm) {
      return NextResponse.json({ error: 'Najprej ustvarite kmetijo' }, { status: 400 })
    }

    const body = await request.json()
    const { name, description, price, unit, stock, categoryId, available } = body

    if (!name || !price || !categoryId) {
      return NextResponse.json({ error: 'Ime, cena in kategorija so obvezni' }, { status: 400 })
    }

    const product = await prisma.product.create({
      data: {
        farmId: farm.id,
        categoryId,
        name,
        description: description || null,
        price: parseFloat(price),
        unit: unit || 'kg',
        stock: parseInt(stock) || 0,
        available: available !== false,
      },
    })

    return NextResponse.json({ product })
  } catch (error: any) {
    console.error('Products POST error:', error)
    return NextResponse.json({ error: error.message || 'Napaka pri dodajanju izdelka' }, { status: 500 })
  }
}
