import { describe, it, expect } from 'vitest'
import { toForeign, toCzk } from './convert'

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

describe('toCzk', () => {
  it('converts a per-1 currency to CZK correctly', () => {
    const rate = { amount: 1, rate: 24.875 }
    expect(toCzk(1, rate)).toBe(24.875)
    expect(toCzk(10, rate)).toBe(248.75)
  })

  it('converts a per-100 currency to CZK correctly', () => {
    const rate = { amount: 100, rate: 15.987 } // JPY
    // 100 JPY = 15.987 CZK, so 1000 JPY = 159.87 CZK
    expect(toCzk(1000, rate)).toBeCloseTo(159.87, 2)
  })

  it('handles zero foreign', () => {
    expect(toCzk(0, { amount: 1, rate: 24.875 })).toBe(0)
  })
})

describe('round-trip', () => {
  it('toCzk(toForeign(x)) ≈ x for per-1 currency', () => {
    const rate = { amount: 1, rate: 24.875 }
    const czk = 1234.56
    expect(toCzk(toForeign(czk, rate), rate)).toBeCloseTo(czk, 10)
  })

  it('toCzk(toForeign(x)) ≈ x for per-100 currency', () => {
    const rate = { amount: 100, rate: 15.987 }
    const czk = 5000
    expect(toCzk(toForeign(czk, rate), rate)).toBeCloseTo(czk, 10)
  })
})
