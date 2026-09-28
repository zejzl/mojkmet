import { getErrorMessage } from '@/lib/errors'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSessionOrError } from '@/lib/auth-helpers'
import { pickupChangeActionSchema, parseJson } from '@/lib/validation'
import { notifyPickupChangeResolved } from '@/lib/pickup-mail'
import { PICKUP_TIME_ZONE } from '@/lib/pickup-slots'

export const dynamic = 'force-dynamic'

function formatSlotLabel(start: Date): string {
  return new Intl.DateTimeFormat('sl-SI', {
    timeZone: PICKUP_TIME_ZONE,
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit',
  }).format(start)
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string; changeId: string }> }
) {
  try {
    const { session, error } = await getSessionOrError()
    if (error) return error
    const userId = session!.user!.id

    const { id, changeId } = await params

    const parsed = await parseJson(pickupChangeActionSchema, request)
    if (!parsed.ok) return parsed.error
    const { action } = parsed.data

    const change = await prisma.pickupChange.findUnique({
      where: { id: changeId },
      include: {
        order: {
          include: {
            farm: { select: { id: true, name: true, userId: true, user: { select: { email: true } } } },
            user: { select: { id: true, email: true } },
          },
        },
      },
    })

    if (!change || change.orderId !== id) {
      return NextResponse.json({ error: 'Predlog ni najden' }, { status: 404 })
    }

    const isFarmer = change.order.farm.userId === userId
    const isConsumer = change.order.userId === userId
    if (!isFarmer && !isConsumer) {
      return NextResponse.json({ error: 'Dostop zavrnjen' }, { status: 403 })
    }

    const creatorIsFarmer = change.requestedBy === 'FARMER'

    if (action === 'CANCEL') {
      const isCreator =
        (creatorIsFarmer && isFarmer) || (!creatorIsFarmer && isConsumer)
      if (!isCreator) {
        return NextResponse.json({ error: 'Le predlagatelj lahko prekliče predlog.' }, { status: 403 })
      }
      const updated = await prisma.pickupChange.update({
        where: { id: changeId },
        data: { status: 'CANCELLED', respondedAt: new Date() },
      })
      return NextResponse.json({ change: updated })
    }

    if (change.status !== 'PROPOSED') {
      return NextResponse.json({ error: 'Predlog ni več aktiven.' }, { status: 400 })
    }

    if (action === 'ACCEPT') {
      // Sprejme lahko le druga stran (tista, ki ni predlagala)
      if ((creatorIsFarmer && !isConsumer) || (!creatorIsFarmer && !isFarmer)) {
        return NextResponse.json({ error: 'Dostop zavrnjen' }, { status: 403 })
      }
      if (change.proposedStart.getTime() <= Date.now()) {
        return NextResponse.json(
          { error: 'Predlagan termin je že v preteklosti.' },
          { status: 400 }
        )
      }

      const result = await prisma.$transaction(async (tx) => {
        const updated = await tx.pickupChange.update({
          where: { id: changeId },
          data: { status: 'ACCEPTED', respondedAt: new Date() },
        })
        await tx.order.update({
          where: { id: change.orderId },
          data: { pickupStartsAt: change.proposedStart, pickupEndsAt: change.proposedEnd },
        })
        return updated
      })

      try {
        const orderShort = change.order.id.slice(-6).toUpperCase()
        const baseUrl = process.env.NEXTAUTH_URL || 'https://mojkmet.eu'
        await notifyPickupChangeResolved({
          to: creatorIsFarmer ? change.order.user.email : change.order.farm.user.email,
          orderShort,
          farmName: change.order.farm.name,
          action: 'ACCEPT',
          proposed: formatSlotLabel(change.proposedStart),
          dashboardUrl: creatorIsFarmer
            ? `${baseUrl}/dashboard/orders`
            : `${baseUrl}/dashboard/farmer/orders`,
        })
      } catch (mailErr) {
        console.error('Pickup accept email failed:', mailErr)
      }

      return NextResponse.json({ change: result })
    }

    // REJECT
    if ((creatorIsFarmer && !isConsumer) || (!creatorIsFarmer && !isFarmer)) {
      return NextResponse.json({ error: 'Dostop zavrnjen' }, { status: 403 })
    }

    const updated = await prisma.pickupChange.update({
      where: { id: changeId },
      data: { status: 'REJECTED', respondedAt: new Date() },
    })

    try {
      const orderShort = change.order.id.slice(-6).toUpperCase()
      const baseUrl = process.env.NEXTAUTH_URL || 'https://mojkmet.eu'
      await notifyPickupChangeResolved({
        to: creatorIsFarmer ? change.order.user.email : change.order.farm.user.email,
        orderShort,
        farmName: change.order.farm.name,
        action: 'REJECT',
        proposed: formatSlotLabel(change.proposedStart),
        dashboardUrl: creatorIsFarmer
          ? `${baseUrl}/dashboard/orders`
          : `${baseUrl}/dashboard/farmer/orders`,
      })
    } catch (mailErr) {
      console.error('Pickup reject email failed:', mailErr)
    }

    return NextResponse.json({ change: updated })
  } catch (err) {
    console.error('PickupChange respond error:', err)
    return NextResponse.json(
      { error: getErrorMessage(err, 'Napaka pri obdelavi predloga') },
      { status: 500 }
    )
  }
}