import { NextRequest, NextResponse } from 'next/server'
import { fetchFromStrapi } from '@/lib/strapi'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

/**
 * GET /api/admin/categories/[id] - Get single category
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

    const data = await fetchFromStrapi(`/categories/${params.id}`, {
      cache: 'no-store',
    }, queryParams)
    
    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    console.error('Error fetching category:', error)
    return NextResponse.json(
      { error: 'Failed to fetch category', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/admin/categories/[id] - Update category
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    
    const categoryData = {
      name: body.name,
      slug: body.slug,
      description: body.description || '',
      imageUrl: body.imageUrl || null,
      publishedAt: body.publishedAt || new Date().toISOString(),
    }

    const locale = body.locale || 'en'
    const queryParams: Record<string, string> = { locale }

    // Try to fetch the document first to get the correct ID format
    let documentId = params.id
    try {
      const existingDoc = await fetchFromStrapi(`/categories/${params.id}`, {
        cache: 'no-store',
      }, queryParams)
      // Use documentId if available, otherwise use the provided id
      documentId = existingDoc.data?.documentId || existingDoc.data?.id || params.id
    } catch (fetchError) {
      // If fetch fails, proceed with the provided ID
      console.warn('Could not fetch existing document, using provided ID:', params.id)
    }

    const data = await fetchFromStrapi(`/categories/${documentId}`, {
      method: 'PUT',
      body: JSON.stringify({ data: categoryData }),
    }, queryParams)
    
    return NextResponse.json(
      { 
        success: true, 
        category: data.data,
        message: 'Category updated successfully' 
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error updating category:', error)
    return NextResponse.json(
      { 
        error: 'Failed to update category', 
        message: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/admin/categories/[id] - Delete category
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await fetchFromStrapi(`/categories/${params.id}`, {
      method: 'DELETE',
    })
    
    return NextResponse.json(
      { 
        success: true,
        message: 'Category deleted successfully' 
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error deleting category:', error)
    return NextResponse.json(
      { 
        error: 'Failed to delete category', 
        message: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    )
  }
}


