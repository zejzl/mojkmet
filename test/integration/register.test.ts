import './setup'
import { describe, it, expect, afterEach } from 'vitest'
import bcrypt from 'bcryptjs'
import { NextRequest } from 'next/server'
import { POST } from '@/app/api/register/route'
import { prisma } from '@/lib/prisma'
import { uniqueEmail, cleanupTestData } from './fixtures'

let ipCounter = 0
function registerRequest(body: unknown) {
  ipCounter += 1
  return new NextRequest('http://localhost/api/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // Unique IP per request: lib/rate-limit.ts keys its in-memory bucket by
      // action+IP, and all requests in this file would otherwise share one bucket
      // and start 429-ing after 5 calls regardless of what's actually being tested.
      'x-forwarded-for': `203.0.113.${ipCounter}`,
    },
    body: JSON.stringify(body),
  })
}

describe('register API', () => {
  afterEach(async () => {
    await cleanupTestData()
  })

  it('creates a CONSUMER by default and hashes the password', async () => {
    const email = uniqueEmail('register')
    const res = await POST(registerRequest({ email, password: 'password123' }))
    const body = await res.json()
    expect(body.user.role).toBe('CONSUMER')
    expect(body.user.email).toBe(email)
    expect(body.user.password).toBeUndefined()

    const stored = await prisma.user.findUnique({ where: { email } })
    expect(stored?.password).not.toBe('password123')
    expect(await bcrypt.compare('password123', stored!.password)).toBe(true)
  })

  it('rejects a role outside CONSUMER/FARMER at the route level (zod, not just unit-tested)', async () => {
    const res = await POST(registerRequest({ email: uniqueEmail('escalate'), password: 'password123', role: 'ADMIN' }))
    expect(res.status).toBe(400)
  })

  it('rejects a duplicate email with a generic message', async () => {
    const email = uniqueEmail('dup')
    const first = await POST(registerRequest({ email, password: 'password123' }))
    expect(first.status).toBe(200)

    const second = await POST(registerRequest({ email, password: 'differentpassword' }))
    const secondBody = await second.json()
    expect(second.status).toBe(400)
    expect(secondBody.error).toBe('Ta email je ze v uporabi')
  })
})
