import { useState, useEffect } from 'react'
import type { Meal } from '@/types/domain'

export function useMealIngredients(meal: Meal | null) {
  const [selected, setSelected] = useState<string[]>([])

  useEffect(() => {
    if (meal) {
      setSelected([])
    }
  }, [meal?.id])

  const toggle = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    )
  }

  return { selected, toggle }
}

