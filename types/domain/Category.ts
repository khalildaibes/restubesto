import type { MultilingualText } from './MultilingualText'

export interface Category {
  id: string
  name: MultilingualText
  slug: string
  imageUrl: string
  description: MultilingualText
}

