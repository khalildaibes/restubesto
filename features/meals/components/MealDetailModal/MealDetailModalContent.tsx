'use client'

import { motion } from 'framer-motion'
import type { Meal } from '@/types/domain'
import { MealDetailHeader } from './MealDetailHeader'
import { MealDetailBody } from './MealDetailBody'
import { MealDetailFooter } from './MealDetailFooter'

interface MealDetailModalContentProps {
  meal: Meal
  onClose: () => void
}

export function MealDetailModalContent({
  meal,
  onClose,
}: MealDetailModalContentProps) {
  return (
    <motion.div
      initial={{ y: '100%', opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: '100%', opacity: 0 }}
      transition={{ type: 'spring', damping: 30, stiffness: 300 }}
      className="relative w-full sm:w-[500px] sm:max-w-[90vw] bg-white rounded-t-3xl sm:rounded-3xl max-h-[90vh] overflow-hidden flex flex-col"
    >
      <MealDetailHeader meal={meal} onClose={onClose} />
      <MealDetailBody meal={meal} />
      <MealDetailFooter meal={meal} onClose={onClose} />
    </motion.div>
  )
}

