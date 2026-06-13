interface LogoProps {
  size?: number
}

export function Logo({ size = 32 }: LogoProps) {
  const viewHeight = (size / 32) * 34
  return (
    <svg
      width={size}
      height={viewHeight}
      viewBox="0 0 68 72"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Currency Converter logo"
    >
      <path
        d="M64.3718 14.0117C60.0008 9.15706 54.2605 5.74184 47.9086 4.21678C41.5566 2.69171 34.8915 3.1285 28.7928 5.46948C22.6942 7.81046 17.4487 11.9456 13.7487 17.3292C10.0486 22.7128 8.06787 29.0917 8.06787 35.6242C8.06787 42.1567 10.0486 48.5357 13.7487 53.9193C17.4487 59.3028 22.6942 63.438 28.7928 65.779C34.8915 68.12 41.5566 68.5567 47.9086 67.0317C54.2605 65.5066 60.0008 62.0914 64.3718 57.2367"
        stroke="currentColor"
        strokeWidth="6.65"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M53.789 23.5497C51.3468 20.836 48.139 18.9267 44.5892 18.0737C41.0394 17.2208 37.3143 17.4644 33.9058 18.7723C30.4973 20.0802 27.5655 22.391 25.4974 25.3997C23.4294 28.4083 22.3223 31.9734 22.3223 35.6242C22.3223 39.2751 23.4294 42.8401 25.4974 45.8488C27.5655 48.8574 30.4973 51.1682 33.9058 52.4762C37.3143 53.7841 41.0394 54.0277 44.5892 53.1747C48.139 52.3218 51.3468 50.4124 53.789 47.6987"
        stroke="currentColor"
        strokeWidth="6.65"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3.32495 35.625H31.825"
        stroke="currentColor"
        strokeWidth="6.65"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
