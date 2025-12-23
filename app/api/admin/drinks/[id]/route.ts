import { NextRequest, NextResponse } from 'next/server'
import { fetchFromStrapi } from '@/lib/strapi'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

/**
 * GET /api/admin/drinks/[id] - Get single drink
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

    const data = await fetchFromStrapi(`/drinks/${params.id}`, {
      cache: 'no-store',
    }, queryParams)
    
    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    console.error('Error fetching drink:', error)
    return NextResponse.json(
      { error: 'Failed to fetch drink', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/admin/drinks/[id] - Update drink
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    
    // Note: slug and volume fields don't exist in Strapi drinks collection
    const drinkData = {
      name: body.name,
      description: body.description || '',
      categorySlug: body.categorySlug,
      price: body.price,
      calories: body.calories || null,
      imageUrl: body.imageUrl || null,
      available: body.available !== undefined ? body.available : true,
      publishedAt: body.publishedAt || new Date().toISOString(),
    }

    const locale = body.locale || 'en'
    const queryParams: Record<string, string> = { locale }

    // Try to fetch the document first to get the correct ID format
    let documentId = params.id
    try {
      const existingDoc = await fetchFromStrapi(`/drinks/${params.id}`, {
        cache: 'no-store',
      }, queryParams)
      // Use documentId if available, otherwise use the provided id
      documentId = existingDoc.data?.documentId || existingDoc.data?.id || params.id
    } catch (fetchError) {
      // If fetch fails, proceed with the provided ID
      console.warn('Could not fetch existing document, using provided ID:', params.id)
    }

    const data = await fetchFromStrapi(`/drinks/${documentId}`, {
      method: 'PUT',
      body: JSON.stringify({ data: drinkData }),
    }, queryParams)
    
    return NextResponse.json(
      { 
        success: true, 
        drink: data.data,
        message: 'Drink updated successfully' 
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error updating drink:', error)
    return NextResponse.json(
      { 
        error: 'Failed to update drink', 
        message: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/admin/drinks/[id] - Delete drink
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await fetchFromStrapi(`/drinks/${params.id}`, {
      method: 'DELETE',
    })
    
    return NextResponse.json(
      { 
        success: true,
        message: 'Drink deleted successfully' 
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error deleting drink:', error)
    return NextResponse.json(
      { 
        error: 'Failed to delete drink', 
        message: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    )
  }
}


