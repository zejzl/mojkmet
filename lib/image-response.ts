// Serves an image stored as a `data:` URL (see lib/image-upload.ts) as a real image response,
// so pages can reference a small cacheable URL instead of embedding up to 1.5 MB of base64.

export type ImageKind = 'farms' | 'products'

/** `?v=` is the record's updatedAt, so a replaced image gets a new URL and can be cached forever. */
export function imageUrl(kind: ImageKind, id: string, version: Date): string {
  return `/api/${kind}/${id}/image?v=${version.getTime()}`
}

const DATA_URL = /^data:(image\/(?:jpeg|png|webp|gif));base64,([A-Za-z0-9+/=]+)$/

// Only raster types pass lib/image-upload.ts validation, so a stored value should always match.
// The extra headers are defense in depth for user-supplied content served from our own origin.
const SAFETY_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'Content-Security-Policy': "default-src 'none'; sandbox",
  'Content-Disposition': 'inline',
} as const

export function imageResponse(dataUrl: string | null | undefined, requestUrl: string): Response {
  const match = dataUrl ? DATA_URL.exec(dataUrl) : null
  if (!match) return new Response(null, { status: 404 })

  const [, mime, base64] = match
  const bytes = Buffer.from(base64, 'base64')

  // Callers pass `?v=<updatedAt>` (see imageUrl() in lib/catalog.ts): a changed image gets a new
  // URL, so versioned responses can be cached forever. An unversioned URL caches briefly.
  const versioned = new URL(requestUrl).searchParams.has('v')

  return new Response(new Uint8Array(bytes), {
    status: 200,
    headers: {
      'Content-Type': mime,
      'Content-Length': String(bytes.length),
      'Cache-Control': versioned
        ? 'public, max-age=31536000, immutable'
        : 'public, max-age=300, stale-while-revalidate=3600',
      ...SAFETY_HEADERS,
    },
  })
}
