/**
 * Base interface for all webhook payloads
 */
export interface BaseWebhookPayload {
  shop_domain: string
  shop_id: number
}

/**
 * Payload for customer data request webhook
 */
export interface CustomerDataRequestPayload extends BaseWebhookPayload {
  customer: {
    id: number
    email: string
    phone: string
  }
  orders_requested: boolean
}

/**
 * Payload for shop redaction webhook
 */
export type ShopRedactionPayload = BaseWebhookPayload

/**
 * Payload for customer redaction webhook
 */
export interface CustomerRedactionPayload extends BaseWebhookPayload {
  customer: {
    id: number
    email: string
    phone: string
  }
}

/**
 * Payload for app uninstalled webhook
 */
export type AppUninstalledPayload = BaseWebhookPayload

/**
 * Product related webhook payloads
 */
export interface ProductWebhookPayload extends BaseWebhookPayload {
  id: number
  title: string
  variants: {
    id: number
    title: string
    price: string
    sku: string | null
  }[]
  handle: string
  product_type: string
  status: 'active' | 'archived' | 'draft'
  vendor: string
  created_at: string
  updated_at: string
}

/**
 * Type guard to check if a payload is a product payload
 */
export function isProductPayload(payload: any): payload is ProductWebhookPayload {
  return (
    payload &&
    typeof payload.id === 'number' &&
    typeof payload.title === 'string' &&
    Array.isArray(payload.variants)
  )
}

/**
 * Type guard to check if a payload is a customer data request payload
 */
export function isCustomerDataRequestPayload(payload: any): payload is CustomerDataRequestPayload {
  return (
    payload &&
    typeof payload.customer === 'object' &&
    typeof payload.customer.id === 'number' &&
    typeof payload.customer.email === 'string'
  )
}
