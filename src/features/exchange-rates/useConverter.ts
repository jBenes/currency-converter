import { useMemo, useCallback } from 'react'
import type { Rate } from './types'
import { toForeign } from './convert'
import { formatMoney } from '@/lib/money'

function sanitize(value: string): string {
  let result = ''
  let hasDot = false
  for (const ch of value) {
    if (ch >= '0' && ch <= '9') {
      result += ch
    } else if (ch === '.' && !hasDot) {
      hasDot = true
      result += ch
    }
  }
  return result
}

function parseAmount(raw: string): number {
  if (!raw) return 0
  const n = parseFloat(raw)
  return isFinite(n) ? n : 0
}

interface ConverterResult {
  czkValue: string
  foreignValue: string
  onCzkChange: (value: string) => void
}

export function useConverter(
  rate: Rate | undefined,
  czkRaw: string,
  setCzkRaw: (value: string) => void,
): ConverterResult {
  const onCzkChange = useCallback(
    (value: string) => {
      setCzkRaw(sanitize(value))
    },
    [setCzkRaw],
  )

  const foreignValue = useMemo(() => {
    if (!rate || czkRaw === '') return ''
    const czk = parseAmount(czkRaw)
    return formatMoney(toForeign(czk, rate))
  }, [czkRaw, rate])

  return {
    czkValue: czkRaw,
    foreignValue,
    onCzkChange,
  }
}
