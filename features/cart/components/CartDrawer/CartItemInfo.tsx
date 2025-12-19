import type { CartItem } from '@/stores/cart'
import { CartItemIngredients } from './CartItemIngredients'

interface CartItemInfoProps {
  item: CartItem
}

export function CartItemInfo({ item }: CartItemInfoProps) {
  return (
    <div className="flex-1 min-w-0">
      <h3 className="font-semibold text-gray-900 truncate">{item.name}</h3>
      {item.selectedIngredients && item.selectedIngredients.length > 0 && (
        <CartItemIngredients ingredients={item.selectedIngredients} />
      )}
      <p className="text-sm text-gray-600 mt-1">₪{item.price}</p>
    </div>
  )
}

