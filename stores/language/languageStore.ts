import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { Language } from '@/types/i18n'
import { getDirection } from '@/shared/utils/i18n/getDirection'
import type { LanguageStore } from './types'

// Create a safe storage adapter that works in both client and server environments
const getStorage = () => {
  if (typeof window === 'undefined') {
    // Return a no-op storage for server-side rendering
    return {
      getItem: () => null,
      setItem: () => {},
      removeItem: () => {},
    }
  }
  return localStorage
}

export const useLanguageStore = create<LanguageStore>()(
  persist(
    (set, get) => ({
      language: 'he',
      direction: 'rtl',
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
      storage: createJSONStorage(() => getStorage()),
      onRehydrateStorage: () => (state) => {
        if (state && typeof document !== 'undefined') {
          document.documentElement.dir = state.direction
          document.documentElement.lang = state.language
        }
      },
    }
  )
)

