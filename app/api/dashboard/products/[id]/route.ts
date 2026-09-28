import { getErrorMessage } from '@/lib/errors'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSessionOrError } from '@/lib/auth-helpers'
import { productUpdateSchema, parseJson } from '@/lib/validation'

export const dynamic = 'force-dynamic'

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { session, error } = await getSessionOrError()
    if (error) return error

    const { id } = await params

    // Verify ownership
    const product = await prisma.product.findUnique({
      where: { id },
      include: { farm: { select: { userId: true } } },
    })

    if (!product || product.farm.userId !== session!.user!.id) {
      return NextResponse.json({ error: 'Izdelek ni najden ali nimate dostopa' }, { status: 404 })
    }

    const parsed = await parseJson(productUpdateSchema, request)
    if (!parsed.ok) return parsed.error

    const { name, description, price, unit, stock, categoryId, available } = parsed.data

    if (Object.keys(parsed.data).length === 0) {
      return NextResponse.json({ error: 'Ni podatkov za posodobitev' }, { status: 400 })
    }

    const updated = await prisma.product.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(description !== undefined && { description: description || null }),
        ...(price !== undefined && { price }),
        ...(unit !== undefined && { unit }),
        ...(stock !== undefined && { stock }),
        ...(categoryId !== undefined && { categoryId }),
        ...(available !== undefined && { available }),
      },
    })

    return NextResponse.json({ product: updated })
  } catch (error) {
    console.error('Product PUT error:', error)
    return NextResponse.json(
      { error: getErrorMessage(error, 'Napaka pri posodabljanju') },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { session, error } = await getSessionOrError()
    if (error) return error

    const { id } = await params

    const product = await prisma.product.findUnique({
      where: { id },
      include: { farm: { select: { userId: true } } },
    })

    if (!product || product.farm.userId !== session!.user!.id) {
      return NextResponse.json({ error: 'Izdelek ni najden ali nimate dostopa' }, { status: 404 })
    }

    await prisma.product.delete({ where: { id } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Product DELETE error:', error)
    return NextResponse.json({ error: getErrorMessage(error, 'Napaka pri brisanju') }, { status: 500 })
  }
}
