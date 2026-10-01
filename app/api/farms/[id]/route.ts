import { NextResponse } from 'next/server'
import { getFarmDetail } from '@/lib/catalog'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const maxDuration = 10

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: farmId } = await params

    const detail = await getFarmDetail(farmId)
    if (!detail) {
      return NextResponse.json({ error: 'Farm not found' }, { status: 404 })
    }

    return NextResponse.json(detail)
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json({ error: 'Failed to fetch farm details' }, { status: 500 })
  }
}
