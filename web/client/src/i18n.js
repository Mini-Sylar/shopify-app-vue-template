import { nextTick } from 'vue'
import { createI18n } from 'vue-i18n'
import en from './locales/en.json'
import zh from './locales/zh.json'

export const SUPPORT_LOCALES = ['en', 'zh']

export function setupI18n(options = { locale: localStorage.getItem('app_locale') || 'en' }) {
  const i18n = createI18n(options)
  setI18nLanguage(i18n, options.locale)
  return i18n
}

export function setI18nLanguage(i18n, locale) {
  i18n.global.locale.value = locale
  localStorage.setItem('app_locale', locale)
  /**
   * NOTE:
   * The locale is passed to useAuthenticatedFetch.js to set the Accept-Language header, you can configure the headers in the useAuthenticatedFetch.js file.
   */
  document.querySelector('html').setAttribute('lang', locale)
}

export async function loadLocaleMessages(i18n, locale) {
  // load locale messages with dynamic import
  const messages = await import(`./locales/${locale}.json`)

  // set locale and locale message
  i18n.global.setLocaleMessage(locale, messages.default)

  return await nextTick()
}

export const i18n = setupI18n({
  locale:
    localStorage.getItem('app_locale') ||
    new URLSearchParams(window.location.search).get('locale') ||
    'en',
  messages: {
    en,
    zh
  },
  fallbackLocale: localStorage.getItem('app_locale') || 'en',
  legacy: false
})
