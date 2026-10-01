import { notFound } from 'next/navigation'
import { getFarmDetail, getFarmReviews } from '@/lib/catalog'
import FarmDetail from './FarmDetail'

// Always render fresh: stock, pickup windows and reviews change independently of deploys.
export const dynamic = 'force-dynamic'

export default async function FarmDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const [detail, reviews] = await Promise.all([getFarmDetail(id), getFarmReviews(id)])
  // A real 404 (not a "not found" message on a 200 page), so search engines drop dead URLs
  if (!detail) notFound()

  return <FarmDetail farm={detail.farm} products={detail.products} reviews={reviews} />
}
