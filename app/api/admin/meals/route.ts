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
      'publicationState': 'preview', // Include both published and unpublished meals for admin
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
    
    // Log the incoming request for debugging
    console.log('📝 Creating meal with data:', {
      name: body.name,
      categorySlug: body.categorySlug,
      hasIngredients: !!body.ingredients,
      ingredientsCount: Array.isArray(body.ingredients) ? body.ingredients.length : 0,
      hasTags: !!body.tags,
      tagsCount: Array.isArray(body.tags) ? body.tags.length : 0,
    })
    
    const mealData: any = {
      name: body.name,
      description: body.description,
      price: body.price,
      calories: body.calories || null,
      categorySlug: body.categorySlug,
      imageUrl: body.imageUrl || null,
      available: body.available !== undefined ? body.available : true,
      publishedAt: new Date().toISOString(),
    }

    // Only include ingredients if provided and not empty
    if (body.ingredients && Array.isArray(body.ingredients) && body.ingredients.length > 0) {
      mealData.ingredients = body.ingredients
    }

    // Only include tags if provided and not empty
    if (body.tags && Array.isArray(body.tags) && body.tags.length > 0) {
      mealData.tags = body.tags
    }

    const locale = body.locale || 'en'
    const params: Record<string, string> = { locale }

    console.log('📤 Sending to Strapi:', {
      mealData,
      locale,
    })

    const data = await fetchFromStrapi('/meals', {
      method: 'POST',
      body: JSON.stringify({ data: mealData }),
    }, params)
    
    console.log('✅ Meal created successfully:', {
      mealId: data.data?.id,
      documentId: data.data?.documentId,
    })
    
    return NextResponse.json(
      { 
        success: true, 
        meal: data.data,
        message: 'Meal created successfully' 
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('❌ Error creating meal:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('Error details:', {
      message: errorMessage,
      stack: error instanceof Error ? error.stack : undefined,
    })
    return NextResponse.json(
      { 
        error: 'Failed to create meal', 
        message: errorMessage
      },
      { status: 500 }
    )
  }
}

