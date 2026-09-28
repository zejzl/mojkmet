import './setup'
import { describe, it, expect, afterEach, vi } from 'vitest'

vi.mock('next-auth', () => ({ getServerSession: vi.fn() }))
vi.mock('@/lib/order-mail', () => ({
  notifyOrderCreated: vi.fn().mockResolvedValue(undefined),
  formatPickupLabel: () => 'test-label',
}))
vi.mock('@/lib/payments', async () => {
  const actual = await vi.importActual<typeof import('@/lib/payments')>('@/lib/payments')
  return { ...actual, getPaymentProvider: vi.fn() }
})

import { getServerSession } from 'next-auth'
import { getPaymentProvider } from '@/lib/payments'
import { POST } from '@/app/api/orders/route'
import { prisma } from '@/lib/prisma'
import { createUser, createFarm, createCategory, createProduct, cleanupTestData } from './fixtures'

function mockSession(userId: string) {
  vi.mocked(getServerSession).mockResolvedValue({
    user: { id: userId, role: 'CONSUMER', name: 'Test', email: 'test@example.test' },
  } as never)
}

function mockPaymentProviderSuccess() {
  vi.mocked(getPaymentProvider).mockReturnValue({
    name: 'test-provider',
    initiate: vi.fn().mockResolvedValue({
      paymentRef: 'test-ref',
      paymentUrl: 'http://localhost/pay/test-ref',
      status: 'pending',
      expiresAt: new Date(Date.now() + 3600_000).toISOString(),
    }),
    status: vi.fn(),
  })
}

const inOneHour = () => new Date(Date.now() + 60 * 60 * 1000).toISOString()

function orderRequest(body: unknown) {
  return new Request('http://localhost/api/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

describe('orders API', () => {
  afterEach(async () => {
    await cleanupTestData()
    vi.mocked(getServerSession).mockReset()
    vi.mocked(getPaymentProvider).mockReset()
  })

  it('rejects a pickup time in the past', async () => {
    const user = await createUser()
    mockSession(user.id)
    const res = await POST(
      orderRequest({
        items: [{ productId: 'whatever', quantity: 1 }],
        pickupStartsAt: new Date(Date.now() - 3600_000).toISOString(),
        phone: '040000000',
      })
    )
    expect(res.status).toBe(400)
  })

  it('rejects insufficient stock', async () => {
    const user = await createUser()
    const farmer = await createUser({ role: 'FARMER' })
    const farm = await createFarm(farmer.id)
    const category = await createCategory()
    const product = await createProduct(farm.id, category.id, { stock: 1 })
    mockSession(user.id)

    const res = await POST(
      orderRequest({
        items: [{ productId: product.id, quantity: 2 }],
        pickupStartsAt: inOneHour(),
        phone: '040000000',
      })
    )
    expect(res.status).toBe(400)
    const body = await res.json()
    expect(body.error).toMatch(/zalog/i)
  })

  it('rejects a cart spanning more than one farm', async () => {
    const user = await createUser()
    const farmerA = await createUser({ role: 'FARMER' })
    const farmerB = await createUser({ role: 'FARMER' })
    const farmA = await createFarm(farmerA.id)
    const farmB = await createFarm(farmerB.id)
    const category = await createCategory()
    const productA = await createProduct(farmA.id, category.id)
    const productB = await createProduct(farmB.id, category.id)
    mockSession(user.id)

    const res = await POST(
      orderRequest({
        items: [
          { productId: productA.id, quantity: 1 },
          { productId: productB.id, quantity: 1 },
        ],
        pickupStartsAt: inOneHour(),
        phone: '040000000',
      })
    )
    expect(res.status).toBe(400)
    const body = await res.json()
    expect(body.error).toMatch(/ene kmetije/)
  })

  it('rejects an order below the farm minimum order value', async () => {
    const user = await createUser()
    const farmer = await createUser({ role: 'FARMER' })
    const farm = await createFarm(farmer.id, { minOrder: 50 })
    const category = await createCategory()
    const product = await createProduct(farm.id, category.id, { price: 5 })
    mockSession(user.id)

    const res = await POST(
      orderRequest({
        items: [{ productId: product.id, quantity: 1 }], // 5 EUR, below the 50 EUR minimum
        pickupStartsAt: inOneHour(),
        phone: '040000000',
      })
    )
    expect(res.status).toBe(400)
    const body = await res.json()
    expect(body.error).toMatch(/minimalno vrednost/)
  })

  it('creates an order, decrements stock, and initiates payment on success', async () => {
    const user = await createUser()
    const farmer = await createUser({ role: 'FARMER' })
    const farm = await createFarm(farmer.id)
    const category = await createCategory()
    const product = await createProduct(farm.id, category.id, { price: 5, stock: 10 })
    mockSession(user.id)
    mockPaymentProviderSuccess()

    const res = await POST(
      orderRequest({
        items: [{ productId: product.id, quantity: 2 }],
        pickupStartsAt: inOneHour(),
        phone: '040000000',
      })
    )
    const body = await res.json()
    expect(res.status).toBe(200)
    expect(body.paymentUrl).toBe('http://localhost/pay/test-ref')
    expect(body.order.subtotal).toBe(10)

    const updatedProduct = await prisma.product.findUnique({ where: { id: product.id } })
    expect(updatedProduct?.stock).toBe(8)

    const order = await prisma.order.findUnique({ where: { id: body.orderId } })
    expect(order?.paymentStatus).toBe('PROCESSING')
    expect(order?.paymentRef).toBe('test-ref')
  })

  it('cancels the order and restores stock if payment initiation fails', async () => {
    const user = await createUser()
    const farmer = await createUser({ role: 'FARMER' })
    const farm = await createFarm(farmer.id)
    const category = await createCategory()
    const product = await createProduct(farm.id, category.id, { price: 5, stock: 10 })
    mockSession(user.id)
    vi.mocked(getPaymentProvider).mockReturnValue({
      name: 'test-provider',
      initiate: vi.fn().mockRejectedValue(new Error('provider down')),
      status: vi.fn(),
    })

    const res = await POST(
      orderRequest({
        items: [{ productId: product.id, quantity: 2 }],
        pickupStartsAt: inOneHour(),
        phone: '040000000',
      })
    )
    expect(res.status).toBe(502)

    const updatedProduct = await prisma.product.findUnique({ where: { id: product.id } })
    expect(updatedProduct?.stock).toBe(10) // restored

    const orders = await prisma.order.findMany({ where: { userId: user.id } })
    expect(orders).toHaveLength(1)
    expect(orders[0].status).toBe('CANCELLED')
  })
})
