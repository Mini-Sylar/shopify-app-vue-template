import { DeliveryMethod } from '@shopify/shopify-api'
import { type WebhookHandlersParam } from '@shopify/shopify-app-express'
import { processWebhook } from '../utils/webhook-utils.js'
import {
  CustomerDataRequestPayload,
  ShopRedactionPayload,
  CustomerRedactionPayload,
  AppUninstalledPayload,
  ProductWebhookPayload,
  isProductPayload,
  isCustomerDataRequestPayload
} from '../types/webhooks.type.js'

/**
 * Webhook handler implementations for Shopify webhook events.
 * @see https://shopify.dev/docs/api/admin-graphql/unstable/enums/WebhookSubscriptionTopic
 */
const webhookHandlers: WebhookHandlersParam = {
  /**
   * Handler for product creation events
   * Called when a new product is created in the Shopify admin
   */
  PRODUCTS_CREATE: {
    deliveryMethod: DeliveryMethod.Http,
    callbackUrl: '/api/webhooks',
    callback: async (topic: string, shop: string, body: string, webhookId: string) => {
      try {
        const payload = await processWebhook<ProductWebhookPayload>(topic, shop, body, webhookId)
        if (payload && isProductPayload(payload)) {
          console.log(`New product created: ${payload.title} (${payload.id})`)
          // Add any additional product creation handling here
        } else {
          console.error('Invalid product payload received')
        }
      } catch (error) {
        console.error('Error processing product creation webhook:', error)
      }
    }
  },

  /**
   * Handler for customer data request events (GDPR)
   * @see https://shopify.dev/docs/apps/webhooks/configuration/mandatory-webhooks#customers-data_request
   */
  CUSTOMERS_DATA_REQUEST: {
    deliveryMethod: DeliveryMethod.Http,
    callbackUrl: '/api/webhooks',
    callback: async (topic: string, shop: string, body: string, webhookId: string) => {
      try {
        const payload = await processWebhook<CustomerDataRequestPayload>(
          topic,
          shop,
          body,
          webhookId
        )
        if (payload && isCustomerDataRequestPayload(payload)) {
          console.log(`Processing data request for customer: ${payload.customer.email}`)
          // Here you would implement the logic to gather and provide the customer's data
          // This might include order history, preferences, or any other data your app stores
        } else {
          console.error('Invalid customer data request payload received')
        }
      } catch (error) {
        console.error('Error processing customer data request:', error)
      }
    }
  },

  /**
   * Handler for customer data redaction events (GDPR)
   * @see https://shopify.dev/docs/apps/webhooks/configuration/mandatory-webhooks#customers-redact
   */
  CUSTOMERS_REDACT: {
    deliveryMethod: DeliveryMethod.Http,
    callbackUrl: '/api/webhooks',
    callback: async (topic: string, shop: string, body: string, webhookId: string) => {
      try {
        const payload = await processWebhook<CustomerRedactionPayload>(topic, shop, body, webhookId)
        if (payload) {
          console.log(`Processing data redaction for customer: ${payload.customer.email}`)
          // Implement logic to remove or anonymize customer data
          // This should handle all personal data associated with the customer
        } else {
          console.error('Invalid customer redaction payload received')
        }
      } catch (error) {
        console.error('Error processing customer redaction request:', error)
      }
    }
  },

  /**
   * Handler for shop data redaction events (GDPR)
   * Called 48 hours after app uninstallation
   * @see https://shopify.dev/docs/apps/webhooks/configuration/mandatory-webhooks#shop-redact
   */
  SHOP_REDACT: {
    deliveryMethod: DeliveryMethod.Http,
    callbackUrl: '/api/webhooks',
    callback: async (topic: string, shop: string, body: string, webhookId: string) => {
      try {
        const payload = await processWebhook<ShopRedactionPayload>(topic, shop, body, webhookId)
        if (payload) {
          console.log(`Processing shop data redaction for: ${payload.shop_domain}`)
          // Implement logic to remove or anonymize shop data
          // This should handle all data associated with the shop
        } else {
          console.error('Invalid shop redaction payload received')
        }
      } catch (error) {
        console.error('Error processing shop redaction:', error)
      }
    }
  },

  /**
   * Handler for app uninstallation events
   * Called when a merchant uninstalls the app
   */
  APP_UNINSTALLED: {
    deliveryMethod: DeliveryMethod.Http,
    callbackUrl: '/api/webhooks',
    callback: async (topic: string, shop: string, body: string, webhookId: string) => {
      try {
        const payload = await processWebhook<AppUninstalledPayload>(topic, shop, body, webhookId)
        if (payload) {
          console.log(`Processing app uninstallation for: ${payload.shop_domain}`)
          // Implement cleanup logic for when the app is uninstalled
          // This might include:
          // - Cleaning up any ongoing processes for this shop
          // - Marking the installation as inactive in your database
          // - Scheduling data cleanup (respecting GDPR requirements)
        } else {
          console.error('Invalid app uninstalled payload received')
        }
      } catch (error) {
        console.error('Error processing app uninstallation:', error)
      }
    }
  }
}

export default webhookHandlers
