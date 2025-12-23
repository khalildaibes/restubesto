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
    
    // Log the incoming request for debugging
    console.log('📝 Creating drink with data:', {
      name: body.name,
      categorySlug: body.categorySlug,
      hasImage: !!body.imageUrl,
    })
    
    // Note: slug and volume fields don't exist in Strapi drinks collection
    const drinkData = {
      name: body.name,
      description: body.description || '',
      categorySlug: body.categorySlug,
      price: body.price,
      calories: body.calories || null,
      imageUrl: body.imageUrl || null,
      available: body.available !== undefined ? body.available : true,
      publishedAt: new Date().toISOString(),
    }

    const locale = body.locale || 'en'
    const params: Record<string, string> = { locale }

    console.log('📤 Sending to Strapi:', {
      drinkData,
      locale,
    })

    const data = await fetchFromStrapi('/drinks', {
      method: 'POST',
      body: JSON.stringify({ data: drinkData }),
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
          error: 'Failed to create drink',
          message: 'Unexpected response format from server'
        },
        { status: 500 }
      )
    }
    
    console.log('✅ Drink created successfully:', {
      drinkId: data.data?.id,
      documentId: data.data?.documentId,
    })
    
    return NextResponse.json(
      { 
        success: true, 
        drink: data.data || data,
        message: 'Drink created successfully' 
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('❌ Error creating drink:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('Error details:', {
      message: errorMessage,
      stack: error instanceof Error ? error.stack : undefined,
    })
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to create drink', 
        message: errorMessage
      },
      { status: 500 }
    )
  }
}


