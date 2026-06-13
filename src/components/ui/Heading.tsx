import styled from 'styled-components'

type HeadingTag = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'

const HeadingStyled = styled.h1`
  color: ${({ theme }) => theme.colors.text};
  line-height: ${({ theme }) => theme.lineHeight.tight};
  font-size: ${({ theme }) => theme.fontSize.xl};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  letter-spacing: -0.02em;
`

interface HeadingComponentProps {
  as?: HeadingTag
  children: React.ReactNode
}

export function Heading({ as = 'h1', children }: HeadingComponentProps) {
  return <HeadingStyled as={as}>{children}</HeadingStyled>
}
