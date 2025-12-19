export type Language = 'en' | 'he' | 'ar'

export const translations = {
  en: {
    common: {
      cart: 'Cart',
      back: 'Back',
      quantity: 'Quantity',
      calories: 'Calories',
      subtotal: 'Subtotal',
      checkout: 'Checkout',
      addToCart: 'Add to Cart',
      yourCartIsEmpty: 'Your cart is empty',
      close: 'Close',
    },
    home: {
      categories: 'Categories',
    },
    cart: {
      cart: 'Cart',
      subtotal: 'Subtotal',
      checkout: 'Checkout',
      empty: 'Your cart is empty',
    },
    meal: {
      addToCart: 'Add to Cart',
      quantity: 'Quantity',
      calories: 'Calories',
      defaultIngredients: 'Ingredients',
      optionalIngredients: 'Add-ons',
      remove: 'Remove',
    },
  },
  he: {
    common: {
      cart: 'עגלה',
      back: 'חזור',
      quantity: 'כמות',
      calories: 'קלוריות',
      subtotal: 'סיכום ביניים',
      checkout: 'תשלום',
      addToCart: 'הוסף לעגלה',
      yourCartIsEmpty: 'העגלה שלך ריקה',
      close: 'סגור',
    },
    home: {
      categories: 'קטגוריות',
    },
    cart: {
      cart: 'עגלה',
      subtotal: 'סיכום ביניים',
      checkout: 'תשלום',
      empty: 'העגלה שלך ריקה',
    },
    meal: {
      addToCart: 'הוסף לעגלה',
      quantity: 'כמות',
      calories: 'קלוריות',
      defaultIngredients: 'מרכיבים',
      optionalIngredients: 'תוספות',
      remove: 'הסר',
    },
  },
  ar: {
    common: {
      cart: 'السلة',
      back: 'رجوع',
      quantity: 'الكمية',
      calories: 'السعرات الحرارية',
      subtotal: 'المجموع الفرعي',
      checkout: 'الدفع',
      addToCart: 'أضف إلى السلة',
      yourCartIsEmpty: 'سلتك فارغة',
      close: 'إغلاق',
    },
    home: {
      categories: 'الفئات',
    },
    cart: {
      cart: 'السلة',
      subtotal: 'المجموع الفرعي',
      checkout: 'الدفع',
      empty: 'سلتك فارغة',
    },
    meal: {
      addToCart: 'أضف إلى السلة',
      quantity: 'الكمية',
      calories: 'السعرات الحرارية',
      defaultIngredients: 'المكونات',
      optionalIngredients: 'الإضافات',
      remove: 'إزالة',
    },
  },
} as const

export const getDirection = (lang: Language): 'ltr' | 'rtl' => {
  return lang === 'he' || lang === 'ar' ? 'rtl' : 'ltr'
}

