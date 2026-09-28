import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const maxDuration = 10

async function getProducts(category: string | null, search: string | null) {
  const include = {
    farm: { select: { name: true, city: true, verified: true } as const },
    category: { select: { name: true, slug: true, icon: true } as const },
  }

  if (category) {
    return prisma.product.findMany({
      where: { category: { slug: category } },
      include,
      orderBy: { name: 'asc' },
    })
  }

  if (search) {
    return prisma.product.findMany({
      where: {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
        ],
      },
      include,
      orderBy: { name: 'asc' },
    })
  }

  return prisma.product.findMany({
    include,
    orderBy: [{ category: { name: 'asc' } }, { name: 'asc' }],
  })
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const search = searchParams.get('search')

    const products = await getProducts(category, search)

    const categories = await prisma.category.findMany({
      where: { products: { some: {} } },
      select: {
        id: true,
        name: true,
        slug: true,
        icon: true,
        _count: { select: { products: true } },
      },
      orderBy: { name: 'asc' },
    })

    return NextResponse.json({
      products: products.map((p) => ({
        id: p.id,
        name: p.name,
        description: p.description,
        price: p.price,
        unit: p.unit,
        stock: p.stock,
        available: p.available,
        image: p.image,
        farm_id: p.farmId,
        farm_name: p.farm.name,
        farm_city: p.farm.city,
        farm_verified: p.farm.verified,
        category_name: p.category.name,
        category_slug: p.category.slug,
        category_icon: p.category.icon || '',
      })),
      categories: categories.map((c) => ({
        id: c.id,
        name: c.name,
        slug: c.slug,
        icon: c.icon || '',
        product_count: c._count.products,
      })),
      total: products.length,
    })
  } catch (error) {
    console.error('Products API error:', error)
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 })
  }
}