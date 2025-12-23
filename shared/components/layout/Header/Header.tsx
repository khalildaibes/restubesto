'use client'

import { useCartStore } from '@/stores/cart'
import { LanguageSwitcher } from '@/features/language/components/LanguageSwitcher'
import { CartButton } from '@/features/cart/components/CartButton'
import { AccessibilityMenu } from '@/features/accessibility/components'

interface HeaderProps {
  onCartClick: () => void
}

export function Header({ onCartClick }: HeaderProps) {
  const totalItems = useCartStore((state) => state.getTotalItems())

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-900">מסעדת אלזיין</h1>
        <div className="flex items-center gap-3">
          <AccessibilityMenu />
          <LanguageSwitcher />
          <CartButton onClick={onCartClick} itemCount={totalItems} />
        </div>
      </div>
    </header>
  )
}

