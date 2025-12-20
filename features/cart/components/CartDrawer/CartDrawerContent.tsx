'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useLanguageStore } from '@/stores/language'
import type { Meal } from '@/types/domain'
import type { CartItem } from '@/stores/cart'
import { useCartStore } from '@/stores/cart'
import { fetchMeals } from '@/lib/api-client'
import { MealDetailModal } from '@/features/meals/components/MealDetailModal'
import { CartDrawerHeader } from './CartDrawerHeader'
import { CartDrawerItems } from './CartDrawerItems'
import { CartDrawerFooter } from './CartDrawerFooter'

interface CartDrawerContentProps {
  onClose: () => void
}

export function CartDrawerContent({ onClose }: CartDrawerContentProps) {
  const { language } = useLanguageStore()
  const isRTL = language === 'he' || language === 'ar'
  const [editingMeal, setEditingMeal] = useState<Meal | null>(null)
  const [editingCartItem, setEditingCartItem] = useState<CartItem | null>(null)
  const removeItem = useCartStore((state) => state.removeItem)

  const handleEditItem = async (cartItem: CartItem) => {
    try {
      // Fetch meals to get the full meal data
      const meals = await fetchMeals(language)
      const meal = meals.find(m => m.id === cartItem.mealId)
      
      if (meal) {
        setEditingCartItem(cartItem)
        setEditingMeal(meal)
      } else {
        alert('Meal not found')
      }
    } catch (error) {
      console.error('Error fetching meal:', error)
      alert('Failed to load meal details')
    }
  }

  const handleCloseMealModal = () => {
    setEditingMeal(null)
    setEditingCartItem(null)
  }

  const handleMealUpdated = () => {
    // Remove the old cart item when meal is updated
    if (editingCartItem) {
      removeItem(editingCartItem.mealId, editingCartItem.selectedIngredients)
    }
    handleCloseMealModal()
  }

  return (
    <>
      <motion.div
        initial={{ x: isRTL ? '-100%' : '100%' }}
        animate={{ x: 0 }}
        exit={{ x: isRTL ? '-100%' : '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        className={`fixed top-0 bottom-0 z-50 w-full sm:w-96 bg-white shadow-xl flex flex-col ${
          isRTL ? 'left-0' : 'right-0'
        }`}
      >
        <CartDrawerHeader onClose={onClose} />
        <CartDrawerItems onEditItem={handleEditItem} />
        <CartDrawerFooter />
      </motion.div>
      
      {editingMeal && (
        <MealDetailModal
          meal={editingMeal}
          onClose={handleCloseMealModal}
          initialSelectedIngredients={editingCartItem?.selectedIngredients?.map(ing => ing.id) || []}
          initialQuantity={editingCartItem?.qty || 1}
          onUpdate={handleMealUpdated}
        />
      )}
    </>
  )
}

