import type { Category } from '@/types/domain'
import type { Language } from '@/types/i18n'
import { getText } from '@/shared/utils/i18n'

interface CategoryCardContentProps {
  category: Category
  language: Language
}

export function CategoryCardContent({
  category,
  language,
}: CategoryCardContentProps) {
  return (
    <>
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <h3 className="text-xl font-semibold text-white mb-1">
          {getText(category.name, language)}
        </h3>
        <p className="text-white/80 text-sm">
          {getText(category.description, language)}
        </p>
      </div>
    </>
  )
}

