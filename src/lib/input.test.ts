import { describe, it, expect } from 'vitest'
import { sanitizeAmount, parseAmount } from './input'

describe('sanitizeAmount', () => {
  it('keeps digits', () => {
    expect(sanitizeAmount('12345')).toBe('12345')
  })

  it('keeps a single decimal point', () => {
    expect(sanitizeAmount('123.45')).toBe('123.45')
  })

  it('strips letters and special characters', () => {
    expect(sanitizeAmount('1a2b3c')).toBe('123')
  })

  it('strips extra decimal points', () => {
    expect(sanitizeAmount('1.2.3.4')).toBe('1.234')
  })

  it('handles leading dot', () => {
    expect(sanitizeAmount('.5')).toBe('.5')
  })

  it('strips e/+/- (not a number input)', () => {
    expect(sanitizeAmount('1e5')).toBe('15')
    expect(sanitizeAmount('+100')).toBe('100')
    expect(sanitizeAmount('-50')).toBe('50')
  })

  it('returns empty string for non-numeric input', () => {
    expect(sanitizeAmount('abc')).toBe('')
  })

  it('returns empty string for empty input', () => {
    expect(sanitizeAmount('')).toBe('')
  })

  it('handles commas (strips them)', () => {
    expect(sanitizeAmount('1,000.50')).toBe('1000.50')
  })

  it('handles spaces', () => {
    expect(sanitizeAmount('1 000')).toBe('1000')
  })
})

describe('parseAmount', () => {
  it('parses a valid number', () => {
    expect(parseAmount('123.45')).toBe(123.45)
  })

  it('parses an integer', () => {
    expect(parseAmount('100')).toBe(100)
  })

  it('returns 0 for empty string', () => {
    expect(parseAmount('')).toBe(0)
  })

  it('returns 0 for non-numeric string', () => {
    expect(parseAmount('abc')).toBe(0)
  })

  it('returns 0 for Infinity', () => {
    expect(parseAmount('Infinity')).toBe(0)
  })

  it('parses leading dot', () => {
    expect(parseAmount('.5')).toBe(0.5)
  })

  it('parses trailing dot as integer', () => {
    expect(parseAmount('5.')).toBe(5)
  })

  it('returns 0 for just a dot', () => {
    expect(parseAmount('.')).toBe(0)
  })
})
