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
    return get().items.reduce((sum, item) => sum + item.price * item.qty, 0)
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

