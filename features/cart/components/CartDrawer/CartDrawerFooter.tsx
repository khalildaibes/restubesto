'use client'

import { useState } from 'react'
import { useCartStore } from '@/stores/cart'
import { useTranslations } from '@/shared/i18n'
import { Button } from '@/shared/components/ui/Button'
import { fetchMeals } from '@/lib/api-client'
import { getText } from '@/shared/utils/i18n'
import { useLanguageStore } from '@/stores/language'

interface CartDrawerFooterProps {
  quickOrder?: boolean // Boolean parameter to control quick order mode, defaults to true
}

export function CartDrawerFooter({ quickOrder = true }: CartDrawerFooterProps) {
  const items = useCartStore((state) => state.items)
  const getSubtotal = useCartStore((state) => state.getSubtotal)
  const clearCart = useCartStore((state) => state.clearCart)
  const { language } = useLanguageStore()
  const t = useTranslations()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showCheckoutForm, setShowCheckoutForm] = useState(false)
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    customerAddress: '',
    notes: '',
    paymentMethod: 'cash' as 'cash' | 'card' | 'online',
    deliveryMethod: 'pickup' as 'pickup' | 'delivery',
    deliveryFee: 0,
  })

  if (items.length === 0) return null

  const handleCheckout = async () => {
    // Validation based on quickOrder mode
    if (quickOrder) {
      // Quick order: only phone is required
      if (!formData.customerPhone.trim()) {
        alert('Please enter your phone number')
        return
      }
    } else {
      // Full order: name is required
      if (!formData.customerName.trim()) {
        alert('Please enter your name')
        return
      }
    }

    setIsSubmitting(true)
    try {
      // Fetch meals to get defaultIngredients for each meal
      const meals = await fetchMeals(language)
      const mealsMap = new Map(meals.map(meal => [meal.id, meal]))

      // Build order items with defaultIngredients and selectedIngredients
      const orderItems = items.map((item) => {
        // Determine item type - handle legacy items without type field
        const itemType = item.type || (item.drinkId ? 'drink' : 'meal')
        
        if (itemType === 'drink' && item.drinkId) {
          // Handle drinks
          return {
            type: 'drink' as const,
            drinkId: item.drinkId,
            drinkName: item.name,
            quantity: item.qty,
            unitPrice: item.price,
            totalPrice: item.price * item.qty,
          }
        } else if (itemType === 'meal' && item.mealId) {
          // Handle meals
          const meal = mealsMap.get(item.mealId)
          const defaultIngredients = meal?.defaultIngredients?.map(ing => ({
            id: ing.id,
            name: getText(ing.name, language),
            price: ing.price,
          })) || []

          return {
            type: 'meal' as const,
            mealId: item.mealId,
            mealName: item.name,
            quantity: item.qty,
            unitPrice: item.price - (item.selectedIngredients?.reduce((sum, ing) => sum + ing.price, 0) || 0), // Base price without selected ingredients
            totalPrice: item.price * item.qty,
            defaultIngredients,
            selectedIngredients: item.selectedIngredients || [],
          }
        } else {
          // Fallback - log error details for debugging
          console.error('Invalid cart item:', item)
          throw new Error(`Invalid cart item type: ${itemType}, mealId: ${item.mealId}, drinkId: ${item.drinkId}`)
        }
      })

      const subtotal = getSubtotal()
      const deliveryFee = quickOrder ? 0 : (formData.deliveryMethod === 'delivery' ? (formData.deliveryFee || 10) : 0)
      const total = subtotal + deliveryFee

      // If quick order, use phone as name or generate a placeholder
      const customerName = quickOrder 
        ? (formData.customerName.trim() || `Customer ${formData.customerPhone}`)
        : formData.customerName

      const orderData = {
        customerName,
        customerEmail: formData.customerEmail || undefined,
        customerPhone: formData.customerPhone || undefined,
        customerAddress: formData.customerAddress || undefined,
        items: orderItems,
        subtotal,
        deliveryFee,
        total,
        notes: formData.notes || undefined,
        paymentMethod: formData.paymentMethod,
        deliveryMethod: formData.deliveryMethod,
      }

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      })

      const result = await response.json()

      if (response.ok && result.success) {
        clearCart()
        setShowCheckoutForm(false)
        setFormData({
          customerName: '',
          customerEmail: '',
          customerPhone: '',
          customerAddress: '',
          notes: '',
          paymentMethod: 'cash',
          deliveryMethod: 'pickup',
          deliveryFee: 0,
        })
      } else {
        alert(`Failed to create order: ${result.error || result.message || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('Error creating order:', error)
      alert('Failed to create order. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (showCheckoutForm) {
    return (
      <div className="p-6 border-t border-gray-100 bg-white max-h-[60vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Save order</h3>
        </div>
        
        <div className="space-y-4">
          {quickOrder ? (
            // Quick order mode: only phone number required
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone *
              </label>
              <input
                type="tel"
                required
                value={formData.customerPhone}
                onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="+1234567890"
              />
            </div>
          ) : (
            // Full order mode: show all fields
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.customerName}
                  onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.customerPhone}
                  onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="+1234567890"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.customerEmail}
                  onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Delivery Method
                </label>
                <select
                  value={formData.deliveryMethod}
                  onChange={(e) => setFormData({ ...formData, deliveryMethod: e.target.value as 'pickup' | 'delivery' })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="pickup">Pickup</option>
                  <option value="delivery">Delivery</option>
                </select>
              </div>

              {formData.deliveryMethod === 'delivery' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Delivery Address
                    </label>
                    <textarea
                      value={formData.customerAddress}
                      onChange={(e) => setFormData({ ...formData, customerAddress: e.target.value })}
                      rows={2}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Your delivery address"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Delivery Fee (₪)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.deliveryFee}
                      onChange={(e) => setFormData({ ...formData, deliveryFee: parseFloat(e.target.value) || 0 })}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="10"
                    />
                  </div>
                </>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Payment Method
                </label>
                <select
                  value={formData.paymentMethod}
                  onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value as 'cash' | 'card' | 'online' })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="cash">Cash</option>
                  <option value="card">Card</option>
                  <option value="online">Online</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes (Optional)
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={2}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Special instructions..."
                />
              </div>
            </>
          )}

          <div className="flex items-center justify-between pt-2 border-t">
            <div>
              <div className="text-sm text-gray-600">Subtotal: ₪{getSubtotal().toFixed(2)}</div>
              {!quickOrder && formData.deliveryMethod === 'delivery' && (
                <div className="text-sm text-gray-600">
                  Delivery: ₪{(formData.deliveryFee || 10).toFixed(2)}
                </div>
              )}
              <div className="text-lg font-bold text-gray-900 mt-1">
                Total: ₪{(getSubtotal() + (!quickOrder && formData.deliveryMethod === 'delivery' ? (formData.deliveryFee || 10) : 0)).toFixed(2)}
              </div>
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <Button
              onClick={handleCheckout}
              disabled={isSubmitting || (quickOrder ? !formData.customerPhone.trim() : !formData.customerName.trim())}
              className="flex-1 py-3"
            >
              {isSubmitting ? 'Saving...' : 'Save order'}
            </Button>
            <Button
              onClick={() => setShowCheckoutForm(false)}
              variant="secondary"
              className="px-4 py-3"
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Check if cart has any drinks
  const hasDrinks = items.some(item => item.type === 'drink')
  const hasMeals = items.some(item => item.type === 'meal')

  const handleCheckoutClick = () => {
    // If cart has meals but no drinks, prompt user
    if (hasMeals && !hasDrinks) {
      const wantsDrinks = confirm('Would you like to add a drink to your order?')
      if (wantsDrinks) {
        // Navigate to drinks page - find first drink category or show all drinks
        // For now, we'll just show the checkout form, but you can navigate to /category/soft-drinks
        // window.location.href = '/category/soft-drinks'
        // Or you could show a drinks selection modal
        // For simplicity, we'll just proceed to checkout
        setShowCheckoutForm(true)
      } else {
        setShowCheckoutForm(true)
      }
    } else {
      setShowCheckoutForm(true)
    }
  }

  return (
    <div className="p-6 border-t border-gray-100 bg-white">
      <div className="flex items-center justify-between mb-4">
        <span className="text-lg font-semibold text-gray-900">
          {t.cart.subtotal}
        </span>
        <span className="text-xl font-bold text-gray-900">
          ₪{getSubtotal().toFixed(2)}
        </span>
      </div>
      {hasMeals && !hasDrinks && (
        <div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800 mb-2">
            💡 Would you like to add a drink to your order?
          </p>
          <Button
            onClick={() => {
              // Navigate to first drink category
              window.location.href = '/category/soft-drinks'
            }}
            variant="secondary"
            className="w-full py-2 text-sm"
          >
            Browse Drinks
          </Button>
        </div>
      )}
      <Button
        onClick={handleCheckoutClick}
        className="w-full py-4 text-lg"
      >
        Save order
      </Button>
    </div>
  )
}

