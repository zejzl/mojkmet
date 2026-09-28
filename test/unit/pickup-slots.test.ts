import { describe, it, expect } from 'vitest'
import {
  wallClockToUtc,
  generateSlots,
  isPickupPeriodOpen,
  weekdayAt,
  PICKUP_DURATION_MINUTES,
} from '@/lib/pickup-slots'

describe('wallClockToUtc', () => {
  it('converts a summer (CEST, UTC+2) wall-clock time correctly', () => {
    const utcMs = wallClockToUtc(2026, 6, 15, '10:00')
    const d = new Date(utcMs)
    expect(d.getUTCHours()).toBe(8)
  })

  it('converts a winter (CET, UTC+1) wall-clock time correctly', () => {
    const utcMs = wallClockToUtc(2026, 1, 15, '10:00')
    const d = new Date(utcMs)
    expect(d.getUTCHours()).toBe(9)
  })
})

describe('generateSlots', () => {
  it('produces 30-minute slots stepping through an 08:00-10:00 window', () => {
    const from = new Date('2026-06-01T00:00:00Z')
    const dow = weekdayAt(from.getTime() + 24 * 60 * 60 * 1000)
    const windows = [{ id: 'w1', dayOfWeek: dow, startTime: '08:00', endTime: '10:00', active: true }]

    const slots = generateSlots(windows, { from, days: 7 })

    expect(slots).toHaveLength(4)
    expect(slots.map((s) => s.startTime)).toEqual(['08:00', '08:30', '09:00', '09:30'])
    expect(slots.every((s) => s.dayOfWeek === dow)).toBe(true)
    // each slot is PICKUP_DURATION_MINUTES long
    for (const s of slots) {
      const durationMs = new Date(s.end).getTime() - new Date(s.start).getTime()
      expect(durationMs).toBe(PICKUP_DURATION_MINUTES * 60 * 1000)
    }
  })

  it('ignores inactive windows', () => {
    const from = new Date('2026-06-01T00:00:00Z')
    const dow = weekdayAt(from.getTime() + 24 * 60 * 60 * 1000)
    const windows = [
      { id: 'w1', dayOfWeek: dow, startTime: '08:00', endTime: '10:00', active: false },
    ]
    expect(generateSlots(windows, { from, days: 7 })).toHaveLength(0)
  })

  it('returns no slots when there are no windows', () => {
    expect(generateSlots([], {})).toHaveLength(0)
  })
})

describe('isPickupPeriodOpen', () => {
  it('allows any period when no windows are configured (grace path)', () => {
    const start = new Date('2026-06-01T08:00:00Z')
    const end = new Date('2026-06-01T08:30:00Z')
    expect(isPickupPeriodOpen(start, end, [])).toBe(true)
  })

  it('accepts a period fully inside a matching window', () => {
    const dow = new Date(Date.UTC(2026, 5, 15)).getUTCDay() // 2026-06-15
    const windows = [{ id: 'w1', dayOfWeek: dow, startTime: '08:00', endTime: '10:00', active: true }]
    const start = new Date(wallClockToUtc(2026, 6, 15, '08:30'))
    const end = new Date(wallClockToUtc(2026, 6, 15, '09:00'))
    expect(isPickupPeriodOpen(start, end, windows)).toBe(true)
  })

  it('rejects a period outside the window hours', () => {
    const dow = new Date(Date.UTC(2026, 5, 15)).getUTCDay()
    const windows = [{ id: 'w1', dayOfWeek: dow, startTime: '08:00', endTime: '10:00', active: true }]
    const start = new Date(wallClockToUtc(2026, 6, 15, '10:30'))
    const end = new Date(wallClockToUtc(2026, 6, 15, '11:00'))
    expect(isPickupPeriodOpen(start, end, windows)).toBe(false)
  })

  it('rejects a period on the wrong day of week', () => {
    const dow = new Date(Date.UTC(2026, 5, 15)).getUTCDay()
    const otherDow = (dow + 1) % 7
    const windows = [
      { id: 'w1', dayOfWeek: otherDow, startTime: '08:00', endTime: '10:00', active: true },
    ]
    const start = new Date(wallClockToUtc(2026, 6, 15, '08:30'))
    const end = new Date(wallClockToUtc(2026, 6, 15, '09:00'))
    expect(isPickupPeriodOpen(start, end, windows)).toBe(false)
  })

  it('rejects a period where end is not after start', () => {
    const dow = new Date(Date.UTC(2026, 5, 15)).getUTCDay()
    const windows = [{ id: 'w1', dayOfWeek: dow, startTime: '08:00', endTime: '10:00', active: true }]
    const t = new Date(wallClockToUtc(2026, 6, 15, '08:30'))
    expect(isPickupPeriodOpen(t, t, windows)).toBe(false)
  })
})
