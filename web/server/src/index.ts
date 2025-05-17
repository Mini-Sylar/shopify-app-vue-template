import { join } from 'path'
import { readFileSync } from 'fs'
import express, { Request, Response } from 'express'
import serveStatic from 'serve-static'
import shopify from './shopify.js'
import WebhookHandlers from './webhooks/webhooks.js'
import productsRoutes from './routes/products.js'
import { validateWebhookRequest } from './utils/webhook-utils.js'
import { registerUser } from './middlewares/user-middleware.js'

const PORT = parseInt(process.env.BACKEND_PORT || process.env.PORT || '3000', 10)

const STATIC_PATH =
  process.env.NODE_ENV === 'production'
    ? `${process.cwd()}/client/dist`
    : `${process.cwd()}/../client/`

const app = express()
app.use(express.raw({ type: 'application/json' }))

// Set up Shopify authentication and webhook handling
app.get(shopify.config.auth.path, shopify.auth.begin())
app.get(
  shopify.config.auth.callbackPath,
  shopify.auth.callback(),
  registerUser,
  shopify.redirectToShopifyOrAppRoot()
)
app.post(
  shopify.config.webhooks.path,
  validateWebhookRequest,
  shopify.processWebhooks({ webhookHandlers: WebhookHandlers })
)

// If you are adding routes outside of the /api path, remember to
// also add a proxy rule for them in web/client/vite.config.js
app.use('/api/*', shopify.validateAuthenticatedSession())
app.use(express.json())
app.use('/api/products', productsRoutes)
app.use(shopify.cspHeaders())
app.use(serveStatic(STATIC_PATH, { index: false }))
app.use('/*', shopify.ensureInstalledOnShop(), (_req: Request, res: Response) => {
  // Read the HTML file
  let htmlContent = readFileSync(join(STATIC_PATH, 'index.html'), 'utf8')

  if (process.env.NODE_ENV !== 'production') {
    const apiKey = process.env.SHOPIFY_API_KEY || ''
    console.log(`[Dev Server] Injecting Shopify API Key: ${apiKey}`)
    const shopifyTags = `
  <meta name="shopify-api-key" content="${apiKey}" />
  <script src="https://cdn.shopify.com/shopifycloud/app-bridge.js"></script>`
    htmlContent = htmlContent.replace('</head>', `${shopifyTags}\n</head>`)
  }

  res.status(200).set('Content-Type', 'text/html').send(htmlContent)
})
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
