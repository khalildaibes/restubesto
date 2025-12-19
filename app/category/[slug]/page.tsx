'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getText } from '@/shared/utils/i18n'
import { useLanguageStore } from '@/stores/language'
import { useTranslations } from '@/shared/i18n'
import { Header } from '@/shared/components/layout/Header'
import { MealCard } from '@/features/meals/components/MealCard'
import { MealDetailModal } from '@/features/meals/components/MealDetailModal'
import { CartDrawer } from '@/features/cart/components/CartDrawer'
import { fetchCategoryBySlug, fetchMeals } from '@/lib/api-client'
import type { Meal } from '@/types/domain'
import type { Category } from '@/types/domain/Category'
import { BackButton } from './BackButton'

export default function CategoryPage({
  params,
}: {
  params: { slug: string }
}) {
  const router = useRouter()
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null)
  const [category, setCategory] = useState<Category | null>(null)
  const [categoryMeals, setCategoryMeals] = useState<Meal[]>([])
  const [loading, setLoading] = useState(true)
  const { language } = useLanguageStore()
  const t = useTranslations()

  useEffect(() => {
    async function loadData() {
      setLoading(true)
      const [categoryData, mealsData] = await Promise.all([
        fetchCategoryBySlug(params.slug, language),
        fetchMeals(language, params.slug),
      ])
      
      if (!categoryData) {
        router.push('/')
        return
      }
      
      setCategory(categoryData)
      setCategoryMeals(mealsData)
      setLoading(false)
    }
    loadData()
  }, [params.slug, language, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header onCartClick={() => setIsCartOpen(true)} />
        <div className="max-w-7xl mx-auto px-4 py-6">
          <BackButton />
          <div className="h-8 bg-gray-200 animate-pulse rounded mb-2 w-64" />
          <div className="h-4 bg-gray-200 animate-pulse rounded mb-8 w-96" />
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-gray-200 animate-pulse rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!category) {
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
