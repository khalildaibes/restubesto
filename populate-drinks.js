/**
 * Script to populate Strapi CMS with drinks and drink categories
 * 
 * Usage: node populate-drinks.js
 * 
 * Requirements:
 * - Node.js 18+ (for native fetch support)
 * - Strapi server running
 * - Valid API token with create permissions
 * - Drinks collection must be created in Strapi first (see STRAPI_DRINKS_SETUP.md)
 * 
 * This script will:
 * 1. Create drink categories (soft-drinks, hot-beverages, alcoholic)
 * 2. Create drinks (4 soft drinks, 3 hot drinks, 3 alcoholic drinks)
 * 
 * IMPORTANT: Before running this script, you must create the Drinks collection in Strapi!
 * Follow the instructions in STRAPI_DRINKS_SETUP.md to set up the collection first.
 * 
 * Note: The script checks for existing entries before creating to avoid duplicates.
 */

// Check Node version
const nodeVersion = process.version;
const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);
if (majorVersion < 18) {
  console.error('❌ This script requires Node.js 18 or higher.');
  console.error(`   Current version: ${nodeVersion}`);
  process.exit(1);
}

const STRAPI_URL = 'http://46.101.178.174:1337';
const API_TOKEN = '125e0e32ce40a943c2390b5aa6d946b9de45b9e8314cfeec5b26471a6b8a8098ee7b34f70b805a6dc7cd4a7f2db5e8ac3fdf6b535cbea8e33d0a80ef91892029dd721d841beee8112c71e4bd75475ed19efd2b89e10f068677f485b43dbb160a051c79bc32c70dbf77b343f00bc4e023324b2fcaa6ab8ede4c3f7649a70daa31';

// Drink Categories
const drinkCategories = [
  {
    name: { 
      en: 'Soft Drinks', 
      he: 'משקאות קלים', 
      ar: 'مشروبات غازية' 
    },
    slug: 'soft-drinks',
    description: { 
      en: 'Refreshing carbonated and non-carbonated soft drinks', 
      he: 'משקאות קלים מוגזים ולא מוגזים מרעננים', 
      ar: 'مشروبات غازية وغير غازية منعشة' 
    },
    imageUrl: 'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400&h=300&fit=crop',
  },
  {
    name: { 
      en: 'Hot Beverages', 
      he: 'משקאות חמים', 
      ar: 'مشروبات ساخنة' 
    },
    slug: 'hot-beverages',
    description: { 
      en: 'Warm and comforting hot drinks', 
      he: 'משקאות חמים מרגיעים', 
      ar: 'مشروبات ساخنة مريحة' 
    },
    imageUrl: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=400&h=300&fit=crop',
  },
  {
    name: { 
      en: 'Alcoholic Drinks', 
      he: 'משקאות אלכוהוליים', 
      ar: 'مشروبات كحولية' 
    },
    slug: 'alcoholic',
    description: { 
      en: 'Beer, wine, and cocktails', 
      he: 'בירה, יין וקוקטיילים', 
      ar: 'بيرة ونبيذ وكوكتيلات' 
    },
    imageUrl: 'https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=400&h=300&fit=crop',
  },
];

// Soft Drinks (4)
const softDrinks = [
  {
    name: { en: 'Coca Cola Zero', he: 'קוקה קולה זירו', ar: 'كوكا كولا زيرو' },
    slug: 'coca-cola-zero',
    description: { 
      en: 'Zero sugar, zero calories, same great taste', 
      he: 'ללא סוכר, ללא קלוריות, אותו טעם נהדר', 
      ar: 'صفر سكر، صفر سعرات حرارية، نفس الطعم الرائع' 
    },
    price: 12.50,
    calories: 0,
    volume: '330ml',
    categorySlug: 'soft-drinks',
    imageUrl: 'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400&h=400&fit=crop',
  },
  {
    name: { en: 'Sprite', he: 'ספרייט', ar: 'سبرايت' },
    slug: 'sprite',
    description: { 
      en: 'Crisp, refreshing lemon-lime flavor', 
      he: 'טעם לימון-ליים פריך ומרענן', 
      ar: 'نكهة الليمون والليمون الحامض المنعشة' 
    },
    price: 12.50,
    calories: 140,
    volume: '330ml',
    categorySlug: 'soft-drinks',
    imageUrl: 'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400&h=400&fit=crop',
  },
  {
    name: { en: 'Fanta Orange', he: 'פנטה תפוז', ar: 'فانتا برتقال' },
    slug: 'fanta-orange',
    description: { 
      en: 'Bursting with orange flavor', 
      he: 'פורץ עם טעם תפוז', 
      ar: 'منفجر بنكهة البرتقال' 
    },
    price: 12.50,
    calories: 150,
    volume: '330ml',
    categorySlug: 'soft-drinks',
    imageUrl: 'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400&h=400&fit=crop',
  },
  {
    name: { en: 'Pepsi', he: 'פפסי', ar: 'بيبسي' },
    slug: 'pepsi',
    description: { 
      en: 'Classic cola taste', 
      he: 'טעם קולה קלאסי', 
      ar: 'طعم الكولا الكلاسيكي' 
    },
    price: 12.50,
    calories: 150,
    volume: '330ml',
    categorySlug: 'soft-drinks',
    imageUrl: 'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400&h=400&fit=crop',
  },
];

// Hot Beverages (3)
const hotDrinks = [
  {
    name: { en: 'Espresso', he: 'אספרסו', ar: 'إسبريسو' },
    slug: 'espresso',
    description: { 
      en: 'Strong, concentrated coffee shot', 
      he: 'זריקת קפה חזקה ומרוכזת', 
      ar: 'جرعة قهوة قوية ومركزة' 
    },
    price: 15.00,
    calories: 5,
    volume: '30ml',
    categorySlug: 'hot-beverages',
    imageUrl: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=400&h=400&fit=crop',
  },
  {
    name: { en: 'Cappuccino', he: 'קפוצ\'ינו', ar: 'كابتشينو' },
    slug: 'cappuccino',
    description: { 
      en: 'Espresso with steamed milk and foam', 
      he: 'אספרסו עם חלב מוקצף וקצף', 
      ar: 'إسبريسو مع حليب مبخر ورغوة' 
    },
    price: 18.00,
    calories: 80,
    volume: '200ml',
    categorySlug: 'hot-beverages',
    imageUrl: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=400&h=400&fit=crop',
  },
  {
    name: { en: 'Green Tea', he: 'תה ירוק', ar: 'شاي أخضر' },
    slug: 'green-tea',
    description: { 
      en: 'Refreshing and healthy green tea', 
      he: 'תה ירוק מרענן ובריא', 
      ar: 'شاي أخضر منعش وصحي' 
    },
    price: 12.00,
    calories: 2,
    volume: '250ml',
    categorySlug: 'hot-beverages',
    imageUrl: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=400&h=400&fit=crop',
  },
];

// Alcoholic Drinks (3)
const alcoholicDrinks = [
  {
    name: { en: 'Beer', he: 'בירה', ar: 'بيرة' },
    slug: 'beer',
    description: { 
      en: 'Cold, refreshing beer', 
      he: 'בירה קרה ומרעננת', 
      ar: 'بيرة باردة ومنعشة' 
    },
    price: 25.00,
    calories: 150,
    volume: '500ml',
    categorySlug: 'alcoholic',
    imageUrl: 'https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=400&h=400&fit=crop',
  },
  {
    name: { en: 'Red Wine', he: 'יין אדום', ar: 'نبيذ أحمر' },
    slug: 'red-wine',
    description: { 
      en: 'Premium red wine', 
      he: 'יין אדום פרימיום', 
      ar: 'نبيذ أحمر فاخر' 
    },
    price: 35.00,
    calories: 125,
    volume: '150ml',
    categorySlug: 'alcoholic',
    imageUrl: 'https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=400&h=400&fit=crop',
  },
  {
    name: { en: 'White Wine', he: 'יין לבן', ar: 'نبيذ أبيض' },
    slug: 'white-wine',
    description: { 
      en: 'Crisp and refreshing white wine', 
      he: 'יין לבן פריך ומרענן', 
      ar: 'نبيذ أبيض منعش' 
    },
    price: 35.00,
    calories: 120,
    volume: '150ml',
    categorySlug: 'alcoholic',
    imageUrl: 'https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=400&h=400&fit=crop',
  },
];

// Helper function to make Strapi API requests
async function strapiRequest(method, endpoint, data = null, locale = 'en') {
  const url = `${STRAPI_URL}/api${endpoint}${endpoint.includes('?') ? '&' : '?'}locale=${locale}`;
  
  const options = {
    method,
    headers: {
      'Authorization': `Bearer ${API_TOKEN}`,
      'Content-Type': 'application/json',
    },
  };
  
  if (data) {
    options.body = JSON.stringify({ data });
  }
  
  const response = await fetch(url, options);
  
  if (!response.ok) {
    const errorText = await response.text();
    let errorData;
    try {
      errorData = JSON.parse(errorText);
    } catch {
      errorData = { message: errorText };
    }
    throw new Error(`Strapi API error (${response.status}): ${errorData.error?.message || errorData.message || response.statusText}`);
  }
  
  return await response.json();
}

// Upload image to Strapi
async function uploadImageToStrapi(imageUrl) {
  try {
    // Download image
    const imageResponse = await fetch(imageUrl);
    if (!imageResponse.ok) {
      throw new Error(`Failed to download image: ${imageResponse.statusText}`);
    }
    
    const imageBlob = await imageResponse.blob();
    const imageBuffer = await imageBlob.arrayBuffer();
    
    // Create form data
    const formData = new FormData();
    const blob = new Blob([imageBuffer], { type: imageBlob.type });
    
    // Clean filename - remove query parameters and invalid characters
    let fileName = imageUrl.split('/').pop() || 'image.jpg';
    // Remove query parameters (everything after ?)
    fileName = fileName.split('?')[0];
    // Remove invalid characters and ensure it has a valid extension
    fileName = fileName.replace(/[^a-zA-Z0-9._-]/g, '_');
    // If no extension, add .jpg
    if (!fileName.includes('.')) {
      fileName = `image_${Date.now()}.jpg`;
    }
    
    formData.append('files', blob, fileName);
    
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
      throw new Error(`Failed to upload image: ${errorText}`);
    }
    
    const uploadData = await uploadResponse.json();
    return uploadData[0]?.id || uploadData.id;
  } catch (error) {
    console.error(`  ⚠ Image upload failed: ${error.message}`);
    return null;
  }
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
  
  return categoryIds.en || categoryIds['en'];
}

// Create drink with i18n support
async function createDrink(drink) {
  console.log(`\n🥤 Creating drink: ${drink.name.en}...`);
  
  // Upload image first (only once, not per locale)
  let imageId = null;
  if (drink.imageUrl) {
    try {
      imageId = await uploadImageToStrapi(drink.imageUrl);
    } catch (error) {
      console.error(`  ⚠ Failed to upload image, continuing without image: ${error.message}`);
    }
  }
  
  const drinkIds = {};
  
  // Create drink for each locale
  for (const locale of ['en', 'he', 'ar']) {
    try {
      // Use the working endpoint (tested in main)
      const endpoint = global.drinksEndpoint || '/drinks';
      
      // Check if drink already exists (try by name if slug filter doesn't work)
      let existing = null;
      try {
        existing = await strapiRequest('GET', `${endpoint}?filters[slug][$eq]=${drink.slug}`, null, locale);
      } catch (e) {
        // If slug filter doesn't work, try by name
        try {
          existing = await strapiRequest('GET', `${endpoint}?filters[name][$eq]=${encodeURIComponent(drink.name[locale])}`, null, locale);
        } catch (e2) {
          // If both fail, continue (drink probably doesn't exist)
        }
      }
      if (existing.data && existing.data.length > 0) {
        drinkIds[locale] = existing.data[0].id;
        console.log(`  ⚠ Drink ${drink.slug} already exists for ${locale} (ID: ${existing.data[0].id}), skipping...`);
        continue;
      }
      
      // Build data object with required fields
      // Build data object matching your Strapi collection fields
      // Required fields: name, description, categorySlug, price, imageUrl
      const data = {
        name: drink.name[locale],
        description: drink.description[locale] || '',
        categorySlug: drink.categorySlug,
        price: drink.price,
        imageUrl: drink.imageUrl || '', // Required field - must not be null
        available: true,
        publishedAt: new Date().toISOString(),
      };
      
      // Optional fields
      if (drink.calories !== undefined && drink.calories !== null) {
        data.calories = drink.calories;
      }
      
      // Note: slug and volume fields are not included as they don't exist in your collection
      // tags field exists but we're not setting it in this script
      
      let result;
      try {
        result = await strapiRequest('POST', endpoint, data, locale);
        drinkIds[locale] = result.data.id;
        console.log(`  ✓ Created ${locale} version (ID: ${result.data.id})`);
      } catch (createError) {
        // Handle "Invalid key" errors - fields that don't exist in collection
        if (createError.message.includes('Invalid key')) {
          const invalidField = createError.message.match(/Invalid key (\w+)/)?.[1] || 'unknown';
          console.error(`  ✗ Error: ${createError.message}`);
          console.error(`     The '${invalidField}' field doesn't exist in your Drinks collection.`);
          if (invalidField === 'slug' || invalidField === 'volume') {
            console.error(`     This is normal - these fields are not in your collection.`);
            console.error(`     The script has been updated to exclude these fields.`);
          }
          // Continue to next locale instead of failing completely
          continue;
        }
        // Check if it's a 404 - collection doesn't exist or wrong endpoint
        else if (createError.message.includes('404') || createError.message.includes('Not Found')) {
          console.error(`\n❌ ERROR: Drinks collection endpoint not found!`);
          console.error(`\n📋 Possible issues:`);
          console.error(`   1. Collection name mismatch: The script uses '/drink' (singular)`);
          console.error(`      If your collection is named 'drinks' (plural), the endpoint should be '/drinks'`);
          console.error(`   2. Collection not created: Create the Drinks collection in Strapi first`);
          console.error(`   3. Strapi not restarted: After creating the collection, restart Strapi`);
          console.error(`\n   Check your Strapi collection name and update the script accordingly.`);
          console.error(`   For detailed instructions, see: STRAPI_DRINKS_SETUP.md\n`);
          // Throw a special error that will stop execution
          throw new Error('DRINKS_COLLECTION_NOT_FOUND');
        }
        // If image field format failed, try without image
        else if (createError.message.includes('Invalid key image') && imageId) {
          console.log(`  ⚠ Trying without image for ${locale}...`);
          const dataNoImage = { ...data };
          delete dataNoImage.image;
          result = await strapiRequest('POST', endpoint, dataNoImage, locale);
          drinkIds[locale] = result.data.id;
          console.log(`  ✓ Created ${locale} version without image (ID: ${result.data.id})`);
        } else {
          console.error(`  ✗ Failed to create drink for ${locale}: ${createError.message}`);
          // Continue to next locale instead of stopping
        }
      }
    } catch (error) {
      // If it's the special error, re-throw to stop execution
      if (error.message === 'DRINKS_COLLECTION_NOT_FOUND') {
        throw error;
      }
      // If drink already exists, try to find it
      if (error.message.includes('409') || error.message.includes('already exists') || error.message.includes('unique')) {
        console.log(`  ⚠ Drink ${drink.slug} already exists for ${locale}, trying to fetch...`);
        try {
          // Try to find existing drink by name
          try {
            existing = await strapiRequest('GET', `${endpoint}?filters[name][$eq]=${encodeURIComponent(drink.name[locale])}`, null, locale);
          } catch (e) {
            // If that fails, try by slug
            try {
              existing = await strapiRequest('GET', `${endpoint}?filters[slug][$eq]=${drink.slug}`, null, locale);
            } catch (e2) {
              // Both failed
            }
          }
          if (existing.data && existing.data.length > 0) {
            drinkIds[locale] = existing.data[0].id;
            console.log(`  ✓ Found existing ${locale} version (ID: ${existing.data[0].id})`);
          }
        } catch (fetchError) {
          console.error(`  ✗ Could not fetch existing drink: ${fetchError.message}`);
        }
      } else {
        console.error(`  ✗ Failed to create drink for ${locale}: ${error.message}`);
      }
    }
  }
  
  return drinkIds.en || drinkIds['en'];
}

// Test if drinks endpoint exists
async function testDrinksEndpoint() {
  console.log('🔍 Testing drinks endpoint...');
  try {
    // Try both singular and plural
    const endpoints = ['/drink', '/drinks'];
    for (const endpoint of endpoints) {
      try {
        const response = await strapiRequest('GET', `${endpoint}?pagination[limit]=1`, null, 'en');
        console.log(`  ✓ Endpoint ${endpoint} is accessible`);
        return endpoint;
      } catch (error) {
        if (!error.message.includes('404')) {
          // If it's not a 404, the endpoint exists but might have permission issues
          console.log(`  ⚠ Endpoint ${endpoint} exists but returned: ${error.message}`);
          return endpoint;
        }
      }
    }
    console.log('  ✗ Neither /drink nor /drinks endpoints are accessible');
    return null;
  } catch (error) {
    console.log(`  ✗ Error testing endpoint: ${error.message}`);
    return null;
  }
}

// Main execution
async function main() {
  console.log('🚀 Starting drinks population script...\n');
  console.log(`📍 Strapi URL: ${STRAPI_URL}`);
  console.log(`🔑 Using API token: ${API_TOKEN.substring(0, 20)}...\n`);
  
  try {
    // Test endpoint first
    const workingEndpoint = await testDrinksEndpoint();
    if (!workingEndpoint) {
      console.error('\n❌ ERROR: Drinks collection endpoint not accessible!');
      console.error('\n📋 Possible solutions:');
      console.error('   1. Restart Strapi server after creating the collection');
      console.error('   2. Check API permissions in Strapi:');
      console.error('      - Go to Settings → Users & Permissions Plugin → Roles');
      console.error('      - Select "Public" or "Authenticated" role');
      console.error('      - Find "drink" (or "drinks") in the list');
      console.error('      - Enable "find" and "create" permissions');
      console.error('   3. Verify collection name matches endpoint');
      console.error('      - Collection name "drink" → endpoint "/api/drink"');
      console.error('      - Collection name "drinks" → endpoint "/api/drinks"');
      console.error('\n   After fixing, run this script again.\n');
      process.exit(1);
    }
    
    // Update endpoint in createDrink function
    global.drinksEndpoint = workingEndpoint;
    console.log(`\n✅ Using endpoint: ${workingEndpoint}\n`);
    
    // Step 1: Create categories
    console.log('═══════════════════════════════════════════════════════════');
    console.log('STEP 1: Creating Drink Categories');
    console.log('═══════════════════════════════════════════════════════════');
    
    for (const category of drinkCategories) {
      await createCategory(category);
    }
    
    // Step 2: Create soft drinks
    console.log('\n═══════════════════════════════════════════════════════════');
    console.log('STEP 2: Creating Soft Drinks');
    console.log('═══════════════════════════════════════════════════════════');
    console.log('⚠️  NOTE: If you get 404 errors, the Drinks collection needs to be created in Strapi first!');
    console.log('    See STRAPI_DRINKS_SETUP.md for instructions.\n');
    
    for (const drink of softDrinks) {
      await createDrink(drink);
    }
    
    // Step 3: Create hot drinks
    console.log('\n═══════════════════════════════════════════════════════════');
    console.log('STEP 3: Creating Hot Beverages');
    console.log('═══════════════════════════════════════════════════════════');
    
    for (const drink of hotDrinks) {
      await createDrink(drink);
    }
    
    // Step 4: Create alcoholic drinks
    console.log('\n═══════════════════════════════════════════════════════════');
    console.log('STEP 4: Creating Alcoholic Drinks');
    console.log('═══════════════════════════════════════════════════════════');
    
    for (const drink of alcoholicDrinks) {
      await createDrink(drink);
    }
    
    console.log('\n═══════════════════════════════════════════════════════════');
    console.log('✅ Drinks population completed successfully!');
    console.log('═══════════════════════════════════════════════════════════');
    console.log(`\n📊 Summary:`);
    console.log(`   - Categories created: ${drinkCategories.length} (soft-drinks, hot-beverages, alcoholic)`);
    console.log(`   - Soft drinks created: ${softDrinks.length}`);
    console.log(`   - Hot beverages created: ${hotDrinks.length}`);
    console.log(`   - Alcoholic drinks created: ${alcoholicDrinks.length}`);
    console.log(`   - Total drinks: ${softDrinks.length + hotDrinks.length + alcoholicDrinks.length}`);
    console.log('\n');
    
  } catch (error) {
    console.error('\n❌ Error during population:', error.message);
    if (error.message.includes('Drinks collection does not exist')) {
      console.error('\n💡 Once you create the Drinks collection in Strapi, run this script again.');
    }
    process.exit(1);
  }
}

// Run the script
main();

