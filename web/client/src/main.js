// import './plugins/shopify-shop-param.js'

// --- Shopify shop param persistence logic ---
function getQueryParam(name) {
  const url = new URL(window.location.href)
  return url.searchParams.get(name)
}

function setQueryParam(name, value) {
  const url = new URL(window.location.href)
  url.searchParams.set(name, value)
  window.location.replace(url.toString())
}

const shopParam = getQueryParam('shop')
if (shopParam) {
  localStorage.setItem('shop', shopParam)
} else {
  const storedShop = localStorage.getItem('shop')
  if (storedShop) {
    setQueryParam('shop', storedShop)
    // The page will reload with the shop param, so stop further execution
    throw new Error('Reloading with shop param')
  }
}

import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { i18n } from './i18n'

import App from './App.vue'
import router from './router'

const app = createApp(App)
app.use(i18n)
app.use(createPinia())
app.use(router)
app.mount('#app')
