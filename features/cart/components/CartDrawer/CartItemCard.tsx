'use client'

import Image from 'next/image'
import type { CartItem } from '@/stores/cart'
import { useCartStore } from '@/stores/cart'
import { CartItemImage } from './CartItemImage'
import { CartItemInfo } from './CartItemInfo'
import { CartItemQuantity } from './CartItemQuantity'

interface CartItemCardProps {
  item: CartItem
}

export function CartItemCard({ item }: CartItemCardProps) {
  const updateQty = useCartStore((state) => state.updateQty)

  return (
    <div className="flex items-center gap-4 bg-gray-50 rounded-2xl p-4">
      <CartItemImage imageUrl={item.imageUrl} alt={item.name} />
      <CartItemInfo item={item} />
      <CartItemQuantity
        value={item.qty}
        onDecrease={() =>
          updateQty(item.mealId, item.qty - 1, item.selectedIngredients)
        }
        onIncrease={() =>
          updateQty(item.mealId, item.qty + 1, item.selectedIngredients)
        }
      />
    </div>
  )
}

