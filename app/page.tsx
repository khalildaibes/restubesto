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
      
      {/* Vegetarian Note */}
      <div className="mx-4 mt-4 mb-6 p-5 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl shadow-lg border-2 border-blue-400">
        <div className="flex items-center justify-center gap-3">
          <div className="flex-shrink-0">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-base font-bold text-white whitespace-pre-line leading-relaxed drop-shadow-sm text-center">
            {t.home.vegetarianNote}
          </p>
        </div>
      </div>

      <CategoryGrid />
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  )
}
