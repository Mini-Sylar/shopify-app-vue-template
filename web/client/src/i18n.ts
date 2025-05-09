import { nextTick } from 'vue'
import { createI18n, type I18n, type I18nOptions } from 'vue-i18n'
import en from './locales/en.json'

import { appBridge } from './plugins/appBridge'

export const SUPPORT_LOCALES = ['en', 'zh']
export type SupportLocales = (typeof SUPPORT_LOCALES)[number]
export type MessageSchema = typeof en

function setupI18n(
  options: I18nOptions = {
    locale: localStorage.getItem('app_locale') || appBridge.config.locale || 'en'
  }
) {
  const i18n = createI18n(options)
  if (options.locale) {
    setI18nLanguage(i18n, options.locale)
  }
  return i18n
}

export function setI18nLanguage(i18n: I18n, locale: SupportLocales) {
  if (typeof i18n.global.locale === 'object') {
    i18n.global.locale.value = locale
  } else {
    i18n.global.locale = locale
  }
  localStorage.setItem('app_locale', locale)
  document.querySelector('html')?.setAttribute('lang', locale)
}

export async function loadLocaleMessages(i18n: I18n, locale: SupportLocales) {
  // load locale messages with dynamic import
  const messages = await import(
    /* webpackChunkName: "locale-[request]" */ `./locales/${locale}.json`
  )
  // set locale and locale message
  i18n.global.setLocaleMessage(locale, messages.default)

  return nextTick()
}

export const i18n = setupI18n({
  fallbackLocale: 'en',
  locale: localStorage.getItem('app_locale') || appBridge.config.locale || 'en',
  messages: {
    en
  }
})
