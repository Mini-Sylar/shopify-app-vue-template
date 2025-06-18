import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AboutView from '../views/AboutView.vue'
import { setI18nLanguage, SUPPORT_LOCALES, loadLocaleMessages, i18n } from '@/i18n'
import ExitIframe from '../views/ExitIframe.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/:locale?',
      children: [
        {
          path: '',
          name: 'home',
          component: HomeView
        },
        {
          path: 'about',
          name: 'about',
          component: AboutView
        }
      ]
    },
    {
      path: '/exitiframe',
      name: 'exitiframe',
      component: ExitIframe
    },
    {
      path: '/pathMatch(.*)',
      component: () => import('../views/NotFoundView.vue')
    }
  ]
})

// i18n navigation guard
router.beforeEach(async (to, _from, next) => {
  const paramsLocale = Array.isArray(to.params.locale)
    ? (to.params.locale[0] as (typeof SUPPORT_LOCALES)[number])
    : (to.params.locale as (typeof SUPPORT_LOCALES)[number])
  const locale =
    localStorage.getItem('app_locale') || i18n.global.locale || i18n.global.fallbackLocale
  // use locale if paramsLocale is not in SUPPORT_LOCALES
  if (!SUPPORT_LOCALES.includes(paramsLocale)) {
    return next(`/${locale}`)
  }

  // load locale messages
  await loadLocaleMessages(i18n, paramsLocale)

  // set i18n language
  setI18nLanguage(i18n, paramsLocale)
  return next()
})

export default router
