/**
 * Client-side API functions to fetch data from Next.js API routes
 */

import type { Category } from '@/types/domain/Category'
import type { Drink } from '@/types/domain/Drink'
import type { Meal } from '@/types/domain/Meal'
import type { Banner } from '@/types/domain/Banner'
import type { Language } from '@/types/i18n'
import {
  transformCategories,
  transformDrinks,
  transformMeals,
  transformBanners,
} from './strapi-transformers'
import { getText } from '@/shared/utils/i18n/getText'

/**
 * Fetch categories from API
 */
export async function fetchCategories(locale: string = 'en'): Promise<Category[]> {
  try {
    const apiUrl = `/api/categories?locale=${locale}`
    console.log('📡 [CLIENT] Fetching categories:', apiUrl)
    const response = await fetch(apiUrl)
    
    if (!response.ok) {
      console.error('❌ Categories API error:', response.status, response.statusText)
      throw new Error(`Failed to fetch categories: ${response.statusText}`)
    }
    
    const data = await response.json()
    console.log('📦 Categories API response:', {
      locale,
      dataCount: data?.data?.length || 0,
      hasData: !!data?.data,
      dataIsArray: Array.isArray(data?.data),
      dataIsNull: data?.data === null,
      fullResponse: data, // Log full response to see structure
    })
    
    // If no data or empty array, return empty array
    if (!data?.data || data.data.length === 0) {
      console.warn('⚠️ No categories from API, returning empty array')
      return []
    }
    
    const transformed = transformCategories(data, locale)
    console.log('✅ Categories transformed:', {
      locale,
      count: transformed.length,
      categories: transformed.map(c => ({ id: c.id, slug: c.slug, hasImage: !!c.imageUrl })),
    })
    
    // Return transformed data (even if empty)
    return transformed
  } catch (error) {
    console.error('❌ Error fetching categories:', error)
    return []
  }
}

/**
 * Fetch drinks from API
 */
export async function fetchDrinks(
  locale: string = 'en',
  categorySlug?: string
): Promise<Drink[]> {
  try {
    let url = `/api/drinks?locale=${locale}`
    if (categorySlug) {
      url += `&category=${categorySlug}`
    }
    
    console.log('📡 [CLIENT] Fetching drinks:', url)
    const response = await fetch(url)
    
    if (!response.ok) {
      console.error('❌ Drinks API error:', response.status, response.statusText)
      throw new Error(`Failed to fetch drinks: ${response.statusText}`)
    }
    
    const data = await response.json()
    
    // If no data or empty array, return empty array
    if (!data?.data || data.data.length === 0) {
      console.warn('⚠️ No drinks from API, returning empty array')
      return []
    }
    
    const transformed = transformDrinks(data, locale)
    
    // Return transformed data (even if empty)
    return transformed
  } catch (error) {
    console.error('❌ Error fetching drinks:', error)
    return []
  }
}

/**
 * Fetch meals from API
 */
export async function fetchMeals(
  locale: string = 'en',
  categorySlug?: string
): Promise<Meal[]> {
  try {
    let url = `/api/meals?locale=${locale}`
    if (categorySlug) {
      url += `&category=${categorySlug}`
    }
    
    console.log('📡 [CLIENT] Fetching meals:', url)
    const response = await fetch(url)
    
    if (!response.ok) {
      console.error('❌ Meals API error:', response.status, response.statusText)
      throw new Error(`Failed to fetch meals: ${response.statusText}`)
    }
    
    const data = await response.json()
    console.log('📦 Meals API response:', {
      locale,
      categorySlug,
      dataCount: data?.data?.length || 0,
      hasData: !!data?.data,
      dataIsArray: Array.isArray(data?.data),
      dataIsNull: data?.data === null,
      fullResponse: data, // Log full response to see structure
    })
    
    // If no data or empty array, return empty array
    if (!data?.data || data.data.length === 0) {
      console.warn('⚠️ No meals from API, returning empty array')
      return []
    }
    
    const transformed = transformMeals(data, locale)
    console.log('✅ Meals transformed:', {
      locale,
      categorySlug,
      count: transformed.length,
      meals: transformed.map(m => ({ id: m.id, name: getText(m.name, locale as Language), hasImage: !!m.imageUrl })),
    })
    
    // Return transformed data (even if empty)
    return transformed
  } catch (error) {
    console.error('❌ Error fetching meals:', error)
    return []
  }
}

/**
 * Fetch banners from API
 */
export async function fetchBanners(locale: string = 'en'): Promise<Banner[]> {
  try {
    const apiUrl = `/api/banners?locale=${locale}`
    console.log('📡 [CLIENT] Fetching banners:', apiUrl)
    const response = await fetch(apiUrl)
    
    if (!response.ok) {
      console.error('❌ Banners API error:', response.status, response.statusText)
      throw new Error(`Failed to fetch banners: ${response.statusText}`)
    }
    
    const data = await response.json()
    console.log(':', {
      locale,
      dataCount: data?.data?.length || 0,
      hasData: !!data?.data,
      dataIsArray: Array.isArray(data?.data),
      dataIsNull: data?.data === null,
      fullResponse: data, // Log full response to see structure
    })
    
    // If no data or empty array, return empty array
    if (!data?.data || data.data.length === 0) {
      console.warn('⚠️ No banners from API, returning empty array')
      return []
    }
    
    const transformed = transformBanners(data, locale)
    console.log('✅ Banners transformed:', {
      locale,
      count: transformed.length,
      banners: transformed.map(b => ({ id: b.id, hasImage: !!b.imageUrl })),
    })
    
    // Return transformed data (even if empty)
    return transformed
  } catch (error) {
    console.error('❌ Error fetching banners:', error)
    return []
  }
}

/**
 * Fetch a single category by slug
 */
export async function fetchCategoryBySlug(
  slug: string,
  locale: string = 'en'
): Promise<Category | null> {
  const categories = await fetchCategories(locale)
  return categories.find((cat) => cat.slug === slug) || null
}

