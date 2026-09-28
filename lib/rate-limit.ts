import type { NextRequest } from 'next/server'
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

type InMemoryEntry = { count: number; resetAt: number }

const buckets = new Map<string, InMemoryEntry>()
const MAX_BUCKETS = 5000

const upstashLimiters = new Map<string, Ratelimit>()

export function isUpstashRateLimitEnabled(): boolean {
  return Boolean(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN)
}

function getUpstash(max: number, windowMs: number): Ratelimit | null {
  if (!isUpstashRateLimitEnabled()) return null
  const key = `${max}:${windowMs}`
  const existing = upstashLimiters.get(key)
  if (existing) return existing

  try {
    const limiter = new Ratelimit({
      redis: Redis.fromEnv(),
      limiter: Ratelimit.slidingWindow(max, `${Math.round(windowMs / 1000)} s`),
      prefix: 'mk-ratelimit',
    })
    upstashLimiters.set(key, limiter)
    return limiter
  } catch (error) {
    console.error('Upstash rate limiter init failed, falling back to in-memory:', error)
    return null
  }
}

export function getClientIp(request: NextRequest): string {
  // NextRequest.ip was removed in Next.js 15+. On Vercel, `x-forwarded-for` is set by
  // Vercel's edge network itself (any client-supplied value is overwritten there), so it's
  // still safe to trust as the first entry.
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) return forwarded.split(',')[0]?.trim() || 'unknown'
  return request.headers.get('x-real-ip')?.trim() || 'unknown'
}

export async function rateLimit(
  request: NextRequest,
  action: string,
  max = 5,
  windowMs = 15 * 60 * 1000
): Promise<boolean> {
  const key = `${action}:${getClientIp(request)}`

  const upstash = getUpstash(max, windowMs)
  if (upstash) {
    try {
      const result = await upstash.limit(key)
      return result.success
    } catch (error) {
      console.error('Upstash rate limit failed, falling back to in-memory:', error)
    }
  }

  return rateLimitInMemory(key, max, windowMs)
}

function rateLimitInMemory(key: string, max: number, windowMs: number): boolean {
  const now = Date.now()
  const entry = buckets.get(key)

  if (!entry || now > entry.resetAt) {
    if (buckets.size >= MAX_BUCKETS && !buckets.has(key)) {
      let pruned = 0
      for (const [k, e] of buckets) {
        if (now > e.resetAt) {
          buckets.delete(k)
          pruned++
        }
      }
      if (pruned === 0 && buckets.size >= MAX_BUCKETS) {
        return false
      }
    }
    buckets.set(key, { count: 1, resetAt: now + windowMs })
    return true
  }

  entry.count++
  return entry.count <= max
}

export function tooManyRequests() {
  return Response.json({ error: 'Prevec zahtevkov. Poskusite ponovno pozneje.' }, { status: 429 })
}