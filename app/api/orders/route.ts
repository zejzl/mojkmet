import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSessionOrError } from '@/lib/auth-helpers'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    const { session, error } = await getSessionOrError()
    if (error) return error

    const body = await request.json()
    const { items, deliveryAddress, deliveryCity, deliveryPostal, phone, notes } = body

    // Validacija
    if (!deliveryAddress || !deliveryCity || !deliveryPostal || !phone) {
      return NextResponse.json(
        { error: 'Naslov, mesto, postna stevilka in telefon so obvezni' },
        { status: 400 }
      )
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Kosarca je prazna' }, { status: 400 })
    }

    // Preveri zaloge in pridobi aktualne cene iz DB
    const productIds = items.map((i: any) => i.productId)
    const products = await prisma.product.findMany({
      where: { id: { in: productIds }, available: true },
      select: { id: true, price: true, stock: true, name: true },
    })

    const productMap = new Map(products.map((p) => [p.id, p]))

    for (const item of items) {
      const product = productMap.get(item.productId)
      if (!product) {
        return NextResponse.json(
          { error: `Izdelek ni na voljo` },
          { status: 400 }
        )
      }
      if (product.stock < item.quantity) {
        return NextResponse.json(
          { error: `Nezadostna zaloga za ${product.name}` },
          { status: 400 }
        )
      }
    }

    // Izracunaj skupni znesek z aktualnimi cenami iz DB
    let totalAmount = 0
    const orderItems = items.map((item: any) => {
      const product = productMap.get(item.productId)!
      const lineTotal = product.price * item.quantity
      totalAmount += lineTotal
      return {
        productId: item.productId,
        quantity: item.quantity,
        price: product.price,
      }
    })

    // PLACEHOLDER: Stripe placilo bi bilo tukaj
    // const paymentIntent = await stripe.paymentIntents.create({ amount: Math.round(totalAmount * 100), currency: 'eur' })

    // Ustvari narocilo v transakciji
    const order = await prisma.$transaction(async (tx) => {
      // Zmanjsaj zaloge
      for (const item of items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        })
      }

      // Ustvari narocilo
      return tx.order.create({
        data: {
          userId: session!.user!.id,
          totalAmount,
          deliveryAddress,
          deliveryCity,
          deliveryPostal,
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

    return NextResponse.json({ orderId: order.id, order })
  } catch (err: any) {
    console.error('Orders POST error:', err)
    return NextResponse.json({ error: err.message || 'Napaka pri oddaji narocila' }, { status: 500 })
  }
}
