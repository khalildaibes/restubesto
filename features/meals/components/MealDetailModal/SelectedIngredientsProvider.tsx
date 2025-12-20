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
  initialSelected?: string[]
}

export function SelectedIngredientsProvider({ 
  children, 
  meal,
  initialSelected = []
}: SelectedIngredientsProviderProps) {
  const [selected, setSelected] = useState<string[]>(initialSelected)

  useEffect(() => {
    // Reset to initial selected when meal changes, or use initialSelected if provided
    if (initialSelected.length > 0) {
      setSelected(initialSelected)
    } else {
      setSelected([])
    }
  }, [meal.id, initialSelected])

  return (
    <SelectedIngredientsContext.Provider value={{ selected, setSelected }}>
      {children}
    </SelectedIngredientsContext.Provider>
  )
}


