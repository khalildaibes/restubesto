import type { Language } from '@/types/i18n'

export function getDirection(lang: Language): 'ltr' | 'rtl' {
  return lang === 'he' || lang === 'ar' ? 'rtl' : 'ltr'
}

