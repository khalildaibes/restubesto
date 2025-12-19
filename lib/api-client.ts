/**
 * Client-side API functions to fetch data from Next.js API routes
 */

import type { Category } from '@/types/domain/Category'
import type { Meal } from '@/types/domain/Meal'
import type { Banner } from '@/types/domain/Banner'
import {
  transformCategories,
  transformMeals,
  transformBanners,
} from './strapi-transformers'
import { categories as mockCategories } from '@/data/mock/categories'
import { meals as mockMeals } from '@/data/mock/meals'
import { banners as mockBanners } from '@/data/mock/banners'

/**
 * Fetch categories from API with fallback to mock data
 */
export async function fetchCategories(locale: string = 'en'): Promise<Category[]> {
  try {
    const response = await fetch(`/api/categories?locale=${locale}`)
    if (!response.ok) {
      throw new Error(`Failed to fetch categories: ${response.statusText}`)
    }
    const data = await response.json()
    
    // If no data or empty array, fallback to mock data
    if (!data?.data || data.data.length === 0) {
      console.warn('No categories from API, using mock data')
      return mockCategories
    }
    
    const transformed = transformCategories(data, locale)
    
    // If transformation resulted in empty array, use mock data
    if (transformed.length === 0) {
      console.warn('Categories transformation failed, using mock data')
      return mockCategories
    }
    
    return transformed
  } catch (error) {
    console.error('Error fetching categories, using mock data:', error)
    return mockCategories
  }
}

/**
 * Fetch meals from API with fallback to mock data
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
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`Failed to fetch meals: ${response.statusText}`)
    }
    const data = await response.json()
    
    // If no data or empty array, fallback to mock data
    if (!data?.data || data.data.length === 0) {
      console.warn('No meals from API, using mock data')
      let filteredMeals = mockMeals
      if (categorySlug) {
        filteredMeals = mockMeals.filter(meal => meal.categorySlug === categorySlug)
      }
      return filteredMeals
    }
    
    const transformed = transformMeals(data, locale)
    
    // If transformation resulted in empty array, use mock data
    if (transformed.length === 0) {
      console.warn('Meals transformation failed, using mock data')
      let filteredMeals = mockMeals
      if (categorySlug) {
        filteredMeals = mockMeals.filter(meal => meal.categorySlug === categorySlug)
      }
      return filteredMeals
    }
    
    return transformed
  } catch (error) {
    console.error('Error fetching meals, using mock data:', error)
    let filteredMeals = mockMeals
    if (categorySlug) {
      filteredMeals = mockMeals.filter(meal => meal.categorySlug === categorySlug)
    }
    return filteredMeals
  }
}

/**
 * Fetch banners from API with fallback to mock data
 */
export async function fetchBanners(locale: string = 'en'): Promise<Banner[]> {
  try {
    const response = await fetch(`/api/banners?locale=${locale}`)
    if (!response.ok) {
      throw new Error(`Failed to fetch banners: ${response.statusText}`)
    }
    const data = await response.json()
    
    // If no data or empty array, fallback to mock data
    if (!data?.data || data.data.length === 0) {
      console.warn('No banners from API, using mock data')
      return mockBanners
    }
    
    const transformed = transformBanners(data, locale)
    
    // If transformation resulted in empty array, use mock data
    if (transformed.length === 0) {
      console.warn('Banners transformation failed, using mock data')
      return mockBanners
    }
    
    return transformed
  } catch (error) {
    console.error('Error fetching banners, using mock data:', error)
    return mockBanners
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

