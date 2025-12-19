import { IconButton } from '@/shared/components/ui/IconButton'

interface CartItemQuantityProps {
  value: number
  onDecrease: () => void
  onIncrease: () => void
}

export function CartItemQuantity({
  value,
  onDecrease,
  onIncrease,
}: CartItemQuantityProps) {
  return (
    <div className="flex items-center gap-3">
      <IconButton
        onClick={onDecrease}
        aria-label="Decrease quantity"
        className="w-8 h-8 border border-gray-300 hover:bg-white"
      >
        <svg
          className="w-4 h-4 text-gray-900"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20 12H4"
          />
        </svg>
      </IconButton>
      <span className="w-6 text-center font-semibold text-gray-900">
        {value}
      </span>
      <IconButton
        onClick={onIncrease}
        aria-label="Increase quantity"
        className="w-8 h-8 border border-gray-300 hover:bg-white"
      >
        <svg
          className="w-4 h-4 text-gray-900"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4v16m8-8H4"
          />
        </svg>
      </IconButton>
    </div>
  )
}

