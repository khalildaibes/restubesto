import { NextRequest, NextResponse } from 'next/server'
import { fetchFromStrapi } from '@/lib/strapi'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

/**
 * GET /api/admin/ingredients/[id] - Get single ingredient
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
    }

    const data = await fetchFromStrapi(`/ingredients/${params.id}`, {
      cache: 'no-store',
    }, queryParams)
    
    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    console.error('Error fetching ingredient:', error)
    return NextResponse.json(
      { error: 'Failed to fetch ingredient', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/admin/ingredients/[id] - Update ingredient
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    
    const ingredientData = {
      name: body.name,
      price: body.price || 0,
      isDefault: body.isDefault || false,
      publishedAt: body.publishedAt || new Date().toISOString(),
    }

    const locale = body.locale || 'en'
    const queryParams: Record<string, string> = { locale }

    // Try to fetch the document first to get the correct ID format
    let documentId = params.id
    try {
      const existingDoc = await fetchFromStrapi(`/ingredients/${params.id}`, {
        cache: 'no-store',
      }, queryParams)
      // Use documentId if available, otherwise use the provided id
      documentId = existingDoc.data?.documentId || existingDoc.data?.id || params.id
    } catch (fetchError) {
      // If fetch fails, proceed with the provided ID
      console.warn('Could not fetch existing document, using provided ID:', params.id)
    }

    const data = await fetchFromStrapi(`/ingredients/${documentId}`, {
      method: 'PUT',
      body: JSON.stringify({ data: ingredientData }),
    }, queryParams)
    
    return NextResponse.json(
      { 
        success: true, 
        ingredient: data.data,
        message: 'Ingredient updated successfully' 
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error updating ingredient:', error)
    return NextResponse.json(
      { 
        error: 'Failed to update ingredient', 
        message: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/admin/ingredients/[id] - Delete ingredient
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await fetchFromStrapi(`/ingredients/${params.id}`, {
      method: 'DELETE',
    })
    
    return NextResponse.json(
      { 
        success: true,
        message: 'Ingredient deleted successfully' 
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error deleting ingredient:', error)
    return NextResponse.json(
      { 
        error: 'Failed to delete ingredient', 
        message: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    )
  }
}

