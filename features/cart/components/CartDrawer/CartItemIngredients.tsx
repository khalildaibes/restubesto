import type { CartItemIngredient } from '@/stores/cart'

interface CartItemIngredientsProps {
  ingredients: CartItemIngredient[]
}

export function CartItemIngredients({
  ingredients,
}: CartItemIngredientsProps) {
  return (
    <div className="flex flex-wrap gap-1 mt-1">
      {ingredients.map((ing, idx) => (
        <span
          key={idx}
          className="text-xs px-2 py-0.5 rounded-full bg-gray-200 text-gray-700"
        >
          {ing.name}
          {ing.price > 0 && ` (+₪${ing.price})`}
        </span>
      ))}
    </div>
  )
}

