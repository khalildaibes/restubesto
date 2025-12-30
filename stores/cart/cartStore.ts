import { create } from 'zustand'
import type { CartItem, CartItemIngredient } from './types'

// Helper to check if a category is salads
const isSaladCategory = (categorySlug: string | undefined): boolean => {
  if (!categorySlug) return false
  const slug = categorySlug.toLowerCase()
  return slug === 'salads' || slug === 'salad' || slug.includes('salad')
}

interface CartStore {
  items: CartItem[]
  addItem: (item: Omit<CartItem, 'qty'>) => void
  updateQty: (
    mealId: string,
    qty: number,
    selectedIngredients?: CartItemIngredient[]
  ) => void
  updateDrinkQty: (drinkId: string, qty: number) => void
  removeItem: (
    mealId: string,
    selectedIngredients?: CartItemIngredient[]
  ) => void
  removeDrink: (drinkId: string) => void
  clearCart: () => void
  getTotalItems: () => number
  getSubtotal: () => number
  addItemWithIngredients: (item: Omit<CartItem, 'qty'>) => void
  getEffectivePrice: (item: CartItem) => number
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  addItem: (item) => {
    // Handle drinks (no ingredients)
    if (item.type === 'drink') {
      const existingItem = get().items.find(
        (i) => i.type === 'drink' && i.drinkId === item.drinkId
      )
      if (existingItem) {
        set({
          items: get().items.map((i) =>
            i.type === 'drink' && i.drinkId === item.drinkId
              ? { ...i, qty: i.qty + 1 }
              : i
          ),
        })
      } else {
        set({ items: [...get().items, { ...item, qty: 1 }] })
      }
      return
    }

    // Handle meals with ingredients
    if (item.selectedIngredients && item.selectedIngredients.length > 0) {
      get().addItemWithIngredients(item)
      return
    }

    // Handle meals without ingredients
    const existingItem = get().items.find(
      (i) =>
        i.type === 'meal' &&
        i.mealId === item.mealId &&
        (!i.selectedIngredients || i.selectedIngredients.length === 0)
    )

    if (existingItem) {
      set({
        items: get().items.map((i) =>
          i.type === 'meal' &&
          i.mealId === item.mealId &&
          (!i.selectedIngredients || i.selectedIngredients.length === 0)
            ? { ...i, qty: i.qty + 1 }
            : i
        ),
      })
    } else {
      set({ items: [...get().items, { ...item, qty: 1 }] })
    }
  },
  updateQty: (mealId, qty, selectedIngredients) => {
    if (qty <= 0) {
      get().removeItem(mealId, selectedIngredients)
    } else {
      const items = get().items
      const itemKey = JSON.stringify(selectedIngredients || [])
      const item = items.find(
        (i) =>
          i.type === 'meal' &&
          i.mealId === mealId &&
          JSON.stringify(i.selectedIngredients || []) === itemKey
      )

      if (item) {
        set({
          items: items.map((i) =>
            i.type === 'meal' &&
            i.mealId === mealId &&
            JSON.stringify(i.selectedIngredients || []) === itemKey
              ? { ...i, qty }
              : i
          ),
        })
      }
    }
  },
  updateDrinkQty: (drinkId: string, qty: number) => {
    if (qty <= 0) {
      get().removeDrink(drinkId)
    } else {
      const items = get().items
      const item = items.find(
        (i) => i.type === 'drink' && i.drinkId === drinkId
      )

      if (item) {
        set({
          items: items.map((i) =>
            i.type === 'drink' && i.drinkId === drinkId ? { ...i, qty } : i
          ),
        })
      }
    }
  },
  removeItem: (mealId, selectedIngredients) => {
    const itemKey = JSON.stringify(selectedIngredients || [])
    set({
      items: get().items.filter(
        (i) =>
          !(
            i.type === 'meal' &&
            i.mealId === mealId &&
            JSON.stringify(i.selectedIngredients || []) === itemKey
          )
      ),
    })
  },
  removeDrink: (drinkId: string) => {
    set({
      items: get().items.filter(
        (i) => !(i.type === 'drink' && i.drinkId === drinkId)
      ),
    })
  },
  clearCart: () => {
    set({ items: [] })
  },
  getTotalItems: () => {
    return get().items.reduce((sum, item) => sum + item.qty, 0)
  },
  getSubtotal: () => {
    const items = get().items
    // Check if cart has any non-salad meals
    const hasNonSaladMeals = items.some(
      (item) => item.type === 'meal' && !isSaladCategory(item.categorySlug)
    )
    
    // Calculate salad pricing
    const saladItems = items.filter(
      (item) => item.type === 'meal' && isSaladCategory(item.categorySlug)
    )
    const nonSaladItems = items.filter(
      (item) => !(item.type === 'meal' && isSaladCategory(item.categorySlug))
    )
    
    // Calculate subtotal for non-salad items
    const nonSaladTotal = nonSaladItems.reduce(
      (sum, item) => sum + item.price * item.qty,
      0
    )
    
    // Calculate salad total: 60 NIS total for ALL salads if no meals, free if has meals
    let saladTotal = 0
    if (saladItems.length > 0) {
      if (hasNonSaladMeals) {
        // Salads are free when there's a meal
        saladTotal = 0
      } else {
        // Charge 60 NIS total for all salads (not per salad) when no meal
        saladTotal = 60
      }
    }
    
    return nonSaladTotal + saladTotal
  },
  getEffectivePrice: (item: CartItem) => {
    // If it's a salad, check if there are non-salad meals in cart
    if (item.type === 'meal' && isSaladCategory(item.categorySlug)) {
      const items = get().items
      const hasNonSaladMeals = items.some(
        (i) => i.type === 'meal' && !isSaladCategory(i.categorySlug) && i.mealId !== item.mealId
      )
      
      if (hasNonSaladMeals) {
        // Free when there's a meal
        return 0
      } else {
        // Check if this is the first salad or if there are other salads
        const saladItems = items.filter(
          (i) => i.type === 'meal' && isSaladCategory(i.categorySlug)
        )
        if (saladItems.length === 1 && saladItems[0].mealId === item.mealId) {
          // First salad gets the 60 NIS charge
          return 60
        } else {
          // Additional salads are free (60 NIS covers all)
          return 0
        }
      }
    }
    // For non-salads, return the original price
    return item.price
  },
  addItemWithIngredients: (item) => {
    // Only for meals with ingredients
    if (item.type !== 'meal') {
      get().addItem(item)
      return
    }

    const existingItem = get().items.find(
      (i) =>
        i.type === 'meal' &&
        i.mealId === item.mealId &&
        JSON.stringify(i.selectedIngredients || []) ===
          JSON.stringify(item.selectedIngredients || [])
    )

    if (existingItem) {
      set({
        items: get().items.map((i) =>
          i.type === 'meal' &&
          i.mealId === item.mealId &&
          JSON.stringify(i.selectedIngredients || []) ===
            JSON.stringify(item.selectedIngredients || [])
            ? { ...i, qty: i.qty + 1 }
            : i
        ),
      })
    } else {
      set({ items: [...get().items, { ...item, qty: 1 }] })
    }
  },
}))

