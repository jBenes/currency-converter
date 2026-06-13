import { describe, it, expect } from 'vitest'
import { parseRates } from './parse'

const fixture = `13.Jun.2026  #113
Country|Currency|Amount|Code|Rate
Australia|dollar|1|AUD|14.123
Denmark|krone|1|DKK|3.456
EMU|euro|1|EUR|24.875
Hungary|forint|100|HUF|6.234
Japan|yen|100|JPY|15.987
United Kingdom|pound|1|GBP|29.123
USA|dollar|1|USD|22.456
`

describe('parseRates', () => {
  it('parses the fixture correctly', () => {
    const result = parseRates(fixture)

    expect(result.dateText).toBe('13.Jun.2026')
    expect(result.sequence).toBe(113)
    expect(result.date).toBeInstanceOf(Date)
    expect(result.date?.getFullYear()).toBe(2026)
    expect(result.date?.getMonth()).toBe(5) // June = 5
    expect(result.date?.getDate()).toBe(13)
    expect(result.rates).toHaveLength(7)
  })

  it('extracts correct fields for a per-1 currency', () => {
    const result = parseRates(fixture)
    const eur = result.rates.find((r) => r.code === 'EUR')!

    expect(eur.country).toBe('EMU')
    expect(eur.currencyName).toBe('euro')
    expect(eur.amount).toBe(1)
    expect(eur.code).toBe('EUR')
    expect(eur.rate).toBe(24.875)
  })

  it('parses per-100 amount correctly for JPY and HUF', () => {
    const result = parseRates(fixture)
    const jpy = result.rates.find((r) => r.code === 'JPY')!
    const huf = result.rates.find((r) => r.code === 'HUF')!

    expect(jpy.amount).toBe(100)
    expect(jpy.rate).toBe(15.987)
    expect(huf.amount).toBe(100)
    expect(huf.rate).toBe(6.234)
  })

  it('handles \\r\\n line endings', () => {
    const crlf = fixture.replace(/\n/g, '\r\n')
    const result = parseRates(crlf)

    expect(result.rates).toHaveLength(7)
    expect(result.dateText).toBe('13.Jun.2026')
  })

  it('skips malformed lines', () => {
    const withBadLines = [
      '13.Jun.2026  #113',
      'Country|Currency|Amount|Code|Rate',
      'EMU|euro|1|EUR|24.875',
      'Bad|line|only|three',
      'Also bad',
      'USA|dollar|1|USD|22.456',
    ].join('\n')

    const result = parseRates(withBadLines)
    expect(result.rates).toHaveLength(2)
    expect(result.rates[0]!.code).toBe('EUR')
    expect(result.rates[1]!.code).toBe('USD')
  })

  it('stops at blank line', () => {
    const withBlank = [
      '13.Jun.2026  #113',
      'Country|Currency|Amount|Code|Rate',
      'EMU|euro|1|EUR|24.875',
      '',
      'USA|dollar|1|USD|22.456',
    ].join('\n')

    const result = parseRates(withBlank)
    expect(result.rates).toHaveLength(1)
  })

  it('throws on empty input', () => {
    expect(() => parseRates('')).toThrow('Empty exchange rate data')
    expect(() => parseRates('   ')).toThrow('Empty exchange rate data')
  })

  it('throws on missing header', () => {
    expect(() => parseRates('13.Jun.2026  #113\nBadHeader')).toThrow(
      'Missing or invalid header line',
    )
  })

  it('throws when no valid rows exist', () => {
    const noRows = [
      '13.Jun.2026  #113',
      'Country|Currency|Amount|Code|Rate',
      'Bad|line|only|three',
    ].join('\n')

    expect(() => parseRates(noRows)).toThrow('No valid rate rows found')
  })

  it('tolerates an unparseable date format', () => {
    const oddDate = [
      '2026-06-13  #113',
      'Country|Currency|Amount|Code|Rate',
      'EMU|euro|1|EUR|24.875',
    ].join('\n')

    const result = parseRates(oddDate)
    expect(result.dateText).toBe('2026-06-13')
    expect(result.date).toBeNull()
    expect(result.sequence).toBe(113)
  })

  it('skips rows with non-numeric rate or amount', () => {
    const bad = [
      '13.Jun.2026  #113',
      'Country|Currency|Amount|Code|Rate',
      'EMU|euro|abc|EUR|24.875',
      'USA|dollar|1|USD|xyz',
      'UK|pound|1|GBP|29.123',
    ].join('\n')

    const result = parseRates(bad)
    expect(result.rates).toHaveLength(1)
    expect(result.rates[0]!.code).toBe('GBP')
  })
})
