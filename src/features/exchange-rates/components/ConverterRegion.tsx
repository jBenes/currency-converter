import styled from 'styled-components'
import {
  Stack,
  Input,
  FieldRow,
  FlagBadge,
  Label,
  StatusDot,
} from '@/components/ui'
import type { Theme } from '@/theme'
import { formatRate } from '@/lib/money'
import { strings } from '@/config'
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
  padding: ${({ theme }) =>
    `${theme.space[4]}px ${theme.space[5]}px ${theme.space[4]}px`};
`

const CurrencyTag = styled.span`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[2]}px;
  flex-shrink: 0;
`

const CurrencyCode = styled.span`
  font-size: ${({ theme }) => theme.fontSize.base};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  color: ${({ theme }) => theme.colors.text};
`

const RateFooter = styled.div`
  padding-top: ${({ theme }) => theme.space[4]}px;
  display: flex;
  align-items: center;
  justify-content: left;
  gap: ${({ theme }) => theme.space[3]}px;
  font-size: ${({ theme }) => theme.fontSize.sm};
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
  font-variant-numeric: tabular-nums;
  color: ${({ theme }) => theme.colors.text};
`

const ResultRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[3]}px;
  padding: ${({ theme }) =>
    `${theme.space[1]}px calc(${theme.space[3]}px + 1.5px)`};
`

const ResultValue = styled.span.attrs({
  'aria-live': 'polite' as const,
  'aria-atomic': true,
})<{ theme: Theme }>`
  flex: 1;
  min-width: 0;
  display: block;
  text-align: right;
  font-size: ${({ theme }) => theme.fontSize.xl};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  letter-spacing: -0.02em;
  font-variant-numeric: tabular-nums;
  color: ${({ theme }) => theme.colors.accent};
`

interface ConverterRegionProps {
  currency: CurrencyInfo
  rate: Rate
  czkValue: string
  foreignValue: string
  onCzkChange: (value: string) => void
}

export function ConverterRegion({
  currency,
  rate,
  czkValue,
  foreignValue,
  onCzkChange,
}: ConverterRegionProps) {
  const normalizedRate = rate.rate / rate.amount

  return (
    <StickyRegion>
      <Stack gap={2}>
        <div>
          <Label htmlFor="czk-input">{strings.labelFrom}</Label>
          <FieldRow>
            <CurrencyTag>
              <FlagBadge flagCode="cz" fallback="Kč" size={34} />
              <CurrencyCode>CZK</CurrencyCode>
            </CurrencyTag>
            <Input
              id="czk-input"
              numeric
              inputMode="decimal"
              placeholder="0"
              value={czkValue}
              onChange={(e) => onCzkChange(e.target.value)}
            />
          </FieldRow>
        </div>

        <div>
          <Label as="span" id="result-label">
            {strings.labelTo}
          </Label>
          <ResultRow>
            <CurrencyTag>
              <FlagBadge
                flagCode={currency.flag}
                fallback={currency.symbol}
                size={34}
              />
              <CurrencyCode>{currency.code}</CurrencyCode>
            </CurrencyTag>
            <ResultValue aria-label={`Result in ${currency.code}`}>
              {foreignValue || '0'}
            </ResultValue>
          </ResultRow>
        </div>
      </Stack>

      <RateFooter>
        <StatusDot />1 {currency.code} = {formatRate(normalizedRate)} CZK
      </RateFooter>
    </StickyRegion>
  )
}
