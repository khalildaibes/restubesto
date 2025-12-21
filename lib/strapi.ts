/**
 * Strapi API configuration and utilities
 */

export const STRAPI_URL = process.env.STRAPI_URL || 'http://46.101.178.174:1339'
// Use environment variable if set, otherwise use the token from populate script
// Make sure this token has READ permissions for categories, meals, banners, tags, ingredients
export const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN || 'a21102545606697fbc52a039f91bbe373f9689a4cc3144488422f0a346f29018b80f91cbdc2fe39cda8105b8c6c81f2972bd4bace6934bfbc6330e66e6ff209122a1fe26d8bec3faa0354f940e6ee002266c27710dc34042ff6b835b0006c9bd6a850b83fbcd1b81c5c601292b95cff51ed444144ab2950c4f0b146e4b7a7217'

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
 * 
 * @param skipLocale - If true, skip adding locale parameter (for non-i18n collections like orders)
 */
export function buildStrapiUrl(endpoint: string, params?: Record<string, string>, skipLocale: boolean = false) {
  // Validate and ensure locale is always included (matching populate script pattern)
  const validLocales = ['en', 'he', 'ar']
  const locale = params?.locale && validLocales.includes(params.locale) 
    ? params.locale 
    : 'en'
  
  // Build base URL - check if endpoint already has query params (matching populate script pattern)
  const hasQueryParams = endpoint.includes('?')
  const baseUrl = `${STRAPI_URL}/api${endpoint}`
  
  // Build query parameters (excluding locale, which we'll append last if not skipping)
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
  let finalUrl = baseUrl
  
  if (queryParams.length > 0 || !skipLocale) {
    const otherParams = queryParams.length > 0 ? queryParams.join('&') : ''
    const localeParam = skipLocale ? '' : `locale=${locale}`
    
    if (otherParams && localeParam) {
      finalUrl = `${baseUrl}${separator}${otherParams}&${localeParam}`
    } else if (otherParams) {
      finalUrl = `${baseUrl}${separator}${otherParams}`
    } else if (localeParam) {
      finalUrl = `${baseUrl}${separator}${localeParam}`
    }
  }
  
  // Log the endpoint being called
  console.log('🌐 Strapi API Request:', {
    endpoint,
    locale: skipLocale ? 'none' : locale,
    fullUrl: finalUrl,
    params: params ? Object.keys(params).filter(k => k !== 'locale') : [],
  })
  
  return finalUrl
}

/**
 * Fetch from Strapi API with error handling
 * Locale is always included in the request (matching populate script pattern)
 * 
 * @param skipLocale - If true, skip adding locale parameter (for non-i18n collections like orders)
 */
export async function fetchFromStrapi(
  endpoint: string,
  options: RequestInit = {},
  params?: Record<string, string>,
  skipLocale: boolean = false
) {
  const url = buildStrapiUrl(endpoint, params, skipLocale)
  
  try {
    // Create abort controller for timeout
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout
    
    const baseHeaders = getStrapiHeaders()
    const additionalHeaders = options.headers || {}
    
    // Convert Headers object to plain object if needed
    const additionalHeadersObj = additionalHeaders instanceof Headers
      ? Object.fromEntries(additionalHeaders.entries())
      : (additionalHeaders as Record<string, string>)
    
    const headers: Record<string, string> = {
      ...baseHeaders,
      ...additionalHeadersObj,
    }
    
    // Log headers (without full token for security)
    const authHeader = headers['Authorization'] || ''
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

