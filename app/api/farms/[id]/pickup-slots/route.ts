import { getErrorMessage } from '@/lib/errors'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generateSlots } from '@/lib/pickup-slots'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: farmId } = await params
    const { searchParams } = new URL(request.url)

    const rawFrom = searchParams.get('from')
    const rawDays = Number(searchParams.get('days') || '7')
    const days = Number.isFinite(rawDays) ? Math.min(Math.max(Math.floor(rawDays), 1), 30) : 7

    const from = rawFrom ? new Date(rawFrom) : new Date()
    if (Number.isNaN(from.getTime())) {
      return NextResponse.json({ error: 'Neveljaven parameter from' }, { status: 400 })
    }

    const farm = await prisma.farm.findUnique({
      where: { id: farmId },
      select: { id: true, name: true, city: true, minOrder: true },
    })

    if (!farm) {
      return NextResponse.json({ error: 'Kmetija ni najdena' }, { status: 404 })
    }

    const windows = await prisma.pickupWindow.findMany({
      where: { farmId, active: true },
      select: { id: true, dayOfWeek: true, startTime: true, endTime: true, active: true },
    })

    const slots = generateSlots(windows, { from, days })

    return NextResponse.json({
      farm: {
        id: farm.id,
        name: farm.name,
        city: farm.city,
        minOrder: farm.minOrder ? farm.minOrder.toNumber() : null,
        hasWindows: windows.length > 0,
      },
      slots,
    })
  } catch (error) {
    console.error('Pickup slots error:', error)
    return NextResponse.json({ error: getErrorMessage(error, 'Napaka') }, { status: 500 })
  }
}