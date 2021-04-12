const withPWA = require('next-pwa')
const runtimeCaching = require('next-pwa/cache')
const nextTranslate = require('next-translate')

module.exports = nextTranslate(
  withPWA({
    pwa: {
      // disable: process.env.NODE_ENV === 'development',
      disable: true,
      dest: 'public',
      runtimeCaching,
    },
    i18n: {
      locales: ['en'],
      defaultLocale: 'en',
    },
  }),
)
