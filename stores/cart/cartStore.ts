import { create } from 'zustand'
import type { CartItem, CartItemIngredient } from './types'

interface CartStore {
  items: CartItem[]
  addItem: (item: Omit<CartItem, 'qty'>) => void
  updateQty: (
    mealId: string,
    qty: number,
    selectedIngredients?: CartItemIngredient[]
  ) => void
  removeItem: (
    mealId: string,
    selectedIngredients?: CartItemIngredient[]
  ) => void
  clearCart: () => void
  getTotalItems: () => number
  getSubtotal: () => number
  addItemWithIngredients: (item: Omit<CartItem, 'qty'>) => void
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  addItem: (item) => {
    if (item.selectedIngredients && item.selectedIngredients.length > 0) {
      get().addItemWithIngredients(item)
      return
    }

    const existingItem = get().items.find(
      (i) =>
        i.mealId === item.mealId &&
        (!i.selectedIngredients || i.selectedIngredients.length === 0)
    )

    if (existingItem) {
      set({
        items: get().items.map((i) =>
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
          i.mealId === mealId &&
          JSON.stringify(i.selectedIngredients || []) === itemKey
      )

      if (item) {
        set({
          items: items.map((i) =>
            i.mealId === mealId &&
            JSON.stringify(i.selectedIngredients || []) === itemKey
              ? { ...i, qty }
              : i
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
            i.mealId === mealId &&
            JSON.stringify(i.selectedIngredients || []) === itemKey
          )
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
    return get().items.reduce((sum, item) => sum + item.price * item.qty, 0)
  },
  addItemWithIngredients: (item) => {
    const existingItem = get().items.find(
      (i) =>
        i.mealId === item.mealId &&
        JSON.stringify(i.selectedIngredients || []) ===
          JSON.stringify(item.selectedIngredients || [])
    )

    if (existingItem) {
      set({
        items: get().items.map((i) =>
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

