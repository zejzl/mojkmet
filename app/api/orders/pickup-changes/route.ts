import { getErrorMessage } from '@/lib/errors'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSessionOrError } from '@/lib/auth-helpers'
import { pickupChangeSchema, parseJson } from '@/lib/validation'
import { notifyNewPickupProposal } from '@/lib/pickup-mail'
import { PICKUP_TIME_ZONE } from '@/lib/pickup-slots'

export const dynamic = 'force-dynamic'

const CHANGEABLE_STATUSES = ['PAID', 'ACCEPTED', 'READY']

function formatSlotLabel(start: Date): string {
  const fmt = new Intl.DateTimeFormat('sl-SI', {
    timeZone: PICKUP_TIME_ZONE,
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit',
  })
  return fmt.format(start)
}

export async function POST(request: Request) {
  try {
    const { session, error } = await getSessionOrError()
    if (error) return error
    const userId = session!.user!.id

    const parsed = await parseJson(pickupChangeSchema, request)
    if (!parsed.ok) return parsed.error

    const { orderId, requestedBy, proposedStart, proposedEnd, reason } = parsed.data

    const proposed = {
      start: new Date(proposedStart),
      end: new Date(proposedEnd),
    }
    if (
      Number.isNaN(proposed.start.getTime()) ||
      Number.isNaN(proposed.end.getTime()) ||
      proposed.end.getTime() <= proposed.start.getTime()
    ) {
      return NextResponse.json({ error: 'Neveljaven predlagan termin.' }, { status: 400 })
    }
    if (proposed.start.getTime() <= Date.now()) {
      return NextResponse.json(
        { error: 'Predlagan termin mora biti v prihodnosti.' },
        { status: 400 }
      )
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        farm: { select: { id: true, name: true, userId: true, user: { select: { email: true } } } },
        user: { select: { id: true, email: true, name: true } },
      },
    })
    if (!order) {
      return NextResponse.json({ error: 'Naročilo ni najdeno' }, { status: 404 })
    }

    const isFarmer = order.farm.userId === userId
    const isConsumer = order.userId === userId

    if (requestedBy === 'FARMER' && !isFarmer) {
      return NextResponse.json(
        { error: 'Le kmetija tega naročila lahko predlaga spremembo.' },
        { status: 403 }
      )
    }
    if (requestedBy === 'CONSUMER' && !isConsumer) {
      return NextResponse.json({ error: 'Dostop zavrnjen' }, { status: 403 })
    }

    if (!CHANGEABLE_STATUSES.includes(order.status)) {
      return NextResponse.json(
        { error: 'Spremembo termina lahko predlagate samo za plačana/pripravljena naročila.' },
        { status: 400 }
      )
    }

    // Eno aktivno predlagano spremembo na naročilo (unique [orderId, PROPOSED])
    const change = await prisma.$transaction(async (tx) => {
      await tx.pickupChange.updateMany({
        where: { orderId, status: 'PROPOSED' },
        data: { status: 'CANCELLED', respondedAt: new Date() },
      })

      return tx.pickupChange.create({
        data: {
          orderId,
          requestedBy,
          currentStart: order.pickupStartsAt,
          currentEnd: order.pickupEndsAt,
          proposedStart: proposed.start,
          proposedEnd: proposed.end,
          reason: reason || null,
          status: 'PROPOSED',
        },
      })
    })

    // Obvesti drugo stran (neuspeh e-pošte ne sme podreti zahteve)
    const orderShort = order.id.slice(-6).toUpperCase()
    const baseUrl = process.env.NEXTAUTH_URL || 'https://mojkmet.eu'
    const proposedLabel = formatSlotLabel(proposed.start)
    try {
      if (requestedBy === 'FARMER') {
        await notifyNewPickupProposal({
          to: order.user.email,
          orderShort,
          farmName: order.farm.name,
          proposerLabel: `Kmetija ${order.farm.name}`,
          proposed: proposedLabel,
          reason,
          dashboardUrl: `${baseUrl}/dashboard/orders`,
          responseHint:
            'Prosimo, da predlog potrdite ali zavrnete v svoji nadzorni plošči.',
        })
      } else {
        await notifyNewPickupProposal({
          to: order.farm.user.email,
          orderShort,
          farmName: order.farm.name,
          proposerLabel:
            order.user.name || order.user.email || 'Kupec',
          proposed: proposedLabel,
          reason,
          dashboardUrl: `${baseUrl}/dashboard/farmer/orders`,
          responseHint:
            'Prosimo, da predlog potrdite ali zavrnete v svoji nadzorni plošči.',
        })
      }
    } catch (mailErr) {
      console.error('Pickup proposal email failed:', mailErr)
    }

    return NextResponse.json({ change }, { status: 201 })
  } catch (err) {
    console.error('PickupChange POST error:', err)
    return NextResponse.json(
      { error: getErrorMessage(err, 'Napaka pri ustvarjanju predloga') },
      { status: 500 }
    )
  }
}