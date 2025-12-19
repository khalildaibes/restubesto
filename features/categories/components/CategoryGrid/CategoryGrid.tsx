'use client'

import { categories } from '@/data/mock/categories'
import { useTranslations } from '@/shared/i18n'
import { CategoryCard } from '../CategoryCard'

export function CategoryGrid() {
  const t = useTranslations()

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

