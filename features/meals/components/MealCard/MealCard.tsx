'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
    >
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onClick}
        className="w-full bg-white rounded-2xl p-4 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow"
      >
        <div className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
          {meal.imageUrl && meal.imageUrl.trim() ? (
            <Image
              src={meal.imageUrl}
              alt={getText(meal.name, language)}
              fill
              className="object-cover"
              unoptimized={meal.imageUrl.startsWith('http://')}
              onError={(e) => {
                console.error(`Failed to load image for meal ${meal.id}:`, meal.imageUrl)
              }}
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

