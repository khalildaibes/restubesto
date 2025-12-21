/**
 * Script to populate Strapi CMS with meals, categories, and ingredients
 * for a Grill & Meat & Seafood restaurant
 * 
 * Usage: node populate-grill-restaurant.js
 * 
 * Requirements:
 * - Node.js 18+ (for native fetch support)
 * - Strapi server running
 * - Valid API token with create permissions
 * 
 * This script will:
 * 1. Create categories (Seafood, Grill & Meat Selection, Pasta)
 * 2. Create ingredients (including doneness options for meat)
 * 3. Create meals with relations to categories and ingredients
 * 
 * Note: For meat category items, doneness options will be added as optional ingredients.
 */

// Check Node version
const nodeVersion = process.version;
const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);
if (majorVersion < 18) {
  console.error('❌ This script requires Node.js 18 or higher.');
  console.error(`   Current version: ${nodeVersion}`);
  process.exit(1);
}

// Configuration - UPDATE THESE VALUES
const STRAPI_URL = 'http://46.101.178.174:1339';
const API_TOKEN = 'a21102545606697fbc52a039f91bbe373f9689a4cc3144488422f0a346f29018b80f91cbdc2fe39cda8105b8c6c81f2972bd4bace6934bfbc6330e66e6ff209122a1fe26d8bec3faa0354f940e6ee002266c27710dc34042ff6b835b0006c9bd6a850b83fbcd1b81c5c601292b95cff51ed444144ab2950c4f0b146e4b7a7217';

// Doneness options for meat items (as optional ingredients)
const donenessOptions = [
  {
    name: { 
      en: 'Rare', 
      he: 'נא', 
      ar: 'نادر' 
    },
    price: 0,
    isDefault: false,
  },
  {
    name: { 
      en: 'Medium Rare', 
      he: 'נא בינוני', 
      ar: 'نادر متوسط' 
    },
    price: 0,
    isDefault: false,
  },
  {
    name: { 
      en: 'Medium', 
      he: 'בינוני', 
      ar: 'متوسط' 
    },
    price: 0,
    isDefault: false,
  },
  {
    name: { 
      en: 'Medium Well', 
      he: 'בינוני מבושל', 
      ar: 'متوسط مطبوخ' 
    },
    price: 0,
    isDefault: false,
  },
  {
    name: { 
      en: 'Well Done', 
      he: 'מבושל היטב', 
      ar: 'مطبوخ جيداً' 
    },
    price: 0,
    isDefault: false,
  },
];

// Categories from menu
const categories = [
  {
    id: 'seafood',
    name: { 
      en: 'Seafood', 
      he: 'מאכלי ים', 
      ar: 'المأكولات البحرية' 
    },
    slug: 'seafood',
    description: { 
      en: 'Fresh seafood dishes prepared to perfection', 
      he: 'מנות דגים טריות מוכנות לשלמות', 
      ar: 'أطباق مأكولات بحرية طازجة محضرة بإتقان' 
    },
    imageUrl: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=400&h=300&fit=crop',
  },
  {
    id: 'grill-meat',
    name: { 
      en: 'Grill & Meat Selection', 
      he: 'בשרים על האש', 
      ar: 'المشاوي واللحوم' 
    },
    slug: 'grill-meat',
    description: { 
      en: 'Premium grilled meats and kebabs', 
      he: 'בשרים מובחרים על האש וקבבים', 
      ar: 'لحوم مشوية ممتازة وكباب' 
    },
    imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=300&fit=crop',
  },
  {
    id: 'pasta',
    name: { 
      en: 'Pasta', 
      he: 'פסטות', 
      ar: 'الباستا' 
    },
    slug: 'pasta',
    description: { 
      en: 'Fresh pasta dishes', 
      he: 'מנות פסטה טריות', 
      ar: 'أطباق باستا طازجة' 
    },
    imageUrl: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400&h=300&fit=crop',
  },
];

// Meals parsed from menu file
// Format: { categorySlug, name: {en, he, ar}, description: {en, he, ar}, price }
// NOTE: Prices are placeholder values - update them according to your restaurant's pricing
const meals = [
  // SEAFOOD
  {
    categorySlug: 'seafood',
    name: { en: 'Crispy Breaded Fried Shrimp', he: 'שרימפס מטוגן בציפוי פריך', ar: 'شرمس بخبز مقلي' },
    description: { 
      en: 'Fresh shrimp coated in a golden, crunchy crust and fried to perfection.', 
      he: 'שרימפס טרי בציפוי זהוב וקריספי, מטוגן לשלמות.', 
      ar: 'شرمس طازج مغطى بطبقة خبز ذهبية مقرمشة، يُقلى بعناية ليمنحك توازنًا مثاليًا بين الطراوة والقرمشة.' 
    },
    price: 65,
    calories: 280,
  },
  {
    categorySlug: 'seafood',
    name: { en: 'Sesame Crusted Fried Shrimp', he: 'שרימפס מטוגן בציפוי שומשום', ar: 'شرمس بسمسم مقلي' },
    description: { 
      en: 'Premium shrimp coated with toasted sesame seeds, offering a rich and refined flavor.', 
      he: 'שרימפס איכותי בציפוי שומשום קלוי, עם ניחוח עשיר ומעודן.', 
      ar: 'شرمس فاخر مغطى بالسمسم المحمص، مقلي حتى الكمال بنكهة غنية ولمسة آسيوية راقية.' 
    },
    price: 68,
    calories: 295,
  },
  {
    categorySlug: 'seafood',
    name: { en: 'Shrimp in Garlic & Lemon Sauce', he: 'שרימפס ברוטב שום ולימון', ar: 'شرمس مطبوخ بصوص الثوم والليمون' },
    description: { 
      en: 'Tender shrimp gently cooked in a fragrant garlic and lemon sauce.', 
      he: 'שרימפס מבושל בעדינות ברוטב שום טרי ולימון מרענן.', 
      ar: 'شرمس مطبوخ ببطء في صوص الثوم الطازج والليمون، نكهة منعشة ومتوازنة تبرز طعم البحر الأصيل.' 
    },
    price: 65,
    calories: 220,
  },
  {
    categorySlug: 'seafood',
    name: { en: 'Fried Calamari', he: 'קלמארי מטוגן', ar: 'كلماري مقلي' },
    description: { 
      en: 'Classic calamari rings, crispy on the outside and tender inside.', 
      he: 'טבעות קלמארי רכות מבפנים ופריכות מבחוץ.', 
      ar: 'حلقات كلماري طرية من الداخل ومقرمشة من الخارج، تُقدَّم بأسلوب كلاسيكي أنيق.' 
    },
    price: 55,
    calories: 250,
  },
  {
    categorySlug: 'seafood',
    name: { en: 'Calamari in Garlic & Lemon Sauce', he: 'קלמארי ברוטב שום ולימון', ar: 'كلماري مطبوخ بصوص الثوم والليمون' },
    description: { 
      en: 'Calamari slowly cooked in a light, aromatic garlic-lemon sauce.', 
      he: 'קלמארי מבושל ברוטב ארומטי, קליל ואלגנטי.', 
      ar: 'كلماري مطهو برفق في صوص عطري من الثوم والليمون، طبق غني وخفيف في آن واحد.' 
    },
    price: 58,
    calories: 230,
  },
  {
    categorySlug: 'seafood',
    name: { en: 'Fried Calamari Heads', he: 'ראשי קלמארי מטוגנים', ar: 'راس كلماري مقلي' },
    description: { 
      en: 'Carefully selected calamari heads, fried for a bold seafood experience.', 
      he: 'ראשי קלמארי פריכים עם טעם ים עמוק.', 
      ar: 'رؤوس كلماري مختارة بعناية، مقلية حتى القرمشة المثالية لعشاق النكهات البحرية الجريئة.' 
    },
    price: 52,
    calories: 240,
  },
  {
    categorySlug: 'seafood',
    name: { en: 'Cooked Calamari Heads', he: 'ראשי קלמארי מבושלים', ar: 'راس كلماري مطبوخ' },
    description: { 
      en: 'Slow-cooked calamari heads, preserving tenderness and depth of flavor.', 
      he: 'ראשי קלמארי מבושלים לאט לשמירה על עסיסיות.', 
      ar: 'رؤوس كلماري مطبوخة ببطء لتحتفظ بطراوتها ونكهتها العميقة.' 
    },
    price: 55,
    calories: 210,
  },
  {
    categorySlug: 'seafood',
    name: { en: 'Mixed Seafood Platter', he: 'פלטת פירות ים מעורבת', ar: 'مشكل فواكه بحر' },
    description: { 
      en: 'A luxurious selection of the finest seafood, served in one elegant dish.', 
      he: 'מבחר יוקרתי של מאכלי ים בצלחת אחת עשירה.', 
      ar: 'تشكيلة فاخرة من خيرات البحر، تجمع بين عدة أصناف بحرية في طبق واحد غني ومترف.' 
    },
    price: 120,
    calories: 450,
  },
  {
    categorySlug: 'seafood',
    name: { en: 'Cooked Mussels', he: 'צדפות מבושלות', ar: 'صدف مطبوخ' },
    description: { 
      en: 'Fresh mussels delicately cooked with herbs and subtle seasoning.', 
      he: 'צדפות טריות מבושלות בעדינות עם עשבי תיבול.', 
      ar: 'صدف طازج مطبوخ بعناية مع أعشاب مختارة، نكهة بحرية راقية ولمسة متوسطية.' 
    },
    price: 60,
    calories: 180,
  },
  {
    categorySlug: 'seafood',
    name: { en: 'Fried Sea Bream', he: 'דניס מטוגן', ar: 'سمك دينيس مقلي' },
    description: { 
      en: 'Fresh sea bream fried until golden, with delicate white flesh.', 
      he: 'דג דניס טרי מטוגן בגימור זהוב.', 
      ar: 'سمك دينيس طازج مقلي حتى اللون الذهبي، لحم أبيض ناعم ونكهة متوازنة.' 
    },
    price: 85,
    calories: 320,
  },
  {
    categorySlug: 'seafood',
    name: { en: 'Cooked Sea Bream', he: 'דניס מבושל', ar: 'سمك دينيس مطبوخ' },
    description: { 
      en: 'Chef-style cooked sea bream, tender and aromatic.', 
      he: 'דניס מבושל בסגנון שף, רך וארומטי.', 
      ar: 'دينيس مطبوخ بأسلوب الشيف ليحافظ على طراوته ونكهته الطبيعية.' 
    },
    price: 88,
    calories: 290,
  },
  {
    categorySlug: 'seafood',
    name: { en: 'Fried A\'aj Fish', he: 'אג׳ג מטוגן', ar: 'سمك أجاج مقلي' },
    description: { 
      en: 'Lightly fried A\'aj fish, highlighting its natural texture.', 
      he: 'דג אג׳ג מטוגן קלות לשמירה על המרקם.', 
      ar: 'سمك أجاج مقلي بخفة ليبرز قوامه الطري ونكهته المميزة.' 
    },
    price: 80,
    calories: 310,
  },
  {
    categorySlug: 'seafood',
    name: { en: 'Cooked A\'aj Fish', he: 'אג׳ג מבושל', ar: 'سمك أجاج مطبوخ' },
    description: { 
      en: 'Gently cooked A\'aj fish with refined seasoning.', 
      he: 'דג אג׳ג מבושל עם תיבול עדין.', 
      ar: 'سمك أجاج مطبوخ بتوابل ناعمة تحترم طعمه الأصلي.' 
    },
    price: 82,
    calories: 280,
  },
  {
    categorySlug: 'seafood',
    name: { en: 'Fried Grouper', he: 'לוקוס מטוגן', ar: 'سمك لقز مقلي' },
    description: { 
      en: 'Premium grouper, fried to enhance its rich flavor.', 
      he: 'לוקוס איכותי מטוגן, עשיר בטעם.', 
      ar: 'سمك لقز فاخر مقلي بعناية، قوام غني ونكهة بحرية عميقة.' 
    },
    price: 95,
    calories: 340,
  },
  {
    categorySlug: 'seafood',
    name: { en: 'Cooked Grouper', he: 'לוקוס מבושל', ar: 'سمك لقز مطبوخ' },
    description: { 
      en: 'Elegantly cooked grouper, soft and refined.', 
      he: 'לוקוס מבושל בעדינות לשמירה על איכותו.', 
      ar: 'لقز مطبوخ بأسلوب راقٍ يبرز فخامته وطراوته.' 
    },
    price: 98,
    calories: 300,
  },

  // GRILL & MEAT SELECTION
  {
    categorySlug: 'grill-meat',
    name: { en: 'Grilled Brisket', he: 'בריסקט על האש', ar: 'برجيت مشوي' },
    description: { 
      en: 'Slow-grilled brisket, exceptionally tender and juicy.', 
      he: 'בריסקט עסיסי, צלוי באיטיות לשלמות.', 
      ar: 'لحم برجيت مشوي ببطء حتى الطراوة المثالية، غني بالعصارة والنكهة.' 
    },
    price: 95,
    calories: 450,
    hasDoneness: true, // Flag to indicate this item needs doneness options
  },
  {
    categorySlug: 'grill-meat',
    name: { en: 'Grilled Kebab', he: 'קבב על האש', ar: 'كباب مشوي' },
    description: { 
      en: 'Charcoal-grilled kebab, seasoned with classic oriental spices.', 
      he: 'קבב מתובל בסטייל מזרחי קלאסי.', 
      ar: 'كباب متبل بتوابل خاصة، مشوي على الفحم لنكهة شرقية أصيلة.' 
    },
    price: 75,
    calories: 380,
    hasDoneness: true,
  },
  {
    categorySlug: 'grill-meat',
    name: { en: 'Grilled Chicken Breast', he: 'חזה עוף על האש', ar: 'صدر جاج مشوي' },
    description: { 
      en: 'Perfectly grilled chicken breast, light and elegant.', 
      he: 'חזה עוף רך וקליל, צלוי במדויק.', 
      ar: 'صدر دجاج طري ومشوي بإتقان، خيار خفيف وأنيق.' 
    },
    price: 58,
    calories: 220,
    hasDoneness: true,
  },
  {
    categorySlug: 'grill-meat',
    name: { en: 'Grilled Veal Ribs', he: 'צלעות עגל על האש', ar: 'أضلاع عبور مشوية' },
    description: { 
      en: 'Slow-grilled veal ribs, rich and melt-in-your-mouth.', 
      he: 'צלעות עגל עשירות בטעם, נמסות בפה.', 
      ar: 'أضلاع لحم مشوية ببطء حتى الذوبان، تجربة فاخرة لعشاق اللحوم.' 
    },
    price: 110,
    calories: 520,
    hasDoneness: true,
  },
  {
    categorySlug: 'grill-meat',
    name: { en: 'Entrecôte Steak', he: 'סטייק אנטריקוט', ar: 'ستيك إنتريكوت' },
    description: { 
      en: 'Juicy entrecôte steak, grilled to your preference.', 
      he: 'סטייק אנטריקוט עסיסי, צלוי לפי בקשה.', 
      ar: 'قطعة إنتريكوت غنية بالعصارة، مشوية حسب الطلب.' 
    },
    price: 125,
    calories: 480,
    hasDoneness: true,
  },
  {
    categorySlug: 'grill-meat',
    name: { en: 'Filet Steak', he: 'סטייק פילה', ar: 'ستيك فيليه' },
    description: { 
      en: 'Luxurious filet steak, exceptionally tender and refined.', 
      he: 'סטייק פילה יוקרתי ורך במיוחד.', 
      ar: 'فيليه ناعم وفاخر، يُقدَّم بأقصى درجات الأناقة.' 
    },
    price: 140,
    calories: 420,
    hasDoneness: true,
  },
  {
    categorySlug: 'grill-meat',
    name: { en: 'Mixed Grill (Single Portion)', he: 'מיקס בשרים לאדם אחד', ar: 'مشكل لحوم لشخص' },
    description: { 
      en: 'A premium selection of grilled meats served on one plate.', 
      he: 'שילוב מושלם של בשרים מובחרים בצלחת אחת.', 
      ar: 'تشكيلة مختارة من أفضل أنواع اللحوم المشوية في طبق واحد متكامل.' 
    },
    price: 135,
    calories: 580,
    hasDoneness: false, // Mixed grill doesn't need doneness
  },

  // PASTA
  {
    categorySlug: 'pasta',
    name: { en: 'Stuffed Ravioli', he: 'רביולי במילוי עשיר', ar: 'رافيولي محشي' },
    description: { 
      en: 'Fresh ravioli filled with a rich, flavorful stuffing.', 
      he: 'רביולי טרי במילוי מפנק בנגיעת שף.', 
      ar: 'رافيولي طازج محشو بحشوة غنية، يُقدَّم بلمسة الشيف الخاصة.' 
    },
    price: 62,
    calories: 350,
  },
  {
    categorySlug: 'pasta',
    name: { en: 'Chef\'s Special Sautéed Pasta', he: 'מוקפץ בסגנון שף', ar: 'موكباتس' },
    description: { 
      en: 'Modern sautéed pasta with deep, balanced flavors.', 
      he: 'פסטה מוקפצת בטעמים עמוקים ומודרניים.', 
      ar: 'باستا مقلية بأسلوب عصري مع نكهات متوازنة ولمسة فاخرة.' 
    },
    price: 58,
    calories: 320,
  },
];

// Cache for uploaded images
const imageUploadCache = new Map();

// Helper function to upload image to Strapi
async function uploadImageToStrapi(imageUrl) {
  if (imageUploadCache.has(imageUrl)) {
    console.log(`  📷 Using cached image ID for ${imageUrl}`);
    return imageUploadCache.get(imageUrl);
  }

  try {
    console.log(`  📷 Uploading image from ${imageUrl}...`);
    
    const imageResponse = await fetch(imageUrl);
    if (!imageResponse.ok) {
      throw new Error(`Failed to download image: HTTP ${imageResponse.status}`);
    }
    
    const imageBuffer = await imageResponse.arrayBuffer();
    const contentType = imageResponse.headers.get('content-type') || 'image/jpeg';
    
    const urlPath = new URL(imageUrl).pathname;
    const filename = urlPath.split('/').pop() || `image-${Date.now()}.jpg`;
    
    const formData = new FormData();
    const blob = new Blob([imageBuffer], { type: contentType });
    formData.append('files', blob, filename);
    
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
    
    if (!uploadResult || !uploadResult[0] || !uploadResult[0].id) {
      throw new Error('Invalid response from Strapi upload endpoint');
    }
    
    const fileId = uploadResult[0].id;
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
  
  for (const locale of ['en', 'he', 'ar']) {
    try {
      const data = {
        name: ingredient.name[locale],
        price: ingredient.price,
        isDefault: ingredient.isDefault,
        publishedAt: new Date().toISOString(),
      };
      
      const result = await strapiRequest('POST', '/ingredients', data, locale);
      ingredientIds[locale] = result.data.id;
      console.log(`  ✓ Created ${locale} version (ID: ${result.data.id})`);
    } catch (error) {
      if (error.message.includes('409') || 
          error.message.includes('already exists') || 
          error.message.includes('unique') ||
          error.message.includes('duplicate')) {
        console.log(`  ⚠ Ingredient already exists for ${locale}, skipping...`);
        if (locale === 'en') {
          try {
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
  
  return ingredientIds.en || ingredientIds['en'];
}

// Create category with i18n support
async function createCategory(category) {
  console.log(`\n📁 Creating category: ${category.name.en}...`);
  
  let imageId = null;
  if (category.imageUrl) {
    try {
      imageId = await uploadImageToStrapi(category.imageUrl);
    } catch (error) {
      console.error(`  ⚠ Failed to upload image, continuing without image: ${error.message}`);
    }
  }
  
  const categoryIds = {};
  
  for (const locale of ['en', 'he', 'ar']) {
    try {
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
      
      if (imageId) {
        data.image = imageId;
      }
      
      let result;
      try {
        result = await strapiRequest('POST', '/categories', data, locale);
        categoryIds[locale] = result.data.id;
        console.log(`  ✓ Created ${locale} version (ID: ${result.data.id})`);
      } catch (createError) {
        if (createError.message.includes('Invalid key image') && imageId) {
          console.log(`  ⚠ Trying alternative image format for ${locale}...`);
          const dataAlt = { ...data };
          dataAlt.image = { id: imageId };
          try {
            result = await strapiRequest('POST', '/categories', dataAlt, locale);
            categoryIds[locale] = result.data.id;
            console.log(`  ✓ Created ${locale} version with alternative format (ID: ${result.data.id})`);
          } catch (altError) {
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

// Create meal with i18n support
async function createMeal(meal, ingredientIdMap) {
  console.log(`\n🍱 Creating meal: ${meal.name.en}...`);
  
  // Get optional ingredient IDs for doneness (if this is a meat item)
  const optionalIngredientIds = [];
  if (meal.hasDoneness) {
    for (const doneness of donenessOptions) {
      const donenessKey = doneness.name.en.toLowerCase().replace(/\s+/g, '-');
      const donenessId = ingredientIdMap[donenessKey];
      if (donenessId) {
        optionalIngredientIds.push(donenessId);
      } else {
        console.warn(`  ⚠ Doneness option "${doneness.name.en}" not found in ingredient map`);
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
        categorySlug: meal.categorySlug, // Use categorySlug (text field) instead of category (relation)
        imageUrl: meal.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop', // Required field - use placeholder if not provided
        calories: meal.calories || null,
        publishedAt: new Date().toISOString(),
      };
      
      // Add ingredients (doneness options for meat items) - use 'ingredients' field (not optionalIngredients)
      if (optionalIngredientIds.length > 0) {
        data.ingredients = optionalIngredientIds;
      }
      
      let result;
      try {
        result = await strapiRequest('POST', '/meals', data, locale);
        mealIds[locale] = result.data.id;
        console.log(`  ✓ Created ${locale} version (ID: ${result.data.id})`);
      } catch (createError) {
        if (createError.message.includes('409') || createError.message.includes('already exists')) {
          console.log(`  ⚠ Meal already exists for ${locale}, skipping...`);
        } else {
          throw createError;
        }
      }
    } catch (error) {
      if (error.message.includes('409') || error.message.includes('already exists')) {
        console.log(`  ⚠ Meal already exists for ${locale}, skipping...`);
      } else {
        console.error(`  ✗ Error creating meal for ${locale}: ${error.message}`);
      }
    }
  }
  
  return mealIds.en || mealIds['en'];
}

// Main execution
async function main() {
  console.log('🚀 Starting Grill Restaurant Strapi population script...\n');
  console.log(`📍 Target: ${STRAPI_URL}`);
  console.log(`⚠️  IMPORTANT: Make sure to update STRAPI_URL and API_TOKEN at the top of this file!\n`);
  
  if (STRAPI_URL === 'http://YOUR_STRAPI_URL:1337' || API_TOKEN === 'YOUR_API_TOKEN_HERE') {
    console.error('❌ ERROR: Please update STRAPI_URL and API_TOKEN at the top of this file!');
    process.exit(1);
  }
  
  try {
    // Step 0: Fetch existing ingredients
    console.log('\n═══════════════════════════════════════');
    console.log('STEP 0: Checking Existing Ingredients');
    console.log('═══════════════════════════════════════');
    const existingIngredientMap = await fetchExistingIngredients();
    
    // Step 1: Create doneness ingredients
    console.log('\n═══════════════════════════════════════');
    console.log('STEP 1: Creating Doneness Ingredients');
    console.log('═══════════════════════════════════════');
    
    const ingredientIdMap = {};
    for (const doneness of donenessOptions) {
      const donenessKey = doneness.name.en.toLowerCase().replace(/\s+/g, '-');
      
      if (existingIngredientMap[donenessKey]) {
        console.log(`\n🥄 Doneness option "${doneness.name.en}" already exists (ID: ${existingIngredientMap[donenessKey]}), skipping creation...`);
        ingredientIdMap[donenessKey] = existingIngredientMap[donenessKey];
        continue;
      }
      
      const ingredientId = await createIngredient(doneness);
      if (ingredientId) {
        ingredientIdMap[donenessKey] = ingredientId;
      }
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    // Update ingredient map with all existing ingredients
    const updatedMap = await fetchExistingIngredients();
    Object.assign(ingredientIdMap, updatedMap);
    
    // Step 2: Create categories
    console.log('\n═══════════════════════════════════════');
    console.log('STEP 2: Creating Categories');
    console.log('═══════════════════════════════════════');
    
    const categoryIdMap = {};
    for (const category of categories) {
      const categoryId = await createCategory(category);
      categoryIdMap[category.slug] = categoryId;
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    // Step 3: Create meals
    console.log('\n═══════════════════════════════════════');
    console.log('STEP 3: Creating Meals');
    console.log('═══════════════════════════════════════');
    
    for (const meal of meals) {
      await createMeal(meal, ingredientIdMap);
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    console.log('\n✅ Population complete!');
    console.log(`\n📊 Summary:`);
    console.log(`   - Categories: ${categories.length}`);
    console.log(`   - Doneness options: ${donenessOptions.length}`);
    console.log(`   - Meals: ${meals.length}`);
    console.log(`   - Meals with doneness options: ${meals.filter(m => m.hasDoneness).length}`);
    
  } catch (error) {
    console.error('\n❌ Error during population:', error);
    process.exit(1);
  }
}

// Run the script
main();
