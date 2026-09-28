import { getErrorMessage } from '@/lib/errors'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSessionOrError } from '@/lib/auth-helpers'
import { getPaymentProvider, PaymentProviderError } from '@/lib/payments'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const { session, error } = await getSessionOrError()
    if (error) return error

    const { searchParams } = new URL(request.url)
    const ref = searchParams.get('ref')
    if (!ref) {
      return NextResponse.json({ error: 'missing_ref' }, { status: 400 })
    }

    // Lastnik naročila lahko preveri le status svojega plačila
    const order = await prisma.order.findFirst({
      where: { paymentRef: ref, userId: session!.user!.id },
      select: { id: true, status: true, paymentStatus: true },
    })
    if (!order) {
      return NextResponse.json({ error: 'not_found' }, { status: 404 })
    }

    const status = await getPaymentProvider().status(ref)

    return NextResponse.json({
      payment: {
        paymentRef: status.paymentRef,
        orderId: status.orderId,
        amountCents: status.amountCents,
        currency: status.currency,
        status: status.status,
        paidAt: status.paidAt,
        expiresAt: status.expiresAt,
      },
      order: {
        id: order.id,
        status: order.status,
        paymentStatus: order.paymentStatus,
      },
    })
  } catch (err) {
    if (err instanceof PaymentProviderError) {
      return NextResponse.json({ error: err.message }, { status: 502 })
    }
    console.error('Payment status error:', err)
    return NextResponse.json({ error: getErrorMessage(err, 'Napaka') }, { status: 500 })
  }
}