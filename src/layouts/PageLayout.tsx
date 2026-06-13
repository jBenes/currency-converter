import styled from 'styled-components'
import type { ReactNode } from 'react'
import { Header } from './Header'

const PageWrapper = styled.div`
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.colors.page};
`

const Main = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: ${({ theme }) => theme.space[10]}px
    ${({ theme }) => theme.space[6]}px ${({ theme }) => theme.space[9]}px;
`

const ContentColumn = styled.div`
  width: 100%;
  max-width: 480px;
`

interface PageLayoutProps {
  children: ReactNode
}

export function PageLayout({ children }: PageLayoutProps) {
  return (
    <PageWrapper>
      <Header />
      <Main>
        <ContentColumn>{children}</ContentColumn>
      </Main>
    </PageWrapper>
  )
}
