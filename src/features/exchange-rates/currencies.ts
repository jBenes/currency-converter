import type { Rate } from './types'
import { logger } from '@/lib/logger'

export interface CurrencyInfo {
  code: string
  name: string
  symbol: string
  country: string
}

export const CURRENCY_WHITELIST: readonly CurrencyInfo[] = [
  { code: 'EUR', name: 'Euro', symbol: '\u20AC', country: 'European Union' },
  { code: 'USD', name: 'US Dollar', symbol: '$', country: 'United States' },
  {
    code: 'GBP',
    name: 'British Pound',
    symbol: '\u00A3',
    country: 'United Kingdom',
  },
  {
    code: 'CHF',
    name: 'Swiss Franc',
    symbol: 'Fr',
    country: 'Switzerland',
  },
  {
    code: 'JPY',
    name: 'Japanese Yen',
    symbol: '\u00A5',
    country: 'Japan',
  },
  {
    code: 'AUD',
    name: 'Australian Dollar',
    symbol: 'A$',
    country: 'Australia',
  },
  {
    code: 'CAD',
    name: 'Canadian Dollar',
    symbol: 'C$',
    country: 'Canada',
  },
  { code: 'PLN', name: 'Polish Zloty', symbol: 'z\u0142', country: 'Poland' },
  {
    code: 'HUF',
    name: 'Hungarian Forint',
    symbol: 'Ft',
    country: 'Hungary',
  },
  { code: 'SEK', name: 'Swedish Krona', symbol: 'kr', country: 'Sweden' },
  { code: 'NOK', name: 'Norwegian Krone', symbol: 'kr', country: 'Norway' },
  { code: 'DKK', name: 'Danish Krone', symbol: 'kr', country: 'Denmark' },
] as const

export type CurrencyCode = (typeof CURRENCY_WHITELIST)[number]['code']

export function selectAvailableCurrencies(
  rates: Rate[],
  whitelist: readonly CurrencyInfo[] = CURRENCY_WHITELIST,
): CurrencyInfo[] {
  const feedCodes = new Set(rates.map((r) => r.code))

  return whitelist.filter((entry) => {
    if (feedCodes.has(entry.code)) return true
    logger.warn(`Whitelisted currency ${entry.code} missing from feed`)
    return false
  })
}
