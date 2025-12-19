import { NextRequest, NextResponse } from 'next/server'
import { fetchFromStrapi } from '@/lib/strapi'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const locale = searchParams.get('locale') || 'en'
    
    const params: Record<string, string> = {
      locale,
      'populate[image]': '*',
      'filters[isActive][$eq]': 'true',
      sort: 'order:asc',
    }

    const data = await fetchFromStrapi('/banners', {
      cache: 'no-store',
    }, params)
    
    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    console.error('Error fetching banners:', error)
    return NextResponse.json(
      { error: 'Failed to fetch banners', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

