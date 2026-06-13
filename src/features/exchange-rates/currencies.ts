import type { Rate } from './types'
import { logger } from '@/lib/logger'

export interface CurrencyInfo {
  code: string
  name: string
  symbol: string
  country: string
  flag: string | null
}

export const CURRENCY_WHITELIST: readonly CurrencyInfo[] = [
  { code: 'EUR', name: 'Euro', symbol: '\u20AC', country: 'European Union', flag: 'eu' },
  { code: 'USD', name: 'US Dollar', symbol: '$', country: 'United States', flag: 'us' },
  { code: 'GBP', name: 'British Pound', symbol: '\u00A3', country: 'United Kingdom', flag: 'gb' },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'Fr', country: 'Switzerland', flag: 'ch' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '\u00A5', country: 'Japan', flag: 'jp' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', country: 'Australia', flag: 'au' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', country: 'Canada', flag: 'ca' },
  { code: 'PLN', name: 'Polish Zloty', symbol: 'z\u0142', country: 'Poland', flag: 'pl' },
  { code: 'HUF', name: 'Hungarian Forint', symbol: 'Ft', country: 'Hungary', flag: 'hu' },
  { code: 'SEK', name: 'Swedish Krona', symbol: 'kr', country: 'Sweden', flag: 'se' },
  { code: 'NOK', name: 'Norwegian Krone', symbol: 'kr', country: 'Norway', flag: 'no' },
  { code: 'DKK', name: 'Danish Krone', symbol: 'kr', country: 'Denmark', flag: 'dk' },
  { code: 'BRL', name: 'Brazilian Real', symbol: 'R$', country: 'Brazil', flag: 'br' },
  { code: 'CNY', name: 'Chinese Renminbi', symbol: '\u00A5', country: 'China', flag: 'cn' },
  { code: 'HKD', name: 'Hong Kong Dollar', symbol: 'HK$', country: 'Hong Kong', flag: 'hk' },
  { code: 'ISK', name: 'Icelandic Krona', symbol: 'kr', country: 'Iceland', flag: 'is' },
  { code: 'XDR', name: 'IMF SDR', symbol: 'SDR', country: 'IMF', flag: null },
  { code: 'INR', name: 'Indian Rupee', symbol: '\u20B9', country: 'India', flag: 'in' },
  { code: 'IDR', name: 'Indonesian Rupiah', symbol: 'Rp', country: 'Indonesia', flag: 'id' },
  { code: 'ILS', name: 'Israeli Shekel', symbol: '\u20AA', country: 'Israel', flag: 'il' },
  { code: 'MYR', name: 'Malaysian Ringgit', symbol: 'RM', country: 'Malaysia', flag: 'my' },
  { code: 'MXN', name: 'Mexican Peso', symbol: 'Mex$', country: 'Mexico', flag: 'mx' },
  { code: 'NZD', name: 'New Zealand Dollar', symbol: 'NZ$', country: 'New Zealand', flag: 'nz' },
  { code: 'PHP', name: 'Philippine Peso', symbol: '\u20B1', country: 'Philippines', flag: 'ph' },
  { code: 'RON', name: 'Romanian Leu', symbol: 'lei', country: 'Romania', flag: 'ro' },
  { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$', country: 'Singapore', flag: 'sg' },
  { code: 'ZAR', name: 'South African Rand', symbol: 'R', country: 'South Africa', flag: 'za' },
  { code: 'KRW', name: 'South Korean Won', symbol: '\u20A9', country: 'South Korea', flag: 'kr' },
  { code: 'THB', name: 'Thai Baht', symbol: '\u0E3F', country: 'Thailand', flag: 'th' },
  { code: 'TRY', name: 'Turkish Lira', symbol: '\u20BA', country: 'Turkey', flag: 'tr' },
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
