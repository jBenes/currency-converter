import styled from 'styled-components'
import { flagUrls } from '@/config'

const Badge = styled.span<{ $size: number }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: ${({ $size }) => $size}px;
  height: ${({ $size }) => $size}px;
  border-radius: ${({ theme }) => theme.radius.pill};
  background: ${({ theme }) => theme.colors.badgeBg};
  border: 1px solid ${({ theme }) => theme.colors.surfaceBorder};
  overflow: hidden;
  flex-shrink: 0;
`

const FlagImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`

const FallbackText = styled.span`
  font-size: ${({ theme }) => theme.fontSize.md};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  color: ${({ theme }) => theme.colors.accent};
`

interface FlagBadgeProps {
  flagCode: string | null
  fallback: string
  size?: number
}

export function FlagBadge({ flagCode, fallback, size = 36 }: FlagBadgeProps) {
  const url = flagCode ? flagUrls[flagCode] : undefined

  return (
    <Badge $size={size} aria-hidden="true">
      {url ? (
        <FlagImg src={url} alt="" />
      ) : (
        <FallbackText>{fallback}</FallbackText>
      )}
    </Badge>
  )
}
