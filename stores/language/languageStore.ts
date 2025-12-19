import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Language } from '@/types/i18n'
import { getDirection } from '@/shared/utils/i18n/getDirection'
import type { LanguageStore } from './types'

export const useLanguageStore = create<LanguageStore>()(
  persist(
    (set, get) => ({
      language: 'en',
      direction: 'ltr',
      setLanguage: (lang: Language) => {
        const newDirection = getDirection(lang)
        set({ language: lang, direction: newDirection })

        if (typeof document !== 'undefined') {
          document.documentElement.dir = newDirection
          document.documentElement.lang = lang
        }
      },
    }),
    {
      name: 'language-storage',
      onRehydrateStorage: () => (state) => {
        if (state && typeof document !== 'undefined') {
          document.documentElement.dir = state.direction
          document.documentElement.lang = state.language
        }
      },
    }
  )
)

