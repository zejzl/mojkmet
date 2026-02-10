import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSessionOrError } from '@/lib/auth-helpers'

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

    const body = await request.json()
    const { name, description, price, unit, stock, categoryId, available } = body

    const updated = await prisma.product.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(description !== undefined && { description }),
        ...(price !== undefined && { price: parseFloat(price) }),
        ...(unit !== undefined && { unit }),
        ...(stock !== undefined && { stock: parseInt(stock) }),
        ...(categoryId !== undefined && { categoryId }),
        ...(available !== undefined && { available }),
      },
    })

    return NextResponse.json({ product: updated })
  } catch (error: any) {
    console.error('Product PUT error:', error)
    return NextResponse.json({ error: error.message || 'Napaka pri posodabljanju' }, { status: 500 })
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
  } catch (error: any) {
    console.error('Product DELETE error:', error)
    return NextResponse.json({ error: error.message || 'Napaka pri brisanju' }, { status: 500 })
  }
}
