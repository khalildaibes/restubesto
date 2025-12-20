/**
 * Strapi API configuration and utilities
 */

export const STRAPI_URL = process.env.STRAPI_URL || 'http://46.101.178.174:1337'
// Use environment variable if set, otherwise use the token from populate script
// Make sure this token has READ permissions for categories, meals, banners, tags, ingredients
export const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN || '125e0e32ce40a943c2390b5aa6d946b9de45b9e8314cfeec5b26471a6b8a8098ee7b34f70b805a6dc7cd4a7f2db5e8ac3fdf6b535cbea8e33d0a80ef91892029dd721d841beee8112c71e4bd75475ed19efd2b89e10f068677f485b43dbb160a051c79bc32c70dbf77b343f00bc4e023324b2fcaa6ab8ede4c3f7649a70daa31'

// Validate token on module load
if (!STRAPI_API_TOKEN || STRAPI_API_TOKEN.length < 20) {
  console.error('⚠️ WARNING: Strapi API token appears to be invalid or missing!')
  console.error('   Token length:', STRAPI_API_TOKEN?.length || 0)
  console.error('   Set STRAPI_API_TOKEN environment variable or update lib/strapi.ts')
}

/**
 * Get Strapi API headers with authentication
 */
export function getStrapiHeaders() {
  const token = process.env.STRAPI_API_TOKEN || STRAPI_API_TOKEN
  const tokenPreview = token ? `${token.substring(0, 20)}...` : 'MISSING'
  
  // Log token info (first 20 chars only for security)
  console.log('🔑 Strapi Auth Token:', {
    hasEnvVar: !!process.env.STRAPI_API_TOKEN,
    tokenPreview,
    tokenLength: token?.length || 0,
    url: STRAPI_URL,
  })
  
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  }
}

/**
 * Build Strapi API URL with query parameters
 * Always includes locale parameter (defaults to 'en' if not provided)
 * This matches the populate script pattern where locale is always included in the query string
 * Structure matches createRequest function: locale is always appended last
 */
export function buildStrapiUrl(endpoint: string, params?: Record<string, string>) {
  // Validate and ensure locale is always included (matching populate script pattern)
  const validLocales = ['en', 'he', 'ar']
  const locale = params?.locale && validLocales.includes(params.locale) 
    ? params.locale 
    : 'en'
  
  // Build base URL - check if endpoint already has query params (matching populate script pattern)
  const hasQueryParams = endpoint.includes('?')
  const baseUrl = `${STRAPI_URL}/api${endpoint}`
  
  // Build query parameters (excluding locale, which we'll append last)
  const queryParams: string[] = []
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (key !== 'locale') {
        queryParams.push(`${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
      }
    })
  }
  
  // Build final URL matching populate script structure
  // Pattern matches createRequest: endpoint?otherParams&locale=en or endpoint?locale=en
  // If endpoint has query params, use &, otherwise use ?
  const separator = hasQueryParams ? '&' : '?'
  const otherParams = queryParams.length > 0 ? `${queryParams.join('&')}&` : ''
  
  const finalUrl = `${baseUrl}${separator}${otherParams}locale=${locale}`
  
  // Log the endpoint being called
  console.log('🌐 Strapi API Request:', {
    endpoint,
    locale,
    fullUrl: finalUrl,
    params: params ? Object.keys(params).filter(k => k !== 'locale') : [],
  })
  
  return finalUrl
}

/**
 * Fetch from Strapi API with error handling
 * Locale is always included in the request (matching populate script pattern)
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
    
    const headers = {
      ...getStrapiHeaders(),
      ...options.headers,
    }
    
    // Log headers (without full token for security)
    const authHeader = headers['Authorization'] || headers['authorization'] || ''
    console.log('📤 Strapi Request Headers:', {
      hasAuth: !!authHeader,
      authPrefix: authHeader.substring(0, 20),
      contentType: headers['Content-Type'],
      allHeaderKeys: Object.keys(headers),
    })
    
    const response = await fetch(url, {
      ...options,
      headers,
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
      
      // Special handling for 401 errors
      if (response.status === 401) {
        const tokenPreview = STRAPI_API_TOKEN ? `${STRAPI_API_TOKEN.substring(0, 20)}...` : 'MISSING'
        console.error('❌ Strapi API Authentication Error (401):', {
          status: response.status,
          url,
          error: errorMessage,
          tokenPreview,
          tokenLength: STRAPI_API_TOKEN?.length || 0,
          hasEnvVar: !!process.env.STRAPI_API_TOKEN,
          suggestion: 'Check if the API token is valid and has READ permissions in Strapi admin',
        })
        throw new Error(
          `Strapi API authentication failed (401): ${errorMessage}. Please verify the API token has READ permissions.`
        )
      }
      
      console.error('❌ Strapi API Error:', {
        status: response.status,
        statusText: response.statusText,
        url,
        error: errorMessage,
        errorData,
      })
      throw new Error(
        `Strapi API error (${response.status}): ${errorMessage}`
      )
    }

    const responseData = await response.json()
    
    // Log successful response for debugging
    console.log('✅ Strapi API Response:', {
      endpoint,
      url,
      hasData: !!responseData?.data,
      dataLength: Array.isArray(responseData?.data) ? responseData.data.length : responseData?.data ? 1 : 0,
      dataType: Array.isArray(responseData?.data) ? 'array' : typeof responseData?.data,
      responseKeys: Object.keys(responseData || {}),
    })
    
    // Check if response is null or empty
    if (!responseData || (responseData.data === null || responseData.data === undefined)) {
      console.warn('⚠️ Strapi returned null or undefined data:', {
        endpoint,
        url,
        responseData,
      })
    }
    
    return responseData
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

