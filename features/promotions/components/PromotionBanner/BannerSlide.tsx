import { motion } from 'framer-motion'
import Image from 'next/image'
import type { Banner } from '@/types/domain'
import type { Language } from '@/types/i18n'
import { getText } from '@/shared/utils/i18n'

interface BannerSlideProps {
  banner: Banner
  language: Language
}

export function BannerSlide({ banner, language }: BannerSlideProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="absolute inset-0"
    >
      {banner.imageUrl && banner.imageUrl.trim() ? (
        <Image
          src={banner.imageUrl}
          alt={getText(banner.title, language)}
          fill
          className="object-cover"
          priority
          unoptimized={banner.imageUrl.startsWith('http://')}
          onError={(e) => {
            console.error(`Failed to load banner image:`, banner.imageUrl)
          }}
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-6">
        <h2 className="text-2xl font-semibold text-white mb-1">
          {getText(banner.title, language)}
        </h2>
        <p className="text-white/90 text-sm">
          {getText(banner.subtitle, language)}
        </p>
      </div>
    </motion.div>
  )
}

