'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import type { Category } from '@/types/domain'
import { getText } from '@/shared/utils/i18n'
import { useLanguageStore } from '@/stores/language'
import { CategoryCardContent } from './CategoryCardContent'

interface CategoryCardProps {
  category: Category
  index: number
}

export function CategoryCard({ category, index }: CategoryCardProps) {
  const { language } = useLanguageStore()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
    >
      <Link href={`/category/${category.slug}`}>
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="relative h-48 rounded-2xl overflow-hidden bg-gray-100 cursor-pointer"
        >
          <Image
            src={category.imageUrl}
            alt={getText(category.name, language)}
            fill
            className="object-cover"
          />
          <CategoryCardContent category={category} language={language} />
        </motion.div>
      </Link>
    </motion.div>
  )
}

