// @ts-check
import { join } from 'path'
import { readFileSync } from 'fs'
import express from 'express'
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
  express.raw({ type: '*/*' }),
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
app.use('/*', shopify.ensureInstalledOnShop(), (_req, res) => {
  res
    .status(200)
    .set('Content-Type', 'text/html')
    .send(
      readFileSync(join(STATIC_PATH, 'index.html'))
        .toString()
        .replace('%VITE_SHOPIFY_API_KEY%', process.env.SHOPIFY_API_KEY || '')
    )
})

app.listen(PORT)
