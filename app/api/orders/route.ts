import { getErrorMessage } from '@/lib/errors'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSessionOrError } from '@/lib/auth-helpers'
import { orderSchema, parseJson } from '@/lib/validation'

export const dynamic = 'force-dynamic'

export const PICKUP_DURATION_MINUTES = 30
export const STOCK_RESERVE_MINUTES = 15
export const PLATFORM_FEE_PERCENT = 0

export async function POST(request: Request) {
  try {
    const { session, error } = await getSessionOrError()
    if (error) return error

    const parsed = await parseJson(orderSchema, request)
    if (!parsed.ok) return parsed.error

    const { items, pickupStartsAt, phone, notes } = parsed.data

    const pickupStart = new Date(pickupStartsAt)
    if (Number.isNaN(pickupStart.getTime()) || pickupStart.getTime() < Date.now()) {
      return NextResponse.json(
        { error: 'Termin prevzema mora biti v prihodnosti.' },
        { status: 400 }
      )
    }
    const pickupEnd = new Date(pickupStart.getTime() + PICKUP_DURATION_MINUTES * 60 * 1000)
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

    // PLACEHOLDER: sproži plačilo pri ponudniku (Step 3)

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

    const orderPayload = {
      id: order.id,
      status: order.status,
      subtotal: order.subtotal.toNumber(),
      platformFee: order.platformFee.toNumber(),
      payoutAmount: order.payoutAmount.toNumber(),
      pickupStartsAt: order.pickupStartsAt,
      pickupEndsAt: order.pickupEndsAt,
    }

    return NextResponse.json({ orderId: order.id, order: orderPayload })
  } catch (err) {
    console.error('Orders POST error:', err)
    return NextResponse.json(
      { error: getErrorMessage(err, 'Napaka pri oddaji naročila') },
      { status: 500 }
    )
  }
}