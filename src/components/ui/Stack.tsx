import styled from 'styled-components'

interface StackProps {
  $gap?: number
  $align?: 'stretch' | 'center' | 'flex-start' | 'flex-end'
}

const StackStyled = styled.div<StackProps>`
  display: flex;
  flex-direction: column;
  gap: ${({ $gap = 4, theme }) => theme.space[$gap] ?? $gap}px;
  align-items: ${({ $align = 'stretch' }) => $align};
`

interface StackComponentProps {
  gap?: number
  align?: 'stretch' | 'center' | 'flex-start' | 'flex-end'
  children?: React.ReactNode
  className?: string
}

export function Stack({ gap, align, children, className }: StackComponentProps) {
  return (
    <StackStyled $gap={gap} $align={align} className={className}>
      {children}
    </StackStyled>
  )
}
