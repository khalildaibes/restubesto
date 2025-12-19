'use client'

import type { Ingredient } from '@/types/domain'
import { getText } from '@/shared/utils/i18n'
import { useLanguageStore } from '@/stores/language'
import { useTranslations } from '@/shared/i18n'
import { CheckIcon } from '@/shared/components/ui/CheckIcon'
import { useSelectedIngredients } from './MealIngredients'

interface OptionalIngredientsListProps {
  ingredients: Ingredient[]
  mealId: string
}

export function OptionalIngredientsList({
  ingredients,
}: OptionalIngredientsListProps) {
  const { selected, setSelected } = useSelectedIngredients()

  const toggle = (id: string) => {
    setSelected(
      selected.includes(id)
        ? selected.filter((i) => i !== id)
        : [...selected, id]
    )
  }
  const { language } = useLanguageStore()
  const t = useTranslations()

  return (
    <div className="mb-6">
      <h3 className="text-sm font-semibold text-gray-900 mb-3">
        {t.meal.optionalIngredients}
      </h3>
      <div className="flex flex-wrap gap-2">
        {ingredients.map((ingredient) => {
          const isSelected = selected.includes(ingredient.id)
          return (
            <button
              key={ingredient.id}
              onClick={() => toggle(ingredient.id)}
              className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                isSelected
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <span className="flex items-center gap-2">
                {getText(ingredient.name, language)}
                {ingredient.price > 0 && (
                  <span className="text-xs opacity-80">
                    +₪{ingredient.price}
                  </span>
                )}
                {isSelected && <CheckIcon className="w-4 h-4" />}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

