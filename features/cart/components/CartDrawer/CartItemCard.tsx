'use client'

import Image from 'next/image'
import type { CartItem } from '@/stores/cart'
import { useCartStore } from '@/stores/cart'
import { IconButton } from '@/shared/components/ui/IconButton'
import { CartItemImage } from './CartItemImage'
import { CartItemInfo } from './CartItemInfo'
import { CartItemQuantity } from './CartItemQuantity'

interface CartItemCardProps {
  item: CartItem
  onEdit?: (item: CartItem) => void
}

export function CartItemCard({ item, onEdit }: CartItemCardProps) {
  const updateQty = useCartStore((state) => state.updateQty)
  const removeItem = useCartStore((state) => state.removeItem)

  const handleRemove = () => {
    if (confirm('Remove this item from cart?')) {
      removeItem(item.mealId, item.selectedIngredients)
    }
  }

  const handleEdit = () => {
    if (onEdit) {
      onEdit(item)
    }
  }

  return (
    <div className="flex items-start gap-3 bg-white rounded-xl p-3 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <CartItemImage imageUrl={item.imageUrl} alt={item.name} />
      <div className="flex-1 min-w-0">
        <CartItemInfo item={item} />
      </div>
      <div className="flex flex-col items-end gap-2 flex-shrink-0">
        <CartItemQuantity
          value={item.qty}
          onDecrease={() =>
            updateQty(item.mealId, item.qty - 1, item.selectedIngredients)
          }
          onIncrease={() =>
            updateQty(item.mealId, item.qty + 1, item.selectedIngredients)
          }
        />
        <div className="flex gap-1.5">
          {onEdit && (
            <IconButton
              onClick={handleEdit}
              aria-label="Edit item"
              className="w-7 h-7 bg-blue-50 hover:bg-blue-100 border-0 transition-colors"
              title="Edit"
            >
              <svg
                className="w-3.5 h-3.5 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </IconButton>
          )}
          <IconButton
            onClick={handleRemove}
            aria-label="Remove item"
            className="w-7 h-7 bg-red-50 hover:bg-red-100 border-0 transition-colors"
            title="Remove"
          >
            <svg
              className="w-3.5 h-3.5 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </IconButton>
        </div>
      </div>
    </div>
  )
}

