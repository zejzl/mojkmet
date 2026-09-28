import { PaymentInitiateParams, PaymentInitiation, PaymentProvider, PaymentProviderError, PaymentStatus } from './index'

const API_KEY = process.env.PAYMENT_MOCK_SECRET || ''
const BASE_URL = process.env.PAYMENT_MOCK_BASE_URL || 'https://api.mojkmet.eu'
const PROVIDER_NAME = 'mojkmet-mockpay'

async function fetchJson<T>(path: string, init?: RequestInit): Promise<T> {
  let res: Response
  try {
    res = await fetch(`${BASE_URL}${path}`, {
      ...init,
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': API_KEY,
        ...(init?.headers || {}),
      },
      cache: 'no-store',
      next: { revalidate: 0 },
    })
  } catch (err) {
    throw new PaymentProviderError(
      `Plačilni ponudnik ni dosegljiv (${BASE_URL}${path}): ${
        err instanceof Error ? err.message : String(err)
      }`,
      PROVIDER_NAME
    )
  }

  const text = await res.text()
  let data: unknown = null
  try {
    data = text ? JSON.parse(text) : null
  } catch {
    data = text
  }

  if (!res.ok) {
    const message =
      data && typeof data === 'object' && 'error' in data
        ? String((data as { error: unknown }).error)
        : `Napaka plačilnega ponudnika (HTTP ${res.status})`
    throw new PaymentProviderError(message, PROVIDER_NAME, res.status)
  }

  return data as T
}

export const mockProvider: PaymentProvider = {
  name: PROVIDER_NAME,

  async initiate(params: PaymentInitiateParams): Promise<PaymentInitiation> {
    if (!API_KEY) {
      throw new PaymentProviderError('PAYMENT_MOCK_SECRET ni nastavljen', PROVIDER_NAME)
    }

    const data = await fetchJson<{
      payment_ref: string
      payment_url: string
      status: string
      expires_at: string
    }>('/v1/payments/initiate', {
      method: 'POST',
      body: JSON.stringify({
        order_id: params.orderId,
        amount_cents: params.amountCents,
        currency: params.currency || 'EUR',
        webhook_url: params.webhookUrl,
        return_url: params.returnUrl,
        idempotency_key: params.idempotencyKey,
      }),
    })

    return {
      paymentRef: data.payment_ref,
      paymentUrl: data.payment_url,
      status: data.status,
      expiresAt: data.expires_at,
    }
  },

  async status(paymentRef: string): Promise<PaymentStatus> {
    if (!API_KEY) {
      throw new PaymentProviderError('PAYMENT_MOCK_SECRET ni nastavljen', PROVIDER_NAME)
    }

    const data = await fetchJson<{
      payment_ref: string
      order_id: string
      amount_cents: number
      currency: string
      status: string
      paid_at: string | null
      expires_at: string
    }>(`/v1/payments/status?ref=${encodeURIComponent(paymentRef)}`)

    return {
      paymentRef: data.payment_ref,
      orderId: data.order_id,
      amountCents: data.amount_cents,
      currency: data.currency,
      status: data.status,
      paidAt: data.paid_at,
      expiresAt: data.expires_at,
    }
  },
}