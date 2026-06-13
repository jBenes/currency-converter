// @vitest-environment jsdom
import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useConverter } from './useConverter'
import type { Rate } from './types'

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
    const { result } = renderHook(() => useConverter(undefined))
    expect(result.current.czkValue).toBe('')
    expect(result.current.foreignValue).toBe('')
  })

  it('returns empty strings initially', () => {
    const { result } = renderHook(() => useConverter(eurRate))
    expect(result.current.czkValue).toBe('')
    expect(result.current.foreignValue).toBe('')
  })

  it('converts CZK to EUR correctly', () => {
    const { result } = renderHook(() => useConverter(eurRate))

    act(() => {
      result.current.onCzkChange('100')
    })

    expect(result.current.czkValue).toBe('100')
    expect(result.current.foreignValue).toBe('4.02')
  })

  it('handles per-100 currency (JPY)', () => {
    const { result } = renderHook(() => useConverter(jpyRate))

    act(() => {
      result.current.onCzkChange('1000')
    })

    expect(result.current.czkValue).toBe('1000')
    expect(result.current.foreignValue).toBe('6,255.08')
  })

  it('treats empty input as 0 (shows empty)', () => {
    const { result } = renderHook(() => useConverter(eurRate))

    act(() => {
      result.current.onCzkChange('')
    })

    expect(result.current.foreignValue).toBe('')
  })

  it('sanitizes input via onCzkChange', () => {
    const { result } = renderHook(() => useConverter(eurRate))

    act(() => {
      result.current.onCzkChange('1a2b3.4.5')
    })

    expect(result.current.czkValue).toBe('123.45')
  })

  it('recomputes when rate changes (currency switch)', () => {
    const { result, rerender } = renderHook(
      ({ rate }) => useConverter(rate),
      { initialProps: { rate: eurRate as Rate | undefined } },
    )

    act(() => {
      result.current.onCzkChange('100')
    })

    expect(result.current.foreignValue).toBe('4.02')

    rerender({ rate: jpyRate })

    // 100 CZK * 100 / 15.987 = 625.51
    expect(result.current.foreignValue).toBe('625.51')
  })
})
