import { BillingInterval, ApiVersion } from '@shopify/shopify-api'
import { shopifyApp } from '@shopify/shopify-app-express'
import { SQLiteSessionStorage } from '@shopify/shopify-app-session-storage-sqlite'
// import { restResources } from "@shopify/shopify-api/rest/admin/2024-10";
import { DB_PATH, initDatabase } from './database/database.js'

// ! Initialize the database
initDatabase()

// The transactions with Shopify will always be marked as test transactions, unless NODE_ENV is production.
// See the ensureBilling helper to learn more about billing in this template.
const billingConfig = {
  'My Shopify One-Time Charge': {
    // This is an example configuration that would do a one-time charge for $5 (only USD is currently supported)
    amount: 5.0,
    currencyCode: 'USD',
    interval: BillingInterval.OneTime
  }
}

const shopify = shopifyApp({
  api: {
    apiVersion: ApiVersion.July25,
    // restResources, if you need to use REST API @deprecated
    billing: undefined // or replace with billingConfig above to enable example billing
  },
  auth: {
    path: '/api/auth',
    callbackPath: '/api/auth/callback'
  },
  webhooks: {
    path: '/api/webhooks'
  },
  sessionStorage: new SQLiteSessionStorage(DB_PATH) // This should be replaced with your preferred storage strategy
})

export default shopify
