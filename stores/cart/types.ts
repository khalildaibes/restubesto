export interface CartItemIngredient {
  id: string
  name: string
  price: number
}

export interface CartItem {
  mealId: string
  name: string
  price: number
  imageUrl: string
  qty: number
  selectedIngredients?: CartItemIngredient[]
}

