import { describe, it, expect } from 'vitest'
import { haversineKm, formatDistanceKm } from '@/lib/geo'

describe('haversineKm', () => {
  it('is zero for identical coordinates', () => {
    const p = { latitude: 46.0569, longitude: 14.5058 }
    expect(haversineKm(p, p)).toBeCloseTo(0, 6)
  })

  it('matches the known Ljubljana -> Maribor distance (~103.6 km, per PLAN.md)', () => {
    const ljubljana = { latitude: 46.0569, longitude: 14.5058 }
    const maribor = { latitude: 46.5547, longitude: 15.6467 }
    expect(haversineKm(ljubljana, maribor)).toBeCloseTo(103.6, 0)
  })

  it('is symmetric', () => {
    const a = { latitude: 46.0569, longitude: 14.5058 }
    const b = { latitude: 45.5, longitude: 13.7 }
    expect(haversineKm(a, b)).toBeCloseTo(haversineKm(b, a), 9)
  })
})

describe('formatDistanceKm', () => {
  it('formats sub-kilometer distances in meters', () => {
    expect(formatDistanceKm(0.5)).toBe('500 m')
  })

  it('floors at 1 m rather than showing 0 m', () => {
    expect(formatDistanceKm(0.0001)).toBe('1 m')
  })

  it('formats under-100km distances with one decimal and a comma', () => {
    expect(formatDistanceKm(5.67)).toBe('5,7 km')
  })

  it('formats 100km and above as a rounded whole number', () => {
    expect(formatDistanceKm(100)).toBe('100 km')
    expect(formatDistanceKm(250.6)).toBe('251 km')
  })
})
