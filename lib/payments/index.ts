import { mockProvider } from './mock'

export interface PaymentInitiateParams {
  orderId: string
  amountCents: number
  currency?: string
  idempotencyKey: string
  webhookUrl: string
  returnUrl: string
}

export interface PaymentInitiation {
  paymentRef: string
  paymentUrl: string
  status: string
  expiresAt: string
}

export interface PaymentStatus {
  paymentRef: string
  orderId: string
  amountCents: number
  currency: string
  status: string
  paidAt: string | null
  expiresAt: string
}

export interface PaymentProvider {
  name: string
  initiate(params: PaymentInitiateParams): Promise<PaymentInitiation>
  status(paymentRef: string): Promise<PaymentStatus>
}

export class PaymentProviderError extends Error {
  constructor(
    message: string,
    public readonly provider: string,
    public readonly upstreamCode?: number | null
  ) {
    super(message)
    this.name = 'PaymentProviderError'
  }
}

export function getPaymentProvider(): PaymentProvider {
  // Only the mock provider exists today; Račun123 swaps in here later.
  return mockProvider
}