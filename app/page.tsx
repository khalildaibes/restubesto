'use client'

import { useState } from 'react'
import { Header } from '@/shared/components/layout/Header'
import { PromotionBanner } from '@/features/promotions/components/PromotionBanner'
import { CategoryGrid } from '@/features/categories/components/CategoryGrid'
import { CartDrawer } from '@/features/cart/components/CartDrawer'
import { useTranslations } from '@/shared/i18n'

export default function Home() {
  const [isCartOpen, setIsCartOpen] = useState(false)
  const t = useTranslations()

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onCartClick={() => setIsCartOpen(true)} />
      <PromotionBanner />
      
    

      <CategoryGrid />
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  )
}
