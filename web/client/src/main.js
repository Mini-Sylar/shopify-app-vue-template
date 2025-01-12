import './assets/main.css'
import { ShopifyAppBridge } from '@/plugins/appBridge.js'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { i18n } from './i18n'

import App from './App.vue'
import router from './router'

const app = createApp(App)
app.use(ShopifyAppBridge)
app.use(i18n)
app.use(createPinia())
app.use(router)
app.mount('#app')
