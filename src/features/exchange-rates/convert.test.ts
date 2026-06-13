import { describe, it, expect } from 'vitest'
import { toForeign } from './convert'

describe('toForeign', () => {
  it('converts CZK to a per-1 currency correctly', () => {
    const rate = { amount: 1, rate: 24.875 } // EUR
    expect(toForeign(24.875, rate)).toBeCloseTo(1, 10)
    expect(toForeign(100, rate)).toBeCloseTo(4.0201, 4)
  })

  it('converts CZK to a per-100 currency correctly', () => {
    const rate = { amount: 100, rate: 15.987 } // JPY
    // 1000 CZK → 1000 * 100 / 15.987 ≈ 6255.08
    const result = toForeign(1000, rate)
    expect(result).toBeCloseTo(6255.08, 0)
  })

  it('handles zero CZK', () => {
    expect(toForeign(0, { amount: 1, rate: 24.875 })).toBe(0)
  })
})
