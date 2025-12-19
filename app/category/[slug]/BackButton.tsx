'use client'

import { useRouter } from 'next/navigation'
import { useLanguageStore } from '@/stores/language'
import { useTranslations } from '@/shared/i18n'

export function BackButton() {
  const router = useRouter()
  const { language } = useLanguageStore()
  const t = useTranslations()

  return (
    <button
      onClick={() => router.push('/')}
      className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
    >
      <svg
        className={`w-5 h-5 ${language === 'he' || language === 'ar' ? 'rotate-180' : ''}`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 19l-7-7 7-7"
        />
      </svg>
      <span>{t.common.back}</span>
    </button>
  )
}

