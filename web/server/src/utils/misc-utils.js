/**
 *
 * @param {Request} request
 * @returns  {{user_preferred_language: string, browser_language: string, secondary_language: string, tertiary_language: string}}
 */

export function getLocalePreferencesFromRequest(request) {
  const acceptLang = request.headers.get('accept-language')
  const languages = acceptLang.split(',').map((lang) => lang.trim())
  return {
    user_preferred_language: languages[0] || null,
    browser_language: languages[1] || null,
    secondary_language: languages[2] || null,
    tertiary_language: languages[3] || null
  }
}
