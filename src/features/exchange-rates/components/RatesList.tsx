import { useMemo, useState } from 'react'
import styled from 'styled-components'
import { Stack, Text, Input, FieldRow } from '@/components/ui'
import { SearchIcon } from '@/components/ui/icons'
import { strings } from '@/config'
import type { CurrencyCode, CurrencyInfo } from '../currencies'
import type { Rate } from '../types'
import { RateListItem } from './RateListItem'

const ListContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space[1]}px;
`

const SearchIconWrapper = styled.span`
  color: ${({ theme }) => theme.colors.textMuted};
  display: inline-flex;
  flex-shrink: 0;
`

interface RatesListProps {
  currencies: CurrencyInfo[]
  ratesByCode: Map<string, Rate>
  selectedCode: CurrencyCode | ''
  onSelect: (code: CurrencyCode | null) => void
}

export function RatesList({
  currencies,
  ratesByCode,
  selectedCode,
  onSelect,
}: RatesListProps) {
  const [filter, setFilter] = useState('')

  const filtered = useMemo(() => {
    const q = filter.trim().toLowerCase()
    if (!q) return currencies
    return currencies.filter(
      (c) =>
        c.code.toLowerCase().includes(q) ||
        c.name.toLowerCase().includes(q) ||
        c.country.toLowerCase().includes(q),
    )
  }, [currencies, filter])

  return (
    <Stack gap={3}>
      <FieldRow>
        <SearchIconWrapper>
          <SearchIcon size={16} />
        </SearchIconWrapper>
        <Input
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder={strings.filterPlaceholder}
          aria-label={strings.filterPlaceholder}
        />
      </FieldRow>

      <ListContainer role="listbox" aria-label="Available currencies">
        {filtered.map((currency) => {
          const rate = ratesByCode.get(currency.code)
          if (!rate) return null
          return (
            <RateListItem
              key={currency.code}
              currency={currency}
              rate={rate}
              selected={currency.code === selectedCode}
              onSelect={() => onSelect(currency.code)}
            />
          )
        })}
        {filtered.length === 0 && (
          <Text variant="subtle" align="center">
            {strings.noMatch}
          </Text>
        )}
      </ListContainer>
    </Stack>
  )
}
