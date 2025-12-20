# Strapi Orders Collection Setup Instructions

Use this document to create or update the Orders collection in Strapi to match the admin dashboard expectations.

## Collection Name: `order` (or `orders`)

### Fields to Create/Update:

#### 1. Customer Information Fields

| Field Name | Type | Required | Settings |
|------------|------|----------|----------|
| `customerName` | Text (Short text) | ✅ Yes | - |
| `customerEmail` | Email | ❌ No | - |
| `customerPhone` | Text (Short text) | ❌ No | - |
| `customerAddress` | Text (Long text) | ❌ No | - |

#### 2. Order Details Fields

| Field Name | Type | Required | Settings |
|------------|------|----------|----------|
| `orderNumber` | Text (Short text) | ✅ Yes | Unique: Yes (if available) |
| `items` | JSON | ✅ Yes | - |
| `subtotal` | Number (Decimal) | ✅ Yes | Min: 0 |
| `deliveryFee` | Number (Decimal) | ❌ No | Default: 0, Min: 0 |
| `total` | Number (Decimal) | ✅ Yes | Min: 0 |
| `notes` | Text (Long text) | ❌ No | - |

#### 3. Status & Method Fields

| Field Name | Type | Required | Default | Options |
|------------|------|----------|---------|---------|
| `status` | Enumeration | ✅ Yes | `pending` | See values below |
| `paymentMethod` | Enumeration | ✅ Yes | `cash` | See values below |
| `deliveryMethod` | Enumeration | ✅ Yes | `pickup` | See values below |

**Status Enumeration Values:**
- `pending`
- `confirmed`
- `preparing`
- `ready`
- `out_for_delivery`
- `delivered`
- `completed`
- `cancelled`

**Payment Method Enumeration Values:**
- `cash`
- `card`
- `online`

**Delivery Method Enumeration Values:**
- `pickup`
- `delivery`

#### 4. Timestamps (Auto-enabled)

- `createdAt` (DateTime) - Auto-generated
- `updatedAt` (DateTime) - Auto-generated
- `publishedAt` (DateTime) - Publication date

---

## Collection Settings

1. **Enable Draft & Publish**: ✅ Yes
2. **Enable Timestamps**: ✅ Yes (usually enabled by default)
3. **i18n (Internationalization)**: ❌ No (orders are language-agnostic)

---

## Items JSON Field Structure

The `items` field stores JSON with this structure. **IMPORTANT**: Each item should include BOTH default and selected ingredients to properly distinguish what was included vs what was added.

```json
[
  {
    "mealId": "string",
    "mealName": "string",
    "quantity": number,
    "unitPrice": number,
    "totalPrice": number,
    "defaultIngredients": [
      {
        "id": "string",
        "name": "string",
        "price": number
      }
    ],
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

### Understanding Ingredients:

- **`defaultIngredients`**: Ingredients that come with the meal by default (always included, may have price 0)
- **`selectedIngredients`**: Optional ingredients that the customer chose to add (extra cost)

### Example:

```json
[
  {
    "mealId": "1",
    "mealName": "California Roll",
    "quantity": 2,
    "unitPrice": 42.00,
    "totalPrice": 84.00,
    "defaultIngredients": [
      {
        "id": "ing-1",
        "name": "Crab",
        "price": 0
      },
      {
        "id": "ing-2",
        "name": "Avocado",
        "price": 0
      },
      {
        "id": "ing-3",
        "name": "Cucumber",
        "price": 0
      }
    ],
    "selectedIngredients": [
      {
        "id": "ing-4",
        "name": "Extra Avocado",
        "price": 5.00
      },
      {
        "id": "ing-5",
        "name": "Spicy Mayo",
        "price": 3.00
      }
    ]
  }
]
```

**In this example:**
- The meal comes with: Crab, Avocado, Cucumber (default ingredients - included in base price)
- Customer added: Extra Avocado (+₪5), Spicy Mayo (+₪3) (selected ingredients - extra cost)
- Total for this item: ₪84 (base) + (₪5 + ₪3) × 2 quantities = ₪100

---

## How to Determine What Ingredients Were Added

### Method 1: Check the Order Item Structure

When creating an order, include both arrays:

1. **Fetch the meal** to get its `defaultIngredients` and `optionalIngredients`
2. **Store in order item:**
   - `defaultIngredients`: Copy from meal's `defaultIngredients` (what comes with the meal)
   - `selectedIngredients`: Only the optional ingredients the customer selected

### Method 2: Compare with Meal Data (if defaultIngredients not stored)

If you only store `selectedIngredients` in the order:
1. Fetch the meal by `mealId` from the order item
2. Get the meal's `defaultIngredients` (always included)
3. The `selectedIngredients` in the order are what was added

### Visual Distinction in Admin Dashboard:

- **Default Ingredients**: Shown in gray/normal text - "Default: Crab, Avocado, Cucumber"
- **Selected Ingredients**: Shown in blue/highlighted - "+Added: Extra Avocado, Spicy Mayo"

---

## API Permissions

Make sure the following permissions are set for the API Token:

**For Public Role (if needed):**
- `order`: `create` ✅

**For Admin/API Token:**
- `order`: `find`, `findOne`, `create`, `update`, `delete` ✅

---

## Quick Setup Command for Cursor/AI

Copy and paste this to Cursor or another AI assistant:

```
Create a Strapi collection called "order" (or "orders") with the following structure:

Required fields:
- customerName (Text - Short text, Required)
- orderNumber (Text - Short text, Required, Unique)
- items (JSON, Required) - stores array of order items
- subtotal (Number - Decimal, Required, Min: 0)
- total (Number - Decimal, Required, Min: 0)
- status (Enumeration, Required, Default: "pending")
  Options: pending, confirmed, preparing, ready, out_for_delivery, delivered, completed, cancelled
- paymentMethod (Enumeration, Required, Default: "cash")
  Options: cash, card, online
- deliveryMethod (Enumeration, Required, Default: "pickup")
  Options: pickup, delivery

Optional fields:
- customerEmail (Email)
- customerPhone (Text - Short text)
- customerAddress (Text - Long text)
- deliveryFee (Number - Decimal, Default: 0, Min: 0)
- notes (Text - Long text)

Settings:
- Enable Draft & Publish: Yes
- Enable Timestamps: Yes
- i18n: No

The items JSON field stores an array where each item has:
- mealId (string)
- mealName (string)
- quantity (number)
- unitPrice (number)
- totalPrice (number)
- defaultIngredients (array of {id, name, price}) - ingredients that come with the meal
- selectedIngredients (array of {id, name, price}) - optional ingredients customer added

IMPORTANT: Store both defaultIngredients and selectedIngredients in each order item to properly distinguish what was included vs what was added.
```

---

## Verification

After creating the collection, verify it works by:

1. **Test Create Order:**
```bash
POST http://46.101.178.174:1337/api/orders
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "data": {
    "customerName": "Test Customer",
    "orderNumber": "ORD-TEST-001",
    "items": "[{\"mealId\":\"1\",\"mealName\":\"Test Meal\",\"quantity\":1,\"unitPrice\":10,\"totalPrice\":10,\"defaultIngredients\":[{\"id\":\"ing-1\",\"name\":\"Default Ingredient\",\"price\":0}],\"selectedIngredients\":[{\"id\":\"ing-2\",\"name\":\"Added Ingredient\",\"price\":5}]}]",
    "subtotal": 10,
    "total": 15,
    "status": "pending",
    "paymentMethod": "cash",
    "deliveryMethod": "pickup",
    "publishedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

2. **Test Get Orders:**
```bash
GET http://46.101.178.174:1337/api/orders?sort=createdAt:desc
Authorization: Bearer YOUR_TOKEN
```

3. **Test Update Order:**
```bash
PUT http://46.101.178.174:1337/api/orders/1
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "data": {
    "status": "confirmed"
  }
}
```

---

## Notes

- **Always store both `defaultIngredients` and `selectedIngredients`** in order items to clearly show what was included vs what was added
- The `defaultIngredients` array contains ingredients that come with the meal (may have price 0)
- The `selectedIngredients` array contains only the optional ingredients the customer chose to add (extra cost)
- If `defaultIngredients` is not stored, you can fetch the meal by `mealId` to get default ingredients
- The `orderNumber` should be unique to avoid duplicates
- All monetary values are stored as decimals (e.g., 42.00 for ₪42.00)
