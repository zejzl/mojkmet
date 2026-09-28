import './setup'
import { describe, it, expect, afterEach } from 'vitest'
import bcrypt from 'bcryptjs'
import { authorizeCredentials as authorize } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { uniqueEmail, cleanupTestData } from './fixtures'

describe('credentials authorize()', () => {
  afterEach(async () => {
    await cleanupTestData()
  })

  it('rejects a nonexistent email and a wrong password with the same generic message', async () => {
    const email = uniqueEmail('authorize')
    const hashed = await bcrypt.hash('correct-password', 4)
    await prisma.user.create({ data: { email, password: hashed, role: 'CONSUMER' } })

    await expect(authorize({ email: uniqueEmail('nobody'), password: 'whatever' })).rejects.toThrow(
      'Invalid credentials'
    )
    await expect(authorize({ email, password: 'wrong-password' })).rejects.toThrow('Invalid credentials')
  })

  it('returns safe user fields (no password) on correct credentials', async () => {
    const email = uniqueEmail('authorize-ok')
    const hashed = await bcrypt.hash('correct-password', 4)
    const user = await prisma.user.create({ data: { email, password: hashed, role: 'FARMER' } })

    const result = await authorize({ email, password: 'correct-password' })
    expect(result).toMatchObject({ id: user.id, email, role: 'FARMER' })
    expect(result).not.toHaveProperty('password')
  })
})
