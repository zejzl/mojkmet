import { describe, it, expect } from 'vitest'
import { sanitizeImageDataUrl, MAX_IMAGE_BYTES } from '@/lib/image-upload'

function dataUrl(mime: string, bytes: Buffer): string {
  return `data:${mime};base64,${bytes.toString('base64')}`
}

// Minimal 1x1 PNG: 8-byte signature + a bare IHDR chunk (length/CRC aren't validated by
// lib/image-upload.ts, only the 'IHDR' tag at byte 12 and width/height at 16/20).
function minimalPng(width = 1, height = 1): Buffer {
  const sig = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])
  const chunkLen = Buffer.from([0x00, 0x00, 0x00, 0x0d])
  const ihdr = Buffer.from('IHDR', 'ascii')
  const w = Buffer.alloc(4)
  w.writeUInt32BE(width)
  const h = Buffer.alloc(4)
  h.writeUInt32BE(height)
  return Buffer.concat([sig, chunkLen, ihdr, w, h])
}

const PNG_IEND = Buffer.from([0, 0, 0, 0, 0x49, 0x45, 0x4e, 0x44, 0xae, 0x42, 0x60, 0x82])

// Minimal 1x1 GIF: 'GIF89a' + width/height (LE16) + a trailer byte (0x3B).
function minimalGif(width = 1, height = 1): Buffer {
  const sig = Buffer.from('GIF89a', 'ascii')
  const w = Buffer.alloc(2)
  w.writeUInt16LE(width)
  const h = Buffer.alloc(2)
  h.writeUInt16LE(height)
  return Buffer.concat([sig, w, h, Buffer.from([0x3b])])
}

// Minimal 1x1 baseline JPEG: SOI + a real SOF0 segment (precision/height/width/1 component) + EOI.
function minimalJpeg(width = 1, height = 1): Buffer {
  const soi = Buffer.from([0xff, 0xd8])
  const sof = Buffer.from([0xff, 0xc0, 0x00, 0x0b, 0x08])
  const h = Buffer.alloc(2)
  h.writeUInt16BE(height)
  const w = Buffer.alloc(2)
  w.writeUInt16BE(width)
  const component = Buffer.from([0x01, 0x01, 0x11, 0x00])
  const eoi = Buffer.from([0xff, 0xd9])
  return Buffer.concat([soi, sof, h, w, component, eoi])
}

// Minimal 1x1 WebP (VP8 simple format): RIFF/WEBP container + a 'VP8 ' chunk with width/height
// at the fixed offsets this parser reads (a simplification of the real VP8 bitstream spec).
function minimalWebp(width = 1, height = 1): Buffer {
  const riff = Buffer.from('RIFF', 'ascii')
  const size = Buffer.alloc(4)
  size.writeUInt32LE(22) // 30-byte total - 8
  const webp = Buffer.from('WEBP', 'ascii')
  const vp8 = Buffer.from('VP8 ', 'ascii')
  const padding = Buffer.alloc(10)
  const w = Buffer.alloc(2)
  w.writeUInt16LE(width)
  const h = Buffer.alloc(2)
  h.writeUInt16LE(height)
  return Buffer.concat([riff, size, webp, vp8, padding, w, h])
}

describe('sanitizeImageDataUrl - accepted formats', () => {
  it('accepts a minimal valid PNG', () => {
    const result = sanitizeImageDataUrl(dataUrl('image/png', minimalPng()))
    expect(result.ok).toBe(true)
    if (result.ok) expect(result.value).toContain('data:image/png;base64,')
  })

  it('accepts a minimal valid GIF', () => {
    const result = sanitizeImageDataUrl(dataUrl('image/gif', minimalGif()))
    expect(result.ok).toBe(true)
  })

  it('accepts a minimal valid JPEG', () => {
    const result = sanitizeImageDataUrl(dataUrl('image/jpeg', minimalJpeg()))
    expect(result.ok).toBe(true)
  })

  it('accepts a minimal valid WebP', () => {
    const result = sanitizeImageDataUrl(dataUrl('image/webp', minimalWebp()))
    expect(result.ok).toBe(true)
  })
})

describe('sanitizeImageDataUrl - clearing', () => {
  it('treats undefined as "no change"', () => {
    const result = sanitizeImageDataUrl(undefined)
    expect(result).toEqual({ ok: true, changed: false, value: null })
  })

  it('treats an empty string as "clear the image"', () => {
    const result = sanitizeImageDataUrl('')
    expect(result).toEqual({ ok: true, changed: true, value: null })
  })
})

describe('sanitizeImageDataUrl - rejections', () => {
  it('rejects a plain (non data:) URL', () => {
    const result = sanitizeImageDataUrl('https://evil.example.com/tracker.png')
    expect(result.ok).toBe(false)
  })

  it('rejects a javascript: URL', () => {
    const result = sanitizeImageDataUrl('javascript:alert(1)')
    expect(result.ok).toBe(false)
  })

  it('rejects a disallowed declared MIME type (e.g. SVG)', () => {
    const result = sanitizeImageDataUrl('data:image/svg+xml;base64,PHN2Zz48L3N2Zz4=')
    expect(result.ok).toBe(false)
  })

  it('rejects a declared MIME that does not match the actual content', () => {
    // declares PNG but the bytes are actually a GIF
    const result = sanitizeImageDataUrl(dataUrl('image/png', minimalGif()))
    expect(result.ok).toBe(false)
  })

  it('rejects garbage bytes with no recognizable image signature', () => {
    const result = sanitizeImageDataUrl(dataUrl('image/png', Buffer.from('not an image', 'utf8')))
    expect(result.ok).toBe(false)
  })

  it('rejects a payload over the size cap', () => {
    const big = Buffer.alloc(MAX_IMAGE_BYTES + 1000)
    const result = sanitizeImageDataUrl(dataUrl('image/png', big))
    expect(result.ok).toBe(false)
  })

  it('rejects zero dimensions', () => {
    const result = sanitizeImageDataUrl(dataUrl('image/png', minimalPng(0, 0)))
    expect(result.ok).toBe(false)
  })

  it('rejects oversized dimensions', () => {
    const result = sanitizeImageDataUrl(dataUrl('image/png', minimalPng(20000, 20000)))
    expect(result.ok).toBe(false)
  })
})

describe('sanitizeImageDataUrl - polyglot canonicalization', () => {
  it('strips trailer bytes appended after a valid PNG (e.g. an injected <script>)', () => {
    const cleanPng = Buffer.concat([minimalPng(), PNG_IEND])
    const polyglot = Buffer.concat([cleanPng, Buffer.from('<script>evil()</script>', 'ascii')])

    const result = sanitizeImageDataUrl(dataUrl('image/png', polyglot))
    expect(result.ok).toBe(true)
    if (!result.ok || !result.value) throw new Error('expected a sanitized value')

    const canonicalBytes = Buffer.from(result.value.split(',')[1], 'base64')
    expect(canonicalBytes.length).toBe(cleanPng.length)
    expect(canonicalBytes.equals(cleanPng)).toBe(true)
    expect(canonicalBytes.includes('script')).toBe(false)
  })
})
