import { describe, it, expect, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'
import { getClientIp, rateLimit, isUpstashRateLimitEnabled } from '@/lib/rate-limit'

function requestFrom(headers: Record<string, string>) {
  return new NextRequest('http://localhost/api/test', { headers })
}

describe('isUpstashRateLimitEnabled', () => {
  it('is false when no Upstash env vars are set (exercises the in-memory fallback below)', () => {
    expect(isUpstashRateLimitEnabled()).toBe(false)
  })
})

describe('getClientIp', () => {
  it('reads the first address from X-Forwarded-For', () => {
    const req = requestFrom({ 'x-forwarded-for': '203.0.113.5, 10.0.0.1' })
    expect(getClientIp(req)).toBe('203.0.113.5')
  })

  it('falls back to X-Real-IP when X-Forwarded-For is absent', () => {
    const req = requestFrom({ 'x-real-ip': '203.0.113.9' })
    expect(getClientIp(req)).toBe('203.0.113.9')
  })

  it('returns "unknown" when neither header is present', () => {
    const req = requestFrom({})
    expect(getClientIp(req)).toBe('unknown')
  })
})

describe('rateLimit (in-memory fallback)', () => {
  let counter = 0
  let action: string

  beforeEach(() => {
    // unique action per test so the module-level bucket Map never leaks state between tests
    counter += 1
    action = `test-action-${counter}`
  })

  it('allows requests up to the limit and blocks the next one', async () => {
    const req = requestFrom({ 'x-forwarded-for': '198.51.100.1' })
    expect(await rateLimit(req, action, 3, 60_000)).toBe(true)
    expect(await rateLimit(req, action, 3, 60_000)).toBe(true)
    expect(await rateLimit(req, action, 3, 60_000)).toBe(true)
    expect(await rateLimit(req, action, 3, 60_000)).toBe(false)
  })

  it('tracks different IPs independently under the same action', async () => {
    const reqA = requestFrom({ 'x-forwarded-for': '198.51.100.2' })
    const reqB = requestFrom({ 'x-forwarded-for': '198.51.100.3' })
    expect(await rateLimit(reqA, action, 1, 60_000)).toBe(true)
    expect(await rateLimit(reqA, action, 1, 60_000)).toBe(false)
    // a different IP has its own bucket, unaffected by reqA's
    expect(await rateLimit(reqB, action, 1, 60_000)).toBe(true)
  })

  it('tracks different actions independently for the same IP', async () => {
    const req = requestFrom({ 'x-forwarded-for': '198.51.100.4' })
    expect(await rateLimit(req, `${action}-a`, 1, 60_000)).toBe(true)
    expect(await rateLimit(req, `${action}-a`, 1, 60_000)).toBe(false)
    expect(await rateLimit(req, `${action}-b`, 1, 60_000)).toBe(true)
  })
})
