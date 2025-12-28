'use client'

import { motion } from 'framer-motion'
import { StrapiImage } from '@/shared/components/ui/StrapiImage'
import type { Drink } from '@/types/domain'
import { getText } from '@/shared/utils/i18n'
import { useLanguageStore } from '@/stores/language'
import { useCartStore } from '@/stores/cart'

interface DrinkCardProps {
  drink: Drink
  onClick: () => void
  index: number
}

export function DrinkCard({ drink, onClick, index }: DrinkCardProps) {
  const { language } = useLanguageStore()
  const addItem = useCartStore((state) => state.addItem)

  const isAvailable = drink.available !== false // Default to true if not specified

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (isAvailable) {
      addItem({
        type: 'drink',
        drinkId: drink.id,
        name: getText(drink.name, language),
        price: drink.price,
        imageUrl: drink.imageUrl,
      })
    }
  }

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
      <motion.div
        whileHover={isAvailable ? { scale: 1.02 } : {}}
        whileTap={isAvailable ? { scale: 0.98 } : {}}
        className={`w-full bg-white rounded-2xl p-4 flex items-center gap-4 shadow-sm transition-shadow ${
          isAvailable 
            ? 'hover:shadow-md' 
            : 'opacity-60'
        }`}
      >
        <div className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
          {drink.imageUrl && drink.imageUrl.trim() ? (
            <StrapiImage
              src={drink.imageUrl}
              alt={getText(drink.name, language)}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-400 text-xs">No Image</span>
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 text-lg mb-1 truncate">
            {getText(drink.name, language)}
          </h3>
          {drink.description && (
            <p className="text-sm text-gray-600 line-clamp-2 mb-2">
              {getText(drink.description, language)}
            </p>
          )}
          {drink.volume && (
            <p className="text-xs text-gray-500 mb-2">{drink.volume}</p>
          )}
          <div className="flex items-center justify-between">
            <span className="text-xl font-bold text-gray-900">
              ₪{drink.price.toFixed(2)}
            </span>
            <button
              onClick={handleAddToCart}
              disabled={!isAvailable}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                isAvailable
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Add
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}




