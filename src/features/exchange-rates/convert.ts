import type { Rate } from './types'

type RateInput = Pick<Rate, 'amount' | 'rate'>

export function toForeign(czk: number, rate: RateInput): number {
  return (czk * rate.amount) / rate.rate
}
