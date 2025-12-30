import type { CartItem } from '@/stores/cart'
import { CartItemIngredients } from './CartItemIngredients'
import { useCartStore } from '@/stores/cart'
import { useTranslations } from '@/shared/i18n'

interface CartItemInfoProps {
  item: CartItem
}

export function CartItemInfo({ item }: CartItemInfoProps) {
  const getEffectivePrice = useCartStore((state) => state.getEffectivePrice)
  const t = useTranslations()
  const effectivePrice = getEffectivePrice(item)
  const displayPrice = effectivePrice === 0 ? t.meal.free : `₪${effectivePrice.toFixed(2)}`
  
  // Check if this is a salad
  const isSalad = item.type === 'meal' && item.categorySlug && 
    (item.categorySlug.toLowerCase() === 'salads' || 
     item.categorySlug.toLowerCase() === 'salad' || 
     item.categorySlug.toLowerCase().includes('salad'))
  
  // Check if cart has non-salad meals
  const items = useCartStore((state) => state.items)
  const hasNonSaladMeals = items.some(
    (i) => i.type === 'meal' && i.mealId !== item.mealId && 
    !(i.categorySlug && (i.categorySlug.toLowerCase() === 'salads' || 
       i.categorySlug.toLowerCase() === 'salad' || 
       i.categorySlug.toLowerCase().includes('salad')))
  )
  
  return (
    <div className="flex-1 min-w-0">
      <h3 className="font-semibold text-gray-900 text-sm leading-tight mb-1.5 line-clamp-2">
        {item.name}
      </h3>
      {item.selectedIngredients && item.selectedIngredients.length > 0 && (
        <div className="mb-2">
          <CartItemIngredients ingredients={item.selectedIngredients} />
        </div>
      )}
      <p className="text-base font-bold text-gray-900">{displayPrice}</p>
      {effectivePrice === 0 && isSalad && hasNonSaladMeals && (
        <p className="text-xs text-gray-500 mt-1">{t.meal.includedInMeal}</p>
      )}
      {effectivePrice === 0 && isSalad && !hasNonSaladMeals && (
        <p className="text-xs text-gray-500 mt-1">{t.meal.includedInSalads}</p>
      )}
    </div>
  )
}

