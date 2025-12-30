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
    
    // Validate locale (en, he, ar)
    const validLocales = ['en', 'he', 'ar']
    const finalLocale = validLocales.includes(locale) ? locale : 'en'
    
    console.log('🔵 [API ROUTE] GET /api/drinks', {
      requestUrl: request.url,
      locale: finalLocale,
      categorySlug: categorySlug || 'none',
    })
    
    const params: Record<string, string> = {
      locale: finalLocale,
    }

    // Add category filter if provided - use categorySlug field directly
    if (categorySlug) {
      params['filters[categorySlug][$eq]'] = categorySlug
    }

    const data = await fetchFromStrapi('/drinks', {
      cache: 'no-store',
    }, params)
    
    console.log('📦 [API ROUTE] Drinks response from Strapi:', {
      hasData: !!data,
      dataType: typeof data,
      dataIsArray: Array.isArray(data?.data),
      dataLength: Array.isArray(data?.data) ? data.data.length : data?.data ? 1 : 0,
      dataIsNull: data?.data === null,
      dataIsUndefined: data?.data === undefined,
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
    console.error('Error fetching drinks from Strapi:', error)
    
    // Return empty data structure instead of error to prevent frontend crashes
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





