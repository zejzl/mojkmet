import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'
import { getPaymentProvider } from './index'

// Lazy sweep for expired stock holds (unpaid orders).
// Runs on read paths (order GET, dashboard orders) instead of a worker.
export async function expireAwaitingOrder(orderId: string): Promise<void> {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    select: {
      id: true,
      status: true,
      paymentRef: true,
      reservedUntil: true,
      items: { select: { productId: true, quantity: true } },
    },
  })

  if (!order || order.status !== 'AWAITING_PAYMENT' || !order.paymentRef) return
  if (order.reservedUntil && order.reservedUntil.getTime() > Date.now()) return

  let providerStatus: string
  try {
    providerStatus = (await getPaymentProvider().status(order.paymentRef)).status
  } catch {
    return // ponudnik nedosegljiv - ponovni poskus kasneje
  }

  if (providerStatus === 'paid') return // webhook bo nastavil status
  if (providerStatus !== 'expired' && providerStatus !== 'cancelled') return

  await prisma.$transaction(async (tx) => {
    for (const item of order.items) {
      await tx.product.update({
        where: { id: item.productId },
        data: { stock: { increment: item.quantity } },
      })
    }
    await tx.order.update({
      where: { id: order.id },
      data: { status: 'CANCELLED', paymentStatus: 'FAILED', reservedUntil: null },
    })
  })
}

export async function sweepExpiredOrders(filter: { userId?: string; farmId?: string }): Promise<void> {
  const where: Prisma.OrderWhereInput = {
    status: 'AWAITING_PAYMENT',
    reservedUntil: { lt: new Date() },
  }
  if (filter.userId) where.userId = filter.userId
  if (filter.farmId) where.farmId = filter.farmId

  const stale = await prisma.order.findMany({
    where,
    select: { id: true },
    take: 50,
  })

  await Promise.all(stale.map((o) => expireAwaitingOrder(o.id)))
}