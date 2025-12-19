import type { Meal } from '@/types/domain'
import type { Language } from '@/types/i18n'
import { getText } from '@/shared/utils/i18n'

interface MealCardContentProps {
  meal: Meal
  language: Language
}

export function MealCardContent({
  meal,
  language,
}: MealCardContentProps) {
  return (
    <div className="flex-1 text-left">
      <h3 className="text-lg font-semibold text-gray-900 mb-1">
        {getText(meal.name, language)}
      </h3>
      <p className="text-sm text-gray-600 line-clamp-2">
        {getText(meal.description, language)}
      </p>
      <p className="text-lg font-bold text-gray-900 mt-2">₪{meal.price}</p>
    </div>
  )
}

