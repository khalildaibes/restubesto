/**
 * Utility functions for uploading images to Strapi
 */

import { STRAPI_URL, STRAPI_API_TOKEN } from './strapi'

export interface UploadImageResult {
  id: number
  url: string
  name: string
  mime: string
  size: number
}

/**
 * Upload an image file to Strapi media library
 * @param file - File object to upload
 * @returns Uploaded file information with URL
 */
export async function uploadImageToStrapi(file: File): Promise<UploadImageResult> {
  const formData = new FormData()
  formData.append('files', file)

  const response = await fetch(`${STRAPI_URL}/api/upload`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${STRAPI_API_TOKEN}`,
    },
    body: formData,
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Failed to upload image: ${response.status} - ${errorText}`)
  }

  const result = await response.json()
  
  if (!result || !Array.isArray(result) || result.length === 0) {
    throw new Error('Invalid response from Strapi upload endpoint')
  }

  const uploadedFile = result[0]
  
  // Extract URL from Strapi response
  const url = uploadedFile.url
    ? `${STRAPI_URL}${uploadedFile.url}`
    : uploadedFile.formats?.large?.url 
      ? `${STRAPI_URL}${uploadedFile.formats.large.url}`
      : uploadedFile.formats?.medium?.url
        ? `${STRAPI_URL}${uploadedFile.formats.medium.url}`
        : uploadedFile.formats?.small?.url
          ? `${STRAPI_URL}${uploadedFile.formats.small.url}`
          : ''

  return {
    id: uploadedFile.id,
    url,
    name: uploadedFile.name,
    mime: uploadedFile.mime,
    size: uploadedFile.size,
  }
}

/**
 * Upload an image from a URL to Strapi
 * Downloads the image first, then uploads it
 */
export async function uploadImageFromUrl(imageUrl: string): Promise<UploadImageResult> {
  // Download the image
  const imageResponse = await fetch(imageUrl)
  if (!imageResponse.ok) {
    throw new Error(`Failed to download image: HTTP ${imageResponse.status}`)
  }

  const imageBlob = await imageResponse.blob()
  const contentType = imageResponse.headers.get('content-type') || 'image/jpeg'
  
  // Extract filename from URL or generate one
  const urlPath = new URL(imageUrl).pathname
  const filename = urlPath.split('/').pop() || `image-${Date.now()}.jpg`
  
  // Create File object from blob
  const file = new File([imageBlob], filename, { type: contentType })
  
  return uploadImageToStrapi(file)
}





