const LOCALE = 'en-US'

const defaultFormatter = new Intl.NumberFormat(LOCALE, {
  style: 'decimal',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
  roundingMode: 'halfExpand',
} as Intl.NumberFormatOptions)

const rateFormatter = new Intl.NumberFormat(LOCALE, {
  style: 'decimal',
  minimumFractionDigits: 2,
  maximumFractionDigits: 4,
  roundingMode: 'halfExpand',
} as Intl.NumberFormatOptions)

export function formatMoney(value: number): string {
  if (!isFinite(value)) return ''
  return defaultFormatter.format(value)
}

export function formatRate(value: number): string {
  if (!isFinite(value)) return ''
  return rateFormatter.format(value)
}
