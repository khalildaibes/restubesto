/**
 * Strapi API configuration and utilities
 */

export const STRAPI_URL = process.env.STRAPI_URL || 'http://142.93.172.35:1337'
export const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN || 'd78856f2b47379e13f458eb788564423412499d8b56f0ebc605627453d381169e9eddd9def1c6177eeab04fec56ac737bf2309f7f72a8487f4a09f753c4bd49090a5446c5f456bb2b8573b1ddd35a09faf078c621502f11c2a34cd848aca367bcf7b559fdec56d76029ac55bd08002710ca6677883d877833bec496b95d26bf6'

/**
 * Get Strapi API headers with authentication
 */
export function getStrapiHeaders() {
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${STRAPI_API_TOKEN}`,
  }
}

/**
 * Build Strapi API URL with query parameters
 */
export function buildStrapiUrl(endpoint: string, params?: Record<string, string>) {
  const url = new URL(`${STRAPI_URL}/api${endpoint}`)
  
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value)
    })
  }
  
  return url.toString()
}

/**
 * Fetch from Strapi API with error handling
 */
export async function fetchFromStrapi(
  endpoint: string,
  options: RequestInit = {},
  params?: Record<string, string>
) {
  const url = buildStrapiUrl(endpoint, params)
  
  try {
    // Create abort controller for timeout
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout
    
    const response = await fetch(url, {
      ...options,
      headers: {
        ...getStrapiHeaders(),
        ...options.headers,
      },
      signal: controller.signal,
    })
    
    clearTimeout(timeoutId)

    if (!response.ok) {
      const errorText = await response.text()
      let errorData
      try {
        errorData = JSON.parse(errorText)
      } catch {
        errorData = { message: errorText }
      }
      
      const errorMessage = errorData?.error?.message || errorData?.message || response.statusText
      throw new Error(
        `Strapi API error (${response.status}): ${errorMessage}`
      )
    }

    return response.json()
  } catch (error) {
    // Handle network errors, timeouts, etc.
    if (error instanceof Error) {
      if (error.name === 'AbortError' || error.message.includes('timeout')) {
        throw new Error('Strapi API request timeout - server may be unreachable')
      }
      if (error.message.includes('fetch failed') || error.message.includes('ECONNREFUSED')) {
        throw new Error('Cannot connect to Strapi server - check if server is running and accessible')
      }
    }
    throw error
  }
}

