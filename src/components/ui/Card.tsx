import styled from 'styled-components'

export const Card = styled.div`
  width: 100%;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
  border-radius: ${({ theme }) => theme.radius['2xl']};
  box-shadow: ${({ theme }) => theme.shadow.card};
  padding: ${({ theme }) => `${theme.space[7]}px ${theme.space[6]}px ${theme.space[6]}px`};
`
