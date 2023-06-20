# Shopify App Template Using Vue

This is a template for building Shopify apps using Vue.js as the frontend. It is based on the [Shopify App Node](https://github.com/Shopify/shopify-app-template-node) template. If you would like to use React instead, check out [Creating a shopify app](https://shopify.dev/docs/apps/getting-started/create)

## Getting Started

1. Clone this repository
2. Run `npm install` in the root directory
3. Run `npm run dev -- --reset` to start the configure your app (Initial setup only!)
4. Run `npm run dev` to start the app (Subsequent runs)

## What is included?

### Vue 💚

- [Vue.js 3.3](https://vuejs.org/)
- [Vue Router 4](https://router.vuejs.org/) for single page app routing
- [Pinia](https://pinia.esm.dev/) for state management
- [EsLint](https://eslint.org/) for linting

### Shopify 🛍

- `AppBridge` Plugin for Vue to use [Shopify App Bridge](https://shopify.dev/tools/app-bridge) actions and components
- `vueAuthenticatedFetch` to make authenticated requests to the Shopify API and your backend.
- App embedding

## What is not included?

### Polaris Components

You can always access certain polaris components using the `appBridge` but if you want to use the full suite of components, you can use [Shopify Polaris Vue](https://github.com/ownego/polaris-vue). Install this in the `frontend` directory and follow the instructions in the README.

## What next?

Here are some useful links to get you started:

- [Build An Example App](https://shopify.dev/docs/apps/getting-started/build-app-example)
- [Shopify App Readme](https://github.com/Shopify/shopify-app-template-node#shopify-app-template---node)

- [Vue.js](https://vuejs.org/guide/quick-start.html)
- [Pinia](https://pinia.vuejs.org/introduction.html)
- [Vue Router](https://router.vuejs.org/guide/#html)


## Screenshots
![Screenshot](https://drive.google.com/uc?id=1775c1Bnkow-5w4gEjtGREMoi_xN31t10)
