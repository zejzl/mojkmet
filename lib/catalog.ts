import { prisma } from '@/lib/prisma'
import { imageUrl, type ImageKind } from '@/lib/image-response'

// Public catalog queries, shared by the API routes (/api/farms, /api/products, ...) and the
// server-rendered pages, so the two can never drift apart.
//
// Images are stored as multi-megabyte `data:` URLs in Postgres (up to 1.5 MB each). These
// queries therefore never select the image column; instead they return a small cacheable URL
// served by app/api/{farms,products}/[id]/image/route.ts, and only for records that have one.

type ImageVersions = Map<string, Date>

async function farmImageVersions(ids: string[]): Promise<ImageVersions> {
  if (ids.length === 0) return new Map()
  const rows = await prisma.farm.findMany({
    where: { id: { in: ids }, image: { not: null } },
    select: { id: true, updatedAt: true },
  })
  return new Map(rows.map((r) => [r.id, r.updatedAt]))
}

async function productImageVersions(ids: string[]): Promise<ImageVersions> {
  if (ids.length === 0) return new Map()
  const rows = await prisma.product.findMany({
    where: { id: { in: ids }, image: { not: null } },
    select: { id: true, updatedAt: true },
  })
  return new Map(rows.map((r) => [r.id, r.updatedAt]))
}

function imageFor(kind: ImageKind, id: string, versions: ImageVersions): string | null {
  const version = versions.get(id)
  return version ? imageUrl(kind, id, version) : null
}

const roundRating = (avg: number | null | undefined) =>
  avg == null ? 0 : Math.round(avg * 10) / 10

// ---------------------------------------------------------------- farms list

export async function getFarmsList() {
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
    prisma.review.groupBy({ by: ['farmId'], _avg: { rating: true } }),
  ])

  const versions = await farmImageVersions(farms.map((f) => f.id))
  const ratingMap = new Map(ratings.map((r) => [r.farmId, roundRating(r._avg.rating)]))

  return {
    farms: farms.map((f) => ({
      id: f.id,
      name: f.name,
      description: f.description,
      city: f.city,
      latitude: f.latitude,
      longitude: f.longitude,
      image: imageFor('farms', f.id, versions),
      is_verified: f.verified,
      createdAt: f.createdAt.toISOString(),
      rating: ratingMap.get(f.id) ?? 0,
      total_reviews: f._count.reviews,
    })),
  }
}

// --------------------------------------------------------------- farm detail

export async function getFarmDetail(farmId: string) {
  const farm = await prisma.farm.findUnique({
    where: { id: farmId },
    select: {
      id: true,
      name: true,
      description: true,
      city: true,
      latitude: true,
      longitude: true,
      verified: true,
      minOrder: true,
      createdAt: true,
    },
  })
  if (!farm) return null

  const [ratingAgg, reviewCount, products, windows] = await Promise.all([
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
        stock: true,
        available: true,
        category: { select: { name: true, icon: true } },
      },
      orderBy: [{ available: 'desc' }, { name: 'asc' }],
    }),
    prisma.pickupWindow.findMany({
      where: { farmId, active: true },
      select: { id: true, dayOfWeek: true, startTime: true, endTime: true, active: true },
      orderBy: [{ dayOfWeek: 'asc' }, { startTime: 'asc' }],
    }),
  ])

  const [farmVersions, productVersions] = await Promise.all([
    farmImageVersions([farmId]),
    productImageVersions(products.map((p) => p.id)),
  ])

  return {
    farm: {
      id: farm.id,
      name: farm.name,
      description: farm.description,
      city: farm.city,
      latitude: farm.latitude,
      longitude: farm.longitude,
      image: imageFor('farms', farm.id, farmVersions),
      is_verified: farm.verified,
      createdAt: farm.createdAt.toISOString(),
      rating: roundRating(ratingAgg._avg.rating),
      total_reviews: reviewCount,
      minOrder: farm.minOrder ? farm.minOrder.toNumber() : null,
      pickupWindows: windows.map((w) => ({
        id: w.id,
        dayOfWeek: w.dayOfWeek,
        startTime: w.startTime,
        endTime: w.endTime,
        active: w.active,
      })),
    },
    products: products.map((p) => ({
      id: p.id,
      name: p.name,
      description: p.description,
      price: p.price,
      unit: p.unit,
      stock: p.stock,
      image: imageFor('products', p.id, productVersions),
      category: p.category.name,
      category_icon: p.category.icon || '',
      available: p.available,
    })),
  }
}

export async function getFarmReviews(farmId: string) {
  const reviews = await prisma.review.findMany({
    where: { farmId },
    select: {
      id: true,
      rating: true,
      comment: true,
      createdAt: true,
      updatedAt: true,
      user: { select: { name: true } },
    },
    orderBy: { createdAt: 'desc' },
    take: 50,
  })

  return reviews.map((r) => ({
    id: r.id,
    rating: r.rating,
    comment: r.comment,
    createdAt: r.createdAt.toISOString(),
    updatedAt: r.updatedAt.toISOString(),
    reviewerName: r.user.name || 'Kupec',
  }))
}

// ------------------------------------------------------------- products list

const productListSelect = {
  id: true,
  name: true,
  description: true,
  price: true,
  unit: true,
  stock: true,
  available: true,
  farmId: true,
  farm: { select: { name: true, city: true, latitude: true, longitude: true, verified: true } },
  category: { select: { name: true, slug: true, icon: true } },
} as const

function findProducts(category: string | null, search: string | null) {
  // `category` wins over `search` (existing behavior of /api/products)
  if (category) {
    return prisma.product.findMany({
      where: { category: { slug: category } },
      select: productListSelect,
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
      select: productListSelect,
      orderBy: { name: 'asc' },
    })
  }

  return prisma.product.findMany({
    select: productListSelect,
    orderBy: [{ category: { name: 'asc' } }, { name: 'asc' }],
  })
}

export async function getProductsList({
  category = null,
  search = null,
}: {
  category?: string | null
  search?: string | null
} = {}) {
  const products = await findProducts(category, search)

  const [categories, versions] = await Promise.all([
    prisma.category.findMany({
      where: { products: { some: {} } },
      select: {
        id: true,
        name: true,
        slug: true,
        icon: true,
        _count: { select: { products: true } },
      },
      orderBy: { name: 'asc' },
    }),
    productImageVersions(products.map((p) => p.id)),
  ])

  return {
    products: products.map((p) => ({
      id: p.id,
      name: p.name,
      description: p.description,
      price: p.price,
      unit: p.unit,
      stock: p.stock,
      available: p.available,
      image: imageFor('products', p.id, versions),
      farm_id: p.farmId,
      farm_name: p.farm.name,
      farm_city: p.farm.city,
      farm_latitude: p.farm.latitude,
      farm_longitude: p.farm.longitude,
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
  }
}

// ------------------------------------------------------------ product detail

export async function getProductDetail(productId: string) {
  const product = await prisma.product.findUnique({
    where: { id: productId },
    select: {
      id: true,
      name: true,
      description: true,
      price: true,
      unit: true,
      stock: true,
      available: true,
      farmId: true,
      categoryId: true,
      farm: {
        select: {
          id: true,
          name: true,
          city: true,
          latitude: true,
          longitude: true,
          description: true,
          verified: true,
        },
      },
      category: { select: { name: true, slug: true, icon: true } },
    },
  })
  if (!product) return null

  const [ratingAgg, reviewCount, relatedProducts] = await Promise.all([
    prisma.review.aggregate({ where: { farmId: product.farmId }, _avg: { rating: true } }),
    prisma.review.count({ where: { farmId: product.farmId } }),
    prisma.product.findMany({
      where: { categoryId: product.categoryId, id: { not: productId }, available: true },
      select: {
        id: true,
        name: true,
        price: true,
        unit: true,
        category: { select: { icon: true } },
      },
      take: 4,
    }),
  ])

  const versions = await productImageVersions([productId, ...relatedProducts.map((p) => p.id)])

  return {
    product: {
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      unit: product.unit,
      stock: product.stock,
      available: product.available,
      image: imageFor('products', product.id, versions),
      farmId: product.farmId,
      categoryId: product.categoryId,
      farm_id: product.farm.id,
      farm_name: product.farm.name,
      farm_city: product.farm.city,
      farm_latitude: product.farm.latitude,
      farm_longitude: product.farm.longitude,
      farm_description: product.farm.description,
      farm_verified: product.farm.verified,
      category_name: product.category.name,
      category_slug: product.category.slug,
      category_icon: product.category.icon || '',
      farm_rating: roundRating(ratingAgg._avg.rating),
      farm_total_reviews: reviewCount,
    },
    relatedProducts: relatedProducts.map((rp) => ({
      id: rp.id,
      name: rp.name,
      price: rp.price,
      unit: rp.unit,
      image: imageFor('products', rp.id, versions),
      category_icon: rp.category.icon || '',
    })),
  }
}
