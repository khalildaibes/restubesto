import type { MultilingualText } from './MultilingualText'

export interface Ingredient {
  id: string
  name: MultilingualText
  price: number
  isDefault: boolean
}

