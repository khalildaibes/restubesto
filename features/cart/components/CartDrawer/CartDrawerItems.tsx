'use client'

import { useCartStore } from '@/stores/cart'
import { useTranslations } from '@/shared/i18n'
import { CartEmptyState } from './CartEmptyState'
import { CartItemList } from './CartItemList'

export function CartDrawerItems() {
  const items = useCartStore((state) => state.items)
  const t = useTranslations()

  return (
    <div className="flex-1 overflow-y-auto p-6">
      {items.length === 0 ? (
        <CartEmptyState message={t.cart.empty} />
      ) : (
        <CartItemList items={items} />
      )}
    </div>
  )
}

