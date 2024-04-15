import './assets/main.css'
import { ShopifyAppBridge } from '@/plugins/appBridge.js'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createI18n } from 'vue-i18n'

import App from './App.vue'
import router from './router'

import en from './locales/en.json'
import zh from './locales/zh-CN.json'




const i18n = createI18n({
  locale: 'en-US',
  messages: {
    'en-US': en,
    'zh-CN': zh
  },
  fallbackLocale: 'en-US'
})

const app = createApp(App)
app.use(i18n)
app.use(ShopifyAppBridge)
app.use(createPinia())
app.use(router)

app.mount('#app')
