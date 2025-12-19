import { NextRequest, NextResponse } from 'next/server'
import { STRAPI_URL } from '@/lib/strapi'

// Mark this route as dynamic
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

/**
 * Image proxy route to serve Strapi images through Next.js
 * This avoids mixed content issues in production (HTTPS site loading HTTP images)
 * 
 * Usage: /api/images/uploads/photo_123.jpg
 * Proxies to: http://142.93.172.35:1337/uploads/photo_123.jpg
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  try {
    // Reconstruct the path from the array
    const imagePath = params.path.join('/')
    
    // Build the full Strapi URL
    const strapiImageUrl = `${STRAPI_URL}/${imagePath}`
    
    console.log('🖼️ Image proxy - Fetching:', {
      path: imagePath,
      strapiUrl: strapiImageUrl,
      requestUrl: request.url,
    })
    
    // Create AbortController for timeout
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout
    
    try {
      // Fetch the image from Strapi
      const imageResponse = await fetch(strapiImageUrl, {
        headers: {
          'Accept': 'image/*',
        },
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (!imageResponse.ok) {
        console.error('❌ Image proxy - Strapi returned error:', {
          status: imageResponse.status,
          statusText: imageResponse.statusText,
          strapiUrl: strapiImageUrl,
        })
        return new NextResponse('Image not found', { status: 404 })
      }

      // Get the image data
      const imageBuffer = await imageResponse.arrayBuffer()
      const contentType = imageResponse.headers.get('content-type') || 'image/jpeg'

      console.log('✅ Image proxy - Success:', {
        path: imagePath,
        contentType,
        size: imageBuffer.byteLength,
      })

      // Return the image with proper headers
      return new NextResponse(imageBuffer, {
        headers: {
          'Content-Type': contentType,
          'Cache-Control': 'public, max-age=31536000, immutable',
          'Access-Control-Allow-Origin': '*',
        },
      })
    } catch (fetchError: any) {
      clearTimeout(timeoutId)
      
      if (fetchError.name === 'AbortError') {
        console.error('❌ Image proxy - Timeout:', {
          strapiUrl: strapiImageUrl,
          timeout: '10s',
        })
        return new NextResponse('Image request timeout', { status: 504 })
      }
      
      throw fetchError
    }
  } catch (error: any) {
    console.error('❌ Image proxy - Error:', {
      error: error.message,
      stack: error.stack,
      path: params.path.join('/'),
    })
    return new NextResponse('Error loading image', { status: 500 })
  }
}

