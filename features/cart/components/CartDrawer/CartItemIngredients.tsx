import type { CartItemIngredient } from '@/stores/cart'

interface CartItemIngredientsProps {
  ingredients: CartItemIngredient[]
}

export function CartItemIngredients({
  ingredients,
}: CartItemIngredientsProps) {
  if (!ingredients || ingredients.length === 0) return null

  return (
    <div className="flex flex-wrap gap-1 items-center">
      {ingredients.map((ing, idx) => (
        <span
          key={idx}
          className="inline-flex items-center text-[10px] px-2 py-0.5 rounded-md bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 font-medium border border-blue-200/50 whitespace-nowrap shadow-sm"
          title={`${ing.name}${ing.price > 0 ? ` (+₪${ing.price.toFixed(2)})` : ''}`}
        >
          <span className="me-1">+</span>
          {ing.name}
          {ing.price > 0 && (
            <span className="ms-1 text-blue-600 font-semibold">
              +₪{ing.price.toFixed(2)}
            </span>
          )}
        </span>
      ))}
    </div>
  )
}

