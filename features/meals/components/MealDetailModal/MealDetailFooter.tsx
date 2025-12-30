'use client'

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

    // Calculate effective price for this item
    const isSalad = meal.categorySlug && 
      (meal.categorySlug.toLowerCase() === 'salads' || 
       meal.categorySlug.toLowerCase() === 'salad' || 
       meal.categorySlug.toLowerCase().includes('salad'))
    
    const currentItems = useCartStore.getState().items
    const hasNonSaladMeals = currentItems.some(
      (i) => i.type === 'meal' && 
      !(i.categorySlug && (i.categorySlug.toLowerCase() === 'salads' || 
         i.categorySlug.toLowerCase() === 'salad' || 
         i.categorySlug.toLowerCase().includes('salad')))
    )
    
    let itemPrice = meal.price + optionalTotal
    if (isSalad) {
      if (hasNonSaladMeals) {
        itemPrice = 0 // Free when there's a meal
      } else {
        // Check if there are already salads in cart
        const saladItems = currentItems.filter(
          (i) => i.type === 'meal' && i.categorySlug && 
          (i.categorySlug.toLowerCase() === 'salads' || 
           i.categorySlug.toLowerCase() === 'salad' || 
           i.categorySlug.toLowerCase().includes('salad'))
        )
        if (saladItems.length === 0) {
          // First salad gets 60 NIS
          itemPrice = 60
        } else {
          // Additional salads are free (60 NIS covers all)
          itemPrice = 0
        }
      }
    }
    
    const itemToAdd = {
      type: 'meal' as const,
      mealId: meal.id,
      name: getText(meal.name, language),
      price: itemPrice, // Effective price (may be 0 for free salads or 60 for first salad)
      imageUrl: meal.imageUrl,
      categorySlug: meal.categorySlug, // Include categorySlug to identify salads
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

  // Calculate base price
  const basePrice = meal.price +
    (meal.optionalIngredients
      ?.filter((ing) => selected.includes(ing.id))
      .reduce((sum, ing) => sum + ing.price, 0) || 0)
  
  // Check if this is a salad
  const isSalad = meal.categorySlug && 
    (meal.categorySlug.toLowerCase() === 'salads' || 
     meal.categorySlug.toLowerCase() === 'salad' || 
     meal.categorySlug.toLowerCase().includes('salad'))
  
  // Get current cart items to check if there are non-salad meals
  const items = useCartStore((state) => state.items)
  const hasNonSaladMeals = items.some(
    (i) => i.type === 'meal' && 
    !(i.categorySlug && (i.categorySlug.toLowerCase() === 'salads' || 
       i.categorySlug.toLowerCase() === 'salad' || 
       i.categorySlug.toLowerCase().includes('salad')))
  )
  
  // Calculate effective price for salads
  let effectivePrice = basePrice
  if (isSalad) {
    if (hasNonSaladMeals) {
      // Free when there's a meal
      effectivePrice = 0
    } else {
      // Check if there are already salads in cart
      const saladItems = items.filter(
        (i) => i.type === 'meal' && i.categorySlug && 
        (i.categorySlug.toLowerCase() === 'salads' || 
         i.categorySlug.toLowerCase() === 'salad' || 
         i.categorySlug.toLowerCase().includes('salad'))
      )
      if (saladItems.length === 0) {
        // First salad gets 60 NIS
        effectivePrice = 60
      } else {
        // Additional salads are free (60 NIS covers all)
        effectivePrice = 0
      }
    }
  }
  
  const totalPrice = effectivePrice * quantity

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
        {isEditMode ? 'Update Cart' : t.meal.addToCart} • {totalPrice === 0 ? t.meal.free : `₪${totalPrice.toFixed(2)}`}
      </Button>
      {totalPrice === 0 && isSalad && (
        <p className="text-xs text-center text-gray-500 mt-2">
          {hasNonSaladMeals ? t.meal.includedInMeal : t.meal.includedInSalads}
        </p>
      )}
    </div>
  )
}

