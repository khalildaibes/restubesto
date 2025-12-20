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
    
    const categoryData = {
      name: body.name,
      slug: body.slug,
      description: body.description || '',
      imageUrl: body.imageUrl || null,
      publishedAt: new Date().toISOString(),
    }

    const locale = body.locale || 'en'
    const params: Record<string, string> = { locale }

    const data = await fetchFromStrapi('/categories', {
      method: 'POST',
      body: JSON.stringify({ data: categoryData }),
    }, params)
    
    return NextResponse.json(
      { 
        success: true, 
        category: data.data,
        message: 'Category created successfully' 
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating category:', error)
    return NextResponse.json(
      { 
        error: 'Failed to create category', 
        message: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    )
  }
}

