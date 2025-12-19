import { useLanguageStore } from '@/stores/language'
import { translations } from './translations'

export function useTranslations() {
  const { language } = useLanguageStore()
  return translations[language]
}

