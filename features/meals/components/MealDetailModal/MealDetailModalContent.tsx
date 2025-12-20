'use client'

import { motion } from 'framer-motion'
import type { Meal } from '@/types/domain'
import { MealDetailHeader } from './MealDetailHeader'
import { MealDetailBody } from './MealDetailBody'
import { MealDetailFooter } from './MealDetailFooter'
import { MealQuantityProvider } from './MealQuantityProvider'
import { SelectedIngredientsProvider } from './SelectedIngredientsProvider'

interface MealDetailModalContentProps {
  meal: Meal
  onClose: () => void
  initialSelectedIngredients?: string[]
  initialQuantity?: number
  onUpdate?: () => void
}

export function MealDetailModalContent({
  meal,
  onClose,
  initialSelectedIngredients = [],
  initialQuantity = 1,
  onUpdate,
}: MealDetailModalContentProps) {
  return (
    <MealQuantityProvider initialQuantity={initialQuantity}>
      <SelectedIngredientsProvider 
        meal={meal}
        initialSelected={initialSelectedIngredients}
      >
        <motion.div
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          className="relative w-full sm:w-[500px] sm:max-w-[90vw] bg-white rounded-t-3xl sm:rounded-3xl max-h-[90vh] overflow-hidden flex flex-col"
        >
          <MealDetailHeader meal={meal} onClose={onClose} />
          <MealDetailBody meal={meal} />
          <MealDetailFooter meal={meal} onClose={onClose} onUpdate={onUpdate} />
        </motion.div>
      </SelectedIngredientsProvider>
    </MealQuantityProvider>
  )
}

