import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSessionOrError } from '@/lib/auth-helpers'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const { session, error } = await getSessionOrError()
    if (error) return error

    const userId = session!.user!.id
    const role = session!.user!.role
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '20')

    if (role === 'FARMER') {
      // Get farmer's farm
      const farm = await prisma.farm.findUnique({
        where: { userId },
        select: { id: true },
      })

      if (!farm) {
        return NextResponse.json({ orders: [] })
      }

      // Get orders that contain this farmer's products
      const orderItems = await prisma.orderItem.findMany({
        where: { product: { farmId: farm.id } },
        include: {
          product: { select: { name: true, unit: true } },
          order: {
            include: {
              user: { select: { name: true, email: true } },
            },
          },
        },
        orderBy: { order: { createdAt: 'desc' } },
        take: limit,
      })

      // Group by order
      const orderMap = new Map<string, any>()
      for (const item of orderItems) {
        if (!orderMap.has(item.orderId)) {
          orderMap.set(item.orderId, {
            id: item.order.id,
            status: item.order.status,
            totalAmount: item.order.totalAmount,
            deliveryAddress: item.order.deliveryAddress,
            deliveryCity: item.order.deliveryCity,
            phone: item.order.phone,
            notes: item.order.notes,
            createdAt: item.order.createdAt,
            buyer: item.order.user,
            items: [],
          })
        }
        orderMap.get(item.orderId).items.push({
          id: item.id,
          productName: item.product.name,
          quantity: item.quantity,
          price: item.price,
          unit: item.product.unit,
        })
      }

      return NextResponse.json({ orders: Array.from(orderMap.values()) })
    }

    // Consumer orders
    const orders = await prisma.order.findMany({
      where: { userId },
      include: {
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
        totalAmount: order.totalAmount,
        deliveryCity: order.deliveryCity,
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
  } catch (error: any) {
    console.error('Orders error:', error)
    return NextResponse.json({ error: error.message || 'Napaka pri pridobivanju narocil' }, { status: 500 })
  }
}
