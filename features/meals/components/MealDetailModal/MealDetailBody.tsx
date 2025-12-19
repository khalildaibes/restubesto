'use client'

import type { Meal } from '@/types/domain'
import { MealInfo } from './MealInfo'
import { MealIngredients } from './MealIngredients'
import { MealQuantitySelector } from './MealQuantitySelector'

interface MealDetailBodyProps {
  meal: Meal
}

export function MealDetailBody({ meal }: MealDetailBodyProps) {
  return (
    <div className="flex-1 overflow-y-auto p-6">
      <MealInfo meal={meal} />
      <MealIngredients meal={meal} />
      <MealQuantitySelector />
    </div>
  )
}

