import crypto from 'crypto'
import { ShopifyHeader } from '@shopify/shopify-api'
import { User } from '../models/sqlite/user.js'
import { Webhook } from '../models/sqlite/webhooks.js'

/**
 * @description Validates incoming webhook requests, ensuring they are from Shopify.
 * This function verifies the HMAC signature to authenticate the webhook source.
 * @param {import('express').Request} req Express Request object containing the webhook payload and headers
 * @param {import('express').Response} res Express Response object to send validation results
 * @param {import('express').NextFunction} next Express NextFunction to continue the middleware chain
 */
export function validateWebhookRequest(req, res, next) {
  try {
    console.log('Validating Webhook')
    console.log('Listening to webhook API VERSION:', req.get(ShopifyHeader.ApiVersion))

    const apiSecret = process.env.SHOPIFY_API_SECRET
    if (!apiSecret) {
      console.error('SHOPIFY_API_SECRET is not defined')
      // Send response and terminate
      res.status(401).json({
        succeeded: false,
        message: 'SHOPIFY_API_SECRET is not defined'
      })
      return
    }

    const hmac = req.get(ShopifyHeader.Hmac) // Equal to 'X-Shopify-Hmac-Sha256'
    if (!hmac) {
      console.error('HMAC header missing')
      // Send response and terminate
      res.status(401).json({
        succeeded: false,
        message: 'HMAC header missing'
      })
      return
    }

    const requestBody = req.body // This needs to be the RAW request body

    const generatedHash = crypto
      .createHmac('SHA256', apiSecret)
      .update(requestBody, 'utf8') // 'utf8' is fine if requestBody is a string, Buffer handles itself
      .digest('base64')

    const generatedBuffer = Buffer.from(generatedHash, 'base64')
    const hmacBuffer = Buffer.from(hmac, 'base64')

    // Compare hashes in a timing-safe way
    // Ensure buffers have the same length before comparing to prevent timing attacks on length differences
    const safeCompareResult =
      generatedBuffer.length === hmacBuffer.length &&
      crypto.timingSafeEqual(generatedBuffer, hmacBuffer)

    if (safeCompareResult) {
      console.log('HMAC validation successful')
      next()
    } else {
      console.error('HMAC validation failed: Not Authorized')
      res.status(401).json({
        succeeded: false,
        message: 'Not Authorized'
      })
      // No next() here, response sent.
    }
  } catch (error) {
    console.error('Error validating webhook:', error)
    res.status(401).json({
      succeeded: false,
      message: error instanceof Error ? error.message : 'Error validating webhook'
    })
    // No next() here, response sent.
  }
}

/**
 * @template T - The type of the payload returned from the webhook. See https://shopify.dev/docs/api/webhooks?reference=toml#list-of-topics for more information.
 * @description Processes incoming webhook requests from Shopify. The function performs the following steps:
 *  - Captures the webhook request.
 *  - Parses the raw request body into a JSON object.
 *  - Checks if the webhook has already been processed to prevent duplicate handling.
 *  - Stores the webhook details in the database using the Webhook ID.
 *  - Records the shop that fired the webhook and the timestamp of the event.
 * @param {string} topic - The topic of the webhook event.
 * @param {string} shop - The shop domain from which the webhook originated.
 * @param {ArrayBuffer | string | Buffer} body - The raw body of the webhook request.
 * @param {string} webhookId - The unique identifier for the webhook.
 * @returns {Promise<T | undefined>} - Returns the parsed payload if successful, undefined otherwise.
 * @throws {Error} - Throws an error if the webhook is a duplicate.
 */
export async function processWebhook(topic, shop, body, webhookId) {
  console.log(`************* STARTED ${topic} *************`)
  try {
    const user = await User.read(shop) // Can return undefined if not found
    const existingWebhook = await Webhook.read(webhookId)

    if (existingWebhook) {
      // It's important to still acknowledge the webhook with a 200 OK to Shopify,
      // even if it's a duplicate, to prevent retries. The error here is for internal logging/flow.
      console.warn(`Duplicate webhook received: ${webhookId} for topic ${topic}`)
      throw new Error('Duplicate webhook received')
    }

    await Webhook.create({
      webhook_id: webhookId,
      webhook_topic: topic,
      shop,
      timestamp: new Date().toISOString(), // Standardized timestamp
      processed: false, // Will be marked true in finally
      user_id: user ? user.id : null // Use conditional access
    })

    let payload
    if (body instanceof ArrayBuffer || body instanceof Buffer) {
      const bodyString = Buffer.from(body).toString('utf8')
      payload = JSON.parse(bodyString)
    } else if (typeof body === 'string') {
      payload = JSON.parse(body)
    } else {
      console.error('Invalid body type received for webhook processing:', typeof body)
      throw new Error('Invalid body type received')
    }
    return payload
  } catch (error) {
    console.error('An error occurred during webhook processing:', error.message)
    // Depending on the error, you might want to rethrow or handle differently.
    // If it's a duplicate, we've thrown an error. Other errors are caught here.
    // The function should return undefined in case of processing failure as per new signature.
    return undefined
  } finally {
    // Ensure webhookId is valid before trying to update
    if (webhookId) {
      try {
        await Webhook.update(webhookId, { processed: true })
      } catch (updateError) {
        console.error(`Failed to mark webhook ${webhookId} as processed:`, updateError)
      }
    }
    console.log(`************* ENDED ${topic} *************`)
  }
}
