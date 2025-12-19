import { NextRequest, NextResponse } from 'next/server'
import { fetchFromStrapi } from '@/lib/strapi'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const locale = searchParams.get('locale') || 'en'
    
    const params: Record<string, string> = {
      locale,
      sort: 'name:asc',
    }

    const data = await fetchFromStrapi('/tags', {
      cache: 'no-store',
    }, params)
    
    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    console.error('Error fetching tags from Strapi:', error)
    
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

