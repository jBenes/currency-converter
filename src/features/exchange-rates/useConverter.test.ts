// @vitest-environment jsdom
import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useConverter } from './useConverter'
import type { Rate } from './types'

function setup(rate: Rate | undefined, czkRaw = '') {
  let raw = czkRaw
  const setRaw = (v: string) => {
    raw = v
  }

  return renderHook(
    ({ r, v }) => useConverter(r, v, setRaw),
    { initialProps: { r: rate, v: raw } },
  )
}

const eurRate: Rate = {
  country: 'EMU',
  currencyName: 'euro',
  amount: 1,
  code: 'EUR',
  rate: 24.875,
}

const jpyRate: Rate = {
  country: 'Japan',
  currencyName: 'yen',
  amount: 100,
  code: 'JPY',
  rate: 15.987,
}

describe('useConverter', () => {
  it('returns empty strings when no rate', () => {
    const { result } = setup(undefined)
    expect(result.current.czkValue).toBe('')
    expect(result.current.foreignValue).toBe('')
  })

  it('returns empty strings when czkRaw is empty', () => {
    const { result } = setup(eurRate)
    expect(result.current.czkValue).toBe('')
    expect(result.current.foreignValue).toBe('')
  })

  it('converts CZK to EUR correctly', () => {
    const { result } = setup(eurRate, '100')
    expect(result.current.czkValue).toBe('100')
    expect(result.current.foreignValue).toBe('4.02')
  })

  it('handles per-100 currency (JPY)', () => {
    const { result } = setup(jpyRate, '1000')
    expect(result.current.czkValue).toBe('1000')
    expect(result.current.foreignValue).toBe('6,255.08')
  })

  it('treats empty input as 0 (shows empty)', () => {
    const { result } = setup(eurRate, '')
    expect(result.current.foreignValue).toBe('')
  })

  it('sanitizes input via onCzkChange', () => {
    let raw = ''
    const setRaw = (v: string) => {
      raw = v
    }

    const { result } = renderHook(() => useConverter(eurRate, raw, setRaw))

    act(() => {
      result.current.onCzkChange('1a2b3.4.5')
    })

    expect(raw).toBe('123.45')
  })

  it('recomputes when rate changes (currency switch)', () => {
    const { result, rerender } = renderHook(
      ({ r, v }) => useConverter(r, v, () => {}),
      { initialProps: { r: eurRate, v: '100' } },
    )

    expect(result.current.foreignValue).toBe('4.02')

    rerender({ r: jpyRate, v: '100' })

    // 100 CZK * 100 / 15.987 = 625.51
    expect(result.current.foreignValue).toBe('625.51')
  })
})
