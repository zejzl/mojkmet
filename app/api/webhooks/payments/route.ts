import { NextResponse } from 'next/server'
import { createHmac, timingSafeEqual } from 'crypto'
import { prisma } from '@/lib/prisma'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const PROVIDER_NAME = process.env.PAYMENT_PROVIDER || 'mock'
const WEBHOOK_SECRET = process.env.PAYMENT_MOCK_SECRET || ''

function verifySignature(rawBody: string, signatureHeader: string | null): boolean {
  if (!WEBHOOK_SECRET || !signatureHeader) return false
  const expected = createHmac('sha256', WEBHOOK_SECRET).update(rawBody).digest('hex')
  const a = Buffer.from(signatureHeader)
  const b = Buffer.from(expected)
  return a.length === b.length && timingSafeEqual(a, b)
}

export async function POST(request: Request) {
  const rawBody = await request.text()
  const signature = request.headers.get('X-Payment-Signature')
  const providerHeader = request.headers.get('X-Payment-Provider')

  if (!verifySignature(rawBody, signature) || providerHeader !== PROVIDER_NAME) {
    return NextResponse.json({ error: 'invalid_signature' }, { status: 401 })
  }

  let payload: {
    event?: string
    payment_ref?: string
    order_id?: string
    amount_cents?: number
    currency?: string
    paid_at?: string
  }
  try {
    payload = JSON.parse(rawBody)
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 })
  }

  if (payload.event !== 'payment.confirmed') {
    return NextResponse.json({ error: 'unsupported_event' }, { status: 400 })
  }

  const { payment_ref, order_id, amount_cents, paid_at } = payload
  if (!payment_ref || !order_id || typeof amount_cents !== 'number' || amount_cents < 1) {
    return NextResponse.json({ error: 'invalid_payload' }, { status: 400 })
  }

  try {
    // Webhook idempotency: ure, ki so ze obdelane, se ne obdelajo znova
    const existing = await prisma.paymentEvent.findUnique({
      where: { provider_externalId: { provider: PROVIDER_NAME, externalId: payment_ref } },
    })
    if (existing) {
      return NextResponse.json({ ok: true, already_processed: true })
    }

    const order = await prisma.order.findUnique({
      where: { id: order_id, paymentRef: payment_ref },
      select: { id: true, status: true, paymentStatus: true, subtotal: true, platformFee: true },
    })

    if (!order) {
      // Naročila ni mogoče najti za ta sklic - ne odgovori 2xx, da se provider ponovi poskus
      return NextResponse.json({ error: 'order_not_found' }, { status: 404 })
    }

    const expectedCents = Math.round(
      (order.subtotal.toNumber() + order.platformFee.toNumber()) * 100
    )
    if (expectedCents !== amount_cents) {
      return NextResponse.json({ error: 'amount_mismatch' }, { status: 409 })
    }

    try {
      await prisma.paymentEvent.create({
        data: {
          provider: PROVIDER_NAME,
          externalId: payment_ref,
          type: 'payment.confirmed',
          payload: payload as object,
        },
      })
    } catch (err) {
      if (
        err instanceof Error &&
        'code' in err &&
        (err as { code?: string }).code === 'P2002'
      ) {
        // sočasna podvojena dostava webhooka - ze obdelano
        return NextResponse.json({ ok: true, already_processed: true })
      }
      throw err
    }

    const paidAt = paid_at ? new Date(paid_at) : new Date()

    const revive = order.status === 'CANCELLED'

    await prisma.$transaction(async (tx) => {
      if (revive) {
        // Plačilo je prispelo po poteku rezervacije - zadržek je bil sproščen,
        // zato zalogo ponovno bremenimo.
        const items = await tx.orderItem.findMany({
          where: { orderId: order.id },
          select: { productId: true, quantity: true },
        })
        for (const item of items) {
          await tx.product.update({
            where: { id: item.productId },
            data: { stock: { decrement: item.quantity } },
          })
        }
      }

      await tx.order.update({
        where: { id: order.id },
        data: {
          status: 'PAID',
          paymentStatus: 'PAID',
          paidAt,
          paymentRef: payment_ref,
          paymentProvider: PROVIDER_NAME,
          reservedUntil: null,
        },
      })
    })

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Payment webhook error:', err)
    return NextResponse.json({ error: 'internal_error' }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({ error: 'method_not_allowed' }, { status: 405 })
}