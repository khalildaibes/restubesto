'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import type { Order } from './types'

interface OrderTrackingProps {
  orderNumber: string
}

const STATUS_STEPS = [
  { key: 'pending', label: 'Order Received', icon: '📋' },
  { key: 'confirmed', label: 'Confirmed', icon: '✅' },
  { key: 'preparing', label: 'Preparing', icon: '👨‍🍳' },
  { key: 'ready', label: 'Ready', icon: '🍱' },
  { key: 'out_for_delivery', label: 'Out for Delivery', icon: '🚗' },
  { key: 'delivered', label: 'Delivered', icon: '🎉' },
  { key: 'completed', label: 'Completed', icon: '✨' },
]

const CANCELLED_STATUS = { key: 'cancelled', label: 'Cancelled', icon: '❌' }

export function OrderTracking({ orderNumber }: OrderTrackingProps) {
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    fetchOrder()
    // Poll for order updates every 10 seconds
    const interval = setInterval(fetchOrder, 10000)
    return () => clearInterval(interval)
  }, [orderNumber])

  const fetchOrder = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/orders?orderNumber=${orderNumber}`)
      const data = await response.json()

      if (data.data && Array.isArray(data.data) && data.data.length > 0) {
        const orderData = data.data[0]
        const attrs = orderData.attributes || orderData
        setOrder({
          id: String(orderData.id),
          orderNumber: attrs.orderNumber || orderNumber,
          customerName: attrs.customerName || '',
          customerEmail: attrs.customerEmail,
          customerPhone: attrs.customerPhone,
          customerAddress: attrs.customerAddress,
          items: attrs.items || '[]',
          subtotal: attrs.subtotal || 0,
          deliveryFee: attrs.deliveryFee || 0,
          total: attrs.total || 0,
          notes: attrs.notes,
          paymentMethod: attrs.paymentMethod || 'cash',
          deliveryMethod: attrs.deliveryMethod || 'pickup',
          status: attrs.status || 'pending',
          createdAt: attrs.createdAt || new Date().toISOString(),
          updatedAt: attrs.updatedAt || new Date().toISOString(),
        })
        setError(null)
      } else {
        setError('Order not found')
      }
    } catch (err) {
      console.error('Error fetching order:', err)
      setError('Failed to load order details')
    } finally {
      setLoading(false)
    }
  }

  const parseItems = (itemsJson: string) => {
    try {
      return JSON.parse(itemsJson)
    } catch {
      return []
    }
  }

  const getCurrentStepIndex = () => {
    if (!order) return -1
    if (order.status === 'cancelled') return -1
    return STATUS_STEPS.findIndex(step => step.key === order.status)
  }

  const isStepCompleted = (stepIndex: number) => {
    const currentIndex = getCurrentStepIndex()
    return currentIndex >= 0 && stepIndex <= currentIndex
  }

  const isStepActive = (stepIndex: number) => {
    const currentIndex = getCurrentStepIndex()
    return currentIndex >= 0 && stepIndex === currentIndex
  }

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading order details...</p>
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-8 text-center">
        <div className="text-6xl mb-4">🔍</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Not Found</h2>
        <p className="text-gray-600 mb-6">{error || 'The order you are looking for does not exist.'}</p>
        <button
          onClick={() => router.push('/')}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Back to Home
        </button>
      </div>
    )
  }

  const items = parseItems(order.items)
  const isCancelled = order.status === 'cancelled'

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Order Tracking</h1>
            <p className="text-gray-600 mt-1">Order #{order.orderNumber}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Placed on</p>
            <p className="text-sm font-medium text-gray-900">
              {new Date(order.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </div>
        </div>
      </div>

      {/* Status Progress */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Order Status</h2>
        
        {isCancelled ? (
          <div className="text-center py-8">
            <div className="text-6xl mb-4">{CANCELLED_STATUS.icon}</div>
            <p className="text-xl font-semibold text-red-600">{CANCELLED_STATUS.label}</p>
            <p className="text-gray-600 mt-2">This order has been cancelled</p>
          </div>
        ) : (
          <div className="relative">
            {STATUS_STEPS.map((step, index) => {
              const isCompleted = isStepCompleted(index)
              const isActive = isStepActive(index)
              const showConnector = index < STATUS_STEPS.length - 1
              
              return (
                <div key={step.key} className="relative flex items-start gap-4 pb-8 last:pb-0">
                  {/* Connector Line */}
                  {showConnector && (
                    <div className={`absolute left-6 top-12 w-0.5 h-full ${
                      isCompleted ? 'bg-green-200' : 'bg-gray-200'
                    }`} />
                  )}
                  
                  {/* Step Icon */}
                  <div className={`relative z-10 flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-xl transition-all ${
                    isCompleted
                      ? 'bg-green-100 text-green-600'
                      : isActive
                      ? 'bg-blue-100 text-blue-600 ring-4 ring-blue-200'
                      : 'bg-gray-100 text-gray-400'
                  }`}>
                    {isCompleted && index < getCurrentStepIndex() ? '✓' : step.icon}
                  </div>
                  
                  {/* Step Content */}
                  <div className="flex-1 pt-2">
                    <div className={`font-medium ${
                      isActive ? 'text-blue-600' : isCompleted ? 'text-green-600' : 'text-gray-400'
                    }`}>
                      {step.label}
                    </div>
                    {isActive && (
                      <div className="text-sm text-gray-500 mt-1">In progress...</div>
                    )}
                    {isCompleted && index < getCurrentStepIndex() && (
                      <div className="text-sm text-green-600 mt-1">Completed</div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Order Details */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Details</h2>
        
        <div className="space-y-4">
          {/* Customer Info */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Customer Information</h3>
            <div className="bg-gray-50 rounded-lg p-3 space-y-1">
              <p><span className="text-gray-600">Name:</span> <span className="font-medium">{order.customerName}</span></p>
              {order.customerPhone && (
                <p><span className="text-gray-600">Phone:</span> <span className="font-medium">{order.customerPhone}</span></p>
              )}
              {order.customerEmail && (
                <p><span className="text-gray-600">Email:</span> <span className="font-medium">{order.customerEmail}</span></p>
              )}
              {order.customerAddress && (
                <p><span className="text-gray-600">Address:</span> <span className="font-medium">{order.customerAddress}</span></p>
              )}
            </div>
          </div>

          {/* Order Items */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Items</h3>
            <div className="space-y-3">
              {items.map((item: any, idx: number) => (
                <div key={idx} className="bg-gray-50 rounded-lg p-3">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{item.quantity}x {item.mealName}</div>
                      {item.defaultIngredients && item.defaultIngredients.length > 0 && (
                        <div className="text-xs text-gray-500 mt-1">
                          Default: {item.defaultIngredients.map((ing: any) => ing.name).join(', ')}
                        </div>
                      )}
                      {item.selectedIngredients && item.selectedIngredients.length > 0 && (
                        <div className="text-xs text-blue-600 mt-1">
                          +Added: {item.selectedIngredients.map((ing: any) => ing.name).join(', ')}
                        </div>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-gray-900">₪{item.totalPrice.toFixed(2)}</div>
                      <div className="text-xs text-gray-500">₪{item.unitPrice.toFixed(2)} each</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="border-t pt-4">
            <div className="space-y-2">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>₪{order.subtotal.toFixed(2)}</span>
              </div>
              {order.deliveryFee > 0 && (
                <div className="flex justify-between text-gray-600">
                  <span>Delivery Fee</span>
                  <span>₪{order.deliveryFee.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-lg font-bold text-gray-900 pt-2 border-t">
                <span>Total</span>
                <span>₪{order.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Payment & Delivery Info */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t">
            <div>
              <p className="text-sm text-gray-600">Payment Method</p>
              <p className="font-medium text-gray-900 capitalize">{order.paymentMethod}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Delivery Method</p>
              <p className="font-medium text-gray-900 capitalize">{order.deliveryMethod}</p>
            </div>
          </div>

          {order.notes && (
            <div className="pt-4 border-t">
              <p className="text-sm text-gray-600 mb-1">Special Notes</p>
              <p className="text-gray-900 bg-gray-50 rounded-lg p-3">{order.notes}</p>
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={() => router.push('/')}
          className="flex-1 px-6 py-3 bg-gray-100 text-gray-900 rounded-lg hover:bg-gray-200 transition-colors font-medium"
        >
          Back to Menu
        </button>
        <button
          onClick={fetchOrder}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          Refresh Status
        </button>
      </div>
    </div>
  )
}

