/**
 * Transformers to convert Strapi API responses to app domain models
 */

import { STRAPI_URL } from './strapi'
import type { Category } from '@/types/domain/Category'
import type { Meal } from '@/types/domain/Meal'
import type { Banner } from '@/types/domain/Banner'
import type { MultilingualText } from '@/types/domain/MultilingualText'

/**
 * Ensure image URL uses HTTP (not HTTPS) for Strapi URLs
 * This is important for production where the site might be HTTPS but Strapi is HTTP
 */
function ensureHttpUrl(url: string): string {
  // If it's a Strapi URL and uses HTTPS, convert to HTTP
  const strapiHost = STRAPI_URL.replace('http://', '').replace('https://', '')
  if (url.includes(strapiHost)) {
    return url.replace('https://', 'http://')
  }
  return url
}

/**
 * Get image URL from Strapi image data structure
 * Handles both media field (image.data.attributes.url) and text field (imageUrl)
 */
function getImageUrl(imageData: any, imageUrlField?: string): string {
  // First check if imageUrl is provided as a direct field (from populate script)
  if (imageUrlField && typeof imageUrlField === 'string' && imageUrlField.trim()) {
    // Ensure Strapi URLs use HTTP
    return ensureHttpUrl(imageUrlField.trim())
  }

  // If no imageData, return empty
  if (!imageData) {
    return ''
  }

  // Helper function to extract URL from various structures
  const extractUrl = (data: any): string | null => {
    // Check for data.attributes.url (most common Strapi structure)
    if (data?.data?.attributes?.url) {
      return data.data.attributes.url
    }
    // Check for data[0].attributes.url (array structure)
    if (Array.isArray(data?.data) && data.data.length > 0 && data.data[0]?.attributes?.url) {
      return data.data[0].attributes.url
    }
    // Check for attributes.url (direct attributes)
    if (data?.attributes?.url) {
      return data.attributes.url
    }
    // Check for direct url property
    if (data?.url) {
      return data.url
    }
    // Check if data itself is the URL string
    if (typeof data === 'string' && data.trim()) {
      return data.trim()
    }
    return null
  }

  const url = extractUrl(imageData)
  
  if (url) {
    let finalUrl: string
    
    // If URL is already absolute
    if (url.startsWith('http://') || url.startsWith('https://')) {
      // Ensure Strapi URLs use HTTP (not HTTPS) for production compatibility
      finalUrl = ensureHttpUrl(url)
    } else {
      // Handle relative URLs - prepend Strapi URL (always use HTTP)
      // Strapi usually returns URLs starting with /uploads/...
      const fullUrl = `${STRAPI_URL}${url.startsWith('/') ? url : '/' + url}`
      finalUrl = ensureHttpUrl(fullUrl)
    }
    
    // Log in browser console (client-side only)
    if (typeof window !== 'undefined') {
      console.log('🖼️ Image URL extracted:', {
        originalUrl: url,
        finalUrl,
        imageData: imageData ? Object.keys(imageData) : null,
        imageUrlField,
      })
    }
    
    return finalUrl
  }

  // Check if imageData is a number (ID reference without populate)
  if (typeof imageData === 'number') {
    // This means image wasn't populated, return empty
    return ''
  }

  // Fallback: return empty string
  return ''
}

/**
 * Transform Strapi category response to Category domain model
 */
export function transformCategory(strapiCategory: any, locale: string = 'en'): Category {
  const attrs = strapiCategory.attributes || strapiCategory
  
  // Strapi i18n returns data for the requested locale
  // When locale=ar, Strapi returns Arabic content; when locale=he, it returns Hebrew, etc.
  // We populate the current locale's value and leave others empty
  // The frontend will use getText() to extract the correct language
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
  
  // Log image URL extraction (client-side only)
  if (typeof window !== 'undefined') {
    if (imageUrl) {
      console.log('✅ Category image URL extracted:', {
        category: attrs.slug || attrs.name,
        locale,
        imageUrl,
        hasImageData: !!attrs.image,
        hasImageUrlField: !!attrs.imageUrl,
      })
    } else {
      console.warn('⚠️ Category has no image URL:', {
        category: attrs.slug || attrs.name,
        locale,
        hasImageData: !!attrs.image,
        hasImageUrlField: !!attrs.imageUrl,
        imageData: attrs.image ? {
          type: typeof attrs.image,
          keys: Object.keys(attrs.image),
          data: attrs.image.data ? {
            type: typeof attrs.image.data,
            isArray: Array.isArray(attrs.image.data),
            length: Array.isArray(attrs.image.data) ? attrs.image.data.length : null,
            firstItem: Array.isArray(attrs.image.data) && attrs.image.data[0] ? Object.keys(attrs.image.data[0]) : null,
          } : null,
        } : null,
      })
    }
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
  
  // Strapi i18n returns data for the requested locale
  // When locale=ar, Strapi returns Arabic content; when locale=he, it returns Hebrew, etc.
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

  // Get image URL - check multiple possible fields
  let imageUrl = getImageUrl(attrs.image, attrs.imageUrl)
  
  // If still no imageUrl, try to get it from the raw attributes
  if (!imageUrl && attrs.imageUrl) {
    imageUrl = typeof attrs.imageUrl === 'string' ? attrs.imageUrl.trim() : ''
  }
  
  // Log image URL extraction (client-side only)
  if (typeof window !== 'undefined') {
    if (imageUrl) {
      console.log('✅ Meal image URL extracted:', {
        meal: attrs.name || strapiMeal.id,
        locale,
        imageUrl,
        hasImageData: !!attrs.image,
        hasImageUrlField: !!attrs.imageUrl,
      })
    } else {
      console.warn('⚠️ Meal has no image URL:', {
        meal: attrs.name || strapiMeal.id,
        locale,
        hasImageData: !!attrs.image,
        hasImageUrlField: !!attrs.imageUrl,
        imageData: attrs.image ? {
          type: typeof attrs.image,
          keys: Object.keys(attrs.image),
        } : null,
      })
    }
  }

  return {
    id: String(strapiMeal.id),
    categorySlug,
    name,
    description,
    price: attrs.price || 0,
    imageUrl,
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

