# frontend

Frontend for shopify-app-vue-template. Dependencies are automatically installed when you run `npm run dev` from the root directory.

## Installed Dependencies

- Vue Router
- Pinia
- Vue i18n

## Project Structure

```
├─ client
     ├─ .gitignore
     ├─ index.html
     ├─ package-lock.json
     ├─ package.json
     ├─ public
     │  └─ favicon.ico
     ├─ README.md
     ├─ shopify.web.toml
     ├─ src
     │  ├─ App.vue
     │  ├─ assets
     │  │  ├─ base.css
     │  │  ├─ images
     │  │  │  └─ home-trophy-vue.png
     │  │  └─ main.css
     │  ├─ components
     │  │  ├─ About
     │  │  │  └─ TheAbout.vue
     │  │  ├─ Home
     │  │  │  └─ TheHome.vue
     │  │  └─ NavBar
     │  │     ├─ LanguageSwitcher.vue
     │  │     └─ WelcomeNavBar.vue
     │  ├─ services
     │  │  └─ useAuthenticatedFetch.js
     │  ├─ i18n.js
     │  ├─ locales
     │  │  ├─ en.json
     │  │  └─ zh.json
     │  ├─ main.js
     │  ├─ plugins
     │  │  └─ appBridge.js
     │  ├─ router
     │  │  └─ index.js
     │  ├─ stores
     │  │  └─ products.js
     │  └─ views
     │     ├─ AboutView.vue
     │     ├─ ExitIframeView.vue
     │     ├─ HomeView.vue
     │     └─ NotFoundView.vue
     └─ vite.config.js

```
