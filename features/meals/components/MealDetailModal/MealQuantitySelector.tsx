'use client'

import { useState, useContext, createContext } from 'react'
import { useTranslations } from '@/shared/i18n'
import { QuantityStepper } from '@/shared/components/ui/QuantityStepper'

const QuantityContext = createContext<{
  quantity: number
  setQuantity: (qty: number) => void
} | null>(null)

export function useMealQuantity() {
  const context = useContext(QuantityContext)
  if (!context) {
    throw new Error('useMealQuantity must be used within MealQuantitySelector')
  }
  return context
}

export function MealQuantitySelector() {
  const [quantity, setQuantity] = useState(1)
  const t = useTranslations()

  return (
    <QuantityContext.Provider value={{ quantity, setQuantity }}>
      <div className="flex items-center justify-between mb-6">
        <span className="text-lg font-semibold text-gray-900">
          {t.meal.quantity}
        </span>
        <QuantityStepper
          value={quantity}
          onDecrease={() => setQuantity(Math.max(1, quantity - 1))}
          onIncrease={() => setQuantity(quantity + 1)}
        />
      </div>
    </QuantityContext.Provider>
  )
}

