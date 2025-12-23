import { NextRequest, NextResponse } from 'next/server'
import { fetchFromStrapi } from '@/lib/strapi'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

/**
 * GET /api/admin/categories - Get all categories
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const locale = searchParams.get('locale') || 'en'
    
    const params: Record<string, string> = {
      locale,
    }

    const data = await fetchFromStrapi('/categories', {
      cache: 'no-store',
    }, params)
    
    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    console.error('Error fetching categories:', error)
    return NextResponse.json(
      { error: 'Failed to fetch categories', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/admin/categories - Create new category
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Log the incoming request for debugging
    console.log('📝 Creating category with data:', {
      name: body.name,
      slug: body.slug,
      hasImage: !!body.imageUrl,
    })
    
    const categoryData = {
      name: body.name,
      slug: body.slug,
      description: body.description || '',
      imageUrl: body.imageUrl || null,
      publishedAt: new Date().toISOString(),
    }

    const locale = body.locale || 'en'
    const params: Record<string, string> = { locale }

    console.log('📤 Sending to Strapi:', {
      categoryData,
      locale,
    })

    const data = await fetchFromStrapi('/categories', {
      method: 'POST',
      body: JSON.stringify({ data: categoryData }),
    }, params)
    
    console.log('📥 Strapi response:', {
      hasData: !!data,
      dataType: typeof data,
      dataKeys: data ? Object.keys(data) : [],
      hasDataData: !!data?.data,
    })
    
    // Handle case where Strapi returns empty object or unexpected format
    if (!data || typeof data !== 'object') {
      console.warn('⚠️ Unexpected response format from Strapi')
      return NextResponse.json(
        { 
          success: false,
          error: 'Failed to create category',
          message: 'Unexpected response format from server'
        },
        { status: 500 }
      )
    }
    
    console.log('✅ Category created successfully:', {
      categoryId: data.data?.id,
      documentId: data.data?.documentId,
    })
    
    return NextResponse.json(
      { 
        success: true, 
        category: data.data || data,
        message: 'Category created successfully' 
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('❌ Error creating category:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('Error details:', {
      message: errorMessage,
      stack: error instanceof Error ? error.stack : undefined,
    })
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to create category', 
        message: errorMessage
      },
      { status: 500 }
    )
  }
}


