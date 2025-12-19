import { IconButton } from '../IconButton'

interface QuantityStepperProps {
  value: number
  onDecrease: () => void
  onIncrease: () => void
  min?: number
}

export function QuantityStepper({
  value,
  onDecrease,
  onIncrease,
  min = 1,
}: QuantityStepperProps) {
  return (
    <div className="flex items-center gap-4">
      <IconButton
        onClick={onDecrease}
        aria-label="Decrease quantity"
        className="w-10 h-10 border border-gray-300"
      >
        <svg
          className="w-5 h-5 text-gray-900"
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
      <span className="text-xl font-semibold text-gray-900 w-8 text-center">
        {value}
      </span>
      <IconButton
        onClick={onIncrease}
        aria-label="Increase quantity"
        className="w-10 h-10 border border-gray-300"
      >
        <svg
          className="w-5 h-5 text-gray-900"
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

