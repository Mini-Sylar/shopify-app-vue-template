import './assets/main.css'
import { ShopifyAppBridge } from '@/plugins/appBridge.js'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

const app = createApp(App)
app.use(ShopifyAppBridge)
app.use(createPinia())
app.use(router)

app.mount('#app')
