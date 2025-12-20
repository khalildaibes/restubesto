import type { CartItem } from '@/stores/cart'
import { CartItemIngredients } from './CartItemIngredients'

interface CartItemInfoProps {
  item: CartItem
}

export function CartItemInfo({ item }: CartItemInfoProps) {
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
      <p className="text-base font-bold text-gray-900">₪{item.price.toFixed(2)}</p>
    </div>
  )
}

