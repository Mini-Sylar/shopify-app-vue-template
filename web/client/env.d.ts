/// <reference types="vite/client" />
/// <reference types="@shopify/app-bridge-types" />

interface ImportMetaEnv {
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare const APP_VERSION: string
