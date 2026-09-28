import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const maxDuration = 10

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: productId } = await params

    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        farm: { select: { id: true, name: true, city: true, description: true, verified: true } },
        category: { select: { name: true, slug: true, icon: true } },
      },
    })

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    const [ratingAgg, reviewCount, relatedProducts] = await Promise.all([
      prisma.review.aggregate({
        where: { farmId: product.farmId },
        _avg: { rating: true },
      }),
      prisma.review.count({ where: { farmId: product.farmId } }),
      prisma.product.findMany({
        where: { categoryId: product.categoryId, id: { not: productId }, available: true },
        select: {
          id: true,
          name: true,
          price: true,
          unit: true,
          image: true,
          category: { select: { icon: true } },
        },
        take: 4,
      }),
    ])

    const farmRating =
      ratingAgg._avg.rating == null
        ? 0
        : Math.round(ratingAgg._avg.rating * 10) / 10

    return NextResponse.json({
      product: {
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        unit: product.unit,
        stock: product.stock,
        available: product.available,
        image: product.image,
        farmId: product.farmId,
        categoryId: product.categoryId,
        farm_id: product.farm.id,
        farm_name: product.farm.name,
        farm_city: product.farm.city,
        farm_description: product.farm.description,
        farm_verified: product.farm.verified,
        category_name: product.category.name,
        category_slug: product.category.slug,
        category_icon: product.category.icon || '',
        farm_rating: farmRating,
        farm_total_reviews: reviewCount,
      },
      relatedProducts: relatedProducts.map((rp) => ({
        id: rp.id,
        name: rp.name,
        price: rp.price,
        unit: rp.unit,
        image: rp.image,
        category_icon: rp.category.icon || '',
      })),
    })
  } catch (error) {
    console.error('Product detail API error:', error)
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 })
  }
}