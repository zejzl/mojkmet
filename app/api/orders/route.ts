import { getErrorMessage } from '@/lib/errors'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSessionOrError } from '@/lib/auth-helpers'

export const dynamic = 'force-dynamic'

type OrderItemInput = { productId: string; quantity: number }

type CreateOrderBody = {
  items: OrderItemInput[]
  deliveryAddress: string
  deliveryCity: string
  deliveryPostal: string
  phone: string
  notes?: string
}

export async function POST(request: Request) {
  try {
    const { session, error } = await getSessionOrError()
    if (error) return error

    const body = (await request.json()) as Partial<CreateOrderBody>
    const { items, deliveryAddress, deliveryCity, deliveryPostal, phone, notes } = body

    // Validacija
    if (!deliveryAddress || !deliveryCity || !deliveryPostal || !phone) {
      return NextResponse.json(
        { error: 'Naslov, mesto, postna stevilka in telefon so obvezni' },
        { status: 400 }
      )
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Košarica je prazna' }, { status: 400 })
    }

    // Validacija kolicin - pozitivna celo stevila, razumen zgornji limit
    for (const item of items) {
      if (
        !item.productId ||
        !Number.isInteger(item.quantity) ||
        item.quantity < 1 ||
        item.quantity > 999
      ) {
        return NextResponse.json({ error: 'Neveljavna količina' }, { status: 400 })
      }
    }

    // Preveri zaloge in pridobi aktualne cene iz DB
    const productIds = items.map((i) => i.productId)
    const products = await prisma.product.findMany({
      where: { id: { in: productIds }, available: true },
      select: { id: true, price: true, stock: true, name: true },
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

    // Izračunaj skupni znesek z aktualnimi cenami iz DB
    let totalAmount = 0
    const orderItems = items.map((item) => {
      const product = productMap.get(item.productId)!
      const lineTotal = product.price * item.quantity
      totalAmount += lineTotal
      return {
        productId: item.productId,
        quantity: item.quantity,
        price: product.price,
      }
    })

    // PLACEHOLDER: Stripe plačilo bi bilo tukaj
    // const paymentIntent = await stripe.paymentIntents.create({ amount: Math.round(totalAmount * 100), currency: 'eur' })

    // Ustvari naročilo v transakciji
    const order = await prisma.$transaction(async (tx) => {
      // Zmanjsaj zaloge
      for (const item of items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        })
      }

      // Ustvari naročilo
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
  } catch (err) {
    console.error('Orders POST error:', err)
    return NextResponse.json(
      { error: getErrorMessage(err, 'Napaka pri oddaji naročila') },
      { status: 500 }
    )
  }
}
