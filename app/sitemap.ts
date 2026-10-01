import type { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'
import { SITE_URL } from '@/lib/site'
import { getErrorMessage } from '@/lib/errors'

// Regenerate hourly so new farms/products show up without a redeploy
export const revalidate = 3600

// Only public, indexable pages. /login, /register, /cart, /checkout and /dashboard are
// excluded on purpose (they are disallowed in robots.ts and sent noindex).
const STATIC_PAGES: {
  path: string
  changeFrequency: 'daily' | 'weekly' | 'monthly' | 'yearly'
  priority: number
}[] = [
  { path: '', changeFrequency: 'weekly', priority: 1.0 },
  { path: '/farms', changeFrequency: 'daily', priority: 0.9 },
  { path: '/products', changeFrequency: 'daily', priority: 0.9 },
  { path: '/categories', changeFrequency: 'weekly', priority: 0.7 },
  { path: '/how-it-works', changeFrequency: 'monthly', priority: 0.7 },
  { path: '/for-farmers', changeFrequency: 'monthly', priority: 0.7 },
  { path: '/about', changeFrequency: 'monthly', priority: 0.6 },
  { path: '/faq', changeFrequency: 'monthly', priority: 0.6 },
  { path: '/contact', changeFrequency: 'yearly', priority: 0.5 },
  { path: '/shipping', changeFrequency: 'yearly', priority: 0.4 },
  { path: '/returns', changeFrequency: 'yearly', priority: 0.4 },
  { path: '/privacy', changeFrequency: 'yearly', priority: 0.3 },
  { path: '/terms', changeFrequency: 'yearly', priority: 0.3 },
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticEntries: MetadataRoute.Sitemap = STATIC_PAGES.map((page) => ({
    url: `${SITE_URL}${page.path}`,
    changeFrequency: page.changeFrequency,
    priority: page.priority,
  }))

  // If the database is unreachable (e.g. at build time without DATABASE_URL), still serve
  // the static pages rather than failing the whole sitemap.
  try {
    const [farms, products] = await Promise.all([
      prisma.farm.findMany({ select: { id: true, updatedAt: true } }),
      prisma.product.findMany({
        where: { available: true },
        select: { id: true, updatedAt: true },
      }),
    ])

    return [
      ...staticEntries,
      ...farms.map((farm) => ({
        url: `${SITE_URL}/farms/${farm.id}`,
        lastModified: farm.updatedAt,
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      })),
      ...products.map((product) => ({
        url: `${SITE_URL}/products/${product.id}`,
        lastModified: product.updatedAt,
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      })),
    ]
  } catch (error) {
    getErrorMessage(error, 'Sitemap: database unavailable, serving static pages only')
    return staticEntries
  }
}
