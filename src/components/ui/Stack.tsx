import styled from 'styled-components'

interface StackProps {
  gap?: number
  align?: 'stretch' | 'center' | 'flex-start' | 'flex-end'
}

export const Stack = styled.div<StackProps>`
  display: flex;
  flex-direction: column;
  gap: ${({ gap = 4, theme }) => theme.space[gap] ?? gap}px;
  align-items: ${({ align = 'stretch' }) => align};
`
