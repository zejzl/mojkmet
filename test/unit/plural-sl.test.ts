import { describe, it, expect } from 'vitest'
import { izdelekForm } from '@/lib/plural-sl'

describe('izdelekForm', () => {
  it('uses singular for 1, dual for 2, plural for 3-4, genitive plural otherwise', () => {
    expect(izdelekForm(1)).toBe('izdelek')
    expect(izdelekForm(2)).toBe('izdelka')
    expect(izdelekForm(3)).toBe('izdelki')
    expect(izdelekForm(4)).toBe('izdelki')
    expect(izdelekForm(5)).toBe('izdelkov')
    expect(izdelekForm(0)).toBe('izdelkov')
    expect(izdelekForm(10)).toBe('izdelkov')
  })

  it('follows the last two digits (101 is singular, 111 is not)', () => {
    expect(izdelekForm(101)).toBe('izdelek')
    expect(izdelekForm(102)).toBe('izdelka')
    expect(izdelekForm(104)).toBe('izdelki')
    expect(izdelekForm(111)).toBe('izdelkov')
    expect(izdelekForm(112)).toBe('izdelkov')
  })
})
