import { describe, it, expect } from 'vitest'
import {
  registerSchema,
  loginSchema,
  orderSchema,
  reviewSchema,
  cartAddSchema,
  cartUpdateSchema,
  favoriteSchema,
  pickupWindowSchema,
  productSchema,
  escapeHtml,
} from '@/lib/validation'

describe('registerSchema', () => {
  it('accepts a valid CONSUMER registration', () => {
    const result = registerSchema.safeParse({
      email: 'Marko@Example.com',
      password: 'password123',
      name: 'Marko',
      role: 'CONSUMER',
    })
    expect(result.success).toBe(true)
    if (result.success) {
      // emailSchema lowercases + trims
      expect(result.data.email).toBe('marko@example.com')
    }
  })

  it('rejects a role outside CONSUMER/FARMER (blocks self-service ADMIN escalation)', () => {
    const result = registerSchema.safeParse({
      email: 'a@b.com',
      password: 'password123',
      role: 'ADMIN',
    })
    expect(result.success).toBe(false)
  })

  it('rejects a password under 8 characters', () => {
    const result = registerSchema.safeParse({ email: 'a@b.com', password: 'short' })
    expect(result.success).toBe(false)
  })

  it('rejects an invalid email', () => {
    const result = registerSchema.safeParse({ email: 'not-an-email', password: 'password123' })
    expect(result.success).toBe(false)
  })
})

describe('loginSchema', () => {
  it('accepts any non-empty password (length is not policed at login)', () => {
    const result = loginSchema.safeParse({ email: 'a@b.com', password: 'x' })
    expect(result.success).toBe(true)
  })

  it('rejects an empty password', () => {
    const result = loginSchema.safeParse({ email: 'a@b.com', password: '' })
    expect(result.success).toBe(false)
  })
})

describe('orderSchema', () => {
  const base = {
    pickupStartsAt: '2026-06-01T08:00:00.000Z',
    phone: '040123456',
  }

  it('accepts a valid single-item order', () => {
    const result = orderSchema.safeParse({
      ...base,
      items: [{ productId: 'p1', quantity: 1 }],
    })
    expect(result.success).toBe(true)
  })

  it('rejects a quantity of 0', () => {
    const result = orderSchema.safeParse({
      ...base,
      items: [{ productId: 'p1', quantity: 0 }],
    })
    expect(result.success).toBe(false)
  })

  it('rejects a quantity over 999', () => {
    const result = orderSchema.safeParse({
      ...base,
      items: [{ productId: 'p1', quantity: 1000 }],
    })
    expect(result.success).toBe(false)
  })

  it('rejects an empty items array', () => {
    const result = orderSchema.safeParse({ ...base, items: [] })
    expect(result.success).toBe(false)
  })
})

describe('reviewSchema', () => {
  it('accepts a rating of 1 and 5 with no comment', () => {
    expect(reviewSchema.safeParse({ rating: 1 }).success).toBe(true)
    expect(reviewSchema.safeParse({ rating: 5 }).success).toBe(true)
  })

  it('rejects a rating of 0 or 6', () => {
    expect(reviewSchema.safeParse({ rating: 0 }).success).toBe(false)
    expect(reviewSchema.safeParse({ rating: 6 }).success).toBe(false)
  })

  it('rejects a non-integer rating', () => {
    expect(reviewSchema.safeParse({ rating: 3.5 }).success).toBe(false)
  })
})

describe('cartAddSchema / cartUpdateSchema', () => {
  it('cartAddSchema allows omitting quantity (defaults applied by the route, not here)', () => {
    expect(cartAddSchema.safeParse({ productId: 'p1' }).success).toBe(true)
  })

  it('cartUpdateSchema requires quantity >= 1', () => {
    expect(cartUpdateSchema.safeParse({ quantity: 0 }).success).toBe(false)
    expect(cartUpdateSchema.safeParse({ quantity: 1 }).success).toBe(true)
  })

  it('rejects quantity over 999', () => {
    expect(cartUpdateSchema.safeParse({ quantity: 1000 }).success).toBe(false)
  })
})

describe('favoriteSchema', () => {
  it('rejects an empty productId', () => {
    expect(favoriteSchema.safeParse({ productId: '' }).success).toBe(false)
  })
})

describe('pickupWindowSchema', () => {
  it('accepts endTime after startTime', () => {
    const result = pickupWindowSchema.safeParse({
      dayOfWeek: 1,
      startTime: '08:00',
      endTime: '10:00',
    })
    expect(result.success).toBe(true)
  })

  it('rejects endTime before or equal to startTime', () => {
    expect(
      pickupWindowSchema.safeParse({ dayOfWeek: 1, startTime: '10:00', endTime: '08:00' }).success
    ).toBe(false)
    expect(
      pickupWindowSchema.safeParse({ dayOfWeek: 1, startTime: '10:00', endTime: '10:00' }).success
    ).toBe(false)
  })

  it('rejects a malformed time string', () => {
    expect(
      pickupWindowSchema.safeParse({ dayOfWeek: 1, startTime: '25:00', endTime: '10:00' }).success
    ).toBe(false)
  })
})

describe('productSchema', () => {
  it('coerces price/stock from strings (form inputs) and defaults unit', () => {
    const result = productSchema.safeParse({
      name: 'Med',
      price: '4.5',
      stock: '10',
      categoryId: 'c1',
    })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.price).toBe(4.5)
      expect(result.data.stock).toBe(10)
      expect(result.data.unit).toBe('kg')
    }
  })

  it('rejects a price of 0', () => {
    expect(
      productSchema.safeParse({ name: 'Med', price: 0, stock: 1, categoryId: 'c1' }).success
    ).toBe(false)
  })

  it('rejects a negative stock', () => {
    expect(
      productSchema.safeParse({ name: 'Med', price: 1, stock: -1, categoryId: 'c1' }).success
    ).toBe(false)
  })
})

describe('escapeHtml', () => {
  it('escapes &, <, >, and " (not single quotes)', () => {
    expect(escapeHtml(`<script>"a" & 'b'</script>`)).toBe(
      `&lt;script&gt;&quot;a&quot; &amp; 'b'&lt;/script&gt;`
    )
  })
})
