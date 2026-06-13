import styled from 'styled-components'
import { Logo } from '@/components/ui/Logo'
import { ThemeToggle } from '@/components/ThemeToggle'
import { strings } from '@/config'

const StyledHeader = styled.header`
  background: ${({ theme }) => theme.colors.header};
  box-shadow: ${({ theme }) => theme.shadow.header};
`

const HeaderInner = styled.div`
  max-width: ${({ theme }) => theme.layout.containerMaxWidth}px;
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.space[8]}px;
  height: ${({ theme }) => theme.layout.headerHeight}px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const BrandMark = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: ${({ theme }) => theme.size.control}px;
  height: ${({ theme }) => theme.size.control}px;
  color: ${({ theme }) => theme.header.text};
`

const Brand = styled.span`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[3]}px;
`

const BrandName = styled.span`
  color: ${({ theme }) => theme.header.text};
  font-size: ${({ theme }) => theme.fontSize.lg};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  letter-spacing: -0.01em;
`

export function Header() {
  return (
    <StyledHeader>
      <HeaderInner>
        <Brand>
          <BrandMark>
            <Logo size={32} />
          </BrandMark>
          <BrandName>{strings.brandName}</BrandName>
        </Brand>
        <ThemeToggle />
      </HeaderInner>
    </StyledHeader>
  )
}
