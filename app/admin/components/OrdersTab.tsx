'use client'

import { useState, useEffect } from 'react'

interface Order {
  id: string
  orderNumber: string
  customerName: string
  customerEmail?: string
  customerPhone?: string
  customerAddress?: string
  items: string // JSON string
  subtotal: number
  deliveryFee: number
  total: number
  notes?: string
  paymentMethod: string
  deliveryMethod: string
  status: string
  createdAt: string
  updatedAt: string
}

const STATUS_OPTIONS = [
  'pending',
  'confirmed',
  'preparing',
  'ready',
  'out_for_delivery',
  'delivered',
  'completed',
  'cancelled',
]

export function OrdersTab() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [editingStatus, setEditingStatus] = useState<string>('')

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/orders')
      const data = await response.json()
      
      if (data.data && Array.isArray(data.data)) {
        // Handle Strapi response format
        const ordersList = data.data.map((item: any) => {
          const attrs = item.attributes || item
          // Use documentId if available (Strapi v5 i18n), otherwise use id
          const documentId = item.documentId || item.id
          return {
            id: String(documentId),
            ...attrs,
          }
        })
        setOrders(ordersList)
      }
    } catch (error) {
      console.error('Error fetching orders:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    try {
      const order = orders.find(o => o.id === orderId)
      if (!order) return

      // Only send the status field, not the entire order object
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: newStatus,
        }),
      })

      if (response.ok) {
        await fetchOrders()
        setSelectedOrder(null)
        setEditingStatus('')
      }
    } catch (error) {
      console.error('Error updating order:', error)
      alert('Failed to update order status')
    }
  }

  const parseItems = (itemsJson: string) => {
    try {
      return JSON.parse(itemsJson)
    } catch {
      return []
    }
  }

  if (loading) {
    return <div className="text-center py-12">Loading orders...</div>
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Orders Management</h2>
        <p className="text-gray-600 mt-1">View and manage customer orders</p>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order #
                </th>
                <th className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Items
                </th>
                <th className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.map((order) => {
                const items = parseItems(order.items)
                return (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {order.orderNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div>
                        <div className="font-medium">{order.customerName}</div>
                        {order.customerEmail && (
                          <div className="text-xs text-gray-400">{order.customerEmail}</div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      <div className="max-w-xs">
                        {items.map((item: any, idx: number) => (
                          <div key={idx} className="mb-1">
                            <div className="font-medium">{item.quantity}x {item.mealName}</div>
                            {item.defaultIngredients && item.defaultIngredients.length > 0 && (
                              <div className="text-xs text-gray-500 ml-2">
                                Default: {item.defaultIngredients.map((ing: any) => ing.name).join(', ')}
                              </div>
                            )}
                            {item.selectedIngredients && item.selectedIngredients.length > 0 && (
                              <div className="text-xs text-blue-600 ml-2">
                                +Added: {item.selectedIngredients.map((ing: any) => ing.name).join(', ')}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      ₪{order.total.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                        className={`text-xs font-semibold rounded-full px-3 py-1 border-0 cursor-pointer transition-colors ${
                          order.status === 'completed' ? 'bg-green-100 text-green-800 hover:bg-green-200' :
                          order.status === 'cancelled' ? 'bg-red-100 text-red-800 hover:bg-red-200' :
                          order.status === 'pending' ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200' :
                          'bg-blue-100 text-blue-800 hover:bg-blue-200'
                        }`}
                      >
                        {STATUS_OPTIONS.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => {
                          setSelectedOrder(order)
                          setEditingStatus(order.status)
                        }}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">Order Details - {selectedOrder.orderNumber}</h3>
              <button
                onClick={() => {
                  setSelectedOrder(null)
                  setEditingStatus('')
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Customer Information</h4>
                <div className="bg-gray-50 p-3 rounded">
                  <p><strong>Name:</strong> {selectedOrder.customerName}</p>
                  {selectedOrder.customerEmail && <p><strong>Email:</strong> {selectedOrder.customerEmail}</p>}
                  {selectedOrder.customerPhone && <p><strong>Phone:</strong> {selectedOrder.customerPhone}</p>}
                  {selectedOrder.customerAddress && <p><strong>Address:</strong> {selectedOrder.customerAddress}</p>}
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Order Items</h4>
                <div className="bg-gray-50 p-3 rounded">
                  {parseItems(selectedOrder.items).map((item: any, idx: number) => (
                    <div key={idx} className="mb-3 pb-3 border-b last:border-0">
                      <div className="font-medium">{item.quantity}x {item.mealName}</div>
                      <div className="text-sm text-gray-600">₪{item.unitPrice.toFixed(2)} each</div>
                      
                      {/* Default Ingredients (included with meal) */}
                      {item.defaultIngredients && item.defaultIngredients.length > 0 && (
                        <div className="mt-2 text-sm">
                          <strong className="text-gray-700">Default Ingredients (included):</strong>
                          <ul className="list-disc list-inside ml-2 mt-1">
                            {item.defaultIngredients.map((ing: any, ingIdx: number) => (
                              <li key={ingIdx} className="text-gray-600">
                                {ing.name} {ing.price > 0 ? `(₪${ing.price.toFixed(2)})` : '(free)'}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {/* Selected Optional Ingredients (customer added) */}
                      {item.selectedIngredients && item.selectedIngredients.length > 0 && (
                        <div className="mt-2 text-sm">
                          <strong className="text-blue-700">Added Ingredients (+extra cost):</strong>
                          <ul className="list-disc list-inside ml-2 mt-1">
                            {item.selectedIngredients.map((ing: any, ingIdx: number) => (
                              <li key={ingIdx} className="text-blue-600">
                                {ing.name} (+₪{ing.price.toFixed(2)})
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {/* Show if no ingredients at all */}
                      {(!item.defaultIngredients || item.defaultIngredients.length === 0) &&
                       (!item.selectedIngredients || item.selectedIngredients.length === 0) && (
                        <div className="mt-1 text-xs text-gray-400 italic">No ingredients specified</div>
                      )}
                      
                      <div className="text-sm font-medium mt-2">Subtotal: ₪{item.totalPrice.toFixed(2)}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p><strong>Subtotal:</strong> ₪{selectedOrder.subtotal.toFixed(2)}</p>
                  <p><strong>Delivery Fee:</strong> ₪{selectedOrder.deliveryFee.toFixed(2)}</p>
                  <p className="text-lg font-bold"><strong>Total:</strong> ₪{selectedOrder.total.toFixed(2)}</p>
                </div>
                <div>
                  <p><strong>Payment:</strong> {selectedOrder.paymentMethod}</p>
                  <p><strong>Delivery:</strong> {selectedOrder.deliveryMethod}</p>
                </div>
              </div>

              {selectedOrder.notes && (
                <div>
                  <h4 className="font-semibold mb-2">Notes</h4>
                  <p className="bg-gray-50 p-3 rounded">{selectedOrder.notes}</p>
                </div>
              )}

              <div>
                <h4 className="font-semibold mb-2">Update Status</h4>
                <div className="flex gap-2">
                  <select
                    value={editingStatus}
                    onChange={(e) => setEditingStatus(e.target.value)}
                    className="flex-1 border border-gray-300 rounded-md px-3 py-2"
                  >
                    {STATUS_OPTIONS.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={() => handleStatusUpdate(selectedOrder.id, editingStatus)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Update
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

