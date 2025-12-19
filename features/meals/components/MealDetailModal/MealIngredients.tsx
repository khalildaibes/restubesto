'use client'

import type { Meal } from '@/types/domain'
import { useSelectedIngredients } from './SelectedIngredientsProvider'
import { DefaultIngredientsList } from './DefaultIngredientsList'
import { OptionalIngredientsList } from './OptionalIngredientsList'

interface MealIngredientsProps {
  meal: Meal
}

export function MealIngredients({ meal }: MealIngredientsProps) {
  return (
    <>
      {meal.defaultIngredients && meal.defaultIngredients.length > 0 && (
        <DefaultIngredientsList
          ingredients={meal.defaultIngredients}
          mealId={meal.id}
        />
      )}
      {meal.optionalIngredients && meal.optionalIngredients.length > 0 && (
        <OptionalIngredientsList
          ingredients={meal.optionalIngredients}
          mealId={meal.id}
        />
      )}
    </>
  )
}

