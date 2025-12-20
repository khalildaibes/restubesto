/**
 * Script to populate Strapi CMS with static meals, categories, tags, ingredients, and banners
 * 
 * Usage: node populate-strapi.js
 * 
 * Requirements:
 * - Node.js 18+ (for native fetch support)
 * - Strapi server running at http://142.93.172.35:1337
 * - Valid API token with create permissions
 * 
 * This script will:
 * 1. Create ingredients (with i18n support for en, he, ar)
 * 2. Create categories (with i18n support for en, he, ar)
 * 3. Create tags (with i18n support)
 * 4. Create banners (with i18n support)
 * 5. Create meals with relations to categories, tags, and ingredients
 * 
 * Note: The script checks for existing entries before creating to avoid duplicates.
 */

// Check Node version
const nodeVersion = process.version;
const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);
if (majorVersion < 18) {
  console.error('❌ This script requires Node.js 18 or higher.');
  console.error(`   Current version: ${nodeVersion}`);
  console.error('   Please upgrade Node.js or install node-fetch package.');
  process.exit(1);
}

const STRAPI_URL = 'http://46.101.178.174:1337';
const API_TOKEN = 'ffe2eca12673af4f9098bce1b76f928a5df7302f93c96ebd975918cf8da919e335a574c665c14bef702ab830c0d5fec09e1e0b6966c5d5080625a4334c57b0b9058b011c44ca5f42cb894098da8f06e54131177102e2e26a3cb20e74f3187c8ab6ef0ecc52653e52db088b80b5ca509606794f655978a6e515c79ecdab69271';

// Data from mock files (converted from TypeScript to JavaScript)
const defaultIngredients = [
  {
    id: 'ing-1',
    name: { en: 'Crab', he: 'סרטן', ar: 'سلطعون' },
    price: 0,
    isDefault: true,
  },
  {
    id: 'ing-2',
    name: { en: 'Avocado', he: 'אבוקדו', ar: 'أفوكادو' },
    price: 0,
    isDefault: true,
  },
  {
    id: 'ing-3',
    name: { en: 'Cucumber', he: 'מלפפון', ar: 'خيار' },
    price: 0,
    isDefault: true,
  },
];

const optionalIngredients = [
  {
    id: 'ing-4',
    name: { en: 'Extra Avocado', he: 'אבוקדו נוסף', ar: 'أفوكادو إضافي' },
    price: 5,
    isDefault: false,
  },
  {
    id: 'ing-5',
    name: { en: 'Spicy Mayo', he: 'מיונז חריף', ar: 'مايونيز حار' },
    price: 3,
    isDefault: false,
  },
  {
    id: 'ing-6',
    name: { en: 'No Cucumber', he: 'ללא מלפפון', ar: 'بدون خيار' },
    price: 0,
    isDefault: false,
  },
];

const categories = [
  {
    id: '1',
    name: { en: 'Sushi Rolls', he: 'רולים', ar: 'لفائف السوشي' },
    slug: 'sushi-rolls',
    imageUrl: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400&h=300&fit=crop',
    description: { en: 'Traditional and modern sushi rolls', he: 'רולים מסורתיים ומודרניים', ar: 'لفائف السوشي التقليدية والحديثة' },
  },
  {
    id: '2',
    name: { en: 'Sashimi', he: 'סשימי', ar: 'ساشيمي' },
    slug: 'sashimi',
    imageUrl: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=400&h=300&fit=crop',
    description: { en: 'Fresh raw fish, expertly sliced', he: 'דג טרי, חתוך במיומנות', ar: 'سمك نيء طازج، مقطع بمهارة' },
  },
  {
    id: '3',
    name: { en: 'Nigiri', he: 'ניגירי', ar: 'نيجيري' },
    slug: 'nigiri',
    imageUrl: 'https://images.unsplash.com/photo-1579871494447-9811f80d6caf?w=400&h=300&fit=crop',
    description: { en: 'Hand-pressed sushi with premium fish', he: 'סושי לחוץ ידנית עם דג איכותי', ar: 'سوشي مضغوط يدوياً مع سمك ممتاز' },
  },
  {
    id: '4',
    name: { en: 'Appetizers', he: 'מתאבנים', ar: 'المقبلات' },
    slug: 'appetizers',
    imageUrl: 'https://images.unsplash.com/photo-1562967914-608f82629710?w=400&h=300&fit=crop',
    description: { en: 'Start your meal right', he: 'התחל את הארוחה שלך נכון', ar: 'ابدأ وجبتك بشكل صحيح' },
  },
  {
    id: '5',
    name: { en: 'Soups', he: 'מרקים', ar: 'الشوربات' },
    slug: 'soups',
    imageUrl: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=300&fit=crop',
    description: { en: 'Warming and comforting', he: 'מחמם ומנחם', ar: 'دافئ ومريح' },
  },
  {
    id: '6',
    name: { en: 'Desserts', he: 'קינוחים', ar: 'الحلويات' },
    slug: 'desserts',
    imageUrl: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400&h=300&fit=crop',
    description: { en: 'Sweet endings', he: 'סיומים מתוקים', ar: 'نهايات حلوة' },
  },
];

const meals = [
  {
    id: '1',
    categorySlug: 'sushi-rolls',
    name: { en: 'California Roll', he: 'רול קליפורניה', ar: 'لفيفة كاليفورنيا' },
    description: { en: 'Crab, avocado, cucumber wrapped in nori and sushi rice', he: 'סרטן, אבוקדו, מלפפון עטופים בנורי ואורז סושי', ar: 'سلطعون، أفوكادو، خيار ملفوف في نوري وأرز السوشي' },
    price: 42,
    imageUrl: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400&h=300&fit=crop',
    calories: 255,
    tags: [{ en: 'popular', he: 'פופולרי', ar: 'شائع' }],
    defaultIngredients: defaultIngredients,
    optionalIngredients: optionalIngredients,
  },
  {
    id: '2',
    categorySlug: 'sushi-rolls',
    name: { en: 'Spicy Tuna Roll', he: 'רול טונה חריף', ar: 'لفيفة التونة الحارة' },
    description: { en: 'Fresh tuna mixed with spicy mayo, wrapped with cucumber', he: 'טונה טרייה מעורבת עם מיונז חריף, עטופה במלפפון', ar: 'تونة طازجة ممزوجة مع المايونيز الحار، ملفوفة بالخيار' },
    price: 48,
    imageUrl: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=400&h=300&fit=crop',
    calories: 290,
    tags: [{ en: 'spicy', he: 'חריף', ar: 'حار' }],
  },
  {
    id: '3',
    categorySlug: 'sashimi',
    name: { en: 'Salmon Sashimi', he: 'סשימי סלמון', ar: 'ساشيمي السلمون' },
    description: { en: 'Premium Atlantic salmon, expertly sliced and served fresh', he: 'סלמון אטלנטי איכותי, חתוך במיומנות ומוגש טרי', ar: 'سلمون أطلسي ممتاز، مقطع بمهارة وطازج' },
    price: 58,
    imageUrl: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=300&fit=crop',
    calories: 180,
    tags: [{ en: 'premium', he: 'פרימיום', ar: 'ممتاز' }],
  },
  {
    id: '4',
    categorySlug: 'sashimi',
    name: { en: 'Tuna Sashimi', he: 'סשימי טונה', ar: 'ساشيمي التونة' },
    description: { en: 'Premium bluefin tuna, cut to perfection', he: 'טונה כחולת סנפיר איכותית, חתוכה לשלמות', ar: 'تونة زرقاء الزعنفة ممتازة، مقطعة بإتقان' },
    price: 72,
    imageUrl: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400&h=300&fit=crop',
    calories: 195,
    tags: [{ en: 'premium', he: 'פרימיום', ar: 'ممتاز' }],
  },
  {
    id: '5',
    categorySlug: 'nigiri',
    name: { en: 'Salmon Nigiri', he: 'ניגירי סלמון', ar: 'نيجيري السلمون' },
    description: { en: 'Hand-pressed sushi rice topped with fresh Atlantic salmon', he: 'אורז סושי לחוץ ידנית עם סלמון אטלנטי טרי', ar: 'أرز سوشي مضغوط يدوياً مع سلمون أطلسي طازج' },
    price: 38,
    imageUrl: 'https://images.unsplash.com/photo-1579871494447-9811f80d6caf?w=400&h=300&fit=crop',
    calories: 125,
    tags: [{ en: 'popular', he: 'פופולרי', ar: 'شائع' }],
  },
  {
    id: '6',
    categorySlug: 'appetizers',
    name: { en: 'Edamame', he: 'אדממה', ar: 'إيدامامي' },
    description: { en: 'Fresh young soybeans, steamed and lightly salted', he: 'פולי סויה צעירים טריים, מאודים ומלוחים קלות', ar: 'فول الصويا الطازج، مطبوخ على البخار ومملح قليلاً' },
    price: 22,
    imageUrl: 'https://images.unsplash.com/photo-1562967914-608f82629710?w=400&h=300&fit=crop',
    calories: 95,
    tags: [{ en: 'vegetarian', he: 'צמחוני', ar: 'نباتי' }],
  },
  {
    id: '7',
    categorySlug: 'soups',
    name: { en: 'Miso Soup', he: 'מרק מיסו', ar: 'شوربة الميسو' },
    description: { en: 'Classic Japanese soup made from fermented soybean paste', he: 'מרק יפני קלאסי עשוי מפסטת פולי סויה מותססת', ar: 'شوربة يابانية كلاسيكية مصنوعة من معجون فول الصويا المخمر' },
    price: 18,
    imageUrl: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=300&fit=crop',
    calories: 35,
    tags: [{ en: 'vegetarian', he: 'צמחוני', ar: 'نباتי' }],
  },
  {
    id: '8',
    categorySlug: 'desserts',
    name: { en: 'Mochi Ice Cream', he: 'גלידת מוצ\'י', ar: 'آيس كريم موتشي' },
    description: { en: 'Soft, chewy mochi wrapped around premium ice cream', he: 'מוצ\'י רך ולעיס עטוף בגלידה איכותית', ar: 'موتشي ناعم ومطاطي ملفوف حول آيس كريم ممتاز' },
    price: 28,
    imageUrl: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400&h=300&fit=crop',
    calories: 95,
    tags: [{ en: 'popular', he: 'פופולרי', ar: 'شائع' }],
  },
];

const banners = [
  {
    id: '1',
    imageUrl: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=800&h=400&fit=crop',
    title: { en: 'Fresh Sushi Daily', he: 'סושי טרי יומי', ar: 'سوشي طازج يومي' },
    subtitle: { en: 'Premium ingredients, authentic flavors', he: 'מרכיבים איכותיים, טעמים אותנטיים', ar: 'مكونات ممتازة، نكهات أصيلة' },
  },
  {
    id: '2',
    imageUrl: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800&h=400&fit=crop',
    title: { en: 'New Spring Rolls', he: 'רולים חדשים', ar: 'لفائف الربيع الجديدة' },
    subtitle: { en: 'Crispy and delicious', he: 'פריכים וטעימים', ar: 'مقرمش ولذيذ' },
  },
];

// Extract unique tags from meals
const uniqueTags = new Map();
meals.forEach(meal => {
  meal.tags?.forEach(tag => {
    const key = tag.en.toLowerCase();
    if (!uniqueTags.has(key)) {
      uniqueTags.set(key, tag);
    }
  });
});
const tags = Array.from(uniqueTags.values());

// Cache for uploaded images to avoid re-uploading the same image
const imageUploadCache = new Map();

// Helper function to upload image to Strapi
async function uploadImageToStrapi(imageUrl) {
  // Check cache first
  if (imageUploadCache.has(imageUrl)) {
    console.log(`  📷 Using cached image ID for ${imageUrl}`);
    return imageUploadCache.get(imageUrl);
  }

  try {
    console.log(`  📷 Uploading image from ${imageUrl}...`);
    
    // Download the image
    const imageResponse = await fetch(imageUrl);
    if (!imageResponse.ok) {
      throw new Error(`Failed to download image: HTTP ${imageResponse.status}`);
    }
    
    // Get image buffer
    const imageBuffer = await imageResponse.arrayBuffer();
    const contentType = imageResponse.headers.get('content-type') || 'image/jpeg';
    
    // Extract filename from URL or generate one
    const urlPath = new URL(imageUrl).pathname;
    const filename = urlPath.split('/').pop() || `image-${Date.now()}.jpg`;
    
    // Create FormData for file upload
    const formData = new FormData();
    const blob = new Blob([imageBuffer], { type: contentType });
    // Append blob with filename (Node.js 18+ supports this)
    formData.append('files', blob, filename);
    
    // Upload to Strapi
    const uploadUrl = `${STRAPI_URL}/api/upload`;
    const uploadResponse = await fetch(uploadUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_TOKEN}`,
      },
      body: formData,
    });
    
    if (!uploadResponse.ok) {
      const errorText = await uploadResponse.text();
      throw new Error(`Failed to upload image: HTTP ${uploadResponse.status} - ${errorText}`);
    }
    
    const uploadResult = await uploadResponse.json();
    
    // Strapi returns an array of uploaded files
    if (!uploadResult || !uploadResult[0] || !uploadResult[0].id) {
      throw new Error('Invalid response from Strapi upload endpoint');
    }
    
    const fileId = uploadResult[0].id;
    
    // Cache the result
    imageUploadCache.set(imageUrl, fileId);
    console.log(`  ✓ Image uploaded successfully (ID: ${fileId})`);
    
    return fileId;
  } catch (error) {
    console.error(`  ✗ Failed to upload image: ${error.message}`);
    throw error;
  }
}

// Helper function to make API requests
async function strapiRequest(method, endpoint, data = null, locale = 'en') {
  // For GET requests, add locale as query param
  // For POST/PUT requests, locale might be in the data or as query param
  const separator = endpoint.includes('?') ? '&' : '?';
  const url = method === 'GET' 
    ? `${STRAPI_URL}/api${endpoint}${separator}locale=${locale}`
    : `${STRAPI_URL}/api${endpoint}${separator}locale=${locale}`;
  
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_TOKEN}`,
    },
  };

  if (data && (method === 'POST' || method === 'PUT')) {
    options.body = JSON.stringify({ data });
  }

  try {
    const response = await fetch(url, options);
    
    // Handle empty responses
    const text = await response.text();
    let result;
    try {
      result = text ? JSON.parse(text) : {};
    } catch (e) {
      result = { error: text };
    }
    
    if (!response.ok) {
      const errorMsg = result.error?.message || result.message || JSON.stringify(result);
      throw new Error(`HTTP ${response.status}: ${errorMsg}`);
    }
    
    return result;
  } catch (error) {
    console.error(`Error in ${method} ${endpoint} (locale: ${locale}):`, error.message);
    throw error;
  }
}

// Create ingredient with i18n support
async function createIngredient(ingredient) {
  const ingredientSlug = ingredient.name.en.toLowerCase().replace(/\s+/g, '-');
  console.log(`\n🥄 Creating ingredient: ${ingredient.name.en}...`);
  
  const ingredientIds = {};
  
  // Create ingredient for each locale
  for (const locale of ['en', 'he', 'ar']) {
    try {
      // Skip existence check - i18n fields can't be filtered reliably
      // Just try to create and handle duplicates
      const data = {
        name: ingredient.name[locale],
        price: ingredient.price,
        isDefault: ingredient.isDefault,
        publishedAt: new Date().toISOString(),
      };
      
      // Note: slug is typically auto-generated by Strapi from the name field
      // If your Strapi setup requires explicit slug, uncomment the line below:
      // data.slug = ingredientSlug;
      
      const result = await strapiRequest('POST', '/ingredients', data, locale);
      ingredientIds[locale] = result.data.id;
      console.log(`  ✓ Created ${locale} version (ID: ${result.data.id})`);
    } catch (error) {
      // If ingredient already exists (409 conflict or unique constraint), skip it
      if (error.message.includes('409') || 
          error.message.includes('already exists') || 
          error.message.includes('unique') ||
          error.message.includes('duplicate')) {
        console.log(`  ⚠ Ingredient already exists for ${locale}, skipping...`);
        // Try to fetch all ingredients and find by English name to get the ID
        // This is a fallback - we'll use the English ID for all locales if needed
        if (locale === 'en') {
          try {
            // Fetch all ingredients and find by matching English name
            const allIngredients = await strapiRequest('GET', '/ingredients', null, 'en');
            if (allIngredients.data && Array.isArray(allIngredients.data)) {
              const found = allIngredients.data.find(ing => {
                const attrs = ing.attributes || ing;
                return attrs.name === ingredient.name.en;
              });
              if (found) {
                ingredientIds[locale] = found.id;
                console.log(`  ✓ Found existing ${locale} version (ID: ${found.id})`);
              }
            }
          } catch (fetchError) {
            // Ignore fetch errors
          }
        }
      } else {
        console.error(`  ✗ Failed to create ingredient for ${locale}: ${error.message}`);
      }
    }
  }
  
  return ingredientIds.en || ingredientIds['en']; // Return the main ID
}

// Create category with i18n support
async function createCategory(category) {
  console.log(`\n📁 Creating category: ${category.name.en}...`);
  
  // Upload image first (only once, not per locale)
  let imageId = null;
  if (category.imageUrl) {
    try {
      imageId = await uploadImageToStrapi(category.imageUrl);
    } catch (error) {
      console.error(`  ⚠ Failed to upload image, continuing without image: ${error.message}`);
    }
  }
  
  const categoryIds = {};
  
  // Create category for each locale
  for (const locale of ['en', 'he', 'ar']) {
    try {
      // Check if category already exists
      const existing = await strapiRequest('GET', `/categories?filters[slug][$eq]=${category.slug}`, null, locale);
      if (existing.data && existing.data.length > 0) {
        categoryIds[locale] = existing.data[0].id;
        console.log(`  ⚠ Category ${category.slug} already exists for ${locale} (ID: ${existing.data[0].id}), skipping...`);
        continue;
      }
      
      const data = {
        name: category.name[locale],
        slug: category.slug,
        description: category.description[locale],
        publishedAt: new Date().toISOString(),
      };
      
      // Add image as media field - try different formats
      if (imageId) {
        // Try format: image: imageId (direct ID) - most common in Strapi v4
        data.image = imageId;
      }
      
      let result;
      try {
        result = await strapiRequest('POST', '/categories', data, locale);
        categoryIds[locale] = result.data.id;
        console.log(`  ✓ Created ${locale} version (ID: ${result.data.id})`);
      } catch (createError) {
        // If image field format failed, try alternative formats
        if (createError.message.includes('Invalid key image') && imageId) {
          console.log(`  ⚠ Trying alternative image format for ${locale}...`);
          // Try format: image: { id: imageId }
          const dataAlt = { ...data };
          dataAlt.image = { id: imageId };
          try {
            result = await strapiRequest('POST', '/categories', dataAlt, locale);
            categoryIds[locale] = result.data.id;
            console.log(`  ✓ Created ${locale} version with alternative format (ID: ${result.data.id})`);
          } catch (altError) {
            // If that also fails, try without image
            console.log(`  ⚠ Image format failed, creating without image for ${locale}...`);
            const dataNoImage = { ...data };
            delete dataNoImage.image;
            result = await strapiRequest('POST', '/categories', dataNoImage, locale);
            categoryIds[locale] = result.data.id;
            console.log(`  ✓ Created ${locale} version without image (ID: ${result.data.id})`);
          }
        } else {
          throw createError;
        }
      }
    } catch (error) {
      // If category already exists, try to find it
      if (error.message.includes('409') || error.message.includes('already exists') || error.message.includes('unique')) {
        console.log(`  ⚠ Category ${category.slug} already exists for ${locale}, trying to fetch...`);
        // Try to fetch existing category
        try {
          const existing = await strapiRequest('GET', `/categories?filters[slug][$eq]=${category.slug}`, null, locale);
          if (existing.data && existing.data.length > 0) {
            categoryIds[locale] = existing.data[0].id;
            console.log(`  ✓ Found existing ${locale} version (ID: ${existing.data[0].id})`);
          }
        } catch (fetchError) {
          console.error(`  ✗ Could not fetch existing category: ${fetchError.message}`);
        }
      } else {
        console.error(`  ✗ Failed to create category for ${locale}: ${error.message}`);
      }
    }
  }
  
  return categoryIds.en || categoryIds['en']; // Return the main ID
}

// Create tag with i18n support
async function createTag(tag) {
  const tagSlug = tag.en.toLowerCase().replace(/\s+/g, '-');
  console.log(`\n🏷️  Creating tag: ${tag.en}...`);
  
  const tagIds = {};
  
  // Create tag for each locale
  for (const locale of ['en', 'he', 'ar']) {
    try {
      // Check if tag already exists
      const existing = await strapiRequest('GET', `/tags?filters[slug][$eq]=${tagSlug}`, null, locale);
      if (existing.data && existing.data.length > 0) {
        tagIds[locale] = existing.data[0].id;
        console.log(`  ⚠ Tag ${tagSlug} already exists for ${locale} (ID: ${existing.data[0].id}), skipping...`);
        continue;
      }
      
      const data = {
        name: tag[locale],
        slug: tagSlug,
        publishedAt: new Date().toISOString(),
      };
      
      const result = await strapiRequest('POST', '/tags', data, locale);
      tagIds[locale] = result.data.id;
      console.log(`  ✓ Created ${locale} version (ID: ${result.data.id})`);
    } catch (error) {
      // If tag already exists, try to find it
      if (error.message.includes('409') || error.message.includes('already exists') || error.message.includes('unique')) {
        console.log(`  ⚠ Tag ${tagSlug} already exists for ${locale}, trying to fetch...`);
        // Try to fetch existing tag
        try {
          const existing = await strapiRequest('GET', `/tags?filters[slug][$eq]=${tagSlug}`, null, locale);
          if (existing.data && existing.data.length > 0) {
            tagIds[locale] = existing.data[0].id;
            console.log(`  ✓ Found existing ${locale} version (ID: ${existing.data[0].id})`);
          }
        } catch (fetchError) {
          console.error(`  ✗ Could not fetch existing tag: ${fetchError.message}`);
        }
      } else {
        console.error(`  ✗ Failed to create tag for ${locale}: ${error.message}`);
      }
    }
  }
  
  return tagIds.en || tagIds['en']; // Return the main ID
}

// Create banner with i18n support
async function createBanner(banner) {
  console.log(`\n🎯 Creating banner: ${banner.title.en}...`);
  
  // Upload image first (only once, not per locale)
  let imageId = null;
  if (banner.imageUrl) {
    try {
      imageId = await uploadImageToStrapi(banner.imageUrl);
    } catch (error) {
      console.error(`  ⚠ Failed to upload image, continuing without image: ${error.message}`);
    }
  }
  
  const bannerIds = {};
  
  // Create banner for each locale
  for (const locale of ['en', 'he', 'ar']) {
    try {
      const data = {
        title: banner.title[locale],
        subtitle: banner.subtitle[locale],
        publishedAt: new Date().toISOString(),
      };
      
      // Add image as media field
      if (imageId) {
        data.image = imageId;
      }
      
      let result;
      try {
        result = await strapiRequest('POST', '/banners', data, locale);
        bannerIds[locale] = result.data.id;
        console.log(`  ✓ Created ${locale} version (ID: ${result.data.id})`);
      } catch (createError) {
        // If image field format failed, try alternative formats
        if (createError.message.includes('Invalid key image') && imageId) {
          console.log(`  ⚠ Trying alternative image format for ${locale}...`);
          // Try format: image: { id: imageId }
          const dataAlt = { ...data };
          dataAlt.image = { id: imageId };
          try {
            result = await strapiRequest('POST', '/banners', dataAlt, locale);
            bannerIds[locale] = result.data.id;
            console.log(`  ✓ Created ${locale} version with alternative format (ID: ${result.data.id})`);
          } catch (altError) {
            // If that also fails, try without image
            console.log(`  ⚠ Image format failed, creating without image for ${locale}...`);
            const dataNoImage = { ...data };
            delete dataNoImage.image;
            result = await strapiRequest('POST', '/banners', dataNoImage, locale);
            bannerIds[locale] = result.data.id;
            console.log(`  ✓ Created ${locale} version without image (ID: ${result.data.id})`);
          }
        } else {
          throw createError;
        }
      }
    } catch (error) {
      // If banner already exists, try to find it
      if (error.message.includes('409') || error.message.includes('already exists')) {
        console.log(`  ⚠ Banner already exists for ${locale}, skipping...`);
      } else {
        console.error(`  ✗ Error creating banner for ${locale}: ${error.message}`);
      }
    }
  }
  
  return bannerIds.en || bannerIds['en'];
}

// Get category ID by slug
async function getCategoryIdBySlug(slug, locale = 'en') {
  try {
    const result = await strapiRequest('GET', `/categories?filters[slug][$eq]=${slug}`, null, locale);
    if (result.data && result.data.length > 0) {
      return result.data[0].id;
    }
  } catch (error) {
    console.error(`Error fetching category ${slug}:`, error.message);
  }
  return null;
}

// Get tag ID by name (English)
async function getTagIdByName(tagName, locale = 'en') {
  const tagSlug = tagName.toLowerCase().replace(/\s+/g, '-');
  try {
    const result = await strapiRequest('GET', `/tags?filters[slug][$eq]=${tagSlug}`, null, locale);
    if (result.data && result.data.length > 0) {
      return result.data[0].id;
    }
  } catch (error) {
    console.error(`Error fetching tag ${tagSlug}:`, error.message);
  }
  return null;
}

// Get ingredient ID by name (English name)
async function getIngredientIdByName(name, locale = 'en') {
  try {
    const result = await strapiRequest('GET', `/ingredients?filters[name][$eq]=${encodeURIComponent(name)}`, null, locale);
    if (result.data && result.data.length > 0) {
      return result.data[0].id;
    }
  } catch (error) {
    console.error(`Error fetching ingredient ${name}:`, error.message);
  }
  return null;
}

// Create meal with i18n support
async function createMeal(meal, categoryIdMap, tagIdMap, ingredientIdMap) {
  console.log(`\n🍱 Creating meal: ${meal.name.en}...`);
  
  const categoryId = categoryIdMap[meal.categorySlug];
  if (!categoryId) {
    throw new Error(`Category not found for slug: ${meal.categorySlug}`);
  }
  
  // Upload image first (only once, not per locale)
  let imageId = null;
  if (meal.imageUrl) {
    try {
      imageId = await uploadImageToStrapi(meal.imageUrl);
    } catch (error) {
      console.error(`  ⚠ Failed to upload image, continuing without image: ${error.message}`);
    }
  }
  
  // Get tag IDs for this meal
  const mealTagIds = [];
  if (meal.tags) {
    for (const tag of meal.tags) {
      const tagId = tagIdMap[tag.en.toLowerCase()];
      if (tagId) {
        mealTagIds.push(tagId);
      }
    }
  }
  
  // Get default ingredient IDs for this meal
  const defaultIngredientIds = [];
  if (meal.defaultIngredients) {
    for (const ingredient of meal.defaultIngredients) {
      // Use the English name as the key (lowercase, spaces replaced with hyphens)
      const ingredientKey = ingredient.name.en.toLowerCase().replace(/\s+/g, '-');
      const ingredientId = ingredientIdMap[ingredientKey];
      if (ingredientId) {
        defaultIngredientIds.push(ingredientId);
      } else {
        console.warn(`  ⚠ Default ingredient "${ingredient.name.en}" not found in ingredient map`);
      }
    }
  }
  
  // Get optional ingredient IDs for this meal
  const optionalIngredientIds = [];
  if (meal.optionalIngredients) {
    for (const ingredient of meal.optionalIngredients) {
      // Use the English name as the key (lowercase, spaces replaced with hyphens)
      const ingredientKey = ingredient.name.en.toLowerCase().replace(/\s+/g, '-');
      const ingredientId = ingredientIdMap[ingredientKey];
      if (ingredientId) {
        optionalIngredientIds.push(ingredientId);
      } else {
        console.warn(`  ⚠ Optional ingredient "${ingredient.name.en}" not found in ingredient map`);
      }
    }
  }
  
  const mealIds = {};
  
  // Create meal for each locale
  for (const locale of ['en', 'he', 'ar']) {
    try {
      const data = {
        name: meal.name[locale],
        description: meal.description[locale],
        price: meal.price,
        calories: meal.calories || null,
        category: categoryId,
        tags: mealTagIds,
        publishedAt: new Date().toISOString(),
      };
      
      // Add image as media field
      if (imageId) {
        data.image = imageId;
      }
      
      // Add ingredient relations if available
      if (defaultIngredientIds.length > 0) {
        data.defaultIngredients = defaultIngredientIds;
      }
      if (optionalIngredientIds.length > 0) {
        data.optionalIngredients = optionalIngredientIds;
      }
      
      let result;
      try {
        result = await strapiRequest('POST', '/meals', data, locale);
        mealIds[locale] = result.data.id;
        console.log(`  ✓ Created ${locale} version (ID: ${result.data.id})`);
      } catch (createError) {
        // If image field format failed, try alternative formats
        if (createError.message.includes('Invalid key image') && imageId) {
          console.log(`  ⚠ Trying alternative image format for ${locale}...`);
          // Try format: image: { id: imageId }
          const dataAlt = { ...data };
          dataAlt.image = { id: imageId };
          try {
            result = await strapiRequest('POST', '/meals', dataAlt, locale);
            mealIds[locale] = result.data.id;
            console.log(`  ✓ Created ${locale} version with alternative format (ID: ${result.data.id})`);
          } catch (altError) {
            // If that also fails, try without image
            console.log(`  ⚠ Image format failed, creating without image for ${locale}...`);
            const dataNoImage = { ...data };
            delete dataNoImage.image;
            result = await strapiRequest('POST', '/meals', dataNoImage, locale);
            mealIds[locale] = result.data.id;
            console.log(`  ✓ Created ${locale} version without image (ID: ${result.data.id})`);
          }
        } else {
          // If meal already exists, try to find it
          if (createError.message.includes('409') || createError.message.includes('already exists')) {
            console.log(`  ⚠ Meal already exists for ${locale}, skipping...`);
          } else {
            throw createError;
          }
        }
      }
    } catch (error) {
      // If meal already exists, try to find it
      if (error.message.includes('409') || error.message.includes('already exists')) {
        console.log(`  ⚠ Meal already exists for ${locale}, skipping...`);
      } else {
        console.error(`  ✗ Error creating meal for ${locale}: ${error.message}`);
      }
    }
  }
  
  return mealIds.en || mealIds['en'];
}

// Fetch all existing ingredients and build a map by English name
async function fetchExistingIngredients() {
  const ingredientMap = {};
  try {
    console.log('  📋 Fetching existing ingredients...');
    const result = await strapiRequest('GET', '/ingredients', null, 'en');
    if (result.data && Array.isArray(result.data)) {
      for (const ing of result.data) {
        const attrs = ing.attributes || ing;
        const name = attrs.name || '';
        if (name) {
          const key = name.toLowerCase().replace(/\s+/g, '-');
          ingredientMap[key] = ing.id;
        }
      }
      console.log(`  ✓ Found ${Object.keys(ingredientMap).length} existing ingredients`);
    }
  } catch (error) {
    console.log(`  ⚠ Could not fetch existing ingredients: ${error.message}`);
  }
  return ingredientMap;
}

// Main execution
async function main() {
  console.log('🚀 Starting Strapi population script...\n');
  console.log(`📍 Target: ${STRAPI_URL}`);
  
  try {
    // Step 0: Fetch existing ingredients to avoid duplicates
    console.log('\n═══════════════════════════════════════');
    console.log('STEP 0: Checking Existing Ingredients');
    console.log('═══════════════════════════════════════');
    const existingIngredientMap = await fetchExistingIngredients();
    
    // Step 1: Create ingredients
    console.log('\n═══════════════════════════════════════');
    console.log('STEP 1: Creating Ingredients');
    console.log('═══════════════════════════════════════');
    
    const ingredientIdMap = {};
    const allIngredients = [...defaultIngredients, ...optionalIngredients];
    for (const ingredient of allIngredients) {
      const ingredientKey = ingredient.name.en.toLowerCase().replace(/\s+/g, '-');
      
      // Check if ingredient already exists
      if (existingIngredientMap[ingredientKey]) {
        console.log(`\n🥄 Ingredient "${ingredient.name.en}" already exists (ID: ${existingIngredientMap[ingredientKey]}), skipping creation...`);
        ingredientIdMap[ingredientKey] = existingIngredientMap[ingredientKey];
        continue;
      }
      
      // Try to create the ingredient
      const ingredientId = await createIngredient(ingredient);
      if (ingredientId) {
        ingredientIdMap[ingredientKey] = ingredientId;
      } else {
        console.warn(`  ⚠ Could not get ID for ingredient "${ingredient.name.en}", it may already exist`);
        // Try to fetch it again
        const updatedMap = await fetchExistingIngredients();
        if (updatedMap[ingredientKey]) {
          ingredientIdMap[ingredientKey] = updatedMap[ingredientKey];
        }
      }
      // Add delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    // Step 2: Create categories
    console.log('\n═══════════════════════════════════════');
    console.log('STEP 2: Creating Categories');
    console.log('═══════════════════════════════════════');
    
    const categoryIdMap = {};
    for (const category of categories) {
      const categoryId = await createCategory(category);
      categoryIdMap[category.slug] = categoryId;
      // Add delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    // Step 3: Create tags
    console.log('\n═══════════════════════════════════════');
    console.log('STEP 3: Creating Tags');
    console.log('═══════════════════════════════════════');
    
    const tagIdMap = {};
    for (const tag of tags) {
      const tagSlug = tag.en.toLowerCase();
      const tagId = await createTag(tag);
      tagIdMap[tagSlug] = tagId;
      // Add delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    // Step 4: Create banners
    console.log('\n═══════════════════════════════════════');
    console.log('STEP 4: Creating Banners');
    console.log('═══════════════════════════════════════');
    
    for (const banner of banners) {
      await createBanner(banner);
      // Add delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    // Step 5: Create meals
    console.log('\n═══════════════════════════════════════');
    console.log('STEP 5: Creating Meals');
    console.log('═══════════════════════════════════════');
    
    for (const meal of meals) {
      await createMeal(meal, categoryIdMap, tagIdMap, ingredientIdMap);
      // Add delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    console.log('\n✅ Population complete!');
    console.log(`\n📊 Summary:`);
    console.log(`   - Ingredients: ${allIngredients.length}`);
    console.log(`   - Categories: ${categories.length}`);
    console.log(`   - Tags: ${tags.length}`);
    console.log(`   - Banners: ${banners.length}`);
    console.log(`   - Meals: ${meals.length}`);
    
  } catch (error) {
    console.error('\n❌ Error during population:', error);
    process.exit(1);
  }
}

// Run the script
main();
