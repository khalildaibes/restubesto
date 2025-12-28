export interface Order {
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




