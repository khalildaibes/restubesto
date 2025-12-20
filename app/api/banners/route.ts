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
    
    console.log('🔵 [API ROUTE] GET /api/banners', {
      requestUrl: request.url,
      locale: finalLocale,
    })
    
    const params: Record<string, string> = {
      locale: finalLocale,
      // Note: Removed populate[image] because 'image' field doesn't exist in Strapi schema
      // Images are stored in 'imageUrl' text field instead
      // Note: Strapi by default only returns published content
      // If you need unpublished content, add: 'publicationState': 'preview'
      // Note: Removed isActive filter and order sort as these fields don't exist in Strapi schema
    }

    const data = await fetchFromStrapi('/banners', {
      cache: 'no-store',
    }, params)
    
    console.log('📦 [API ROUTE] Banners response from Strapi:', {
      hasData: !!data,
      dataType: typeof data,
      dataIsArray: Array.isArray(data?.data),
      dataLength: Array.isArray(data?.data) ? data.data.length : data?.data ? 1 : 0,
      dataIsNull: data?.data === null,
      dataIsUndefined: data?.data === undefined,
      responseKeys: data ? Object.keys(data) : [],
      firstItem: Array.isArray(data?.data) && data.data.length > 0 ? {
        id: data.data[0]?.id,
        hasAttributes: !!data.data[0]?.attributes,
        attributesKeys: data.data[0]?.attributes ? Object.keys(data.data[0].attributes) : [],
        allKeys: Object.keys(data.data[0] || {}),
        fullFirstItem: JSON.stringify(data.data[0], null, 2).substring(0, 500), // First 500 chars
      } : null,
    })
    
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
    console.error('Error fetching banners from Strapi:', error)
    
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

