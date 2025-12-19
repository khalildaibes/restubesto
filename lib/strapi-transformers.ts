/**
 * Transformers to convert Strapi API responses to app domain models
 */

import { STRAPI_URL } from './strapi'
import type { Category } from '@/types/domain/Category'
import type { Meal } from '@/types/domain/Meal'
import type { Banner } from '@/types/domain/Banner'
import type { MultilingualText } from '@/types/domain/MultilingualText'

/**
 * Get image URL from Strapi image data structure
 * Handles both media field (image.data.attributes.url) and text field (imageUrl)
 */
function getImageUrl(imageData: any, imageUrlField?: string): string {
  // First check if imageUrl is provided as a direct field (from populate script)
  if (imageUrlField && typeof imageUrlField === 'string' && imageUrlField.trim()) {
    return imageUrlField.trim()
  }

  // Then check for Strapi media field structure
  if (imageData?.data?.attributes?.url) {
    const url = imageData.data.attributes.url
    // If URL is already absolute, return it; otherwise prepend STRAPI_URL
    if (url.startsWith('http')) {
      return url
    }
    return `${STRAPI_URL}${url}`
  }

  // Check for alternative Strapi media structures
  if (imageData?.attributes?.url) {
    const url = imageData.attributes.url
    if (url.startsWith('http')) {
      return url
    }
    return `${STRAPI_URL}${url}`
  }

  // Check if imageData itself is a string URL
  if (typeof imageData === 'string' && imageData.trim()) {
    return imageData.trim()
  }

  // Fallback: return empty string
  return ''
}

/**
 * Transform Strapi category response to Category domain model
 */
export function transformCategory(strapiCategory: any, locale: string = 'en'): Category {
  const attrs = strapiCategory.attributes || strapiCategory
  
  // For multilingual fields, Strapi returns the current locale's value
  // We set the current locale's value and leave others empty for now
  // TODO: Enhance to fetch all locales and merge them
  const name: MultilingualText = {
    en: locale === 'en' ? (attrs.name || '') : '',
    he: locale === 'he' ? (attrs.name || '') : '',
    ar: locale === 'ar' ? (attrs.name || '') : '',
  }
  
  const description: MultilingualText = {
    en: locale === 'en' ? (attrs.description || '') : '',
    he: locale === 'he' ? (attrs.description || '') : '',
    ar: locale === 'ar' ? (attrs.description || '') : '',
  }

  // Get image URL - check multiple possible fields
  // Check imageUrl field first (from populate script), then image media field
  let imageUrl = getImageUrl(attrs.image, attrs.imageUrl)
  
  // If still no imageUrl, try to get it from the raw attributes
  if (!imageUrl && attrs.imageUrl) {
    imageUrl = typeof attrs.imageUrl === 'string' ? attrs.imageUrl.trim() : ''
  }
  
  // Debug logging (can be removed in production)
  if (!imageUrl && process.env.NODE_ENV === 'development') {
    console.warn(`Category ${attrs.slug || attrs.name} has no imageUrl:`, {
      hasImage: !!attrs.image,
      hasImageUrl: !!attrs.imageUrl,
      imageData: attrs.image,
      imageUrlField: attrs.imageUrl,
      allAttrs: Object.keys(attrs),
    })
  }

  return {
    id: String(strapiCategory.id),
    slug: attrs.slug || '',
    name,
    description,
    imageUrl,
  }
}

/**
 * Transform Strapi meal response to Meal domain model
 */
export function transformMeal(strapiMeal: any, locale: string = 'en'): Meal {
  const attrs = strapiMeal.attributes || strapiMeal
  
  const name: MultilingualText = {
    en: locale === 'en' ? (attrs.name || '') : '',
    he: locale === 'he' ? (attrs.name || '') : '',
    ar: locale === 'ar' ? (attrs.name || '') : '',
  }
  
  const description: MultilingualText = {
    en: locale === 'en' ? (attrs.description || '') : '',
    he: locale === 'he' ? (attrs.description || '') : '',
    ar: locale === 'ar' ? (attrs.description || '') : '',
  }

  // Get category slug
  const categorySlug = attrs.category?.data?.attributes?.slug || 
                       attrs.category?.attributes?.slug || 
                       attrs.category?.slug || ''

  // Transform tags if present
  const tags: MultilingualText[] = []
  if (attrs.tags?.data) {
    attrs.tags.data.forEach((tag: any) => {
      const tagAttrs = tag.attributes || tag
      tags.push({
        en: locale === 'en' ? (tagAttrs.name || '') : '',
        he: locale === 'he' ? (tagAttrs.name || '') : '',
        ar: locale === 'ar' ? (tagAttrs.name || '') : '',
      })
    })
  }

  return {
    id: String(strapiMeal.id),
    categorySlug,
    name,
    description,
    price: attrs.price || 0,
    imageUrl: getImageUrl(attrs.image, attrs.imageUrl),
    calories: attrs.calories || undefined,
    tags: tags.length > 0 ? tags : undefined,
    // Ingredients would be transformed similarly if needed
  }
}

/**
 * Transform Strapi banner response to Banner domain model
 */
export function transformBanner(strapiBanner: any, locale: string = 'en'): Banner {
  const attrs = strapiBanner.attributes || strapiBanner
  
  const title: MultilingualText = {
    en: locale === 'en' ? (attrs.title || '') : '',
    he: locale === 'he' ? (attrs.title || '') : '',
    ar: locale === 'ar' ? (attrs.title || '') : '',
  }
  
  const subtitle: MultilingualText = {
    en: locale === 'en' ? (attrs.subtitle || '') : '',
    he: locale === 'he' ? (attrs.subtitle || '') : '',
    ar: locale === 'ar' ? (attrs.subtitle || '') : '',
  }

  return {
    id: String(strapiBanner.id),
    imageUrl: getImageUrl(attrs.image, attrs.imageUrl),
    title,
    subtitle,
  }
}

/**
 * Transform array of Strapi categories
 */
export function transformCategories(strapiResponse: any, locale: string = 'en'): Category[] {
  if (!strapiResponse?.data || !Array.isArray(strapiResponse.data)) {
    return []
  }
  return strapiResponse.data.map((item: any) => transformCategory(item, locale))
}

/**
 * Transform array of Strapi meals
 */
export function transformMeals(strapiResponse: any, locale: string = 'en'): Meal[] {
  if (!strapiResponse?.data || !Array.isArray(strapiResponse.data)) {
    return []
  }
  return strapiResponse.data.map((item: any) => transformMeal(item, locale))
}

/**
 * Transform array of Strapi banners
 */
export function transformBanners(strapiResponse: any, locale: string = 'en'): Banner[] {
  if (!strapiResponse?.data || !Array.isArray(strapiResponse.data)) {
    return []
  }
  return strapiResponse.data.map((item: any) => transformBanner(item, locale))
}

