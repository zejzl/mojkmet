import './setup'
import { describe, it, expect, afterEach, vi } from 'vitest'

vi.mock('next-auth', () => ({ getServerSession: vi.fn() }))

import { getServerSession } from 'next-auth'
import { GET, POST } from '@/app/api/farms/[id]/reviews/route'
import { prisma } from '@/lib/prisma'
import { createUser, createFarm, cleanupTestData } from './fixtures'

function mockSession(userId: string, role: 'CONSUMER' | 'FARMER') {
  vi.mocked(getServerSession).mockResolvedValue({
    user: { id: userId, role, name: 'Test Reviewer', email: 'reviewer@example.test' },
  } as never)
}

function reviewRequest(body: unknown) {
  return new Request('http://localhost/api/farms/x/reviews', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

async function createCompletedOrder(userId: string, farmId: string) {
  return prisma.order.create({
    data: {
      userId,
      farmId,
      status: 'COMPLETED',
      subtotal: 5,
      platformFee: 0,
      payoutAmount: 5,
      pickupStartsAt: new Date(Date.now() - 60_000),
      pickupEndsAt: new Date(Date.now() - 30_000),
      phone: '040000000',
    },
  })
}

describe('reviews API', () => {
  afterEach(async () => {
    await cleanupTestData()
    vi.mocked(getServerSession).mockReset()
  })

  it('GET returns an empty list for a farm with no reviews', async () => {
    const farmer = await createUser({ role: 'FARMER' })
    const farm = await createFarm(farmer.id)
    const res = await GET(new Request('http://localhost'), { params: Promise.resolve({ id: farm.id }) })
    const body = await res.json()
    expect(res.status).toBe(200)
    expect(body.reviews).toEqual([])
  })

  it('rejects a review from a user with no verified (COLLECTED/COMPLETED) order for that farm', async () => {
    const farmer = await createUser({ role: 'FARMER' })
    const farm = await createFarm(farmer.id)
    const consumer = await createUser({ role: 'CONSUMER' })
    mockSession(consumer.id, 'CONSUMER')

    const res = await POST(reviewRequest({ rating: 5 }), { params: Promise.resolve({ id: farm.id }) })
    expect(res.status).toBe(403)
  })

  it('rejects a review from a FARMER account', async () => {
    const farmer = await createUser({ role: 'FARMER' })
    const farm = await createFarm(farmer.id)
    mockSession(farmer.id, 'FARMER')

    const res = await POST(reviewRequest({ rating: 5 }), { params: Promise.resolve({ id: farm.id }) })
    expect(res.status).toBe(403)
  })

  it('accepts a review from a verified purchaser and a resubmit edits it in place', async () => {
    const farmer = await createUser({ role: 'FARMER' })
    const farm = await createFarm(farmer.id)
    const consumer = await createUser({ role: 'CONSUMER' })
    await createCompletedOrder(consumer.id, farm.id)
    mockSession(consumer.id, 'CONSUMER')

    const first = await POST(reviewRequest({ rating: 3, comment: 'okay' }), {
      params: Promise.resolve({ id: farm.id }),
    })
    const firstBody = await first.json()
    expect(first.status).toBe(200)
    expect(firstBody.review.rating).toBe(3)

    const second = await POST(reviewRequest({ rating: 5, comment: 'actually great' }), {
      params: Promise.resolve({ id: farm.id }),
    })
    const secondBody = await second.json()
    expect(second.status).toBe(200)
    expect(secondBody.review.id).toBe(firstBody.review.id) // same row, not a duplicate
    expect(secondBody.review.rating).toBe(5)

    const count = await prisma.review.count({ where: { userId: consumer.id, farmId: farm.id } })
    expect(count).toBe(1)
  })
})
