import { useMemo } from 'react'
import type { Meal } from '@/types/domain'

interface UseMealPriceProps {
  meal: Meal
  selectedIngredientIds: string[]
  quantity: number
}

export function useMealPrice({
  meal,
  selectedIngredientIds,
  quantity,
}: UseMealPriceProps) {
  return useMemo(() => {
    const optionalTotal =
      meal.optionalIngredients
        ?.filter((ing) => selectedIngredientIds.includes(ing.id))
        .reduce((sum, ing) => sum + ing.price, 0) || 0

    return (meal.price + optionalTotal) * quantity
  }, [meal, selectedIngredientIds, quantity])
}

