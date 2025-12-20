# Strapi Drinks Collection Setup Guide

This guide explains how to set up the **Drinks** collection in Strapi to work with the restaurant menu application.

---

## Collection Name

**Collection Name:** `drinks` (lowercase, plural)

**Display Name:** Drinks

---

## Collection Fields

### Required Fields

1. **name** (Text - Short text, Required)
   - Multilingual field (i18n enabled)
   - Examples: "Coca Cola", "Orange Juice", "Coffee"

2. **slug** (Text - Short text, Required, Unique)
   - URL-friendly identifier
   - Examples: "coca-cola", "orange-juice", "coffee"
   - Should be unique across all locales

3. **categorySlug** (Text - Short text, Required)
   - References an existing category slug (same categories used for meals)
   - Examples: "soft-drinks", "juices", "hot-beverages", "alcoholic"
   - **IMPORTANT:** Uses the same category system as meals

4. **price** (Number - Decimal, Required, Min: 0)
   - Price in local currency (₪)
   - Example: 12.50

5. **imageUrl** (Text - Long text, Optional)
   - URL to the drink image
   - Can be a full URL or relative path
   - Example: "https://example.com/images/coca-cola.jpg"

### Optional Fields

6. **description** (Text - Long text, Optional)
   - Multilingual field (i18n enabled)
   - Description of the drink
   - Example: "Refreshing carbonated soft drink"

7. **calories** (Number - Integer, Optional)
   - Number of calories
   - Example: 150

8. **available** (Boolean, Optional, Default: true)
   - Whether the drink is currently available
   - Set to false to mark as out of stock

9. **volume** (Text - Short text, Optional)
   - Drink volume/size
   - Examples: "330ml", "500ml", "1L", "Small", "Large"

10. **tags** (Relation - Many-to-Many, Optional)
    - Relation to Tags collection (same as meals)
    - Can tag drinks with labels like "popular", "new", "alcoholic", etc.

---

## Collection Settings

1. **Enable Draft & Publish**: ✅ Yes
2. **Enable Timestamps**: ✅ Yes (usually enabled by default)
3. **i18n (Internationalization)**: ✅ Yes (same as meals)
   - Supported locales: `en`, `he`, `ar`

---

## Field Configuration Details

### i18n Fields (Multilingual)

The following fields support multiple languages:
- `name` - Drink name in each language
- `description` - Description in each language

### Non-i18n Fields (Same across all locales)

These fields are shared across all locales:
- `slug` - Must be unique globally
- `categorySlug` - References category
- `price` - Same price for all locales
- `imageUrl` - Same image for all locales
- `calories` - Same calories for all locales
- `available` - Same availability for all locales
- `volume` - Same volume for all locales

---

## Example Drink Entry

### English (en) Locale:
```json
{
  "name": "Coca Cola",
  "slug": "coca-cola",
  "categorySlug": "soft-drinks",
  "description": "Refreshing carbonated soft drink",
  "price": 12.50,
  "imageUrl": "https://example.com/images/coca-cola.jpg",
  "calories": 150,
  "volume": "330ml",
  "available": true
}
```

### Hebrew (he) Locale (same drink):
```json
{
  "name": "קוקה קולה",
  "slug": "coca-cola",  // Same slug
  "categorySlug": "soft-drinks",  // Same category
  "description": "משקה קל מוגז מרענן",
  "price": 12.50,  // Same price
  "imageUrl": "https://example.com/images/coca-cola.jpg",  // Same image
  "calories": 150,  // Same calories
  "volume": "330ml",  // Same volume
  "available": true  // Same availability
}
```

### Arabic (ar) Locale (same drink):
```json
{
  "name": "كوكا كولا",
  "slug": "coca-cola",  // Same slug
  "categorySlug": "soft-drinks",  // Same category
  "description": "مشروب غازي منعش",
  "price": 12.50,  // Same price
  "imageUrl": "https://example.com/images/coca-cola.jpg",  // Same image
  "calories": 150,  // Same calories
  "volume": "330ml",  // Same volume
  "available": true  // Same availability
}
```

---

## Category Integration

**IMPORTANT:** Drinks use the **same category system as meals**. 

When creating drinks:
1. Use existing category slugs from your Categories collection
2. Common drink categories might include:
   - `soft-drinks` - Soft drinks and sodas
   - `juices` - Fresh juices
   - `hot-beverages` - Coffee, tea, hot chocolate
   - `alcoholic` - Beer, wine, cocktails
   - `water` - Bottled water
   - `smoothies` - Smoothies and shakes

3. You can create new categories specifically for drinks if needed, but they will be shared with meals

---

## API Endpoints

After setup, drinks will be accessible via:

- **GET** `/api/drinks?locale=en` - Get all drinks
- **GET** `/api/drinks?locale=en&category=soft-drinks` - Get drinks by category
- **GET** `/api/admin/drinks?locale=en` - Admin: Get all drinks
- **POST** `/api/admin/drinks` - Admin: Create drink
- **PUT** `/api/admin/drinks/[id]` - Admin: Update drink
- **DELETE** `/api/admin/drinks/[id]` - Admin: Delete drink

---

## Order Integration

Drinks will be included in orders similar to meals:

```json
{
  "items": [
    {
      "mealId": "1",
      "mealName": "California Roll",
      "quantity": 2,
      "unitPrice": 42.00,
      "totalPrice": 84.00,
      "type": "meal"
    },
    {
      "drinkId": "1",
      "drinkName": "Coca Cola",
      "quantity": 1,
      "unitPrice": 12.50,
      "totalPrice": 12.50,
      "type": "drink"
    }
  ]
}
```

---

## Verification Steps

1. **Create a test drink** in Strapi admin panel
2. **Test API endpoint:**
   ```bash
   GET /api/drinks?locale=en
   ```
3. **Verify i18n** by checking the same drink in different locales
4. **Test category filtering:**
   ```bash
   GET /api/drinks?locale=en&category=soft-drinks
   ```
5. **Test admin endpoints** from the admin panel

---

## Notes

- Drinks follow the same structure as meals for consistency
- Use the same category system to allow filtering by category
- All drinks are i18n enabled for multilingual support
- The `slug` field must be unique across all locales
- The `categorySlug` references existing categories (shared with meals)

