import type { Metadata } from 'next'
import JsonLd from '@/components/JsonLd'
import { getFarmForSeo } from '@/lib/seo-data'
import { pageMetadata, SITE_URL, truncate } from '@/lib/site'

type Props = { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const farm = await getFarmForSeo(id)

  if (!farm) {
    return pageMetadata({ title: 'Kmetija ni najdena', path: `/farms/${id}`, noindex: true })
  }

  return pageMetadata({
    title: `${farm.name}, ${farm.city}`,
    description:
      truncate(farm.description) ??
      `Kmetija ${farm.name} iz kraja ${farm.city}. Sveži pridelki neposredno od kmeta.`,
    path: `/farms/${id}`,
  })
}

export default async function FarmLayout({
  children,
  params,
}: Props & { children: React.ReactNode }) {
  const { id } = await params
  const farm = await getFarmForSeo(id)

  return (
    <>
      {farm && (
        <JsonLd
          data={{
            '@context': 'https://schema.org',
            '@type': 'LocalBusiness',
            '@id': `${SITE_URL}/farms/${id}`,
            name: farm.name,
            url: `${SITE_URL}/farms/${id}`,
            ...(farm.description ? { description: truncate(farm.description, 300) } : {}),
            // Locality only: the exact address is private until an order is placed
            address: {
              '@type': 'PostalAddress',
              addressLocality: farm.city,
              addressCountry: 'SI',
            },
            ...(farm.reviewCount > 0
              ? {
                  aggregateRating: {
                    '@type': 'AggregateRating',
                    ratingValue: Math.round(farm.rating * 10) / 10,
                    reviewCount: farm.reviewCount,
                  },
                }
              : {}),
          }}
        />
      )}
      {children}
    </>
  )
}
