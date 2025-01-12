# Shopify App Template Using Vue v.2 🟢

[![MadeWithVueJs.com shield](https://madewithvuejs.com/storage/repo-shields/4969-shield.svg)](https://madewithvuejs.com/p/shopify-vue-app-template/shield-link)

![Screenshot](https://drive.google.com/uc?id=1VKbiGd09QJ9c_TjpffQ5zasqxVLzqfgc)

A template for building Shopify apps using Vue.js as the frontend. It is based on the [Shopify App Node](https://github.com/Shopify/shopify-app-template-node) template.

---

## Table of Contents

1. [Getting Started](#getting-started)
2. [What is Included?](#what-is-included)
3. [Internationalization](#internationalization)
4. [New Features in v.2.0](#new-features-in-v20)
5. [FAQ](#faq)
6. [Screenshots](#screenshots)
7. [App Submission](#app-submission)
8. [License](#license)

---

## Getting Started

1. Clone this repository or `npx degit Mini-Sylar/shopify-app-vue-template your-app-name`
2. Run `npm install` in the root directory
3. Run `npm run dev:reset` to configure your app (Initial setup only!)
4. Run `npm run dev` to start the app (Subsequent runs)
5. See `package.json` for other scripts

---

## What is Included?

### Vue Starter 💚

- [Vue.js 3.5](https://vuejs.org/)
- [Vue Router 4](https://router.vuejs.org/) for single-page app routing
- [Vue i18n](https://vue-i18n.intlify.dev/) for app localization
- [Pinia](https://pinia.esm.dev/) for state management

---

## Internationalization 🌍

### Adding a New Translation

- Use `Vue i18n` for app localization. To add a new language, create a new JSON file in the [`Locales Folder`](./web/frontend/src/locales/) and add the translations. See [i18n.js](./web/frontend/src/i18n.js) for setup.
- All translation files are lazily loaded, meaning only the translations for the current language are loaded.
- The default language is what Shopify returns via the `locale` query parameter. If not set, it falls back to `en`.
- Vue Router embeds the language in the URL, e.g., `localhost:3000/en` or `localhost:3000/zh/about`.
- The template has been localized. See the [`Locales Folder`](./web/frontend/src/locales/) folder. Translations may not be 100% accurate, so pull requests are welcome.

---

## New Features in v.2.0

### Folder Structure

#### Updated Structure:
```
root/
├── client/                 # Frontend Vue app
├── server/                 # Backend Node.js app
│   ├── database/           # DB configuration (default: SQLite)
│   ├── middleware/         # Middleware for user capture
│   ├── models/             # Models for User and Webhook
│   ├── routes/             # Default product routes
│   ├── services/           # Shopify product creator
│   ├── utils/              # Utilities (locale, webhook processing)
│   ├── webhook/            # Webhook handlers (GDPR compliance included)
│   ├── index.js            # Entry point
│   └── shopify.js          # Shopify configuration
```

- **Prettier** and **ESLint** configurations are now project-wide.
- ESLint updated to use the new flat config.

---

### Shortcut Commands

| Command                 | Description                                                             |
|-------------------------|-------------------------------------------------------------------------|
| `npm run shopify`       | Run Shopify CLI commands                                               |
| `npm run build`         | Build the project (frontend and backend)                              |
| `npm run dev`           | Start the development server                                           |
| `npm run dev:reset`     | Reset Shopify configuration                                            |
| `npm run dev:webhook`   | Trigger a webhook. Use `<domain>/api/webhooks` when asked for a domain |
| `npm run info`          | Display info about the Shopify app                                    |
| `npm run generate`      | Generate a theme extension                                            |
| `npm run deploy`        | Deploy the app                                                        |
| `npm run show:env`      | Show environment variables for production deployment                  |
| `npm run lint`          | Run ESLint on the entire project                                      |
| `npm run lint:server`   | Run ESLint on the server only                                         |
| `npm run lint:client`   | Run ESLint on the client only                                         |
| `npm run format:server` | Run Prettier formatting on the server                                 |
| `npm run format:client` | Run Prettier formatting on the client                                 |
| `npm run client:install`| Install client dependencies                                           |
| `npm run client:uninstall`| Uninstall client dependencies                                       |
| `npm run server:install`| Install server dependencies                                           |
| `npm run server:uninstall`| Uninstall server dependencies                                       |

---

### Backend Updates

- **GraphQL:** Removed REST resources in favor of GraphQL, as REST will soon be deprecated.
- **New Models:**
  - **User Model:** Created when a user installs the app.
  - **Webhook Model:** Tracks fired webhooks to prevent duplication.
- **Webhook Processing:**
  - Verification and processing utilities added (new in v.2).
- **Bug Fix:** Fixed an issue with the product creator service.

---

### Frontend Updates

- Renamed `helpers` folder to `services`.
- Updated `useAuthenticatedFetch`:
  - Now accepts custom headers in a config object.
  - Includes `enableI18nInHeaders` to pass the user's locale (true by default).
  - Locale can be read using the `getLocalePreferencesFromRequest` function in `utils.js` (server).

---

### Deployment Enhancements

- Updated **Dockerfile** for simpler deployment.
  - Tested on Render.com.
- Added example `shopify.app.example.toml` configuration file.
  - Allows multiple configurations (e.g., `shopify.app.staging.toml`).
  - Production configurations should not be committed to avoid exposing sensitive information.

---

## FAQ

<details>
<summary>How do I deploy this app?</summary>

#### Using My Own Server (Linux VPS/Render.com/Heroku)
1. Set up your domain, e.g., `https://shopify-vue.minisylar.com`.
2. Run `npm run show:env` to retrieve environment variables:

```
SHOPIFY_API_KEY=<YOUR_KEY>
SHOPIFY_API_SECRET=<YOUR_SECRET>
SCOPES="write_products,read_products"
HOST=https://shopify-vue.minisylar.com
```

#### Using Dockerfile
- Add the variables in the environment section of your hosting service (e.g., Render).
- Build and deploy the Dockerfile.
- For manual deployment:

```bash
docker build --build-arg SHOPIFY_API_KEY=<your_api_key> --build-arg SHOPIFY_API_SECRET=<your_api_secret> \
--build-arg SCOPES=<your_scopes> --build-arg HOST=<your_host> -t <image_name>:<tag> .
```

> **Note:** Omit `<` and `>` when providing values. Store secrets securely if using CI/CD pipelines.

</details>

<details>
<summary>How do I use MySQL or PostgreSQL for production?</summary>

#### MySQL Example
```diff
- import { SQLiteSessionStorage } from "@shopify/shopify-app-session-storage-sqlite";
+ import { MySQLSessionStorage } from "@shopify/shopify-app-session-storage-mysql";

sessionStorage:
  process.env.NODE_ENV === "production"
    ? MySQLSessionStorage.withCredentials(
        process.env.DATABASE_HOST,
        process.env.DATABASE_SESSION,
        process.env.DATABASE_USER,
        process.env.DATABASE_PASSWORD,
        { connectionPoolLimit: 100 }
      )
    : new SQLiteSessionStorage(DB_PATH),
```

#### PostgreSQL Example
```diff
+ import { PostgreSQLSessionStorage } from "@shopify/shopify-app-session-storage-postgresql";

sessionStorage: PostgreSQLSessionStorage.withCredentials(
  process.env.DATABASE_HOST,
  process.env.DATABASE_SESSION,
  process.env.DATABASE_USER,
  process.env.DATABASE_PASSWORD
);
```

</details>

<details>
<summary>How to call external APIs?</summary>

Always call APIs from the server and forward responses to the frontend:

```javascript
app.get("/api/external-api", async (_req, res) => {
  try {
    const response = await fetch("https://dummyjson.com/products", { method: "GET" });
    if (response.ok) {
      res.status(200).send(await response.json());
    } else {
      res.status(500).send({ error: "Failed to fetch data" });
    }
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});
```

</details>

<details>
<summary>How to resolve CORS errors?</summary>

- Verify configuration in `shopify.<your_app>.toml`.
- Ensure the dev domain matches the preview URL.
- Run `npm run dev:reset` to reset the config, then `npm run deploy` to push changes.

</details>

<details>
<summary>How to update my scopes?</summary>

1. Update the `scopes` in your `.toml` file. See [Shopify Access Scopes](https://shopify.dev/docs/api/usage/access-scopes).
2. Run `npm run deploy`.
3. Uninstall and reinstall the app in the Shopify admin dashboard.

</details>

---

## Screenshots

![Screenshot](https://drive.google.com/uc?id=1p32XhaiVRQ9eSAmNQ1Hk2T-V5hmb9CFa)

![Screenshot](https://drive.google.com/uc?id=1yCr3lc3yqzgyV3ZiTSJjlIEVPtNY27LX)

---

## App Submission

Built an app using this template? Submit it here: [App submission form](https://forms.gle/K8VGCqvcvfBRSug58).

