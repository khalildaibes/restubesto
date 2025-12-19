'use client'

import type { Ingredient } from '@/types/domain'
import { getText } from '@/shared/utils/i18n'
import { useLanguageStore } from '@/stores/language'
import { useTranslations } from '@/shared/i18n'

interface DefaultIngredientsListProps {
  ingredients: Ingredient[]
  mealId: string
}

export function DefaultIngredientsList({
  ingredients,
}: DefaultIngredientsListProps) {
  const { language } = useLanguageStore()
  const t = useTranslations()

  return (
    <div className="mb-6">
      <h3 className="text-sm font-semibold text-gray-900 mb-3">
        {t.meal.defaultIngredients}
      </h3>
      <div className="flex flex-wrap gap-2">
        {ingredients.map((ingredient) => (
          <span
            key={ingredient.id}
            className="px-3 py-1.5 rounded-full bg-gray-100 text-sm text-gray-700"
          >
            {getText(ingredient.name, language)}
          </span>
        ))}
      </div>
    </div>
  )
}

