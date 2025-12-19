# Category Image Fix

## Issue
Category images weren't showing while banner images were working correctly.

## Root Cause
Categories from Strapi might have:
1. Empty `imageUrl` fields
2. Different image data structure than expected
3. HTTP URLs that need special handling in Next.js Image component

## Fixes Applied

### 1. CategoryCard Component (`features/categories/components/CategoryCard/CategoryCard.tsx`)
- Added conditional rendering for images
- Shows placeholder gradient if `imageUrl` is empty
- Added `unoptimized` flag for HTTP URLs (Strapi server uses HTTP)

### 2. Image URL Transformer (`lib/strapi-transformers.ts`)
- Enhanced `getImageUrl()` function to handle more cases:
  - Direct `imageUrl` text field (from populate script)
  - Strapi media field structure (`image.data.attributes.url`)
  - Alternative media structures
  - String URLs directly
- Added debug logging to identify missing images
- Improved `transformCategory()` with better image URL extraction

### 3. Next.js Image Configuration
- Already configured in `next.config.js` to allow images from:
  - `images.unsplash.com` (mock data)
  - `142.93.172.35:1337` (Strapi server)

## Testing

1. **Check Browser Console:**
   - Look for warnings about categories with no imageUrl
   - This helps identify which categories need images in Strapi

2. **Verify Image URLs:**
   - Categories should show images from mock data (if Strapi is unavailable)
   - Categories from Strapi should show images if `imageUrl` field is populated

3. **Fallback Behavior:**
   - If imageUrl is empty, a gray gradient placeholder is shown
   - Category content (name, description) still displays correctly

## Next Steps

1. **If using Strapi:**
   - Ensure categories in Strapi have the `imageUrl` field populated
   - Or upload images to Strapi media library and use the `image` field
   - Run the `populate-strapi.js` script to add images to categories

2. **If images still don't show:**
   - Check browser console for errors
   - Verify the image URLs are accessible
   - Check if CORS is blocking image requests

## Code Changes

### CategoryCard.tsx
```tsx
{category.imageUrl ? (
  <Image
    src={category.imageUrl}
    alt={getText(category.name, language)}
    fill
    className="object-cover"
    unoptimized={category.imageUrl.startsWith('http://')}
  />
) : (
  <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300" />
)}
```

### strapi-transformers.ts
- Enhanced `getImageUrl()` to check multiple data structures
- Added debug logging for development
- Better handling of empty/null values

