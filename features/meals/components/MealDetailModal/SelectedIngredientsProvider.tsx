'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import type { Meal } from '@/types/domain'

const SelectedIngredientsContext = createContext<{
  selected: string[]
  setSelected: (ids: string[]) => void
} | null>(null)

export function useSelectedIngredients() {
  const context = useContext(SelectedIngredientsContext)
  if (!context) {
    throw new Error('useSelectedIngredients must be used within SelectedIngredientsProvider')
  }
  return context
}

interface SelectedIngredientsProviderProps {
  children: ReactNode
  meal: Meal
}

export function SelectedIngredientsProvider({ children, meal }: SelectedIngredientsProviderProps) {
  const [selected, setSelected] = useState<string[]>([])

  useEffect(() => {
    setSelected([])
  }, [meal.id])

  return (
    <SelectedIngredientsContext.Provider value={{ selected, setSelected }}>
      {children}
    </SelectedIngredientsContext.Provider>
  )
}


