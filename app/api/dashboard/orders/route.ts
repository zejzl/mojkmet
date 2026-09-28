import { getErrorMessage } from '@/lib/errors'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSessionOrError } from '@/lib/auth-helpers'
import { sweepExpiredOrders } from '@/lib/payments/reconcile'
import type { Order } from '@/types/api'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const { session, error } = await getSessionOrError()
    if (error) return error

    const userId = session!.user!.id
    const role = session!.user!.role
    const { searchParams } = new URL(request.url)
    const rawLimit = Number(searchParams.get('limit') || '20')
    const limit = Number.isFinite(rawLimit) ? Math.min(Math.max(Math.floor(rawLimit), 1), 100) : 20

    if (role === 'FARMER') {
      // Get farmer's farm
      const farm = await prisma.farm.findUnique({
        where: { userId },
        select: { id: true },
      })

      if (!farm) {
        return NextResponse.json({ orders: [] })
      }

      // Lazy sweep neplacanih zadrzkov pred prikazom
      await sweepExpiredOrders({ farmId: farm.id })

      // Get orders that contain this farmer's products
      const orderItems = await prisma.orderItem.findMany({
        where: { product: { farmId: farm.id } },
        include: {
          product: { select: { name: true, unit: true } },
          order: {
            include: {
              farm: { select: { name: true } },
              user: { select: { name: true, email: true } },
            },
          },
        },
        orderBy: { order: { createdAt: 'desc' } },
        take: limit * 8,
      })

      // Group by order
      const orderMap = new Map<string, Order>()
      for (const item of orderItems) {
        if (!orderMap.has(item.orderId)) {
          orderMap.set(item.orderId, {
            id: item.order.id,
            status: item.order.status,
            subtotal: item.order.subtotal.toNumber(),
            farmName: item.order.farm?.name || '',
            pickupStartsAt: item.order.pickupStartsAt,
            pickupEndsAt: item.order.pickupEndsAt,
            notes: item.order.notes,
            createdAt: item.order.createdAt,
            buyer: item.order.user,
            items: [],
          })
        }
        orderMap.get(item.orderId)!.items.push({
          id: item.id,
          productName: item.product.name,
          quantity: item.quantity,
          price: item.price,
          unit: item.product.unit,
        })
      }

      return NextResponse.json({ orders: Array.from(orderMap.values()) })
    }

    // Lazy sweep neplacanih zadrzkov pred prikazom
    await sweepExpiredOrders({ userId })

    // Consumer orders
    const orders = await prisma.order.findMany({
      where: { userId },
      include: {
        farm: { select: { name: true } },
        items: {
          include: {
            product: {
              select: { name: true, unit: true, farm: { select: { name: true } } },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    })

    return NextResponse.json({
      orders: orders.map((order) => ({
        id: order.id,
        status: order.status,
        subtotal: order.subtotal.toNumber(),
        farmName: order.farm.name,
        pickupStartsAt: order.pickupStartsAt,
        pickupEndsAt: order.pickupEndsAt,
        createdAt: order.createdAt,
        items: order.items.map((item) => ({
          id: item.id,
          productName: item.product.name,
          farmName: item.product.farm.name,
          quantity: item.quantity,
          price: item.price,
          unit: item.product.unit,
        })),
      })),
    })
  } catch (error) {
    console.error('Orders error:', error)
    return NextResponse.json(
      { error: getErrorMessage(error, 'Napaka pri pridobivanju naročil') },
      { status: 500 }
    )
  }
}
