import { describe, it, expect, vi } from 'vitest'
import { selectAvailableCurrencies, type CurrencyCode } from './currencies'
import type { Rate } from './types'
import { logger } from '@/lib/logger'

vi.mock('@/lib/logger', () => ({
  logger: { info: vi.fn(), warn: vi.fn(), error: vi.fn() },
}))

const testAllowed: CurrencyCode[] = ['EUR', 'USD', 'GBP']

function makeRate(code: string): Rate {
  return { country: '', currencyName: '', amount: 1, code, rate: 1 }
}

describe('selectAvailableCurrencies', () => {
  it('returns intersection in allowed-list order', () => {
    const rates = [makeRate('USD'), makeRate('EUR')]
    const result = selectAvailableCurrencies(rates, testAllowed)

    expect(result.map((c) => c.code)).toEqual(['EUR', 'USD'])
  })

  it('attaches catalog metadata', () => {
    const rates = [makeRate('EUR')]
    const result = selectAvailableCurrencies(rates, ['EUR'])

    expect(result[0]).toEqual({
      code: 'EUR',
      name: 'Euro',
      symbol: '\u20AC',
      country: 'European Union',
      flag: 'eu',
    })
  })

  it('includes per-100 currency (HUF) with correct metadata', () => {
    const rates = [makeRate('HUF')]
    const result = selectAvailableCurrencies(rates, ['HUF'])

    expect(result[0]).toEqual({
      code: 'HUF',
      name: 'Hungarian Forint',
      symbol: 'Ft',
      country: 'Hungary',
      flag: 'hu',
    })
  })

  it('omits an allowed code missing from the feed and logs a warning', () => {
    const rates = [makeRate('EUR')]
    const result = selectAvailableCurrencies(rates, testAllowed)

    expect(result.map((c) => c.code)).toEqual(['EUR'])
    expect(logger.warn).toHaveBeenCalledWith(
      'Allowed currency USD missing from feed',
    )
    expect(logger.warn).toHaveBeenCalledWith(
      'Allowed currency GBP missing from feed',
    )
  })

  it('returns empty array when no allowed currencies are in the feed', () => {
    const rates = [makeRate('AUD')]
    const result = selectAvailableCurrencies(rates, ['EUR', 'USD'])

    expect(result).toEqual([])
  })

  it('XDR parses into the feed but is not in ALLOWED_CURRENCIES', () => {
    // XDR exists in CURRENCIES catalog but is intentionally excluded from
    // ALLOWED_CURRENCIES. A bogus code in ALLOWED_CURRENCIES would fail
    // to compile (typed as CurrencyCode[]).
    const rates = [makeRate('XDR'), makeRate('EUR')]
    const result = selectAvailableCurrencies(rates, ['EUR'])

    expect(result.map((c) => c.code)).toEqual(['EUR'])
    // XDR is in the feed but not offered
    expect(result.some((c) => c.code === 'XDR')).toBe(false)
  })
})
