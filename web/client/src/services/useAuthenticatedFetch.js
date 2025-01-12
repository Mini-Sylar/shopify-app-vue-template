import { authenticatedFetch } from '@shopify/app-bridge/utilities'
import { Redirect } from '@shopify/app-bridge/actions'
import { initAppBridge } from '../plugins/appBridge'
import { i18n } from '@/i18n'

/**
 * @template T
 * @typedef {Response & { json: () => Promise<T> }} ShopifyResponse
 */

/**
 * @param {Object} config
 * @param {boolean} config.enableI18nInHeaders
 * @param {HeadersInit} config.headers
 * @returns {(uri: string, options?: RequestInit) => Promise<ShopifyResponse<T>>}
 */
export function useAuthenticatedFetch(config = { enableI18nInHeaders: true, headers: {} }) {
  const app = initAppBridge()
  const fetchFunction = authenticatedFetch(app)
  /**
   * @template T
   * @param {string} uri
   * @param {RequestInit} [options]
   * @returns {Promise<ShopifyResponse<T>>}
   * @throws {Error}
   */
  return async (uri, options = {}) => {
    const headers = new Headers({ ...config.headers, ...options.headers })

    if (config.enableI18nInHeaders) {
      const newLocale = i18n.global.locale.value
      const browserLocales = navigator.languages.join(', ') // Get the browser's preferred languages
      const updatedAcceptLanguage = `${newLocale}, ${browserLocales}`

      headers.set('Accept-Language', updatedAcceptLanguage)
    }

    const response = await fetchFunction(uri, { ...options, headers })
    checkHeadersForReauthorization(response.headers, app)
    return response
  }
}

/**
 * Checks headers for reauthorization and redirects if necessary.
 * @param {Headers} headers
 * @param {any} app
 */
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
