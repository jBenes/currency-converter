interface CurrencyMeta {
  name: string
  symbol: string
  country: string
  flag: string | null
}

export const CURRENCIES = {
  EUR: { name: 'Euro', symbol: '\u20AC', country: 'European Union', flag: 'eu' },
  USD: { name: 'US Dollar', symbol: '$', country: 'United States', flag: 'us' },
  GBP: { name: 'British Pound', symbol: '\u00A3', country: 'United Kingdom', flag: 'gb' },
  CHF: { name: 'Swiss Franc', symbol: 'Fr', country: 'Switzerland', flag: 'ch' },
  JPY: { name: 'Japanese Yen', symbol: '\u00A5', country: 'Japan', flag: 'jp' },
  AUD: { name: 'Australian Dollar', symbol: 'A$', country: 'Australia', flag: 'au' },
  CAD: { name: 'Canadian Dollar', symbol: 'C$', country: 'Canada', flag: 'ca' },
  PLN: { name: 'Polish Zloty', symbol: 'z\u0142', country: 'Poland', flag: 'pl' },
  HUF: { name: 'Hungarian Forint', symbol: 'Ft', country: 'Hungary', flag: 'hu' },
  SEK: { name: 'Swedish Krona', symbol: 'kr', country: 'Sweden', flag: 'se' },
  NOK: { name: 'Norwegian Krone', symbol: 'kr', country: 'Norway', flag: 'no' },
  DKK: { name: 'Danish Krone', symbol: 'kr', country: 'Denmark', flag: 'dk' },
  BRL: { name: 'Brazilian Real', symbol: 'R$', country: 'Brazil', flag: 'br' },
  CNY: { name: 'Chinese Renminbi', symbol: '\u00A5', country: 'China', flag: 'cn' },
  HKD: { name: 'Hong Kong Dollar', symbol: 'HK$', country: 'Hong Kong', flag: 'hk' },
  ISK: { name: 'Icelandic Krona', symbol: 'kr', country: 'Iceland', flag: 'is' },
  XDR: { name: 'IMF SDR', symbol: 'SDR', country: 'IMF', flag: null },
  INR: { name: 'Indian Rupee', symbol: '\u20B9', country: 'India', flag: 'in' },
  IDR: { name: 'Indonesian Rupiah', symbol: 'Rp', country: 'Indonesia', flag: 'id' },
  ILS: { name: 'Israeli Shekel', symbol: '\u20AA', country: 'Israel', flag: 'il' },
  MYR: { name: 'Malaysian Ringgit', symbol: 'RM', country: 'Malaysia', flag: 'my' },
  MXN: { name: 'Mexican Peso', symbol: 'Mex$', country: 'Mexico', flag: 'mx' },
  NZD: { name: 'New Zealand Dollar', symbol: 'NZ$', country: 'New Zealand', flag: 'nz' },
  PHP: { name: 'Philippine Peso', symbol: '\u20B1', country: 'Philippines', flag: 'ph' },
  RON: { name: 'Romanian Leu', symbol: 'lei', country: 'Romania', flag: 'ro' },
  SGD: { name: 'Singapore Dollar', symbol: 'S$', country: 'Singapore', flag: 'sg' },
  ZAR: { name: 'South African Rand', symbol: 'R', country: 'South Africa', flag: 'za' },
  KRW: { name: 'South Korean Won', symbol: '\u20A9', country: 'South Korea', flag: 'kr' },
  THB: { name: 'Thai Baht', symbol: '\u0E3F', country: 'Thailand', flag: 'th' },
  TRY: { name: 'Turkish Lira', symbol: '\u20BA', country: 'Turkey', flag: 'tr' },
} as const satisfies Record<string, CurrencyMeta>

export type CurrencyCode = keyof typeof CURRENCIES

export const ALLOWED_CURRENCIES: readonly CurrencyCode[] = [
  'EUR', 'USD', 'GBP', 'CHF', 'JPY', 'AUD', 'CAD', 'PLN', 'HUF',
  'SEK', 'NOK', 'DKK', 'BRL', 'CNY', 'HKD', 'ISK', 'INR', 'IDR',
  'ILS', 'MYR', 'MXN', 'NZD', 'PHP', 'RON', 'SGD', 'ZAR', 'KRW',
  'THB', 'TRY',
  // 'XDR' intentionally omitted — IMF SDR is a synthetic reserve asset, not a spendable currency
] as const

export interface CurrencyInfo {
  code: CurrencyCode
  name: string
  symbol: string
  country: string
  flag: string | null
}
