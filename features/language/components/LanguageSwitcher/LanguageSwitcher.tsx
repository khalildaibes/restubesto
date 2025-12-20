'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLanguageStore } from '@/stores/language'
import type { Language } from '@/types/i18n'
import { IconButton } from '@/shared/components/ui/IconButton'
import { ChevronIcon } from '@/shared/components/ui/ChevronIcon'
import { CheckIcon } from '@/shared/components/ui/CheckIcon'

const languages: { code: Language; native: string }[] = [
  { code: 'en', native: 'English' },
  { code: 'he', native: 'עברית' },
  { code: 'ar', native: 'العربية' },
]

export function LanguageSwitcher() {
  const { language, setLanguage, direction } = useLanguageStore()
  const [isOpen, setIsOpen] = useState(false)
  const currentLang = languages.find((l) => l.code === language) || languages[0]

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors text-sm font-medium text-gray-900 flex items-center gap-2"
        aria-label="Change language"
      >
        <span>{currentLang.native}</span>
        <ChevronIcon
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`absolute top-full mt-2 z-20 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden min-w-[120px] ${
                direction === 'rtl' ? 'left-0' : 'right-0'
              }`}
            >
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    setLanguage(lang.code)
                    setIsOpen(false)
                  }}
                  className={`w-full px-4 py-2 text-start hover:bg-gray-50 transition-colors text-sm ${
                    language === lang.code
                      ? 'bg-gray-50 font-semibold text-gray-900'
                      : 'text-gray-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{lang.native}</span>
                    {language === lang.code && (
                      <CheckIcon className="w-4 h-4 text-gray-900" />
                    )}
                  </div>
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

