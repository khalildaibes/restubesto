import { NextRequest, NextResponse } from 'next/server'
import { fetchFromStrapi } from '@/lib/strapi'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

/**
 * GET /api/admin/orders/[id] - Get single order
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Orders are not i18n enabled, so skip locale parameter
    const data = await fetchFromStrapi(`/orders/${params.id}`, {
      cache: 'no-store',
    }, {}, true) // skipLocale = true for orders
    
    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    console.error('Error fetching order:', error)
    return NextResponse.json(
      { error: 'Failed to fetch order', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/admin/orders/[id] - Update order
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    
    // Remove id and other fields that shouldn't be in the update body
    const { id, createdAt, updatedAt, publishedAt: bodyPublishedAt, ...updateFields } = body
    
    // Try to fetch the order first to get the correct documentId
    // The params.id might be the entry id, but we need documentId for updates
    let documentId = params.id
    try {
      console.log('🔍 Attempting to fetch order with ID:', params.id)
      const existingDoc = await fetchFromStrapi(`/orders/${params.id}`, {
        cache: 'no-store',
      }, {}, true) // skipLocale = true for orders
      
      console.log('✅ Order fetch response:', {
        hasData: !!existingDoc.data,
        dataType: typeof existingDoc.data,
        isArray: Array.isArray(existingDoc.data),
        dataKeys: existingDoc.data ? Object.keys(existingDoc.data) : [],
      })
      
      // Check if response has data array or single data object
      const orderData = existingDoc.data || (Array.isArray(existingDoc.data) ? existingDoc.data[0] : null)
      
      // Use documentId if available (Strapi v5), otherwise use id
      if (orderData) {
        documentId = orderData.documentId || orderData.id || params.id
        console.log('📋 Order ID resolution:', {
          providedId: params.id,
          documentId: orderData.documentId,
          entryId: orderData.id,
          usingId: documentId,
        })
      } else {
        // If single order fetch fails, try fetching all orders to find the one with matching ID
        console.log('⚠️ Order data not found, trying to fetch all orders to find matching ID...')
        const allOrders = await fetchFromStrapi('/orders', {
          cache: 'no-store',
        }, { 'sort': 'createdAt:desc' }, true)
        
        if (allOrders.data && Array.isArray(allOrders.data)) {
          const matchingOrder = allOrders.data.find((order: any) => 
            String(order.id) === params.id || String(order.documentId) === params.id
          )
          
          if (matchingOrder) {
            documentId = matchingOrder.documentId || matchingOrder.id || params.id
            console.log('✅ Found matching order in list:', {
              providedId: params.id,
              foundId: matchingOrder.id,
              foundDocumentId: matchingOrder.documentId,
              usingId: documentId,
            })
          } else {
            console.warn('❌ Order not found in list. Available IDs:', 
              allOrders.data.map((o: any) => ({ id: o.id, documentId: o.documentId }))
            )
          }
        }
      }
    } catch (fetchError) {
      // If fetch fails, try fetching all orders to find the correct one
      console.warn('⚠️ Could not fetch order by ID, trying to fetch all orders...', params.id)
      try {
        const allOrders = await fetchFromStrapi('/orders', {
          cache: 'no-store',
        }, { 'sort': 'createdAt:desc' }, true)
        
        if (allOrders.data && Array.isArray(allOrders.data)) {
          const matchingOrder = allOrders.data.find((order: any) => 
            String(order.id) === params.id || String(order.documentId) === params.id
          )
          
          if (matchingOrder) {
            documentId = matchingOrder.documentId || matchingOrder.id || params.id
            console.log('✅ Found matching order in list:', {
              providedId: params.id,
              foundId: matchingOrder.id,
              foundDocumentId: matchingOrder.documentId,
              usingId: documentId,
            })
          }
        }
      } catch (listError) {
        console.error('❌ Could not fetch orders list:', listError)
      }
    }
    
    const orderData = {
      ...updateFields,
      publishedAt: bodyPublishedAt || new Date().toISOString(),
    }

    // Orders are not i18n enabled, so skip locale parameter
    const data = await fetchFromStrapi(`/orders/${documentId}`, {
      method: 'PUT',
      body: JSON.stringify({ data: orderData }),
    }, {}, true) // skipLocale = true for orders
    
    return NextResponse.json(
      { 
        success: true, 
        order: data.data,
        message: 'Order updated successfully' 
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error updating order:', error)
    return NextResponse.json(
      { 
        error: 'Failed to update order', 
        message: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/admin/orders/[id] - Delete order
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Orders are not i18n enabled, so skip locale parameter
    await fetchFromStrapi(`/orders/${params.id}`, {
      method: 'DELETE',
    }, {}, true) // skipLocale = true for orders
    
    return NextResponse.json(
      { 
        success: true,
        message: 'Order deleted successfully' 
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error deleting order:', error)
    return NextResponse.json(
      { 
        error: 'Failed to delete order', 
        message: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    )
  }
}

