import { NextRequest, NextResponse } from 'next/server'
import { STRAPI_URL, fetchFromStrapi, getStrapiHeaders } from '@/lib/strapi'

// Mark this route as dynamic
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export interface OrderItem {
  mealId: string
  mealName: string
  quantity: number
  unitPrice: number
  totalPrice: number
  selectedIngredients?: Array<{
    id: string
    name: string
    price: number
  }>
}

export interface CreateOrderRequest {
  customerName: string
  customerEmail?: string
  customerPhone?: string
  customerAddress?: string
  items: OrderItem[]
  subtotal: number
  deliveryFee?: number
  total: number
  notes?: string
  paymentMethod?: 'cash' | 'card' | 'online'
  deliveryMethod?: 'pickup' | 'delivery'
}

export async function POST(request: NextRequest) {
  try {
    const body: CreateOrderRequest = await request.json()

    // Validate required fields
    if (!body.customerName || !body.items || body.items.length === 0) {
      return NextResponse.json(
        { error: 'Missing required fields: customerName and items are required' },
        { status: 400 }
      )
    }

    if (!body.total || body.total <= 0) {
      return NextResponse.json(
        { error: 'Invalid total amount' },
        { status: 400 }
      )
    }

    // Prepare order data for Strapi
    const orderData = {
      customerName: body.customerName,
      customerEmail: body.customerEmail || null,
      customerPhone: body.customerPhone || null,
      customerAddress: body.customerAddress || null,
      items: JSON.stringify(body.items), // Store as JSON string or use a relation
      subtotal: body.subtotal,
      deliveryFee: body.deliveryFee || 0,
      total: body.total,
      notes: body.notes || null,
      paymentMethod: body.paymentMethod || 'cash',
      deliveryMethod: body.deliveryMethod || 'pickup',
      status: 'pending', // Default status
      orderNumber: generateOrderNumber(),
      publishedAt: new Date().toISOString(),
    }

    const data = await fetchFromStrapi('/orders', {
      method: 'POST',
      body: JSON.stringify({ data: orderData }),
    })
    
    return NextResponse.json(
      { 
        success: true, 
        order: data.data,
        message: 'Order created successfully' 
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating order:', error)
    return NextResponse.json(
      { 
        error: 'Failed to create order', 
        message: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const orderNumber = searchParams.get('orderNumber')
    const customerEmail = searchParams.get('customerEmail')
    
    const queryParams = new URLSearchParams({
      sort: 'createdAt:desc',
    })

    // Add filters if provided
    if (orderNumber) {
      queryParams.append('filters[orderNumber][$eq]', orderNumber)
    }
    if (customerEmail) {
      queryParams.append('filters[customerEmail][$eq]', customerEmail)
    }

    const params: Record<string, string> = {}
    if (orderNumber) {
      params['filters[orderNumber][$eq]'] = orderNumber
    }
    if (customerEmail) {
      params['filters[customerEmail][$eq]'] = customerEmail
    }
    params['sort'] = 'createdAt:desc'

    const data = await fetchFromStrapi('/orders', {
      cache: 'no-store',
    }, params)
    
    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json(
      { error: 'Failed to fetch orders', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

// Generate a unique order number
function generateOrderNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase()
  const random = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `ORD-${timestamp}-${random}`
}

