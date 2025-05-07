import { Session } from '@shopify/shopify-api'
import { ApiVersion } from '@shopify/shopify-api'

export interface User {
  id: number
  shop: string
}

export interface Webhook {
  id: number
  webhook_id: string // Changed from number to string
  webhook_topic: string
  shop: string
  timestamp: string
  processed: boolean
  user_id: number | null
}

export interface ProductsCountData {
  productsCount: {
    count: number
  }
}

export interface CreateProductsResponse {
  success: boolean
  error?: string
}

// Webhooks API has been moved in Shopify API 6.0
import { WebhookHandlersParam } from '@shopify/shopify-app-express'
export type { WebhookHandlersParam }
