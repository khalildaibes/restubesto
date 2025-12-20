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
  available?: boolean // Whether the meal is in stock (defaults to true if not specified)
}

