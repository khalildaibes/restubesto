import type { CartItem } from '@/stores/cart'
import { CartItemCard } from './CartItemCard'

interface CartItemListProps {
  items: CartItem[]
  onEditItem?: (item: CartItem) => void
}

export function CartItemList({ items, onEditItem }: CartItemListProps) {
  return (
    <div className="space-y-4">
      {items.map((item) => (
        <CartItemCard 
          key={`${item.mealId}-${JSON.stringify(item.selectedIngredients || [])}`} 
          item={item}
          onEdit={onEditItem}
        />
      ))}
    </div>
  )
}

