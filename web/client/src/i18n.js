import { nextTick } from 'vue'
import { createI18n } from 'vue-i18n'
import en from './locales/en.json'
import zh from './locales/zh.json'
import { appBridge } from './plugins/appBridge'

export const SUPPORT_LOCALES = ['en', 'zh']

export function setupI18n(options) {
  const i18n = createI18n(options)
  setI18nLanguage(i18n, options.locale)
  return i18n
}

/**
 * @param {import("vue-i18n").I18n<any, any, any, string, true> | import("vue-i18n").I18n<any, any, any, string, false>} i18n
 * @param {string} locale
 */
export function setI18nLanguage(i18n, locale) {
  if (typeof i18n.global.locale === 'object') {
    i18n.global.locale.value = locale
  } else {
    i18n.global.locale = locale
  }
  localStorage.setItem('app_locale', locale)
  document.querySelector('html').setAttribute('lang', locale)
}

/**
 * @param {import("vue-i18n").I18n<any, any, any, string, true> | import("vue-i18n").I18n<any, any, any, string, false>} i18n
 * @param {string} locale
 */
export async function loadLocaleMessages(i18n, locale) {
  // load locale messages with dynamic import
  const messages = await import(
    /* webpackChunkName: "locale-[request]" */ `./locales/${locale}.json`
  )

  // set locale and locale message
  i18n.global.setLocaleMessage(locale, messages.default)

  return await nextTick()
}

export const i18n = setupI18n({
  locale: localStorage.getItem('app_locale') || appBridge?.config?.locale || 'en',
  messages: {
    en, // Remove line for lazy loading
    zh
  },
  fallbackLocale: localStorage.getItem('app_locale') || appBridge?.config?.locale || 'en',
  legacy: false
})
