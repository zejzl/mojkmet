import { notFound } from 'next/navigation'
import { getProductDetail } from '@/lib/catalog'
import ProductDetail from './ProductDetail'

// Always render fresh: price and stock change independently of deploys.
export const dynamic = 'force-dynamic'

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const detail = await getProductDetail(id)
  // A real 404 (not a "not found" message on a 200 page), so search engines drop dead URLs
  if (!detail) notFound()

  return <ProductDetail product={detail.product} relatedProducts={detail.relatedProducts} />
}
