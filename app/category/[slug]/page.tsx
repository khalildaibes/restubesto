'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { categories, meals } from '@/data/mock'
import { getText } from '@/shared/utils/i18n'
import { useLanguageStore } from '@/stores/language'
import { useTranslations } from '@/shared/i18n'
import { Header } from '@/shared/components/layout/Header'
import { MealCard } from '@/features/meals/components/MealCard'
import { MealDetailModal } from '@/features/meals/components/MealDetailModal'
import { CartDrawer } from '@/features/cart/components/CartDrawer'
import type { Meal } from '@/types/domain'
import { BackButton } from './BackButton'

export default function CategoryPage({
  params,
}: {
  params: { slug: string }
}) {
  const router = useRouter()
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null)
  const { language } = useLanguageStore()
  const t = useTranslations()

  const category = categories.find((c) => c.slug === params.slug)
  const categoryMeals = meals.filter((m) => m.categorySlug === params.slug)

  if (!category) {
    router.push('/')
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onCartClick={() => setIsCartOpen(true)} />
      <div className="max-w-7xl mx-auto px-4 py-6">
        <BackButton />
        <h1 className="text-3xl font-semibold text-gray-900 mb-2">
          {getText(category.name, language)}
        </h1>
        <p className="text-gray-600 mb-8">
          {getText(category.description, language)}
        </p>
        <div className="space-y-4">
          {categoryMeals.map((meal, index) => (
            <MealCard
              key={meal.id}
              meal={meal}
              onClick={() => setSelectedMeal(meal)}
              index={index}
            />
          ))}
        </div>
      </div>
      <MealDetailModal
        meal={selectedMeal}
        onClose={() => setSelectedMeal(null)}
      />
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  )
}
