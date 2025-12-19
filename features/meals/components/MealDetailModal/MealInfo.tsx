'use client'

import type { Meal } from '@/types/domain'
import { getText, getTag } from '@/shared/utils/i18n'
import { useLanguageStore } from '@/stores/language'
import { useTranslations } from '@/shared/i18n'

interface MealInfoProps {
  meal: Meal
}

export function MealInfo({ meal }: MealInfoProps) {
  const { language } = useLanguageStore()
  const t = useTranslations()

  return (
    <>
      <h2 className="text-2xl font-semibold text-gray-900 mb-2">
        {getText(meal.name, language)}
      </h2>
      <p className="text-gray-600 mb-4">{getText(meal.description, language)}</p>

      {meal.calories && (
        <div className="flex items-center gap-2 mb-4">
          <span className="text-sm text-gray-500">{t.meal.calories}:</span>
          <span className="text-sm font-medium text-gray-900">
            {meal.calories}
          </span>
        </div>
      )}

      {meal.tags && meal.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {meal.tags.map((tag, index) => (
            <span
              key={index}
              className="px-3 py-1 rounded-full bg-gray-100 text-sm text-gray-700"
            >
              {getTag(tag, language)}
            </span>
          ))}
        </div>
      )}
    </>
  )
}

