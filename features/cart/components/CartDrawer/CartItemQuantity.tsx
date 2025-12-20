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
    <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-1 border border-gray-200">
      <IconButton
        onClick={onDecrease}
        aria-label="Decrease quantity"
        className="w-6 h-6 bg-white hover:bg-gray-100 border-0 shadow-sm transition-colors"
      >
        <svg
          className="w-3.5 h-3.5 text-gray-700"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2.5}
            d="M20 12H4"
          />
        </svg>
      </IconButton>
      <span className="w-8 text-center text-sm font-bold text-gray-900">
        {value}
      </span>
      <IconButton
        onClick={onIncrease}
        aria-label="Increase quantity"
        className="w-6 h-6 bg-white hover:bg-gray-100 border-0 shadow-sm transition-colors"
      >
        <svg
          className="w-3.5 h-3.5 text-gray-700"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2.5}
            d="M12 4v16m8-8H4"
          />
        </svg>
      </IconButton>
    </div>
  )
}

