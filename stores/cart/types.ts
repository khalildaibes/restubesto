export interface CartItemIngredient {
  id: string
  name: string
  price: number
}

export type CartItemType = 'meal' | 'drink'

export interface CartItem {
  type: CartItemType
  mealId?: string // For meals
  drinkId?: string // For drinks
  name: string
  price: number
  imageUrl: string
  qty: number
  selectedIngredients?: CartItemIngredient[] // Only for meals
  categorySlug?: string // For meals - to identify salads
}

