'use client'

import { useState, useContext, createContext, ReactNode, useEffect } from 'react'

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
  initialQuantity?: number
}

export function MealQuantityProvider({ children, initialQuantity = 1 }: MealQuantityProviderProps) {
  const [quantity, setQuantity] = useState(initialQuantity)

  useEffect(() => {
    setQuantity(initialQuantity)
  }, [initialQuantity])

  return (
    <QuantityContext.Provider value={{ quantity, setQuantity }}>
      {children}
    </QuantityContext.Provider>
  )
}


