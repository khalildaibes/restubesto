import { NextRequest, NextResponse } from 'next/server'
import { fetchFromStrapi } from '@/lib/strapi'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

/**
 * GET /api/admin/meals - Get all meals
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const locale = searchParams.get('locale') || 'en'
    
    const params: Record<string, string> = {
      locale,
      'populate[ingredients]': '*',
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

/**
 * POST /api/admin/meals - Create new meal
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const mealData = {
      name: body.name,
      description: body.description,
      price: body.price,
      calories: body.calories || null,
      categorySlug: body.categorySlug,
      imageUrl: body.imageUrl || null,
      ingredients: body.ingredients || [], // Array of ingredient IDs
      tags: body.tags || [], // Array of tag IDs
      available: body.available !== undefined ? body.available : true,
      publishedAt: new Date().toISOString(),
    }

    const locale = body.locale || 'en'
    const params: Record<string, string> = { locale }

    const data = await fetchFromStrapi('/meals', {
      method: 'POST',
      body: JSON.stringify({ data: mealData }),
    }, params)
    
    return NextResponse.json(
      { 
        success: true, 
        meal: data.data,
        message: 'Meal created successfully' 
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating meal:', error)
    return NextResponse.json(
      { 
        error: 'Failed to create meal', 
        message: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    )
  }
}

