'use client'

import { useEffect, useState } from 'react'
import { useTranslations } from '@/shared/i18n'
import { useLanguageStore } from '@/stores/language'
import { fetchCategories } from '@/lib/api-client'
import type { Category } from '@/types/domain/Category'
import { CategoryCard } from '../CategoryCard'

export function CategoryGrid() {
  const t = useTranslations()
  const { language } = useLanguageStore()
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadCategories() {
      setLoading(true)
      const data = await fetchCategories(language)
      setCategories(data)
      setLoading(false)
    }
    loadCategories()
  }, [language])

  if (loading) {
    return (
      <div className="px-4 mt-6 mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          {t.home.categories}
        </h2>
        <div className="grid grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-gray-200 animate-pulse rounded-xl" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="px-4 mt-6 mb-8">
      <h2 className="text-2xl font-semibold text-gray-900 mb-4">
        {t.home.categories}
      </h2>
      <div className="grid grid-cols-2 gap-4">
        {categories.map((category, index) => (
          <CategoryCard
            key={category.id}
            category={category}
            index={index}
          />
        ))}
      </div>
    </div>
  )
}

