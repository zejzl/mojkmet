import { describe, it, expect } from 'vitest'
import { imageResponse, imageUrl } from '@/lib/image-response'

// 1x1 transparent PNG
const PNG_B64 =
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=='
const PNG_DATA_URL = `data:image/png;base64,${PNG_B64}`

describe('imageResponse', () => {
  it('decodes a stored data URL into the original bytes with the right content type', async () => {
    const res = imageResponse(PNG_DATA_URL, 'http://localhost:3000/api/products/x/image')
    expect(res.status).toBe(200)
    expect(res.headers.get('Content-Type')).toBe('image/png')
    const body = Buffer.from(await res.arrayBuffer())
    expect(body.equals(Buffer.from(PNG_B64, 'base64'))).toBe(true)
    expect(res.headers.get('Content-Length')).toBe(String(body.length))
  })

  it('caches versioned URLs forever and unversioned ones only briefly', () => {
    const versioned = imageResponse(PNG_DATA_URL, 'http://localhost:3000/api/farms/x/image?v=123')
    expect(versioned.headers.get('Cache-Control')).toContain('immutable')
    expect(versioned.headers.get('Cache-Control')).toContain('max-age=31536000')

    const plain = imageResponse(PNG_DATA_URL, 'http://localhost:3000/api/farms/x/image')
    expect(plain.headers.get('Cache-Control')).not.toContain('immutable')
    expect(plain.headers.get('Cache-Control')).toContain('max-age=300')
  })

  it('sends hardening headers for user-supplied content on our own origin', () => {
    const res = imageResponse(PNG_DATA_URL, 'http://localhost:3000/x')
    expect(res.headers.get('X-Content-Type-Options')).toBe('nosniff')
    expect(res.headers.get('Content-Security-Policy')).toContain("default-src 'none'")
    expect(res.headers.get('Content-Disposition')).toBe('inline')
  })

  it('returns 404 when there is no image', () => {
    expect(imageResponse(null, 'http://localhost:3000/x').status).toBe(404)
    expect(imageResponse(undefined, 'http://localhost:3000/x').status).toBe(404)
    expect(imageResponse('', 'http://localhost:3000/x').status).toBe(404)
  })

  it('returns 404 for anything that is not a raster data URL', () => {
    // SVG can carry script, and external URLs are rejected at upload, so neither is ever served
    expect(
      imageResponse('data:image/svg+xml;base64,PHN2Zy8+', 'http://localhost:3000/x').status
    ).toBe(404)
    expect(imageResponse('https://example.com/a.png', 'http://localhost:3000/x').status).toBe(404)
    expect(imageResponse('data:text/html;base64,PGgxPg==', 'http://localhost:3000/x').status).toBe(
      404
    )
    expect(
      imageResponse('data:image/png;base64,not base64!!', 'http://localhost:3000/x').status
    ).toBe(404)
  })
})

describe('imageUrl', () => {
  it('builds a versioned URL from the record id and updatedAt', () => {
    const v = new Date('2026-10-01T12:00:00.000Z')
    expect(imageUrl('products', 'abc', v)).toBe(`/api/products/abc/image?v=${v.getTime()}`)
    expect(imageUrl('farms', 'xyz', v)).toBe(`/api/farms/xyz/image?v=${v.getTime()}`)
  })
})
