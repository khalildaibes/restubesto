/**
 * Format price - shows "Free" when price is 0
 * Note: This is a simple utility. For translated "Free" text, use the translation hook in components.
 */
export function formatPrice(price: number, freeText: string = 'Free'): string {
  if (price === 0) {
    return freeText
  }
  return `₪${price.toFixed(2)}`
}

