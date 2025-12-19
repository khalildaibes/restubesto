'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { fetchBanners } from '@/lib/api-client'
import { getText } from '@/shared/utils/i18n'
import { useLanguageStore } from '@/stores/language'
import type { Banner } from '@/types/domain/Banner'
import { BannerSlide } from './BannerSlide'
import { BannerPagination } from './BannerPagination'

export function PromotionBanner() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [banners, setBanners] = useState<Banner[]>([])
  const [loading, setLoading] = useState(true)
  const { language } = useLanguageStore()

  useEffect(() => {
    async function loadBanners() {
      setLoading(true)
      const data = await fetchBanners(language)
      setBanners(data)
      setLoading(false)
    }
    loadBanners()
  }, [language])

  useEffect(() => {
    if (banners.length === 0) return
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [banners.length])

  if (loading || banners.length === 0) {
    return (
      <div className="relative h-64 overflow-hidden rounded-2xl mx-4 mt-4 bg-gray-200 animate-pulse" />
    )
  }

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

