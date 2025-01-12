import crypto from 'crypto'
import { ShopifyHeader } from '@shopify/shopify-api'
import { User } from '../models/sqlite/user.js'
import { Webhook } from '../models/sqlite/webhooks.js'

/**
 * @description Validates incoming webhook requests, ensuring they are from Shopify.
 * @success 200 OK is sent if the request is valid.
 * @error 401 Unauthorized otherwise.
 */
export function validateWebhookRequest(req, res, next) {
  try {
    console.log('Validating Webhook')
    console.log('Listening to webhook API VERSION:', req.get(ShopifyHeader.ApiVersion))
    const generatedHash = crypto
      .createHmac('SHA256', process.env.SHOPIFY_API_SECRET)
      .update(req.body, 'utf8')
      .digest('base64')
    const hmac = req.get(ShopifyHeader.Hmac) // Equal to 'X-Shopify-Hmac-Sha256' at the time of coding

    const generatedBuffer = Buffer.from(generatedHash, 'base64')
    const hmacBuffer = Buffer.from(hmac, 'base64')

    const safeCompareResult = crypto.timingSafeEqual(generatedBuffer, hmacBuffer)
    if (safeCompareResult) {
      console.log('HMAC validation successful: Sending 200 OK')
      res.status(200)
      next()
    } else {
      return res.status(401).json({ succeeded: false, message: 'Not Authorized' }).send()
    }
  } catch (error) {
    console.log(error)
    return res.status(401).json({ succeeded: false, message: 'Error caught' }).send()
  }
}

/**
 * @template T - The payload returned from the webhook. See https://shopify.dev/docs/api/webhooks?reference=toml#list-of-topics for more information.
 * @description Processes incoming webhook requests from Shopify. The function performs the following steps:
 *  - Captures the webhook request.
 *  - Parses the raw request body into a JSON object.
 *  - Checks if the webhook has already been processed to prevent duplicate handling.
 *  - Stores the webhook details in the database using the Webhook ID.
 *  - Records the shop that fired the webhook and the timestamp of the event.
 * @param {string} topic - The topic of the webhook event.
 * @param {string} shop - The shop domain from which the webhook originated.
 * @param {ArrayBuffer} body - The raw body of the webhook request.
 * @param {string} webhookId - The unique identifier for the webhook.
 * @returns {Promise<T>} - Returns the parsed payload if successful.
 * @throws {Error} - Throws an error if the webhook is a duplicate or if any processing error occurs.
 */
export async function processWebhook(topic, shop, body, webhookId) {
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
      timestamp: Date.now(),
      processed: false,
      user_id: user === undefined ? null : user.id
    })
    const bodyString = body.toString('utf8')
    const payload = JSON.parse(bodyString)
    return payload
  } catch (error) {
    console.error('An error occurred during webhook processing:', error)
    return
  } finally {
    await Webhook.update(webhookId, { processed: true })
    console.log(`************* ENDED ${topic} *************`)
  }
}
