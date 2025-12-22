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
 * Fetch a single page from Strapi API
 */
async function fetchStrapiPage(
  endpoint: string,
  options: RequestInit,
  params: Record<string, string> | undefined,
  skipLocale: boolean,
  page: number = 1,
  pageSize: number = 25
): Promise<any> {
  // Only add pagination params for GET requests to collection endpoints (not single items)
  const httpMethod = options.method || 'GET'
  const isGetRequest = httpMethod.toUpperCase() === 'GET'
  const isDeleteRequest = httpMethod.toUpperCase() === 'DELETE'
  
  // Check if this is a collection endpoint (e.g., /meals) or single item endpoint (e.g., /meals/123)
  // Single item endpoints have an ID at the end: /collection/id
  // Pattern: endpoint ends with something that looks like an ID (long alphanumeric string)
  const hasIdInPath = endpoint.match(/\/([a-zA-Z0-9_-]{15,}|[0-9]+)$/)
  const isCollectionEndpoint = !hasIdInPath
  
  // Create pagination params (only for GET requests to collection endpoints)
  const paginationParams: Record<string, string> = (isGetRequest && isCollectionEndpoint) ? {
    'pagination[page]': String(page),
    'pagination[pageSize]': String(pageSize),
  } : {}

  // Merge with existing params
  const allParams = {
    ...params,
    ...paginationParams,
  }

  const url = buildStrapiUrl(endpoint, allParams, skipLocale)
  
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
  
  // Log request details for DELETE
  if (isDeleteRequest) {
    console.log('📤 DELETE Request Details:', {
      url,
      method: httpMethod,
      hasAuth: !!headers.Authorization,
      endpoint,
    })
  }

  const response = await fetch(url, {
    ...options,
    headers,
    signal: controller.signal,
  })
  
  clearTimeout(timeoutId)

  // Log response details for DELETE requests BEFORE checking response.ok
  if (isDeleteRequest) {
    console.log('📋 DELETE Response Details:', {
      status: response.status,
      statusText: response.statusText,
      ok: response.ok,
      url,
      contentType: response.headers.get('content-type'),
      contentLength: response.headers.get('content-length'),
    })
  }

  if (!response.ok) {
    const errorText = await response.text()
    let errorData
    try {
      errorData = errorText ? JSON.parse(errorText) : { message: response.statusText }
    } catch {
      errorData = { message: errorText || response.statusText }
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

  // Check if response has content before trying to parse JSON
  // DELETE requests and some other operations may return empty responses
  const contentType = response.headers.get('content-type') || ''
  const contentLength = response.headers.get('content-length')
  
  // For DELETE requests with 200/204 status, or if content-length is 0, return empty object
  if (isDeleteRequest && (response.status === 200 || response.status === 204)) {
    console.log('✅ DELETE request succeeded (status 200/204), returning empty object')
    return {}
  }
  
  if (contentLength === '0' || response.status === 204) {
    console.log('ℹ️ Empty response body (content-length: 0 or status 204), returning empty object')
    return {}
  }
  
  // Try to get the response text first (we can only read the body once)
  const responseText = await response.text()
  
  // If response is empty, return empty object
  if (!responseText || responseText.trim() === '') {
    console.log('ℹ️ Empty response body text, returning empty object')
    return {}
  }
  
  // Try to parse as JSON
  try {
    return JSON.parse(responseText)
  } catch (parseError) {
    // If JSON parsing fails, log warning
    console.warn('⚠️ Failed to parse JSON response:', {
      status: response.status,
      contentType,
      textPreview: responseText.substring(0, 200),
      error: parseError instanceof Error ? parseError.message : String(parseError),
    })
    
    // For successful DELETE operations, return empty object even if parsing fails
    if (isDeleteRequest && (response.status === 200 || response.status === 204)) {
      console.log('ℹ️ DELETE request with parse error, returning empty object anyway')
      return {}
    }
    
    // For other operations, throw the error
    throw new Error(`Failed to parse JSON response: ${parseError instanceof Error ? parseError.message : String(parseError)}`)
  }
}

/**
 * Fetch from Strapi API with error handling and pagination support
 * Automatically fetches all pages if pagination is present
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
  try {
    const method = options.method || 'GET'
    const isGetRequest = method.toUpperCase() === 'GET'
    
    // Fetch first page
    const firstPageData = await fetchStrapiPage(endpoint, options, params, skipLocale, 1, 25)
    
    // Only handle pagination for GET requests
    if (!isGetRequest) {
      return firstPageData
    }
    
    // Check if response has pagination metadata
    const pagination = firstPageData?.meta?.pagination
    const isPaginated = pagination && typeof pagination.page === 'number' && typeof pagination.pageCount === 'number'
    
    // If not paginated or only one page, return as-is
    if (!isPaginated || pagination.pageCount <= 1) {
      console.log('✅ Strapi API Response (single page):', {
        endpoint,
        hasData: !!firstPageData?.data,
        dataLength: Array.isArray(firstPageData?.data) ? firstPageData.data.length : firstPageData?.data ? 1 : 0,
        dataType: Array.isArray(firstPageData?.data) ? 'array' : typeof firstPageData?.data,
        pagination: pagination || 'none',
      })
      
      // Check if response is null or empty
      if (!firstPageData || (firstPageData.data === null || firstPageData.data === undefined)) {
        console.warn('⚠️ Strapi returned null or undefined data:', {
          endpoint,
          firstPageData,
        })
      }
      
      return firstPageData
    }
    
    // If paginated and has multiple pages, fetch all pages
    const currentPage = pagination.page || 1
    const pageCount = pagination.pageCount || 1
    const pageSize = pagination.pageSize || 25
    
    console.log('📄 Fetching paginated data:', {
      endpoint,
      currentPage,
      pageCount,
      pageSize,
      total: pagination.total,
    })
    
    // Collect all data from first page
    const allData: any[] = Array.isArray(firstPageData.data) ? [...firstPageData.data] : []
    
    // Fetch remaining pages
    let page = currentPage + 1
    while (page <= pageCount) {
      console.log(`📄 Fetching page ${page} of ${pageCount}...`)
      
      try {
        const pageData = await fetchStrapiPage(endpoint, options, params, skipLocale, page, pageSize)
        
        if (pageData?.data && Array.isArray(pageData.data)) {
          allData.push(...pageData.data)
          console.log(`✅ Fetched page ${page}/${pageCount}, items: ${pageData.data.length}, total so far: ${allData.length}`)
        } else {
          console.warn(`⚠️ Page ${page} returned invalid data structure`)
        }
      } catch (error) {
        console.error(`❌ Error fetching page ${page}:`, error)
        // Continue with next page even if one fails
      }
      
      page++
    }
    
    // Combine all pages into a single response
    const combinedResponse = {
      ...firstPageData,
      data: allData,
      meta: {
        ...firstPageData.meta,
        pagination: {
          ...pagination,
          page: 1, // Reset to page 1 since we combined all pages
          pageCount: 1, // Now it's a single "page" with all data
          pageSize: allData.length, // Total items
        },
      },
    }
    
    console.log('✅ Strapi API Response (all pages combined):', {
      endpoint,
      totalPages: pageCount,
      totalItems: allData.length,
      dataType: 'array',
    })
    
    return combinedResponse
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

