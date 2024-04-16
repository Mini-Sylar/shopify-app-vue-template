// @ts-nocheck


import { createApp } from '@shopify/app-bridge'
export const initAppBridge = () => {
  const host = new URLSearchParams(location.search).get('host') || window.__SHOPIFY_DEV_HOST
  window.__SHOPIFY_DEV_HOST = host
  return createApp({
    // eslint-disable-next-line no-undef
    apiKey: process.env.SHOPIFY_API_KEY || '',
    host: host,
    forceRedirect: true
  })
}

export const ShopifyAppBridge = {
  /**
   * @param {import('vue').App} app
   */
  install: (app) => {
    const useAppBridge = initAppBridge()
    app.config.globalProperties.$useAppBridge = useAppBridge
    app.provide('useAppBridge', useAppBridge)
  }
}
