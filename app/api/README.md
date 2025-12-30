# API Routes Documentation

This directory contains Next.js API routes that interact with the Strapi CMS backend.

## Available Endpoints

### 1. Meals API

**GET** `/api/meals`

Fetch meals from Strapi with optional filtering.

**Query Parameters:**
- `locale` (optional): Language locale (`en`, `he`, `ar`). Default: `en`
- `category` (optional): Filter by category slug (e.g., `sushi-rolls`)

**Example:**
```typescript
// Fetch all meals
const response = await fetch('/api/meals?locale=en')
const data = await response.json()

// Fetch meals by category
const response = await fetch('/api/meals?locale=en&category=sushi-rolls')
const data = await response.json()
```

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "attributes": {
        "name": "California Roll",
        "description": "...",
        "price": 42.00,
        "category": { ... },
        "tags": [ ... ],
        ...
      }
    }
  ]
}
```

---

### 2. Categories API

**GET** `/api/categories`

Fetch all categories from Strapi.

**Query Parameters:**
- `locale` (optional): Language locale (`en`, `he`, `ar`). Default: `en`

**Example:**
```typescript
const response = await fetch('/api/categories?locale=en')
const data = await response.json()
```

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "attributes": {
        "name": "Sushi Rolls",
        "slug": "sushi-rolls",
        "description": "...",
        "image": { ... },
        ...
      }
    }
  ]
}
```

---

### 3. Tags API

**GET** `/api/tags`

Fetch all tags from Strapi.

**Query Parameters:**
- `locale` (optional): Language locale (`en`, `he`, `ar`). Default: `en`

**Example:**
```typescript
const response = await fetch('/api/tags?locale=en')
const data = await response.json()
```

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "attributes": {
        "name": "popular",
        "slug": "popular",
        ...
      }
    }
  ]
}
```

---

### 4. Orders API

#### Create Order

**POST** `/api/orders`

Create a new order in Strapi.

**Request Body:**
```typescript
{
  customerName: string          // Required
  customerEmail?: string
  customerPhone?: string
  customerAddress?: string
  items: OrderItem[]            // Required
  subtotal: number              // Required
  deliveryFee?: number
  total: number                 // Required
  notes?: string
  paymentMethod?: 'cash' | 'card' | 'online'
  deliveryMethod?: 'pickup' | 'delivery'
}
```

**OrderItem Structure:**
```typescript
{
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
```

**Example:**
```typescript
const orderData = {
  customerName: 'John Doe',
  customerEmail: 'john@example.com',
  customerPhone: '+1234567890',
  customerAddress: '123 Main St, City',
  items: [
    {
      mealId: '1',
      mealName: 'California Roll',
      quantity: 2,
      unitPrice: 42.00,
      totalPrice: 84.00,
      selectedIngredients: [
        {
          id: 'ing-4',
          name: 'Extra Avocado',
          price: 5.00
        }
      ]
    }
  ],
  subtotal: 84.00,
  deliveryFee: 10.00,
  total: 94.00,
  notes: 'Please ring the doorbell',
  paymentMethod: 'card',
  deliveryMethod: 'delivery'
}

const response = await fetch('/api/orders', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(orderData)
})

const result = await response.json()
```

**Response:**
```json
{
  "success": true,
  "order": {
    "id": 1,
    "attributes": {
      "orderNumber": "ORD-ABC123-XYZ",
      "customerName": "John Doe",
      "total": 94.00,
      "status": "pending",
      ...
    }
  },
  "message": "Order created successfully"
}
```

#### Get Orders

**GET** `/api/orders`

Fetch orders with optional filtering.

**Query Parameters:**
- `orderNumber` (optional): Filter by order number
- `customerEmail` (optional): Filter by customer email

**Example:**
```typescript
// Get all orders
const response = await fetch('/api/orders')
const data = await response.json()

// Get order by order number
const response = await fetch('/api/orders?orderNumber=ORD-ABC123-XYZ')
const data = await response.json()

// Get orders by customer email
const response = await fetch('/api/orders?customerEmail=john@example.com')
const data = await response.json()
```

---

## Error Handling

All endpoints return standard HTTP status codes:

- `200` - Success
- `201` - Created (for POST requests)
- `400` - Bad Request (validation errors)
- `500` - Internal Server Error

Error responses follow this format:
```json
{
  "error": "Error message",
  "message": "Detailed error description"
}
```

---

## Environment Variables

You can configure the Strapi connection using environment variables:

```env
STRAPI_URL=http://142.93.172.35:1337
STRAPI_API_TOKEN=your_token_here
```

If not set, the API routes will use default values (hardcoded for development).

---

## Usage in React Components

### Example: Fetching Meals

```typescript
'use client'

import { useEffect, useState } from 'react'

export function MealsList() {
  const [meals, setMeals] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchMeals() {
      try {
        const response = await fetch('/api/meals?locale=en')
        const data = await response.json()
        setMeals(data.data || [])
      } catch (error) {
        console.error('Error fetching meals:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchMeals()
  }, [])

  if (loading) return <div>Loading...</div>

  return (
    <div>
      {meals.map((meal) => (
        <div key={meal.id}>
          <h3>{meal.attributes.name}</h3>
          <p>{meal.attributes.description}</p>
          <p>${meal.attributes.price}</p>
        </div>
      ))}
    </div>
  )
}
```

### Example: Creating an Order

```typescript
'use client'

import { useCartStore } from '@/stores/cart'

export function CheckoutButton() {
  const { items, getSubtotal, clearCart } = useCartStore()

  async function handleCheckout() {
    const orderData = {
      customerName: 'John Doe',
      customerEmail: 'john@example.com',
      items: items.map(item => ({
        mealId: item.mealId,
        mealName: item.name,
        quantity: item.qty,
        unitPrice: item.price,
        totalPrice: item.price * item.qty,
        selectedIngredients: item.selectedIngredients || []
      })),
      subtotal: getSubtotal(),
      total: getSubtotal() + 10, // Add delivery fee
      deliveryMethod: 'delivery',
      paymentMethod: 'card'
    }

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData)
      })

      const result = await response.json()

      if (response.ok) {
        alert(`Order created! Order number: ${result.order.attributes.orderNumber}`)
        clearCart()
      } else {
        alert('Failed to create order: ' + result.error)
      }
    } catch (error) {
      console.error('Error creating order:', error)
      alert('An error occurred while creating the order')
    }
  }

  return (
    <button onClick={handleCheckout}>
      Checkout
    </button>
  )
}
```

---

## Notes

- All API routes use server-side rendering and are not exposed to the client
- The Strapi API token is kept secure on the server
- Responses are not cached by default (`cache: 'no-store'`)
- All endpoints support internationalization via the `locale` parameter






