'use client'

import { motion } from 'framer-motion'
import { StrapiImage } from '@/shared/components/ui/StrapiImage'
import type { Meal } from '@/types/domain'
import { getText } from '@/shared/utils/i18n'
import { useLanguageStore } from '@/stores/language'
import { MealCardContent } from './MealCardContent'

interface MealCardProps {
  meal: Meal
  onClick: () => void
  index: number
}

export function MealCard({ meal, onClick, index }: MealCardProps) {
  const { language } = useLanguageStore()

  const isAvailable = meal.available !== false // Default to true if not specified

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      className="relative"
    >
      {!isAvailable && (
        <div className="absolute inset-0 z-10 bg-gray-900/50 rounded-2xl flex items-center justify-center">
          <span className="bg-red-500 text-white px-4 py-2 rounded-lg font-semibold text-sm">
            Out of Stock
          </span>
        </div>
      )}
      <motion.button
        whileHover={isAvailable ? { scale: 1.02 } : {}}
        whileTap={isAvailable ? { scale: 0.98 } : {}}
        onClick={isAvailable ? onClick : undefined}
        disabled={!isAvailable}
        className={`w-full bg-white rounded-2xl p-4 flex items-center gap-4 shadow-sm transition-shadow ${
          isAvailable 
            ? 'hover:shadow-md cursor-pointer' 
            : 'opacity-60 cursor-not-allowed'
        }`}
      >
        <div className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
          {meal.imageUrl && meal.imageUrl.trim() ? (
            <StrapiImage
              src={meal.imageUrl}
              alt={getText(meal.name, language)}
              fill
              className={`object-cover ${!isAvailable ? 'grayscale' : ''}`}
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
              <span className="text-gray-400 text-xs">No Image</span>
            </div>
          )}
        </div>
        <MealCardContent meal={meal} language={language} />
      </motion.button>
    </motion.div>
  )
}

