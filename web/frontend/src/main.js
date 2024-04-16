import './assets/main.css'
import { ShopifyAppBridge } from '@/plugins/appBridge.js'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { setupI18n } from './i18n'

import App from './App.vue'
import router from './router'

import en from './locales/en.json'
import zh from './locales/zh.json'

export const i18n = setupI18n({
  locale: new URLSearchParams(window.location.search).get('locale') || 'en',
  messages: {
    en,
    zh
  },
  fallbackLocale: 'en'
})

const app = createApp(App)

// app.use(ShopifyAppBridge)
app.use(i18n)
app.use(createPinia())
app.use(router)

app.mount('#app')
