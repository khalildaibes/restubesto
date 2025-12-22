import { NextRequest, NextResponse } from 'next/server'
import { fetchFromStrapi } from '@/lib/strapi'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

/**
 * GET /api/admin/drinks - Get all drinks
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const locale = searchParams.get('locale') || 'en'
    
    const params: Record<string, string> = {
      locale,
    }

    const data = await fetchFromStrapi('/drinks', {
      cache: 'no-store',
    }, params)
    
    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    console.error('Error fetching drinks:', error)
    return NextResponse.json(
      { error: 'Failed to fetch drinks', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/admin/drinks - Create new drink
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const drinkData = {
      name: body.name,
      slug: body.slug,
      description: body.description || '',
      categorySlug: body.categorySlug,
      price: body.price,
      calories: body.calories || null,
      volume: body.volume || null,
      imageUrl: body.imageUrl || null,
      available: body.available !== undefined ? body.available : true,
      publishedAt: new Date().toISOString(),
    }

    const locale = body.locale || 'en'
    const params: Record<string, string> = { locale }

    const data = await fetchFromStrapi('/drinks', {
      method: 'POST',
      body: JSON.stringify({ data: drinkData }),
    }, params)
    
    return NextResponse.json(
      { 
        success: true, 
        drink: data.data,
        message: 'Drink created successfully' 
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating drink:', error)
    return NextResponse.json(
      { 
        error: 'Failed to create drink', 
        message: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    )
  }
}


