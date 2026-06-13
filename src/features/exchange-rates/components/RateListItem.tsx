import styled from 'styled-components'
import { FlagBadge } from './FlagBadge'
import { formatRate } from '@/lib/money'
import type { CurrencyInfo } from '../currencies'
import type { Rate } from '../types'

const Row = styled.button<{ $selected: boolean }>`
  width: 100%;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[3]}px;
  padding: ${({ theme }) => `${theme.space[3]}px ${theme.space[3]}px`};
  border: none;
  border-radius: ${({ theme }) => theme.radius.lg};
  background: ${({ theme, $selected }) =>
    $selected ? theme.colors.surfaceSelected : 'transparent'};
  cursor: pointer;
  text-align: left;
  font-family: inherit;
  transition: background 0.12s;

  &:hover {
    background: ${({ theme, $selected }) =>
      $selected ? theme.colors.surfaceSelected : theme.colors.surfaceField};
  }
`

const CurrencyDetails = styled.span`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
`

const CurrencyCode = styled.span`
  font-size: ${({ theme }) => theme.fontSize.md};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  color: ${({ theme }) => theme.colors.text};
`

const CurrencyName = styled.span`
  font-size: ${({ theme }) => theme.fontSize.sm};
  color: ${({ theme }) => theme.colors.textMuted};
`

const RateValue = styled.span`
  font-size: ${({ theme }) => theme.fontSize.sm};
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.textSubtle};
  white-space: nowrap;
  font-variant-numeric: tabular-nums;
`

interface RateListItemProps {
  currency: CurrencyInfo
  rate: Rate
  selected: boolean
  onSelect: () => void
}

export function RateListItem({
  currency,
  rate,
  selected,
  onSelect,
}: RateListItemProps) {
  const normalizedRate = rate.rate / rate.amount

  return (
    <Row
      $selected={selected}
      onClick={onSelect}
      role="listitem"
      aria-current={selected || undefined}
      aria-label={`${currency.name} (${currency.code})`}
    >
      <FlagBadge flagCode={currency.flag} fallback={currency.symbol} />
      <CurrencyDetails>
        <CurrencyCode>{currency.code}</CurrencyCode>
        <CurrencyName>{currency.name}</CurrencyName>
      </CurrencyDetails>
      <RateValue>{formatRate(normalizedRate)} CZK</RateValue>
    </Row>
  )
}
