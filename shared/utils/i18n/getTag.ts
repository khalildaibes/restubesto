import type { Language } from '@/types/i18n'
import type { MultilingualText } from '@/types/domain'

export function getTag(
  tag: MultilingualText,
  language: Language
): string {
  return tag[language] || tag.en
}

