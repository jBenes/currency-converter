import { useMemo, useState, useCallback } from 'react'
import type { Rate } from './types'
import { toForeign } from './convert'
import { formatMoney } from '@/lib/money'
import { sanitizeAmount, parseAmount } from '@/lib/input'

interface ConverterResult {
  czkValue: string
  foreignValue: string
  onCzkChange: (value: string) => void
}

export function useConverter(rate: Rate | undefined): ConverterResult {
  const [czkRaw, setCzkRaw] = useState('')

  const onCzkChange = useCallback((value: string) => {
    setCzkRaw(sanitizeAmount(value))
  }, [])

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
