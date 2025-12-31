'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getText } from '@/shared/utils/i18n'
import { useLanguageStore } from '@/stores/language'
import { useTranslations } from '@/shared/i18n'
import { Header } from '@/shared/components/layout/Header'
import { MealCard } from '@/features/meals/components/MealCard'
import { DrinkCard } from '@/features/drinks/components/DrinkCard'
import { MealDetailModal } from '@/features/meals/components/MealDetailModal'
import { CartDrawer } from '@/features/cart/components/CartDrawer'
import { fetchCategoryBySlug, fetchMeals, fetchDrinks } from '@/lib/api-client'
import type { Meal } from '@/types/domain'
import type { Drink } from '@/types/domain'
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
  const [categoryDrinks, setCategoryDrinks] = useState<Drink[]>([])
  const [loading, setLoading] = useState(true)
  const { language } = useLanguageStore()
  const t = useTranslations()

  useEffect(() => {
    async function loadData() {
      setLoading(true)
      const [categoryData, mealsData, drinksData] = await Promise.all([
        fetchCategoryBySlug(params.slug, language),
        fetchMeals(language, params.slug),
        fetchDrinks(language, params.slug),
      ])
      
      if (!categoryData) {
        router.push('/')
        return
      }
      
      setCategory(categoryData)
      // Filter out meals where available is false
      const availableMeals = mealsData.filter(meal => meal.available !== false)
      
      // Sort salads: free ones (price = 0) first, then paid ones
      const isSaladsCategory = categoryData.slug?.toLowerCase() === 'salads' || 
                               categoryData.slug?.toLowerCase() === 'salad' ||
                               categoryData.slug?.toLowerCase().includes('salad')
      
      const sortedMeals = isSaladsCategory
        ? [...availableMeals].sort((a, b) => {
            // Free items (price = 0) come first
            if (a.price === 0 && b.price !== 0) return -1
            if (a.price !== 0 && b.price === 0) return 1
            // If both are free or both are paid, sort by name
            return getText(a.name, language).localeCompare(getText(b.name, language))
          })
        : availableMeals
      
      setCategoryMeals(sortedMeals)
      setCategoryDrinks(drinksData)
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
        
        {/* Meals Section */}
        {categoryMeals.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Meals</h2>
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
        )}
        
        {/* Drinks Section */}
        {categoryDrinks.length > 0 && (
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Drinks</h2>
            <div className="space-y-4">
              {categoryDrinks.map((drink, index) => (
                <DrinkCard
                  key={drink.id}
                  drink={drink}
                  onClick={() => {}}
                  index={index}
                />
              ))}
            </div>
          </div>
        )}
        
        {/* Empty State */}
        {categoryMeals.length === 0 && categoryDrinks.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No items found in this category.</p>
          </div>
        )}
      </div>
      <MealDetailModal
        meal={selectedMeal}
        onClose={() => setSelectedMeal(null)}
      />
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  )
}
