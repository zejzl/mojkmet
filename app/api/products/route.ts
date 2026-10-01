import { NextRequest, NextResponse } from 'next/server'
import { getProductsList } from '@/lib/catalog'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const maxDuration = 10

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    return NextResponse.json(
      await getProductsList({
        category: searchParams.get('category'),
        search: searchParams.get('search'),
      })
    )
  } catch (error) {
    console.error('Products API error:', error)
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 })
  }
}
