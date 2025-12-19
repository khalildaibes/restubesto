import { NextRequest, NextResponse } from 'next/server'
import { fetchFromStrapi } from '@/lib/strapi'

// Mark this route as dynamic
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const locale = searchParams.get('locale') || 'en'
    const categorySlug = searchParams.get('category')
    
    // Build query parameters
    // Only populate fields that exist in Strapi
    // Note: defaultIngredients and optionalIngredients might not exist as relations
    const params: Record<string, string> = {
      locale,
      'populate[category][populate]': '*',
      'populate[tags][populate]': '*',
      'populate[image]': '*',
    }
    
    // Only add ingredient populates if they exist in your Strapi schema
    // Uncomment these if you have ingredient relations set up:
    // 'populate[defaultIngredients][populate]': '*',
    // 'populate[optionalIngredients][populate]': '*',

    // Add category filter if provided
    if (categorySlug) {
      params['filters[category][slug][$eq]'] = categorySlug
    }

    const data = await fetchFromStrapi('/meals', {
      cache: 'no-store',
    }, params)
    
    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    console.error('Error fetching meals from Strapi:', error)
    
    // Return empty data structure instead of error to prevent frontend crashes
    // The frontend can fallback to mock data if needed
    return NextResponse.json(
      { 
        data: [],
        error: error instanceof Error ? error.message : 'Unknown error',
        meta: { pagination: { page: 1, pageSize: 25, pageCount: 0, total: 0 } }
      },
      { status: 200 } // Return 200 with empty data instead of 500
    )
  }
}

