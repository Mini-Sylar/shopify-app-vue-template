import { authenticatedFetch } from '@shopify/app-bridge/utilities'
import { createApp } from '@shopify/app-bridge'
import { Redirect } from '@shopify/app-bridge/actions'

export function useAuthenticatedFetchVue() {
  const host = new URLSearchParams(location.search).get('host') || window.__SHOPIFY_DEV_HOST

  window.__SHOPIFY_DEV_HOST = host
  const appBridge = createApp({
    apiKey: process.env.SHOPIFY_API_KEY,
    host: host,
    forceRedirect: true
  })
  const app = appBridge
  const fetchFunction = authenticatedFetch(app)

  return async (uri, options) => {
    const response = await fetchFunction(uri, options)
    checkHeadersForReauthorization(response.headers, app)
    return response
  }
}

function checkHeadersForReauthorization(headers, app) {
  if (headers.get('X-Shopify-API-Request-Failure-Reauthorize') === '1') {
    const authUrlHeader =
      headers.get('X-Shopify-API-Request-Failure-Reauthorize-Url') || `/api/auth`
    const redirect = Redirect.create(app)
    redirect.dispatch(
      Redirect.Action.REMOTE,
      authUrlHeader.startsWith('/')
        ? `https://${window.location.host}${authUrlHeader}`
        : authUrlHeader
    )
  }
}
