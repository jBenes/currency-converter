export interface Rate {
  country: string
  currencyName: string
  amount: number
  code: string
  rate: number
}

export interface ExchangeRates {
  dateText: string
  date: Date | null
  sequence: number
  rates: Rate[]
}
