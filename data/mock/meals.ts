import type { Meal } from '@/types/domain'
import { defaultIngredients, optionalIngredients } from './ingredients'

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
    imageUrl:
      'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400&h=300&fit=crop',
    calories: 255,
    tags: [
      { en: 'popular', he: 'פופולרי', ar: 'شائع' },
    ],
    defaultIngredients,
    optionalIngredients,
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
    imageUrl:
      'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=400&h=300&fit=crop',
    calories: 290,
    tags: [{ en: 'spicy', he: 'חריף', ar: 'حار' }],
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
    imageUrl:
      'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=300&fit=crop',
    calories: 180,
    tags: [{ en: 'premium', he: 'פרימיום', ar: 'ممتاز' }],
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
    imageUrl:
      'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400&h=300&fit=crop',
    calories: 195,
    tags: [{ en: 'premium', he: 'פרימיום', ar: 'ممتاز' }],
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
    imageUrl:
      'https://images.unsplash.com/photo-1579871494447-9811f80d6caf?w=400&h=300&fit=crop',
    calories: 125,
    tags: [{ en: 'popular', he: 'פופולרי', ar: 'شائع' }],
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
    imageUrl:
      'https://images.unsplash.com/photo-1562967914-608f82629710?w=400&h=300&fit=crop',
    calories: 95,
    tags: [{ en: 'vegetarian', he: 'צמחוני', ar: 'نباتي' }],
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
    imageUrl:
      'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=300&fit=crop',
    calories: 35,
    tags: [{ en: 'vegetarian', he: 'צמחוני', ar: 'نباتي' }],
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
    imageUrl:
      'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400&h=300&fit=crop',
    calories: 95,
    tags: [{ en: 'popular', he: 'פופולרי', ar: 'شائع' }],
  },
]

