'use client'

import { useContext } from 'react'
import type { Meal } from '@/types/domain'
import { useCartStore } from '@/stores/cart'
import { getText } from '@/shared/utils/i18n'
import { useLanguageStore } from '@/stores/language'
import { useTranslations } from '@/shared/i18n'
import { Button } from '@/shared/components/ui/Button'
import { useMealQuantity } from './MealQuantitySelector'
import { useSelectedIngredients } from './MealIngredients'

interface MealDetailFooterProps {
  meal: Meal
  onClose: () => void
}

export function MealDetailFooter({ meal, onClose }: MealDetailFooterProps) {
  const { quantity } = useMealQuantity()
  const { selected } = useSelectedIngredients()
  const addItem = useCartStore((state) => state.addItem)
  const { language } = useLanguageStore()
  const t = useTranslations()

  const handleAddToCart = () => {
    const optionalTotal =
      meal.optionalIngredients
        ?.filter((ing) => selected.includes(ing.id))
        .reduce((sum, ing) => sum + ing.price, 0) || 0

    const ingredients = meal.optionalIngredients
      ?.filter((ing) => selected.includes(ing.id))
      .map((ing) => ({
        id: ing.id,
        name: getText(ing.name, language),
        price: ing.price,
      })) || []

    const itemToAdd = {
      mealId: meal.id,
      name: getText(meal.name, language),
      price: meal.price + optionalTotal,
      imageUrl: meal.imageUrl,
      ...(ingredients.length > 0 && { selectedIngredients: ingredients }),
    }

    for (let i = 0; i < quantity; i++) {
      addItem(itemToAdd)
    }
    onClose()
  }

  const totalPrice =
    (meal.price +
      (meal.optionalIngredients
        ?.filter((ing) => selected.includes(ing.id))
        .reduce((sum, ing) => sum + ing.price, 0) || 0)) *
    quantity

  return (
    <div className="p-6 border-t border-gray-100">
      <Button
        onClick={handleAddToCart}
        className="w-full py-4 text-lg"
      >
        {t.meal.addToCart} • ₪{totalPrice}
      </Button>
    </div>
  )
}

