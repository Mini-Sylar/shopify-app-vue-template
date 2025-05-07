import crypto from 'crypto'
import { ShopifyHeader } from '@shopify/shopify-api'
import { Request, Response, NextFunction } from 'express'
import { User } from '../models/sqlite/user.js'
import { Webhook } from '../models/sqlite/webhooks.js'

interface WebhookValidationResponse {
  succeeded: boolean
  message: string
}

type WebhookResponse = Response<WebhookValidationResponse>

/**
 * @description Validates incoming webhook requests, ensuring they are from Shopify.
 * This function verifies the HMAC signature to authenticate the webhook source.
 * @param req Express Request object containing the webhook payload and headers
 * @param res Express Response object to send validation results
 * @param next Express NextFunction to continue the middleware chain
 */
export function validateWebhookRequest(
  req: Request,
  res: WebhookResponse,
  next: NextFunction
): void {
  try {
    console.log('Validating Webhook')
    console.log('Listening to webhook API VERSION:', req.get(ShopifyHeader.ApiVersion))

    const apiSecret = process.env.SHOPIFY_API_SECRET
    if (!apiSecret) {
      res.status(401).json({
        succeeded: false,
        message: 'SHOPIFY_API_SECRET is not defined'
      })
      return
    }

    const hmac = req.get(ShopifyHeader.Hmac)
    if (!hmac) {
      res.status(401).json({
        succeeded: false,
        message: 'HMAC header missing'
      })
      return
    }

    // Generate HMAC hash of the request body
    const generatedHash = crypto
      .createHmac('SHA256', apiSecret)
      .update(req.body, 'utf8')
      .digest('base64')

    // Compare hashes in a timing-safe way
    try {
      const generatedBuffer = Buffer.from(generatedHash, 'base64')
      const hmacBuffer = Buffer.from(hmac, 'base64')

      const safeCompareResult =
        generatedBuffer.length === hmacBuffer.length &&
        crypto.timingSafeEqual(generatedBuffer, hmacBuffer)

      if (safeCompareResult) {
        console.log('HMAC validation successful: Sending 200 OK')
        res.status(200)
        next()
      } else {
        res.status(401).json({
          succeeded: false,
          message: 'Not Authorized'
        })
      }
    } catch (hashError) {
      console.error('Error comparing HMAC hashes:', hashError)
      res.status(401).json({
        succeeded: false,
        message: 'Invalid HMAC format'
      })
    }
  } catch (error) {
    console.error('Error validating webhook:', error)
    res.status(401).json({
      succeeded: false,
      message: error instanceof Error ? error.message : 'Error validating webhook'
    })
  }
}

/**
 * Processes incoming webhook requests from Shopify. This function performs several important steps:
 *
 * 1. Captures and validates the webhook request
 * 2. Parses the raw request body into a typed JSON object
 * 3. Checks for duplicate webhooks to prevent double-processing
 * 4. Records webhook details in the database
 * 5. Associates the webhook with the shop that triggered it
 * 6. Marks the webhook as processed after handling
 *
 * @param topic {string} The webhook topic (e.g., 'PRODUCTS_CREATE')
 * @param shop {string} The shop's myshopify.com domain
 * @param body {ArrayBuffer | string} Raw webhook payload
 * @param webhookId {string} Unique identifier for this webhook event
 * @returns {Promise<T | undefined>} Parsed webhook payload of type T
 *
 * @template T Type of the webhook payload, which will vary by webhook topic
 *
 * @example
 * ```typescript
 * interface ProductCreatePayload {
 *   id: number;
 *   title: string;
 * }
 *
 * const payload = await processWebhook<ProductCreatePayload>(
 *   'PRODUCTS_CREATE',
 *   'my-shop.myshopify.com',
 *   requestBody,
 *   webhookId
 * );
 * ```
 */
export async function processWebhook<T>(
  topic: string,
  shop: string,
  body: ArrayBuffer | string,
  webhookId: string // Changed from number to string to match Shopify's webhook IDs
): Promise<T | undefined> {
  console.log(`************* STARTED ${topic} *************`)
  try {
    const user = await User.read(shop)
    const webhooks = await Webhook.read(webhookId)

    if (webhooks) {
      throw new Error('Duplicate webhook received')
    }

    await Webhook.create({
      webhook_id: webhookId,
      webhook_topic: topic,
      shop,
      timestamp: new Date().toISOString(), // More standardized timestamp format
      processed: false,
      user_id: user?.id ?? null
    })

    let payload: T
    if (body instanceof ArrayBuffer) {
      const bodyString = Buffer.from(body).toString('utf8')
      payload = JSON.parse(bodyString) as T
    } else if (typeof body === 'string') {
      payload = JSON.parse(body) as T
    } else {
      throw new Error('Invalid body type received')
    }

    return payload
  } catch (error) {
    console.error('An error occurred during webhook processing:', error)
    return undefined
  } finally {
    if (webhookId) {
      await Webhook.update(webhookId, { processed: true })
      console.log(`************* ENDED ${topic} *************`)
    }
  }
}
