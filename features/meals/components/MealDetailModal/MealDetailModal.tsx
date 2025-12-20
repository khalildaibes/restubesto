'use client'

import { AnimatePresence } from 'framer-motion'
import type { Meal } from '@/types/domain'
import { MealDetailModalContent } from './MealDetailModalContent'
import { MealDetailModalBackdrop } from './MealDetailModalBackdrop'

interface MealDetailModalProps {
  meal: Meal | null
  onClose: () => void
  initialSelectedIngredients?: string[]
  initialQuantity?: number
  onUpdate?: () => void
}

export function MealDetailModal({ 
  meal, 
  onClose, 
  initialSelectedIngredients = [],
  initialQuantity = 1,
  onUpdate
}: MealDetailModalProps) {
  if (!meal) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center sm:justify-center">
        <MealDetailModalBackdrop onClose={onClose} />
        <MealDetailModalContent 
          meal={meal} 
          onClose={onClose}
          initialSelectedIngredients={initialSelectedIngredients}
          initialQuantity={initialQuantity}
          onUpdate={onUpdate}
        />
      </div>
    </AnimatePresence>
  )
}

