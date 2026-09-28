import { getErrorMessage } from '@/lib/errors'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSessionOrError } from '@/lib/auth-helpers'
import { orderStatusSchema, parseJson } from '@/lib/validation'
import { expireAwaitingOrder } from '@/lib/payments/reconcile'

export const dynamic = 'force-dynamic'

const VALID_STATUSES = [
  'AWAITING_PAYMENT',
  'PAID',
  'ACCEPTED',
  'READY',
  'COLLECTED',
  'COMPLETED',
  'CANCELLED',
  'REFUNDED',
] as const

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { session, error } = await getSessionOrError()
    if (error) return error

    const { id } = await params

    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        farm: { select: { id: true, name: true, city: true, address: true } },
        items: {
          include: {
            product: {
              select: {
                name: true,
                unit: true,
                farm: { select: { name: true } },
              },
            },
          },
        },
      },
    })

    if (!order) {
      return NextResponse.json({ error: 'Naročilo ni najdeno' }, { status: 404 })
    }

    // Preveri lastništvo - samo lastnik naročila ga lahko vidi
    if (order.userId !== session!.user!.id) {
      return NextResponse.json({ error: 'Dostop zavrnjen' }, { status: 403 })
    }

    // Lazy sweep: pretekla rezervacija preveri pri ponudniku in prekliče
    await expireAwaitingOrder(id)

    return NextResponse.json({
      order: {
        id: order.id,
        status: order.status,
        subtotal: order.subtotal.toNumber(),
        platformFee: order.platformFee.toNumber(),
        payoutAmount: order.payoutAmount.toNumber(),
        paymentStatus: order.paymentStatus,
        paymentProvider: order.paymentProvider,
        paymentRef: order.paymentRef,
        paidAt: order.paidAt,
        farmName: order.farm.name,
        farmCity: order.farm.city,
        pickupStartsAt: order.pickupStartsAt,
        pickupEndsAt: order.pickupEndsAt,
        phone: order.phone,
        notes: order.notes,
        createdAt: order.createdAt,
        items: order.items.map((item) => ({
          id: item.id,
          productName: item.product.name,
          farmName: item.product.farm.name,
          quantity: item.quantity,
          price: item.price,
          unit: item.product.unit,
        })),
      },
    })
  } catch (err) {
    console.error('Order GET error:', err)
    return NextResponse.json({ error: getErrorMessage(err, 'Napaka') }, { status: 500 })
  }
}

// PATCH - posodobitev statusa (samo za kmete in admine)
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { session, error } = await getSessionOrError()
    if (error) return error

    const { id } = await params

    const parsed = await parseJson(orderStatusSchema, request)
    if (!parsed.ok) return parsed.error

    const { status } = parsed.data

    if (!VALID_STATUSES.includes(status)) {
      return NextResponse.json({ error: 'Neveljaven status' }, { status: 400 })
    }

    // Preveri, ce kmet ima pravico posodobiti to naročilo
    if (session!.user!.role === 'FARMER') {
      const farm = await prisma.farm.findUnique({
        where: { userId: session!.user!.id },
        select: { id: true },
      })

      if (!farm) {
        return NextResponse.json({ error: 'Kmetija ni najdena' }, { status: 404 })
      }

      const orderItem = await prisma.orderItem.findFirst({
        where: {
          orderId: id,
          product: { farmId: farm.id },
        },
      })

      if (!orderItem) {
        return NextResponse.json({ error: 'Naročilo ne vsebuje vaših izdelkov' }, { status: 403 })
      }
    } else if (session!.user!.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Dostop zavrnjen' }, { status: 403 })
    }

    const updated = await prisma.order.update({
      where: { id },
      data: { status },
    })

    return NextResponse.json({
      order: {
        id: updated.id,
        status: updated.status,
        subtotal: updated.subtotal.toNumber(),
        platformFee: updated.platformFee.toNumber(),
        payoutAmount: updated.payoutAmount.toNumber(),
        pickupStartsAt: updated.pickupStartsAt,
        pickupEndsAt: updated.pickupEndsAt,
      },
    })
  } catch (err) {
    console.error('Order PATCH error:', err)
    return NextResponse.json({ error: getErrorMessage(err, 'Napaka') }, { status: 500 })
  }
}