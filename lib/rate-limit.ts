type RateLimitEntry = { count: number; resetAt: number }

const buckets = new Map<string, RateLimitEntry>()
const MAX_BUCKETS = 5000

export function getClientIp(request: Request): string {
  return request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
}

export function rateLimit(
  request: Request,
  action: string,
  max = 5,
  windowMs = 15 * 60 * 1000
): boolean {
  const ip = getClientIp(request)
  const key = `${action}:${ip}`
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
        return true
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