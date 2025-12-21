# Grill & Meat & Seafood Restaurant - Strapi Setup Guide

This guide explains how to populate your Strapi CMS with menu data for a Grill & Meat & Seafood restaurant.

## Prerequisites

1. **Strapi Server Running**
   - Your Strapi server should be running and accessible
   - Ensure the following collections exist:
     - `category` (with i18n enabled)
     - `meal` (with i18n enabled)
     - `ingredient` (with i18n enabled)

2. **API Token**
   - Generate an API token in Strapi with create permissions
   - Go to: Settings → API Tokens → Create new API Token
   - Select "Full access" or at least "Create" permissions for:
     - Categories
     - Meals
     - Ingredients

3. **Node.js 18+**
   - The script uses native `fetch` which requires Node.js 18 or higher

## Configuration

1. **Update Script Configuration**
   
   Open `populate-grill-restaurant.js` and update these values at the top:
   
   ```javascript
   const STRAPI_URL = 'http://YOUR_STRAPI_URL:1337';
   const API_TOKEN = 'YOUR_API_TOKEN_HERE';
   ```
   
   Replace:
   - `YOUR_STRAPI_URL` with your Strapi server URL (e.g., `http://localhost:1337` or `http://142.93.172.35:1337`)
   - `YOUR_API_TOKEN_HERE` with your actual API token

2. **Update Meal Prices** (Optional but Recommended)
   
   The script includes placeholder prices for all meals. Review and update them in the `meals` array according to your restaurant's pricing:
   
   ```javascript
   {
     categorySlug: 'seafood',
     name: { en: 'Crispy Breaded Fried Shrimp', ... },
     description: { ... },
     price: 65,  // ← Update this price
     calories: 280,
   },
   ```

## Running the Script

1. **Navigate to project directory**
   ```bash
   cd /path/to/restubesto
   ```

2. **Run the script**
   ```bash
   node populate-grill-restaurant.js
   ```

3. **Monitor the output**
   - The script will create categories, ingredients, and meals
   - It will show progress for each item
   - If items already exist, they will be skipped

## What Gets Created

### Categories (3)
- **Seafood** (المأكولات البحرية / מאכלי ים)
- **Grill & Meat Selection** (المشاوي واللحوم / בשרים על האש)
- **Pasta** (الباستה / פסטות)

### Ingredients - Doneness Options (5)
For meat category items, the following doneness options are created as optional ingredients:
- **Rare** (نادر / נא)
- **Medium Rare** (نادر متوسط / נא בינוני)
- **Medium** (متوسط / בינוני)
- **Medium Well** (متوسط مطبوخ / בינוני מבושל)
- **Well Done** (مطبوخ جيداً / מבושל היטב)

### Meals (24 total)

#### Seafood (15 meals)
- Crispy Breaded Fried Shrimp
- Sesame Crusted Fried Shrimp
- Shrimp in Garlic & Lemon Sauce
- Fried Calamari
- Calamari in Garlic & Lemon Sauce
- Fried Calamari Heads
- Cooked Calamari Heads
- Mixed Seafood Platter
- Cooked Mussels
- Fried Sea Bream
- Cooked Sea Bream
- Fried A'aj Fish
- Cooked A'aj Fish
- Fried Grouper
- Cooked Grouper

#### Grill & Meat Selection (7 meals)
All meat items (except Mixed Grill) include doneness selection options:
- Grilled Brisket
- Grilled Kebab
- Grilled Chicken Breast
- Grilled Veal Ribs
- Entrecôte Steak
- Filet Steak
- Mixed Grill (Single Portion) - *No doneness options*

#### Pasta (2 meals)
- Stuffed Ravioli
- Chef's Special Sautéed Pasta

## How Doneness Selection Works

For meat category items, customers will be able to select a doneness level when adding the item to their cart. The doneness options are implemented as **optional ingredients** with price 0, meaning:

- Customers can select one doneness option (e.g., "Medium Rare")
- No additional cost for doneness selection
- The selection is saved with the order item

**Frontend Implementation Note:**
While the backend allows multiple selections, you may want to modify your frontend to ensure only one doneness option can be selected at a time (like a radio button group rather than checkboxes).

## Troubleshooting

### Error: "HTTP 401: Unauthorized"
- Check that your API token is correct
- Verify the token has the necessary permissions

### Error: "HTTP 404: Not Found"
- Verify your Strapi URL is correct
- Ensure the Strapi server is running
- Check that the collections (categories, meals, ingredients) exist in Strapi

### Error: "Collection not found"
- Create the required collections in Strapi first
- Ensure i18n is enabled for name and description fields
- Restart Strapi after creating collections

### Items already exist
- The script will skip items that already exist
- If you want to update existing items, you'll need to do it manually in Strapi or delete them first

### Image upload failures
- Images are downloaded from Unsplash
- If downloads fail, meals will be created without images
- You can add images later manually in Strapi

## Next Steps

After running the script:

1. **Review the data in Strapi**
   - Check that all categories, meals, and ingredients were created correctly
   - Verify translations are correct

2. **Update images** (if needed)
   - The script uses placeholder images from Unsplash
   - Upload your own images in Strapi for each meal and category

3. **Adjust prices**
   - Update meal prices in Strapi if you didn't update them in the script

4. **Test the frontend**
   - Verify meals display correctly
   - Test the doneness selection for meat items
   - Ensure cart and ordering work properly

## Notes

- All content is in three languages: English, Hebrew (עברית), and Arabic (العربية)
- Prices in the script are in ₪ (Israeli Shekel)
- The script includes calorie information for all meals
- Doneness options only apply to meat items (not Mixed Grill)
- The script is idempotent - you can run it multiple times safely
