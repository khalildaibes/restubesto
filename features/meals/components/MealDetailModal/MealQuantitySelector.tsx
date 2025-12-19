'use client'

import { useContext } from 'react'
import { useTranslations } from '@/shared/i18n'
import { QuantityStepper } from '@/shared/components/ui/QuantityStepper'
import { useMealQuantity } from './MealQuantityProvider'

export function MealQuantitySelector() {
  const { quantity, setQuantity } = useMealQuantity()
  const t = useTranslations()

  return (
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
  )
}

