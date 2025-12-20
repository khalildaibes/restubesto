'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import { Header } from '@/shared/components/layout/Header'
import { OrderTracking } from '@/features/orders/components/OrderTracking'
import { CartDrawer } from '@/features/cart/components/CartDrawer'

export default function OrderTrackingPage() {
  const params = useParams()
  const orderNumber = params.orderNumber as string
  const [isCartOpen, setIsCartOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onCartClick={() => setIsCartOpen(true)} />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <OrderTracking orderNumber={orderNumber} />
      </div>
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  )
}

