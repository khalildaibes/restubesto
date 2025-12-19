interface ChevronIconProps {
  className?: string
  direction?: 'up' | 'down' | 'left' | 'right'
}

export function ChevronIcon({
  className,
  direction = 'down',
}: ChevronIconProps) {
  const rotations = {
    up: 'rotate-180',
    down: '',
    left: 'rotate-90',
    right: '-rotate-90',
  }

  return (
    <svg
      className={`${className} ${rotations[direction]}`}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M19 9l-7 7-7-7"
      />
    </svg>
  )
}

