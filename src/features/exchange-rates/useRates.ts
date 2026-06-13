import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { fetchRates } from './client'
import { selectAvailableCurrencies } from './currencies'
import type { Rate } from './types'
import type { CurrencyInfo } from './currencies'

const EMPTY_CURRENCIES: CurrencyInfo[] = []
const EMPTY_RATES_MAP = new Map<string, Rate>()

export function useRates() {
  const query = useQuery({
    queryKey: ['rates'],
    queryFn: fetchRates,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchInterval: ({ state }) =>
      state.status === 'error' ? 30_000 : false,
  })

  const currencies = useMemo(
    () => (query.data ? selectAvailableCurrencies(query.data.rates) : EMPTY_CURRENCIES),
    [query.data],
  )

  const ratesByCode = useMemo(() => {
    if (!query.data) return EMPTY_RATES_MAP
    return new Map(query.data.rates.map((r) => [r.code, r]))
  }, [query.data])

  return { ...query, currencies, ratesByCode }
}
