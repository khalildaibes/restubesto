import type { Language } from '@/types/i18n'

export interface LanguageStore {
  language: Language
  direction: 'ltr' | 'rtl'
  setLanguage: (lang: Language) => void
}

