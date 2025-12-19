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

/**
 * Fetch categories from API
 */
export async function fetchCategories(locale: string = 'en'): Promise<Category[]> {
  try {
    const response = await fetch(`/api/categories?locale=${locale}`)
    if (!response.ok) {
      throw new Error(`Failed to fetch categories: ${response.statusText}`)
    }
    const data = await response.json()
    return transformCategories(data, locale)
  } catch (error) {
    console.error('Error fetching categories:', error)
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
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`Failed to fetch meals: ${response.statusText}`)
    }
    const data = await response.json()
    return transformMeals(data, locale)
  } catch (error) {
    console.error('Error fetching meals:', error)
    return []
  }
}

/**
 * Fetch banners from API
 */
export async function fetchBanners(locale: string = 'en'): Promise<Banner[]> {
  try {
    const response = await fetch(`/api/banners?locale=${locale}`)
    if (!response.ok) {
      throw new Error(`Failed to fetch banners: ${response.statusText}`)
    }
    const data = await response.json()
    return transformBanners(data, locale)
  } catch (error) {
    console.error('Error fetching banners:', error)
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

