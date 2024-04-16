# Shopify App Template Using Vue 🟢

![Screenshot](https://drive.google.com/uc?id=1VKbiGd09QJ9c_TjpffQ5zasqxVLzqfgc)

A template for building Shopify apps using Vue.js as the frontend. It is based on the [Shopify App Node](https://github.com/Shopify/shopify-app-template-node) template.

## Table of Contents

- [Getting Started](#getting-started)
- [What is included?](#what-is-included)
- [Internationlization](#internationlization)
- [Update Guide](#update-guide-v10x-to-v11x)
- [What next?](#what-next)
- [Screenshots](#screenshots)
- [App Submission](#app-submission)
- [License](#license)

## Updating Older Versions

See [UPDATE GUIDE](#update-guide-v10x-to-v11x) for updating from older versions of the template.
Prefer to use GraphQL API for interacting with Shopify. See [Migrating From REST to GraphQL](https://shopify.dev/docs/api/admin/migrate)

## Getting Started

1. Clone this repository
2. Run `npm install` in the root directory
3. Run `npm run dev -- --reset` to start the configure your app (Initial setup only!)
4. Run `npm run dev` to start the app (Subsequent runs)

## What is included?

### Vue 💚

- [Vue.js 3.4](https://vuejs.org/)
- [Vue Router 4](https://router.vuejs.org/) for single page app routing
- [Vue i18n](https://vue-i18n.intlify.dev/) for app localization
- [Pinia](https://pinia.esm.dev/) for state management
- [EsLint](https://eslint.org/) for static code analysis
- [Prettier](https://prettier.io/) for code formatting

<br>

## Internationalization 🌍🆕

### Adding a new translation

- Use `Vue i18n` for app localization. To add a new language, create a new json file in the [`Locales Folder`](./web/frontend/src/locales/) folder and add the translations. See [i18n.js](./web/frontend/src/i18n.js) for setup.

- All translatiion files are lazily loaded, meaning only the translations for the current language are loaded.

- Default language is what is returned by shopify reading the `locale` query parameter. If not set, it fallbacks to `en`.

- Vue Router will embed the language in the URL, e.g `localhost:3000/en` or `localhost:3000/zh/about`

- The template has been localized, see [Locales Folder](./web/frontend/src/locales/) folder. Translations may not be 100% accurate so pull requests are welcome.

<hr>

### Shopify 🛍

- `AppBridge` Plugin for Vue to use [Shopify App Bridge](https://shopify.dev/tools/app-bridge) actions and components
- `useAuthenticatedFetch` to make authenticated requests to the Shopify API and your backend.
- `App embedding` - Template is setup to embed your app in the Shopify admin.

<br>

### Storage 💽

Uses SQLite as the db, same as the template see [the supported databases](https://github.com/Shopify/shopify-app-template-node#application-storage).

To use one of these, you need to change your session storage configuration. To help, here’s a list of SessionStorage adapter packages. [Storage Drivers](https://github.com/Shopify/shopify-api-js/blob/main/docs/guides/session-storage.md)

<br>

### Deployment 🚀

- See [Deploying shopify apps](https://github.com/Shopify/shopify-app-template-node#deployment)

<br>
<hr>

## What next?

Here are some useful links to get you started:

- [Build An Example App](https://shopify.dev/docs/apps/getting-started/build-app-example)
- [Shopify App Readme](https://github.com/Shopify/shopify-app-template-node#shopify-app-template---node)

- [Vue.js](https://vuejs.org/guide/quick-start.html)
- [Pinia](https://pinia.vuejs.org/introduction.html)
- [Vue Router](https://router.vuejs.org/guide/#html)

## Screenshots

![Screenshot-en](https://drive.google.com/file/d/1p32XhaiVRQ9eSAmNQ1Hk2T-V5hmb9CFa/view?usp=sharing)

![Screenshot-zh](https://drive.google.com/file/d/1yCr3lc3yqzgyV3ZiTSJjlIEVPtNY27LX/view?usp=sharing)

## App Submission

Built an app using this template? Submit it here [App submission url](https://forms.gle/K8VGCqvcvfBRSug58)

# UPDATE Guide (v.1.0.x to v.1.1.x)

It seems Shopify has decided to fully deprecate the React Template. It's no longer available in the Shopify CLI. Meaning we no longer have to match the React template version.

As at `April 2024` Shopify has also deprecated a lot of the old APIs, Sadly, ProductCreate was also affected

It is now recommended to use `Shopify GraphQL API` for interacting with Shopify. See [Migrating From REST to GraphQL](https://shopify.dev/docs/api/admin/migrate)

To update your app to the latest version of the template, follow the steps below:

## 1. Update Dependencies

HINT: You can you use [npm-check-updates
](https://www.npmjs.com/package/npm-check-updates) to speed this up

- Update the shopify app and cli to the latest version in [Root package.json](package.json)

```JSON
"dependencies": {
    "@shopify/app": "^3.58.2",
    "@shopify/cli": "^3.58.2"
  }
```

- Update dependencies in web folder [web/package.json](web/package.json)

```JSON
 "dependencies": {
    "@shopify/shopify-app-express": "^4.1.4",
    "@shopify/shopify-app-session-storage-sqlite": "^3.0.3",
    "compression": "^1.7.4",
    "cross-env": "^7.0.3",
    "serve-static": "^1.15.0"
  },
  "devDependencies": {
    "nodemon": "^3.1.0",
    "prettier": "^3.2.5",
    "pretty-quick": "^4.0.0"
  }
```

- Optional: Update dependencies in `web/frontend` folder [web/frontend/package.json](web/frontend/package.json)

```JSON
"dependencies": {
    "@shopify/app-bridge": "^3.7.10",
    "pinia": "^2.1.7",
    "vue": "^3.4.21",
    "vue-router": "^4.3.0"
  },
  "devDependencies": {
    "@rushstack/eslint-patch": "^1.10.1",
    "@vitejs/plugin-vue": "^5.0.4",
    "@vue/eslint-config-prettier": "^9.0.0",
    "eslint": "^9.0.0",
    "eslint-plugin-vue": "^9.24.1",
    "prettier": "^3.2.5",
    "vite": "^5.2.8"
  }
```

## 2. Update Imports

- In [Shopify.js](./web/shopify.js) update the import to use the new `shopify` APis

```JS
// other imports
import { SQLiteSessionStorage } from "@shopify/shopify-app-session-storage-sqlite";
import { restResources } from "@shopify/shopify-api/rest/admin/2024-04";
```

### 3. Optional

If using the `ProductCreate` mutation, See [Migrating From REST to GraphQL](https://shopify.dev/docs/api/admin/migrate) for the new way to create products, there's an example in [PRODUCTCREATE](./web/product-creator.js)
