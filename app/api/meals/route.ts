import { NextRequest, NextResponse } from 'next/server'
import { fetchFromStrapi } from '@/lib/strapi'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const locale = searchParams.get('locale') || 'en'
    const categorySlug = searchParams.get('category')
    
    // Build query parameters
    const params: Record<string, string> = {
      locale,
      'populate[category][populate]': '*',
      'populate[tags][populate]': '*',
      'populate[defaultIngredients][populate]': '*',
      'populate[optionalIngredients][populate]': '*',
      'populate[image]': '*',
    }

    // Add category filter if provided
    if (categorySlug) {
      params['filters[category][slug][$eq]'] = categorySlug
    }

    const data = await fetchFromStrapi('/meals', {
      cache: 'no-store',
    }, params)
    
    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    console.error('Error fetching meals:', error)
    return NextResponse.json(
      { error: 'Failed to fetch meals', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

