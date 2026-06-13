import styled from 'styled-components'
import { Cluster, FlagBadge, Text } from '@/components/ui'
import { formatRate } from '@/lib/money'
import type { CurrencyInfo } from '../currencies'
import type { Rate } from '../types'

const StickyRegion = styled.div`
  position: sticky;
  top: 0;
  z-index: 10;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
  border-radius: ${({ theme }) => theme.radius['2xl']};
  box-shadow: ${({ theme }) => theme.shadow.card};
  padding: ${({ theme }) => `${theme.space[4]}px ${theme.space[5]}px`};
`

const SelectedCurrency = styled.span`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[2]}px;
`

const CurrencyLabel = styled.span`
  font-size: ${({ theme }) => theme.fontSize.md};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  color: ${({ theme }) => theme.colors.text};
`

const CurrencyName = styled.span`
  font-size: ${({ theme }) => theme.fontSize.sm};
  color: ${({ theme }) => theme.colors.textMuted};
`

const RateLine = styled(Text).attrs({ variant: 'subtle' as const })`
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
`

const Dot = styled.span`
  display: inline-block;
  width: 7px;
  height: 7px;
  border-radius: ${({ theme }) => theme.radius.pill};
  background: ${({ theme }) => theme.colors.success};
`

interface ConverterRegionProps {
  currency: CurrencyInfo
  rate: Rate
}

export function ConverterRegion({ currency, rate }: ConverterRegionProps) {
  const normalizedRate = rate.rate / rate.amount

  return (
    <StickyRegion>
      {/* TODO: amount input + result slot goes here */}
      <Cluster justify="space-between" align="center">
        <SelectedCurrency>
          <FlagBadge
            flagCode={currency.flag}
            fallback={currency.symbol}
            size={32}
          />
          <CurrencyLabel>{currency.code}</CurrencyLabel>
          <CurrencyName>{currency.name}</CurrencyName>
        </SelectedCurrency>
        <RateLine>
          <Dot /> 1 {currency.code} = {formatRate(normalizedRate)} CZK
        </RateLine>
      </Cluster>
    </StickyRegion>
  )
}
