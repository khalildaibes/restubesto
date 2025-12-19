import { ButtonHTMLAttributes } from 'react'
import { cn } from '@/shared/utils/cn'

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  'aria-label': string
}

export function IconButton({
  className,
  children,
  ...props
}: IconButtonProps) {
  return (
    <button
      className={cn(
        'rounded-full flex items-center justify-center transition-colors',
        'hover:bg-gray-100 active:scale-95',
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}

