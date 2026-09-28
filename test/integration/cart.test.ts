import './setup'
import { describe, it, expect, afterEach, vi } from 'vitest'

vi.mock('next-auth', () => ({ getServerSession: vi.fn() }))

import { getServerSession } from 'next-auth'
import { GET, POST, DELETE } from '@/app/api/cart/route'
import { PATCH, DELETE as DELETE_ITEM } from '@/app/api/cart/[productId]/route'
import { createUser, createFarm, createCategory, createProduct, cleanupTestData } from './fixtures'

function mockSession(userId: string) {
  vi.mocked(getServerSession).mockResolvedValue({
    user: { id: userId, role: 'CONSUMER', name: 'Test', email: 'test@example.test' },
  } as never)
}

function postRequest(body: unknown) {
  return new Request('http://localhost/api/cart', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

function patchRequest(body: unknown) {
  return new Request('http://localhost/api/cart/x', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

describe('cart API', () => {
  afterEach(async () => {
    await cleanupTestData()
    vi.mocked(getServerSession).mockReset()
  })

  it('GET returns 401 when signed out', async () => {
    vi.mocked(getServerSession).mockResolvedValue(null as never)
    const res = await GET()
    expect(res.status).toBe(401)
  })

  it('adds a product, increments on repeat add, and clamps to stock', async () => {
    const user = await createUser()
    const farm = await createFarm(user.id)
    const category = await createCategory()
    const product = await createProduct(farm.id, category.id, { stock: 3 })
    mockSession(user.id)

    const first = await POST(postRequest({ productId: product.id }))
    const firstBody = await first.json()
    expect(first.status).toBe(200)
    expect(firstBody.items).toHaveLength(1)
    expect(firstBody.items[0].quantity).toBe(1)

    const second = await POST(postRequest({ productId: product.id }))
    const secondBody = await second.json()
    expect(secondBody.items[0].quantity).toBe(2)

    // set quantity above stock -> clamped, not rejected
    const patched = await PATCH(patchRequest({ quantity: 999 }), {
      params: Promise.resolve({ productId: product.id }),
    })
    const patchedBody = await patched.json()
    expect(patched.status).toBe(200)
    expect(patchedBody.items[0].quantity).toBe(3)
  })

  it('rejects adding an unavailable product', async () => {
    const user = await createUser()
    const farm = await createFarm(user.id)
    const category = await createCategory()
    const product = await createProduct(farm.id, category.id, { available: false })
    mockSession(user.id)

    const res = await POST(postRequest({ productId: product.id }))
    expect(res.status).toBe(400)
  })

  it('removes a single item and clears the whole cart', async () => {
    const user = await createUser()
    const farm = await createFarm(user.id)
    const category = await createCategory()
    const productA = await createProduct(farm.id, category.id)
    const productB = await createProduct(farm.id, category.id)
    mockSession(user.id)

    await POST(postRequest({ productId: productA.id }))
    await POST(postRequest({ productId: productB.id }))

    const afterRemoveOne = await DELETE_ITEM(new Request('http://localhost/api/cart/x', { method: 'DELETE' }), {
      params: Promise.resolve({ productId: productA.id }),
    })
    const afterRemoveOneBody = await afterRemoveOne.json()
    expect(afterRemoveOneBody.items).toHaveLength(1)

    const afterClear = await DELETE()
    const afterClearBody = await afterClear.json()
    expect(afterClearBody.items).toHaveLength(0)
  })
})
