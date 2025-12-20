import { NextRequest, NextResponse } from 'next/server'
import { fetchFromStrapi } from '@/lib/strapi'

// Mark this route as dynamic
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const locale = searchParams.get('locale') || 'en'
    
    // Validate locale (en, he, ar)
    const validLocales = ['en', 'he', 'ar']
    const finalLocale = validLocales.includes(locale) ? locale : 'en'
    
    console.log('🔵 [API ROUTE] GET /api/categories', {
      requestUrl: request.url,
      locale: finalLocale,
    })
    
    const params: Record<string, string> = {
      locale: finalLocale,
      // Note: Removed populate[meals] because 'meals' relation doesn't exist in Strapi schema
      // Note: Removed populate[image] because 'image' field doesn't exist in Strapi schema
      // Images are stored in 'imageUrl' text field instead
      // Note: Removed order sort as this field doesn't exist in Strapi schema
      // Note: Strapi by default only returns published content
      // If you need unpublished content, add: 'publicationState': 'preview'
    }

    const data = await fetchFromStrapi('/categories', {
      cache: 'no-store',
    }, params)
    
    console.log('📦 [API ROUTE] Categories response from Strapi:', {
      hasData: !!data,
      dataType: typeof data,
      dataIsArray: Array.isArray(data?.data),
      dataLength: Array.isArray(data?.data) ? data.data.length : data?.data ? 1 : 0,
      dataIsNull: data?.data === null,
      dataIsUndefined: data?.data === undefined,
      responseKeys: data ? Object.keys(data) : [],
      fullResponse: JSON.stringify(data, null, 2).substring(0, 1000), // First 1000 chars of response
      firstItem: Array.isArray(data?.data) && data.data.length > 0 ? {
        id: data.data[0]?.id,
        hasAttributes: !!data.data[0]?.attributes,
        attributesKeys: data.data[0]?.attributes ? Object.keys(data.data[0].attributes) : [],
        publishedAt: data.data[0]?.attributes?.publishedAt,
      } : null,
    })
    
    // If data is empty array, try fetching without locale to see if locale is the issue
    if (Array.isArray(data?.data) && data.data.length === 0) {
      console.warn('⚠️ [API ROUTE] Categories array is empty. Possible issues:')
      console.warn('   1. No categories exist in Strapi')
      console.warn('   2. Categories are not published (publishedAt is null)')
      console.warn('   3. Locale filter is excluding all categories')
      console.warn('   4. API token lacks read permissions')
    }
    
    // If data is null or undefined, return empty array
    if (!data || data.data === null || data.data === undefined) {
      console.warn('⚠️ [API ROUTE] Strapi returned null/undefined data, returning empty array')
      return NextResponse.json(
        { 
          data: [],
          meta: { pagination: { page: 1, pageSize: 25, pageCount: 0, total: 0 } }
        },
        { status: 200 }
      )
    }
    
    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    console.error('Error fetching categories from Strapi:', error)
    
    // Return empty data structure instead of error
    return NextResponse.json(
      { 
        data: [],
        error: error instanceof Error ? error.message : 'Unknown error',
        meta: { pagination: { page: 1, pageSize: 25, pageCount: 0, total: 0 } }
      },
      { status: 200 }
    )
  }
}

