# Strapi Order Collection Structure

This document outlines the **Order** collection (Content Type) structure for managing customer orders in Strapi.

## Collection: Order

**Purpose**: Store and manage customer orders from the restaurant application

---

## Fields

### Customer Information

| Field Name | Type | Required | Description |
|------------|------|----------|-------------|
| `customerName` | Text (Short text) | ✅ Yes | Customer's full name |
| `customerEmail` | Email | ❌ No | Customer's email address |
| `customerPhone` | Text (Short text) | ❌ No | Customer's phone number |
| `customerAddress` | Text (Long text) | ❌ No | Delivery address (if delivery) |

### Order Details

| Field Name | Type | Required | Description |
|------------|------|----------|-------------|
| `orderNumber` | Text (Short text) | ✅ Yes | Unique order identifier (e.g., "ORD-ABC123-XYZ") |
| `items` | JSON | ✅ Yes | Array of order items (see structure below) |
| `subtotal` | Number (Decimal) | ✅ Yes | Subtotal before delivery fee |
| `deliveryFee` | Number (Decimal) | ❌ No | Delivery fee (default: 0) |
| `total` | Number (Decimal) | ✅ Yes | Total amount including delivery fee |
| `notes` | Text (Long text) | ❌ No | Special instructions or notes from customer |

### Order Status & Method

| Field Name | Type | Required | Default | Description |
|------------|------|----------|---------|-------------|
| `status` | Enumeration | ✅ Yes | `pending` | Order status (see values below) |
| `paymentMethod` | Enumeration | ✅ Yes | `cash` | Payment method (see values below) |
| `deliveryMethod` | Enumeration | ✅ Yes | `pickup` | Delivery method (see values below) |

### Timestamps

| Field Name | Type | Description |
|------------|------|-------------|
| `createdAt` | DateTime | Auto-generated (enabled by default) |
| `updatedAt` | DateTime | Auto-generated (enabled by default) |
| `publishedAt` | DateTime | Publication date |

---

## Enumeration Values

### Status Enumeration
- `pending` - Order received, awaiting processing
- `confirmed` - Order confirmed by restaurant
- `preparing` - Order is being prepared
- `ready` - Order is ready for pickup/delivery
- `out_for_delivery` - Order is out for delivery
- `delivered` - Order has been delivered
- `completed` - Order completed (picked up)
- `cancelled` - Order cancelled

### Payment Method Enumeration
- `cash` - Cash payment
- `card` - Card payment (on-site)
- `online` - Online payment

### Delivery Method Enumeration
- `pickup` - Customer pickup
- `delivery` - Delivery to customer

---

## Items JSON Structure

The `items` field stores an array of order items as JSON. Each item has the following structure:

```json
[
  {
    "mealId": "string",
    "mealName": "string",
    "quantity": number,
    "unitPrice": number,
    "totalPrice": number,
    "selectedIngredients": [
      {
        "id": "string",
        "name": "string",
        "price": number
      }
    ]
  }
]
```

### Example Items JSON:
```json
[
  {
    "mealId": "1",
    "mealName": "California Roll",
    "quantity": 2,
    "unitPrice": 42.00,
    "totalPrice": 84.00,
    "selectedIngredients": [
      {
        "id": "ing-4",
        "name": "Extra Avocado",
        "price": 5.00
      }
    ]
  },
  {
    "mealId": "3",
    "mealName": "Salmon Sashimi",
    "quantity": 1,
    "unitPrice": 58.00,
    "totalPrice": 58.00,
    "selectedIngredients": []
  }
]
```

---

## Settings

### Content Type Settings
- ✅ Enable Draft & Publish
- ✅ Enable Timestamps (createdAt, updatedAt)
- ❌ i18n (Not needed for orders - they are language-agnostic)

### Field Settings
- `orderNumber`: 
  - Make it **unique** (if Strapi supports unique constraints)
  - Consider adding an index for faster lookups
- `items`: 
  - Store as JSON field (or use a relation if you prefer)
  - If using relations, create an `OrderItem` collection separately

---

## API Endpoints

After creating the collection, Strapi will generate:

```
POST   /api/orders              - Create a new order
GET    /api/orders              - Get all orders (with filters)
GET    /api/orders/:id        - Get a specific order
PUT    /api/orders/:id        - Update an order
DELETE /api/orders/:id        - Delete an order
```

### Example API Usage:

**Create Order:**
```bash
POST /api/orders
Content-Type: application/json
Authorization: Bearer YOUR_TOKEN

{
  "data": {
    "customerName": "John Doe",
    "customerEmail": "john@example.com",
    "customerPhone": "+1234567890",
    "customerAddress": "123 Main St, City",
    "items": "[{...}]",
    "subtotal": 142.00,
    "deliveryFee": 10.00,
    "total": 152.00,
    "notes": "Please ring the doorbell",
    "paymentMethod": "card",
    "deliveryMethod": "delivery",
    "status": "pending",
    "orderNumber": "ORD-ABC123-XYZ"
  }
}
```

**Get Orders:**
```bash
GET /api/orders?filters[status][$eq]=pending&sort=createdAt:desc
```

**Get Order by Order Number:**
```bash
GET /api/orders?filters[orderNumber][$eq]=ORD-ABC123-XYZ
```

---

## Permissions Setup

Configure permissions in **Settings > Users & Permissions Plugin > Roles**:

### Public Role (for creating orders):
- ✅ `create` - Orders
- ✅ `find` - Orders (for checking order status)

### Authenticated Role (optional):
- ✅ `find` - Orders (own orders)
- ✅ `findOne` - Orders (own orders)

### Admin Role:
- ✅ `find` - Orders
- ✅ `findOne` - Orders
- ✅ `create` - Orders
- ✅ `update` - Orders
- ✅ `delete` - Orders

---

## Alternative: Using Relations for Order Items

If you prefer to use Strapi relations instead of JSON, you can create a separate **OrderItem** collection:

### OrderItem Collection Fields:
- `order` (Relation - Many-to-One with Order)
- `meal` (Relation - Many-to-One with Meal)
- `quantity` (Number - Integer)
- `unitPrice` (Number - Decimal)
- `totalPrice` (Number - Decimal)
- `selectedIngredients` (JSON or Relation)

Then in the Order collection:
- Remove `items` (JSON field)
- Add `orderItems` (Relation - One-to-Many with OrderItem)

This approach provides better data integrity and querying capabilities but is more complex to set up.

---

## Migration Notes

1. **Create the Order collection** in Strapi admin panel
2. **Add all fields** as described above
3. **Set up enumerations** for status, paymentMethod, and deliveryMethod
4. **Configure permissions** for public and admin roles
5. **Test API endpoints** using the provided examples
6. **Update frontend** to use the new order API endpoint

---

## Example Order Response

```json
{
  "data": {
    "id": 1,
    "attributes": {
      "customerName": "John Doe",
      "customerEmail": "john@example.com",
      "customerPhone": "+1234567890",
      "customerAddress": "123 Main St, City",
      "orderNumber": "ORD-ABC123-XYZ",
      "items": "[{...}]",
      "subtotal": 142.00,
      "deliveryFee": 10.00,
      "total": 152.00,
      "notes": "Please ring the doorbell",
      "paymentMethod": "card",
      "deliveryMethod": "delivery",
      "status": "pending",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z",
      "publishedAt": "2024-01-15T10:30:00.000Z"
    }
  }
}
```


