import { getErrorMessage } from '@/lib/errors'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSessionOrError } from '@/lib/auth-helpers'
import { getHydratedCart } from '@/lib/cart'
import { cartAddSchema, parseJson } from '@/lib/validation'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const { session, error } = await getSessionOrError()
    if (error) return error

    const items = await getHydratedCart(session!.user!.id)
    return NextResponse.json({ items })
  } catch (err) {
    console.error('Cart GET error:', err)
    return NextResponse.json({ error: getErrorMessage(err, 'Napaka pri nalaganju košarice') }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { session, error } = await getSessionOrError()
    if (error) return error
    const userId = session!.user!.id

    const parsed = await parseJson(cartAddSchema, request)
    if (!parsed.ok) return parsed.error
    const { productId, quantity } = parsed.data

    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { available: true, stock: true },
    })
    if (!product || !product.available) {
      return NextResponse.json({ error: 'Izdelek ni na voljo' }, { status: 400 })
    }

    const existing = await prisma.cartItem.findUnique({
      where: { userId_productId: { userId, productId } },
      select: { quantity: true },
    })
    const targetQuantity = Math.min((existing?.quantity || 0) + (quantity || 1), Math.max(product.stock, 0))

    if (targetQuantity < 1) {
      return NextResponse.json({ error: 'Izdelek je razprodan' }, { status: 400 })
    }

    await prisma.cartItem.upsert({
      where: { userId_productId: { userId, productId } },
      create: { userId, productId, quantity: targetQuantity },
      update: { quantity: targetQuantity },
    })

    const items = await getHydratedCart(userId)
    return NextResponse.json({ items })
  } catch (err) {
    console.error('Cart POST error:', err)
    return NextResponse.json({ error: getErrorMessage(err, 'Napaka pri dodajanju v košarico') }, { status: 500 })
  }
}

export async function DELETE() {
  try {
    const { session, error } = await getSessionOrError()
    if (error) return error

    await prisma.cartItem.deleteMany({ where: { userId: session!.user!.id } })
    return NextResponse.json({ items: [] })
  } catch (err) {
    console.error('Cart DELETE error:', err)
    return NextResponse.json({ error: getErrorMessage(err, 'Napaka pri praznjenju košarice') }, { status: 500 })
  }
}
