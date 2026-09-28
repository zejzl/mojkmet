import { getErrorMessage } from '@/lib/errors'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSessionOrError } from '@/lib/auth-helpers'
import { pickupWindowUpdateSchema, parseJson } from '@/lib/validation'

export const dynamic = 'force-dynamic'

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { session, error } = await getSessionOrError()
    if (error) return error

    if (session!.user!.role !== 'FARMER') {
      return NextResponse.json({ error: 'Dostop zavrnjen' }, { status: 403 })
    }

    const { id } = await params

    const parsed = await parseJson(pickupWindowUpdateSchema, request)
    if (!parsed.ok) return parsed.error

    const existing = await prisma.pickupWindow.findFirst({
      where: { id, farm: { userId: session!.user!.id } },
    })
    if (!existing) {
      return NextResponse.json({ error: 'Termin ni najden' }, { status: 404 })
    }

    const window = await prisma.pickupWindow.update({
      where: { id },
      data: parsed.data,
    })

    return NextResponse.json({ window })
  } catch (error) {
    console.error('PickupWindow PATCH error:', error)
    return NextResponse.json(
      { error: getErrorMessage(error, 'Napaka pri posodabljanju termina') },
      { status: 500 }
    )
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { session, error } = await getSessionOrError()
    if (error) return error

    if (session!.user!.role !== 'FARMER') {
      return NextResponse.json({ error: 'Dostop zavrnjen' }, { status: 403 })
    }

    const { id } = await params

    const existing = await prisma.pickupWindow.findFirst({
      where: { id, farm: { userId: session!.user!.id } },
    })
    if (!existing) {
      return NextResponse.json({ error: 'Termin ni najden' }, { status: 404 })
    }

    await prisma.pickupWindow.delete({ where: { id } })

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('PickupWindow DELETE error:', error)
    return NextResponse.json(
      { error: getErrorMessage(error, 'Napaka pri brisanju termina') },
      { status: 500 }
    )
  }
}