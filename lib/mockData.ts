import { Language } from './translations'

// Multilingual text type
type MultilingualText = {
  en: string
  he: string
  ar: string
}

export interface Banner {
  id: string
  imageUrl: string
  title: MultilingualText
  subtitle: MultilingualText
}

export interface Category {
  id: string
  name: MultilingualText
  slug: string
  imageUrl: string
  description: MultilingualText
}

export interface Ingredient {
  id: string
  name: MultilingualText
  price: number // Additional price if optional (0 for default ingredients)
  isDefault: boolean
}

export interface Meal {
  id: string
  categorySlug: string
  name: MultilingualText
  description: MultilingualText
  price: number
  imageUrl: string
  calories?: number
  tags?: MultilingualText[]
  defaultIngredients?: Ingredient[]
  optionalIngredients?: Ingredient[]
}

// Helper function to get translated text
export function getText(text: MultilingualText, language: Language): string {
  return text[language] || text.en
}

// Helper function to get translated tag
export function getTag(tag: MultilingualText, language: Language): string {
  return tag[language] || tag.en
}

export const banners: Banner[] = [
  {
    id: '1',
    imageUrl: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=800&h=400&fit=crop',
    title: {
      en: 'Fresh Sushi Daily',
      he: 'סושי טרי יומי',
      ar: 'سوشي طازج يومي',
    },
    subtitle: {
      en: 'Premium ingredients, authentic flavors',
      he: 'מרכיבים איכותיים, טעמים אותנטיים',
      ar: 'مكونات ممتازة، نكهات أصيلة',
    },
  },
  {
    id: '2',
    imageUrl: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800&h=400&fit=crop',
    title: {
      en: 'New Spring Rolls',
      he: 'רולים חדשים',
      ar: 'لفائف الربيع الجديدة',
    },
    subtitle: {
      en: 'Crispy and delicious',
      he: 'פריכים וטעימים',
      ar: 'مقرمش ولذيذ',
    },
  },
]

export const categories: Category[] = [
  {
    id: '1',
    name: {
      en: 'Sushi Rolls',
      he: 'רולים',
      ar: 'لفائف السوشي',
    },
    slug: 'sushi-rolls',
    imageUrl: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400&h=300&fit=crop',
    description: {
      en: 'Traditional and modern sushi rolls',
      he: 'רולים מסורתיים ומודרניים',
      ar: 'لفائف السوشي التقليدية والحديثة',
    },
  },
  {
    id: '2',
    name: {
      en: 'Sashimi',
      he: 'סשימי',
      ar: 'ساشيمي',
    },
    slug: 'sashimi',
    imageUrl: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=400&h=300&fit=crop',
    description: {
      en: 'Fresh raw fish, expertly sliced',
      he: 'דג טרי, חתוך במיומנות',
      ar: 'سمك نيء طازج، مقطع بمهارة',
    },
  },
  {
    id: '3',
    name: {
      en: 'Nigiri',
      he: 'ניגירי',
      ar: 'نيجيري',
    },
    slug: 'nigiri',
    imageUrl: 'https://images.unsplash.com/photo-1579871494447-9811f80d6caf?w=400&h=300&fit=crop',
    description: {
      en: 'Hand-pressed sushi with premium fish',
      he: 'סושי לחוץ ידנית עם דג איכותי',
      ar: 'سوشي مضغوط يدوياً مع سمك ممتاز',
    },
  },
  {
    id: '4',
    name: {
      en: 'Appetizers',
      he: 'מתאבנים',
      ar: 'المقبلات',
    },
    slug: 'appetizers',
    imageUrl: 'https://images.unsplash.com/photo-1562967914-608f82629710?w=400&h=300&fit=crop',
    description: {
      en: 'Start your meal right',
      he: 'התחל את הארוחה שלך נכון',
      ar: 'ابدأ وجبتك بشكل صحيح',
    },
  },
  {
    id: '5',
    name: {
      en: 'Soups',
      he: 'מרקים',
      ar: 'الشوربات',
    },
    slug: 'soups',
    imageUrl: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=300&fit=crop',
    description: {
      en: 'Warming and comforting',
      he: 'מחמם ומנחם',
      ar: 'دافئ ومريح',
    },
  },
  {
    id: '6',
    name: {
      en: 'Desserts',
      he: 'קינוחים',
      ar: 'الحلويات',
    },
    slug: 'desserts',
    imageUrl: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400&h=300&fit=crop',
    description: {
      en: 'Sweet endings',
      he: 'סיומים מתוקים',
      ar: 'نهايات حلوة',
    },
  },
]

export const meals: Meal[] = [
  {
    id: '1',
    categorySlug: 'sushi-rolls',
    name: {
      en: 'California Roll',
      he: 'רול קליפורניה',
      ar: 'لفيفة كاليفورنيا',
    },
    description: {
      en: 'Crab, avocado, cucumber wrapped in nori and sushi rice',
      he: 'סרטן, אבוקדו, מלפפון עטופים בנורי ואורז סושי',
      ar: 'سلطعون، أفوكادو، خيار ملفوف في نوري وأرز السوشي',
    },
    price: 42,
    imageUrl: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400&h=300&fit=crop',
    calories: 255,
    tags: [
      {
        en: 'popular',
        he: 'פופולרי',
        ar: 'شائع',
      },
    ],
    defaultIngredients: [
      {
        id: 'ing-1',
        name: {
          en: 'Crab',
          he: 'סרטן',
          ar: 'سلطعون',
        },
        price: 0,
        isDefault: true,
      },
      {
        id: 'ing-2',
        name: {
          en: 'Avocado',
          he: 'אבוקדו',
          ar: 'أفوكادو',
        },
        price: 0,
        isDefault: true,
      },
      {
        id: 'ing-3',
        name: {
          en: 'Cucumber',
          he: 'מלפפון',
          ar: 'خيار',
        },
        price: 0,
        isDefault: true,
      },
    ],
    optionalIngredients: [
      {
        id: 'ing-4',
        name: {
          en: 'Extra Avocado',
          he: 'אבוקדו נוסף',
          ar: 'أفوكادو إضافي',
        },
        price: 5,
        isDefault: false,
      },
      {
        id: 'ing-5',
        name: {
          en: 'Spicy Mayo',
          he: 'מיונז חריף',
          ar: 'مايونيز حار',
        },
        price: 3,
        isDefault: false,
      },
      {
        id: 'ing-6',
        name: {
          en: 'No Cucumber',
          he: 'ללא מלפפון',
          ar: 'بدون خيار',
        },
        price: 0,
        isDefault: false,
      },
    ],
  },
  {
    id: '2',
    categorySlug: 'sushi-rolls',
    name: {
      en: 'Spicy Tuna Roll',
      he: 'רול טונה חריף',
      ar: 'لفيفة التونة الحارة',
    },
    description: {
      en: 'Fresh tuna mixed with spicy mayo, wrapped with cucumber',
      he: 'טונה טרייה מעורבת עם מיונז חריף, עטופה במלפפון',
      ar: 'تونة طازجة ممزوجة مع المايونيز الحار، ملفوفة بالخيار',
    },
    price: 48,
    imageUrl: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=400&h=300&fit=crop',
    calories: 290,
    tags: [
      {
        en: 'spicy',
        he: 'חריף',
        ar: 'حار',
      },
    ],
  },
  {
    id: '3',
    categorySlug: 'sashimi',
    name: {
      en: 'Salmon Sashimi',
      he: 'סשימי סלמון',
      ar: 'ساشيمي السلمون',
    },
    description: {
      en: 'Premium Atlantic salmon, expertly sliced and served fresh',
      he: 'סלמון אטלנטי איכותי, חתוך במיומנות ומוגש טרי',
      ar: 'سلمون أطلسي ممتاز، مقطع بمهارة وطازج',
    },
    price: 58,
    imageUrl: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=300&fit=crop',
    calories: 180,
    tags: [
      {
        en: 'premium',
        he: 'פרימיום',
        ar: 'ممتاز',
      },
    ],
  },
  {
    id: '4',
    categorySlug: 'sashimi',
    name: {
      en: 'Tuna Sashimi',
      he: 'סשימי טונה',
      ar: 'ساشيمي التونة',
    },
    description: {
      en: 'Premium bluefin tuna, cut to perfection',
      he: 'טונה כחולת סנפיר איכותית, חתוכה לשלמות',
      ar: 'تونة زرقاء الزعنفة ممتازة، مقطعة بإتقان',
    },
    price: 72,
    imageUrl: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400&h=300&fit=crop',
    calories: 195,
    tags: [
      {
        en: 'premium',
        he: 'פרימיום',
        ar: 'ممتاز',
      },
    ],
  },
  {
    id: '5',
    categorySlug: 'nigiri',
    name: {
      en: 'Salmon Nigiri',
      he: 'ניגירי סלמון',
      ar: 'نيجيري السلمون',
    },
    description: {
      en: 'Hand-pressed sushi rice topped with fresh Atlantic salmon',
      he: 'אורז סושי לחוץ ידנית עם סלמון אטלנטי טרי',
      ar: 'أرز سوشي مضغوط يدوياً مع سلمون أطلسي طازج',
    },
    price: 38,
    imageUrl: 'https://images.unsplash.com/photo-1579871494447-9811f80d6caf?w=400&h=300&fit=crop',
    calories: 125,
    tags: [
      {
        en: 'popular',
        he: 'פופולרי',
        ar: 'شائع',
      },
    ],
  },
  {
    id: '6',
    categorySlug: 'appetizers',
    name: {
      en: 'Edamame',
      he: 'אדממה',
      ar: 'إيدامامي',
    },
    description: {
      en: 'Fresh young soybeans, steamed and lightly salted',
      he: 'פולי סויה צעירים טריים, מאודים ומלוחים קלות',
      ar: 'فول الصويا الطازج، مطبوخ على البخار ومملح قليلاً',
    },
    price: 22,
    imageUrl: 'https://images.unsplash.com/photo-1562967914-608f82629710?w=400&h=300&fit=crop',
    calories: 95,
    tags: [
      {
        en: 'vegetarian',
        he: 'צמחוני',
        ar: 'نباتي',
      },
    ],
  },
  {
    id: '7',
    categorySlug: 'soups',
    name: {
      en: 'Miso Soup',
      he: 'מרק מיסו',
      ar: 'شوربة الميسو',
    },
    description: {
      en: 'Classic Japanese soup made from fermented soybean paste',
      he: 'מרק יפני קלאסי עשוי מפסטת פולי סויה מותססת',
      ar: 'شوربة يابانية كلاسيكية مصنوعة من معجون فول الصويا المخمر',
    },
    price: 18,
    imageUrl: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=300&fit=crop',
    calories: 35,
    tags: [
      {
        en: 'vegetarian',
        he: 'צמחוני',
        ar: 'نباتي',
      },
    ],
  },
  {
    id: '8',
    categorySlug: 'desserts',
    name: {
      en: 'Mochi Ice Cream',
      he: 'גלידת מוצ\'י',
      ar: 'آيس كريم موتشي',
    },
    description: {
      en: 'Soft, chewy mochi wrapped around premium ice cream',
      he: 'מוצ\'י רך ולעיס עטוף בגלידה איכותית',
      ar: 'موتشي ناعم ومطاطي ملفوف حول آيس كريم ممتاز',
    },
    price: 28,
    imageUrl: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400&h=300&fit=crop',
    calories: 95,
    tags: [
      {
        en: 'popular',
        he: 'פופולרי',
        ar: 'شائع',
      },
    ],
  },
]
