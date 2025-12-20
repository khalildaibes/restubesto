'use client'

import { useContext } from 'react'
import type { Meal } from '@/types/domain'
import { useCartStore } from '@/stores/cart'
import { getText } from '@/shared/utils/i18n'
import { useLanguageStore } from '@/stores/language'
import { useTranslations } from '@/shared/i18n'
import { Button } from '@/shared/components/ui/Button'
import { useMealQuantity } from './MealQuantityProvider'
import { useSelectedIngredients } from './SelectedIngredientsProvider'

interface MealDetailFooterProps {
  meal: Meal
  onClose: () => void
  onUpdate?: () => void
}

export function MealDetailFooter({ meal, onClose, onUpdate }: MealDetailFooterProps) {
  const { quantity } = useMealQuantity()
  const { selected } = useSelectedIngredients()
  const addItem = useCartStore((state) => state.addItem)
  const { language } = useLanguageStore()
  const t = useTranslations()
  const isEditMode = !!onUpdate
  const isAvailable = meal.available !== false // Default to true if not specified

  const handleAddToCart = () => {
    if (!isAvailable) {
      alert('This meal is currently out of stock')
      return
    }
    const optionalTotal =
      meal.optionalIngredients
        ?.filter((ing) => selected.includes(ing.id))
        .reduce((sum, ing) => sum + ing.price, 0) || 0

    // Get selected optional ingredients
    const selectedIngredients = meal.optionalIngredients
      ?.filter((ing) => selected.includes(ing.id))
      .map((ing) => ({
        id: ing.id,
        name: getText(ing.name, language),
        price: ing.price,
      })) || []

    const itemToAdd = {
      mealId: meal.id,
      name: getText(meal.name, language),
      price: meal.price + optionalTotal, // Total price including selected ingredients
      imageUrl: meal.imageUrl,
      ...(selectedIngredients.length > 0 && { selectedIngredients }),
    }

    for (let i = 0; i < quantity; i++) {
      addItem(itemToAdd)
    }
    
    // If editing, call onUpdate to remove old item
    if (onUpdate) {
      onUpdate()
    } else {
      onClose()
    }
  }

  const totalPrice =
    (meal.price +
      (meal.optionalIngredients
        ?.filter((ing) => selected.includes(ing.id))
        .reduce((sum, ing) => sum + ing.price, 0) || 0)) *
    quantity

  if (!isAvailable) {
    return (
      <div className="p-6 border-t border-gray-100">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
          <p className="text-red-700 font-semibold mb-1">Out of Stock</p>
          <p className="text-sm text-red-600">This meal is currently unavailable</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 border-t border-gray-100">
      <Button
        onClick={handleAddToCart}
        className="w-full py-4 text-lg"
      >
        {isEditMode ? 'Update Cart' : t.meal.addToCart} • ₪{totalPrice}
      </Button>
    </div>
  )
}

