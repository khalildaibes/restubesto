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
    
    console.log('📝 Updating meal with data:', {
      id: params.id,
      name: body.name,
      hasImageUrl: !!body.imageUrl,
      imageUrl: body.imageUrl,
      available: body.available,
    })
    
    const mealData: any = {
      name: body.name,
      description: body.description,
      price: body.price,
      calories: body.calories || null,
      categorySlug: body.categorySlug,
      available: body.available !== undefined ? body.available : true,
      publishedAt: body.publishedAt || new Date().toISOString(),
    }

    // Include imageUrl if it's provided (including empty string to clear it)
    if (body.imageUrl !== undefined) {
      mealData.imageUrl = body.imageUrl || null
      console.log('📸 Including imageUrl in update:', mealData.imageUrl)
    }

    // Only include ingredients/tags if provided and not empty
    if (body.ingredients && Array.isArray(body.ingredients) && body.ingredients.length > 0) {
      mealData.ingredients = body.ingredients
    } else if (body.ingredients && Array.isArray(body.ingredients) && body.ingredients.length === 0) {
      // Explicitly set to empty array if provided as empty array (to clear relations)
      mealData.ingredients = []
    }

    if (body.tags && Array.isArray(body.tags) && body.tags.length > 0) {
      mealData.tags = body.tags
    } else if (body.tags && Array.isArray(body.tags) && body.tags.length === 0) {
      // Explicitly set to empty array if provided as empty array (to clear relations)
      mealData.tags = []
    }

    const locale = body.locale || 'en'
    const queryParams: Record<string, string> = { locale }

    // For Strapi v5 with i18n, we need to use the locale-specific ID, not documentId
    // Try to fetch the document first to get the correct ID format
    let mealId = params.id
    let documentId = params.id
    
    try {
      const existingDoc = await fetchFromStrapi(`/meals/${params.id}`, {
        cache: 'no-store',
      }, { locale, 'populate[ingredients]': '*' })
      
      if (existingDoc.data) {
        documentId = existingDoc.data.documentId || existingDoc.data.id || params.id
        mealId = existingDoc.data.id || existingDoc.data.documentId || params.id
      }
    } catch (fetchError) {
      // If fetch fails, proceed with the provided ID
      console.warn('Could not fetch existing document, using provided ID:', params.id)
    }

    console.log('📤 Sending update to Strapi:', {
      mealId,
      documentId,
      originalId: params.id,
      locale,
      mealData: {
        ...mealData,
        ingredients: mealData.ingredients?.length || 0,
        tags: mealData.tags?.length || 0,
      },
    })

    // Try with locale-specific ID first
    let data
    let updateSuccess = false
    
    try {
      console.log('🔄 Attempting update with locale-specific ID:', mealId)
      data = await fetchFromStrapi(`/meals/${mealId}`, {
        method: 'PUT',
        body: JSON.stringify({ data: mealData }),
      }, queryParams)
      updateSuccess = true
      console.log('✅ Update succeeded with locale-specific ID')
    } catch (updateError) {
      console.warn('⚠️ Update with locale-specific ID failed, trying with documentId:', {
        mealId,
        error: updateError instanceof Error ? updateError.message : String(updateError),
      })
      
      // Try with documentId
      try {
        console.log('🔄 Attempting update with documentId:', documentId)
        data = await fetchFromStrapi(`/meals/${documentId}`, {
          method: 'PUT',
          body: JSON.stringify({ data: mealData }),
        }, queryParams)
        updateSuccess = true
        console.log('✅ Update succeeded with documentId')
      } catch (docIdError) {
        // If documentId also fails, try with original ID
        console.warn('⚠️ Update with documentId failed, trying with original ID:', {
          documentId,
          error: docIdError instanceof Error ? docIdError.message : String(docIdError),
        })
        
        try {
          data = await fetchFromStrapi(`/meals/${params.id}`, {
            method: 'PUT',
            body: JSON.stringify({ data: mealData }),
          }, queryParams)
          updateSuccess = true
          console.log('✅ Update succeeded with original ID')
        } catch (originalIdError) {
          throw new Error(`Failed to update meal: ${originalIdError instanceof Error ? originalIdError.message : String(originalIdError)}`)
        }
      }
    }
    
    console.log('✅ Meal updated successfully:', {
      mealId: data.data?.id,
      documentId: data.data?.documentId,
    })
    
    return NextResponse.json(
      { 
        success: true, 
        meal: data.data,
        message: 'Meal updated successfully' 
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('❌ Error updating meal:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('Error details:', {
      message: errorMessage,
      stack: error instanceof Error ? error.stack : undefined,
    })
    return NextResponse.json(
      { 
        error: 'Failed to update meal', 
        message: errorMessage
      },
      { status: 500 }
    )
  }
}
