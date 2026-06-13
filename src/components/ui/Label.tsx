import styled from 'styled-components'

export const Label = styled.label`
  display: block;
  font-size: ${({ theme }) => theme.fontSize.xs};
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.textLabel};
  margin-bottom: ${({ theme }) => theme.space[2]}px;
`
