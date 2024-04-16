import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { setI18nLanguage, SUPPORT_LOCALES, loadLocaleMessages } from '@/i18n'
import { i18n } from '@/main'

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
          // lazy load your component
          component: () => import('../views/AboutView.vue')
        }
      ]
    },
    {
      path: '/exitiframe',
      name: 'exitiframe',
      component: () => import('../views/ExitIframeView.vue'),
      redirect: { name: 'home' }
    }
  ]
})

// i18n navigation guard
router.beforeEach(async (to, _from, next) => {
  const paramsLocale = to.params.locale
  const locale = i18n.global.locale
  // use locale if paramsLocale is not in SUPPORT_LOCALES
  if (!SUPPORT_LOCALES.includes(paramsLocale)) {
    return next(`/${locale}`)
  }

  // load locale messages
  if (!i18n.global.availableLocales.includes(paramsLocale)) {
    await loadLocaleMessages(i18n, paramsLocale)
  }

  // set i18n language
  setI18nLanguage(i18n, paramsLocale)
  return next()
})

export default router
