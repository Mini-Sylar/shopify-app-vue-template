import './assets/main.css'
import { ShopifyAppBridge } from '@/plugins/appBridge.js'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createI18n } from 'vue-i18n'

import App from './App.vue'
import router from './router'

import en from './locales/en.json'

const i18n = createI18n({
  locale: 'en',
  messages: {
    en
  },
  fallbackLocale: 'en'
})

const app = createApp(App)
app.use(i18n)
app.use(ShopifyAppBridge)
app.use(createPinia())
app.use(router)

app.mount('#app')
