import { getErrorMessage } from '@/lib/errors'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSessionOrError } from '@/lib/auth-helpers'
import { orderSchema, parseJson } from '@/lib/validation'
import { getPaymentProvider, PaymentProviderError } from '@/lib/payments'
import { isPickupPeriodOpen, PICKUP_DURATION_MINUTES } from '@/lib/pickup-slots'
import { notifyOrderCreated, formatPickupLabel } from '@/lib/order-mail'

export const dynamic = 'force-dynamic'

export const STOCK_RESERVE_MINUTES = 15
export const PLATFORM_FEE_PERCENT = 0

export async function POST(request: Request) {
  try {
    const { session, error } = await getSessionOrError()
    if (error) return error

    const parsed = await parseJson(orderSchema, request)
    if (!parsed.ok) return parsed.error

    const { items, pickupStartsAt, pickupEndsAt, phone, notes } = parsed.data

    const pickupStart = new Date(pickupStartsAt)
    if (Number.isNaN(pickupStart.getTime()) || pickupStart.getTime() < Date.now()) {
      return NextResponse.json(
        { error: 'Termin prevzema mora biti v prihodnosti.' },
        { status: 400 }
      )
    }
    const pickupEnd = pickupEndsAt
      ? new Date(pickupEndsAt)
      : new Date(pickupStart.getTime() + PICKUP_DURATION_MINUTES * 60 * 1000)
    if (Number.isNaN(pickupEnd.getTime()) || pickupEnd.getTime() <= pickupStart.getTime()) {
      return NextResponse.json(
        { error: 'Veljaven konec termina prevzema.' },
        { status: 400 }
      )
    }
    const reservedUntil = new Date(Date.now() + STOCK_RESERVE_MINUTES * 60 * 1000)

    // Preveri zaloge, cene in kmetijo izdelkov iz DB
    const productIds = items.map((i) => i.productId)
    const products = await prisma.product.findMany({
      where: { id: { in: productIds }, available: true },
      select: { id: true, price: true, stock: true, name: true, farmId: true },
    })

    const productMap = new Map(products.map((p) => [p.id, p]))

    for (const item of items) {
      const product = productMap.get(item.productId)
      if (!product) {
        return NextResponse.json({ error: `Izdelek ni na voljo` }, { status: 400 })
      }
      if (product.stock < item.quantity) {
        return NextResponse.json({ error: `Nezadostna zaloga za ${product.name}` }, { status: 400 })
      }
    }

    // Eno naročilo = ena kmetija; ostalo pusti v košarici
    const farmIds = new Set(products.map((p) => p.farmId))
    if (farmIds.size > 1) {
      return NextResponse.json(
        { error: 'Naročilo lahko vsebuje izdelke samo iz ene kmetije. Ostale izdelke pustite v košarici.' },
        { status: 400 }
      )
    }
    const farmId = products[0].farmId

    // Preveri prevzemne termine kmetije in minimalno vrednost naročila
    const [farm, windows] = await Promise.all([
      prisma.farm.findUnique({
        where: { id: farmId },
        select: { minOrder: true, name: true },
      }),
      prisma.pickupWindow.findMany({
        where: { farmId, active: true },
        select: { id: true, dayOfWeek: true, startTime: true, endTime: true, active: true },
      }),
    ])

    if (windows.length > 0 && !isPickupPeriodOpen(pickupStart, pickupEnd, windows)) {
      return NextResponse.json(
        { error: 'Izbrani termin prevzema ni odprt za prevzem.' },
        { status: 400 }
      )
    }

    // Izracunaj skupni znesek z aktualnimi cenami iz DB ter provizijo platforme
    // (zneski v centih za natancno aritmetiko brez zaokrozevalnih napak)
    let subtotalCents = 0
    const orderItems = items.map((item) => {
      const product = productMap.get(item.productId)!
      const lineCents = Math.round(product.price * item.quantity * 100)
      subtotalCents += lineCents
      return {
        productId: item.productId,
        quantity: item.quantity,
        price: product.price,
      }
    })
    const subtotal = subtotalCents / 100
    const platformFeeCents = Math.round(subtotalCents * (PLATFORM_FEE_PERCENT / 100))
    const platformFee = platformFeeCents / 100
    const payoutAmount = (subtotalCents - platformFeeCents) / 100

    const minOrder = farm?.minOrder ? farm.minOrder.toNumber() : null
    if (minOrder !== null && minOrder > 0 && subtotal < minOrder) {
      return NextResponse.json(
        { error: `Kmetija ima minimalno vrednost naročila ${minOrder.toFixed(2)} EUR.` },
        { status: 400 }
      )
    }

    // Ustvari naročilo v transakciji
    const order = await prisma.$transaction(async (tx) => {
      // Zmanjsaj zaloge (zadržek ob oddaji, sproščeno z lazy sweep po expiry)
      for (const item of items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        })
      }

      return tx.order.create({
        data: {
          userId: session!.user!.id,
          farmId,
          subtotal,
          platformFee,
          payoutAmount,
          pickupStartsAt: pickupStart,
          pickupEndsAt: pickupEnd,
          reservedUntil,
          phone,
          notes: notes || null,
          items: {
            create: orderItems,
          },
        },
        include: {
          items: {
            include: {
              product: { select: { name: true, unit: true } },
            },
          },
        },
      })
    })

    // Sprozi plačilo pri ponudniku. Če iniciacija spodleti, naročilo preklicemo
    // in sprostimo zadržano zalogo.
    const amountCents = subtotalCents + platformFeeCents
    let paymentUrl: string | null = null
    try {
      const baseUrl = process.env.NEXTAUTH_URL || 'https://mojkmet.eu'
      const initiation = await getPaymentProvider().initiate({
        orderId: order.id,
        amountCents,
        idempotencyKey: order.id,
        webhookUrl: `${baseUrl}/api/webhooks/payments`,
        returnUrl: `${baseUrl}/payment/result?order=${encodeURIComponent(order.id)}`,
      })
      paymentUrl = initiation.paymentUrl

      await prisma.order.update({
        where: { id: order.id },
        data: {
          paymentProvider: getPaymentProvider().name,
          paymentRef: initiation.paymentRef,
          paymentStatus: 'PROCESSING',
        },
      })
    } catch (err) {
      console.error('Payment initiation failed, cancelling order:', err)
      await prisma.$transaction(async (tx) => {
        for (const item of items) {
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
      return NextResponse.json(
        {
          error:
            err instanceof PaymentProviderError
              ? err.message
              : 'Plačilni ponudnik ni dosegljiv. Poskusite znova.',
        },
        { status: 502 }
      )
    }

    const orderPayload = {
      id: order.id,
      status: order.status,
      subtotal: order.subtotal.toNumber(),
      platformFee: order.platformFee.toNumber(),
      payoutAmount: order.payoutAmount.toNumber(),
      pickupStartsAt: order.pickupStartsAt,
      pickupEndsAt: order.pickupEndsAt,
    }

    // Obvestilo kupcu, da je naročilo oddano in čaka na plačilo (best-effort)
    try {
      const consumerEmail = session?.user?.email
      if (consumerEmail) {
        const baseUrl = process.env.NEXTAUTH_URL || 'https://mojkmet.eu'
        await notifyOrderCreated({
          to: consumerEmail,
          orderShort: order.id.slice(-6).toUpperCase(),
          farmName: farm?.name || 'Kmetija',
          items: order.items.map((item) => ({
            name: item.product.name,
            quantity: item.quantity,
            unit: item.product.unit,
            price: item.price,
          })),
          subtotal,
          pickupLabel: formatPickupLabel(order.pickupStartsAt),
          payUrl: paymentUrl || `${baseUrl}/payment/result?order=${encodeURIComponent(order.id)}`,
          dashboardUrl: `${baseUrl}/dashboard/orders`,
        })
      }
    } catch (mailErr) {
      console.error('Order confirmation email failed (order still created):', mailErr)
    }

    return NextResponse.json({
      orderId: order.id,
      order: orderPayload,
      paymentStatus: 'PROCESSING',
      paymentUrl,
    })
  } catch (err) {
    console.error('Orders POST error:', err)
    return NextResponse.json(
      { error: getErrorMessage(err, 'Napaka pri oddaji naročila') },
      { status: 500 }
    )
  }
}