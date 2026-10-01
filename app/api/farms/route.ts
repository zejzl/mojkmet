import { NextResponse } from 'next/server'
import { getFarmsList } from '@/lib/catalog'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const maxDuration = 10

export async function GET() {
  try {
    return NextResponse.json(await getFarmsList())
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json({ error: 'Failed to fetch farms' }, { status: 500 })
  }
}
