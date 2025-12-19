import type { CartItem } from '@/stores/cart'
import { CartItemCard } from './CartItemCard'

interface CartItemListProps {
  items: CartItem[]
}

export function CartItemList({ items }: CartItemListProps) {
  return (
    <div className="space-y-4">
      {items.map((item) => (
        <CartItemCard key={`${item.mealId}-${JSON.stringify(item.selectedIngredients || [])}`} item={item} />
      ))}
    </div>
  )
}

