import type { MultilingualText } from './MultilingualText'

export interface Drink {
  id: string
  categorySlug: string
  name: MultilingualText
  description?: MultilingualText
  price: number
  imageUrl: string
  calories?: number
  volume?: string
  available?: boolean // Whether the drink is in stock (defaults to true if not specified)
}

