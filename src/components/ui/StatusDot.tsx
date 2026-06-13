import styled from 'styled-components'

export const StatusDot = styled.span.attrs({ 'aria-hidden': true })`
  display: inline-block;
  width: 7px;
  height: 7px;
  border-radius: ${({ theme }) => theme.radius.pill};
  background: ${({ theme }) => theme.colors.success};
`
