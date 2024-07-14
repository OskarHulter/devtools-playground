// @ts-check

/** @type {import('next-i18next').UserConfig} */
module.exports = {
  // https://www.i18next.com/overview/configuration-options#logging
  debug: process.env.NODE_ENV === 'development',
  trailingSlash: true,
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'es'],
  },
  fallbackLng: {
    default: ['en'],
    'de-CH': ['fr'],
  },
  nonExplicitSupportedLngs: true,
  // de, fr and en will be loaded as fallback languages for de-CH
  reloadOnPrerender: process.env.NODE_ENV === 'development',
  
  /** To avoid issues when deploying to some paas (vercel...) */
  localePath:
    typeof window === 'undefined'
      ? require('node:path').resolve('./public/locales')
      : '/locales',
  /**
   * @link https://github.com/i18next/next-i18next#6-advanced-configuration
   */
  // saveMissing: false,
  // strictMode: true,
  // serializeConfig: false,
  // react: { useSuspense: false }
}
