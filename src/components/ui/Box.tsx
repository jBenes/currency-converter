import styled from 'styled-components'

interface BoxProps {
  p?: number
  px?: number
  py?: number
}

export const Box = styled.div<BoxProps>`
  padding: ${({ p, px, py, theme }) => {
    if (p !== undefined) return `${theme.space[p] ?? p}px`
    const x = px !== undefined ? `${theme.space[px] ?? px}px` : '0'
    const y = py !== undefined ? `${theme.space[py] ?? py}px` : '0'
    return `${y} ${x}`
  }};
`
