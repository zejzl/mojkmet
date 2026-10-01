import type { Metadata } from 'next'
import JsonLd from '@/components/JsonLd'
import { getProductForSeo } from '@/lib/seo-data'
import { pageMetadata, SITE_URL, truncate } from '@/lib/site'

type Props = { params: Promise<{ id: string }> }

const formatPrice = (price: number) => price.toFixed(2).replace('.', ',')

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const product = await getProductForSeo(id)

  if (!product) {
    return pageMetadata({ title: 'Izdelek ni najden', path: `/products/${id}`, noindex: true })
  }

  return pageMetadata({
    title: `${product.name}, ${product.farm.name}`,
    description:
      truncate(product.description) ??
      `${product.name} s kmetije ${product.farm.name} (${product.farm.city}). Cena ${formatPrice(product.price)} € / ${product.unit}.`,
    path: `/products/${id}`,
  })
}

export default async function ProductLayout({
  children,
  params,
}: Props & { children: React.ReactNode }) {
  const { id } = await params
  const product = await getProductForSeo(id)

  return (
    <>
      {product && (
        <JsonLd
          data={{
            '@context': 'https://schema.org',
            '@type': 'Product',
            name: product.name,
            url: `${SITE_URL}/products/${id}`,
            ...(product.description ? { description: truncate(product.description, 300) } : {}),
            category: product.category.name,
            offers: {
              '@type': 'Offer',
              url: `${SITE_URL}/products/${id}`,
              price: product.price.toFixed(2),
              priceCurrency: 'EUR',
              availability:
                product.available && product.stock > 0
                  ? 'https://schema.org/InStock'
                  : 'https://schema.org/OutOfStock',
              seller: { '@type': 'Organization', name: product.farm.name },
            },
          }}
        />
      )}
      {children}
    </>
  )
}
