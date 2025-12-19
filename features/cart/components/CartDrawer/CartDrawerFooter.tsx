'use client'

import { useCartStore } from '@/stores/cart'
import { useTranslations } from '@/shared/i18n'
import { Button } from '@/shared/components/ui/Button'

export function CartDrawerFooter() {
  const items = useCartStore((state) => state.items)
  const getSubtotal = useCartStore((state) => state.getSubtotal)
  const t = useTranslations()

  if (items.length === 0) return null

  return (
    <div className="p-6 border-t border-gray-100 bg-white">
      <div className="flex items-center justify-between mb-4">
        <span className="text-lg font-semibold text-gray-900">
          {t.cart.subtotal}
        </span>
        <span className="text-xl font-bold text-gray-900">
          ₪{getSubtotal()}
        </span>
      </div>
      <Button
        onClick={() => alert('Checkout functionality not implemented')}
        className="w-full py-4 text-lg"
      >
        {t.cart.checkout}
      </Button>
    </div>
  )
}

