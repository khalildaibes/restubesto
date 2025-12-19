import type { MultilingualText } from './MultilingualText'
import type { Ingredient } from './Ingredient'

export interface Meal {
  id: string
  categorySlug: string
  name: MultilingualText
  description: MultilingualText
  price: number
  imageUrl: string
  calories?: number
  tags?: MultilingualText[]
  defaultIngredients?: Ingredient[]
  optionalIngredients?: Ingredient[]
}

