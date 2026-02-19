import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSessionOrError } from '@/lib/auth-helpers'

export const dynamic = 'force-dynamic'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { session, error } = await getSessionOrError()
    if (error) return error

    const { id } = await params

    const order = await prisma.order.findUnique({
      where: { id },
      include: {
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
      return NextResponse.json({ error: 'Narocilo ni najdeno' }, { status: 404 })
    }

    // Preveri lastnistvo - samo lastnik narocila ga lahko vidi
    if (order.userId !== session!.user!.id) {
      return NextResponse.json({ error: 'Dostop zavrnjen' }, { status: 403 })
    }

    return NextResponse.json({
      order: {
        id: order.id,
        status: order.status,
        totalAmount: order.totalAmount,
        deliveryAddress: order.deliveryAddress,
        deliveryCity: order.deliveryCity,
        deliveryPostal: order.deliveryPostal,
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
  } catch (err: any) {
    console.error('Order GET error:', err)
    return NextResponse.json({ error: err.message || 'Napaka' }, { status: 500 })
  }
}

// PATCH - posodobitev statusa (samo za kmete in admine)
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { session, error } = await getSessionOrError()
    if (error) return error

    const { id } = await params
    const body = await request.json()
    const { status } = body

    const validStatuses = ['PENDING', 'CONFIRMED', 'PREPARING', 'READY', 'DELIVERED', 'CANCELLED']
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: 'Neveljaven status' }, { status: 400 })
    }

    // Preveri, ce kmet ima pravico posodobiti to narocilo
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
        return NextResponse.json({ error: 'Narocilo ne vsebuje vasih izdelkov' }, { status: 403 })
      }
    } else if (session!.user!.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Dostop zavrnjen' }, { status: 403 })
    }

    const updated = await prisma.order.update({
      where: { id },
      data: { status },
    })

    return NextResponse.json({ order: updated })
  } catch (err: any) {
    console.error('Order PATCH error:', err)
    return NextResponse.json({ error: err.message || 'Napaka' }, { status: 500 })
  }
}
