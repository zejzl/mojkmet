import { NextRequest, NextResponse } from 'next/server'
import { getProductDetail } from '@/lib/catalog'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const maxDuration = 10

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: productId } = await params

    const detail = await getProductDetail(productId)
    if (!detail) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    return NextResponse.json(detail)
  } catch (error) {
    console.error('Product detail API error:', error)
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 })
  }
}
