'use client'

import { useState, useContext, createContext, ReactNode } from 'react'

const QuantityContext = createContext<{
  quantity: number
  setQuantity: (qty: number) => void
} | null>(null)

export function useMealQuantity() {
  const context = useContext(QuantityContext)
  if (!context) {
    throw new Error('useMealQuantity must be used within MealQuantityProvider')
  }
  return context
}

interface MealQuantityProviderProps {
  children: ReactNode
}

export function MealQuantityProvider({ children }: MealQuantityProviderProps) {
  const [quantity, setQuantity] = useState(1)

  return (
    <QuantityContext.Provider value={{ quantity, setQuantity }}>
      {children}
    </QuantityContext.Provider>
  )
}

