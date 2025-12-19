import type { Banner } from '@/types/domain'

export const banners: Banner[] = [
  {
    id: '1',
    imageUrl:
      'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=800&h=400&fit=crop',
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
    imageUrl:
      'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800&h=400&fit=crop',
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

