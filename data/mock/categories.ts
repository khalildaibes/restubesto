import type { Category } from '@/types/domain'

export const categories: Category[] = [
  {
    id: '1',
    name: {
      en: 'Sushi Rolls',
      he: 'רולים',
      ar: 'لفائف السوشي',
    },
    slug: 'sushi-rolls',
    imageUrl:
      'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400&h=300&fit=crop',
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
    imageUrl:
      'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=400&h=300&fit=crop',
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
    imageUrl:
      'https://images.unsplash.com/photo-1579871494447-9811f80d6caf?w=400&h=300&fit=crop',
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
    imageUrl:
      'https://images.unsplash.com/photo-1562967914-608f82629710?w=400&h=300&fit=crop',
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
    imageUrl:
      'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=300&fit=crop',
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
    imageUrl:
      'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400&h=300&fit=crop',
    description: {
      en: 'Sweet endings',
      he: 'סיומים מתוקים',
      ar: 'نهايات حلوة',
    },
  },
]

