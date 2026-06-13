import styled from 'styled-components'

interface ClusterProps {
  gap?: number
  align?: 'stretch' | 'center' | 'flex-start' | 'flex-end' | 'baseline'
  justify?:
    | 'flex-start'
    | 'flex-end'
    | 'center'
    | 'space-between'
    | 'space-around'
}

export const Cluster = styled.div<ClusterProps>`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ gap = 4, theme }) => theme.space[gap] ?? gap}px;
  align-items: ${({ align = 'center' }) => align};
  justify-content: ${({ justify = 'flex-start' }) => justify};
`
