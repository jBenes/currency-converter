import type { Rate } from './types'
import { logger } from '@/lib/logger'
import { CURRENCIES, ALLOWED_CURRENCIES } from '@/config/currencies'
import type { CurrencyCode, CurrencyInfo } from '@/config/currencies'

export type { CurrencyCode, CurrencyInfo }
export { CURRENCIES, ALLOWED_CURRENCIES }

export function selectAvailableCurrencies(
  rates: Rate[],
  allowed: readonly CurrencyCode[] = ALLOWED_CURRENCIES,
): CurrencyInfo[] {
  const feedCodes = new Set(rates.map((r) => r.code))

  return allowed
    .filter((code) => {
      if (feedCodes.has(code)) return true
      logger.warn(`Allowed currency ${code} missing from feed`)
      return false
    })
    .map((code) => ({
      code,
      ...CURRENCIES[code],
    }))
}
