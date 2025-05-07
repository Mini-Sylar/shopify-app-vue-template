import { Request } from 'express'

interface LocalePreferences {
  user_preferred_language: string | null
  browser_language: string | null
  secondary_language: string | null
  tertiary_language: string | null
}

export function getLocalePreferencesFromRequest(request: Request): LocalePreferences {
  const acceptLang = request.headers['accept-language'] || ''
  const languages = acceptLang.split(',').map((lang) => lang.trim())
  return {
    user_preferred_language: languages[0] || null,
    browser_language: languages[1] || null,
    secondary_language: languages[2] || null,
    tertiary_language: languages[3] || null
  }
}
