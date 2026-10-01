import { describe, it, expect } from 'vitest'
import { safeRedirectPath } from '@/lib/safe-redirect'

describe('safeRedirectPath', () => {
  it('allows same-site relative paths, including query strings', () => {
    expect(safeRedirectPath('/checkout')).toBe('/checkout')
    expect(safeRedirectPath('/payment/result?order=abc123')).toBe('/payment/result?order=abc123')
  })

  it('falls back when nothing is provided', () => {
    expect(safeRedirectPath(null)).toBe('/')
    expect(safeRedirectPath(undefined)).toBe('/')
    expect(safeRedirectPath('')).toBe('/')
    expect(safeRedirectPath(null, '/dashboard')).toBe('/dashboard')
  })

  it('rejects absolute and protocol-relative URLs', () => {
    expect(safeRedirectPath('https://evil.com')).toBe('/')
    expect(safeRedirectPath('//evil.com')).toBe('/')
    expect(safeRedirectPath('/\\evil.com')).toBe('/')
    expect(safeRedirectPath('javascript:alert(1)')).toBe('/')
  })

  it('rejects control characters that browsers strip before parsing', () => {
    expect(safeRedirectPath('/\t/evil.com')).toBe('/')
    expect(safeRedirectPath('/\n/evil.com')).toBe('/')
  })
})
