import { getErrorMessage } from '@/lib/errors'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSessionOrError } from '@/lib/auth-helpers'
import { pickupWindowSchema, parseJson } from '@/lib/validation'

export const dynamic = 'force-dynamic'

async function getFarmerFarm(userId: string) {
  return prisma.farm.findUnique({ where: { userId }, select: { id: true } })
}

export async function GET() {
  try {
    const { session, error } = await getSessionOrError()
    if (error) return error

    if (session!.user!.role !== 'FARMER') {
      return NextResponse.json({ error: 'Dostop zavrnjen' }, { status: 403 })
    }

    const farm = await getFarmerFarm(session!.user!.id)
    if (!farm) {
      return NextResponse.json({ windows: [] })
    }

    const windows = await prisma.pickupWindow.findMany({
      where: { farmId: farm.id },
      orderBy: [{ dayOfWeek: 'asc' }, { startTime: 'asc' }],
    })

    return NextResponse.json({ windows })
  } catch (error) {
    console.error('PickupWindows GET error:', error)
    return NextResponse.json({ error: getErrorMessage(error, 'Napaka') }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { session, error } = await getSessionOrError()
    if (error) return error

    if (session!.user!.role !== 'FARMER') {
      return NextResponse.json({ error: 'Dostop zavrnjen' }, { status: 403 })
    }

    const farm = await getFarmerFarm(session!.user!.id)
    if (!farm) {
      return NextResponse.json({ error: 'Kmetija ni najdena' }, { status: 404 })
    }

    const parsed = await parseJson(pickupWindowSchema, request)
    if (!parsed.ok) return parsed.error

    const { dayOfWeek, startTime, endTime, active } = parsed.data

    const window = await prisma.pickupWindow.create({
      data: { farmId: farm.id, dayOfWeek, startTime, endTime, active: active ?? true },
    })

    return NextResponse.json({ window }, { status: 201 })
  } catch (error) {
    console.error('PickupWindows POST error:', error)
    return NextResponse.json(
      { error: getErrorMessage(error, 'Napaka pri shranjevanju termina') },
      { status: 500 }
    )
  }
}