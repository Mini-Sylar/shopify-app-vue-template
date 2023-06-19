import { createApp } from '@shopify/app-bridge'

const host = new URLSearchParams(location.search).get('host') || window.__SHOPIFY_DEV_HOST

window.__SHOPIFY_DEV_HOST = host

export const shopifyAppBridgePlugin = {
  install: (app) => {
    const appBridge = createApp({
      apiKey: process.env.SHOPIFY_API_KEY,
      host: host,
      forceRedirect: true
    })

    app.config.globalProperties.$appBridge = appBridge
    app.provide('useAppBridge', appBridge)
  }
}
