# Strapi CMS Collections Guide

This document outlines all the Strapi collections (Content Types) needed to manage the restaurant menu frontend.

## Prerequisites

1. **Install Strapi i18n Plugin** - Enable internationalization for multilingual support (English, Hebrew, Arabic)
2. **Enable Media Library** - For image uploads
3. **Configure Locales**: `en`, `he`, `ar`

---

## Collections (Content Types)

### 1. **Banner** (Promotion Banner)
**Purpose**: Manage promotional banners displayed on the home page carousel

**Fields**:
- `title` (Text - Short text) - **i18n enabled**
- `subtitle` (Text - Long text) - **i18n enabled**
- `image` (Media - Single media) - Banner image
- `order` (Number - Integer) - Display order (default: 0)
- `isActive` (Boolean) - Show/hide banner (default: true)
- `link` (Text - Short text, optional) - Optional link URL
- `startDate` (Date - Date) - When banner should start showing (optional)
- `endDate` (Date - Date) - When banner should stop showing (optional)

**Settings**:
- Enable i18n for: `title`, `subtitle`
- Enable Draft & Publish
- Enable Timestamps

---

### 2. **Category** (Menu Category)
**Purpose**: Manage menu categories (Sushi Rolls, Sashimi, etc.)

**Fields**:
- `name` (Text - Short text) - **i18n enabled**
- `slug` (UID) - Auto-generated from name (e.g., "sushi-rolls")
- `description` (Text - Long text) - **i18n enabled**
- `image` (Media - Single media) - Category image
- `order` (Number - Integer) - Display order in grid (default: 0)
- `isActive` (Boolean) - Show/hide category (default: true)
- `meals` (Relation - Many-to-Many with Meal) - Related meals

**Settings**:
- Enable i18n for: `name`, `description`
- Enable Draft & Publish
- Enable Timestamps
- Slug field: `slug` (based on `name`)

---

### 3. **Meal** (Menu Item)
**Purpose**: Manage individual menu items/meals

**Fields**:
- `name` (Text - Short text) - **i18n enabled**
- `description` (Text - Long text) - **i18n enabled**
- `price` (Number - Decimal) - Price in ₪ (e.g., 42.00)
- `image` (Media - Single media) - Meal image
- `calories` (Number - Integer, optional) - Calorie count
- `category` (Relation - Many-to-One with Category) - **Required**
- `tags` (Relation - Many-to-Many with Tag) - Meal tags
- `defaultIngredients` (Relation - Many-to-Many with Ingredient) - Default ingredients included
- `optionalIngredients` (Relation - Many-to-Many with Ingredient) - Optional add-ons available
- `order` (Number - Integer) - Display order within category (default: 0)
- `isActive` (Boolean) - Show/hide meal (default: true)
- `isPopular` (Boolean) - Mark as popular item (default: false)
- `isVegetarian` (Boolean) - Vegetarian option (default: false)
- `isSpicy` (Boolean) - Spicy item (default: false)
- `isPremium` (Boolean) - Premium item (default: false)

**Settings**:
- Enable i18n for: `name`, `description`
- Enable Draft & Publish
- Enable Timestamps

---

### 4. **Ingredient** (Meal Ingredients)
**Purpose**: Manage ingredients that can be added to meals (default or optional)

**Fields**:
- `name` (Text - Short text) - **i18n enabled**
- `slug` (UID) - Auto-generated from name (e.g., "extra-avocado")
- `price` (Number - Decimal) - Additional price if optional (default: 0.00)
- `isDefault` (Boolean) - Whether this is typically a default ingredient (default: false)
- `icon` (Text - Short text, optional) - Icon identifier
- `allergenInfo` (Text - Long text, optional) - **i18n enabled** - Allergen information

**Settings**:
- Enable i18n for: `name`, `allergenInfo`
- Enable Draft & Publish
- Enable Timestamps
- Slug field: `slug` (based on `name`)

**Example Ingredients**:
- Avocado (en) / אבוקדו (he) / أفوكادو (ar)
- Extra Spicy Sauce (en) / רוטב חריף נוסף (he) / صلصة حارة إضافية (ar)
- Extra Cheese (en) / גבינה נוספת (he) / جبن إضافي (ar)
- No Onions (en) / ללא בצל (he) / بدون بصل (ar)

---

### 5. **Tag** (Meal Tags)
**Purpose**: Manage reusable tags for meals (popular, spicy, vegetarian, premium, etc.)

**Fields**:
- `name` (Text - Short text) - **i18n enabled**
- `slug` (UID) - Auto-generated from name (e.g., "popular")
- `color` (Text - Short text, optional) - Tag color for UI (e.g., "#FF5733")
- `icon` (Text - Short text, optional) - Icon identifier

**Settings**:
- Enable i18n for: `name`
- Enable Draft & Publish
- Enable Timestamps
- Slug field: `slug` (based on `name`)

**Example Tags**:
- Popular (en) / פופולרי (he) / شائع (ar)
- Spicy (en) / חריף (he) / حار (ar)
- Vegetarian (en) / צמחוני (he) / نباتي (ar)
- Premium (en) / פרימיום (he) / ممتاز (ar)

---

### 6. **Restaurant Settings** (Single Type)
**Purpose**: Site-wide configuration and settings

**Fields**:
- `restaurantName` (Text - Short text) - **i18n enabled** (e.g., "Sushi-na")
- `restaurantDescription` (Text - Long text, optional) - **i18n enabled**
- `logo` (Media - Single media, optional) - Restaurant logo
- `currency` (Text - Short text) - Currency symbol (default: "₪")
- `currencyCode` (Text - Short text) - Currency code (default: "ILS")
- `contactEmail` (Email, optional)
- `contactPhone` (Text - Short text, optional)
- `address` (Text - Long text, optional) - **i18n enabled**
- `openingHours` (JSON, optional) - Opening hours structure
- `socialMedia` (JSON, optional) - Social media links
- `deliveryFee` (Number - Decimal, optional)
- `minimumOrder` (Number - Decimal, optional)

**Settings**:
- Content Type: **Single Type** (only one instance)
- Enable i18n for: `restaurantName`, `restaurantDescription`, `address`
- Enable Draft & Publish

---

## Relations Summary

```
Category (1) ──< (Many) Meal
Tag (Many) ──< (Many) Meal
Ingredient (Many) ──< (Many) Meal (defaultIngredients)
Ingredient (Many) ──< (Many) Meal (optionalIngredients)
```

---

## API Endpoints Structure

After setting up collections, Strapi will generate:

```
GET /api/banners?locale=en&populate=*
GET /api/categories?locale=en&populate=*
GET /api/meals?locale=en&populate[category][populate]=*&populate[tags][populate]=*
GET /api/tags?locale=en
GET /api/restaurant-setting?locale=en&populate=*
```

---

## Recommended Plugins

1. **i18n Plugin** - For multilingual content (already mentioned)
2. **Upload Plugin** - Media library (built-in)
3. **Users & Permissions Plugin** - For admin access (built-in)
4. **GraphQL Plugin** (optional) - If you prefer GraphQL over REST
5. **Sitemap Plugin** (optional) - For SEO

---

## Permissions Setup

Configure permissions in **Settings > Users & Permissions Plugin > Roles > Public**:

- ✅ `find` - Banners
- ✅ `find` - Categories  
- ✅ `find` - Meals
- ✅ `find` - Tags
- ✅ `find` - Restaurant Settings

---

## Example API Response Structure

### Banner Response:
```json
{
  "data": [
    {
      "id": 1,
      "attributes": {
        "title": "Fresh Sushi Daily",
        "subtitle": "Premium ingredients, authentic flavors",
        "image": { "data": { "attributes": { "url": "/uploads/..." } } },
        "order": 1,
        "isActive": true,
        "locale": "en"
      }
    }
  ]
}
```

### Meal Response (with relations):
```json
{
  "data": [
    {
      "id": 1,
      "attributes": {
        "name": "California Roll",
        "description": "Crab, avocado, cucumber...",
        "price": 42.00,
        "calories": 255,
        "image": { "data": { "attributes": { "url": "/uploads/..." } } },
        "category": {
          "data": {
            "id": 1,
            "attributes": {
              "name": "Sushi Rolls",
              "slug": "sushi-rolls"
            }
          }
        },
        "tags": {
          "data": [
            {
              "id": 1,
              "attributes": {
                "name": "popular",
                "slug": "popular"
              }
            }
          ]
        },
        "locale": "en"
      }
    }
  ]
}
```

---

## Migration Notes

When migrating from mock data to Strapi:

1. **Create all collections** as described above
2. **Enable i18n** for all text fields
3. **Import existing data** using Strapi's import feature or API
4. **Update frontend** to fetch from Strapi API instead of mock data
5. **Handle locale switching** in API calls (add `?locale=en` parameter)

---

## Additional Considerations

### Optional Collections:

1. **Order** - If you want to track orders in Strapi
2. **Review** - Customer reviews/ratings
3. **Ingredient** - Detailed ingredient information
4. **Allergen** - Allergen information for meals
5. **Promotion** - Special promotions/discounts
6. **Opening Hours** - Detailed opening hours management

### Custom Fields:

- Consider adding `createdAt` and `updatedAt` (enabled by default)
- Add `publishedAt` for draft/publish workflow
- Consider SEO fields: `metaTitle`, `metaDescription` (i18n enabled)

---

## Next Steps

1. Install Strapi: `npx create-strapi-app@latest my-strapi --quickstart`
2. Install i18n plugin: `npm install @strapi/plugin-i18n`
3. Configure locales in Strapi admin panel
4. Create collections as described above
5. Set up API permissions
6. Test API endpoints
7. Update frontend to consume Strapi API

