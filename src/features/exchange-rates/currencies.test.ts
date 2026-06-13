import { describe, it, expect, vi } from 'vitest'
import { selectAvailableCurrencies, type CurrencyInfo } from './currencies'
import type { Rate } from './types'
import { logger } from '@/lib/logger'

vi.mock('@/lib/logger', () => ({
  logger: { info: vi.fn(), warn: vi.fn(), error: vi.fn() },
}))

const whitelist: CurrencyInfo[] = [
  { code: 'EUR', name: 'Euro', symbol: '\u20AC', country: 'EU' },
  { code: 'USD', name: 'US Dollar', symbol: '$', country: 'US' },
  { code: 'GBP', name: 'British Pound', symbol: '\u00A3', country: 'UK' },
]

function makeRate(code: string): Rate {
  return { country: '', currencyName: '', amount: 1, code, rate: 1 }
}

describe('selectAvailableCurrencies', () => {
  it('returns intersection in whitelist order', () => {
    const rates = [makeRate('USD'), makeRate('EUR')]
    const result = selectAvailableCurrencies(rates, whitelist)

    expect(result.map((c) => c.code)).toEqual(['EUR', 'USD'])
  })

  it('omits a whitelisted code missing from the feed and logs a warning', () => {
    const rates = [makeRate('EUR')]
    const result = selectAvailableCurrencies(rates, whitelist)

    expect(result.map((c) => c.code)).toEqual(['EUR'])
    expect(logger.warn).toHaveBeenCalledWith(
      'Whitelisted currency USD missing from feed',
    )
    expect(logger.warn).toHaveBeenCalledWith(
      'Whitelisted currency GBP missing from feed',
    )
  })

  it('returns empty array when no whitelisted currencies are in the feed', () => {
    const rates = [makeRate('AUD')]
    const result = selectAvailableCurrencies(rates, whitelist)

    expect(result).toEqual([])
  })
})
