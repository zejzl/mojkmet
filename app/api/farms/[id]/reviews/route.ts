import { getErrorMessage } from '@/lib/errors'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSessionOrError } from '@/lib/auth-helpers'
import { getFarmReviews } from '@/lib/catalog'
import { reviewSchema, parseJson } from '@/lib/validation'

export const dynamic = 'force-dynamic'

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: farmId } = await params

    return NextResponse.json({ reviews: await getFarmReviews(farmId) })
  } catch (error) {
    console.error('Reviews GET error:', error)
    return NextResponse.json(
      { error: getErrorMessage(error, 'Napaka pri nalaganju ocen') },
      { status: 500 }
    )
  }
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { session, error } = await getSessionOrError()
    if (error) return error
    const userId = session!.user!.id

    if (session!.user!.role === 'FARMER') {
      return NextResponse.json({ error: 'Kmetije ne morejo ocenjevati kmetij' }, { status: 403 })
    }

    const { id: farmId } = await params

    const parsed = await parseJson(reviewSchema, request)
    if (!parsed.ok) return parsed.error

    // Verified purchase only: prevents drive-by/fake reviews from anyone who never ordered.
    const purchase = await prisma.order.findFirst({
      where: { userId, farmId, status: { in: ['COLLECTED', 'COMPLETED'] } },
      select: { id: true },
    })
    if (!purchase) {
      return NextResponse.json(
        { error: 'Oceniti lahko le kmetije, pri katerih ste prevzeli naročilo.' },
        { status: 403 }
      )
    }

    const review = await prisma.review.upsert({
      where: { userId_farmId: { userId, farmId } },
      create: { userId, farmId, rating: parsed.data.rating, comment: parsed.data.comment || null },
      update: { rating: parsed.data.rating, comment: parsed.data.comment || null },
      select: { id: true, rating: true, comment: true, createdAt: true, updatedAt: true },
    })

    return NextResponse.json({
      review: {
        ...review,
        reviewerName: session!.user!.name || 'Kupec',
      },
    })
  } catch (error) {
    console.error('Reviews POST error:', error)
    return NextResponse.json(
      { error: getErrorMessage(error, 'Napaka pri oddaji ocene') },
      { status: 500 }
    )
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { session, error } = await getSessionOrError()
    if (error) return error
    const { id: farmId } = await params

    await prisma.review.deleteMany({ where: { userId: session!.user!.id, farmId } })
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Reviews DELETE error:', error)
    return NextResponse.json(
      { error: getErrorMessage(error, 'Napaka pri brisanju ocene') },
      { status: 500 }
    )
  }
}
