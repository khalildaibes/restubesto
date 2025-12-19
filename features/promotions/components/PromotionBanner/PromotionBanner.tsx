'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { banners } from '@/data/mock/banners'
import { getText } from '@/shared/utils/i18n'
import { useLanguageStore } from '@/stores/language'
import { BannerSlide } from './BannerSlide'
import { BannerPagination } from './BannerPagination'

export function PromotionBanner() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const { language } = useLanguageStore()

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative h-64 overflow-hidden rounded-2xl mx-4 mt-4">
      <AnimatePresence mode="wait">
        <BannerSlide
          key={banners[currentIndex].id}
          banner={banners[currentIndex]}
          language={language}
        />
      </AnimatePresence>
      <BannerPagination
        count={banners.length}
        currentIndex={currentIndex}
        onSelect={setCurrentIndex}
      />
    </div>
  )
}

