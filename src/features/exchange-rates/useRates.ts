import { useQuery } from '@tanstack/react-query'
import { fetchRates } from './client'

export function useRates() {
  return useQuery({
    queryKey: ['rates'],
    queryFn: fetchRates,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  })
}
