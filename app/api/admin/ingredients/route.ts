import { NextRequest, NextResponse } from 'next/server'
import { fetchFromStrapi } from '@/lib/strapi'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

/**
 * GET /api/admin/ingredients - Get all ingredients
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const locale = searchParams.get('locale') || 'en'
    
    const params: Record<string, string> = {
      locale,
    }

    const data = await fetchFromStrapi('/ingredients', {
      cache: 'no-store',
    }, params)
    
    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    console.error('Error fetching ingredients:', error)
    return NextResponse.json(
      { error: 'Failed to fetch ingredients', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/admin/ingredients - Create new ingredient
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const ingredientData = {
      name: body.name,
      price: body.price || 0,
      isDefault: body.isDefault || false,
      publishedAt: new Date().toISOString(),
    }

    const locale = body.locale || 'en'
    const params: Record<string, string> = { locale }

    const data = await fetchFromStrapi('/ingredients', {
      method: 'POST',
      body: JSON.stringify({ data: ingredientData }),
    }, params)
    
    return NextResponse.json(
      { 
        success: true, 
        ingredient: data.data,
        message: 'Ingredient created successfully' 
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating ingredient:', error)
    return NextResponse.json(
      { 
        error: 'Failed to create ingredient', 
        message: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    )
  }
}





