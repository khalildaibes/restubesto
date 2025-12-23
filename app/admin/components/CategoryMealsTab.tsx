'use client'

import { MealsTab } from './MealsTab'

interface CategoryMealsTabProps {
  categorySlug: string
  categoryName: string
}

export function CategoryMealsTab({ categorySlug, categoryName }: CategoryMealsTabProps) {
  return <MealsTab categorySlug={categorySlug} categoryName={categoryName} />
}

