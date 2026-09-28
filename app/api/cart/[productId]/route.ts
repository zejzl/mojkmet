import { getErrorMessage } from '@/lib/errors'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSessionOrError } from '@/lib/auth-helpers'
import { getHydratedCart } from '@/lib/cart'
import { cartUpdateSchema, parseJson } from '@/lib/validation'

export const dynamic = 'force-dynamic'

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ productId: string }> }
) {
  try {
    const { session, error } = await getSessionOrError()
    if (error) return error
    const userId = session!.user!.id
    const { productId } = await params

    const parsed = await parseJson(cartUpdateSchema, request)
    if (!parsed.ok) return parsed.error

    const existing = await prisma.cartItem.findUnique({
      where: { userId_productId: { userId, productId } },
      select: { id: true, product: { select: { stock: true } } },
    })
    if (!existing) {
      return NextResponse.json({ error: 'Izdelek ni v košarici' }, { status: 404 })
    }

    const quantity = Math.min(parsed.data.quantity, Math.max(existing.product.stock, 0))
    if (quantity < 1) {
      return NextResponse.json({ error: 'Izdelek je razprodan' }, { status: 400 })
    }

    await prisma.cartItem.update({ where: { id: existing.id }, data: { quantity } })

    const items = await getHydratedCart(userId)
    return NextResponse.json({ items })
  } catch (err) {
    console.error('Cart PATCH error:', err)
    return NextResponse.json({ error: getErrorMessage(err, 'Napaka pri posodabljanju košarice') }, { status: 500 })
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ productId: string }> }
) {
  try {
    const { session, error } = await getSessionOrError()
    if (error) return error
    const userId = session!.user!.id
    const { productId } = await params

    await prisma.cartItem.deleteMany({ where: { userId, productId } })

    const items = await getHydratedCart(userId)
    return NextResponse.json({ items })
  } catch (err) {
    console.error('Cart item DELETE error:', err)
    return NextResponse.json({ error: getErrorMessage(err, 'Napaka pri odstranjevanju izdelka') }, { status: 500 })
  }
}
