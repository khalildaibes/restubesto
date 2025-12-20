import { NextRequest, NextResponse } from 'next/server'
import { fetchFromStrapi } from '@/lib/strapi'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

/**
 * GET /api/admin/meals/[id] - Get single meal
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(request.url)
    const locale = searchParams.get('locale') || 'en'
    
    const queryParams: Record<string, string> = {
      locale,
      'populate[ingredients]': '*',
    }

    const data = await fetchFromStrapi(`/meals/${params.id}`, {
      cache: 'no-store',
    }, queryParams)
    
    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    console.error('Error fetching meal:', error)
    return NextResponse.json(
      { error: 'Failed to fetch meal', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/admin/meals/[id] - Update meal
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    
    const mealData = {
      name: body.name,
      description: body.description,
      price: body.price,
      calories: body.calories || null,
      categorySlug: body.categorySlug,
      imageUrl: body.imageUrl || null,
      ingredients: body.ingredients || [],
      tags: body.tags || [],
      available: body.available !== undefined ? body.available : true,
      publishedAt: body.publishedAt || new Date().toISOString(),
    }

    const locale = body.locale || 'en'
    const queryParams: Record<string, string> = { locale }

    // Try to fetch the document first to get the correct ID format
    let documentId = params.id
    try {
      const existingDoc = await fetchFromStrapi(`/meals/${params.id}`, {
        cache: 'no-store',
      }, { ...queryParams, 'populate[ingredients]': '*' })
      // Use documentId if available, otherwise use the provided id
      documentId = existingDoc.data?.documentId || existingDoc.data?.id || params.id
    } catch (fetchError) {
      // If fetch fails, proceed with the provided ID
      console.warn('Could not fetch existing document, using provided ID:', params.id)
    }

    const data = await fetchFromStrapi(`/meals/${documentId}`, {
      method: 'PUT',
      body: JSON.stringify({ data: mealData }),
    }, queryParams)
    
    return NextResponse.json(
      { 
        success: true, 
        meal: data.data,
        message: 'Meal updated successfully' 
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error updating meal:', error)
    return NextResponse.json(
      { 
        error: 'Failed to update meal', 
        message: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/admin/meals/[id] - Delete meal
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await fetchFromStrapi(`/meals/${params.id}`, {
      method: 'DELETE',
    })
    
    return NextResponse.json(
      { 
        success: true,
        message: 'Meal deleted successfully' 
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error deleting meal:', error)
    return NextResponse.json(
      { 
        error: 'Failed to delete meal', 
        message: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    )
  }
}

