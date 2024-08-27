# Shopify App Template Using Vue 🟢

[![MadeWithVueJs.com shield](https://madewithvuejs.com/storage/repo-shields/4969-shield.svg)](https://madewithvuejs.com/p/shopify-vue-app-template/shield-link)

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

> [!NOTE]
> Since `@shopify/cli: ^3.59` the `@shopify/app` is bundled with the CLI. You can safely remove the `@shopify/app` dependency from the root `package.json` file.
> this is reflected in `shopify-app-vue-template > v1.2.3`
> you should no longer see npm warnings

Prefer to use GraphQL API for interacting with Shopify. See [Migrating From REST to GraphQL](https://shopify.dev/docs/api/admin/migrate)

## Getting Started

1. Clone this repository or `npx degit Mini-Sylar/shopify-app-vue-template your-app-name`
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

![Screenshot](https://drive.google.com/uc?id=1p32XhaiVRQ9eSAmNQ1Hk2T-V5hmb9CFa)

![Screenshot](https://drive.google.com/uc?id=1yCr3lc3yqzgyV3ZiTSJjlIEVPtNY27LX)

## App Submission

Built an app using this template? Submit it here [App submission url](https://forms.gle/K8VGCqvcvfBRSug58)
