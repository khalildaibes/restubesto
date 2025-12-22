import { NextRequest, NextResponse } from 'next/server'
import { uploadImageToStrapi, uploadImageFromUrl } from '@/lib/strapi-upload'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

/**
 * POST /api/admin/upload - Upload image to Strapi
 * Accepts either:
 * - FormData with 'file' field (File upload)
 * - JSON with 'url' field (URL to download and upload)
 */
export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get('content-type') || ''
    
    if (contentType.includes('multipart/form-data')) {
      // Handle file upload
      const formData = await request.formData()
      const file = formData.get('file') as File
      
      if (!file) {
        return NextResponse.json(
          { error: 'No file provided' },
          { status: 400 }
        )
      }

      const result = await uploadImageToStrapi(file)
      
      console.log('✅ Image uploaded successfully:', {
        id: result.id,
        url: result.url,
        name: result.name,
        size: result.size,
      })
      
      return NextResponse.json(
        {
          success: true,
          image: result,
          message: 'Image uploaded successfully'
        },
        { status: 200 }
      )
    } else {
      // Handle URL upload
      const body = await request.json()
      const { url } = body
      
      if (!url) {
        return NextResponse.json(
          { error: 'No URL provided' },
          { status: 400 }
        )
      }

      const result = await uploadImageFromUrl(url)
      
      return NextResponse.json(
        {
          success: true,
          image: result,
          message: 'Image uploaded successfully'
        },
        { status: 200 }
      )
    }
  } catch (error) {
    console.error('Error uploading image:', error)
    return NextResponse.json(
      { 
        error: 'Failed to upload image', 
        message: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    )
  }
}


