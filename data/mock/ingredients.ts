import type { Ingredient } from '@/types/domain'

export const defaultIngredients: Ingredient[] = [
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
]

export const optionalIngredients: Ingredient[] = [
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
]

