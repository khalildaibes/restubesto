import type { Language } from '@/types/i18n'
import type { MultilingualText } from '@/types/domain'

export function getText(
  text: MultilingualText,
  language: Language
): string {
  return text[language] || text.en
}

