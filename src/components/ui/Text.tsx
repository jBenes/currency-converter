import styled, { css } from 'styled-components'

type TextVariant = 'body' | 'muted' | 'subtle'
type TextAlign = 'left' | 'center' | 'right'

const variantStyles = {
  body: css`
    font-size: ${({ theme }) => theme.fontSize.md};
    color: ${({ theme }) => theme.colors.text};
  `,
  muted: css`
    font-size: ${({ theme }) => theme.fontSize.md};
    color: ${({ theme }) => theme.colors.textMuted};
  `,
  subtle: css`
    font-size: ${({ theme }) => theme.fontSize.sm};
    color: ${({ theme }) => theme.colors.textSubtle};
    line-height: ${({ theme }) => theme.lineHeight.relaxed};
  `,
}

interface TextStyledProps {
  $variant?: TextVariant
  $align?: TextAlign
}

const TextStyled = styled.span<TextStyledProps>`
  line-height: ${({ theme }) => theme.lineHeight.normal};
  ${({ $variant = 'body' }) => variantStyles[$variant]}
  ${({ $align }) => $align && `text-align: ${$align};`}
`

interface TextComponentProps {
  variant?: TextVariant
  align?: TextAlign
  children?: React.ReactNode
  className?: string
  as?: React.ElementType
}

export function Text({ variant, align, children, className, as }: TextComponentProps) {
  return (
    <TextStyled $variant={variant} $align={align} className={className} as={as}>
      {children}
    </TextStyled>
  )
}
