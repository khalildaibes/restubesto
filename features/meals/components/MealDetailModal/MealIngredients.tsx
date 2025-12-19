'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import type { Meal } from '@/types/domain'
import { DefaultIngredientsList } from './DefaultIngredientsList'
import { OptionalIngredientsList } from './OptionalIngredientsList'

const SelectedIngredientsContext = createContext<{
  selected: string[]
  setSelected: (ids: string[]) => void
} | null>(null)

export function useSelectedIngredients() {
  const context = useContext(SelectedIngredientsContext)
  if (!context) {
    throw new Error('useSelectedIngredients must be used within MealIngredients')
  }
  return context
}

interface MealIngredientsProps {
  meal: Meal
}

export function MealIngredients({ meal }: MealIngredientsProps) {
  const [selected, setSelected] = useState<string[]>([])

  useEffect(() => {
    setSelected([])
  }, [meal.id])

  return (
    <SelectedIngredientsContext.Provider value={{ selected, setSelected }}>
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
    </SelectedIngredientsContext.Provider>
  )
}

