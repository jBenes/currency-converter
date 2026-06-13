import styled, { css } from 'styled-components'

type HeadingSize = 'sm' | 'md' | 'lg' | 'xl'
type HeadingTag = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'

const sizeStyles = {
  sm: css`
    font-size: ${({ theme }) => theme.fontSize.base};
    font-weight: ${({ theme }) => theme.fontWeight.bold};
  `,
  md: css`
    font-size: ${({ theme }) => theme.fontSize.lg};
    font-weight: ${({ theme }) => theme.fontWeight.bold};
  `,
  lg: css`
    font-size: ${({ theme }) => theme.fontSize.xl};
    font-weight: ${({ theme }) => theme.fontWeight.bold};
    letter-spacing: -0.02em;
  `,
  xl: css`
    font-size: ${({ theme }) => theme.fontSize['2xl']};
    font-weight: ${({ theme }) => theme.fontWeight.extrabold};
    letter-spacing: -0.02em;
  `,
}

interface HeadingProps {
  size?: HeadingSize
}

const HeadingStyled = styled.h1<HeadingProps>`
  color: ${({ theme }) => theme.colors.text};
  line-height: ${({ theme }) => theme.lineHeight.tight};
  ${({ size = 'lg' }) => sizeStyles[size]}
`

interface HeadingComponentProps extends HeadingProps {
  as?: HeadingTag
  children: React.ReactNode
}

export function Heading({
  as = 'h1',
  size = 'lg',
  children,
}: HeadingComponentProps) {
  return (
    <HeadingStyled as={as} size={size}>
      {children}
    </HeadingStyled>
  )
}
