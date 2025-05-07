/// <reference types="vite/client" />
/// <reference types="@shopify/app-bridge-types" />

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface ImportMetaEnv {
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare const APP_VERSION: string
