import { cache } from 'react'
import { prisma } from '@/lib/prisma'
import { getErrorMessage } from '@/lib/errors'

// Minimal, public-only fields for metadata and structured data. This deliberately mirrors
// what /api/farms/[id] and /api/products/[id] already expose (no street address, phone or
// postal code). `cache` dedupes the query between generateMetadata and the layout.

export const getFarmForSeo = cache(async (id: string) => {
  try {
    const farm = await prisma.farm.findUnique({
      where: { id },
      select: { id: true, name: true, description: true, city: true },
    })
    if (!farm) return null
    const [ratingAgg, reviewCount] = await Promise.all([
      prisma.review.aggregate({ where: { farmId: id }, _avg: { rating: true } }),
      prisma.review.count({ where: { farmId: id } }),
    ])
    return {
      ...farm,
      rating: ratingAgg._avg.rating ?? 0,
      reviewCount,
    }
  } catch (error) {
    getErrorMessage(error, 'SEO: farm lookup failed')
    return null
  }
})

export const getProductForSeo = cache(async (id: string) => {
  try {
    return await prisma.product.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        unit: true,
        stock: true,
        available: true,
        category: { select: { name: true } },
        farm: { select: { id: true, name: true, city: true } },
      },
    })
  } catch (error) {
    getErrorMessage(error, 'SEO: product lookup failed')
    return null
  }
})
