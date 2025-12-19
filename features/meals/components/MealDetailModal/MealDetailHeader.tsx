'use client'

import { StrapiImage } from '@/shared/components/ui/StrapiImage'
import type { Meal } from '@/types/domain'
import { getText } from '@/shared/utils/i18n'
import { useLanguageStore } from '@/stores/language'
import { IconButton } from '@/shared/components/ui/IconButton'
import { CloseIcon } from '@/shared/components/ui/CloseIcon'

interface MealDetailHeaderProps {
  meal: Meal
  onClose: () => void
}

export function MealDetailHeader({
  meal,
  onClose,
}: MealDetailHeaderProps) {
  const { language } = useLanguageStore()

  return (
    <div className="relative h-64 w-full bg-gray-100">
      {meal.imageUrl && meal.imageUrl.trim() ? (
        <StrapiImage
          src={meal.imageUrl}
          alt={getText(meal.name, language)}
          fill
          className="object-cover"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
          <span className="text-gray-400">No Image</span>
        </div>
      )}
      <IconButton
        onClick={onClose}
        aria-label="Close"
        className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm hover:bg-white"
      >
        <CloseIcon className="w-5 h-5 text-gray-900" />
      </IconButton>
    </div>
  )
}

